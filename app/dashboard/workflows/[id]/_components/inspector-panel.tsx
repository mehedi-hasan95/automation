"use client"

import React from "react"
import { cn } from "cn"
import { AlertCircle, Info } from "lucide-react"
import { RunStep } from "@/trigger/run-workflow"

export function InspectorPanel({
  step
}: {
  step: RunStep | undefined
}) {
  if (!step) {
    return null
  }

  return (
    <div className="flex h-full flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs font-semibold">
        <span className="text-muted-foreground">Step Output</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {step.status === "failed" && step.error && (
          <div className="mb-4 flex gap-2 rounded-md bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Error: </span>
              {step.error}
            </div>
          </div>
        )}

        {step.output ? (
          <pre className="font-mono text-[11px] leading-relaxed text-foreground">
            {JSON.stringify(step.output, null, 2)}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Info className="mb-2 size-5 opacity-20" />
            <p className="text-xs">
              {step.status === "running"
                ? "Step is still executing..."
                : step.status === "pending"
                ? "Step has not started yet."
                : "No output available for this step."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
