import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { AttendanceCalendar } from '@/features/hrms/attendance/components/AttendanceCalendar'
import { useAttendanceCalendar } from '@/features/hrms/attendance/hooks/useAttendance'

export default function AttendanceCalendarPage() {
  const [month] = useState('2026-08')
  const { data, isLoading, isError, refetch } = useAttendanceCalendar(month)

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState variant="page" rows={6} />
      </PageContainer>
    )
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Attendance Calendar"
        description="Month view of present, absent, leave, holiday, late and corrections"
      />
      <AttendanceCalendar days={data.days} monthLabel={data.monthLabel} />
    </PageContainer>
  )
}
