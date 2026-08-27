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

## Architecture

Two data paths into PostgreSQL:
1. React → Supabase Client → PostgREST → PostgreSQL (simple CRUD)
2. React → Edge Function → PostgreSQL (business workflows, privileged ops)

Edge Functions use service-role keys after validating the requesting user's identity via JWT.

## Gotchas

- Many files are empty stubs (components, edge functions, docs). This is expected — the project is in early development.
- No `.env` files are committed. Supabase URL and anon key will need to be configured locally.
- The `app/` directory was scaffolded from the Vite React-TS template — `app/README.md` is boilerplate, not project documentation.
