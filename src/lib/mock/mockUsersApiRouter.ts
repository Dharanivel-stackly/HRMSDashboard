import { ApiError } from '@/lib/api/apiError'
import { mockUserService } from '@/lib/mock/mockUserService'
import type {
  CreateUserPayload,
  UpdateUserPayload,
} from '@/features/admin/users/types/user.types'
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

export async function executeUsersMockRequest(
  request: MockHttpRequest
): Promise<MockHttpResponse> {
  const { method, path, body: rawBody } = request
  const body = parseRequestBody(rawBody)

  try {
    if (method === 'GET' && path === '/users') {
      return success(await mockUserService.getUsers())
    }

    const userByIdMatch = path.match(/^\/users\/([^/]+)$/)
    if (userByIdMatch) {
      const userId = userByIdMatch[1]
      if (method === 'GET') {
        return success(await mockUserService.getUserById(userId))
      }
      if (method === 'PUT') {
        return success(await mockUserService.updateUser(userId, body as UpdateUserPayload))
      }
      if (method === 'DELETE') {
        return success(await mockUserService.deleteUser(userId))
      }
    }

    if (method === 'POST' && path === '/users') {
      return success(await mockUserService.createUser(body as CreateUserPayload))
    }

    return { status: 404, body: { success: false, message: `Route not found: ${method} ${path}` } }
  } catch (error) {
    return failure(error)
  }
}
