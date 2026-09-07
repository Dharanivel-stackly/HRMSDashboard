import type { AuthUser } from '@/types/auth.types'
import { ROLES } from '@/lib/constants/roles'
import { ALL_PERMISSIONS } from '@/lib/auth/rolePermissions'
import { EMPLOYEE_PERMISSIONS, HR_MANAGER_PERMISSIONS } from '@/lib/auth/rolePermissions'

/** @deprecated Use mockUserService — kept for credential reference in docs */
export const DEMO_USERS = [
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
    } satisfies Omit<AuthUser, 'avatar'> & { avatar?: undefined },
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
      permissions: HR_MANAGER_PERMISSIONS,
    } satisfies Omit<AuthUser, 'avatar'> & { avatar?: undefined },
  },
  {
    email: 'employee@oneenterprise.com',
    password: 'employee123',
    user: {
      id: 'demo-user-3',
      email: 'employee@oneenterprise.com',
      firstName: 'Priya',
      lastName: 'Sharma',
      roles: [ROLES.EMPLOYEE],
      permissions: EMPLOYEE_PERMISSIONS,
    } satisfies Omit<AuthUser, 'avatar'> & { avatar?: undefined },
  },
  {
    email: 'LDharanivel@thestackly.com',
    password: '123456',
    user: {
      id: 'demo-user-4',
      email: 'ldharanivel@thestackly.com',
      firstName: 'Dharanivel',
      lastName: 'L',
      roles: [ROLES.EMPLOYEE],
      permissions: EMPLOYEE_PERMISSIONS,
    } satisfies Omit<AuthUser, 'avatar'> & { avatar?: undefined },
  },
]

export const DEFAULT_DEMO_CREDENTIALS = {
  email: 'admin@oneenterprise.com',
  password: 'admin123',
}

export const EMPLOYEE_DEMO_CREDENTIALS = {
  email: 'LDharanivel@thestackly.com',
  password: '123456',
}
