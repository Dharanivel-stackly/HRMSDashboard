export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  HR_MANAGER: 'HR_MANAGER',
  HR_EXECUTIVE: 'HR_EXECUTIVE',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  HR_MANAGER: 'HR Manager',
  HR_EXECUTIVE: 'HR Executive',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  HR_MANAGER: 70,
  HR_EXECUTIVE: 60,
  MANAGER: 50,
  EMPLOYEE: 10,
}
