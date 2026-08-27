import { FileX } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  description?: string
}

export function EmptyState({
  message = 'No data found',
  description = 'There are no items to display at this time.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileX className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-medium">{message}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
