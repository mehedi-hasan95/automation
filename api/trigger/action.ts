"use server"

import { tasks } from "@trigger.dev/sdk"
import type { helloWorldTask } from "@/trigger/example"
import { auth } from "@clerk/nextjs/server"

export async function runWorkflowAction(workflowId: string) {
  const { orgId } = await auth()
  if (!orgId) {
    throw new Error("No active organization")
  }
  const handle = await tasks.trigger<typeof helloWorldTask>("hello-world", {
    message: "Hello from right sidebar",
  })
  return handle
}
