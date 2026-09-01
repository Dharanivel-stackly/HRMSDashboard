import { useState } from 'react'
import { Download, FileBarChart, Play } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AttendanceFiltersBar } from '@/features/hrms/attendance/components/AttendanceFilters'
import {
  useReportTypes,
  useGenerateReport,
} from '@/features/hrms/attendance/hooks/useAttendance'
import type {
  AttendanceFilters,
  GenerateReportResult,
} from '@/features/hrms/attendance/types/attendance.types'
import { cn } from '@/lib/utils/cn'

export default function AttendanceReports() {
  const [selected, setSelected] = useState('daily')
  const [dateFrom, setDateFrom] = useState('2026-08-01')
  const [dateTo, setDateTo] = useState('2026-08-25')
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: '2026-08-25',
    branch: 'All Branches',
    department: 'All Departments',
    shift: 'All Shifts',
  })
  const [preview, setPreview] = useState<GenerateReportResult | null>(null)

  const { data: reportTypes = [], isLoading, isError, refetch } = useReportTypes()
  const generateReport = useGenerateReport()

  const report = reportTypes.find((r) => r.id === selected)

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Attendance Reports"
        description="Generate, preview and export attendance reports"
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="ui-card-elevated space-y-1 rounded-xl border border-border/60 bg-card p-3">
          {isLoading ? (
            <LoadingState rows={4} />
          ) : (
            reportTypes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelected(item.id)
                  setPreview(null)
                }}
                className={cn(
                  'w-full rounded-lg px-3 py-2.5 text-left transition-colors',
                  selected === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-brand-soft text-foreground'
                )}
              >
                <p className="text-sm font-medium">{item.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{item.description}</p>
              </button>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileBarChart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0b3d91]">{report?.name}</h3>
                <p className="text-sm text-muted-foreground">{report?.description}</p>
              </div>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">From</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>

            <AttendanceFiltersBar
              filters={filters}
              onChange={setFilters}
              showDate={false}
              showStatus={false}
              showSearch={false}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                disabled={generateReport.isPending}
                onClick={async () => {
                  const result = await generateReport.mutateAsync({
                    reportId: selected,
                    dateFrom,
                    dateTo,
                    filters,
                  })
                  setPreview(result)
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                {generateReport.isPending ? 'Generating...' : 'Generate'}
              </Button>
              <Button variant="outline" disabled={!preview}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" disabled={!preview}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" disabled={!preview}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="ui-card-elevated min-h-[220px] rounded-xl border border-border/60 bg-card p-5">
            <h3 className="font-semibold text-[#0b3d91]">Preview</h3>
            {preview ? (
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Preview for{' '}
                  <span className="font-medium text-foreground">{preview.reportName}</span>
                </p>
                <div className="rounded-lg border border-dashed border-border bg-brand-soft/40 p-6 text-center">
                  <p className="font-medium">{preview.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {preview.rowCount} rows · Generated {new Date(preview.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Select filters and click Generate to preview the report.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
