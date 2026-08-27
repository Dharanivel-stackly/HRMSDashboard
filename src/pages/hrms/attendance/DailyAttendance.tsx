import { useMemo, useState } from 'react'
import { Download, CheckCheck } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { AttendanceFiltersBar } from '@/features/hrms/attendance/components/AttendanceFilters'
import { AttendanceTable } from '@/features/hrms/attendance/components/AttendanceTable'
import { mockDailyAttendance } from '@/features/hrms/attendance/mock/attendance.mock'
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

  const records = useMemo(() => {
    return mockDailyAttendance.filter((row) => {
      if (
        filters.branch &&
        filters.branch !== 'All Branches' &&
        row.branch !== filters.branch
      ) {
        return false
      }
      if (
        filters.department &&
        filters.department !== 'All Departments' &&
        row.department !== filters.department
      ) {
        return false
      }
      if (filters.shift && filters.shift !== 'All Shifts' && row.shift !== filters.shift) {
        return false
      }
      if (filters.status && filters.status !== 'all' && row.status !== filters.status) {
        return false
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (
          !row.employeeName.toLowerCase().includes(q) &&
          !row.employeeCode.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [filters])

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
            <Button>
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

      <AttendanceTable
        records={records}
        onView={() => undefined}
        onCorrect={() => undefined}
      />
    </PageContainer>
  )
}
