// src/features/hrms/recruitment/services/recruitmentService.ts
import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type {
  Requisition,
  Candidate,
  Interview,
  Offer,
  Approval,
  JobPosting,
  CandidateFilters,
} from '../types/recruitment.types'
import type { RequisitionFormData } from '../validation/requisition.schema'
import { environment } from '@/config/environment'
import {
  mockRequisitions,
  mockCandidates,
  mockInterviews,
  mockOffers,
  mockApprovals,
  mockJobPostings,
} from '../mock/recruitment.mock'

// Helper to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock implementations
const mockGetRequisitions = async (params?: any): Promise<PaginatedResponse<Requisition>> => {
  await delay()
  let data = [...mockRequisitions]
  if (params?.status) data = data.filter(r => r.status === params.status)
  if (params?.department) data = data.filter(r => r.department === params.department)
  if (params?.search) {
    const q = params.search.toLowerCase()
    data = data.filter(r => r.title.toLowerCase().includes(q))
  }
  const page = params?.page || 1
  const limit = params?.limit || 10
  const start = (page - 1) * limit
  const paginated = data.slice(start, start + limit)
  return {
    data: paginated,
    meta: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  }
}

const mockGetCandidates = async (params?: CandidateFilters): Promise<PaginatedResponse<Candidate>> => {
  await delay()
  let data = [...mockCandidates]
  if (params?.search) {
    const q = params.search.toLowerCase()
    data = data.filter(c => 
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.position.toLowerCase().includes(q)
    )
  }
  if (params?.status) data = data.filter(c => c.status === params.status)
  if (params?.position) data = data.filter(c => c.position === params.position)
  if (params?.source) data = data.filter(c => c.source === params.source)
  if (params?.experienceMin !== undefined) data = data.filter(c => c.experienceYears >= params.experienceMin!)
  if (params?.experienceMax !== undefined) data = data.filter(c => c.experienceYears <= params.experienceMax!)
  const page = params?.page || 1
  const limit = params?.limit || 10
  const start = (page - 1) * limit
  const paginated = data.slice(start, start + limit)
  return {
    data: paginated,
    meta: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  }
}

const mockGetInterviews = async (): Promise<Interview[]> => {
  await delay()
  return mockInterviews
}

const mockGetOffers = async (): Promise<Offer[]> => {
  await delay()
  return mockOffers
}

const mockGetApprovals = async (): Promise<Approval[]> => {
  await delay()
  return mockApprovals
}

const mockGetJobPostings = async (): Promise<JobPosting[]> => {
  await delay()
  return mockJobPostings
}

