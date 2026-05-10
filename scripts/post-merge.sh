#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Remove legacy guest rows (userId = NULL) before enforcing NOT NULL on the column.
# These rows were created before authentication became mandatory and are no longer
# accessible to any user. Must run before push-force so the constraint can be applied.
psql "$DATABASE_URL" -c "DELETE FROM interview_sessions WHERE user_id IS NULL;"
psql "$DATABASE_URL" -c "DELETE FROM completed_interviews WHERE user_id IS NULL;"
# Apply any schema changes, including structural changes (PK, nullable columns).
# --force is safe here because drizzle-kit push validates changes before applying.
pnpm --filter db push-force
# Rebuild lib TypeScript declarations so generated types are in sync with schema.
pnpm exec tsc --build lib/api-zod lib/db lib/api-client-react
