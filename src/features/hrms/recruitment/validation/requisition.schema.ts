// src/features/hrms/recruitment/validation/requisition.schema.ts
import { z } from 'zod'

export const requisitionFormSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(2, 'Location is required'),
  jobType: z.enum(['full_time', 'part_time', 'contract', 'intern', 'temporary']),
  positions: z.coerce.number().min(1, 'At least 1 position'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  qualifications: z.string().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  closingDate: z.string().min(1, 'Closing date is required'),
})

export type RequisitionFormData = z.infer<typeof requisitionFormSchema>

export const candidateFilterSchema = z.object({
  search: z.string().optional(),
  position: z.string().optional(),
  status: z.enum([
    'applied', 'screening', 'shortlisted', 'interview_scheduled',
    'interviewed', 'evaluated', 'selected', 'offer_sent',
    'offer_accepted', 'offer_declined', 'hired', 'rejected'
  ]).optional(),
  source: z.enum(['linkedin', 'naukri', 'referral', 'career_page', 'agency', 'other']).optional(),
  experienceMin: z.coerce.number().optional(),
  experienceMax: z.coerce.number().optional(),
})

export type CandidateFilterData = z.infer<typeof candidateFilterSchema>