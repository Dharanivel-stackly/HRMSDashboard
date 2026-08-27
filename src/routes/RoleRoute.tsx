import { useAuth } from '@/features/auth/hooks/useAuth'
import { hasPermission, hasAnyRole } from '@/lib/auth/permissions'
import type { Permission } from '@/lib/constants/permissions'
import type { Role } from '@/lib/constants/roles'
import type { ReactNode } from 'react'

interface RoleRouteProps {
  children: ReactNode
  permission?: Permission
  roles?: Role[]
  fallback?: ReactNode
}

export function RoleRoute({ children, permission, roles, fallback }: RoleRouteProps) {
  const { user } = useAuth()

  if (!user) return null

  if (permission && !hasPermission(user.permissions, permission)) {
    return <>{fallback || <AccessDenied />}</>
  }

  if (roles && !hasAnyRole(user.roles, roles)) {
    return <>{fallback || <AccessDenied />}</>
  }

  return <>{children}</>
}

function AccessDenied() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-bold">Access Denied</h2>
      <p className="text-muted-foreground">
        You do not have permission to access this resource.
      </p>
    </div>
  )
}
