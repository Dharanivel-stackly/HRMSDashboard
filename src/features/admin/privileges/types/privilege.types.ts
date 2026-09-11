import type { Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'
import type { ScreenPrivilegeDefinition } from '../constants/screenCatalog'

export type ScreenAccessFlags = {
  view: boolean
  edit: boolean
}

export type RoleScreenAccess = Record<string, ScreenAccessFlags>

export interface RolePrivilegeMatrix {
  role: Role
  locked: boolean
  permissions: Permission[]
  screens: RoleScreenAccess
}

export interface RolePrivilegesResponse {
  screens: ScreenPrivilegeDefinition[]
  roles: RolePrivilegeMatrix[]
}

export interface UpdateRolePrivilegesPayload {
  role: Role
  permissions: Permission[]
}
