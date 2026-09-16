import { ATTENDANCE_STATUS_LABELS } from '../constants/attendance.constants'
import type { AttendanceFilters, AttendanceRecord } from '../types/attendance.types'
import { exportToCsv } from '@/lib/utils/exportCsv'

function formatMinutes(value: number | null): string {
  if (value === null || value === undefined) return ''
  return `${value}m`
}

function formatHours(value: number | null): string {
  if (value === null || value === undefined) return ''
  return `${value}h`
}

function buildFilename(filters: AttendanceFilters): string {
  const datePart = filters.date ?? 'all-dates'
  const statusPart =
    filters.status && filters.status !== 'all' ? `-${filters.status}` : ''
  return `daily-attendance-${datePart}${statusPart}.csv`
}

export function exportDailyAttendanceCsv(
  records: AttendanceRecord[],
  filters: AttendanceFilters
): void {
  const headers = [
    'Employee Name',
    'Employee Code',
    'Department',
    'Branch',
    'Shift',
    'Date',
    'Check-in',
    'Check-out',
    'Work Hours',
    'Break',
    'Late',
    'OT',
    'Status',
  ]

  const rows = records.map((record) => [
    record.employeeName,
    record.employeeCode,
    record.department,
    record.branch,
    record.shift,
    record.date,
    record.checkIn ?? '',
    record.checkOut ?? '',
    formatHours(record.workHours),
    formatMinutes(record.breakMinutes),
    formatMinutes(record.lateMinutes),
    formatHours(record.overtimeHours),
    ATTENDANCE_STATUS_LABELS[record.status],
  ])

  exportToCsv(buildFilename(filters), headers, rows)
}
