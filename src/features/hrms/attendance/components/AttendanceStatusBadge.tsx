import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import {
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_STYLES,
} from '../constants/attendance.constants'
import type { AttendanceStatus } from '../types/attendance.types'

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus | 'correction_pending' | 'not_started'
  className?: string
}

export function AttendanceStatusBadge({ status, className }: AttendanceStatusBadgeProps) {
  if (status === 'correction_pending') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'border border-amber-200 bg-amber-50 font-medium text-amber-700',
          className
        )}
      >
        Correction Pending
      </Badge>
    )
  }

  if (status === 'not_started') {
    return (
      <Badge
        variant="outline"
        className={cn('border border-slate-200 bg-slate-50 font-medium text-slate-600', className)}
      >
        Not Started
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn('border font-medium', ATTENDANCE_STATUS_STYLES[status], className)}
    >
      {ATTENDANCE_STATUS_LABELS[status]}
    </Badge>
  )
}
