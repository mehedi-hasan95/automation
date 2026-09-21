import type { Stagehand } from "@browserbasehq/stagehand"

export async function actNode({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  try {
    const result = await stagehand.act(instruction)
    const page = stagehand.context.pages()[0]

    return {
      success: true,
      message: typeof result === "string" ? result : "Action performed successfully",
      url: page.url(),
    }
  } catch (error) {
    const page = stagehand.context.pages()[0]
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      url: page?.url() || "",
    }
  }
}
