"use client"

import { useTheme } from "next-themes"
import {
  ReactFlow,
  Edge,
  type ColorMode,
  Controls,
  NodeTypes,
  Panel,
} from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import { AvatarStack } from "@liveblocks/react-ui"
import { StepNode } from "./node/step-node"
import { StepNodeType } from "./node/node-registry"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"

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
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow({
      suspense: true,
      nodes: { initial: initialNodes },
      edges: { initial: initialEdges },
    })

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      colorMode={(theme as ColorMode) ?? "system"}
      maxZoom={1}
      fitView
    >
      <Controls />
      <Cursors />
      <Panel position="top-right">
        <AvatarStack />
      </Panel>
    </ReactFlow>
  )
}
