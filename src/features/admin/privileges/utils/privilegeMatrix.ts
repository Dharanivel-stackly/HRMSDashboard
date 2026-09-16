import type { Permission } from '@/lib/constants/permissions'
import type { ScreenPrivilegeDefinition } from '../constants/screenCatalog'
import type { RoleScreenAccess } from '../types/privilege.types'

/** Build the full permission list for a role from View/Edit screen toggles */
export function buildPermissionsFromScreenAccess(
  screens: ScreenPrivilegeDefinition[],
  access: RoleScreenAccess,
  previousPermissions: Permission[] = []
): Permission[] {
  const next = new Set<Permission>()

  // Keep permissions that are not managed by the screen catalog (legacy aliases, etc.)
  const managed = new Set<Permission>()
  for (const screen of screens) {
    managed.add(screen.viewPermission)
    for (const permission of screen.editPermissions ?? []) {
      managed.add(permission)
    }
  }
  for (const permission of previousPermissions) {
    if (!managed.has(permission)) {
      next.add(permission)
    }
  }

  for (const screen of screens) {
    const flags = access[screen.id] ?? { view: false, edit: false }
    if (flags.view) {
      next.add(screen.viewPermission)
    }
    if (flags.edit && screen.editPermissions?.length) {
      next.add(screen.viewPermission)
      for (const permission of screen.editPermissions) {
        next.add(permission)
      }
    }
  }

  return [...next]
}

export function toggleScreenFlag(
  access: RoleScreenAccess,
  screen: ScreenPrivilegeDefinition,
  flag: 'view' | 'edit',
  enabled: boolean
): RoleScreenAccess {
  const current = access[screen.id] ?? { view: false, edit: false }
  const hasEdit = Boolean(screen.editPermissions?.length)

  if (flag === 'view') {
    return {
      ...access,
      [screen.id]: {
        view: enabled,
        edit: enabled ? current.edit : false,
      },
    }
  }

  // edit toggle
  if (!hasEdit) return access
  return {
    ...access,
    [screen.id]: {
      view: enabled ? true : current.view,
      edit: enabled,
    },
  }
}
