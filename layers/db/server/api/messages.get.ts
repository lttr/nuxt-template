import { desc } from "drizzle-orm"
import { defineEventHandler } from "nuxt/server"
import { schema, useDb } from "../db"

export default defineEventHandler(() =>
  useDb().select().from(schema.messages).orderBy(desc(schema.messages.createdAt)).limit(20),
)
