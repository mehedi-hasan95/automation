"use client"

import { useState } from "react"
import { useReactFlow } from "@xyflow/react"
import { useWorkflowRuns } from "./others/workflow-runs-provider"
import { LogsPanel } from "./logs-panel"
import { InspectorPanel } from "./inspector-panel"
import { cn } from "cn"

type Selection =
  | { type: "step"; id: string }
  | { type: "replay"; id: string }
  | null

function ConsoleInner({
  onSelect,
  selection,
}: {
  onSelect: (selection: Selection) => void
  selection: Selection
}) {
  const { runs, latestRunSteps } = useWorkflowRuns()

  if (!runs) return null

  const selectedStep =
    selection?.type === "step"
      ? latestRunSteps?.find((s) => s.id === selection.id)
      : undefined

  const selectedSessionId =
    selection?.type === "replay"
      ? (runs[0] as { output?: { sessionId?: string } })?.output?.sessionId
      : undefined

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div
        className={cn(
          "flex-1 overflow-y-auto transition-all",
          selection ? "max-w-md" : "w-full"
        )}
      >
        <LogsPanel
          runs={runs}
          latestRunSteps={latestRunSteps}
          selection={selection}
          onSelect={onSelect}
        />
      </div>
      {selection && (
        <div className="w-1/2 max-w-lg min-w-75 animate-in duration-200 slide-in-from-right">
          <InspectorPanel
            step={selectedStep}
            sessionId={selectedSessionId}
          />
        </div>
      )}
    </div>
  )
}

export function ConsolePanel() {
  const [selection, setSelection] = useState<Selection>(null)
  const { setNodes } = useReactFlow()

  const handleSelect = (newSelection: Selection) => {
    if (selection?.type === newSelection?.type && selection?.id === newSelection?.id) {
      setSelection(null)
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })))
    } else {
      setSelection(newSelection)
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: newSelection?.type === "step" && n.id === newSelection.id,
        }))
      )
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
          onSelect={handleSelect}
          selection={selection}
        />
      </div>
    </div>
  )
}
