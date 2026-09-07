import type { LeaveStatus } from '../types/leave.types'

interface LeaveStatusBadgeProps {
  status: LeaveStatus
}

export function LeaveStatusBadge({
  status,
}: LeaveStatusBadgeProps) {
  const styles = {
    PENDING:
      'bg-yellow-100 text-yellow-800 border-yellow-200',

    APPROVED:
      'bg-green-100 text-green-800 border-green-200',

    REJECTED:
      'bg-red-100 text-red-800 border-red-200',

    CANCELLED:
      'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}