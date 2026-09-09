import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <div className="flex h-full min-h-svh w-full items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Workflow not found</EmptyTitle>
          <EmptyDescription>
            The workflow you are looking for does not exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
