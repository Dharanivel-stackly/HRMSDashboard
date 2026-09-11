import { useCallback } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { hasPermission, hasAnyPermission, hasRole, canAccessModule } from '@/lib/auth/permissions'
import type { Permission } from '@/lib/constants/permissions'
import type { Role } from '@/lib/constants/roles'

export function usePermissions() {
  const { user } = useAuth()

  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false
      return hasPermission(user.permissions, permission, user.roles)
    },
    [user]
  )

  const checkAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false
      return hasAnyPermission(user.permissions, permissions, user.roles)
    },
    [user]
  )

  const checkRole = useCallback(
    (role: Role): boolean => {
      if (!user) return false
      return hasRole(user.roles, role)
    },
    [user]
  )

  const checkModuleAccess = useCallback(
    (modulePrefix: string): boolean => {
      if (!user) return false
      return canAccessModule(user.permissions, modulePrefix, user.roles)
    },
    [user]
  )

  return {
    can: checkPermission,
    canAny: checkAnyPermission,
    isRole: checkRole,
    canAccessModule: checkModuleAccess,
  }
}
