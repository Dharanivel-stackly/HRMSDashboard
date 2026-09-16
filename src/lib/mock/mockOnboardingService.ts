// src/lib/mock/mockOnboardingService.ts
import { ApiError } from '@/lib/api/apiError'
import type { PaginatedResponse } from '@/types/api.types'
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
} from '@/features/hrms/onboarding/mock/onboarding.mock'
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
} from '@/features/hrms/onboarding/types/onboarding.types'
import type {
  OnboardingEmployeeUpdate,
  DocumentVerification,
  PolicyAcceptance,
  AssetAllocation as AssetAllocationSchema,
} from '@/features/hrms/onboarding/validation/onboarding.schema'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

let onboardingEmployees = [...mockOnboardingEmployees]
let documents = [...mockDocuments]
let backgroundVerifications = [...mockBackgroundVerifications]
let policyAcceptances = [...mockPolicyAcceptances]
let assetAllocations = [...mockAssetAllocations]
let onboardingTasks = [...mockOnboardingTasks]
let itTasks = [...mockITTasks]
let managerTasks = [...mockManagerTasks]
let hrTasks = [...mockHRTasks]

export const mockOnboardingService = {
  async getOnboardingEmployees(params?: any): Promise<PaginatedResponse<OnboardingEmployee>> {
    await delay()
    let data = [...onboardingEmployees]
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

  async getOnboardingEmployeeById(id: string): Promise<OnboardingEmployee> {
    await delay()
    const emp = onboardingEmployees.find((e) => e.id === id)
    if (!emp) throw new ApiError('Employee not found', 404)
    return emp
  },

  async updateOnboardingEmployee(
    id: string,
    data: OnboardingEmployeeUpdate
  ): Promise<OnboardingEmployee> {
    await delay()
    const index = onboardingEmployees.findIndex((e) => e.id === id)
    if (index === -1) throw new ApiError('Employee not found', 404)
    onboardingEmployees[index] = {
      ...onboardingEmployees[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return onboardingEmployees[index]
  },

  async getDocuments(employeeId?: string): Promise<Document[]> {
    await delay()
    let docs = [...documents]
    if (employeeId) docs = docs.filter((d) => d.employeeId === employeeId)
    return docs
  },

  async uploadDocument(data: any): Promise<Document> {
    await delay()
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      employeeId: data.employeeId || 'ob-1',
      employeeName: 'Mock Employee',
      documentType: data.documentType || 'other',
      documentName: data.documentName || 'uploaded_document.pdf',
      status: 'uploaded',
      uploadedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    documents = [newDoc, ...documents]
    return newDoc
  },

  async verifyDocument(data: DocumentVerification): Promise<Document> {
    await delay()
    const doc = documents.find((d) => d.id === data.documentId)
    if (!doc) throw new ApiError('Document not found', 404)
    doc.status = data.status
    doc.verifiedDate = new Date().toISOString()
    doc.verifiedBy = 'Current User'
    doc.comments = data.comments
    doc.updatedAt = new Date().toISOString()
    return doc
  },

  async getBackgroundVerifications(employeeId?: string): Promise<BackgroundVerification[]> {
    await delay()
    let list = [...backgroundVerifications]
    if (employeeId) list = list.filter((b) => b.employeeId === employeeId)
    return list
  },

  async getPolicyAcceptances(employeeId?: string): Promise<PolicyAcceptanceType[]> {
    await delay()
    let list = [...policyAcceptances]
    if (employeeId) list = list.filter((p) => p.employeeId === employeeId)
    return list
  },

  async acceptPolicy(data: PolicyAcceptance): Promise<PolicyAcceptanceType> {
    await delay()
    const policy = policyAcceptances.find((p) => p.id === data.policyId)
    if (!policy) throw new ApiError('Policy not found', 404)
    policy.status = data.accepted ? 'accepted' : 'declined'
    policy.acceptedDate = data.accepted ? new Date().toISOString() : undefined
    policy.updatedAt = new Date().toISOString()
    return policy
  },

  async getAssetAllocations(employeeId?: string): Promise<AssetAllocation[]> {
    await delay()
    let list = [...assetAllocations]
    if (employeeId) list = list.filter((a) => a.employeeId === employeeId)
    return list
  },

  async allocateAsset(data: AssetAllocationSchema): Promise<AssetAllocation> {
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
    assetAllocations = [newAsset, ...assetAllocations]
    return newAsset
  },

  async getOnboardingTasks(params?: any): Promise<OnboardingTask[]> {
    await delay()
    let tasks = [...onboardingTasks]
    if (params?.employeeId)
      tasks = tasks.filter((t) => t.assignee.includes(params.employeeId!))
    if (params?.status) tasks = tasks.filter((t) => t.status === params.status)
    return tasks
  },

  async updateTaskStatus(taskId: string, status: OnboardingTask['status']): Promise<any> {
    await delay()
    const task = onboardingTasks.find((t) => t.id === taskId)
    if (task) {
      task.status = status
      if (status === 'completed') task.completedDate = new Date().toISOString()
      return task
    }
    const itTask = itTasks.find((t) => t.id === taskId)
    if (itTask) {
      itTask.status = status as any
      if (status === 'completed') itTask.completedDate = new Date().toISOString()
      return itTask
    }
    const hrTask = hrTasks.find((t) => t.id === taskId)
    if (hrTask) {
      hrTask.status = status as any
      if (status === 'completed') hrTask.completedDate = new Date().toISOString()
      return hrTask
    }
    const mgTask = managerTasks.find((t) => t.id === taskId)
    if (mgTask) {
      mgTask.status = status as any
      if (status === 'completed') mgTask.completedDate = new Date().toISOString()
      return mgTask
    }
    throw new ApiError('Task not found', 404)
  },

  async getOnboardingStats(): Promise<OnboardingStats> {
    await delay()
    return mockOnboardingStats
  },

  async getITTasks(employeeId?: string): Promise<ITTask[]> {
    await delay()
    let list = [...itTasks]
    if (employeeId) list = list.filter((t) => t.employeeId === employeeId)
    return list
  },

  async getManagerTasks(employeeId?: string): Promise<ManagerTask[]> {
    await delay()
    let list = [...managerTasks]
    if (employeeId) list = list.filter((t) => t.employeeId === employeeId)
    return list
  },

  async getHRTasks(employeeId?: string): Promise<HRTask[]> {
    await delay()
    let list = [...hrTasks]
    if (employeeId) list = list.filter((t) => t.employeeId === employeeId)
    return list
  }
}