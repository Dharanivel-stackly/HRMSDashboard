import { PERMISSIONS, type Permission } from '@/lib/constants/permissions'
import { ROLES, type Role } from '@/lib/constants/roles'
import { readMockState, writeMockState } from '@/lib/mock/mockStateStore'

/** Flat list of every permission — used for Super Admin / Admin access */
export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group)
) as Permission[]

/** Employee — self-service attendance only */
export const EMPLOYEE_PERMISSIONS: Permission[] = [
  PERMISSIONS.ATTENDANCE.MY_VIEW,
  PERMISSIONS.ATTENDANCE.MY_MANAGE,
]

/** HR / manager — full attendance module + HRMS screens */
export const HR_MANAGER_PERMISSIONS: Permission[] = [
  PERMISSIONS.DASHBOARD.VIEW,
  PERMISSIONS.HRMS.DASHBOARD_VIEW,
  PERMISSIONS.EMPLOYEES.VIEW,
  PERMISSIONS.EMPLOYEES.CREATE,
  PERMISSIONS.EMPLOYEES.UPDATE,
  PERMISSIONS.EMPLOYEES.DELETE,
  PERMISSIONS.EMPLOYEES.EXPORT,
  PERMISSIONS.ATTENDANCE.DASHBOARD_VIEW,
  PERMISSIONS.ATTENDANCE.DAILY_VIEW,
  PERMISSIONS.ATTENDANCE.MY_VIEW,
  PERMISSIONS.ATTENDANCE.MY_MANAGE,
  PERMISSIONS.ATTENDANCE.CALENDAR_VIEW,
  PERMISSIONS.ATTENDANCE.CORRECTIONS_VIEW,
  PERMISSIONS.ATTENDANCE.CORRECTIONS_MANAGE,
  PERMISSIONS.ATTENDANCE.SHIFTS_MANAGE,
  PERMISSIONS.ATTENDANCE.OVERTIME_VIEW,
  PERMISSIONS.ATTENDANCE.OVERTIME_MANAGE,
  PERMISSIONS.ATTENDANCE.HOLIDAYS_MANAGE,
  PERMISSIONS.ATTENDANCE.REPORTS_VIEW,
  PERMISSIONS.ATTENDANCE.SETTINGS_MANAGE,
  PERMISSIONS.ATTENDANCE.EXPORT,
  PERMISSIONS.LEAVE.VIEW,
  PERMISSIONS.LEAVE.CREATE,
  PERMISSIONS.LEAVE.APPROVE,
  PERMISSIONS.LEAVE.REJECT,
  PERMISSIONS.PAYROLL.VIEW,
  PERMISSIONS.RECRUITMENT.VIEW,
  PERMISSIONS.PERFORMANCE.VIEW,
  PERMISSIONS.DOCUMENTS.VIEW,
  PERMISSIONS.REPORTS.VIEW,
]

export const ROLE_PERMISSION_PRESETS: Partial<Record<Role, Permission[]>> = {
  [ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,
  [ROLES.ADMIN]: ALL_PERMISSIONS,
  [ROLES.EMPLOYEE]: EMPLOYEE_PERMISSIONS,
  [ROLES.HR_MANAGER]: HR_MANAGER_PERMISSIONS,
  [ROLES.HR_EXECUTIVE]: HR_MANAGER_PERMISSIONS,
  [ROLES.MANAGER]: [
    PERMISSIONS.DASHBOARD.VIEW,
    PERMISSIONS.HRMS.DASHBOARD_VIEW,
    PERMISSIONS.ATTENDANCE.DASHBOARD_VIEW,
    PERMISSIONS.ATTENDANCE.DAILY_VIEW,
    PERMISSIONS.ATTENDANCE.MY_VIEW,
    PERMISSIONS.ATTENDANCE.MY_MANAGE,
    PERMISSIONS.ATTENDANCE.CALENDAR_VIEW,
    PERMISSIONS.ATTENDANCE.CORRECTIONS_VIEW,
    PERMISSIONS.ATTENDANCE.CORRECTIONS_MANAGE,
    PERMISSIONS.ATTENDANCE.OVERTIME_VIEW,
    PERMISSIONS.ATTENDANCE.OVERTIME_MANAGE,
    PERMISSIONS.ATTENDANCE.REPORTS_VIEW,
    PERMISSIONS.LEAVE.VIEW,
    PERMISSIONS.LEAVE.APPROVE,
    PERMISSIONS.LEAVE.REJECT,
  ],
}

const LOCKED_ROLES: Role[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN]

function clonePermissions(list: readonly Permission[]): Permission[] {
  return [...new Set(list)]
}

/**
 * Mutable role → permissions map, edited from the Screen Privileges page.
 * Hydrated lazily so the persistence adapter can be attached before first read.
 */
let rolePermissionsMap: Record<Role, Permission[]> | null = null

function getMap(): Record<Role, Permission[]> {
  if (rolePermissionsMap) return rolePermissionsMap

  const persisted = readMockState().rolePermissions
  const map = {} as Record<Role, Permission[]>

  for (const role of Object.values(ROLES)) {
    if (LOCKED_ROLES.includes(role)) {
      map[role] = clonePermissions(ALL_PERMISSIONS)
      continue
    }
    const stored = persisted?.[role]
    map[role] = stored
      ? clonePermissions(stored as Permission[])
      : clonePermissions(ROLE_PERMISSION_PRESETS[role] ?? [])
  }

  rolePermissionsMap = map
  return map
}

function persistMap(): void {
  const map = getMap()
  const payload: Record<string, string[]> = {}

  for (const role of Object.values(ROLES)) {
    if (LOCKED_ROLES.includes(role)) continue
    payload[role] = map[role]
  }

  writeMockState({ rolePermissions: payload })
}

export function isRolePrivilegeLocked(role: Role): boolean {
  return LOCKED_ROLES.includes(role)
}

export function getStoredPermissionsForRole(role: Role): Permission[] {
  if (isRolePrivilegeLocked(role)) {
    return clonePermissions(ALL_PERMISSIONS)
  }
  return clonePermissions(getMap()[role] ?? [])
}

export function setStoredPermissionsForRole(role: Role, permissions: Permission[]): void {
  if (isRolePrivilegeLocked(role)) {
    throw new Error('Privileged admin roles cannot be modified')
  }
  getMap()[role] = clonePermissions(permissions)
  persistMap()
}

export function resetStoredPermissionsForRole(role: Role): void {
  if (isRolePrivilegeLocked(role)) {
    throw new Error('Privileged admin roles cannot be reset')
  }
  getMap()[role] = clonePermissions(ROLE_PERMISSION_PRESETS[role] ?? [])
  persistMap()
}

export function getPermissionsForRoles(roles: Role[]): Permission[] {
  if (roles.some((role) => isRolePrivilegeLocked(role))) {
    return clonePermissions(ALL_PERMISSIONS)
  }

  const map = getMap()
  const merged = new Set<Permission>()
  for (const role of roles) {
    for (const permission of map[role] ?? []) {
      merged.add(permission)
    }
  }
  return [...merged]
}
