import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { attendanceService } from '../services/attendanceService'
import type {
  AttendanceFilters,
  AttendanceSettingsData,
  CorrectionStatus,
  CreateCorrectionPayload,
  CreateHolidayPayload,
  CreateShiftPayload,
  GenerateReportParams,
  CorrectionRequest,
  Holiday,
  Shift,
  UpdateHolidayPayload,
  UpdateShiftPayload,
} from '../types/attendance.types'

export const attendanceKeys = {
  all: ['attendance'] as const,
  dashboard: (filters?: AttendanceFilters) => [...attendanceKeys.all, 'dashboard', filters] as const,
  daily: (filters?: AttendanceFilters) => [...attendanceKeys.all, 'daily', filters] as const,
  my: (month: string) => [...attendanceKeys.all, 'my', month] as const,
  calendar: (month: string) => [...attendanceKeys.all, 'calendar', month] as const,
  session: () => [...attendanceKeys.all, 'session'] as const,
  corrections: (status?: CorrectionStatus | 'all') =>
    [...attendanceKeys.all, 'corrections', status] as const,
  shifts: () => [...attendanceKeys.all, 'shifts'] as const,
  holidays: () => [...attendanceKeys.all, 'holidays'] as const,
  overtime: () => [...attendanceKeys.all, 'overtime'] as const,
  reportTypes: () => [...attendanceKeys.all, 'report-types'] as const,
  settings: () => [...attendanceKeys.all, 'settings'] as const,
}

export function useAttendanceDashboard(filters?: AttendanceFilters) {
  return useQuery({
    queryKey: attendanceKeys.dashboard(filters),
    queryFn: () => attendanceService.getDashboard(filters),
  })
}

export function useDailyAttendance(filters?: AttendanceFilters) {
  return useQuery({
    queryKey: attendanceKeys.daily(filters),
    queryFn: () => attendanceService.getDailyAttendance(filters),
  })
}

export function useMyAttendance(month: string) {
  return useQuery({
    queryKey: attendanceKeys.my(month),
    queryFn: () => attendanceService.getMyAttendance(month),
  })
}

export function useAttendanceCalendar(month: string) {
  return useQuery({
    queryKey: attendanceKeys.calendar(month),
    queryFn: () => attendanceService.getCalendar(month),
  })
}

export function useCheckInSession() {
  return useQuery({
    queryKey: attendanceKeys.session(),
    queryFn: () => attendanceService.getSession(),
  })
}

export function useCheckIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => attendanceService.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all })
    },
  })
}

export function useCheckOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => attendanceService.checkOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all })
    },
  })
}

export function useCorrections(status?: CorrectionStatus | 'all') {
  return useQuery({
    queryKey: attendanceKeys.corrections(status),
    queryFn: () => attendanceService.getCorrections(status),
  })
}

export function useCreateCorrection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCorrectionPayload) =>
      attendanceService.createCorrection(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<CorrectionRequest[]>(
        attendanceKeys.corrections('all'),
        (current = []) => [created, ...current]
      )
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all })
    },
  })
}

export function useShifts() {
  return useQuery({
    queryKey: attendanceKeys.shifts(),
    queryFn: () => attendanceService.getShifts(),
  })
}

export function useCreateShift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateShiftPayload) => attendanceService.createShift(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<Shift[]>(attendanceKeys.shifts(), (current = []) => [
        created,
        ...current,
      ])
      queryClient.invalidateQueries({ queryKey: attendanceKeys.shifts() })
    },
  })
}

export function useUpdateShift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShiftPayload }) =>
      attendanceService.updateShift(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<Shift[]>(attendanceKeys.shifts(), (current = []) =>
        current.map((shift) => (shift.id === updated.id ? updated : shift))
      )
      queryClient.invalidateQueries({ queryKey: attendanceKeys.shifts() })
    },
  })
}

export function useDeleteShift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => attendanceService.deleteShift(id),
    onSuccess: ({ id }) => {
      queryClient.setQueryData<Shift[]>(attendanceKeys.shifts(), (current = []) =>
        current.filter((shift) => shift.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: attendanceKeys.shifts() })
    },
  })
}

export function useHolidays() {
  return useQuery({
    queryKey: attendanceKeys.holidays(),
    queryFn: () => attendanceService.getHolidays(),
  })
}

export function useCreateHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateHolidayPayload) => attendanceService.createHoliday(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<Holiday[]>(attendanceKeys.holidays(), (current = []) => [
        created,
        ...current,
      ])
      queryClient.invalidateQueries({ queryKey: attendanceKeys.holidays() })
    },
  })
}

export function useUpdateHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHolidayPayload }) =>
      attendanceService.updateHoliday(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<Holiday[]>(attendanceKeys.holidays(), (current = []) =>
        current.map((holiday) => (holiday.id === updated.id ? updated : holiday))
      )
      queryClient.invalidateQueries({ queryKey: attendanceKeys.holidays() })
    },
  })
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => attendanceService.deleteHoliday(id),
    onSuccess: ({ id }) => {
      queryClient.setQueryData<Holiday[]>(attendanceKeys.holidays(), (current = []) =>
        current.filter((holiday) => holiday.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: attendanceKeys.holidays() })
    },
  })
}

export function useOvertime() {
  return useQuery({
    queryKey: attendanceKeys.overtime(),
    queryFn: () => attendanceService.getOvertime(),
  })
}

export function useApproveOvertime() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => attendanceService.approveOvertime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.overtime() })
    },
  })
}

export function useRejectOvertime() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => attendanceService.rejectOvertime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.overtime() })
    },
  })
}

export function useReportTypes() {
  return useQuery({
    queryKey: attendanceKeys.reportTypes(),
    queryFn: () => attendanceService.getReportTypes(),
  })
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: (params: GenerateReportParams) => attendanceService.generateReport(params),
  })
}

export function useAttendanceSettings() {
  return useQuery({
    queryKey: attendanceKeys.settings(),
    queryFn: () => attendanceService.getSettings(),
  })
}

export function useUpdateAttendanceSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AttendanceSettingsData) =>
      attendanceService.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.settings() })
    },
  })
}
