-- Fixed-window rate limiter backing the register-account Edge Function.
-- See docs/architecture/rate-limiter.md for the design.

CREATE TABLE public.rate_limit_counters (
  action       text        NOT NULL,
  bucket_key   text        NOT NULL,
  window_start timestamptz NOT NULL,
  attempts     integer     NOT NULL DEFAULT 0,
  PRIMARY KEY (action, bucket_key)
);

-- auto_expose_new_tables would otherwise expose this through PostgREST.
REVOKE ALL ON public.rate_limit_counters FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.rate_limit_take(
  p_action         text,
  p_key            text,
  p_limit          integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_window   timestamptz;
  v_attempts integer;
BEGIN
  IF p_limit < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'rate_limit_take requires a positive limit and window';
  END IF;

  -- Snap now() to the start of the current fixed window.
  v_window := to_timestamp(
    floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds
  );

  INSERT INTO public.rate_limit_counters AS c (action, bucket_key, window_start, attempts)
  VALUES (p_action, p_key, v_window, 1)
  ON CONFLICT (action, bucket_key) DO UPDATE
    SET window_start = EXCLUDED.window_start,
        attempts = CASE
          WHEN c.window_start < EXCLUDED.window_start THEN 1  -- new window: reset
          ELSE c.attempts + 1                                 -- same window: count
        END
  RETURNING c.attempts INTO v_attempts;

  RETURN v_attempts <= p_limit;
END;
$$;

-- Only the service-role Edge Function may take tokens.
REVOKE ALL ON FUNCTION public.rate_limit_take(text, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.rate_limit_take(text, text, integer, integer) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rate_limit_take(text, text, integer, integer) TO service_role;

-- Prune stale counters (hygiene only — a stale row self-resets on next use,
-- so correctness never depends on this job). Requires the pg_cron extension.
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'prune-rate-limits',
  '7 * * * *',
  $$
    DELETE FROM public.rate_limit_counters
    WHERE window_start < now() - interval '24 hours'
  $$
);
