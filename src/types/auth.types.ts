import type { Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: Role[]
  permissions: Permission[]
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}
