import type { PaginatedResponse } from '@/types/api.types'
import type {
  Employee,
  EmployeeFormData,
  EmployeeListParams,
} from '@/features/hrms/employees/types/employee.types'
import { MOCK_EMPLOYEES } from './mockEmployees'
import { ApiError } from '@/lib/api/apiError'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

/** In-memory store so create/update/delete work during demo */
let employees: Employee[] = [...MOCK_EMPLOYEES]
let nextId = 1009

function applyFilters(list: Employee[], params?: EmployeeListParams): Employee[] {
  if (!params) return list

  let result = [...list]

  if (params.search) {
    const q = params.search.toLowerCase()
    result = result.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q)
    )
  }

  if (params.department) {
    result = result.filter((e) => e.department === params.department)
  }

  if (params.status) {
    result = result.filter((e) => e.status === params.status)
  }

  if (params.employmentType) {
    result = result.filter((e) => e.employmentType === params.employmentType)
  }

  return result
}

export const mockEmployeeService = {
  async getEmployees(params?: EmployeeListParams): Promise<PaginatedResponse<Employee>> {
    await delay()

    const filtered = applyFilters(employees, params)
    const page = params?.page ?? 1
    const limit = params?.limit ?? 10
    const start = (page - 1) * limit
    const data = filtered.slice(start, start + limit)

    return {
      data,
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
      },
    }
  },

  async getEmployeeById(id: string): Promise<Employee> {
    await delay()
    const employee = employees.find((e) => e.id === id)
    if (!employee) {
      throw new ApiError('Employee not found', 404)
    }
    return employee
  },

  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    await delay()
    const now = new Date().toISOString()
    const employee: Employee = {
      id: `emp-${String(nextId).padStart(3, '0')}`,
      employeeId: `EMP-${nextId}`,
      fullName: `${data.firstName} ${data.lastName}`,
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    nextId += 1
    employees = [employee, ...employees]
    return employee
  },

  async updateEmployee(id: string, data: Partial<EmployeeFormData>): Promise<Employee> {
    await delay()
    const index = employees.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new ApiError('Employee not found', 404)
    }

    const current = employees[index]
    const updated: Employee = {
      ...current,
      ...data,
      fullName:
        data.firstName || data.lastName
          ? `${data.firstName ?? current.firstName} ${data.lastName ?? current.lastName}`
          : current.fullName,
      updatedAt: new Date().toISOString(),
    }
    employees = [...employees.slice(0, index), updated, ...employees.slice(index + 1)]
    return updated
  },

  async deleteEmployee(id: string): Promise<void> {
    await delay()
    employees = employees.filter((e) => e.id !== id)
  },
}
