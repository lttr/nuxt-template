// Optional SQLite + Drizzle layer. Remove the whole `layers/db` folder (plus the
// drizzle deps and db:* scripts in package.json) if the app needs no persistence.
export default defineNuxtConfig({
  runtimeConfig: {
    // Override with NUXT_DB_URL. Each worktree gets its own copy of .data/.
    dbUrl: "file:.data/db.sqlite",
  },
  typescript: {
    nodeTsConfig: { include: ["../layers/db/drizzle.config.ts"] },
  },
})
