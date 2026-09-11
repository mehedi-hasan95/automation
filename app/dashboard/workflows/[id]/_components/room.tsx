"use client"

import { ReactNode } from "react"
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense"

export function Room({
  children,
  orgId,
}: {
  children: ReactNode
  orgId: string
}) {
  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        try {
          const response = await fetch("/api/liveblocks-auth/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds }),
          })

          if (!response.ok) {
            return undefined
          }

          return await response.json()
        } catch {
          return undefined
        }
      }}
    >
      <RoomProvider id={orgId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
