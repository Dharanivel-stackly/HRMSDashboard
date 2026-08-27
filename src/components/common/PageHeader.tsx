import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  /** When true, hide title (page title already shown in app header) */
  hideTitle?: boolean
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  hideTitle = true,
}: PageHeaderProps) {
  if (hideTitle && !description && !actions) return null

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div>
        {!hideTitle && (
          <h1 className="text-2xl font-bold tracking-tight text-[#0b3d91]">{title}</h1>
        )}
        {description && (
          <p className={cn('text-sm text-muted-foreground', !hideTitle && 'mt-0.5')}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
