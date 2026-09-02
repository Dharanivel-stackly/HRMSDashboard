export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',

  HRMS: {
    ROOT: '/hrms',
    DASHBOARD: '/hrms',
    EMPLOYEES: '/hrms/employees',
    EMPLOYEE_NEW: '/hrms/employees/new',
    EMPLOYEE_DETAIL: (id: string) => `/hrms/employees/${id}`,
    EMPLOYEE_EDIT: (id: string) => `/hrms/employees/${id}/edit`,

    ATTENDANCE: '/hrms/attendance',
    ATTENDANCE_MY: '/hrms/attendance/my',
    ATTENDANCE_DAILY: '/hrms/attendance/daily',
    ATTENDANCE_CALENDAR: '/hrms/attendance/calendar',
    ATTENDANCE_CORRECTIONS: '/hrms/attendance/corrections',
    ATTENDANCE_SHIFTS: '/hrms/attendance/shifts',
    ATTENDANCE_OVERTIME: '/hrms/attendance/overtime',
    ATTENDANCE_HOLIDAYS: '/hrms/attendance/holidays',
    ATTENDANCE_REPORTS: '/hrms/attendance/reports',
    ATTENDANCE_SETTINGS: '/hrms/attendance/settings',

    LEAVE: '/hrms/leave',
    PAYROLL: '/hrms/payroll',
    RECRUITMENT: '/hrms/recruitment',
    PERFORMANCE: '/hrms/performance',
    DOCUMENTS: '/hrms/documents',
    REPORTS: '/hrms/reports',
  },

  SETTINGS: {
    USERS: '/settings/users',
  },
} as const
