import type { Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'

export type UserStatus = 'active' | 'inactive'

export interface ManagedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: Role[]
  permissions: Permission[]
  status: UserStatus
  lastLoginAt: string | null
  createdAt: string
}

export interface CreateUserPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  roles: Role[]
  status: UserStatus
}

export interface UpdateUserPayload {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  roles?: Role[]
  status?: UserStatus
}

export interface RoleOption {
  value: Role
  label: string
  description: string
}
