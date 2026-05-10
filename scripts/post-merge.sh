#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Apply any schema changes, including structural changes (PK, nullable columns).
# --force is safe here because drizzle-kit push validates changes before applying.
pnpm --filter db push-force
# Rebuild lib TypeScript declarations so generated types are in sync with schema.
pnpm exec tsc --build lib/api-zod lib/db lib/api-client-react
