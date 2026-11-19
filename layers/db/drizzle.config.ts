import { mkdirSync } from "node:fs"
import { defineConfig } from "drizzle-kit"

// Part of the optional layers/db add-on.
mkdirSync(".data", { recursive: true })

export default defineConfig({
  dialect: "sqlite",
  schema: "./layers/db/server/db/schema.ts",
  out: "./layers/db/server/db/migrations",
  dbCredentials: { url: process.env.NUXT_DB_URL ?? "file:.data/db.sqlite" },
})
