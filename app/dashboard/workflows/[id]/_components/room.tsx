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
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCK_KEY!}
    >
      <RoomProvider id={orgId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
