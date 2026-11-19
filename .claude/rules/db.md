---
paths:
  - "layers/db/**"
---

# Database layer (SQLite + Drizzle via libsql)

- Change the schema in `layers/db/server/db/schema.ts`, then `vp run db:generate` and `vp run db:migrate`. Commit the generated migration; never edit applied migrations by hand.
- Get the client with `useDb()` from `layers/db/server/db`; don't create a second client.
- The DB file lives in `.data/` (gitignored, copied into new worktrees). Override the URL with `NUXT_DB_URL`.
- Server-only: never import `layers/db/server/**` from `app/` or `shared/`.
