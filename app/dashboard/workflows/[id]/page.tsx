import React from "react"
import { WorkflowShell } from "./_components/workflowShell"
import { Room } from "./_components/room"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WorkflowPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex h-svh w-full flex-col">
      <Room orgId={id}>
        <WorkflowShell workflowId={id} />
      </Room>
    </div>
  )
}
