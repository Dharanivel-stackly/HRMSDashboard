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

export const recruitmentService = {
  async getRequisitions(params?: any): Promise<PaginatedResponse<Requisition>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Requisition>>>(
      API_ENDPOINTS.RECRUITMENT.REQUISITIONS,
      { params }
    )
    return response.data.data
  },

  async getRequisitionById(id: string): Promise<Requisition> {
    const response = await api.get<ApiResponse<Requisition>>(
      API_ENDPOINTS.RECRUITMENT.REQUISITION_BY_ID(id)
    )
    return response.data.data
  },

  async createRequisition(data: RequisitionFormData): Promise<Requisition> {
    const response = await api.post<ApiResponse<Requisition>>(
      API_ENDPOINTS.RECRUITMENT.REQUISITIONS,
      data
    )
    return response.data.data
  },

  async updateRequisition(id: string, data: Partial<RequisitionFormData>): Promise<Requisition> {
    const response = await api.put<ApiResponse<Requisition>>(
      API_ENDPOINTS.RECRUITMENT.REQUISITION_BY_ID(id),
      data
    )
    return response.data.data
  },

  async getCandidates(params?: CandidateFilters): Promise<PaginatedResponse<Candidate>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Candidate>>>(
      API_ENDPOINTS.RECRUITMENT.CANDIDATES,
      { params }
    )
    return response.data.data
  },

  async getCandidateById(id: string): Promise<Candidate> {
    const response = await api.get<ApiResponse<Candidate>>(
      API_ENDPOINTS.RECRUITMENT.CANDIDATE_BY_ID(id)
    )
    return response.data.data
  },

  async getStats(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/recruitment/stats')
    return response.data.data
  },
  
  async updateCandidateStatus(id: string, status: Candidate['status']): Promise<Candidate> {
    const response = await api.patch<ApiResponse<Candidate>>(
      API_ENDPOINTS.RECRUITMENT.CANDIDATE_STATUS(id),
      { status }
    )
    return response.data.data
  },

  async getInterviews(): Promise<Interview[]> {
    const response = await api.get<ApiResponse<Interview[]>>(
      API_ENDPOINTS.RECRUITMENT.INTERVIEWS
    )
    return response.data.data
  },

  async getOffers(): Promise<Offer[]> {
    const response = await api.get<ApiResponse<Offer[]>>(
      API_ENDPOINTS.RECRUITMENT.OFFERS
    )
    return response.data.data
  },

  async getApprovals(): Promise<Approval[]> {
    const response = await api.get<ApiResponse<Approval[]>>(
      API_ENDPOINTS.RECRUITMENT.APPROVALS
    )
    return response.data.data
  },

  async updateApproval(id: string, status: 'approved' | 'rejected', comments?: string): Promise<Approval> {
    const response = await api.patch<ApiResponse<Approval>>(
      API_ENDPOINTS.RECRUITMENT.APPROVAL_BY_ID(id),
      { status, comments }
    )
    return response.data.data
  },

  async getJobPostings(): Promise<JobPosting[]> {
    const response = await api.get<ApiResponse<JobPosting[]>>(
      API_ENDPOINTS.RECRUITMENT.JOB_POSTINGS
    )
    return response.data.data
  },
}