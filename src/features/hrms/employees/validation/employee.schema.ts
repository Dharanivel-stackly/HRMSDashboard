import { z } from 'zod'

export const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'intern'], {
    required_error: 'Please select employment type',
  }),
  status: z.enum(['active', 'inactive', 'probation', 'terminated', 'on_leave'], {
    required_error: 'Please select a status',
  }),
  joiningDate: z.string().min(1, 'Joining date is required'),
  reportingTo: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
})

export type EmployeeSchemaType = z.infer<typeof employeeSchema>
