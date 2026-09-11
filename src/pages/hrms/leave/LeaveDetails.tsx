import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Check, X, Ban, Clock, AlertCircle, User, Calendar } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { LeaveStatusBadge } from '@/features/hrms/leave/components/LeaveStatusBadge'
import {
  useLeaveRequest,
  useApproveLeaveRequest,
  useCancelLeaveRequest,
  useRejectLeaveRequest,
} from '@/features/hrms/leave/hooks/useLeave'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ROUTES } from '@/lib/constants/routes'

export default function LeaveDetails() {
  const cancelLeave = useCancelLeaveRequest()
  const approveLeave = useApproveLeaveRequest()
  const rejectLeave = useRejectLeaveRequest()
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: request, isLoading, error } = useLeaveRequest(id ?? '')

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Clock className="mr-2 h-5 w-5 animate-spin" />
          Loading leave details...
        </div>
      </PageContainer>
    )
  }

  if (error || !request) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 font-semibold text-destructive">Leave request not found</h3>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate(ROUTES.HRMS.LEAVE_MY)}
          >
            Back to My Leaves
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Leave Request ${request.id}`}
        description="Detailed view of the leave application."
        actions={
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="max-w-4xl space-y-6">
        {/* Main Request Summary Card */}
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-xs space-y-6">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{request.leaveTypeName}</h2>
                <p className="text-xs text-muted-foreground">Request Ref: {request.id}</p>
              </div>
            </div>
            <LeaveStatusBadge status={request.status} />
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-muted/30 p-4 border border-border/40">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Applicant
              </div>
              <p className="mt-1 font-semibold text-foreground">{request.employeeName}</p>
              <p className="text-xs text-muted-foreground">{request.employeeId}</p>
            </div>

            <div className="rounded-lg bg-muted/30 p-4 border border-border/40">
              <p className="text-xs font-medium text-muted-foreground">Date Range</p>
              <p className="mt-1 font-semibold text-foreground">{request.fromDate}</p>
              <p className="text-xs text-muted-foreground">to {request.toDate}</p>
            </div>

            <div className="rounded-lg bg-muted/30 p-4 border border-border/40">
              <p className="text-xs font-medium text-muted-foreground">Total Duration</p>
              <p className="mt-1 font-semibold text-foreground">{request.numberOfDays} Days</p>
              <p className="text-xs text-muted-foreground">Full working days</p>
            </div>

            <div className="rounded-lg bg-muted/30 p-4 border border-border/40">
              <p className="text-xs font-medium text-muted-foreground">Applied Date</p>
              <p className="mt-1 font-semibold text-foreground">{request.appliedOn}</p>
              <p className="text-xs text-muted-foreground">Submitted on portal</p>
            </div>
          </div>

          {/* Reason Section */}
          <div className="border-t border-border/60 pt-5 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reason for Leave
            </h3>
            <div className="rounded-lg border border-border/40 bg-muted/10 p-4 text-sm leading-relaxed text-foreground">
              {request.reason}
            </div>
          </div>

          {/* Rejection Reason Box if Rejected */}
          {request.status === 'REJECTED' && request.rejectionReason && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                Rejection Note
              </h4>
              <p className="text-sm text-destructive">{request.rejectionReason}</p>
            </div>
          )}

          {/* Action Buttons for Pending Requests */}
          {request.status === 'PENDING' && (
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-6">
              <Button
                variant="outline"
                disabled={cancelLeave.isPending || approveLeave.isPending || rejectLeave.isPending}
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this leave request?')) {
                    cancelLeave.mutate(request.id, {
                      onSuccess: () => navigate(ROUTES.HRMS.LEAVE_MY),
                    })
                  }
                }}
              >
                <Ban className="mr-1.5 h-4 w-4" />
                {cancelLeave.isPending ? 'Cancelling...' : 'Cancel Request'}
              </Button>

              <Button
                variant="destructive"
                disabled={cancelLeave.isPending || approveLeave.isPending || rejectLeave.isPending}
                onClick={() => {
                  setRejectionReason('')
                  setShowRejectDialog(true)
                }}
              >
                <X className="mr-1.5 h-4 w-4" />
                Reject
              </Button>

              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={cancelLeave.isPending || approveLeave.isPending || rejectLeave.isPending}
                onClick={() => {
                  if (window.confirm('Are you sure you want to approve this leave request?')) {
                    approveLeave.mutate(request.id, {
                      onSuccess: () => navigate(ROUTES.HRMS.LEAVE_APPROVALS),
                    })
                  }
                }}
              >
                <Check className="mr-1.5 h-4 w-4" />
                {approveLeave.isPending ? 'Approving...' : 'Approve Request'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please state why this leave request is being rejected.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Rejection Reason <span className="text-destructive">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || rejectLeave.isPending}
              onClick={() => {
                rejectLeave.mutate(
                  { id: request.id, reason: rejectionReason.trim() },
                  {
                    onSuccess: () => {
                      setShowRejectDialog(false)
                      navigate(ROUTES.HRMS.LEAVE_APPROVALS)
                    },
                  }
                )
              }}
            >
              {rejectLeave.isPending ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}