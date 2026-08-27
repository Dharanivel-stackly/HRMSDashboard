import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Accent = 'purple' | 'green' | 'gray' | 'blue' | 'pink' | 'orange' | 'teal' | 'indigo'

const accentStyles: Record<
  Accent,
  { iconWrap: string; icon: string; border?: string }
> = {
  purple: {
    iconWrap: 'bg-violet-100',
    icon: 'text-violet-600',
  },
  green: {
    iconWrap: 'bg-emerald-100',
    icon: 'text-emerald-600',
  },
  gray: {
    iconWrap: 'bg-slate-100',
    icon: 'text-slate-500',
  },
  blue: {
    iconWrap: 'bg-sky-100',
    icon: 'text-sky-600',
  },
  pink: {
    iconWrap: 'bg-pink-100',
    icon: 'text-pink-600',
  },
  orange: {
    iconWrap: 'bg-orange-100',
    icon: 'text-orange-600',
    border: 'border-l-4 border-l-orange-400',
  },
  teal: {
    iconWrap: 'bg-teal-100',
    icon: 'text-teal-600',
    border: 'border-l-4 border-l-teal-400',
  },
  indigo: {
    iconWrap: 'bg-indigo-100',
    icon: 'text-indigo-600',
  },
}

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: Accent
  badge?: string
  badgeTone?: 'success' | 'neutral' | 'warning'
  subtext?: string
  alert?: boolean
  className?: string
}

const badgeTones = {
  success: 'bg-emerald-50 text-emerald-700',
  neutral: 'bg-slate-100 text-slate-600',
  warning: 'bg-amber-50 text-amber-700',
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'blue',
  badge,
  badgeTone = 'success',
  subtext,
  alert,
  className,
}: StatCardProps) {
  const styles = accentStyles[accent]

  return (
    <div
      className={cn(
        'ui-card-elevated relative rounded-xl border border-border/60 bg-card p-5 transition-shadow',
        styles.border,
        className
      )}
    >
      {alert && (
        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            styles.iconWrap
          )}
        >
          <Icon className={cn('h-5 w-5', styles.icon)} />
        </div>
        {badge && (
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              badgeTones[badgeTone]
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {subtext && (
        <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  )
}
