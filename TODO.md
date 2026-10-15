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

- [ ] `register-account`: create Supabase Auth user when a password field is added to the form (blocked until form + env config exist)
- [ ] Persist `ageGroup` / `program` from the payload (schema has no column for them yet — flag in data dictionary)

## Authentication

- [ ] Configure Supabase Auth
- [ ] Add protected routes
- [ ] Implement session handling
- [ ] Re-wrap the `/portal` route in `<RequireAuth>` — the gate is currently removed in `app/src/App.tsx` so the portal can be previewed without logging in during development
- [ ] Filter `PORTAL_NAV` sections by role (hide Staff/Team Manager/Administrator groups the viewer lacks) — currently every section renders so the full portal is previewable; also re-add `RequireRole` guards on the privileged routes
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
- [ ] Replace demo login gate with real auth
- [ ] Add automated tests
- [ ] Improve error logging
- [ ] Add API documentation
