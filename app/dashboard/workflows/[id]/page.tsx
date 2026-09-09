import React from "react"
import { WorkflowShell } from "./_components/workflowShell"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WorkflowPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex h-svh w-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-2xl font-bold">Workflow ID: {id}</h1>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <WorkflowShell workflowId={id} />
        </div>
      </div>
    </div>
  )
}
