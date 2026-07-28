Overview:
```
React
  ↓
Supabase Client
  ↓
PostgREST
  ↓
PostgreSQL
```
The basic pathways into PostgreSQL are either:
```
React → Supabase Client → PostgREST → PostgreSQL
 OR
React → Edge Function → PostgreSQL
```
Authenticated user requests carry the JWT session. Edge Functions may execute privileged database operations using server-side credentials (service role keys) after validating the requesting user's identity and permissions.

```
Browser
  │
  ├ HTTPS
  │
React Application (Frontend)
  │
  ├ E-mail / password
  │
  ├── Supabase Auth (GoTrue) ── returns JWT session
  │                               │
  Authenticated session  ─────────┘
  │
  └─────┬───────────────────────────┐
    Edge Functions              Supabase Client
   (server-side Deno)          (Frontend library)
        │                           │
        │                       PostgREST API
        │                           │
    PostgreSQL Database ────────────┘
        │
        ├ Tables
        ├ RLS Policies
        ├ Functions
        └ Audit Logs
```
