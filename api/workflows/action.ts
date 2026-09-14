"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  createWorkflow,
  deleteWorkflow,
  saveWorkflowGraph,
} from "@/api/workflows/index"
import { liveblocks } from "@/lib/liveblocks"
import { runs, tasks } from "@trigger.dev/sdk"
import { WorkflowGraph } from "@/lib/db/schema"
import type { runWorkflowTask } from "@/trigger/run-workflow"

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

export async function runWorkflowAction({
  id,
  graph,
}: {
  id: string
  graph: WorkflowGraph
}) {
  const { orgId } = await auth()
  if (!orgId) {
    throw new Error("No active organization")
  }

  await saveWorkflowGraph({ graph, id, orgId })

  const handle = await tasks.trigger<typeof runWorkflowTask>(
    "run-workflow",
    { workflowId: id, orgId },
    { tags: [`workflow:${id}`] }
  )
  return handle
}

export const cancelWorkflowRunAction = async (runId: string) => {
  const { orgId } = await auth()
  if (!orgId) throw new Error("No active organization")

  await runs.cancel(runId)
}
