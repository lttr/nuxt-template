import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const messages = sqliteTable("messages", {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull(),
  body: text().notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
})
