interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WorkflowPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Workflow ID: {id}</h1>
    </div>
  )
}
