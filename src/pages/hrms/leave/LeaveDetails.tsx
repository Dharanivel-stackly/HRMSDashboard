import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LeaveStatusBadge } from '@/features/hrms/leave/components/LeaveStatusBadge'
import { useLeaveRequest, useApproveLeaveRequest,useCancelLeaveRequest,useRejectLeaveRequest } from '@/features/hrms/leave/hooks/useLeave'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function LeaveDetails() {
    const cancelLeave = useCancelLeaveRequest()
    const approveLeave = useApproveLeaveRequest()
    const rejectLeave = useRejectLeaveRequest()
    const [showRejectDialog, setShowRejectDialog] =useState(false)
const [rejectionReason, setRejectionReason] = useState('')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: request,
    isLoading,
    error,
  } = useLeaveRequest(id ?? '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading leave details...
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">
          Leave Details
        </h1>

        <div className="rounded-lg border p-6">
          <p className="text-sm text-destructive">
            Leave request not found.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate('/hrms/leave/my')}
        >
          Back to My Leaves
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            Leave Details
          </h1>

          <p className="text-muted-foreground">
            View details of your leave request.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate('/hrms/leave/my')}
        >
          Back
        </Button>

      </div>

      {/* Details Card */}
      <div className="rounded-lg border bg-card p-6">

        {/* Leave Type + Status */}
        <div className="flex items-center justify-between border-b pb-5">

          <div>
            <p className="text-sm text-muted-foreground">
              Leave Type
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {request.leaveTypeName}
            </h2>
          </div>

          <LeaveStatusBadge status={request.status} />

        </div>

        {/* Dates */}
        <div className="grid gap-6 py-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-muted-foreground">
              From Date
            </p>

            <p className="mt-1 font-medium">
              {request.fromDate}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              To Date
            </p>

            <p className="mt-1 font-medium">
              {request.toDate}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Number of Days
            </p>

            <p className="mt-1 font-medium">
              {request.numberOfDays} Days
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Applied On
            </p>

            <p className="mt-1 font-medium">
              {request.appliedOn}
            </p>
          </div>

        </div>

        {/* Reason */}
        <div className="border-t pt-6">

          <p className="text-sm text-muted-foreground">
            Reason
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            {request.reason}
          </p>

        </div>
{request.status === 'PENDING' && (
  <div className="flex justify-end gap-2 border-t pt-6">

    <Button
      variant="outline"
      disabled={
        cancelLeave.isPending ||
        approveLeave.isPending
      }
      onClick={() => {
        const confirmed = window.confirm(
          'Are you sure you want to cancel this leave request?'
        )

        if (!confirmed) {
          return
        }

        cancelLeave.mutate(request.id, {
          onSuccess: () => {
            navigate('/hrms/leave/my')
          },
        })
      }}
    >
      {cancelLeave.isPending
        ? 'Cancelling...'
        : 'Cancel Leave'}
    </Button>

    <Button
      disabled={
        cancelLeave.isPending ||
        approveLeave.isPending
      }
      onClick={() => {
        const confirmed = window.confirm(
          'Are you sure you want to approve this leave request?'
        )

        if (!confirmed) {
          return
        }

        approveLeave.mutate(request.id, {
          onSuccess: () => {
            navigate('/hrms/leave/approvals')
          },
        })
      }}
    >
      {approveLeave.isPending
        ? 'Approving...'
        : 'Approve Leave'}
    </Button>
    <Button
  variant="destructive"
  disabled={
    cancelLeave.isPending ||
    approveLeave.isPending ||
    rejectLeave.isPending
  }
  onClick={() => {
    setRejectionReason('')
    setShowRejectDialog(true)
  }}
>
  Reject Leave
</Button>
<Dialog
  open={showRejectDialog}
  onOpenChange={setShowRejectDialog}
>
  <DialogContent>

    <DialogHeader>
      <DialogTitle>
        Reject Leave Request
      </DialogTitle>

      <DialogDescription>
        Please provide a reason for rejecting
        this leave request.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-2">
      <label className="text-sm font-medium">
        Rejection Reason
      </label>

      <textarea
        value={rejectionReason}
        onChange={(event) =>
          setRejectionReason(event.target.value)
        }
        placeholder="Enter rejection reason..."
        className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>

    <DialogFooter>

      <Button
        variant="outline"
        onClick={() =>
          setShowRejectDialog(false)
        }
      >
        Cancel
      </Button>

      <Button
        variant="destructive"
        disabled={
          !rejectionReason.trim() ||
          rejectLeave.isPending
        }
        onClick={() => {
          rejectLeave.mutate(
            {
              id: request.id,
              reason: rejectionReason,
            },
            {
              onSuccess: () => {
                setShowRejectDialog(false)
                navigate('/hrms/leave/approvals')
              },
            }
          )
        }}
      >
        {rejectLeave.isPending
          ? 'Rejecting...'
          : 'Reject Leave'}
      </Button>

    </DialogFooter>

  </DialogContent>
</Dialog>
  </div>
)}
      </div>

    </div>
    
  )
}