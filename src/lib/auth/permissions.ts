import { ROLES, type Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'

export function hasRole(userRoles: Role[], required: Role): boolean {
  return userRoles.includes(required)
}

export function hasAnyRole(userRoles: Role[], required: Role[]): boolean {
  return required.some((r) => userRoles.includes(r))
}

/** Super Admin and Admin bypass all permission checks */
export function isPrivilegedAdmin(userRoles: Role[]): boolean {
  return hasAnyRole(userRoles, [ROLES.SUPER_ADMIN, ROLES.ADMIN])
}

export function hasPermission(
  userPermissions: Permission[],
  required: Permission,
  userRoles: Role[] = []
): boolean {
  if (isPrivilegedAdmin(userRoles)) return true
  return userPermissions.includes(required)
}

export function hasAnyPermission(
  userPermissions: Permission[],
  required: Permission[],
  userRoles: Role[] = []
): boolean {
  if (isPrivilegedAdmin(userRoles)) return true
  return required.some((p) => userPermissions.includes(p))
}

export function hasAllPermissions(
  userPermissions: Permission[],
  required: Permission[],
  userRoles: Role[] = []
): boolean {
  if (isPrivilegedAdmin(userRoles)) return true
  return required.every((p) => userPermissions.includes(p))
}

export function canAccessModule(
  userPermissions: Permission[],
  modulePrefix: string,
  userRoles: Role[] = []
): boolean {
  if (isPrivilegedAdmin(userRoles)) return true
  return userPermissions.some((p) => p.startsWith(modulePrefix))
}
