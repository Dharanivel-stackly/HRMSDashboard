import { useState } from 'react'
import { Download, FileBarChart, Play } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AttendanceFiltersBar } from '@/features/hrms/attendance/components/AttendanceFilters'
import { mockReportTypes } from '@/features/hrms/attendance/mock/attendance.mock'
import type { AttendanceFilters } from '@/features/hrms/attendance/types/attendance.types'
import { cn } from '@/lib/utils/cn'

export default function AttendanceReports() {
  const [selected, setSelected] = useState(mockReportTypes[0]?.id ?? 'daily')
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: '2026-08-25',
    branch: 'All Branches',
    department: 'All Departments',
    shift: 'All Shifts',
  })
  const [generated, setGenerated] = useState(false)

  const report = mockReportTypes.find((r) => r.id === selected)

  return (
    <PageContainer>
      <PageHeader
        title="Attendance Reports"
        description="Generate, preview and export attendance reports"
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="ui-card-elevated space-y-1 rounded-xl border border-border/60 bg-card p-3">
          {mockReportTypes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelected(item.id)
                setGenerated(false)
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
          ))}
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
                <Input type="date" defaultValue="2026-08-01" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <Input type="date" defaultValue="2026-08-25" />
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
              <Button onClick={() => setGenerated(true)}>
                <Play className="mr-2 h-4 w-4" />
                Generate
              </Button>
              <Button variant="outline" disabled={!generated}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" disabled={!generated}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" disabled={!generated}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="ui-card-elevated min-h-[220px] rounded-xl border border-border/60 bg-card p-5">
            <h3 className="font-semibold text-[#0b3d91]">Preview</h3>
            {generated ? (
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Preview for <span className="font-medium text-foreground">{report?.name}</span>
                </p>
                <div className="rounded-lg border border-dashed border-border bg-brand-soft/40 p-6 text-center">
                  <p className="font-medium">Report ready (demo)</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Filters applied · Drill-down and export available
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
