import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import { environment } from '@/config/environment'
import type {CreateLeaveRequest,CreateLeaveType, UpdateLeaveType,LeaveRequest,LeaveType,LeaveBalance,} from '../types/leave.types'
import { mockLeaveService } from './mockLeaveService'

export const leaveService = {
    async getLeaveTypes(): Promise<LeaveType[]> {
  if (environment.useMockApi) {
    return mockLeaveService.getLeaveTypes()
  }

  throw new Error('Leave types API endpoint is not configured')
},
async createLeaveType(
  data: CreateLeaveType
): Promise<LeaveType> {
  if (environment.useMockApi) {
    return mockLeaveService.createLeaveType(data)
  }

  throw new Error(
    'Create leave type API endpoint is not configured'
  )
},

async getLeaveBalance(): Promise<LeaveBalance[]> {
  if (environment.useMockApi) {
    return mockLeaveService.getLeaveBalance()
  }

  throw new Error('Leave balance API endpoint is not configured')
},
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    if (environment.useMockApi) {
      return mockLeaveService.getLeaveRequests()
    }

    const response = await api.get<LeaveRequest[]>(
      API_ENDPOINTS.LEAVE.BASE
    )

    return response.data
  },

  async getLeaveRequestById(
    id: string
  ): Promise<LeaveRequest> {
    if (environment.useMockApi) {
      return mockLeaveService.getLeaveRequestById(id)
    }

    const response = await api.get<LeaveRequest>(
      API_ENDPOINTS.LEAVE.BY_ID(id)
    )

    return response.data
  },

  async createLeaveRequest(
    data: CreateLeaveRequest
  ): Promise<LeaveRequest> {
    if (environment.useMockApi) {
      return mockLeaveService.createLeaveRequest(data)
    }

    const response = await api.post<LeaveRequest>(
      API_ENDPOINTS.LEAVE.BASE,
      data
    )

    return response.data
  },
  async updateLeaveType(
  id: string,
  data: UpdateLeaveType
): Promise<LeaveType> {
  if (environment.useMockApi) {
    return mockLeaveService.updateLeaveType(id, data)
  }

  throw new Error(
    'Update leave type API endpoint is not configured'
  )
},

  async cancelLeaveRequest(
  id: string
): Promise<LeaveRequest> {
  if (environment.useMockApi) {
    return mockLeaveService.cancelLeaveRequest(id)
  }

  const response = await api.put<LeaveRequest>(
    API_ENDPOINTS.LEAVE.CANCEL(id)
  )

  return response.data
},
async approveLeaveRequest(
  id: string
): Promise<LeaveRequest> {
  if (environment.useMockApi) {
    return mockLeaveService.approveLeaveRequest(id)
  }

  const response = await api.put<LeaveRequest>(
    API_ENDPOINTS.LEAVE.APPROVE(id)
  )

  return response.data
},
async rejectLeaveRequest(
  id: string,
  reason: string
): Promise<LeaveRequest> {
  if (environment.useMockApi) {
    return mockLeaveService.rejectLeaveRequest(
      id,
      reason
    )
  }

  const response = await api.put<LeaveRequest>(
    API_ENDPOINTS.LEAVE.REJECT(id),
    {
      reason,
    }
  )

  return response.data
},
async toggleLeaveTypeStatus(
  id: string
): Promise<LeaveType> {
  if (environment.useMockApi) {
    return mockLeaveService.toggleLeaveTypeStatus(id)
  }

  throw new Error(
    'Toggle leave type status API endpoint is not configured'
  )
},
}

