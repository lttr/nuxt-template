import { mkdirSync } from "node:fs"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { useRuntimeConfig } from "nuxt/server"
import * as schema from "./schema"

let instance: ReturnType<typeof createDb> | undefined

function createDb() {
  const url = useRuntimeConfig().dbUrl
  if (url.startsWith("file:.data/")) mkdirSync(".data", { recursive: true })
  return drizzle(createClient({ url }), { schema })
}

export function useDb() {
  instance ??= createDb()
  return instance
}

export { schema }
