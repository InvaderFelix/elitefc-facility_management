# Rate Limiter

`register-account` is a public endpoint (deployed with JWT verification off), so abuse
is throttled by a fixed-window limiter held in PostgreSQL rather than by a gateway or
CAPTCHA. Database state means every edge isolate shares one clock and survives cold
starts. **Status: implemented — migration `0006` applied via `supabase db push`,
Edge Function deployed with `--no-verify-jwt`.**

## Flow

```
BROWSER                    EDGE FUNCTION                       POSTGRES / SUPABASE
Register.tsx               register-account/index.ts
    |                   |
    | POST /functions/v1/register-account
    |-------------------|
    |                   |  validateRegistration()
    |                   |   shared/validation.ts
    |                   |   rate_limit_take() ---------------> rate_limit_counters
    |                   |                                      0006_rate_limit.sql
    |                   |- bucket denied -->
    |                   |    tooManyRequests()  [shared/errors.ts]
    |<------------------|    429  { success: false, error: {...} }
    |                   |    jsonError()  [shared/responses.ts]
    |                   |
    |                   |- buckets allowed -->
    |                   |    duplicate check ----------------> contacts
    |                   |    auth.admin.createUser() --------> Supabase Auth
    |                   |    register_account() RPC ---------> 0003_register_account.sql
    |<------------------|    200  { success: true, data: {...} }
    v
  banner shows error.message — Register.tsx needs no change for the 429
```

## Buckets

| Action | Key | Limit | Window | Protects against |
| --- | --- | --- | --- | --- |
| register-ip | `ip:<rightmost x-forwarded-for>` | 10 | 600s | mass sign-ups from one source |
| register-email | `email:<validated email>` | 3 | 3600s | retry floods against one address |

Limits are constants at the top of `register-account/index.ts`. The IP limit stays
generous because offices, schools and mobile carriers share addresses (CGNAT); the
per-email limit is the precise one.

## Request steps

1. validateRegistration() runs first — malformed payloads are rejected in
   `shared/validation.ts` and never reach the limiter, so garbage cannot consume
   tokens or pollute counters.
2. Keys are derived: the email (already lowercased by validation) and the client IP
   from the rightmost entry of `x-forwarded-for` — leftmost entries are
   client-spoofable.
3. The Edge Function calls rate_limit_take() through its service-role client: IP
   bucket first, then email. The RPC atomically upserts the key's row, bumps
   attempts, and returns `boolean = true while attempts <= p_limit`.
4. A denied bucket throws tooManyRequests() (a 429 factory in
   `shared/errors.ts`), serialised by jsonError() in shared/responses.ts as
   `{ success: false, error: { message, code: "RATE_LIMITED" } }`.
5. Register.tsx needs no change: it already shows `error.message` in the form
   banner.

## Table and RPC

```sql
-- 0006_rate_limit.sql
CREATE TABLE public.rate_limit_counters (
  action       text        NOT NULL,
  bucket_key   text        NOT NULL,
  window_start timestamptz NOT NULL,
  attempts     integer     NOT NULL DEFAULT 0,
  PRIMARY KEY (action, bucket_key)
);
```

Core of `rate_limit_take(p_action, p_key, p_limit, p_window_seconds)`:

```sql
INSERT INTO rate_limit_counters AS c (action, bucket_key, window_start, attempts)
VALUES (p_action, p_key, v_window, 1)
ON CONFLICT (action, bucket_key) DO UPDATE
  SET window_start = EXCLUDED.window_start,
      attempts = CASE
        WHEN c.window_start < EXCLUDED.window_start THEN 1  -- new window: reset
        ELSE c.attempts + 1                                 -- same window: count
      END
RETURNING c.attempts INTO v_attempts;

RETURN v_attempts <= p_limit;
```

## Behaviour

- **Fixed window from DB time.** `window_start` is `now()` snapped to the window
  size, so all isolates agree. When the clock rolls over, the same upsert resets
  `attempts` to `1` — no scheduler is needed for correctness.
- **Take semantics.** Every attempt consumes, including denied ones; a blocked
  user's retries do not extend the block (it ends when the window does).
- **Fail open.** If `rate_limit_take()` itself errors, `index.ts` logs and
  continues — a database blip must not block registrations.
- **No IP header?** The IP bucket is skipped rather than keying everyone under one
  `unknown` bucket, which would let a single attacker lock out every visitor. The
  email bucket still applies.
- **Service-role only.** `EXECUTE` on `rate_limit_take()` is revoked from PUBLIC,
  anon, and authenticated; the table is revoked from anon and authenticated —
  required because `auto_expose_new_tables` would otherwise expose it through
  PostgREST.
- **Pruning.** An hourly `pg_cron` job (requires the `pg_cron` extension) deletes
  rows older than 24 hours. Correctness never depends on it (stale rows self-reset);
  it only bounds storage.
- **Concurrency.** `ON CONFLICT` locks the row, so parallel attempts against one
  key serialize and counts stay exact.

## Coverage

| Stops | Does not stop |
| --- | --- |
| Mass account creation from one IP | Rotation across many IPs **and** many emails |
| Retry floods against one email from many IPs | |
| Double-click / accidental resubmits | |

Distributed rotation is a CAPTCHA/Cloudflare problem; revisit if the endpoint is
actually abused.

## Files

| File | Role |
| --- | --- |
| supabase/migrations/0006_rate_limit.sql | table, `rate_limit_take()`, grants, prune job |
| supabase/functions/register-account/index.ts | limits, key derivation, bucket calls, `429` |
| supabase/functions/shared/errors.ts | `tooManyRequests()` factory |
| supabase/functions/shared/responses.ts | `429` envelope + CORS |
| app/src/pages/Register.tsx | renders `error.message` (unchanged) |
| supabase/config.toml | `[functions.register-account] verify_jwt = false` (local) |

## Deploy checklist

1. supabase db push — applies `0006_rate_limit.sql`.
2. Add tooManyRequests() to `shared/errors.ts`.
3. Wire both bucket calls into `register-account/index.ts`.
4. Add the [functions.register-account] block to `config.toml`.
5. `supabase functions deploy register-account --no-verify-jwt`.
6. Verify: call rate_limit_take() eleven times (10 allowed, 11th false, resets
   next window); loop the endpoint with `curl` expecting `429` on attempt 11; log
   `x-forwarded-for` once in staging to confirm what Supabase sends.
