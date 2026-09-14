import { StepNodeType } from "@/app/dashboard/workflows/[id]/_components/node/node-registry"
import { Edge } from "@xyflow/react"
import { jsonb, snakeCase, text, timestamp, uuid } from "drizzle-orm/pg-core"

export type WorkflowGraph = { nodes: StepNodeType[]; edge: Edge[] }
export const workflows = snakeCase.table("workflows", {
  id: uuid().primaryKey().defaultRandom(),
  orgId: text().notNull(),
  name: text().notNull(),
  graph: jsonb().$type<WorkflowGraph>(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export type workflowType = typeof workflows.$inferSelect
