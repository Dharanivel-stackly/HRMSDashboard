import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'
import type { NavigationItem } from '@/types/navigation.types'
import { usePermissions } from '@/hooks/usePermissions'

interface ModuleNavigationProps {
  items: NavigationItem[]
}

export function ModuleNavigation({ items }: ModuleNavigationProps) {
  const location = useLocation()
  const { can } = usePermissions()

  const visibleItems = items.filter(
    (item) => !item.permission || can(item.permission)
  )

  return (
    <nav className="flex items-center gap-1 border-b pb-2">
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
