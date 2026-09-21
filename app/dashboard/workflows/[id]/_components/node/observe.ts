import type { Stagehand } from "@browserbasehq/stagehand"

export async function observeNode({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  try {
    const result = await stagehand.observe(instruction)
    return {
      result: typeof result === "string" ? result : JSON.stringify(result, null, 2),
    }
  } catch (error) {
    return {
      result: `Observation failed: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
    }
  }
}
