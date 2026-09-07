import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  AttendanceDashboardData,
  AttendanceFilters,
  AttendanceRecord,
  AttendanceReportType,
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
  UpdateHolidayPayload,
  UpdateShiftPayload,
} from '../types/attendance.types'

export const attendanceService = {
  async getDashboard(filters?: AttendanceFilters): Promise<AttendanceDashboardData> {
    const res = await api.get<ApiResponse<AttendanceDashboardData>>(
      API_ENDPOINTS.ATTENDANCE.DASHBOARD,
      { params: filters }
    )
    return res.data.data
  },

  async getDailyAttendance(filters?: AttendanceFilters): Promise<AttendanceRecord[]> {
    const res = await api.get<ApiResponse<AttendanceRecord[]>>(API_ENDPOINTS.ATTENDANCE.DAILY, {
      params: filters,
    })
    return res.data.data
  },

  async getMyAttendance(month: string): Promise<MyAttendanceData> {
    const res = await api.get<ApiResponse<MyAttendanceData>>(API_ENDPOINTS.ATTENDANCE.MY, {
      params: { month },
    })
    return res.data.data
  },

  async getCalendar(month: string): Promise<{ days: CalendarDay[]; monthLabel: string }> {
    const res = await api.get<ApiResponse<{ days: CalendarDay[]; monthLabel: string }>>(
      API_ENDPOINTS.ATTENDANCE.CALENDAR,
      { params: { month } }
    )
    return res.data.data
  },

  async getSession(): Promise<CheckInSession> {
    const res = await api.get<ApiResponse<CheckInSession>>(API_ENDPOINTS.ATTENDANCE.SESSION)
    return res.data.data
  },

  async checkIn(): Promise<CheckInSession> {
    const res = await api.post<ApiResponse<CheckInSession>>(API_ENDPOINTS.ATTENDANCE.CHECK_IN)
    return res.data.data
  },

  async checkOut(): Promise<CheckInSession> {
    const res = await api.post<ApiResponse<CheckInSession>>(API_ENDPOINTS.ATTENDANCE.CHECK_OUT)
    return res.data.data
  },

  async getCorrections(status?: CorrectionStatus | 'all'): Promise<CorrectionRequest[]> {
    const res = await api.get<ApiResponse<CorrectionRequest[]>>(
      API_ENDPOINTS.ATTENDANCE.CORRECTIONS,
      { params: { status } }
    )
    return res.data.data
  },

  async createCorrection(payload: CreateCorrectionPayload): Promise<CorrectionRequest> {
    const res = await api.post<ApiResponse<CorrectionRequest>>(
      API_ENDPOINTS.ATTENDANCE.CORRECTIONS,
      payload
    )
    return res.data.data
  },

  async getShifts(): Promise<Shift[]> {
    const res = await api.get<ApiResponse<Shift[]>>(API_ENDPOINTS.ATTENDANCE.SHIFTS)
    return res.data.data
  },

  async createShift(payload: CreateShiftPayload): Promise<Shift> {
    const res = await api.post<ApiResponse<Shift>>(API_ENDPOINTS.ATTENDANCE.SHIFTS, payload)
    return res.data.data
  },

  async updateShift(id: string, payload: UpdateShiftPayload): Promise<Shift> {
    const res = await api.put<ApiResponse<Shift>>(API_ENDPOINTS.ATTENDANCE.SHIFT_BY_ID(id), payload)
    return res.data.data
  },

  async deleteShift(id: string): Promise<{ id: string }> {
    const res = await api.delete<ApiResponse<{ id: string }>>(
      API_ENDPOINTS.ATTENDANCE.SHIFT_BY_ID(id)
    )
    return res.data.data
  },

  async getHolidays(): Promise<Holiday[]> {
    const res = await api.get<ApiResponse<Holiday[]>>(API_ENDPOINTS.ATTENDANCE.HOLIDAYS)
    return res.data.data
  },

  async createHoliday(payload: CreateHolidayPayload): Promise<Holiday> {
    const res = await api.post<ApiResponse<Holiday>>(API_ENDPOINTS.ATTENDANCE.HOLIDAYS, payload)
    return res.data.data
  },

  async updateHoliday(id: string, payload: UpdateHolidayPayload): Promise<Holiday> {
    const res = await api.put<ApiResponse<Holiday>>(
      API_ENDPOINTS.ATTENDANCE.HOLIDAY_BY_ID(id),
      payload
    )
    return res.data.data
  },

  async deleteHoliday(id: string): Promise<{ id: string }> {
    const res = await api.delete<ApiResponse<{ id: string }>>(
      API_ENDPOINTS.ATTENDANCE.HOLIDAY_BY_ID(id)
    )
    return res.data.data
  },

  async getOvertime(): Promise<OvertimeRecord[]> {
    const res = await api.get<ApiResponse<OvertimeRecord[]>>(API_ENDPOINTS.ATTENDANCE.OVERTIME)
    return res.data.data
  },

  async approveOvertime(id: string): Promise<OvertimeRecord> {
    const res = await api.patch<ApiResponse<OvertimeRecord>>(
      API_ENDPOINTS.ATTENDANCE.OVERTIME_APPROVE(id)
    )
    return res.data.data
  },

  async rejectOvertime(id: string): Promise<OvertimeRecord> {
    const res = await api.patch<ApiResponse<OvertimeRecord>>(
      API_ENDPOINTS.ATTENDANCE.OVERTIME_REJECT(id)
    )
    return res.data.data
  },

  async getReportTypes(): Promise<AttendanceReportType[]> {
    const res = await api.get<ApiResponse<AttendanceReportType[]>>(
      API_ENDPOINTS.ATTENDANCE.REPORTS
    )
    return res.data.data
  },

  async generateReport(params: GenerateReportParams): Promise<GenerateReportResult> {
    const res = await api.post<ApiResponse<GenerateReportResult>>(
      API_ENDPOINTS.ATTENDANCE.REPORTS_GENERATE,
      params
    )
    return res.data.data
  },

  async getSettings(): Promise<AttendanceSettingsData> {
    const res = await api.get<ApiResponse<AttendanceSettingsData>>(
      API_ENDPOINTS.ATTENDANCE.SETTINGS
    )
    return res.data.data
  },

  async updateSettings(payload: AttendanceSettingsData): Promise<AttendanceSettingsData> {
    const res = await api.put<ApiResponse<AttendanceSettingsData>>(
      API_ENDPOINTS.ATTENDANCE.SETTINGS,
      payload
    )
    return res.data.data
  },
}

