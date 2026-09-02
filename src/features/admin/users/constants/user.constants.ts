import { ROLES, ROLE_LABELS } from '@/lib/constants/roles'
import type { RoleOption } from '../types/user.types'

export const USER_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
} as const

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: ROLES.SUPER_ADMIN,
    label: ROLE_LABELS.SUPER_ADMIN,
    description: 'Full system access — all modules and settings',
  },
  {
    value: ROLES.ADMIN,
    label: ROLE_LABELS.ADMIN,
    description: 'Full administrative access',
  },
  {
    value: ROLES.HR_MANAGER,
    label: ROLE_LABELS.HR_MANAGER,
    description: 'HRMS, employees, and full attendance management',
  },
  {
    value: ROLES.HR_EXECUTIVE,
    label: ROLE_LABELS.HR_EXECUTIVE,
    description: 'HR operations with attendance and employee access',
  },
  {
    value: ROLES.MANAGER,
    label: ROLE_LABELS.MANAGER,
    description: 'Team attendance, corrections, and leave approvals',
  },
  {
    value: ROLES.EMPLOYEE,
    label: ROLE_LABELS.EMPLOYEE,
    description: 'Self-service — My Attendance and personal calendar only',
  },
]
