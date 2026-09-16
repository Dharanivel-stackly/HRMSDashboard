const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false'

export const environment = {
  appName: import.meta.env.VITE_APP_NAME || 'One Enterprise',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  isDevelopment: import.meta.env.VITE_ENVIRONMENT === 'development',
  isProduction: import.meta.env.VITE_ENVIRONMENT === 'production',
  /** When true, auth and APIs use in-memory mock data (no backend required) */
  useMockApi,
  /** Mock mode routes HTTP calls through the Vite dev/preview server at /api */
  apiBaseUrl: useMockApi
    ? '/api'
    : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
} as const
