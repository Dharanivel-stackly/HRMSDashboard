// src/lib/mock/mockRecruitmentService.ts
import { ApiError } from '@/lib/api/apiError'
import type { PaginatedResponse } from '@/types/api.types'
import {
  mockRequisitions,
  mockCandidates,
  mockInterviews,
  mockOffers,
  mockApprovals,
  mockJobPostings,
  recruitmentStats,
} from '@/features/hrms/recruitment/mock/recruitment.mock'
import type {
  Requisition,
  Candidate,
  Interview,
  Offer,
  Approval,
  JobPosting,
  CandidateFilters,
} from '@/features/hrms/recruitment/types/recruitment.types'
import type { RequisitionFormData } from '@/features/hrms/recruitment/validation/requisition.schema'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

let requisitions = [...mockRequisitions]
let candidates = [...mockCandidates]
let interviews = [...mockInterviews]
let offers = [...mockOffers]
let approvals = [...mockApprovals]
let jobPostings = [...mockJobPostings]

export const mockRecruitmentService = {
  async getRequisitions(params?: any): Promise<PaginatedResponse<Requisition>> {
    await delay()
    let data = [...requisitions]
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
        totalPages: Math.max(1, Math.ceil(data.length / limit)),
      },
    }
  },

  async getRequisitionById(id: string): Promise<Requisition> {
    await delay()
    const req = requisitions.find(r => r.id === id)
    if (!req) throw new ApiError('Requisition not found', 404)
    return req
  },

  async getStats() {
    await delay()
    return recruitmentStats
  },

  async createRequisition(data: RequisitionFormData): Promise<Requisition> {
    await delay()
    const newReq: Requisition = {
      id: `req-${Date.now()}`,
      requisitionId: `REQ-2026-${String(requisitions.length + 1).padStart(3, '0')}`,
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
    requisitions = [newReq, ...requisitions]
    return newReq
  },

  async updateRequisition(id: string, data: Partial<RequisitionFormData>): Promise<Requisition> {
    await delay()
    const index = requisitions.findIndex(r => r.id === id)
    if (index === -1) throw new ApiError('Requisition not found', 404)
    const updated = { ...requisitions[index], ...data, updatedAt: new Date().toISOString() } as Requisition
    requisitions[index] = updated
    return updated
  },

  async getCandidates(params?: CandidateFilters): Promise<PaginatedResponse<Candidate>> {
    await delay()
    let data = [...candidates]
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
    
    const page = params?.page ? Number(params.page) : 1
    const limit = params?.limit ? Number(params.limit) : 10
    const start = (page - 1) * limit
    const paginated = data.slice(start, start + limit)
    
    return {
      data: paginated,
      meta: {
        page,
        limit,
        total: data.length,
        totalPages: Math.max(1, Math.ceil(data.length / limit)),
      },
    }
  },

  async getCandidateById(id: string): Promise<Candidate> {
    await delay()
    const c = candidates.find(c => c.id === id)
    if (!c) throw new ApiError('Candidate not found', 404)
    return c
  },

  async updateCandidateStatus(id: string, status: Candidate['status']): Promise<Candidate> {
    await delay()
    const index = candidates.findIndex(c => c.id === id)
    if (index === -1) throw new ApiError('Candidate not found', 404)
    candidates[index] = { ...candidates[index], status, updatedAt: new Date().toISOString() }
    return candidates[index]
  },

  async getInterviews(): Promise<Interview[]> {
    await delay()
    return [...interviews]
  },

  async getOffers(): Promise<Offer[]> {
    await delay()
    return [...offers]
  },

  async getApprovals(): Promise<Approval[]> {
    await delay()
    return [...approvals]
  },

  async updateApproval(id: string, status: 'approved' | 'rejected', comments?: string): Promise<Approval> {
    await delay()
    const index = approvals.findIndex(a => a.id === id)
    if (index === -1) throw new ApiError('Approval not found', 404)
    approvals[index] = {
      ...approvals[index],
      status,
      approver: 'Current User',
      approvalDate: new Date().toISOString(),
      comments: comments || approvals[index].comments,
      updatedAt: new Date().toISOString()
    }
    return approvals[index]
  },

  async getJobPostings(): Promise<JobPosting[]> {
    await delay()
    return [...jobPostings]
  }
}