import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { CorrectionFormDialog } from '@/features/hrms/attendance/components/CorrectionFormDialog'
import { CorrectionTimeline } from '@/features/hrms/attendance/components/CorrectionTimeline'
import {
  useCorrections,
  useCreateCorrection,
} from '@/features/hrms/attendance/hooks/useAttendance'
import type { CorrectionStatus } from '@/features/hrms/attendance/types/attendance.types'
import { cn } from '@/lib/utils/cn'

const tabs: Array<{ id: CorrectionStatus | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

export default function AttendanceCorrections() {
  const [tab, setTab] = useState<CorrectionStatus | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: corrections = [], isLoading, isError, refetch } = useCorrections(tab)
  const createCorrection = useCreateCorrection()

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Attendance Corrections"
        description="Request, review, approve or reject attendance corrections"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Correction
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-muted-foreground hover:bg-brand-soft'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState rows={4} />
      ) : corrections.length === 0 ? (
        <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-12 text-center">
          <p className="text-muted-foreground">No correction requests in this view.</p>
          <Button className="mt-4" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Correction
          </Button>
        </div>
      ) : (
        <CorrectionTimeline corrections={corrections} />
      )}

      <CorrectionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isLoading={createCorrection.isPending}
        onSubmit={async (payload) => {
          await createCorrection.mutateAsync(payload)
          setTab('pending')
        }}
      />
    </PageContainer>
  )
}
