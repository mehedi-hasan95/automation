import type { Stagehand } from "@browserbasehq/stagehand"

export async function agentNode({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  try {
    const agent = stagehand.agent({ mode: "cua" })
    const result = await agent.execute({
      instruction,
      maxSteps: 20,
    })

    return {
      success: result.success,
      summary: result.message,
      completed: result.completed,
    }
  } catch (error) {
    return {
      success: false,
      summary: error instanceof Error ? error.message : "An unknown error occurred",
      completed: false,
    }
  }
}
