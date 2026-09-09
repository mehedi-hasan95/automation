"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createWorkflow } from "@/api/workflows/index"

export const createWorkflowAction = async (name: string) => {
  if (!name) {
    throw new Error("Name is required")
  }

  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("Active organization not found")
  }

  const workflow = await createWorkflow(orgId, name)

  revalidatePath("/", "layout")
  redirect(`/dashboard/workflows/${workflow.id}`)
}
