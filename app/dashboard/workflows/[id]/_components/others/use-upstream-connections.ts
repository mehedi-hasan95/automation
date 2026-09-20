import { useMemo } from "react"
import { useStore } from "@xyflow/react"
import { nodeRegistry, type StepNodeType } from "../node/node-registry"

export type UpstreamToken = {
  token: string
  label: string
  type: string
}

export function useUpstreamConnections() {
  const selectedNode = useStore((s) => s.nodes.find((n) => n.selected)) as StepNodeType | undefined
  const nodes = useStore((s) => s.nodes)
  const edges = useStore((s) => s.edges)

  return useMemo(() => {
    if (!selectedNode) return []

    // 1. Recursive Upstream Traversal
    const upstreamNodeIds = new Set<string>()
    const queue = [selectedNode.id]
    const visited = new Set<string>([selectedNode.id])

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!

      // Find edges pointing to the current node
      const parents = edges
        .filter((edge) => edge.target === currentNodeId)
        .map((edge) => edge.source)

      for (const parentId of parents) {
        if (!visited.has(parentId)) {
          visited.add(parentId)
          upstreamNodeIds.add(parentId)
          queue.push(parentId)
        }
      }
    }

    // 2. Token Generation
    const tokens: UpstreamToken[] = []

    for (const nodeId of upstreamNodeIds) {
      const node = nodes.find((n) => n.id === nodeId) as StepNodeType | undefined
      if (!node) continue

      const type = node.data.type
      const definition = nodeRegistry[type]
      if (!definition) continue

      // Calculate friendly index (1-based)
      const nodesOfType = nodes.filter((n) => (n as StepNodeType).data.type === type)
      const index = nodesOfType.findIndex((n) => n.id === nodeId) + 1

      // Map outputs to tokens
      for (const output of definition.outputs) {
        tokens.push({
          token: `{{${nodeId}.${output.path}}}`,
          label: `${definition.label} ${index} · ${output.label}`,
          type: definition.type,
        })
      }
    }

    return tokens
  }, [selectedNode, nodes, edges])
}
