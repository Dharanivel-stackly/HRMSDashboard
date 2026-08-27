import { Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { UserMenu } from '@/components/navigation/UserMenu'
import { NotificationMenu } from '@/components/navigation/NotificationMenu'
import { useAuth } from '@/features/auth/hooks/useAuth'

const pageTitles: Record<string, string> = {
  dashboard: 'Admin Dashboard',
  hrms: 'HRMS Dashboard',
  employees: 'Employees',
  attendance: 'Attendance Dashboard',
  my: 'My Attendance',
  daily: 'Daily Attendance',
  calendar: 'Attendance Calendar',
  corrections: 'Attendance Corrections',
  shifts: 'Shift Management',
  overtime: 'Overtime',
  holidays: 'Holiday Management',
  leave: 'Leave Management',
  payroll: 'Payroll',
  recruitment: 'Recruitment',
  performance: 'Performance',
  documents: 'Documents',
  reports: 'Reports',
  settings: 'Attendance Settings',
  new: 'Add New',
  edit: 'Edit',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Header() {
  const { user } = useAuth()
  const location = useLocation()

  const title = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const last = segments[segments.length - 1]
    if (!last) return 'Admin Dashboard'
    if (pageTitles[last]) return pageTitles[last]
    if (segments.includes('employees') && last !== 'employees') {
      return pageTitles[segments[segments.length - 2]] || 'Employees'
    }
    return last.charAt(0).toUpperCase() + last.slice(1)
  }, [location.pathname])

  const displayName = user?.firstName?.toLowerCase() || 'user'

  return (
    <header className="shrink-0 bg-white">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0b3d91]">{title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {getGreeting()}, {displayName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>

      {/* Breadcrumb bar — flush under top bar (no gap) */}
      <div
        className="breadcrumb-bar flex items-center gap-2 rounded-bl-xl px-6 py-2.5 text-sm text-white"
        style={{
          backgroundColor: '#1a73e8',
          backgroundImage:
            'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 16px)',
        }}
      >
        <Home className="h-3.5 w-3.5 shrink-0 opacity-90" />
        <Link to="/dashboard" className="opacity-90 hover:opacity-100">
          Home
        </Link>
        <span className="opacity-50">&gt;</span>
        <Breadcrumbs variant="onPrimary" />
      </div>
    </header>
  )
}
