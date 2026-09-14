import { getSingleWorkflow } from "@/api/workflows"
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

    for (const id of order) {
      const node = byId.get(id)!
      logger.log(`Running step: ${node.data.title}`)
    }

    return { steps: order.length }
  },
})
