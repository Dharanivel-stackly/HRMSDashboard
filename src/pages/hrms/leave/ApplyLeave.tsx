import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Send } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
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
import { ROUTES } from '@/lib/constants/routes'

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

function calculateLeaveDays(fromDate: string, toDate: string): number {
  if (!fromDate || !toDate) {
    return 0
  }
  const start = new Date(`${fromDate}T00:00:00`)
  const end = new Date(`${toDate}T00:00:00`)
  if (end < start) {
    return 0
  }
  const difference = end.getTime() - start.getTime()
  return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1
}

export default function ApplyLeave() {
  const navigate = useNavigate()
  const [balanceError, setBalanceError] = useState('')

  const { data: leaveTypes = [], isLoading: leaveTypesLoading } = useLeaveTypes()
  const { data: leaveBalance = [] } = useLeaveBalance()
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
          navigate(ROUTES.HRMS.LEAVE_MY)
        },
      }
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Apply Leave"
        description="Submit a new leave request for approval."
        actions={
          <Button variant="outline" onClick={() => navigate(ROUTES.HRMS.LEAVE)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leave Overview
          </Button>
        }
      />

      <div className="max-w-3xl">
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-xs">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Leave Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Leave Type <span className="text-destructive">*</span>
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
                        <SelectItem key={leaveType.id} value={leaveType.id}>
                          {leaveType.name} ({leaveType.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {selectedBalance && (
                <div className="rounded-md bg-muted/40 p-3 text-xs flex justify-between items-center">
                  <span>Available Balance: <strong className="text-foreground">{selectedBalance.available} days</strong></span>
                  <span className="text-muted-foreground">Used: {selectedBalance.used} days | Pending: {selectedBalance.pending} days</span>
                </div>
              )}

              {errors.leaveTypeId && (
                <p className="text-xs text-destructive">{errors.leaveTypeId.message}</p>
              )}
            </div>

            {/* Dates Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* From Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  From Date <span className="text-destructive">*</span>
                </label>
                <Input type="date" {...register('fromDate')} />
                {errors.fromDate && (
                  <p className="text-xs text-destructive">{errors.fromDate.message}</p>
                )}
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  To Date <span className="text-destructive">*</span>
                </label>
                <Input type="date" {...register('toDate')} />
                {errors.toDate && (
                  <p className="text-xs text-destructive">{errors.toDate.message}</p>
                )}
              </div>
            </div>

            {/* Number of Days Preview */}
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Total Duration</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {numberOfDays > 0 ? `${numberOfDays} Day${numberOfDays > 1 ? 's' : ''}` : '--'}
                </span>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Reason for Leave <span className="text-destructive">*</span>
              </label>

              <textarea
                {...register('reason')}
                placeholder="Please describe your reason for requesting leave..."
                rows={4}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />

              {errors.reason && (
                <p className="text-xs text-destructive">{errors.reason.message}</p>
              )}
            </div>

            {/* Balance Error */}
            {balanceError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-xs font-medium text-destructive">{balanceError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.HRMS.LEAVE)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={createLeaveRequest.isPending}>
                <Send className="mr-2 h-4 w-4" />
                {createLeaveRequest.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  )
}