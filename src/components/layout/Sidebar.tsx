import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronLeft, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { navigationConfig } from '@/config/navigation.config'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { appConfig } from '@/config/app.config'
import { ROUTES } from '@/lib/constants/routes'
import type { NavigationItem } from '@/types/navigation.types'
import type { Permission } from '@/lib/constants/permissions'

function isRouteActive(pathname: string, path: string, options?: { exact?: boolean }) {
  if (pathname === path) return true
  if (options?.exact) return false
  // Single-segment roots (e.g. /hrms) must not stay active on child routes
  const depth = path.split('/').filter(Boolean).length
  if (depth <= 1) return false
  return path !== '/' && pathname.startsWith(`${path}/`)
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})
  const location = useLocation()
  const navigate = useNavigate()
  const { can } = usePermissions()
  const { logout } = useAuth()

  const canSeeItem = (item: NavigationItem): boolean => {
    if (item.children?.length) {
      return item.children.some((child) => canSeeItem(child))
    }
    return !item.permission || can(item.permission as Permission)
  }

  const isUnderModule = (modulePath: string) =>
    location.pathname === modulePath ||
    location.pathname.startsWith(`${modulePath}/`)

  useEffect(() => {
    setExpandedMenus((prev) => {
      const next = { ...prev }
      for (const group of navigationConfig) {
        for (const item of group.items) {
          if (item.children?.length && isUnderModule(item.path)) {
            next[item.path] = true
          }
        }
      }
      return next
    })
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const goTo = (path: string) => {
    navigate(path)
  }

  const renderNavItem = (item: NavigationItem) => {
    if (!canSeeItem(item)) return null

    const Icon = item.icon
    const hasChildren = Boolean(item.children?.length)
    const visibleChildren = item.children?.filter((child) => canSeeItem(child)) ?? []
    const isExpanded = Boolean(expandedMenus[item.path])
    // const moduleActive = hasChildren && isUnderModule(item.path)
    const moduleActive =
      hasChildren &&
      isUnderModule(item.path) &&
      !visibleChildren.some(
        (child) => location.pathname === child.path
      )
    const leafActive = !hasChildren && isRouteActive(location.pathname, item.path)

    if (hasChildren) {
      const toggleExpanded = () => {
        if (collapsed) {
          setCollapsed(false)
          setExpandedMenus((prev) => ({ ...prev, [item.path]: true }))
          return
        }
        setExpandedMenus((prev) => ({
          ...prev,
          [item.path]: !prev[item.path],
        }))
      }

      return (
        <div key={item.path} className="space-y-0.5">
          <button
            type="button"
            title={collapsed ? item.label : undefined}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
            onClick={toggleExpanded}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
              moduleActive
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white',
              collapsed && 'justify-center px-2'
            )}
          >
            {Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-200',
                    isExpanded && 'rotate-180'
                  )}
                />
              </>
            )}
          </button>

          {!collapsed && isExpanded && (
            <div className="ml-5 space-y-0.5 border-l border-white/20 pl-2">
              {visibleChildren.map((child) => {
                const ChildIcon = child.icon
                const childActive = isRouteActive(location.pathname, child.path, {
                  exact: child.path === item.path,
                })

                return (
                  <button
                    key={`${item.path}-${child.label}`}
                    type="button"
                    onClick={() => {
                      setExpandedMenus((prev) => ({ ...prev, [item.path]: true }))
                      goTo(child.path)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors',
                      childActive
                        ? 'bg-white/25 text-white'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {ChildIcon && (
                      <ChildIcon className="h-3.5 w-3.5 shrink-0 opacity-90" />
                    )}
                    <span>{child.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        key={item.path}
        type="button"
        title={collapsed ? item.label : undefined}
        onClick={() => goTo(item.path)}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
          leafActive
            ? 'bg-white/20 text-white shadow-sm'
            : 'text-white/80 hover:bg-white/10 hover:text-white',
          collapsed && 'justify-center px-2'
        )}
      >
        {Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}
        {!collapsed && <span>{item.label}</span>}
      </button>
    )
  }

  return (
    <aside
      className={cn(
        'flex h-screen min-h-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-2 p-3',
          collapsed && 'justify-center'
        )}
      >
        {!collapsed ? (
          <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-white px-2.5 py-2 shadow-sm">
            <img
              src="/stackly-logo.jpg"
              alt="Stackly"
              className="h-9 w-auto max-w-[120px] shrink-0 object-contain object-left"
            />
            <div className="min-w-0 border-l border-slate-200 pl-2.5">
              <p className="truncate text-sm font-bold leading-tight text-[#1e3a5f]">
                {appConfig.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">Cloud Platform</p>
            </div>
          </div>
        ) : (
          <img
            src="/stackly-logo.jpg"
            alt="Stackly"
            className="h-9 w-9 rounded-lg bg-white object-cover object-left p-0.5 shadow-sm"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full bg-white/15 text-white hover:bg-white/25 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
          />
        </Button>
      </div>

      <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
        {navigationConfig.map((group) => {
          const visibleItems = group.items.filter((item) => canSeeItem(item))
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="mb-5">
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
                  {group.label}
                </p>
              )}
              <nav className="space-y-1">
                {visibleItems.map((item) => renderNavItem(item))}
              </nav>
            </div>
          )
        })}
      </div>

      <div className="shrink-0 border-t border-white/15 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white',
            collapsed && 'justify-center px-2'
          )}
          title="Logout"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
