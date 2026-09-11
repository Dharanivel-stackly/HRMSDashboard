// src/features/hrms/onboarding/components/ChecklistItem.tsx
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { OnboardingTask } from '../types/onboarding.types'

interface ChecklistItemProps {
  task: OnboardingTask
  onToggle?: (id: string, status: OnboardingTask['status']) => void
}

const statusIcon = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle2,
  blocked: AlertCircle,
}

const statusColors = {
  pending: 'text-amber-500',
  in_progress: 'text-blue-500',
  completed: 'text-emerald-500',
  blocked: 'text-red-500',
}

export function ChecklistItem({ task, onToggle }: ChecklistItemProps) {
  const Icon = statusIcon[task.status]
  const color = statusColors[task.status]

  const handleClick = () => {
    if (task.status === 'completed') {
      onToggle?.(task.id, 'pending')
    } else {
      onToggle?.(task.id, 'completed')
    }
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleClick}>
      <div className={cn('mt-0.5', color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{task.title}</p>
        <p className="text-sm text-muted-foreground">{task.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Assignee: {task.assignee}</span>
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          <span className="capitalize">Priority: {task.priority}</span>
          <span className="capitalize">Category: {task.category}</span>
        </div>
        {task.completedDate && (
          <p className="mt-1 text-xs text-emerald-600">
            Completed: {new Date(task.completedDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="shrink-0 text-xs font-medium capitalize text-muted-foreground">
        {task.status.replace('_', ' ')}
      </div>
    </div>
  )
}