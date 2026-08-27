import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  CORRECTION_STATUS_LABELS,
  CORRECTION_TYPE_LABELS,
} from '../constants/attendance.constants'
import type { CorrectionRequest } from '../types/attendance.types'

interface CorrectionTimelineProps {
  corrections: CorrectionRequest[]
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

export function CorrectionTimeline({ corrections }: CorrectionTimelineProps) {
  return (
    <div className="space-y-3">
      {corrections.map((item, index) => {
        const Icon = statusIcon[item.status]
        return (
          <div
            key={item.id}
            className="ui-card-elevated relative rounded-xl border border-border/60 bg-card p-4"
          >
            {index < corrections.length - 1 && (
              <span className="absolute left-[27px] top-14 h-[calc(100%-24px)] w-px bg-border" />
            )}
            <div className="flex gap-3">
              <div
                className={cn(
                  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                  statusTone[item.status]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{item.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.department} · {item.attendanceDate}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      statusTone[item.status]
                    )}
                  >
                    {CORRECTION_STATUS_LABELS[item.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p>
                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-brand-soft px-3 py-2">
                    <p className="text-muted-foreground">Existing</p>
                    <p className="mt-0.5 font-medium">
                      {item.existingCheckIn ?? '—'} → {item.existingCheckOut ?? '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-brand-soft px-3 py-2">
                    <p className="text-muted-foreground">Requested</p>
                    <p className="mt-0.5 font-medium">
                      {item.requestedCheckIn ?? '—'} → {item.requestedCheckOut ?? '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-brand-soft px-3 py-2">
                    <p className="text-muted-foreground">Type</p>
                    <p className="mt-0.5 font-medium">
                      {CORRECTION_TYPE_LABELS[item.correctionType]}
                    </p>
                  </div>
                  <div className="rounded-lg bg-brand-soft px-3 py-2">
                    <p className="text-muted-foreground">Approver</p>
                    <p className="mt-0.5 font-medium">{item.approver}</p>
                  </div>
                </div>
                {item.approvalComments && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Comment: {item.approvalComments}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Submitted {item.submittedAt}
                  {item.attachmentName ? ` · ${item.attachmentName}` : ''}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
