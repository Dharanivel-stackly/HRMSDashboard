import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  CreateUserPayload,
  ManagedUser,
  UpdateUserPayload,
} from '../types/user.types'

export const userService = {
  async getUsers(): Promise<ManagedUser[]> {
    const res = await api.get<ApiResponse<ManagedUser[]>>(API_ENDPOINTS.USERS.BASE)
    return res.data.data
  },

  async getUserById(id: string): Promise<ManagedUser> {
    const res = await api.get<ApiResponse<ManagedUser>>(API_ENDPOINTS.USERS.BY_ID(id))
    return res.data.data
  },

  async createUser(payload: CreateUserPayload): Promise<ManagedUser> {
    const res = await api.post<ApiResponse<ManagedUser>>(API_ENDPOINTS.USERS.BASE, payload)
    return res.data.data
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<ManagedUser> {
    const res = await api.put<ApiResponse<ManagedUser>>(API_ENDPOINTS.USERS.BY_ID(id), payload)
    return res.data.data
  },

  async deleteUser(id: string): Promise<{ id: string }> {
    const res = await api.delete<ApiResponse<{ id: string }>>(API_ENDPOINTS.USERS.BY_ID(id))
    return res.data.data
  },
}
