import { liveblocks } from "@/lib/liveblocks"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const { orgId, userId } = await auth()
  if (!orgId || !userId) {
    return new Response("Unauthorize", { status: 401 })
  }

  const user = await currentUser()
  if (!user) {
    return new Response("Unauthorize", { status: 401 })
  }
  const { status, body } = await liveblocks.identifyUser(
    {
      userId,
      groupIds: [orgId],
      organizationId: orgId,
    },
    {
      userInfo: {
        avatar: user.imageUrl,
        name:
          user.fullName ?? user.emailAddresses[0].emailAddress ?? "Anonymous",
      },
    }
  )

  return new Response(body, { status })
}
