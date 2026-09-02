import { ApiError } from '@/lib/api/apiError'
import { mockAttendanceService } from '@/lib/mock/mockAttendanceService'
import type {
  AttendanceFilters,
  AttendanceSettingsData,
  CorrectionStatus,
  CreateCorrectionPayload,
  CreateHolidayPayload,
  CreateShiftPayload,
  GenerateReportParams,
  UpdateHolidayPayload,
  UpdateShiftPayload,
} from '@/features/hrms/attendance/types/attendance.types'
import type { ApiResponse } from '@/types/api.types'
import { parseRequestBody } from '@/lib/api/requestBody'

export type MockHttpRequest = {
  method: string
  path: string
  query: Record<string, string>
  body?: unknown
}

export type MockHttpResponse = {
  status: number
  body: ApiResponse<unknown> | { success: false; message: string }
}

function success<T>(data: T, message = 'OK'): MockHttpResponse {
  return { status: 200, body: { success: true, data, message } }
}

function failure(error: unknown): MockHttpResponse {
  if (error instanceof ApiError) {
    return { status: error.status, body: { success: false, message: error.message } }
  }
  const message = error instanceof Error ? error.message : 'Internal server error'
  return { status: 500, body: { success: false, message } }
}

export async function executeAttendanceMockRequest(
  request: MockHttpRequest
): Promise<MockHttpResponse> {
  const { method, path, query, body: rawBody } = request
  const body = parseRequestBody(rawBody)

  try {
    if (method === 'GET' && path === '/attendance/dashboard') {
      return success(await mockAttendanceService.getDashboard(query as AttendanceFilters))
    }

    if (method === 'GET' && path === '/attendance/daily') {
      return success(await mockAttendanceService.getDailyAttendance(query as AttendanceFilters))
    }

    if (method === 'GET' && path === '/attendance/my') {
      return success(await mockAttendanceService.getMyAttendance(query.month ?? ''))
    }

    if (method === 'GET' && path === '/attendance/calendar') {
      return success(await mockAttendanceService.getCalendar(query.month ?? ''))
    }

    if (method === 'GET' && path === '/attendance/session') {
      return success(await mockAttendanceService.getSession())
    }

    if (method === 'POST' && path === '/attendance/check-in') {
      return success(await mockAttendanceService.checkIn())
    }

    if (method === 'POST' && path === '/attendance/check-out') {
      return success(await mockAttendanceService.checkOut())
    }

    if (method === 'GET' && path === '/attendance/corrections') {
      return success(
        await mockAttendanceService.getCorrections(query.status as CorrectionStatus | 'all')
      )
    }

    if (method === 'POST' && path === '/attendance/corrections') {
      return success(
        await mockAttendanceService.createCorrection(body as CreateCorrectionPayload)
      )
    }

    if (method === 'GET' && path === '/attendance/shifts') {
      return success(await mockAttendanceService.getShifts())
    }

    if (method === 'POST' && path === '/attendance/shifts') {
      return success(await mockAttendanceService.createShift(body as CreateShiftPayload))
    }

    const shiftByIdMatch = path.match(/^\/attendance\/shifts\/([^/]+)$/)
    if (shiftByIdMatch) {
      const shiftId = shiftByIdMatch[1]
      if (method === 'PUT') {
        return success(
          await mockAttendanceService.updateShift(shiftId, body as UpdateShiftPayload)
        )
      }
      if (method === 'DELETE') {
        return success(await mockAttendanceService.deleteShift(shiftId))
      }
    }

    if (method === 'GET' && path === '/attendance/holidays') {
      return success(await mockAttendanceService.getHolidays())
    }

    if (method === 'POST' && path === '/attendance/holidays') {
      return success(await mockAttendanceService.createHoliday(body as CreateHolidayPayload))
    }

    const holidayByIdMatch = path.match(/^\/attendance\/holidays\/([^/]+)$/)
    if (holidayByIdMatch) {
      const holidayId = holidayByIdMatch[1]
      if (method === 'PUT') {
        return success(
          await mockAttendanceService.updateHoliday(holidayId, body as UpdateHolidayPayload)
        )
      }
      if (method === 'DELETE') {
        return success(await mockAttendanceService.deleteHoliday(holidayId))
      }
    }

    if (method === 'GET' && path === '/attendance/overtime') {
      return success(await mockAttendanceService.getOvertime())
    }

    const approveMatch = path.match(/^\/attendance\/overtime\/([^/]+)\/approve$/)
    if (method === 'PATCH' && approveMatch) {
      return success(await mockAttendanceService.approveOvertime(approveMatch[1]))
    }

    const rejectMatch = path.match(/^\/attendance\/overtime\/([^/]+)\/reject$/)
    if (method === 'PATCH' && rejectMatch) {
      return success(await mockAttendanceService.rejectOvertime(rejectMatch[1]))
    }

    if (method === 'GET' && path === '/attendance/reports/types') {
      return success(await mockAttendanceService.getReportTypes())
    }

    if (method === 'POST' && path === '/attendance/reports/generate') {
      return success(await mockAttendanceService.generateReport(body as GenerateReportParams))
    }

    if (method === 'GET' && path === '/attendance/settings') {
      return success(await mockAttendanceService.getSettings())
    }

    if (method === 'PUT' && path === '/attendance/settings') {
      return success(
        await mockAttendanceService.updateSettings(body as AttendanceSettingsData)
      )
    }

    return { status: 404, body: { success: false, message: `Route not found: ${method} ${path}` } }
  } catch (error) {
    return failure(error)
  }
}
