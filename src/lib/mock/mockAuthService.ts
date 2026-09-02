import type { LoginCredentials, LoginResponse, ForgotPasswordRequest } from '@/types/auth.types'
import type { AuthUser } from '@/types/auth.types'
import { mockUserService } from '@/lib/mock/mockUserService'
import { ApiError } from '@/lib/api/apiError'

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const user = await mockUserService.authenticate(credentials.email, credentials.password)

    return {
      user,
      accessToken: `demo-token-${user.id}`,
      refreshToken: `demo-refresh-${user.id}`,
    }
  },

  async logout(): Promise<void> {
    await delay(200)
  },

  async forgotPassword(_data: ForgotPasswordRequest): Promise<void> {
    await delay()
  },

  async getMe(): Promise<AuthUser> {
    await delay()
    const users = await mockUserService.getUsers()
    if (!users[0]) throw new ApiError('User not found', 404)
    const { permissions, roles, ...profile } = users[0]
    return { ...profile, permissions, roles }
  },
}
