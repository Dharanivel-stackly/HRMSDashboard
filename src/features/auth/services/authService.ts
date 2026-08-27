import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { LoginCredentials, LoginResponse, ForgotPasswordRequest } from '@/types/auth.types'
import type { ApiResponse } from '@/types/api.types'
import { environment } from '@/config/environment'
import { mockAuthService } from '@/lib/mock/mockAuthService'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (environment.useMockApi) {
      return mockAuthService.login(credentials)
    }

    const response = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data.data
  },

  async logout(): Promise<void> {
    if (environment.useMockApi) {
      return mockAuthService.logout()
    }
    await api.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    if (environment.useMockApi) {
      return mockAuthService.forgotPassword(data)
    }
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  },

  async getMe(): Promise<LoginResponse['user']> {
    if (environment.useMockApi) {
      return mockAuthService.getMe()
    }

    const response = await api.get<ApiResponse<LoginResponse['user']>>(
      API_ENDPOINTS.AUTH.ME
    )
    return response.data.data
  },
}
