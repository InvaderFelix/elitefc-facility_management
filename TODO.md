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
- [x] Contact page fixes — panels stack below 850px (`main .contact-layout` specificity fix), login-push callout banner
- [x] Scrape media from elitefootballcentre.com.au into `.media-scratch/` (54 images, 5 player videos, raw page HTML); copy key images into `app/public/assets/img/`
- [x] Academy services cards — equal-height deck (fixed header/muted slots, `grid-auto-rows`), 2-column grid, TEMP faded photo backgrounds, layered text-shadows for readability
- [x] Register page (`/register`) — parent/guardian + first-player form, demo submit with success message; "Join the Academy →" links retargeted from `/academy` to `/register`
- [x] Service card click-to-expand — darken overlay over the (unchanged-size) card with centered action buttons (Log in / Register / Enquire), close on click outside a button, keyboard accessible (Enter/Space)
- [x] Scroll-to-top on route change (`ScrollToTop` in `App.tsx`) — login cards stay visible when arriving at `/` or `/academy`
- [x] `vercel.json` created then deleted by design — Vercel dashboard errors when `rootDirectory` is inside `vercel.json`; set **Root Directory = `app`** + SPA rewrite `/(.*)` → `/index.html` in the dashboard instead

## Registration Workflow

- [x] Build React registration form (route + page, parent/player fields)
- [x] Add Zod validation schema (`shared/validation.ts` — Zod v4, `npm:zod@4`)
- [x] Implement `register-account` Edge Function
- [x] Map JSON payload to database inserts (persons → contacts → addresses → relationship → player_profiles → player_registrations)
- [x] Add duplicate email checking
- [ ] `register-account`: create Supabase Auth user when a password field is added to the form (blocked until form + env config exist)
- [ ] Persist `ageGroup` / `program` from the payload (schema has no column for them yet — flag in data dictionary)

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
- [ ] Set up Vercel project in dashboard — **Root Directory = `app`**, SPA rewrite `/(.*)` → `/index.html` (do NOT use a `vercel.json` with `rootDirectory`; it errors on import)
- [x] Create a GitHub repo and connect to Vercel once auth env is configured (repo pushed to `InvaderFelix/elitefc-facility_management`; Vercel import not yet done)

## Next Up

- [ ] Delete unused pictures from `.media-scratch/` (tidy the media archive)
- [x] Rename the Academy card background images to descriptive names (`facility-6`→`pitch-hire`, `training-action`→`leagues`, `preacademy-action`→`birthday`, `facility-2`→`venue`, `facility-8`→`gym`, `banner-cafe`→`cafe`) — updated `App.css` URLs accordingly
- [x] Remove junk `:Zone.Identifier` files from `app/public/assets/img/` (12 files, Windows download artifacts)
- [x] Wire Supabase client in the app (`app/.env` gitignored + `app/.env.example`, `src/lib/supabase.ts`, `@supabase/supabase-js`) — placeholder URL/anon key, fill in real values once the project exists
- [ ] Replace demo login gate with real auth
- [ ] Add automated tests
- [ ] Improve error logging
- [ ] Add API documentation