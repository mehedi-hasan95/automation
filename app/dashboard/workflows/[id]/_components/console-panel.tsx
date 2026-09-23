"use client"

import React, { useState } from "react"
import { useReactFlow } from "@xyflow/react"
import { useWorkflowRuns } from "./others/workflow-runs-provider"
import { LogsPanel } from "./logs-panel"
import { InspectorPanel } from "./inspector-panel"
import { cn } from "cn"

function ConsoleInner({
  onSelectStep,
  selectedStepId
}: {
  onSelectStep: (id: string) => void
  selectedStepId: string | null
}) {
  const { runs, latestRunSteps } = useWorkflowRuns()

  if (!runs) return null

  const selectedStep = latestRunSteps?.find((s) => s.id === selectedStepId)

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className={cn(
        "flex-1 overflow-y-auto transition-all",
        selectedStepId ? "max-w-md" : "w-full"
      )}>
        <LogsPanel
          runs={runs}
          latestRunSteps={latestRunSteps}
          selectedStepId={selectedStepId}
          onSelectStep={onSelectStep}
        />
      </div>
      {selectedStepId && (
        <div className="w-1/2 min-w-[300px] max-w-lg animate-in slide-in-from-right duration-200">
          <InspectorPanel step={selectedStep} />
        </div>
      )}
    </div>
  )
}

export function ConsolePanel() {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
  const { setNodes } = useReactFlow()

  const handleSelectStep = (id: string) => {
    if (selectedStepId === id) {
      setSelectedStepId(null)
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })))
    } else {
      setSelectedStepId(id)
      setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === id })))
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden border-t border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs font-semibold">
        <span className="text-muted-foreground">Console</span>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <div className="size-2 rounded-full bg-muted" />
            <span className="text-[10px]">Logs</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ConsoleInner
          onSelectStep={handleSelectStep}
          selectedStepId={selectedStepId}
        />
      </div>
    </div>
  )
}
