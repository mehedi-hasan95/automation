"use client"

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export default function Error({
  error: ErrorError,
  reset: resetError,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            An unexpected error occurred while loading the workflow.
          </EmptyDescription>
        </EmptyHeader>
        <button
          onClick={() => resetError()}
          className="mt-4 rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </Empty>
    </div>
  )
}
