# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Vercel Deployment

The root `vercel.json` builds the full stack and serves the React SPA from `artifacts/majormind/dist/public`, with `/api/*` routed to the Express serverless handler at `api/index.mjs`.

### Required environment variables (set in Vercel project dashboard)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgres://user:pass@host/db`) |
| `OPENAI_API_KEY` | OpenAI API key used for AI interview responses (set as `AI_INTEGRATIONS_OPENAI_API_KEY` in Replit) |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key — actual env var name the codebase reads |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI base URL (e.g. `https://api.openai.com/v1`) |
| `SESSION_SECRET` | Secret used to sign session cookies — set to a long random string |
| `REPL_ID` | Replit app ID used by the OIDC auth flow (find it in the Replit workspace URL) |
| `ISSUER_URL` | OIDC issuer — defaults to `https://replit.com/oidc` if not set |
| `ADMIN_TOKEN` | Secret token protecting admin routes (set to any strong random string) |

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
