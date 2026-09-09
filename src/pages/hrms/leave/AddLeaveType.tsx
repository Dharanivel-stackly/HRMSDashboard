import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'

import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateLeaveType } from '@/features/hrms/leave/hooks/useLeave'
import { ROUTES } from '@/lib/constants/routes'

const leaveTypeSchema = z.object({
  name: z.string().trim().min(2, 'Leave type name is required'),
  code: z
    .string()
    .trim()
    .min(2, 'Leave code is required')
    .max(5, 'Leave code must not exceed 5 characters'),
  totalDays: z
    .number()
    .min(1, 'Annual days must be at least 1')
    .max(365, 'Annual days cannot exceed 365'),
  isPaid: z.boolean(),
})

type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>

export default function AddLeaveType() {
  const navigate = useNavigate()
  const createLeaveType = useCreateLeaveType()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      name: '',
      code: '',
      totalDays: 12,
      isPaid: true,
    },
  })

  const onSubmit = (data: LeaveTypeFormData) => {
    createLeaveType.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.HRMS.LEAVE_TYPES)
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Add Leave Type"
        description="Configure a new leave category and entitlement for employees."
        actions={
          <Button variant="outline" onClick={() => navigate(ROUTES.HRMS.LEAVE_TYPES)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leave Types
          </Button>
        }
      />

      <div className="max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-xl border border-border/60 bg-card p-6 shadow-xs"
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Leave Type Name <span className="text-destructive">*</span>
            </label>
            <Input placeholder="Example: Casual Leave" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Leave Code <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Example: CL"
              maxLength={5}
              {...register('code')}
            />
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code.message}</p>
            )}
          </div>

          {/* Annual Days */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Annual Entitlement (Days) <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              {...register('totalDays', { valueAsNumber: true })}
            />
            {errors.totalDays && (
              <p className="text-xs text-destructive">{errors.totalDays.message}</p>
            )}
          </div>

          {/* Paid */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPaid"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('isPaid')}
            />
            <label htmlFor="isPaid" className="text-sm font-medium text-foreground">
              Paid Leave
            </label>
          </div>

          {/* API Error */}
          {createLeaveType.error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-xs text-destructive font-medium">
                {createLeaveType.error instanceof Error
                  ? createLeaveType.error.message
                  : 'Failed to create leave type'}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border/60 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.HRMS.LEAVE_TYPES)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLeaveType.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {createLeaveType.isPending ? 'Creating...' : 'Create Leave Type'}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}