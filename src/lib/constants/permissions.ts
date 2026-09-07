export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'dashboard.view',
  },
  HRMS: {
    DASHBOARD_VIEW: 'hrms.dashboard.view',
  },
  EMPLOYEES: {
    VIEW: 'employees.view',
    CREATE: 'employees.create',
    UPDATE: 'employees.update',
    DELETE: 'employees.delete',
    EXPORT: 'employees.export',
  },
  ATTENDANCE: {
    /** Employee self-service: My Attendance, personal calendar, check-in/out */
    MY_VIEW: 'attendance.my.view',
    MY_MANAGE: 'attendance.my.manage',
    /** Admin / HR attendance screens */
    DASHBOARD_VIEW: 'attendance.dashboard.view',
    DAILY_VIEW: 'attendance.daily.view',
    CALENDAR_VIEW: 'attendance.calendar.view',
    CORRECTIONS_VIEW: 'attendance.corrections.view',
    CORRECTIONS_MANAGE: 'attendance.corrections.manage',
    SHIFTS_MANAGE: 'attendance.shifts.manage',
    OVERTIME_VIEW: 'attendance.overtime.view',
    OVERTIME_MANAGE: 'attendance.overtime.manage',
    HOLIDAYS_MANAGE: 'attendance.holidays.manage',
    REPORTS_VIEW: 'attendance.reports.view',
    SETTINGS_MANAGE: 'attendance.settings.manage',
    EXPORT: 'attendance.export',
    /** Legacy aliases — kept for backward compatibility */
    VIEW: 'attendance.view',
    CREATE: 'attendance.create',
    UPDATE: 'attendance.update',
  },
  LEAVE: {
    VIEW: 'leave.view',
    CREATE: 'leave.create',
    APPROVE: 'leave.approve',
    REJECT: 'leave.reject',
    EXPORT: 'leave.export',
  },
  PAYROLL: {
    VIEW: 'payroll.view',
    CREATE: 'payroll.create',
    UPDATE: 'payroll.update',
    EXPORT: 'payroll.export',
  },
  RECRUITMENT: {
    VIEW: 'recruitment.view',
    CREATE: 'recruitment.create',
    UPDATE: 'recruitment.update',
    DELETE: 'recruitment.delete',
  },
  PERFORMANCE: {
    VIEW: 'performance.view',
    CREATE: 'performance.create',
    UPDATE: 'performance.update',
  },
  REPORTS: {
    VIEW: 'reports.view',
    EXPORT: 'reports.export',
  },
  DOCUMENTS: {
    VIEW: 'documents.view',
    CREATE: 'documents.create',
    UPDATE: 'documents.update',
    DELETE: 'documents.delete',
  },
  USERS: {
    VIEW: 'users.view',
    CREATE: 'users.create',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
  },
} as const

type FlatPermissions = {
  [K in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[K][keyof (typeof PERMISSIONS)[K]]
}

export type Permission = FlatPermissions[keyof FlatPermissions]
