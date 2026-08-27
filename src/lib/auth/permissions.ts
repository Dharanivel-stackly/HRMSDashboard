import type { Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'

export function hasPermission(
  userPermissions: Permission[],
  required: Permission
): boolean {
  return userPermissions.includes(required)
}

export function hasAnyPermission(
  userPermissions: Permission[],
  required: Permission[]
): boolean {
  return required.some((p) => userPermissions.includes(p))
}

export function hasAllPermissions(
  userPermissions: Permission[],
  required: Permission[]
): boolean {
  return required.every((p) => userPermissions.includes(p))
}

export function hasRole(userRoles: Role[], required: Role): boolean {
  return userRoles.includes(required)
}

export function hasAnyRole(userRoles: Role[], required: Role[]): boolean {
  return required.some((r) => userRoles.includes(r))
}

export function canAccessModule(
  userPermissions: Permission[],
  modulePrefix: string
): boolean {
  return userPermissions.some((p) => p.startsWith(modulePrefix))
}
