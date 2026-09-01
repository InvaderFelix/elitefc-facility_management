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

## Completed

- [x] Scaffold frontend with React Router (`/`, `/academy`, `/coaches`, `/players`, `/programs`, `/contact`)
- [x] Shared shell layout (header/logo/nav, background, footer) in `App.tsx`
- [x] Reusable UI components (`Button`, `Card`, `TextInput`, `Select`, `DateInput`, `Checkbox`, `ErrorMessage`)
- [x] Uniform responsive layout — single `App.css`, fluid `clamp()` sizing, mobile stacking
- [x] Edge Function stubs + `shared/` skeleton (`errors.ts`, `responses.ts`, `validation.ts`)
- [x] `docs/` (architecture, database dictionary, decisions, workflows)
- [x] Sticky/following navbar (frosted `backdrop-filter` header)
- [x] Coach cards + lightbox rebuild — clickable portrait tiles with "View" pill, centered 60% lightbox, heavy right-edge image fade, prev/next navigation, click-anywhere/Escape/X close, no scrollbars, open/close + content transitions
- [x] Academy facility services section (real services from elitefootballcentre.com.au: pitch hire, birthday parties, gym, leagues, cafe & licensed bar, venue hire) placed above the login box, hero title pinned to the top
- [x] `vercel.json` (SPA rewrite `/(.*)` → `/index.html` + `rootDirectory: "app"`)

## Registration Workflow

- [ ] Build React registration form (route + page, parent/player fields)
- [ ] Add Zod validation schema
- [ ] Implement `register-account` Edge Function
- [ ] Map JSON payload to database inserts
- [ ] Add duplicate email checking

## Authentication

- [ ] Configure Supabase Auth
- [ ] Add protected routes
- [ ] Implement session handling

## Player Management

- [ ] Player profile view
- [ ] Edit player details
- [ ] Parent relationship management

## Deployment

- [ ] Vercel demo page via GitHub auto-deploy (deploys the `app/` directory)
- [x] Add `vercel.json` (SPA rewrite `/(.*)` → `/index.html` + `rootDirectory: "app"`)
- [x] Create a GitHub repo and connect to Vercel once auth env is configured (repo pushed to `InvaderFelix/elitefc-facility_management`; Vercel import not yet done)

## Next Up

- [ ] Wire Supabase client in the app (URL + anon key env config)
- [ ] Replace demo login gate with real auth
- [ ] Add automated tests
- [ ] Improve error logging
- [ ] Add API documentation