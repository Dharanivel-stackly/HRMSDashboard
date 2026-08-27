import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Employee, EmployeeFormData, EmployeeListParams } from '../types/employee.types'
import { environment } from '@/config/environment'
import { mockEmployeeService } from '@/lib/mock/mockEmployeeService'

export const employeeService = {
  async getEmployees(params?: EmployeeListParams): Promise<PaginatedResponse<Employee>> {
    if (environment.useMockApi) {
      return mockEmployeeService.getEmployees(params)
    }

    const response = await api.get<PaginatedResponse<Employee>>(
      API_ENDPOINTS.EMPLOYEES.BASE,
      { params }
    )
    return response.data
  },

  async getEmployeeById(id: string): Promise<Employee> {
    if (environment.useMockApi) {
      return mockEmployeeService.getEmployeeById(id)
    }

    const response = await api.get<ApiResponse<Employee>>(
      API_ENDPOINTS.EMPLOYEES.BY_ID(id)
    )
    return response.data.data
  },

  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    if (environment.useMockApi) {
      return mockEmployeeService.createEmployee(data)
    }

    const response = await api.post<ApiResponse<Employee>>(
      API_ENDPOINTS.EMPLOYEES.BASE,
      data
    )
    return response.data.data
  },

  async updateEmployee(id: string, data: Partial<EmployeeFormData>): Promise<Employee> {
    if (environment.useMockApi) {
      return mockEmployeeService.updateEmployee(id, data)
    }

    const response = await api.put<ApiResponse<Employee>>(
      API_ENDPOINTS.EMPLOYEES.BY_ID(id),
      data
    )
    return response.data.data
  },

  async deleteEmployee(id: string): Promise<void> {
    if (environment.useMockApi) {
      return mockEmployeeService.deleteEmployee(id)
    }
    await api.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id))
  },
}
