// src/config/environment.ts
const useMockApi = false  // force real HTTP calls

export const environment = {
  appName: import.meta.env.VITE_APP_NAME || 'One Enterprise',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  isDevelopment: import.meta.env.VITE_ENVIRONMENT === 'development',
  isProduction: import.meta.env.VITE_ENVIRONMENT === 'production',
  useMockApi,
  apiBaseUrl: '/api',   // base URL for all API calls
} as const