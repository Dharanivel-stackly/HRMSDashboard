import { ApiError } from '@/lib/api/apiError'
import { mockUserService } from '@/lib/mock/mockUserService'
import type { LoginCredentials } from '@/types/auth.types'
import type { MockHttpRequest, MockHttpResponse } from '@/lib/mock/mockAttendanceApiRouter'
import { parseRequestBody } from '@/lib/api/requestBody'

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

function userIdFromAuthHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer demo-token-')) return null
  return authHeader.replace('Bearer demo-token-', '').trim() || null
}

export async function executeAuthMockRequest(
  request: MockHttpRequest & { headers?: Record<string, string> }
): Promise<MockHttpResponse> {
  const { method, path, body: rawBody, headers = {} } = request
  const body = parseRequestBody(rawBody)

  try {
    if (method === 'POST' && path === '/auth/login') {
      const credentials = body as LoginCredentials
      const user = await mockUserService.authenticate(credentials.email, credentials.password)
      return success({
        user,
        accessToken: `demo-token-${user.id}`,
        refreshToken: `demo-refresh-${user.id}`,
      })
    }

    if (method === 'POST' && path === '/auth/logout') {
      return success(null, 'Logged out')
    }

    if (method === 'POST' && path === '/auth/forgot-password') {
      return success(null, 'Password reset email sent')
    }

    if (method === 'GET' && path === '/auth/me') {
      const userId = userIdFromAuthHeader(headers.authorization ?? headers.Authorization)
      if (!userId) {
        return failure(new ApiError('Unauthorized', 401))
      }
      const user = await mockUserService.getUserById(userId)
      return success(user)
    }

    return { status: 404, body: { success: false, message: `Route not found: ${method} ${path}` } }
  } catch (error) {
    return failure(error)
  }
}
