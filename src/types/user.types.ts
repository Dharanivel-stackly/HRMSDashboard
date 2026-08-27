import type { Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  roles: Role[]
  permissions: Permission[]
  employeeId?: string
  department?: string
  designation?: string
  isActive: boolean
}
