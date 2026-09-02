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
import { environment } from '@/config/environment'
import {
  mockOnboardingEmployees,
  mockDocuments,
  mockBackgroundVerifications,
  mockPolicyAcceptances,
  mockAssetAllocations,
  mockOnboardingTasks,
  mockOnboardingStats,
  mockITTasks,
  mockManagerTasks,
  mockHRTasks,
} from '../mock/onboarding.mock'

// Helper delay for mock
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const onboardingService = {
  // ---- Onboarding Employees ----
  async getOnboardingEmployees(params?: {
    page?: number
    limit?: number
    status?: OnboardingEmployee['status']
    search?: string
  }): Promise<PaginatedResponse<OnboardingEmployee>> {
    if (environment.useMockApi) {
      await delay()
      let data = [...mockOnboardingEmployees]
      if (params?.status) data = data.filter((e) => e.status === params.status)
      if (params?.search) {
        const q = params.search.toLowerCase()
        data = data.filter(
          (e) =>
            e.firstName.toLowerCase().includes(q) ||
            e.lastName.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        )
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
    const response = await api.get<PaginatedResponse<OnboardingEmployee>>(
      API_ENDPOINTS.ONBOARDING.BASE,
      { params }
    )
    return response.data
  },

  async getOnboardingEmployeeById(id: string): Promise<OnboardingEmployee> {
    if (environment.useMockApi) {
      await delay()
      const emp = mockOnboardingEmployees.find((e) => e.id === id)
      if (!emp) throw new Error('Employee not found')
      return emp
    }
    const response = await api.get<ApiResponse<OnboardingEmployee>>(
      API_ENDPOINTS.ONBOARDING.BY_ID(id)
    )
    return response.data.data
  },

  async updateOnboardingEmployee(
    id: string,
    data: OnboardingEmployeeUpdate
  ): Promise<OnboardingEmployee> {
    if (environment.useMockApi) {
      await delay()
      const index = mockOnboardingEmployees.findIndex((e) => e.id === id)
      if (index === -1) throw new Error('Employee not found')
      mockOnboardingEmployees[index] = {
        ...mockOnboardingEmployees[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return mockOnboardingEmployees[index]
    }
    const response = await api.patch<ApiResponse<OnboardingEmployee>>(
      API_ENDPOINTS.ONBOARDING.UPDATE(id),
      data
    )
    return response.data.data
  },

  // ---- Documents ----
  async getDocuments(employeeId?: string): Promise<Document[]> {
    if (environment.useMockApi) {
      await delay()
      let docs = [...mockDocuments]
      if (employeeId) docs = docs.filter((d) => d.employeeId === employeeId)
      return docs
    }
    const response = await api.get<ApiResponse<Document[]>>(
      API_ENDPOINTS.ONBOARDING.DOCUMENTS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async uploadDocument(data: FormData): Promise<Document> {
    if (environment.useMockApi) {
      await delay()
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        employeeId: data.get('employeeId') as string,
        employeeName: 'Mock Employee',
        documentType: data.get('documentType') as Document['documentType'],
        documentName: (data.get('file') as File).name,
        status: 'uploaded',
        uploadedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockDocuments.unshift(newDoc)
      return newDoc
    }
    const response = await api.post<ApiResponse<Document>>(
      API_ENDPOINTS.ONBOARDING.UPLOAD_DOCUMENT,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data.data
  },

  async verifyDocument(data: DocumentVerification): Promise<Document> {
    if (environment.useMockApi) {
      await delay()
      const doc = mockDocuments.find((d) => d.id === data.documentId)
      if (!doc) throw new Error('Document not found')
      doc.status = data.status
      doc.verifiedDate = new Date().toISOString()
      doc.verifiedBy = 'Current User'
      doc.comments = data.comments
      doc.updatedAt = new Date().toISOString()
      return doc
    }
    const response = await api.patch<ApiResponse<Document>>(
      API_ENDPOINTS.ONBOARDING.VERIFY_DOCUMENT(data.documentId),
      data
    )
    return response.data.data
  },

  // ---- Background Verification ----
  async getBackgroundVerifications(employeeId?: string): Promise<BackgroundVerification[]> {
    if (environment.useMockApi) {
      await delay()
      let list = [...mockBackgroundVerifications]
      if (employeeId) list = list.filter((b) => b.employeeId === employeeId)
      return list
    }
    const response = await api.get<ApiResponse<BackgroundVerification[]>>(
      API_ENDPOINTS.ONBOARDING.BACKGROUND_VERIFICATIONS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  // ---- Policy Acceptances ----
  async getPolicyAcceptances(employeeId?: string): Promise<PolicyAcceptanceType[]> {
    if (environment.useMockApi) {
      await delay()
      let list = [...mockPolicyAcceptances]
      if (employeeId) list = list.filter((p) => p.employeeId === employeeId)
      return list
    }
    const response = await api.get<ApiResponse<PolicyAcceptanceType[]>>(
      API_ENDPOINTS.ONBOARDING.POLICY_ACCEPTANCES,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async acceptPolicy(data: PolicyAcceptance): Promise<PolicyAcceptanceType> {
    if (environment.useMockApi) {
      await delay()
      const policy = mockPolicyAcceptances.find((p) => p.id === data.policyId)
      if (!policy) throw new Error('Policy not found')
      policy.status = data.accepted ? 'accepted' : 'declined'
      policy.acceptedDate = data.accepted ? new Date().toISOString() : undefined
      policy.updatedAt = new Date().toISOString()
      return policy
    }
    const response = await api.patch<ApiResponse<PolicyAcceptanceType>>(
      API_ENDPOINTS.ONBOARDING.ACCEPT_POLICY(data.policyId),
      data
    )
    return response.data.data
  },

  // ---- Asset Allocations ----
  async getAssetAllocations(employeeId?: string): Promise<AssetAllocation[]> {
    if (environment.useMockApi) {
      await delay()
      let list = [...mockAssetAllocations]
      if (employeeId) list = list.filter((a) => a.employeeId === employeeId)
      return list
    }
    const response = await api.get<ApiResponse<AssetAllocation[]>>(
      API_ENDPOINTS.ONBOARDING.ASSETS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async allocateAsset(data: AssetAllocationSchema): Promise<AssetAllocation> {
    if (environment.useMockApi) {
      await delay()
      const newAsset: AssetAllocation = {
        id: `ast-${Date.now()}`,
        employeeId: data.employeeId,
        employeeName: 'Mock Employee',
        assetType: data.assetType,
        assetTag: data.assetTag,
        serialNumber: data.serialNumber,
        status: 'allocated',
        allocatedDate: new Date().toISOString(),
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockAssetAllocations.unshift(newAsset)
      return newAsset
    }
    const response = await api.post<ApiResponse<AssetAllocation>>(
      API_ENDPOINTS.ONBOARDING.ALLOCATE_ASSET,
      data
    )
    return response.data.data
  },

  // ---- Tasks ----
  async getOnboardingTasks(params?: {
    employeeId?: string
    status?: OnboardingTask['status']
  }): Promise<OnboardingTask[]> {
    if (environment.useMockApi) {
      await delay()
      let tasks = [...mockOnboardingTasks]
      if (params?.employeeId)
        tasks = tasks.filter((t) => t.assignee.includes(params.employeeId!))
      if (params?.status) tasks = tasks.filter((t) => t.status === params.status)
      return tasks
    }
    const response = await api.get<ApiResponse<OnboardingTask[]>>(
      API_ENDPOINTS.ONBOARDING.TASKS,
      { params }
    )
    return response.data.data
  },

  async updateTaskStatus(taskId: string, status: OnboardingTask['status']): Promise<OnboardingTask> {
    if (environment.useMockApi) {
      await delay()
      const task = mockOnboardingTasks.find((t) => t.id === taskId)
      if (!task) throw new Error('Task not found')
      task.status = status
      if (status === 'completed') task.completedDate = new Date().toISOString()
      task.updatedAt = new Date().toISOString()
      return task
    }
    const response = await api.patch<ApiResponse<OnboardingTask>>(
      API_ENDPOINTS.ONBOARDING.UPDATE_TASK(taskId),
      { status }
    )
    return response.data.data
  },

  // ---- Stats ----
  async getOnboardingStats(): Promise<OnboardingStats> {
    if (environment.useMockApi) {
      await delay()
      return mockOnboardingStats
    }
    const response = await api.get<ApiResponse<OnboardingStats>>(
      API_ENDPOINTS.ONBOARDING.STATS
    )
    return response.data.data
  },

  // ---- IT, Manager, HR Tasks ----
  async getITTasks(employeeId?: string): Promise<ITTask[]> {
    if (environment.useMockApi) {
      await delay()
      let list = [...mockITTasks]
      if (employeeId) list = list.filter((t) => t.employeeId === employeeId)
      return list
    }
    const response = await api.get<ApiResponse<ITTask[]>>(
      API_ENDPOINTS.ONBOARDING.IT_TASKS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async getManagerTasks(employeeId?: string): Promise<ManagerTask[]> {
    if (environment.useMockApi) {
      await delay()
      let list = [...mockManagerTasks]
      if (employeeId) list = list.filter((t) => t.employeeId === employeeId)
      return list
    }
    const response = await api.get<ApiResponse<ManagerTask[]>>(
      API_ENDPOINTS.ONBOARDING.MANAGER_TASKS,
      { params: { employeeId } }
    )
    return response.data.data
  },

  async getHRTasks(employeeId?: string): Promise<HRTask[]> {
    if (environment.useMockApi) {
      await delay()
      let list = [...mockHRTasks]
      if (employeeId) list = list.filter((t) => t.employeeId === employeeId)
      return list
    }
    const response = await api.get<ApiResponse<HRTask[]>>(
      API_ENDPOINTS.ONBOARDING.HR_TASKS,
      { params: { employeeId } }
    )
    return response.data.data
  },
}