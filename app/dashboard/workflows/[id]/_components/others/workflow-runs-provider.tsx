"use client"

import React, { createContext, useContext, useMemo } from "react"
import { useRealtimeRunsWithTag } from "@trigger.dev/react-hooks"
import { RunStep } from "@/trigger/run-workflow"

interface WorkflowRunsContextValue {
  latestRunSteps: RunStep[] | undefined
  isLive: boolean
}

const WorkflowRunsContext = createContext<WorkflowRunsContextValue | undefined>(
  undefined
)

interface WorkflowRunsProviderProps {
  workflowId: string
  publicAccessToken: string
  children: React.ReactNode
}

export function WorkflowRunsProvider({
  workflowId,
  publicAccessToken,
  children,
}: WorkflowRunsProviderProps) {
  const tag = `workflow:${workflowId}`

  const { runs } = useRealtimeRunsWithTag([tag], {
    accessToken: publicAccessToken,
  })

  const value = useMemo(() => {
    if (!runs || runs.length === 0) {
      return {
        latestRunSteps: undefined,
        isLive: false,
      }
    }

    // Sort runs by created date to get the most recent one
    const sortedRuns = [...runs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const latestRun = sortedRuns[0]

    // "Live" means the run is queued or executing
    const isLive =
      latestRun.status === "QUEUED" || latestRun.status === "EXECUTING"

    // Prefer final output steps, fallback to live metadata steps
    const steps =
      (latestRun.output as { steps?: RunStep[] })?.steps ??
      (latestRun.metadata as { steps?: RunStep[] })?.steps

    return {
      latestRunSteps: steps,
      isLive,
    }
  }, [runs])

  return (
    <WorkflowRunsContext.Provider value={value}>
      {children}
    </WorkflowRunsContext.Provider>
  )
}

export function useLatestRunSteps() {
  const context = useContext(WorkflowRunsContext)
  if (context === undefined) {
    throw new Error(
      "useLatestRunSteps must be used within a WorkflowRunsProvider"
    )
  }
  return {
    steps: context.latestRunSteps,
    isLive: context.isLive,
  }
}
