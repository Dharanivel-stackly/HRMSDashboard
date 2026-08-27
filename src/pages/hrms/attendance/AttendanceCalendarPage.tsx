import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { AttendanceCalendar } from '@/features/hrms/attendance/components/AttendanceCalendar'
import { mockCalendarDays } from '@/features/hrms/attendance/mock/attendance.mock'

export default function AttendanceCalendarPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Attendance Calendar"
        description="Month view of present, absent, leave, holiday, late and corrections"
      />
      <AttendanceCalendar days={mockCalendarDays} monthLabel="August 2026" />
    </PageContainer>
  )
}
