import type { Stagehand } from "@browserbasehq/stagehand"

import { openUrl } from "./open-url"
import { actNode } from "./act"
import { extractNode } from "./extract"
import { observeNode } from "./observe"
import { agentNode } from "./agent"
import type { ActionNodeType, NodeType } from "./node-registry"

export type NodeContext = {
  values: Record<string, string>
  getStagehand: () => Promise<Stagehand>
}

export type NodeExecutor = (ctx: NodeContext) => Promise<unknown>

export const nodeExecutors: Partial<Record<NodeType, NodeExecutor>> = {
  "open-url": async ({ values, getStagehand }) =>
    openUrl({ stagehand: await getStagehand(), url: values.url }),
  act: async ({ values, getStagehand }) =>
    actNode({ stagehand: await getStagehand(), instruction: values.instruction }),
  extract: async ({ values, getStagehand }) =>
    extractNode({ stagehand: await getStagehand(), instruction: values.instruction }),
  observe: async ({ values, getStagehand }) =>
    observeNode({ stagehand: await getStagehand(), instruction: values.instruction }),
  agent: async ({ values, getStagehand }) =>
    agentNode({ stagehand: await getStagehand(), instruction: values.instruction }),
} satisfies Record<ActionNodeType, NodeExecutor>
