"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createWorkflow, deleteWorkflow } from "@/api/workflows/index"
import { liveblocks } from "@/lib/liveblocks"

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

export const deleteWorkflowAction = async (workflowId: string) => {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("Active organization not found")
  }

  // Remove from database
  const workflow = await deleteWorkflow(orgId, workflowId)
  if (!workflow) {
    throw new Error("Active organization not found")
  }
  // Remove Liveblocks room
  try {
    await liveblocks.deleteRoom(workflowId)
  } catch (e) {
    console.error("Failed to delete Liveblocks room:", e)
    // We don't throw here because the DB deletion is the primary source of truth
  }

  revalidatePath("/dashboard", "layout")
  redirect("/dashboard")
}
