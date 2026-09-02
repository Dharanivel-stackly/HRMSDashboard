import type { AuthUser } from '@/types/auth.types'
import { hasPermission } from '@/lib/auth/permissions'
import { PERMISSIONS } from '@/lib/constants/permissions'
import { ROUTES } from '@/lib/constants/routes'

export function getHomeRoute(user: AuthUser): string {
  if (hasPermission(user.permissions, PERMISSIONS.DASHBOARD.VIEW, user.roles)) {
    return ROUTES.DASHBOARD
  }

  if (hasPermission(user.permissions, PERMISSIONS.HRMS.DASHBOARD_VIEW, user.roles)) {
    return ROUTES.HRMS.DASHBOARD
  }

  if (hasPermission(user.permissions, PERMISSIONS.ATTENDANCE.MY_VIEW, user.roles)) {
    return ROUTES.HRMS.ATTENDANCE_MY
  }

  if (hasPermission(user.permissions, PERMISSIONS.ATTENDANCE.DASHBOARD_VIEW, user.roles)) {
    return ROUTES.HRMS.ATTENDANCE
  }

  return ROUTES.HRMS.ATTENDANCE_MY
}
