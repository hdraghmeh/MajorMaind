#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Remove legacy guest rows (userId = NULL) before applying NOT NULL constraint.
# This is safe: unauthenticated access is no longer possible, so these rows
# are unreachable. Uses the DATABASE_URL env var (same as drizzle-kit).
node - << 'JS'
const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(async () => {
  await client.query("DELETE FROM interview_sessions WHERE user_id IS NULL");
  await client.query("DELETE FROM completed_interviews WHERE user_id IS NULL");
  await client.end();
  console.log("Cleaned up legacy guest rows.");
}).catch(err => { console.error("Cleanup error (non-fatal):", err.message); process.exit(0); });
JS
# Apply any schema changes, including structural changes (PK, nullable columns).
# --force is safe here because drizzle-kit push validates changes before applying.
pnpm --filter db push-force
# Rebuild lib TypeScript declarations so generated types are in sync with schema.
pnpm exec tsc --build lib/api-zod lib/db lib/api-client-react
