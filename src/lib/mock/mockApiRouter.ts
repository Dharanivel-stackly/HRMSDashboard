import { executeAttendanceMockRequest } from '@/lib/mock/mockAttendanceApiRouter'
import { executeUsersMockRequest } from '@/lib/mock/mockUsersApiRouter'
import { executeAuthMockRequest } from '@/lib/mock/mockAuthApiRouter'
import { executePrivilegesMockRequest } from '@/lib/mock/mockPrivilegesApiRouter'
import { executePerformanceMockRequest } from '@/lib/mock/mockPerformanceApiRouter'
import type { MockHttpRequest, MockHttpResponse } from '@/lib/mock/mockAttendanceApiRouter'
import { executeNotificationMockRequest } from './mockNotificationApi'
import { executeOnboardingMockRequest } from './mockOnboardingApi'
import { executeRecruitmentMockRequest } from './mockRecruitmentApi'

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

  if (request.path.startsWith('/role-privileges')) {
    return executePrivilegesMockRequest(request)
  }
  if (request.path.startsWith('/recruitment')) {
      return executeRecruitmentMockRequest(request)
    }
    if (request.path.startsWith('/onboarding')) {
      return executeOnboardingMockRequest(request)
    }
    if (request.path.startsWith('/notifications')) {
      return executeNotificationMockRequest(request)
    }

  if (request.path.startsWith('/performance')) {
    return executePerformanceMockRequest(request)
  }

  return {
    status: 404,
    body: { success: false, message: `Route not found: ${request.method} ${request.path}` },
  }
}
