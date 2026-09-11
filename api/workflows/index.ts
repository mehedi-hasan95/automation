import { db } from "@/lib/db/db"
import { workflows } from "@/lib/db/schema"
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
