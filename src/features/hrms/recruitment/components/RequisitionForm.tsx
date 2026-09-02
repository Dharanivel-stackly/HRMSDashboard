// src/features/hrms/recruitment/components/RequisitionForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  JOB_TYPE_OPTIONS,
  DEPARTMENT_OPTIONS,
} from '../constants/recruitment.constants'
import type { Requisition } from '../types/recruitment.types'

const requisitionFormSchema = z.object({
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

interface RequisitionFormProps {
  defaultValues?: Partial<RequisitionFormData>
  onSubmit: (data: RequisitionFormData) => void
  isLoading?: boolean
  submitLabel?: string
}

const departmentOptions = DEPARTMENT_OPTIONS.filter((d) => d.value !== 'all')

export function RequisitionForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Requisition',
}: RequisitionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequisitionFormData>({
    resolver: zodResolver(requisitionFormSchema),
    defaultValues: {
      title: '',
      department: departmentOptions[0]?.value || '',
      location: '',
      jobType: 'full_time',
      positions: 1,
      description: '',
      requirements: '',
      qualifications: '',
      salaryMin: undefined,
      salaryMax: undefined,
      priority: 'medium',
      closingDate: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Requisition Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" placeholder="e.g. Senior Software Engineer" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={watch('department')}
              onValueChange={(v) => setValue('department', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. Head Office, Bangalore" {...register('location')} />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Job Type</Label>
            <Select
              value={watch('jobType')}
              onValueChange={(v) => setValue('jobType', v as RequisitionFormData['jobType'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.jobType && <p className="text-sm text-destructive">{errors.jobType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="positions">Number of Positions</Label>
            <Input id="positions" type="number" min={1} {...register('positions')} />
            {errors.positions && <p className="text-sm text-destructive">{errors.positions.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={watch('priority')}
              onValueChange={(v) => setValue('priority', v as RequisitionFormData['priority'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closingDate">Closing Date</Label>
            <Input id="closingDate" type="date" {...register('closingDate')} />
            {errors.closingDate && <p className="text-sm text-destructive">{errors.closingDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMin">Salary Range (Min)</Label>
            <Input id="salaryMin" type="number" placeholder="e.g. 800000" {...register('salaryMin')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax">Salary Range (Max)</Label>
            <Input id="salaryMax" type="number" placeholder="e.g. 1500000" {...register('salaryMax')} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe the role, responsibilities, and impact..."
              {...register('description')}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="requirements">Key Requirements</Label>
            <Textarea
              id="requirements"
              rows={3}
              placeholder="List technical skills, experience, education requirements..."
              {...register('requirements')}
            />
            {errors.requirements && <p className="text-sm text-destructive">{errors.requirements.message}</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="qualifications">Preferred Qualifications (optional)</Label>
            <Textarea
              id="qualifications"
              rows={2}
              placeholder="Additional qualifications that are nice to have..."
              {...register('qualifications')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}