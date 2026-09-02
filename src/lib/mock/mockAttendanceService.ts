import { ApiError } from '@/lib/api/apiError'
import {
  mockAttendanceKpis,
  mockAttendanceTrend,
  mockCalendarDays,
  mockCheckInSession,
  mockCorrections,
  mockDailyAttendance,
  mockDepartmentDistribution,
  mockHolidays,
  mockMySummary,
  mockOvertime,
  mockReportTypes,
  mockShifts,
} from '@/features/hrms/attendance/mock/attendance.mock'
import type {
  AttendanceDashboardData,
  AttendanceFilters,
  AttendanceRecord,
  AttendanceSettingsData,
  CalendarDay,
  CheckInSession,
  CorrectionRequest,
  CorrectionStatus,
  CreateCorrectionPayload,
  CreateHolidayPayload,
  CreateShiftPayload,
  GenerateReportParams,
  GenerateReportResult,
  Holiday,
  MyAttendanceData,
  OvertimeRecord,
  Shift,
} from '@/features/hrms/attendance/types/attendance.types'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

const defaultSettings: AttendanceSettingsData = {
  fullDayMinHours: 8,
  halfDayThreshold: 4,
  defaultGraceMinutes: 15,
  overtimeStartsAfter: 8.5,
  autoCreateOtRequest: true,
  requireManagerApproval: true,
  correctionWindowDays: 7,
  attachmentRequired: 'optional',
  autoNotifyEmployee: true,
}

let dailyRecords: AttendanceRecord[] = [...mockDailyAttendance]
let corrections: CorrectionRequest[] = [...mockCorrections]
let shifts: Shift[] = [...mockShifts]
let holidays: Holiday[] = [...mockHolidays]
let overtimeRecords: OvertimeRecord[] = [...mockOvertime]
let session: CheckInSession = { ...mockCheckInSession }
let settings: AttendanceSettingsData = { ...defaultSettings }

function filterDailyRecords(filters?: AttendanceFilters): AttendanceRecord[] {
  if (!filters) return dailyRecords

  return dailyRecords.filter((row) => {
    if (filters.branch && filters.branch !== 'All Branches' && row.branch !== filters.branch) {
      return false
    }
    if (
      filters.department &&
      filters.department !== 'All Departments' &&
      row.department !== filters.department
    ) {
      return false
    }
    if (filters.shift && filters.shift !== 'All Shifts' && row.shift !== filters.shift) {
      return false
    }
    if (filters.status && filters.status !== 'all' && row.status !== filters.status) {
      return false
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (
        !row.employeeName.toLowerCase().includes(q) &&
        !row.employeeCode.toLowerCase().includes(q)
      ) {
        return false
      }
    }
    return true
  })
}

function formatTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export const mockAttendanceService = {
  async getDashboard(filters?: AttendanceFilters): Promise<AttendanceDashboardData> {
    await delay()
    const records = filterDailyRecords(filters)
    return {
      kpis: mockAttendanceKpis,
      trend: mockAttendanceTrend,
      departmentDistribution: mockDepartmentDistribution,
      pendingCorrections: corrections.filter((c) => c.status === 'pending'),
      lateOrAbsent: records.filter((r) => r.status === 'late' || r.status === 'absent'),
      session: { ...session },
    }
  },

  async getDailyAttendance(filters?: AttendanceFilters): Promise<AttendanceRecord[]> {
    await delay()
    return filterDailyRecords(filters)
  },

  async getMyAttendance(month: string): Promise<MyAttendanceData> {
    await delay()
    const [year, monthNum] = month.split('-').map(Number)
    const monthLabel = new Date(year, monthNum - 1, 1).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    })
    return {
      summary: { ...mockMySummary, monthLabel },
      calendarDays: mockCalendarDays,
      session: { ...session },
    }
  },

  async getCalendar(month: string): Promise<{ days: CalendarDay[]; monthLabel: string }> {
    await delay()
    const [year, monthNum] = month.split('-').map(Number)
    const monthLabel = new Date(year, monthNum - 1, 1).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    })
    return { days: mockCalendarDays, monthLabel }
  },

  async getSession(): Promise<CheckInSession> {
    await delay(200)
    return { ...session }
  },

  async checkIn(): Promise<CheckInSession> {
    await delay()
    if (session.checkedIn && !session.checkOutTime) {
      throw new ApiError('Already checked in for today', 400)
    }
    const time = formatTime()
    session = {
      ...session,
      checkedIn: true,
      checkInTime: time,
      checkOutTime: null,
      sessionSeconds: 0,
      workHoursToday: null,
      statusToday: 'present',
      lastActivity: `Checked in at ${time}`,
      validationMessage: 'Active work session started. Remember to check out at end of day.',
    }
    return { ...session }
  },

  async checkOut(): Promise<CheckInSession> {
    await delay()
    if (!session.checkedIn) {
      throw new ApiError('You must check in before checking out', 400)
    }
    if (session.checkOutTime) {
      throw new ApiError('Already checked out for today', 400)
    }
    const time = formatTime()
    const hours = Math.max(0.1, session.sessionSeconds / 3600 || 8.2)
    session = {
      ...session,
      checkOutTime: time,
      workHoursToday: Number(hours.toFixed(1)),
      statusToday: hours >= 8 ? 'present' : 'half_day',
      lastActivity: `Checked out at ${time}`,
      validationMessage: 'Attendance saved. Hours and status calculated for today.',
    }
    return { ...session }
  },

  async getCorrections(status?: CorrectionStatus | 'all'): Promise<CorrectionRequest[]> {
    await delay()
    if (!status || status === 'all') return [...corrections]
    return corrections.filter((c) => c.status === status)
  },

  async createCorrection(payload: CreateCorrectionPayload): Promise<CorrectionRequest> {
    await delay()
    const correction: CorrectionRequest = {
      id: `corr-${Date.now()}`,
      employeeId: `emp-${Date.now()}`,
      employeeName: payload.employeeName,
      department: payload.department,
      attendanceDate: payload.attendanceDate,
      existingCheckIn: payload.existingCheckIn || null,
      existingCheckOut: payload.existingCheckOut || null,
      requestedCheckIn: payload.requestedCheckIn || null,
      requestedCheckOut: payload.requestedCheckOut || null,
      correctionType: payload.correctionType,
      reason: payload.reason,
      attachmentName: payload.attachmentName,
      approver: payload.approver,
      status: 'pending',
      submittedAt: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    corrections = [correction, ...corrections]
    return correction
  },

  async getShifts(): Promise<Shift[]> {
    await delay()
    return [...shifts]
  },

  async createShift(payload: CreateShiftPayload): Promise<Shift> {
    await delay()
    const shift: Shift = {
      id: `shift-${Date.now()}`,
      ...payload,
      code: payload.code.toUpperCase(),
    }
    shifts = [shift, ...shifts]
    return shift
  },

  async updateShift(id: string, payload: CreateShiftPayload): Promise<Shift> {
    await delay()
    const index = shifts.findIndex((s) => s.id === id)
    if (index === -1) throw new ApiError('Shift not found', 404)
    shifts[index] = {
      id,
      ...payload,
      code: payload.code.toUpperCase(),
    }
    return shifts[index]
  },

  async deleteShift(id: string): Promise<{ id: string }> {
    await delay()
    const index = shifts.findIndex((s) => s.id === id)
    if (index === -1) throw new ApiError('Shift not found', 404)
    shifts = shifts.filter((s) => s.id !== id)
    return { id }
  },

  async getHolidays(): Promise<Holiday[]> {
    await delay()
    return [...holidays]
  },

  async createHoliday(payload: CreateHolidayPayload): Promise<Holiday> {
    await delay()
    const holiday: Holiday = {
      id: `hol-${Date.now()}`,
      name: payload.name,
      date: payload.date,
      type: payload.type,
      branch: payload.companyWide ? 'All Branches' : payload.branch,
      companyWide: payload.companyWide,
      published: payload.published,
    }
    holidays = [holiday, ...holidays]
    return holiday
  },

  async updateHoliday(id: string, payload: CreateHolidayPayload): Promise<Holiday> {
    await delay()
    const index = holidays.findIndex((h) => h.id === id)
    if (index === -1) throw new ApiError('Holiday not found', 404)
    holidays[index] = {
      id,
      name: payload.name,
      date: payload.date,
      type: payload.type,
      branch: payload.companyWide ? 'All Branches' : payload.branch,
      companyWide: payload.companyWide,
      published: payload.published,
    }
    return holidays[index]
  },

  async deleteHoliday(id: string): Promise<{ id: string }> {
    await delay()
    const index = holidays.findIndex((h) => h.id === id)
    if (index === -1) throw new ApiError('Holiday not found', 404)
    holidays = holidays.filter((h) => h.id !== id)
    return { id }
  },

  async getOvertime(): Promise<OvertimeRecord[]> {
    await delay()
    return [...overtimeRecords]
  },

  async approveOvertime(id: string): Promise<OvertimeRecord> {
    await delay()
    const index = overtimeRecords.findIndex((r) => r.id === id)
    if (index === -1) throw new ApiError('Overtime record not found', 404)
    overtimeRecords[index] = {
      ...overtimeRecords[index],
      status: 'approved',
      payrollStatus: 'included',
    }
    return overtimeRecords[index]
  },

  async rejectOvertime(id: string): Promise<OvertimeRecord> {
    await delay()
    const index = overtimeRecords.findIndex((r) => r.id === id)
    if (index === -1) throw new ApiError('Overtime record not found', 404)
    overtimeRecords[index] = {
      ...overtimeRecords[index],
      status: 'rejected',
      payrollStatus: 'excluded',
    }
    return overtimeRecords[index]
  },

  async getReportTypes() {
    await delay(200)
    return [...mockReportTypes]
  },

  async generateReport(params: GenerateReportParams): Promise<GenerateReportResult> {
    await delay(600)
    const report = mockReportTypes.find((r) => r.id === params.reportId)
    if (!report) throw new ApiError('Report type not found', 404)
    const records = filterDailyRecords(params.filters)
    return {
      reportId: params.reportId,
      reportName: report.name,
      generatedAt: new Date().toISOString(),
      rowCount: records.length,
      message: `${report.name} generated for ${params.dateFrom} to ${params.dateTo}`,
    }
  },

  async getSettings(): Promise<AttendanceSettingsData> {
    await delay(200)
    return { ...settings }
  },

  async updateSettings(payload: AttendanceSettingsData): Promise<AttendanceSettingsData> {
    await delay()
    settings = { ...payload }
    return { ...settings }
  },
}
