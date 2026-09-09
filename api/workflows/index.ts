import { db } from "@/lib/db/db"
import { workflows } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

export const getWorkflow = async (orgId: string) => {
  const data = await db
    .select()
    .from(workflows)
    .where(eq(workflows.orgId, orgId))
    .orderBy(desc(workflows.createdAt))
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
