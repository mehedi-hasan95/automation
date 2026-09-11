"use client"

import dynamic from "next/dynamic"

const CanvasFlow = dynamic(
  () => import("./canvas-flow").then((mod) => mod.CanvasFlow),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading canvas...</div>
      </div>
    ),
  }
)

export const CanvasSidebar = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <CanvasFlow />
    </div>
  )
}
