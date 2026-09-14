import { db } from "@/lib/db/db"
import { WorkflowGraph, workflows } from "@/lib/db/schema"
import { validateGraph } from "@/lib/validate-graph"
import { and, desc, eq } from "drizzle-orm"

export const getWorkflow = async (orgId: string) => {
  const data = await db
    .select()
    .from(workflows)
    .where(eq(workflows.orgId, orgId))
    .orderBy(desc(workflows.createdAt))
  return data
}

export const getSingleWorkflow = async ({
  orgId,
  id,
}: {
  orgId: string
  id: string
}) => {
  const [data] = await db
    .select()
    .from(workflows)
    .where(and(eq(workflows.orgId, orgId), eq(workflows.id, id)))
    .limit(1)
  return data
}

export const createWorkflow = async (orgId: string, name: string) => {
  const [workflow] = await db
    .insert(workflows)
    .values({
      orgId,
      name,
    })
    .returning()
  return workflow
}

export const deleteWorkflow = async (orgId: string, id: string) => {
  const [data] = await db
    .delete(workflows)
    .where(and(eq(workflows.orgId, orgId), eq(workflows.id, id)))
    .returning()
  return data
}

export const saveWorkflowGraph = async ({
  orgId,
  id,
  graph,
}: {
  orgId: string
  id: string
  graph: WorkflowGraph
}) => {
  const problems = validateGraph(graph)
  if (problems.length > 0) throw new Error(problems.join(" "))
  await db
    .update(workflows)
    .set({ graph })
    .where(and(eq(workflows.id, id), eq(workflows.orgId, orgId)))
    .returning()
}
