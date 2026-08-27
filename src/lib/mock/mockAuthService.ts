import type { LoginCredentials, LoginResponse, ForgotPasswordRequest } from '@/types/auth.types'
import type { AuthUser } from '@/types/auth.types'
import { DEMO_USERS } from './demoUsers'
import { ApiError } from '@/lib/api/apiError'

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay()

    const match = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    )

    if (!match) {
      throw new ApiError('Invalid email or password', 401)
    }

    return {
      user: match.user,
      accessToken: `demo-token-${match.user.id}`,
      refreshToken: `demo-refresh-${match.user.id}`,
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
    return DEMO_USERS[0].user
  },
}
