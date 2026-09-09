"use client"

import React, { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { runWorkflowAction } from "@/api/trigger/action"
import { useRealtimeRun } from "@trigger.dev/react-hooks"

type RunHandle = {
  id: string
  publicAccessToken: string
}

export const DashboardRight = ({ workflowId }: { workflowId: string }) => {
  const [isPending, startTransition] = useTransition()
  const [handle, setHandle] = useState<RunHandle | null>(null)

  const { run, error: realtimeError } = useRealtimeRun(handle?.id, {
    accessToken: handle?.publicAccessToken,
    enabled: !!handle,
    skipColumns: ["payload", "output"],
  })

  const handleRun = async () => {
    startTransition(async () => {
      const result = await runWorkflowAction(workflowId)
      if (result && result.id && result.publicAccessToken) {
        setHandle({
          id: result.id,
          publicAccessToken: result.publicAccessToken,
        })
      }
    })
  }

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Button onClick={handleRun} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Play className="mr-2 size-4" />
        )}
        Run Workflow
      </Button>

      {handle && (
        <div className="flex flex-col items-center gap-2 text-sm">
          <p className="text-muted-foreground">Run ID: {handle.id}</p>

          {realtimeError && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="size-4" />
              <span>Error: {realtimeError.message}</span>
            </div>
          )}

          {run && (
            <div className="flex items-center gap-2">
              {run.status === "COMPLETED" ? (
                <>
                  <CheckCircle2 className="size-4 text-green-500" />
                  <span className="font-medium text-green-600">Completed</span>
                </>
              ) : run.status === "FAILED" ? (
                <>
                  <XCircle className="size-4 text-destructive" />
                  <span className="font-medium text-destructive">Failed</span>
                </>
              ) : (
                <>
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Status: {run.status}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
