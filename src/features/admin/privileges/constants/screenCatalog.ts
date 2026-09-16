import { PERMISSIONS, type Permission } from '@/lib/constants/permissions'

export interface ScreenPrivilegeDefinition {
  id: string
  module: string
  label: string
  description: string
  /** Permission required to open / see this screen */
  viewPermission: Permission
  /** Permission(s) for create/update/manage on this screen (optional) */
  editPermissions?: Permission[]
}

/** Catalog of app screens that Super Admin / Admin can grant per role */
export const SCREEN_PRIVILEGE_CATALOG: ScreenPrivilegeDefinition[] = [
  {
    id: 'dashboard',
    module: 'Main',
    label: 'Dashboard',
    description: 'Main platform dashboard',
    viewPermission: PERMISSIONS.DASHBOARD.VIEW,
  },
  {
    id: 'hrms-dashboard',
    module: 'HRMS',
    label: 'HRMS Dashboard',
    description: 'HRMS overview',
    viewPermission: PERMISSIONS.HRMS.DASHBOARD_VIEW,
  },
  {
    id: 'employees',
    module: 'HRMS',
    label: 'Employees',
    description: 'Employee directory and profiles',
    viewPermission: PERMISSIONS.EMPLOYEES.VIEW,
    editPermissions: [
      PERMISSIONS.EMPLOYEES.CREATE,
      PERMISSIONS.EMPLOYEES.UPDATE,
      PERMISSIONS.EMPLOYEES.DELETE,
    ],
  },
  {
    id: 'attendance-dashboard',
    module: 'Attendance',
    label: 'Attendance Dashboard',
    description: 'Attendance overview and stats',
    viewPermission: PERMISSIONS.ATTENDANCE.DASHBOARD_VIEW,
  },
  {
    id: 'my-attendance',
    module: 'Attendance',
    label: 'My Attendance',
    description: 'Self check-in / check-out',
    viewPermission: PERMISSIONS.ATTENDANCE.MY_VIEW,
    editPermissions: [PERMISSIONS.ATTENDANCE.MY_MANAGE],
  },
  {
    id: 'daily-attendance',
    module: 'Attendance',
    label: 'Daily Attendance',
    description: 'Team daily attendance list',
    viewPermission: PERMISSIONS.ATTENDANCE.DAILY_VIEW,
    editPermissions: [PERMISSIONS.ATTENDANCE.EXPORT],
  },
  {
    id: 'attendance-calendar',
    module: 'Attendance',
    label: 'Attendance Calendar',
    description: 'Calendar view of attendance',
    viewPermission: PERMISSIONS.ATTENDANCE.CALENDAR_VIEW,
  },
  {
    id: 'corrections',
    module: 'Attendance',
    label: 'Corrections',
    description: 'Attendance correction requests',
    viewPermission: PERMISSIONS.ATTENDANCE.CORRECTIONS_VIEW,
    editPermissions: [PERMISSIONS.ATTENDANCE.CORRECTIONS_MANAGE],
  },
  {
    id: 'shifts',
    module: 'Attendance',
    label: 'Shifts',
    description: 'Shift templates and assignment',
    viewPermission: PERMISSIONS.ATTENDANCE.SHIFTS_MANAGE,
    editPermissions: [PERMISSIONS.ATTENDANCE.SHIFTS_MANAGE],
  },
  {
    id: 'overtime',
    module: 'Attendance',
    label: 'Overtime',
    description: 'Overtime requests and approvals',
    viewPermission: PERMISSIONS.ATTENDANCE.OVERTIME_VIEW,
    editPermissions: [PERMISSIONS.ATTENDANCE.OVERTIME_MANAGE],
  },
  {
    id: 'holidays',
    module: 'Attendance',
    label: 'Holidays',
    description: 'Holiday calendar management',
    viewPermission: PERMISSIONS.ATTENDANCE.HOLIDAYS_MANAGE,
    editPermissions: [PERMISSIONS.ATTENDANCE.HOLIDAYS_MANAGE],
  },
  {
    id: 'attendance-reports',
    module: 'Attendance',
    label: 'Attendance Reports',
    description: 'Generate attendance reports',
    viewPermission: PERMISSIONS.ATTENDANCE.REPORTS_VIEW,
  },
  {
    id: 'attendance-settings',
    module: 'Attendance',
    label: 'Attendance Settings',
    description: 'Attendance rules and configuration',
    viewPermission: PERMISSIONS.ATTENDANCE.SETTINGS_MANAGE,
    editPermissions: [PERMISSIONS.ATTENDANCE.SETTINGS_MANAGE],
  },
  {
    id: 'leave',
    module: 'HRMS',
    label: 'Leave',
    description: 'Leave requests and balances',
    viewPermission: PERMISSIONS.LEAVE.VIEW,
    editPermissions: [
      PERMISSIONS.LEAVE.CREATE,
      PERMISSIONS.LEAVE.APPROVE,
      PERMISSIONS.LEAVE.REJECT,
    ],
  },
  {
    id: 'payroll',
    module: 'HRMS',
    label: 'Payroll',
    description: 'Payroll runs and payslips',
    viewPermission: PERMISSIONS.PAYROLL.VIEW,
    editPermissions: [PERMISSIONS.PAYROLL.CREATE, PERMISSIONS.PAYROLL.UPDATE],
  },
  {
    id: 'recruitment',
    module: 'HRMS',
    label: 'Recruitment',
    description: 'Jobs and applicants',
    viewPermission: PERMISSIONS.RECRUITMENT.VIEW,
    editPermissions: [
      PERMISSIONS.RECRUITMENT.CREATE,
      PERMISSIONS.RECRUITMENT.UPDATE,
      PERMISSIONS.RECRUITMENT.DELETE,
    ],
  },
  {
    id: 'performance',
    module: 'HRMS',
    label: 'Performance',
    description: 'Reviews and goals',
    viewPermission: PERMISSIONS.PERFORMANCE.VIEW,
    editPermissions: [PERMISSIONS.PERFORMANCE.CREATE, PERMISSIONS.PERFORMANCE.UPDATE],
  },
  {
    id: 'documents',
    module: 'HRMS',
    label: 'Documents',
    description: 'HR document library',
    viewPermission: PERMISSIONS.DOCUMENTS.VIEW,
    editPermissions: [
      PERMISSIONS.DOCUMENTS.CREATE,
      PERMISSIONS.DOCUMENTS.UPDATE,
      PERMISSIONS.DOCUMENTS.DELETE,
    ],
  },
  {
    id: 'reports',
    module: 'HRMS',
    label: 'Reports',
    description: 'HRMS reports',
    viewPermission: PERMISSIONS.REPORTS.VIEW,
    editPermissions: [PERMISSIONS.REPORTS.EXPORT],
  },
  {
    id: 'users',
    module: 'Admin',
    label: 'Users & Roles',
    description: 'Create users and assign roles',
    viewPermission: PERMISSIONS.USERS.VIEW,
    editPermissions: [
      PERMISSIONS.USERS.CREATE,
      PERMISSIONS.USERS.UPDATE,
      PERMISSIONS.USERS.DELETE,
    ],
  },
  {
    id: 'screen-privileges',
    module: 'Admin',
    label: 'Screen Privileges',
    description: 'Configure page access per role',
    viewPermission: PERMISSIONS.PRIVILEGES.VIEW,
    editPermissions: [PERMISSIONS.PRIVILEGES.UPDATE],
  },
]
