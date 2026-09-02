import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  UserPlus,
  TrendingUp,
  FileText,
  BarChart3,
  UserRound,
  CalendarRange,
  PencilLine,
  Timer,
  Gift,
  Settings2,
  ClipboardList,
  UserCog,
} from 'lucide-react'
import type { NavigationGroup } from '@/types/navigation.types'
import { ROUTES } from '@/lib/constants/routes'
import { PERMISSIONS } from '@/lib/constants/permissions'

/** HRMS-only nav — items filtered by user permissions (RBAC) */
export const navigationConfig: NavigationGroup[] = [
  {
    label: 'MAIN',
    items: [
      {
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD.VIEW,
      },
    ],
  },
  {
    label: 'HRMS',
    items: [
      {
        label: 'Dashboard',
        path: ROUTES.HRMS.DASHBOARD,
        icon: LayoutDashboard,
        module: 'hrms',
        permission: PERMISSIONS.HRMS.DASHBOARD_VIEW,
      },
      {
        label: 'Employees',
        path: ROUTES.HRMS.EMPLOYEES,
        icon: Users,
        module: 'hrms',
        permission: PERMISSIONS.EMPLOYEES.VIEW,
      },
      {
        label: 'Attendance',
        path: ROUTES.HRMS.ATTENDANCE,
        icon: Clock,
        module: 'hrms',
        children: [
          {
            label: 'Dashboard',
            path: ROUTES.HRMS.ATTENDANCE,
            icon: LayoutDashboard,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.DASHBOARD_VIEW,
          },
          {
            label: 'My Attendance',
            path: ROUTES.HRMS.ATTENDANCE_MY,
            icon: UserRound,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.MY_VIEW,
          },
          {
            label: 'Daily Attendance',
            path: ROUTES.HRMS.ATTENDANCE_DAILY,
            icon: ClipboardList,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.DAILY_VIEW,
          },
          {
            label: 'Calendar',
            path: ROUTES.HRMS.ATTENDANCE_CALENDAR,
            icon: CalendarRange,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.MY_VIEW,
          },
          {
            label: 'Corrections',
            path: ROUTES.HRMS.ATTENDANCE_CORRECTIONS,
            icon: PencilLine,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.CORRECTIONS_MANAGE,
          },
          {
            label: 'Shifts',
            path: ROUTES.HRMS.ATTENDANCE_SHIFTS,
            icon: Timer,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.SHIFTS_MANAGE,
          },
          {
            label: 'Overtime',
            path: ROUTES.HRMS.ATTENDANCE_OVERTIME,
            icon: Clock,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.OVERTIME_VIEW,
          },
          {
            label: 'Holidays',
            path: ROUTES.HRMS.ATTENDANCE_HOLIDAYS,
            icon: Gift,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.HOLIDAYS_MANAGE,
          },
          {
            label: 'Reports',
            path: ROUTES.HRMS.ATTENDANCE_REPORTS,
            icon: BarChart3,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.REPORTS_VIEW,
          },
          {
            label: 'Settings',
            path: ROUTES.HRMS.ATTENDANCE_SETTINGS,
            icon: Settings2,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.SETTINGS_MANAGE,
          },
        ],
      },
      {
        label: 'Leave',
        path: ROUTES.HRMS.LEAVE,
        icon: CalendarDays,
        module: 'hrms',
        permission: PERMISSIONS.LEAVE.VIEW,
      },
      {
        label: 'Payroll',
        path: ROUTES.HRMS.PAYROLL,
        icon: DollarSign,
        module: 'hrms',
        permission: PERMISSIONS.PAYROLL.VIEW,
      },
      {
        label: 'Recruitment',
        path: ROUTES.HRMS.RECRUITMENT,
        icon: UserPlus,
        module: 'hrms',
        permission: PERMISSIONS.RECRUITMENT.VIEW,
      },
      {
        label: 'Performance',
        path: ROUTES.HRMS.PERFORMANCE,
        icon: TrendingUp,
        module: 'hrms',
        permission: PERMISSIONS.PERFORMANCE.VIEW,
      },
      {
        label: 'Documents',
        path: ROUTES.HRMS.DOCUMENTS,
        icon: FileText,
        module: 'hrms',
        permission: PERMISSIONS.DOCUMENTS.VIEW,
      },
      {
        label: 'Reports',
        path: ROUTES.HRMS.REPORTS,
        icon: BarChart3,
        module: 'hrms',
        permission: PERMISSIONS.REPORTS.VIEW,
      },
    ],
  },
  {
    label: 'ADMIN',
    items: [
      {
        label: 'Users & Roles',
        path: ROUTES.SETTINGS.USERS,
        icon: UserCog,
        permission: PERMISSIONS.USERS.VIEW,
      },
    ],
  },
]
