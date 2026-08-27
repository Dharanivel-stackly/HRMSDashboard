export type AttendanceStatus =
  | 'present'
  | 'late'
  | 'half_day'
  | 'absent'
  | 'holiday'
  | 'week_off'
  | 'on_leave'
  | 'overtime'

export type CorrectionStatus = 'pending' | 'approved' | 'rejected'
export type CorrectionType =
  | 'check_in'
  | 'check_out'
  | 'both'
  | 'status_change'
  | 'missed_punch'

export type OvertimeStatus = 'pending' | 'approved' | 'rejected' | 'payroll_ready'
export type HolidayType = 'public' | 'company' | 'optional' | 'restricted'
export type ShiftStatus = 'active' | 'inactive'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeCode: string
  employeeName: string
  avatarInitials: string
  department: string
  branch: string
  shift: string
  date: string
  checkIn: string | null
  checkOut: string | null
  workHours: number | null
  breakMinutes: number | null
  lateMinutes: number | null
  overtimeHours: number | null
  status: AttendanceStatus
  hasCorrection: boolean
}

export interface AttendanceKpis {
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateToday: number
  onLeave: number
  halfDay: number
  averageWorkHours: number
  overtimeHours: number
  pendingCorrections: number
  attendancePercentage: number
}

export interface AttendanceTrendPoint {
  label: string
  present: number
  absent: number
  late: number
}

export interface DepartmentDistribution {
  department: string
  present: number
  absent: number
  late: number
  onLeave: number
}

export interface CorrectionRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  attendanceDate: string
  existingCheckIn: string | null
  existingCheckOut: string | null
  requestedCheckIn: string | null
  requestedCheckOut: string | null
  correctionType: CorrectionType
  reason: string
  attachmentName?: string
  approver: string
  status: CorrectionStatus
  approvalComments?: string
  submittedAt: string
}

export interface Shift {
  id: string
  code: string
  name: string
  startTime: string
  endTime: string
  crossMidnight: boolean
  graceMinutes: number
  breakMinutes: number
  minWorkHours: number
  halfDayThreshold: number
  overtimeThreshold: number
  departments: string[]
  effectiveDate: string
  status: ShiftStatus
}

export interface Holiday {
  id: string
  name: string
  date: string
  type: HolidayType
  branch: string
  companyWide: boolean
  published: boolean
}

export interface OvertimeRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  regularHours: number
  overtimeHours: number
  reason: string
  status: OvertimeStatus
  approver: string
  payrollStatus: 'pending' | 'included' | 'excluded'
}

export interface MyAttendanceSummary {
  monthLabel: string
  attendancePercentage: number
  present: number
  absent: number
  leave: number
  holiday: number
  weekOff: number
  late: number
  overtimeHours: number
}

export interface CalendarDay {
  date: string
  status: AttendanceStatus | 'correction_pending' | null
  checkIn?: string | null
  checkOut?: string | null
  workHours?: number | null
}

export interface AttendanceFilters {
  date?: string
  branch?: string
  department?: string
  shift?: string
  status?: AttendanceStatus | 'all'
  search?: string
}

export interface CheckInSession {
  employeeName: string
  employeeCode: string
  shift: string
  shiftTiming: string
  checkedIn: boolean
  checkInTime: string | null
  checkOutTime: string | null
  sessionSeconds: number
  workHoursToday: number | null
  statusToday: AttendanceStatus | 'not_started'
  lastActivity: string
  validationMessage?: string
}

export interface AttendanceReportType {
  id: string
  name: string
  description: string
}
