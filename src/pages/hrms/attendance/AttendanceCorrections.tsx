import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { CorrectionFormDialog } from '@/features/hrms/attendance/components/CorrectionFormDialog'
import { CorrectionTimeline } from '@/features/hrms/attendance/components/CorrectionTimeline'
import { mockCorrections } from '@/features/hrms/attendance/mock/attendance.mock'
import type { CorrectionRequest, CorrectionStatus } from '@/features/hrms/attendance/types/attendance.types'
import { cn } from '@/lib/utils/cn'

const tabs: Array<{ id: CorrectionStatus | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

export default function AttendanceCorrections() {
  const [corrections, setCorrections] = useState<CorrectionRequest[]>(mockCorrections)
  const [tab, setTab] = useState<CorrectionStatus | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered =
    tab === 'all' ? corrections : corrections.filter((c) => c.status === tab)

  const handleCreate = (correction: CorrectionRequest) => {
    setCorrections((prev) => [correction, ...prev])
    setTab('pending')
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

      {filtered.length === 0 ? (
        <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-12 text-center">
          <p className="text-muted-foreground">No correction requests in this view.</p>
          <Button className="mt-4" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Correction
          </Button>
        </div>
      ) : (
        <CorrectionTimeline corrections={filtered} />
      )}

      <CorrectionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
    </PageContainer>
  )
}
