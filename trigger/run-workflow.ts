import { getSingleWorkflow } from "@/api/workflows"
import { nodeExecutors } from "@/app/dashboard/workflows/[id]/_components/node/node-executors"
import {
  interpolate,
  NodeOutputs,
} from "@/app/dashboard/workflows/[id]/_components/others/interpolate"
import { Stagehand } from "@browserbasehq/stagehand"
import { logger, task } from "@trigger.dev/sdk"
import toposort from "toposort"

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

    for (const id of order) {
      const node = byId.get(id)!
      logger.log(`Running step: ${node.data.title}`)

      // Interpolate field values using upstream outputs
      const interpolatedValues = Object.fromEntries(
        Object.entries(node.data.values).map(([key, value]) => [
          key,
          typeof value === "string"
            ? interpolate({ text: value, outputs })
            : value,
        ])
      )

      const executor = nodeExecutors[node.data.type]
      if (executor) {
        const result = await executor({
          values: interpolatedValues,
          getStagehand,
        })
        outputs[id] = result
      }
    }

    await stagehand?.close()
    return { steps: order.length }
  },
})
