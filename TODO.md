# TODO

### The Vertical Slice

```
React: Registration Page  
    ↓  
Input Validation  
    ↓  
JSON Payload  
    ↓  
Edge Function  
    ↓  
Supabase Auth  
    ↓  
PostgreSQL  
    ↓  
Success Response  
```

## Registration Workflow

- [x] `register-account`: create Supabase Auth user — password posted, `persons.auth_user_id` linked, auth user rolled back on failure
- [x] Persist child `date_of_birth`; remove `ageGroup` and Program from the registration form/contract
- [x] Provision parent + all children atomically via the `register_account` RPC (`0003_register_account.sql`)
- [x] Terms checkbox wired into the payload (`name="terms"`) with client-side validation; HIBP breached-password gate removed
- [x] Rate limiter — fixed-window buckets in Postgres (`0006_rate_limit.sql`), wired into `register-account`; see `docs/architecture/rate-limiter.md`

## Authentication

Done: Supabase client + env wired (`app/.env`), `AuthProvider` (session + person + roles), `useAuth`, `RequireAuth`/`RequireRole` components, real login on `/` (`signInWithPassword`), Register password field posting to `register-account`, Forgot/Reset password pages, Log out button in header.

Blocked until front/back contracts are verified (another agent checking that first).

Remaining frontend work (deferred — gates would block `/portal` preview during development):

- [ ] Re-wrap the `/portal` route in `<RequireAuth>` — the gate is currently removed in `app/src/App.tsx` so the portal can be previewed without logging in
- [ ] Filter `PORTAL_NAV` sections by role in `PortalLayout` (hide Staff/Team Manager/Administrator groups the viewer lacks; `roles: []` = every signed-in member)
- [ ] Wrap privileged section routes in `RequireRole roles={section.roles}` when `roles` is non-empty
- [ ] Login redirect polish — `RequireAuth` already saves `state.from`; make Home's login `navigate(from ?? "/academy")` so users land back where they headed
- [ ] Enforce roles server-side (RLS policies + Edge Function checks); client visibility is UX only

## Player Management

- [ ] Player profile view
- [ ] Edit player details
- [ ] Parent relationship management

## Deployment

- [ ] Vercel demo page via GitHub auto-deploy (deploys the `app/` directory)
- [ ] Set up Vercel project in dashboard — **Root Directory = `app`**, SPA rewrite `/(.*)` → `/index.html` (do NOT use a `vercel.json` with `rootDirectory`; it errors on import)

## Next Up

- [ ] Delete unused pictures from `.media-scratch/` (tidy the media archive)
- [ ] Add automated tests
- [ ] Improve error logging
- [ ] Add API documentation
