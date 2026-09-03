// src/lib/mock/mockOnboardingApiRouter.ts
import { ApiError } from '@/lib/api/apiError'
import { mockOnboardingService } from './mockOnboardingService'
import type { MockHttpRequest, MockHttpResponse } from './mockApi'
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

export async function executeOnboardingMockRequest(request: MockHttpRequest): Promise<MockHttpResponse> {
  const { method, path, query, body: rawBody } = request
  const body = parseRequestBody(rawBody)

  try {
    if (method === 'GET' && path === '/onboarding') {
      return success(await mockOnboardingService.getOnboardingEmployees(query))
    }

    const empByIdMatch = path.match(/^\/onboarding\/([^/]+)$/)
    if (empByIdMatch && !['documents', 'background', 'policies', 'assets', 'tasks', 'stats', 'it-tasks', 'manager-tasks', 'hr-tasks'].includes(empByIdMatch[1])) {
      if (method === 'GET') return success(await mockOnboardingService.getOnboardingEmployeeById(empByIdMatch[1]))
      if (method === 'PATCH') return success(await mockOnboardingService.updateOnboardingEmployee(empByIdMatch[1], body as any))
    }

    if (method === 'GET' && path === '/onboarding/documents') {
      return success(await mockOnboardingService.getDocuments(query.employeeId))
    }
    if (method === 'POST' && path === '/onboarding/documents/upload') {
      return success(await mockOnboardingService.uploadDocument(body as any))
    }
    const verifyDocMatch = path.match(/^\/onboarding\/documents\/([^/]+)\/verify$/)
    if (verifyDocMatch && method === 'PATCH') {
      const payload = body as any
      return success(await mockOnboardingService.verifyDocument({ documentId: verifyDocMatch[1], ...payload }))
    }

    if (method === 'GET' && path === '/onboarding/background') {
      return success(await mockOnboardingService.getBackgroundVerifications(query.employeeId))
    }

    if (method === 'GET' && path === '/onboarding/policies') {
      return success(await mockOnboardingService.getPolicyAcceptances(query.employeeId))
    }
    const policyAcceptMatch = path.match(/^\/onboarding\/policies\/([^/]+)\/accept$/)
    if (policyAcceptMatch && method === 'PATCH') {
      return success(await mockOnboardingService.acceptPolicy({ policyId: policyAcceptMatch[1], accepted: (body as any).accepted }))
    }

    if (method === 'GET' && path === '/onboarding/assets') {
      return success(await mockOnboardingService.getAssetAllocations(query.employeeId))
    }
    if (method === 'POST' && path === '/onboarding/assets/allocate') {
      return success(await mockOnboardingService.allocateAsset(body as any))
    }

    if (method === 'GET' && path === '/onboarding/tasks') {
      return success(await mockOnboardingService.getOnboardingTasks(query))
    }
    const taskMatch = path.match(/^\/onboarding\/tasks\/([^/]+)$/)
    if (taskMatch && method === 'PATCH') {
      return success(await mockOnboardingService.updateTaskStatus(taskMatch[1], (body as any).status))
    }

    if (method === 'GET' && path === '/onboarding/stats') {
      return success(await mockOnboardingService.getOnboardingStats())
    }

    if (method === 'GET' && path === '/onboarding/it-tasks') {
      return success(await mockOnboardingService.getITTasks(query.employeeId))
    }
    if (method === 'GET' && path === '/onboarding/manager-tasks') {
      return success(await mockOnboardingService.getManagerTasks(query.employeeId))
    }
    if (method === 'GET' && path === '/onboarding/hr-tasks') {
      return success(await mockOnboardingService.getHRTasks(query.employeeId))
    }

    return { status: 404, body: { success: false, message: `Route not found: ${method} ${path}` } }
  } catch (error) {
    return failure(error)
  }
}