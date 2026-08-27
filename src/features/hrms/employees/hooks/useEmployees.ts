import { useQuery } from '@tanstack/react-query'
import { employeeService } from '../services/employeeService'
import type { EmployeeListParams } from '../types/employee.types'

export function useEmployees(params?: EmployeeListParams) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeeService.getEmployees(params),
  })
}
