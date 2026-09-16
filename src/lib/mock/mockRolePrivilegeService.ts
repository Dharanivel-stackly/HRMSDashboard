import { ApiError } from '@/lib/api/apiError'
import {
  getPermissionsForRoles,
  getStoredPermissionsForRole,
  isRolePrivilegeLocked,
  resetStoredPermissionsForRole,
  setStoredPermissionsForRole,
} from '@/lib/auth/rolePermissions'
import { ROLES, ROLE_LABELS, type Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'
import { SCREEN_PRIVILEGE_CATALOG } from '@/features/admin/privileges/constants/screenCatalog'
import type {
  RolePrivilegeMatrix,
  RolePrivilegesResponse,
  RoleScreenAccess,
} from '@/features/admin/privileges/types/privilege.types'
import { mockUserService } from '@/lib/mock/mockUserService'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function buildScreenAccess(permissions: Permission[]): RoleScreenAccess {
  const set = new Set(permissions)
  const screens: RoleScreenAccess = {}

  for (const screen of SCREEN_PRIVILEGE_CATALOG) {
    const view = set.has(screen.viewPermission)
    const editList = screen.editPermissions ?? []
    const edit = editList.length > 0 && editList.every((permission) => set.has(permission))
    screens[screen.id] = { view, edit }
  }

  return screens
}

function toMatrix(role: Role): RolePrivilegeMatrix {
  const permissions = getStoredPermissionsForRole(role)
  return {
    role,
    locked: isRolePrivilegeLocked(role),
    permissions,
    screens: buildScreenAccess(permissions),
  }
}

export const mockRolePrivilegeService = {
  getPermissionsForRoles,

  async getMatrix(): Promise<RolePrivilegesResponse> {
    await delay()
    return {
      screens: SCREEN_PRIVILEGE_CATALOG,
      roles: Object.values(ROLES).map(toMatrix),
    }
  },

  async updateRolePermissions(role: Role, permissions: Permission[]): Promise<RolePrivilegeMatrix> {
    await delay()

    if (isRolePrivilegeLocked(role)) {
      throw new ApiError(
        `${ROLE_LABELS[role]} always has full access and cannot be changed`,
        400
      )
    }

    if (!Object.values(ROLES).includes(role)) {
      throw new ApiError('Invalid role', 400)
    }

    setStoredPermissionsForRole(role, permissions)
    mockUserService.syncPermissionsForRole(role)
    return toMatrix(role)
  },

  async resetRole(role: Role): Promise<RolePrivilegeMatrix> {
    await delay()
    if (isRolePrivilegeLocked(role)) {
      throw new ApiError(`Cannot reset ${ROLE_LABELS[role]} privileges`, 400)
    }
    resetStoredPermissionsForRole(role)
    mockUserService.syncPermissionsForRole(role)
    return toMatrix(role)
  },
}
