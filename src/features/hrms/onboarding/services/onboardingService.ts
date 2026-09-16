// src/features/hrms/onboarding/services/onboardingService.ts
import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type {
  OnboardingEmployee,
  Document,
  BackgroundVerification,
  PolicyAcceptance as PolicyAcceptanceType,
  AssetAllocation,
  OnboardingTask,
  OnboardingStats,
  ITTask,
  ManagerTask,
  HRTask,
} from '../types/onboarding.types'
import type {
  OnboardingEmployeeUpdate,
  DocumentUpload,
  DocumentVerification,
  PolicyAcceptance,
  AssetAllocation as AssetAllocationSchema,
} from '../validation/onboarding.schema'

export const onboardingService = {
  async getOnboardingEmployees(params?: {
    page?: number
    limit?: number
    status?: OnboardingEmployee['status']
    search?: string
  }): Promise<PaginatedResponse<OnboardingEmployee>> {
    const response = await api.get<ApiResponse<PaginatedResponse<OnboardingEmployee>>>(
      API_ENDPOINTS.ONBOARDING.BASE,
      { params }
    )
    return response.data.data
  },

  async getOnboardingEmployeeById(id: string): Promise<OnboardingEmployee> {
    const response = await api.get<ApiResponse<OnboardingEmployee>>(
      API_ENDPOINTS.ONBOARDING.BY_ID(id)
    )
    return response.data.data
  },

  async updateOnboardingEmployee(
    id: string,
    data: OnboardingEmployeeUpdate
  ): Promise<OnboardingEmployee> {
    const response = await api.patch<ApiResponse<OnboardingEmployee>>(
      API_ENDPOINTS.ONBOARDING.UPDATE(id),
      data
    )
    return response.data.data
  },

  async getDocuments(employeeId?: string): Promise<Document[]> {
    const response = await api.get<ApiResponse<Document[]>>(
      API_ENDPOINTS.ONBOARDING.DOCUMENTS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async uploadDocument(data: FormData): Promise<Document> {
    const response = await api.post<ApiResponse<Document>>(
      API_ENDPOINTS.ONBOARDING.UPLOAD_DOCUMENT,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data.data
  },

  async verifyDocument(data: DocumentVerification): Promise<Document> {
    const response = await api.patch<ApiResponse<Document>>(
      API_ENDPOINTS.ONBOARDING.VERIFY_DOCUMENT(data.documentId),
      data
    )
    return response.data.data
  },

  async getBackgroundVerifications(employeeId?: string): Promise<BackgroundVerification[]> {
    const response = await api.get<ApiResponse<BackgroundVerification[]>>(
      API_ENDPOINTS.ONBOARDING.BACKGROUND_VERIFICATIONS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async getPolicyAcceptances(employeeId?: string): Promise<PolicyAcceptanceType[]> {
    const response = await api.get<ApiResponse<PolicyAcceptanceType[]>>(
      API_ENDPOINTS.ONBOARDING.POLICY_ACCEPTANCES,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async acceptPolicy(data: PolicyAcceptance): Promise<PolicyAcceptanceType> {
    const response = await api.patch<ApiResponse<PolicyAcceptanceType>>(
      API_ENDPOINTS.ONBOARDING.ACCEPT_POLICY(data.policyId),
      data
    )
    return response.data.data
  },

  async getAssetAllocations(employeeId?: string): Promise<AssetAllocation[]> {
    const response = await api.get<ApiResponse<AssetAllocation[]>>(
      API_ENDPOINTS.ONBOARDING.ASSETS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async allocateAsset(data: AssetAllocationSchema): Promise<AssetAllocation> {
    const response = await api.post<ApiResponse<AssetAllocation>>(
      API_ENDPOINTS.ONBOARDING.ALLOCATE_ASSET,
      data
    )
    return response.data.data
  },

  async getOnboardingTasks(params?: {
    employeeId?: string
    status?: OnboardingTask['status']
  }): Promise<OnboardingTask[]> {
    const response = await api.get<ApiResponse<OnboardingTask[]>>(
      API_ENDPOINTS.ONBOARDING.TASKS,
      { params }
    )
    return response.data.data
  },

  async updateTaskStatus(taskId: string, status: OnboardingTask['status']): Promise<OnboardingTask> {
    const response = await api.patch<ApiResponse<OnboardingTask>>(
      API_ENDPOINTS.ONBOARDING.UPDATE_TASK(taskId),
      { status }
    )
    return response.data.data
  },

  async getOnboardingStats(): Promise<OnboardingStats> {
    const response = await api.get<ApiResponse<OnboardingStats>>(
      API_ENDPOINTS.ONBOARDING.STATS
    )
    return response.data.data
  },

  async getITTasks(employeeId?: string): Promise<ITTask[]> {
    const response = await api.get<ApiResponse<ITTask[]>>(
      API_ENDPOINTS.ONBOARDING.IT_TASKS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async getManagerTasks(employeeId?: string): Promise<ManagerTask[]> {
    const response = await api.get<ApiResponse<ManagerTask[]>>(
      API_ENDPOINTS.ONBOARDING.MANAGER_TASKS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async getHRTasks(employeeId?: string): Promise<HRTask[]> {
    const response = await api.get<ApiResponse<HRTask[]>>(
      API_ENDPOINTS.ONBOARDING.HR_TASKS,
      { params: { employeeId } }
    )
    return response.data.data
  },
}