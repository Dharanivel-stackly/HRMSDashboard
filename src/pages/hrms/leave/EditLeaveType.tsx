import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  useLeaveTypes,
  useUpdateLeaveType,
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

  totalDays: z
    .number()
    .min(1, 'Annual days must be at least 1')
    .max(365, 'Annual days cannot exceed 365'),

  isPaid: z.boolean(),
})

type LeaveTypeFormData = z.infer<
  typeof leaveTypeSchema
>

export default function EditLeaveType() {
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    data: leaveTypes = [],
    isLoading: typesLoading,
  } = useLeaveTypes()

  const leaveType = leaveTypes.find(
    (type) => type.id === id
  )

  const updateLeaveType =
    useUpdateLeaveType(id ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),

    values: leaveType
      ? {
          name: leaveType.name,
          code: leaveType.code,
          totalDays: leaveType.totalDays,
          isPaid: leaveType.isPaid,
        }
      : undefined,
  })

  if (typesLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading leave type...
      </div>
    )
  }

  if (!leaveType) {
    return (
      <div className="rounded-lg border p-6">
        <p className="font-medium">
          Leave type not found.
        </p>

        <Button
          className="mt-4"
          variant="outline"
          onClick={() =>
            navigate('/hrms/leave/types')
          }
        >
          Back to Leave Types
        </Button>
      </div>
    )
  }

  const onSubmit = (
    data: LeaveTypeFormData
  ) => {
    updateLeaveType.mutate(data, {
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
          Edit Leave Type
        </h1>

        <p className="text-muted-foreground">
          Update leave type configuration.
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

        {/* API Error */}

        {updateLeaveType.error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">
              {updateLeaveType.error instanceof Error
                ? updateLeaveType.error.message
                : 'Failed to update leave type'}
            </p>
          </div>
        )}

        {/* Actions */}

        <div className="flex justify-end gap-2">

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate('/hrms/leave/types')
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={updateLeaveType.isPending}
          >
            {updateLeaveType.isPending
              ? 'Updating...'
              : 'Update Leave Type'}
          </Button>

        </div>

      </form>
    </div>
  )
}