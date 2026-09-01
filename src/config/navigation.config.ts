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
} from 'lucide-react'
import type { NavigationGroup } from '@/types/navigation.types'
import { ROUTES } from '@/lib/constants/routes'
import { PERMISSIONS } from '@/lib/constants/permissions'

/** HRMS-only nav — Attendance expands to submodule pages */
export const navigationConfig: NavigationGroup[] = [
  {
    label: 'MAIN',
    items: [
      {
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
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
        permission: PERMISSIONS.ATTENDANCE.VIEW,
        children: [
          {
            label: 'Dashboard',
            path: ROUTES.HRMS.ATTENDANCE,
            icon: LayoutDashboard,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            label: 'My Attendance',
            path: ROUTES.HRMS.ATTENDANCE_MY,
            icon: UserRound,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            label: 'Daily Attendance',
            path: ROUTES.HRMS.ATTENDANCE_DAILY,
            icon: ClipboardList,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            label: 'Calendar',
            path: ROUTES.HRMS.ATTENDANCE_CALENDAR,
            icon: CalendarRange,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            label: 'Corrections',
            path: ROUTES.HRMS.ATTENDANCE_CORRECTIONS,
            icon: PencilLine,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.UPDATE,
          },
          {
            label: 'Shifts',
            path: ROUTES.HRMS.ATTENDANCE_SHIFTS,
            icon: Timer,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            label: 'Overtime',
            path: ROUTES.HRMS.ATTENDANCE_OVERTIME,
            icon: Clock,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            label: 'Holidays',
            path: ROUTES.HRMS.ATTENDANCE_HOLIDAYS,
            icon: Gift,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            label: 'Reports',
            path: ROUTES.HRMS.ATTENDANCE_REPORTS,
            icon: BarChart3,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            label: 'Settings',
            path: ROUTES.HRMS.ATTENDANCE_SETTINGS,
            icon: Settings2,
            module: 'hrms',
            permission: PERMISSIONS.ATTENDANCE.UPDATE,
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
  children: [
    {
      label: 'Employee Reports',
      path: ROUTES.HRMS.EMPLOYEE_REPORTS,
      icon: Users,
      module: 'hrms',
      permission: PERMISSIONS.REPORTS.VIEW,
    },
  ],
}
    ],
  },
]
