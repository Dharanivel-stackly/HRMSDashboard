import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'
import { navigationConfig } from '@/config/navigation.config'
import { usePermissions } from '@/hooks/usePermissions'

export function MainNavigation() {
  const location = useLocation()
  const { can } = usePermissions()

  const allItems = navigationConfig.flatMap((group) =>
    group.items.filter((item) => !item.permission || can(item.permission))
  )

  return (
    <nav className="flex items-center gap-1">
      {allItems.slice(0, 6).map((item) => {
        const isActive = location.pathname.startsWith(item.path)
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
