import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type {
  CreateGoalPayload,
  GoalListParams,
  Goal,
  UpdateGoalProgressPayload,
  UpdateGoalPayload,
} from '../types/performance.types'

export const performanceService = {
  async getGoals(params?: GoalListParams): Promise<PaginatedResponse<Goal>> {
    const response = await api.get<PaginatedResponse<Goal>>(API_ENDPOINTS.PERFORMANCE.GOALS, { params })
    return response.data
  },
  async createGoal(payload: CreateGoalPayload): Promise<Goal> {
    const response = await api.post<ApiResponse<Goal>>(API_ENDPOINTS.PERFORMANCE.GOALS, payload)
    return response.data.data
  },

  async updateGoalProgress(id: string, payload: UpdateGoalProgressPayload): Promise<Goal> {
    const response = await api.patch<ApiResponse<Goal>>(
      API_ENDPOINTS.PERFORMANCE.GOAL_BY_ID(id),
      payload
    )
    return response.data.data
  },

  async updateGoal(id: string, payload: UpdateGoalPayload): Promise<Goal> {
    const response = await api.put<ApiResponse<Goal>>(
      API_ENDPOINTS.PERFORMANCE.GOAL_BY_ID(id),
      payload
    )
    return response.data.data
  },

  async deleteGoal(id: string): Promise<{ id: string }> {
    const response = await api.delete<ApiResponse<{ id: string }>>(
      API_ENDPOINTS.PERFORMANCE.GOAL_BY_ID(id)
    )
    return response.data.data
  },
}