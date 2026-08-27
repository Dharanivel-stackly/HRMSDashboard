import type { BaseEntity } from '@/types/common.types'

export type EmployeeStatus = 'active' | 'inactive' | 'probation' | 'terminated' | 'on_leave'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern'
export type Gender = 'male' | 'female' | 'other'

export interface Employee extends BaseEntity {
  employeeId: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  gender: Gender
  dateOfBirth: string
  department: string
  designation: string
  employmentType: EmploymentType
  status: EmployeeStatus
  joiningDate: string
  reportingTo?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  avatar?: string
}

export interface EmployeeFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: Gender
  dateOfBirth: string
  department: string
  designation: string
  employmentType: EmploymentType
  status: EmployeeStatus
  joiningDate: string
  reportingTo?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface EmployeeFilters {
  search?: string
  department?: string
  designation?: string
  status?: EmployeeStatus
  employmentType?: EmploymentType
}

export interface EmployeeListParams {
  page?: number
  limit?: number
  search?: string
  department?: string
  status?: EmployeeStatus
  employmentType?: EmploymentType
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
