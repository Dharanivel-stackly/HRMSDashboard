export const PERMISSIONS = {
  EMPLOYEES: {
    VIEW: 'employees.view',
    CREATE: 'employees.create',
    UPDATE: 'employees.update',
    DELETE: 'employees.delete',
    EXPORT: 'employees.export',
  },
  ATTENDANCE: {
    VIEW: 'attendance.view',
    CREATE: 'attendance.create',
    UPDATE: 'attendance.update',
    EXPORT: 'attendance.export',
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
} as const

type FlatPermissions = {
  [K in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[K][keyof (typeof PERMISSIONS)[K]]
}

export type Permission = FlatPermissions[keyof FlatPermissions]
