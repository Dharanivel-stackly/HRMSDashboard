import { z } from 'zod'

export const shiftFormSchema = z.object({
  code: z.string().min(2, 'Code is required').max(10),
  name: z.string().min(2, 'Shift name is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  crossMidnight: z.boolean(),
  graceMinutes: z.coerce.number().min(0).max(120),
  breakMinutes: z.coerce.number().min(0).max(180),
  minWorkHours: z.coerce.number().min(1).max(24),
  halfDayThreshold: z.coerce.number().min(1).max(12),
  overtimeThreshold: z.coerce.number().min(1).max(24),
  departments: z.string().min(1, 'Select at least one department'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  status: z.enum(['active', 'inactive']),
})

export type ShiftFormData = z.infer<typeof shiftFormSchema>

export const correctionFormSchema = z.object({
  employeeName: z.string().min(2, 'Employee name is required'),
  department: z.string().min(1, 'Department is required'),
  attendanceDate: z.string().min(1, 'Attendance date is required'),
  existingCheckIn: z.string().optional(),
  existingCheckOut: z.string().optional(),
  requestedCheckIn: z.string().optional(),
  requestedCheckOut: z.string().optional(),
  correctionType: z.enum([
    'check_in',
    'check_out',
    'both',
    'status_change',
    'missed_punch',
  ]),
  reason: z.string().min(10, 'Please provide a reason (min 10 characters)'),
  attachmentName: z.string().optional(),
  approver: z.string().min(2, 'Approver is required'),
})

export type CorrectionFormData = z.infer<typeof correctionFormSchema>

export const holidayFormSchema = z.object({
  name: z.string().min(2, 'Holiday name is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['public', 'company', 'optional', 'restricted']),
  branch: z.string().min(1, 'Branch is required'),
  companyWide: z.boolean(),
  published: z.boolean(),
})

export type HolidayFormData = z.infer<typeof holidayFormSchema>
