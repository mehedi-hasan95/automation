import type { Node } from "@xyflow/react"
import { Globe, MousePointerClick, MousePointer2, FileSearch, Eye, Bot, Mail, type LucideIcon } from "lucide-react"

export type StepNodeKind = "trigger" | "action"

// One editable field on a node, rendered as an input in the inspector later.
export type NodeField = {
  key: string
  label: string
  placeholder?: string
  multiline?: boolean
  required?: boolean
}

export type NodeOutput = {
  path: string
  label: string
}

// A node type's manifest entry. Add a node by adding an entry to nodeRegistry.
export type NodeDefinition = {
  type: string
  kind: StepNodeKind
  label: string
  icon: LucideIcon
  accent: string // Tailwind classes for the icon chip color
  fields: NodeField[]
  outputs: NodeOutput[]
}

export const nodeRegistry = {
  start: {
    type: "start",
    kind: "trigger",
    label: "Start",
    icon: MousePointerClick,
    accent: "bg-blue-500 text-white",
    fields: [],
    outputs: [],
  },
  "open-url": {
    type: "open-url",
    kind: "action",
    label: "Open URL",
    icon: Globe,
    accent: "bg-emerald-500 text-white",
    fields: [
      {
        key: "url",
        label: "URL",
        placeholder: "https://youtube.com",
        required: true,
      },
    ],
    outputs: [
      { path: "url", label: "URL" },
      { path: "title", label: "Title" },
    ],
  },
  act: {
    type: "act",
    kind: "action",
    label: "Act",
    icon: MousePointer2,
    accent: "bg-orange-500 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Click the 'Login' button",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "success", label: "Success" },
      { path: "message", label: "Message" },
      { path: "url", label: "URL" },
    ],
  },
  extract: {
    type: "extract",
    kind: "action",
    label: "Extract",
    icon: FileSearch,
    accent: "bg-purple-500 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Extract the product price and availability",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "result", label: "Result" },
    ],
  },
  observe: {
    type: "observe",
    kind: "action",
    label: "Observe",
    icon: Eye,
    accent: "bg-cyan-500 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Find the 'Checkout' button and related elements",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "result", label: "Result" },
    ],
  },
  agent: {
    type: "agent",
    kind: "action",
    label: "Agent",
    icon: Bot,
    accent: "bg-indigo-500 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Search for 'Claude Code' and tell me the first result",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "success", label: "Success" },
      { path: "summary", label: "Summary" },
      { path: "completed", label: "Completed" },
    ],
  },
  "send-email": {
    type: "send-email",
    kind: "action",
    label: "Send Email",
    icon: Mail,
    accent: "bg-pink-500 text-white",
    fields: [
      {
        key: "to",
        label: "Recipient",
        placeholder: "user@example.com",
        required: true,
      },
      {
        key: "subject",
        label: "Subject",
        placeholder: "Hello from Automation",
        required: true,
      },
      {
        key: "body",
        label: "Body",
        placeholder: "Enter your email message here...",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "emailId", label: "Email ID" },
    ],
  },





} satisfies Record<string, NodeDefinition>

export type NodeType = keyof typeof nodeRegistry

export type StepNodeData = {
  type: NodeType
  kind: StepNodeKind
  title: string
  values: Record<string, string>
}

export type StepNodeType = Node<StepNodeData, "step">

export type ActionNodeType = {
  [K in NodeType]: (typeof nodeRegistry)[K]["kind"] extends "action" ? K : never
}[NodeType]
