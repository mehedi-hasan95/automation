"use client"

import { useState, useCallback } from "react"
import { useTheme } from "next-themes"
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  type ColorMode,
  Controls,
  NodeTypes,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { StepNode } from "./node/step-node"
import { StepNodeType } from "./node/node-registry"

const nodeTypes: NodeTypes = { step: StepNode }

const initialNodes: StepNodeType[] = [
  {
    id: "start",
    type: "step",
    position: { x: 0, y: 0 },
    data: { type: "start", kind: "trigger", title: "start", values: {} },
  },
  {
    id: "open-url-1",
    type: "step",
    position: { x: 0, y: 100 },
    data: { type: "open-url", kind: "action", title: "Open URL", values: {} },
  },
]
const initialEdges: Edge[] = []

export const CanvasFlow = () => {
  const { theme } = useTheme()
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      colorMode={(theme as ColorMode) ?? "system"}
      fitView
    >
      <Controls />
    </ReactFlow>
  )
}
