import toposort from "toposort"
import { WorkflowGraph } from "./db/schema"

export function validateGraph({ edge, nodes }: WorkflowGraph): string[] {
  const problems: string[] = []

  const triggers = nodes.filter((n) => n.data.kind === "trigger").length
  if (triggers !== 1) {
    problems.push(
      `A workflow needs exactly one Start trigger (found ${triggers})`
    )
  }

  if (edge.length === 0) {
    problems.push("Connect your nodes before running")
  } else {
    try {
      toposort(edge.map((e) => [e.source, e.target]))
    } catch {
      problems.push("Workflow has a cycle - remove the loop before running")
    }
  }

  return problems
}
