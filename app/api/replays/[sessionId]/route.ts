import { auth } from "@clerk/nextjs/server"
import { Browserbase } from "@browserbasehq/sdk"
import { NextResponse } from "next/server"

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY!,
})

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const { orgId } = await auth()
  if (!orgId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { sessionId } = await params

  try {
    const replay = await bb.sessions.replays.retrieve(sessionId)
    const firstPage = replay.pages[0]
    if (!firstPage) {
      return new Response(null, { status: 202 })
    }

    const playlist = await bb.sessions.replays.retrievePage(
      sessionId,
      firstPage.pageId
    )
    const m3u8 = await playlist.text()

    return new Response(m3u8, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        // The playlist's pre-signed segment URLs rotate, so don't let a stale
        // manifest be cached.
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Error fetching replay:", error)
    return NextResponse.json(
      { ready: false, error: "Failed to retrieve recording" },
      { status: 500 }
    )
  }
}
