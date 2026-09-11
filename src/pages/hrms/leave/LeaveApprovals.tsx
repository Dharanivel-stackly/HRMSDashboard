import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Eye, Clock, AlertCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { LeaveStatusBadge } from '@/features/hrms/leave/components/LeaveStatusBadge'
import {
  useLeaveRequests,
  useApproveLeaveRequest,
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

type ApprovalFilter = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'

export default function LeaveApprovals() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ApprovalFilter>('PENDING')
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const { data: leaveRequests = [], isLoading, error } = useLeaveRequests()
  const approveMutation = useApproveLeaveRequest()
  const rejectMutation = useRejectLeaveRequest()

  const filteredRequests = useMemo(() => {
    if (filter === 'ALL') return leaveRequests
    return leaveRequests.filter((r) => r.status === filter)
  }, [leaveRequests, filter])

  const pendingCount = useMemo(
    () => leaveRequests.filter((r) => r.status === 'PENDING').length,
    [leaveRequests]
  )

  const handleApprove = (id: string) => {
    if (window.confirm('Are you sure you want to approve this leave request?')) {
      approveMutation.mutate(id)
    }
  }

  const openRejectModal = (id: string) => {
    setSelectedRequestId(id)
    setRejectionReason('')
    setShowRejectModal(true)
  }

  const handleRejectConfirm = () => {
    if (!selectedRequestId || !rejectionReason.trim()) return
    rejectMutation.mutate(
      { id: selectedRequestId, reason: rejectionReason.trim() },
      {
        onSuccess: () => {
          setShowRejectModal(false)
          setSelectedRequestId(null)
          setRejectionReason('')
        },
      }
    )
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Clock className="mr-2 h-5 w-5 animate-spin" />
          Loading leave approvals...
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 font-semibold text-destructive">Failed to load leave requests</h3>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Leave Approvals"
        description="Review, approve, or reject employee leave applications."
      />

      {/* Summary KPI */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pending Approvals
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{pendingCount}</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Approved
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {leaveRequests.filter((r) => r.status === 'APPROVED').length}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Rejected
          </p>
          <p className="mt-2 text-3xl font-bold text-rose-600">
            {leaveRequests.filter((r) => r.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as ApprovalFilter[]).map((f) => (
          <Button
            key={f}
            type="button"
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="text-xs"
          >
            {f === 'PENDING' ? `Pending (${pendingCount})` : f.charAt(0) + f.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/60 bg-card shadow-xs">
        <div className="border-b border-border/60 px-6 py-4">
          <h3 className="text-base font-semibold">Leave Requests</h3>
          <p className="text-xs text-muted-foreground">
            Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/20">
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-6 py-3 font-medium">Leave Type</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Days</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-border/40 last:border-b-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{request.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{request.employeeId}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{request.leaveTypeName}</td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    {request.fromDate} to {request.toDate}
                  </td>
                  <td className="px-6 py-4 font-semibold">{request.numberOfDays}</td>
                  <td className="px-6 py-4">
                    <LeaveStatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(ROUTES.HRMS.LEAVE_DETAIL(request.id))}
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View
                      </Button>

                      {request.status === 'PENDING' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={approveMutation.isPending}
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="mr-1 h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={rejectMutation.isPending}
                            onClick={() => openRejectModal(request.id)}
                          >
                            <X className="mr-1 h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No leave requests found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Reason Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please enter the reason for rejecting this leave request. This will be visible to the employee.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Rejection Reason <span className="text-destructive">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="State the reason for rejection..."
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
              onClick={handleRejectConfirm}
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}