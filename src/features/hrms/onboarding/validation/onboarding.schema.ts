import { z } from 'zod'

export const onboardingEmployeeUpdateSchema = z.object({
  status: z.enum([
    'not_started',
    'document_collection',
    'document_verification',
    'background_verification',
    'orientation',
    'policy_acceptance',
    'system_access',
    'it_tasks',
    'asset_allocation',
    'manager_tasks',
    'hr_tasks',
    'completed',
  ]),
  progress: z.coerce.number().min(0).max(100).optional(),
})

export const documentUploadSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  documentType: z.enum([
    'aadhar',
    'pan',
    'passport',
    'driving_license',
    'degree_certificate',
    'experience_letter',
    'salary_slip',
    'offer_letter',
    'background_check',
    'medical_report',
    'other',
  ]),
  file: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'File size must be less than 5MB',
  }),
})

export const documentVerificationSchema = z.object({
  documentId: z.string().min(1),
  status: z.enum(['verified', 'rejected']),
  comments: z.string().optional(),
})

export const policyAcceptanceSchema = z.object({
  policyId: z.string().min(1),
  accepted: z.boolean(),
})

export const assetAllocationSchema = z.object({
  employeeId: z.string().min(1),
  assetType: z.enum([
    'laptop',
    'desktop',
    'monitor',
    'keyboard',
    'mouse',
    'headset',
    'phone',
    'access_card',
  ]),
  assetTag: z.string().min(1),
  serialNumber: z.string().min(1),
  notes: z.string().optional(),
})

export type OnboardingEmployeeUpdate = z.infer<typeof onboardingEmployeeUpdateSchema>
export type DocumentUpload = z.infer<typeof documentUploadSchema>
export type DocumentVerification = z.infer<typeof documentVerificationSchema>
export type PolicyAcceptance = z.infer<typeof policyAcceptanceSchema>
export type AssetAllocation = z.infer<typeof assetAllocationSchema>