"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { DashboardRight } from "./dashboard-right"
import { CanvasSidebar } from "./canvas-sidebar"

interface Props {
  workflowId: string
}
export function WorkflowShell({ workflowId }: Props) {
  return (
    <ResizablePanelGroup orientation="horizontal" className="rounded-lg border">
      <ResizablePanel minSize="30rem">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel minSize="18rem">
            <CanvasSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize="6rem" defaultSize="10rem" maxSize="20rem">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="16rem" minSize="14rem" maxSize="36rem">
        <DashboardRight workflowId={workflowId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
