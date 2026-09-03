import { ApiError } from '@/lib/api/apiError'
import type { ApiResponse } from '@/types/api.types'

// Import individual module routers
//import { executeAuthMockRequest } from './mockAuthApiRouter'
//import { executeAttendanceMockRequest } from './mockAttendanceApiRouter'
//import { executeUsersMockRequest } from './mockUsersApiRouter'
import { executeRecruitmentMockRequest } from './mockRecruitmentApi'
import { executeOnboardingMockRequest } from './mockOnboardingApi'

// --- Shared Types ---
export type MockHttpRequest = {
  method: string
  path: string
  query: Record<string, string>
  body?: unknown
  headers?: Record<string, string> // Added headers for auth/token validation
}

export type MockHttpResponse = {
  status: number
  body: ApiResponse<unknown> | { success: false; message: string }
}

// --- Shared Helper Functions ---
export function success<T>(data: T, message = 'OK'): MockHttpResponse {
  return { status: 200, body: { success: true, data, message } }
}

export function failure(error: unknown): MockHttpResponse {
  if (error instanceof ApiError) {
    return { status: error.status, body: { success: false, message: error.message } }
  }
  const message = error instanceof Error ? error.message : 'Internal server error'
  return { status: 500, body: { success: false, message } }
}

// --- Central API Router ---
export async function executeMockApiRequest(
  request: MockHttpRequest
): Promise<MockHttpResponse> {
  const { path } = request

  {/*if (path.startsWith('/auth')) {
    return executeAuthMockRequest(request)
  }
  if (path.startsWith('/attendance')) {
    return executeAttendanceMockRequest(request)
  }
  if (path.startsWith('/users')) {
    return executeUsersMockRequest(request)
  }*/}
  if (path.startsWith('/recruitment')) {
    return executeRecruitmentMockRequest(request)
  }
  if (path.startsWith('/onboarding')) {
    return executeOnboardingMockRequest(request)
  }

  // Fallback for unhandled routes
  return { 
    status: 404, 
    body: { success: false, message: `Route not found: ${request.method} ${path}` } 
  }
}