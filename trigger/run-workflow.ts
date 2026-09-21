import { getSingleWorkflow } from "@/api/workflows"
import { nodeExecutors } from "@/app/dashboard/workflows/[id]/_components/node/node-executors"
import {
  interpolate,
  NodeOutputs,
} from "@/app/dashboard/workflows/[id]/_components/others/interpolate"
import { Stagehand } from "@browserbasehq/stagehand"
import { logger, metadata, task } from "@trigger.dev/sdk"
import toposort from "toposort"

export type RunStep = {
  id: string
  status: "pending" | "running" | "done" | "failed"
}

export const runWorkflowTask = task({
  id: "run-workflow",
  run: async ({ workflowId, orgId }: { workflowId: string; orgId: string }) => {
    const workflow = await getSingleWorkflow({ id: workflowId, orgId: orgId })
    if (!workflow.graph) throw new Error(`Workflow ${workflowId} has no graph`)

    const { edge, nodes } = workflow.graph
    const byId = new Map(nodes.map((n) => [n.id, n]))

    const connected = new Set(edge.flatMap((e) => [e.source, e.target]))
    const order = toposort
      .array(
        nodes.map((n) => n.id),
        edge.map((e) => [e.source, e.target])
      )
      .filter((id) => connected.has(id))

    logger.log(`Running workflow ${workflow.name}`, { steps: order.length })
    const steps: RunStep[] = order.map((id) => ({ id, status: "pending" }))

    metadata.set("steps", steps)

    let stagehand: Stagehand | undefined
    const getStagehand = async () => {
      if (stagehand) return stagehand
      stagehand = new Stagehand({
        env: "BROWSERBASE",
        apiKey: process.env.BROWSERBASE_API_KEY!,
        model: "google/gemini-2.5-flash",
        // Pino's logging backend spawns a thread-stream worker (lib/worker.js)
        // that can't be resolved inside trigger.dev's bundled output. Disable it —
        // the option exists for exactly these minimal/bundled environments.
        disablePino: true,
      })
      await stagehand.init()
      return stagehand
    }

    const outputs: NodeOutputs = {}

    for (let i = 0; i < order.length; i++) {
      const id = order[i]
      const step = steps[i]
      const node = byId.get(id)!
      logger.log(`Running step: ${node.data.title}`)

      const executor = nodeExecutors[node.data.type]
      if (!executor) continue

      // Mark running before the executor and flush immediately: the "done" set
      // below happens before the SDK's next background flush, so without forcing
      // it here the "running" state is overwritten and the canvas never spins.
      step.status = "running"
      metadata.set("steps", steps)
      await metadata.flush()

      // Swap {{ nodeId.path }} placeholders for upstream output before running.
      const values = Object.fromEntries(
        Object.entries(node.data.values).map(([key, text]) => [
          key,
          interpolate({ text, outputs }),
        ])
      )

      try {
        outputs[id] = await executor({ values, getStagehand })
      } catch (error) {
        // Flush the "failed" state before the throw unwinds the run: a thrown run
        // returns no output, so this flushed metadata is the only way the canvas
        // ever learns which node failed.
        step.status = "failed"
        metadata.set("steps", steps)
        await metadata.flush()
        await stagehand?.close()
        throw error
      }

      step.status = "done"
      metadata.set("steps", steps)
    }

    await stagehand?.close()
    return { steps }
  },
})
