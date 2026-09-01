import axios, {
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { getToken, clearTokens } from '@/lib/auth/auth'
import { ApiError } from './apiError'
import { environment } from '@/config/environment'
import { executeAttendanceMockRequest } from '@/lib/mock/mockAttendanceApiRouter'
import { parseRequestBody, serializeRequestBody } from '@/lib/api/requestBody'

const defaultAdapter = axios.getAdapter(['xhr', 'http', 'fetch'])

function buildUrl(config: InternalAxiosRequestConfig): string {
  const uri = axios.getUri({
    ...config,
    baseURL: config.baseURL ?? environment.apiBaseUrl,
  })

  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri
  }

  return new URL(uri, window.location.origin).toString()
}

function toAxiosResponse<T>(
  config: InternalAxiosRequestConfig,
  status: number,
  body: T
): AxiosResponse<T> {
  return {
    data: body,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: { 'content-type': 'application/json' },
    config,
    request: {},
  }
}

function parseRoutePath(url: string): { path: string; query: Record<string, string> } {
  const parsed = new URL(url, window.location.origin)
  const path = parsed.pathname.replace(/^\/api/, '') || '/'
  const query = Object.fromEntries(parsed.searchParams.entries())
  return { path, query }
}

const mockAttendanceAdapter: AxiosAdapter = async (config) => {
  const routeUrl = config.url ?? ''
  if (!routeUrl.startsWith('/attendance')) {
    return defaultAdapter(config)
  }

  const method = (config.method ?? 'get').toUpperCase()
  const requestUrl = buildUrl(config)
  const { path, query } = parseRoutePath(requestUrl)

  const headers = new Headers({ 'Content-Type': 'application/json' })
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(requestUrl, {
      method,
      headers,
      body:
        method === 'GET' || method === 'HEAD'
          ? undefined
          : serializeRequestBody(config.data),
    })

    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await response.json()
      if (response.ok) {
        return toAxiosResponse(config, response.status, body)
      }
      if (response.status !== 404) {
        throw new ApiError(body?.message ?? 'Request failed', response.status, body)
      }
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
  }

  const mockResponse = await executeAttendanceMockRequest({
    method,
    path,
    query,
    body: parseRequestBody(config.data),
  })

  if (!mockResponse.body.success) {
    throw new ApiError(mockResponse.body.message, mockResponse.status, mockResponse.body)
  }

  return toAxiosResponse(config, mockResponse.status, mockResponse.body)
}

const apiClient = axios.create({
  baseURL: environment.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  adapter: environment.useMockApi ? mockAttendanceAdapter : defaultAdapter,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        clearTokens()
        window.location.href = '/login'
      }

      const message = error.response?.data?.message || error.message || 'An unexpected error occurred'
      const status = error.response?.status || 500

      return Promise.reject(new ApiError(message, status, error.response?.data))
    }
    return Promise.reject(error)
  }
)

export const api = {
  get<T>(url: string, config?: Parameters<typeof apiClient.get>[1]): Promise<AxiosResponse<T>> {
    return apiClient.get<T>(url, config)
  },

  post<T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.post>[2]): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, data, config)
  },

  put<T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.put>[2]): Promise<AxiosResponse<T>> {
    return apiClient.put<T>(url, data, config)
  },

  patch<T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.patch>[2]): Promise<AxiosResponse<T>> {
    return apiClient.patch<T>(url, data, config)
  },

  delete<T>(url: string, config?: Parameters<typeof apiClient.delete>[1]): Promise<AxiosResponse<T>> {
    return apiClient.delete<T>(url, config)
  },
}

export default apiClient
