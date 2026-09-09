import { jsonb, snakeCase, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const workflows = snakeCase.table("workflows", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: text().notNull(),
  name: text().notNull(),
  graph: jsonb(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export type workflowType = typeof workflows.$inferSelect
