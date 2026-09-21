import React from "react"
import { WorkflowShell } from "./_components/workflowShell"
import { Room } from "./_components/room"
import { auth as clerkAuth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { liveblocks } from "@/lib/liveblocks"
import { getSingleWorkflow } from "@/api/workflows"
import { ReactFlowProvider } from "@xyflow/react"
import { auth } from "@trigger.dev/sdk"
import { WorkflowRunsProvider } from "./_components/others/workflow-runs-provider"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WorkflowPage({ params }: PageProps) {
  const { id } = await params

  const { orgId } = await clerkAuth()
  if (!orgId) notFound()

  const data = await getSingleWorkflow({ orgId, id })
  if (!data) notFound()

  await liveblocks.getOrCreateRoom(id, {
    organizationId: orgId,
    defaultAccesses: [],
    groupsAccesses: {
      [orgId]: ["room:write"],
    },
    metadata: { title: data.name },
  })

  const publicToken = await auth.createPublicToken({
    scopes: {
      read: {
        tags: [`workflow:${id}`],
      },
    },
    expirationTime: "1hr",
  })

  return (
    <div className="flex h-svh w-full flex-col">
      <Room orgId={id}>
        <ReactFlowProvider>
          <WorkflowRunsProvider
            workflowId={id}
            publicAccessToken={publicToken}
          >
            <WorkflowShell workflowId={id} />
          </WorkflowRunsProvider>
        </ReactFlowProvider>
      </Room>
    </div>
  )
}
