import type { AttendanceStatus, CorrectionStatus, CorrectionType, HolidayType, OvertimeStatus } from '../types/attendance.types'

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Present',
  late: 'Late',
  half_day: 'Half Day',
  absent: 'Absent',
  holiday: 'Holiday',
  week_off: 'Week Off',
  on_leave: 'On Leave',
  overtime: 'Overtime',
}

export const ATTENDANCE_STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  late: 'bg-amber-50 text-amber-700 border-amber-200',
  half_day: 'bg-orange-50 text-orange-700 border-orange-200',
  absent: 'bg-red-50 text-red-700 border-red-200',
  holiday: 'bg-violet-50 text-violet-700 border-violet-200',
  week_off: 'bg-slate-100 text-slate-600 border-slate-200',
  on_leave: 'bg-sky-50 text-sky-700 border-sky-200',
  overtime: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

export const CORRECTION_STATUS_LABELS: Record<CorrectionStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const CORRECTION_TYPE_LABELS: Record<CorrectionType, string> = {
  check_in: 'Check-In',
  check_out: 'Check-Out',
  both: 'Check-In & Out',
  status_change: 'Status Change',
  missed_punch: 'Missed Punch',
}

export const HOLIDAY_TYPE_LABELS: Record<HolidayType, string> = {
  public: 'Public Holiday',
  company: 'Company Holiday',
  optional: 'Optional',
  restricted: 'Restricted',
}

export const OVERTIME_STATUS_LABELS: Record<OvertimeStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  payroll_ready: 'Payroll Ready',
}

export const BRANCHES = ['All Branches', 'Head Office', 'North Branch', 'South Branch'] as const
export const DEPARTMENTS = [
  'All Departments',
  'Human Resources',
  'Engineering',
  'Finance',
  'Sales',
  'Operations',
] as const
export const SHIFTS = ['All Shifts', 'General', 'Morning', 'Evening', 'Night'] as const
