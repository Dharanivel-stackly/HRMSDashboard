// src/features/hrms/recruitment/components/ApprovalWorkflow.tsx
import { CheckCircle2, Clock, XCircle, User, FileText } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { APPROVAL_STATUS_LABELS } from '../constants/recruitment.constants'
import type { Approval } from '../types/recruitment.types'

interface ApprovalWorkflowProps {
  approvals: Approval[]
  onApprove?: (id: string, comments?: string) => void
  onReject?: (id: string, comments?: string) => void
}

const statusIcon = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
}

const statusTone = {
  pending: 'text-amber-600 bg-amber-50 border-amber-200',
  approved: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  rejected: 'text-red-600 bg-red-50 border-red-200',
}

export function ApprovalWorkflow({ approvals, onApprove, onReject }: ApprovalWorkflowProps) {
  if (approvals.length === 0) {
    return (
      <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-8 text-center">
        <p className="text-muted-foreground">No approval requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => {
        const Icon = statusIcon[approval.status]
        return (
          <div
            key={approval.id}
            className="ui-card-elevated rounded-xl border border-border/60 bg-card p-4"
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                  statusTone[approval.status]
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{approval.requisitionTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {approval.department} • {approval.positions} position(s)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested by {approval.requestedBy}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      statusTone[approval.status]
                    )}
                  >
                    {APPROVAL_STATUS_LABELS[approval.status]}
                  </span>
                </div>

                {approval.approver && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Approved by: {approval.approver}</span>
                    {approval.approvalDate && (
                      <span className="text-xs">on {approval.approvalDate}</span>
                    )}
                  </div>
                )}

                {approval.comments && (
                  <div className="mt-2 rounded-lg bg-brand-soft/60 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Comment:</span> {approval.comments}
                  </div>
                )}

                {approval.status === 'pending' && onApprove && onReject && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onApprove(approval.id)}
                      className="rounded-lg bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(approval.id)}
                      className="rounded-lg bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}