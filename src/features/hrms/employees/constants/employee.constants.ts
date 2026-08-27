import type { EmployeeStatus, EmploymentType } from '../types/employee.types'
import type { SelectOption } from '@/types/api.types'

export const EMPLOYEE_STATUS_OPTIONS: SelectOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Probation', value: 'probation' },
  { label: 'Terminated', value: 'terminated' },
  { label: 'On Leave', value: 'on_leave' },
]

export const EMPLOYMENT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Intern', value: 'intern' },
]

export const GENDER_OPTIONS: SelectOption[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export const DEPARTMENT_OPTIONS: SelectOption[] = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
  { label: 'Finance', value: 'finance' },
  { label: 'Human Resources', value: 'human_resources' },
  { label: 'Operations', value: 'operations' },
]

export const STATUS_VARIANT_MAP: Record<EmployeeStatus, 'active' | 'inactive' | 'pending' | 'warning' | 'error'> = {
  active: 'active',
  inactive: 'inactive',
  probation: 'pending',
  terminated: 'error',
  on_leave: 'warning',
}

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  intern: 'Intern',
}
