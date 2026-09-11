import React from "react"
import { WorkflowShell } from "./_components/workflowShell"
import { Room } from "./_components/room"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { liveblocks } from "@/lib/liveblocks"
import { getSingleWorkflow } from "@/api/workflows"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WorkflowPage({ params }: PageProps) {
  const { id } = await params

  const { orgId } = await auth()
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
  return (
    <div className="flex h-svh w-full flex-col">
      <Room orgId={id}>
        <WorkflowShell workflowId={id} />
      </Room>
    </div>
  )
}
