# AGENTS.md

## Project

Elite Football Centre (Maribyrnong) facility management system. Two-part codebase:
- `app/` — React + TypeScript + Vite frontend
- `supabase/` — Deno Edge Functions (server-side business logic)

No root `package.json` or monorepo tooling. Each part is independent.

## Commands

All app commands run from `app/`:

```bash
cd app
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint .
```

No test runner is configured yet. No CI workflows exist.

## Conventions

- **TypeScript**: `verbatimModuleSyntax` is on — use `import type` for type-only imports.
- **ESLint**: flat config (`app/eslint.config.js`), TypeScript + React Hooks + React Refresh plugins.
- **Supabase Edge Functions**: shared code lives in `supabase/functions/shared/` (errors, responses, validation). Import from there, don't duplicate.
- **Database schema**: authoritatively documented in `docs/database/data-dictionary.md`. Table design choices (e.g. `persons` as identity anchor, `team_members` history pattern) are deliberate — read the dictionary before modifying schemas.

## Frontend structure

- **Shell**: `app/src/App.tsx` owns the shared layout (background, header/logo/nav, footer) and all routes via `react-router-dom` (`BrowserRouter`). Page components in `app/src/pages/` render `<main className="content">` and are dropped into the shared shell.
- **Styling**: everything lives in the single `app/src/App.css` stylesheet (no CSS modules). Layout is fluid — `clamp()` for fluid sizing, media queries at `850px`/`480px`/`360px`, `hero-split` two-column rows that stack below `1120px`. Keep new pages consistent with these classes rather than adding bespoke ones.
- **Components**: reusable primitives in `app/src/components/` (`Button`, `Card`, `TextInput`, `Select`, `DateInput`, `Checkbox`, `ErrorMessage`) emit BEM-style classes (`btn`, `field__input`, `card__header`) that are styled centrally in `App.css`.

## Architecture

Two data paths into PostgreSQL:
1. React → Supabase Client → PostgREST → PostgreSQL (simple CRUD)
2. React → Edge Function → PostgreSQL (business workflows, privileged ops)

Edge Functions use service-role keys after validating the requesting user's identity via JWT.

## Gotchas

- Many files are empty stubs (components, edge functions, docs). This is expected — the project is in early development. `supabase/functions/*/index.ts` are empty; `shared/` (`errors.ts`, `responses.ts`, `validation.ts`) has the helpers to build on.
- The login forms on `/` and `/academy` are demo-only (client-side state, no Supabase wiring yet). The app has no `.env` config; Supabase URL + anon key are not yet wired (see TODO).
- The `app/` directory was scaffolded from the Vite React-TS template — `app/README.md` is boilerplate, not project documentation.
- Contact form, Academy booking cards, and Players video cards use the `Card` component — its BEM styles (`.card`, `.card__header`, etc.) live in `App.css`.
- `BrowserRouter` is used — client-side routes need an SPA rewrite on any static host (Vercel).

## Deployment (planned)

Demo will deploy to Vercel via GitHub auto-deploy of the `app/` directory. Required before it works:
1. `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` — `BrowserRouter` paths won't resolve without it — and `rootDirectory: "app"`.
2. Env config for Supabase URL + anon key when auth is wired.

Not created yet — tracked in `TODO.md`. Supabase Edge Functions deploy to Supabase, not Vercel.
