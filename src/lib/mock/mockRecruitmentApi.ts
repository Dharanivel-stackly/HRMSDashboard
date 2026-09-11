// src/lib/mock/mockRecruitmentApiRouter.ts
import { ApiError } from '@/lib/api/apiError'
import { mockRecruitmentService } from './mockRecruitmentService'
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

export async function executeRecruitmentMockRequest(request: MockHttpRequest): Promise<MockHttpResponse> {
  const { method, path, query, body: rawBody } = request
  const body = parseRequestBody(rawBody)

  try {
    if (method === 'GET' && path === '/recruitment/stats') {
      return success(await mockRecruitmentService.getStats())
    }
    if (method === 'GET' && path === '/recruitment/requisitions') {
      return success(await mockRecruitmentService.getRequisitions(query))
    }
    if (method === 'POST' && path === '/recruitment/requisitions') {
      return success(await mockRecruitmentService.createRequisition(body as any))
    }
    const reqByIdMatch = path.match(/^\/recruitment\/requisitions\/([^/]+)$/)
    if (reqByIdMatch) {
      if (method === 'GET') return success(await mockRecruitmentService.getRequisitionById(reqByIdMatch[1]))
      if (method === 'PUT') return success(await mockRecruitmentService.updateRequisition(reqByIdMatch[1], body as any))
    }

    if (method === 'GET' && path === '/recruitment/candidates') {
      return success(await mockRecruitmentService.getCandidates(query))
    }
    const candByIdMatch = path.match(/^\/recruitment\/candidates\/([^/]+)$/)
    if (candByIdMatch && method === 'GET') {
      return success(await mockRecruitmentService.getCandidateById(candByIdMatch[1]))
    }
    const candStatusMatch = path.match(/^\/recruitment\/candidates\/([^/]+)\/status$/)
    if (candStatusMatch && method === 'PATCH') {
      const b = body as { status: any }
      return success(await mockRecruitmentService.updateCandidateStatus(candStatusMatch[1], b.status))
    }

    if (method === 'GET' && path === '/recruitment/interviews') {
      return success(await mockRecruitmentService.getInterviews())
    }

    if (method === 'GET' && path === '/recruitment/offers') {
      return success(await mockRecruitmentService.getOffers())
    }

    if (method === 'GET' && path === '/recruitment/approvals') {
      return success(await mockRecruitmentService.getApprovals())
    }
    const appByIdMatch = path.match(/^\/recruitment\/approvals\/([^/]+)$/)
    if (appByIdMatch && method === 'PATCH') {
      const b = body as { status: any, comments?: string }
      return success(await mockRecruitmentService.updateApproval(appByIdMatch[1], b.status, b.comments))
    }

    if (method === 'GET' && path === '/recruitment/job-postings') {
      return success(await mockRecruitmentService.getJobPostings())
    }

    return { status: 404, body: { success: false, message: `Route not found: ${method} ${path}` } }
  } catch (error) {
    return failure(error)
  }
}