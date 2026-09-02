import { z } from 'zod'
import { ROLES, type Role } from '@/lib/constants/roles'

const roleValues = Object.values(ROLES) as [Role, ...Role[]]

export const userFormSchema = z.object({  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  roles: z.array(z.enum(roleValues)).min(1, 'Select at least one role'),
  status: z.enum(['active', 'inactive']),
})

export type UserFormData = z.infer<typeof userFormSchema>
