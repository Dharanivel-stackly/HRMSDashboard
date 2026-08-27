export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id: string) => `/employees/${id}`,
    SEARCH: '/employees/search',
  },
  ATTENDANCE: {
    BASE: '/attendance',
    BY_ID: (id: string) => `/attendance/${id}`,
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
  },
  LEAVE: {
    BASE: '/leave',
    BY_ID: (id: string) => `/leave/${id}`,
    APPROVE: (id: string) => `/leave/${id}/approve`,
    REJECT: (id: string) => `/leave/${id}/reject`,
  },
  PAYROLL: {
    BASE: '/payroll',
    BY_ID: (id: string) => `/payroll/${id}`,
    GENERATE: '/payroll/generate',
  },
  RECRUITMENT: {
    BASE: '/recruitment',
    BY_ID: (id: string) => `/recruitment/${id}`,
  },
  PERFORMANCE: {
    BASE: '/performance',
    BY_ID: (id: string) => `/performance/${id}`,
  },
  DEPARTMENTS: {
    BASE: '/departments',
  },
  DESIGNATIONS: {
    BASE: '/designations',
  },
} as const
