"use client"

import React from "react"
import { cn } from "cn"
import { Loader2, CheckCircle2, XCircle, Play } from "lucide-react"
import prettyMs from "pretty-ms"
import { RunStep } from "@/trigger/run-workflow"
import { NodeIcon } from "./node-icon"
import { NodeType } from "./node/node-registry"

interface StepItemProps {
  step: RunStep
  isSelected: boolean
  onSelect: (id: string) => void
}

function StepItem({ step, isSelected, onSelect }: StepItemProps) {
  const duration =
    step.startTime && step.endTime
      ? prettyMs(step.endTime - step.startTime)
      : null

  const statusStyles = {
    pending: "text-muted-foreground opacity-50",
    running: "text-primary",
    done: "text-foreground",
    failed: "text-destructive font-medium",
  }

  return (
    <div
      onClick={() => onSelect(step.id)}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-secondary/50",
        isSelected && "bg-secondary"
      )}
    >
      <NodeIcon
        type={step.type as NodeType}
        running={step.status === "running"}
      />

      <span
        className={cn("flex-1 truncate text-xs", statusStyles[step.status])}
      >
        {step.title}
      </span>

      <div className="flex items-center gap-2">
        {duration && (
          <span className="text-[10px] text-muted-foreground">{duration}</span>
        )}

        <div className="size-3.5">
          {step.status === "running" && (
            <Loader2 className="size-3.5 animate-spin" />
          )}
          {step.status === "done" && (
            <CheckCircle2 className="size-3.5 text-green-500" />
          )}
          {step.status === "failed" && (
            <XCircle className="size-3.5 text-destructive" />
          )}
        </div>
      </div>
    </div>
  )
}

function ReplayItem({
  isSelected,
  onSelect,
}: {
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <div
      onClick={() => onSelect("replay")}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-secondary/50",
        isSelected && "bg-secondary"
      )}
    >
      <Play className="size-3.5 fill-primary text-primary" />
      <span className="flex-1 truncate text-xs font-medium">
        Replay Session
      </span>
    </div>
  )
}

type Selection =
  | { type: "step"; id: string }
  | { type: "replay"; id: string }
  | null

export function LogsPanel({
  runs,
  latestRunSteps,
  selection,
  onSelect,
}: {
  runs: unknown[] | undefined
  latestRunSteps?: RunStep[]
  selection: Selection
  onSelect: (selection: Selection) => void
}) {
  if (!runs || runs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
        No runs found
      </div>
    )
  }

  const latestRun = runs[0] as { output?: { sessionId?: string }; status: string }
  const hasReplay =
    latestRun?.output?.sessionId && latestRun?.status !== "EXECUTING"

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          <span>Runs History</span>
          <span>Status</span>
        </div>

        {runs.map((run, i) => {
          const r = run as { id: string; status: string; createdAt: string }
          return (
            <div
              key={r.id}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors",
                i === 0
                  ? "border border-border bg-secondary/30"
                  : "hover:bg-secondary/20"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="truncate font-medium">
                  Run {r.id.slice(0, 8)}
                </span>
                {i === 0 && (
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                    Latest
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px]",
                  r.status === "FAILED"
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {r.status}
              </span>
            </div>
          )
        })}
      </div>

      {latestRunSteps && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Execution Steps
          </div>
          <div className="flex flex-col gap-1">
            {hasReplay && (
              <ReplayItem
                isSelected={selection?.type === "replay"}
                onSelect={(id) => onSelect({ type: "replay", id })}
              />
            )}
            {latestRunSteps.map((step) => (
              <StepItem
                key={step.id}
                step={step}
                isSelected={
                  selection?.type === "step" && selection.id === step.id
                }
                onSelect={(id) => onSelect({ type: "step", id })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
