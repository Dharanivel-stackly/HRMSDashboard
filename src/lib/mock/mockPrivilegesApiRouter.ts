import { ApiError } from '@/lib/api/apiError'
import { mockRolePrivilegeService } from '@/lib/mock/mockRolePrivilegeService'
import type { UpdateRolePrivilegesPayload } from '@/features/admin/privileges/types/privilege.types'
import type { MockHttpRequest, MockHttpResponse } from '@/lib/mock/mockAttendanceApiRouter'
import { parseRequestBody } from '@/lib/api/requestBody'
import type { Role } from '@/lib/constants/roles'

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

export async function executePrivilegesMockRequest(
  request: MockHttpRequest
): Promise<MockHttpResponse> {
  const { method, path, body: rawBody } = request
  const body = parseRequestBody(rawBody)

  try {
    if (method === 'GET' && path === '/role-privileges') {
      return success(await mockRolePrivilegeService.getMatrix())
    }

    if (method === 'PUT' && path === '/role-privileges') {
      const payload = body as UpdateRolePrivilegesPayload
      return success(
        await mockRolePrivilegeService.updateRolePermissions(payload.role, payload.permissions)
      )
    }

    const resetMatch = path.match(/^\/role-privileges\/([^/]+)\/reset$/)
    if (method === 'POST' && resetMatch) {
      return success(await mockRolePrivilegeService.resetRole(resetMatch[1] as Role))
    }

    return {
      status: 404,
      body: { success: false, message: `Route not found: ${method} ${path}` },
    }
  } catch (error) {
    return failure(error)
  }
}
