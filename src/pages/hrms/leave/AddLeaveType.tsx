import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useCreateLeaveType,
} from '@/features/hrms/leave/hooks/useLeave'

const leaveTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Leave type name is required'),

  code: z
    .string()
    .trim()
    .min(2, 'Leave code is required')
    .max(5, 'Leave code must not exceed 5 characters'),

  totalDays: z.number().min(
  1,
  'Annual days must be at least 1'
)
    .min(1, 'Annual days must be at least 1')
    .max(365, 'Annual days cannot exceed 365'),

  isPaid: z.boolean(),
})

type LeaveTypeFormData = z.infer<
  typeof leaveTypeSchema
>

export default function AddLeaveType() {
  const navigate = useNavigate()

  const createLeaveType =
    useCreateLeaveType()

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

//   const onSubmit = (data: LeaveTypeFormData) => {
//     createLeaveType.mutate(data, {
//       onSuccess: () => {
//         navigate('/hrms/leave/types')
//       },
//     })
//   }

const onSubmit = (data: LeaveTypeFormData) => {
  createLeaveType.mutate(data, {
    onSuccess: () => {
      navigate('/hrms/leave/types')
    },
  })
}

  return (
    <div className="max-w-2xl space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold">
          Add Leave Type
        </h1>

        <p className="text-muted-foreground">
          Create a new leave type for employees.
        </p>
      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border bg-card p-6"
      >

        {/* Name */}

        <div className="space-y-2">

          <label className="text-sm font-medium">
            Leave Type Name
          </label>

          <Input
            placeholder="Example: Casual Leave"
            {...register('name')}
          />

          {errors.name && (
            <p className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}

        </div>

        {/* Code */}

        <div className="space-y-2">

          <label className="text-sm font-medium">
            Leave Code
          </label>

          <Input
            placeholder="Example: CL"
            maxLength={5}
            {...register('code')}
          />

          {errors.code && (
            <p className="text-sm text-destructive">
              {errors.code.message}
            </p>
          )}

        </div>

        {/* Annual Days */}

        <div className="space-y-2">

          <label className="text-sm font-medium">
            Annual Entitlement
          </label>

          <Input
            type="number"
            {...register('totalDays', {
              valueAsNumber: true,
            })}
          />

          {errors.totalDays && (
            <p className="text-sm text-destructive">
              {errors.totalDays.message}
            </p>
          )}

        </div>

        {/* Paid */}

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            id="isPaid"
            {...register('isPaid')}
          />

          <label
            htmlFor="isPaid"
            className="text-sm font-medium"
          >
            Paid Leave
          </label>

        </div>

       {/* error */}

        {createLeaveType.error && (
  <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
    <p className="text-sm text-destructive">
      {createLeaveType.error instanceof Error
        ? createLeaveType.error.message
        : 'Failed to create leave type'}
    </p>
  </div>
)}

        {/* Actions */}

        <div className="flex justify-end gap-2">

          <Button
            type="button"
            variant="outline"
            onClick= {() =>
              navigate('/hrms/leave/types')
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createLeaveType.isPending}
          >
            {createLeaveType.isPending
              ? 'Creating...'
              : 'Create Leave Type'}
          </Button>

        </div>

      </form>

    </div>
  )
}