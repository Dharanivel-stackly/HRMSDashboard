import { executeAttendanceMockRequest } from '@/lib/mock/mockAttendanceApiRouter'
import { executeUsersMockRequest } from '@/lib/mock/mockUsersApiRouter'
import { executeAuthMockRequest } from '@/lib/mock/mockAuthApiRouter'
import type { MockHttpRequest, MockHttpResponse } from '@/lib/mock/mockAttendanceApiRouter'

export type { MockHttpRequest, MockHttpResponse }

export async function executeMockApiRequest(
  request: MockHttpRequest & { headers?: Record<string, string> }
): Promise<MockHttpResponse> {
  if (request.path.startsWith('/auth')) {
    return executeAuthMockRequest(request)
  }

  if (request.path.startsWith('/attendance')) {
    return executeAttendanceMockRequest(request)
  }

  if (request.path.startsWith('/users')) {
    return executeUsersMockRequest(request)
  }

  return { status: 404, body: { success: false, message: `Route not found: ${request.method} ${request.path}` } }
}
