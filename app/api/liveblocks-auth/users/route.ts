import { auth, clerkClient } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const { orgId, userId } = await auth()
  if (!orgId || !userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const { userIds } = await request.json()

    if (!Array.isArray(userIds)) {
      return new Response("userIds must be an array", { status: 400 })
    }

    const client = await clerkClient()

    const userInfos = await Promise.all(
      userIds.map(async (id) => {
        try {
          const user = await client.users.getUser(id)
          return {
            name:
              user.fullName ??
              user.emailAddresses[0]?.emailAddress ??
              "Anonymous",
            avatar: user.imageUrl,
          }
        } catch (e) {
          return null
        }
      })
    )

    return new Response(JSON.stringify(userInfos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    return new Response("Invalid request body", { status: 400 })
  }
}
