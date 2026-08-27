import type { AuthUser } from '@/types/auth.types'
import type { Permission } from '@/lib/constants/permissions'
import { PERMISSIONS } from '@/lib/constants/permissions'
import { ROLES } from '@/lib/constants/roles'

/** Flat list of every permission — used for demo Super Admin access */
export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group)
) as Permission[]

export const DEMO_USERS: Array<{
  email: string
  password: string
  user: AuthUser
}> = [
  {
    email: 'admin@oneenterprise.com',
    password: 'admin123',
    user: {
      id: 'demo-user-1',
      email: 'admin@oneenterprise.com',
      firstName: 'Alex',
      lastName: 'Admin',
      roles: [ROLES.SUPER_ADMIN],
      permissions: ALL_PERMISSIONS,
      avatar: undefined,
    },
  },
  {
    email: 'hr@oneenterprise.com',
    password: 'hr12345',
    user: {
      id: 'demo-user-2',
      email: 'hr@oneenterprise.com',
      firstName: 'Jordan',
      lastName: 'HR',
      roles: [ROLES.HR_MANAGER],
      permissions: [
        PERMISSIONS.EMPLOYEES.VIEW,
        PERMISSIONS.EMPLOYEES.CREATE,
        PERMISSIONS.EMPLOYEES.UPDATE,
        PERMISSIONS.EMPLOYEES.DELETE,
        PERMISSIONS.EMPLOYEES.EXPORT,
        PERMISSIONS.ATTENDANCE.VIEW,
        PERMISSIONS.ATTENDANCE.CREATE,
        PERMISSIONS.ATTENDANCE.UPDATE,
        PERMISSIONS.LEAVE.VIEW,
        PERMISSIONS.LEAVE.CREATE,
        PERMISSIONS.LEAVE.APPROVE,
        PERMISSIONS.LEAVE.REJECT,
        PERMISSIONS.PAYROLL.VIEW,
        PERMISSIONS.RECRUITMENT.VIEW,
        PERMISSIONS.PERFORMANCE.VIEW,
        PERMISSIONS.DOCUMENTS.VIEW,
        PERMISSIONS.REPORTS.VIEW,
      ],
      avatar: undefined,
    },
  },
]

export const DEFAULT_DEMO_CREDENTIALS = {
  email: 'admin@oneenterprise.com',
  password: 'admin123',
}
