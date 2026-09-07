import { useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  useCreateLeaveRequest,
  useLeaveBalance,
  useLeaveTypes,
} from '@/features/hrms/leave/hooks/useLeave'

const applyLeaveSchema = z
  .object({
    leaveTypeId: z.string().min(1, 'Please select a leave type'),

    fromDate: z.string().min(1, 'Please select a start date'),

    toDate: z.string().min(1, 'Please select an end date'),

    reason: z
      .string()
      .min(5, 'Reason must be at least 5 characters')
      .max(500, 'Reason cannot exceed 500 characters'),
  })
  .refine(
    (data) => {
      if (!data.fromDate || !data.toDate) {
        return true
      }

      return data.toDate >= data.fromDate
    },
    {
      message: 'End date must be on or after start date',
      path: ['toDate'],
    }
  )

type ApplyLeaveFormData = z.infer<typeof applyLeaveSchema>

function calculateLeaveDays(
  fromDate: string,
  toDate: string
): number {
  if (!fromDate || !toDate) {
    return 0
  }

  const start = new Date(`${fromDate}T00:00:00`)
  const end = new Date(`${toDate}T00:00:00`)

  if (end < start) {
    return 0
  }

  const difference =
    end.getTime() - start.getTime()

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  ) + 1
}
export default function ApplyLeave() {
  const navigate = useNavigate()
const [balanceError, setBalanceError] = useState('')

  const {
    data: leaveTypes = [],
    isLoading: leaveTypesLoading,
  } = useLeaveTypes()

  const {
    data: leaveBalance = [],
  } = useLeaveBalance()

  const createLeaveRequest = useCreateLeaveRequest()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplyLeaveFormData>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      leaveTypeId: '',
      fromDate: '',
      toDate: '',
      reason: '',
    },
  })

  const fromDate = watch('fromDate')
  const toDate = watch('toDate')
  const leaveTypeId = watch('leaveTypeId')

  const numberOfDays = useMemo(
    () => calculateLeaveDays(fromDate, toDate),
    [fromDate, toDate]
  )

  const selectedBalance = leaveBalance.find(
    (balance) => balance.leaveTypeId === leaveTypeId
  )

  const onSubmit = (data: ApplyLeaveFormData) => {
  setBalanceError('')

  if (numberOfDays <= 0) {
    return
  }

  if (!selectedBalance) {
    return
  }

  if (numberOfDays > selectedBalance.available) {
    setBalanceError(
      `You have only ${selectedBalance.available} days of ${selectedBalance.leaveTypeName} available. You requested ${numberOfDays} days.`
    )

    return
  }

  createLeaveRequest.mutate(
    {
      ...data,
      numberOfDays,
    },
    {
      onSuccess: () => {
        navigate('/hrms/leave')
      },
    }
  )
}

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Apply Leave
        </h1>

        <p className="text-muted-foreground">
          Submit a new leave request.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl rounded-lg border bg-card p-6">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Leave Type */}
          <div className="space-y-2">

            <label className="text-sm font-medium">
              Leave Type
            </label>

            <Controller
              name="leaveTypeId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={leaveTypesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>

                  <SelectContent>
                    {leaveTypes.map((leaveType) => (
                      <SelectItem
                        key={leaveType.id}
                        value={leaveType.id}
                      >
                        {leaveType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {selectedBalance && (
              <p className="text-sm text-muted-foreground">
                Available balance:{' '}
                <span className="font-medium">
                  {selectedBalance.available} days
                </span>
              </p>
            )}

            {errors.leaveTypeId && (
              <p className="text-sm text-destructive">
                {errors.leaveTypeId.message}
              </p>
            )}

          </div>

          {/* Dates */}
          <div className="grid gap-6 md:grid-cols-2">

            {/* From Date */}
            <div className="space-y-2">

              <label className="text-sm font-medium">
                From Date
              </label>

              <Input
                type="date"
                {...register('fromDate')}
              />

              {errors.fromDate && (
                <p className="text-sm text-destructive">
                  {errors.fromDate.message}
                </p>
              )}

            </div>

            {/* To Date */}
            <div className="space-y-2">

              <label className="text-sm font-medium">
                To Date
              </label>

              <Input
                type="date"
                {...register('toDate')}
              />

              {errors.toDate && (
                <p className="text-sm text-destructive">
                  {errors.toDate.message}
                </p>
              )}

            </div>

          </div>

          {/* Number of Days */}
          <div className="rounded-md border bg-muted/30 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium">
                Number of Days
              </span>

              <span className="text-lg font-semibold">
                {numberOfDays > 0
                  ? `${numberOfDays} Days`
                  : '--'}
              </span>

            </div>

          </div>

          {/* Reason */}
          <div className="space-y-2">

            <label className="text-sm font-medium">
              Reason
            </label>

            <textarea
              {...register('reason')}
              placeholder="Enter reason for leave"
              rows={4}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />

            {errors.reason && (
              <p className="text-sm text-destructive">
                {errors.reason.message}
              </p>
            )}

          </div>
             {balanceError && (
             <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
             <p className="text-sm text-destructive">
             {balanceError}
           </p>
         </div>
           )}
          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-6">

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/hrms/leave')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createLeaveRequest.isPending
              }
            >
              {createLeaveRequest.isPending
                ? 'Submitting...'
                : 'Submit Leave Request'}
            </Button>

          </div>

        </form>

      </div>
    </div>
  )
}