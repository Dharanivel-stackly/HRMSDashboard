import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils/cn'

interface BreadcrumbItem {
  label: string
  path: string
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  hrms: 'HRMS',
  employees: 'Employees',
  attendance: 'Attendance',
  my: 'My Attendance',
  daily: 'Daily',
  calendar: 'Calendar',
  corrections: 'Corrections',
  shifts: 'Shifts',
  overtime: 'Overtime',
  holidays: 'Holidays',
  leave: 'Leave',
  payroll: 'Payroll',
  recruitment: 'Recruitment',
  performance: 'Performance',
  documents: 'Documents',
  reports: 'Reports',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
}

interface BreadcrumbsProps {
  variant?: 'default' | 'onPrimary'
}

export function Breadcrumbs({ variant = 'default' }: BreadcrumbsProps) {
  const location = useLocation()

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const segments = location.pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => ({
      label: routeLabels[segment] || segment,
      path: '/' + segments.slice(0, index + 1).join('/'),
    }))
  }, [location.pathname])

  if (breadcrumbs.length === 0) return null

  const isOnPrimary = variant === 'onPrimary'

  return (
    <nav
      className={cn(
        'flex flex-wrap items-center gap-1 text-sm',
        isOnPrimary ? 'text-white/90' : 'text-muted-foreground'
      )}
    >
      {!isOnPrimary && (
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
      )}
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {!isOnPrimary && <ChevronRight className="h-3 w-3" />}
          {isOnPrimary && index > 0 && <span className="opacity-50">&gt;</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className={cn('font-medium', isOnPrimary ? 'text-white' : 'text-foreground')}>
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className={cn(isOnPrimary ? 'hover:text-white' : 'hover:text-foreground')}
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
