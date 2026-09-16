import { useState } from 'react'
import { Download, CheckCheck } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { AttendanceFiltersBar } from '@/features/hrms/attendance/components/AttendanceFilters'
import { AttendanceTable } from '@/features/hrms/attendance/components/AttendanceTable'
import { useDailyAttendance } from '@/features/hrms/attendance/hooks/useAttendance'
import { exportDailyAttendanceCsv } from '@/features/hrms/attendance/utils/exportDailyAttendance'
import type { AttendanceFilters } from '@/features/hrms/attendance/types/attendance.types'

export default function DailyAttendance() {
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: '2026-08-25',
    branch: 'All Branches',
    department: 'All Departments',
    shift: 'All Shifts',
    status: 'all',
    search: '',
  })

  const { data: records = [], isLoading, isError, refetch } = useDailyAttendance(filters)

  const handleExport = () => {
    if (records.length === 0) return
    exportDailyAttendanceCsv(records, filters)
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Daily Attendance"
        description="View, validate, correct, and export day-wise attendance"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Approve Selected
            </Button>
            <Button onClick={handleExport} disabled={isLoading || records.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      <AttendanceFiltersBar filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing <span className="font-medium text-foreground">{records.length}</span> employees
          for {filters.date}
        </p>
        <p>
          Exceptions:{' '}
          <span className="font-medium text-amber-700">
            {records.filter((r) => r.status !== 'present' && r.status !== 'overtime').length}
          </span>
        </p>
      </div>

      {isLoading ? (
        <LoadingState rows={6} />
      ) : (
        <AttendanceTable records={records} onView={() => undefined} onCorrect={() => undefined} />
      )}
    </PageContainer>
  )
}