export const recruitmentService = {
  // Requisitions
  async getRequisitions(params?: any): Promise<PaginatedResponse<Requisition>> {
    if (environment.useMockApi) return mockGetRequisitions(params)
    const response = await api.get<PaginatedResponse<Requisition>>(
      API_ENDPOINTS.RECRUITMENT.REQUISITIONS,
      { params }
    )
    return response.data
  },

  async getRequisitionById(id: string): Promise<Requisition> {
    if (environment.useMockApi) {
      await delay()
      const req = mockRequisitions.find(r => r.id === id)
      if (!req) throw new Error('Requisition not found')
      return req
    }
    const response = await api.get<ApiResponse<Requisition>>(
      API_ENDPOINTS.RECRUITMENT.REQUISITION_BY_ID(id)
    )
    return response.data.data
  },

  async createRequisition(data: RequisitionFormData): Promise<Requisition> {
    if (environment.useMockApi) {
      await delay()
      const newReq: Requisition = {
        id: `req-${Date.now()}`,
        requisitionId: `REQ-2026-${String(mockRequisitions.length + 1).padStart(3, '0')}`,
        title: data.title,
        department: data.department,
        location: data.location,
        jobType: data.jobType,
        positions: data.positions,
        filledPositions: 0,
        description: data.description,
        requirements: data.requirements.split('\n').filter(Boolean),
        qualifications: data.qualifications?.split('\n').filter(Boolean) || [],
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        status: 'draft',
        requestedBy: 'Current User',
        closingDate: data.closingDate,
        priority: data.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockRequisitions.unshift(newReq)
      return newReq
    }
    const response = await api.post<ApiResponse<Requisition>>(
      API_ENDPOINTS.RECRUITMENT.REQUISITIONS,
      data
    )
    return response.data.data
  },

  async updateRequisition(id: string, data: Partial<RequisitionFormData>): Promise<Requisition> {
    if (environment.useMockApi) {
      await delay()
      const index = mockRequisitions.findIndex(r => r.id === id)
      if (index === -1) throw new Error('Requisition not found')
      mockRequisitions[index] = { ...mockRequisitions[index], ...data, updatedAt: new Date().toISOString() }
      return mockRequisitions[index]
    }
    const response = await api.put<ApiResponse<Requisition>>(
      API_ENDPOINTS.RECRUITMENT.REQUISITION_BY_ID(id),
      data
    )
    return response.data.data
  },

  // Candidates
  async getCandidates(params?: CandidateFilters): Promise<PaginatedResponse<Candidate>> {
    if (environment.useMockApi) return mockGetCandidates(params)
    const response = await api.get<PaginatedResponse<Candidate>>(
      API_ENDPOINTS.RECRUITMENT.CANDIDATES,
      { params }
    )
    return response.data
  },

  async getCandidateById(id: string): Promise<Candidate> {
    if (environment.useMockApi) {
      await delay()
      const c = mockCandidates.find(c => c.id === id)
      if (!c) throw new Error('Candidate not found')
      return c
    }
    const response = await api.get<ApiResponse<Candidate>>(
      API_ENDPOINTS.RECRUITMENT.CANDIDATE_BY_ID(id)
    )
    return response.data.data
  },

  async updateCandidateStatus(id: string, status: Candidate['status']): Promise<Candidate> {
    if (environment.useMockApi) {
      await delay()
      const c = mockCandidates.find(c => c.id === id)
      if (!c) throw new Error('Candidate not found')
      c.status = status
      c.updatedAt = new Date().toISOString()
      return c
    }
    const response = await api.patch<ApiResponse<Candidate>>(
      API_ENDPOINTS.RECRUITMENT.CANDIDATE_STATUS(id),
      { status }
    )
    return response.data.data
  },

  // Interviews
  async getInterviews(): Promise<Interview[]> {
    if (environment.useMockApi) return mockGetInterviews()
    const response = await api.get<ApiResponse<Interview[]>>(
      API_ENDPOINTS.RECRUITMENT.INTERVIEWS
    )
    return response.data.data
  },

  // Offers
  async getOffers(): Promise<Offer[]> {
    if (environment.useMockApi) return mockGetOffers()
    const response = await api.get<ApiResponse<Offer[]>>(
      API_ENDPOINTS.RECRUITMENT.OFFERS
    )
    return response.data.data
  },

  // Approvals
  async getApprovals(): Promise<Approval[]> {
    if (environment.useMockApi) return mockGetApprovals()
    const response = await api.get<ApiResponse<Approval[]>>(
      API_ENDPOINTS.RECRUITMENT.APPROVALS
    )
    return response.data.data
  },

  async updateApproval(id: string, status: 'approved' | 'rejected', comments?: string): Promise<Approval> {
    if (environment.useMockApi) {
      await delay()
      const app = mockApprovals.find(a => a.id === id)
      if (!app) throw new Error('Approval not found')
      app.status = status
      app.approver = 'Current User'
      app.approvalDate = new Date().toISOString()
      if (comments) app.comments = comments
      app.updatedAt = new Date().toISOString()
      return app
    }
    const response = await api.patch<ApiResponse<Approval>>(
      API_ENDPOINTS.RECRUITMENT.APPROVAL_BY_ID(id),
      { status, comments }
    )
    return response.data.data
  },

  // Job Postings
  async getJobPostings(): Promise<JobPosting[]> {
    if (environment.useMockApi) return mockGetJobPostings()
    const response = await api.get<ApiResponse<JobPosting[]>>(
      API_ENDPOINTS.RECRUITMENT.JOB_POSTINGS
    )
    return response.data.data
  },
}