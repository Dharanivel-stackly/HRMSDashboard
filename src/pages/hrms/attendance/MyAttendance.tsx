import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/common/StatCard'
import { AttendanceCalendar } from '@/features/hrms/attendance/components/AttendanceCalendar'
import { CheckInOutCard } from '@/features/hrms/attendance/components/CheckInOutCard'
import {
  useMyAttendance,
  useCheckIn,
  useCheckOut,
} from '@/features/hrms/attendance/hooks/useAttendance'
import {
  Percent,
  UserCheck,
  UserX,
  CalendarDays,
  Clock,
  Hourglass,
} from 'lucide-react'

export default function MyAttendance() {
  const [month, setMonth] = useState('2026-08')
  const { data, isLoading, isError, refetch } = useMyAttendance(month)
  const checkIn = useCheckIn()
  const checkOut = useCheckOut()

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

  const { summary, calendarDays, session } = data

  return (
    <PageContainer>
      <PageHeader
        title="My Attendance"
        description="Self-service attendance, monthly history, and correction requests"
        actions={
          <div className="flex items-center gap-2">
            <Input
              type="month"
              className="w-[160px]"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <Button variant="outline">Request Correction</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Attendance %"
          value={`${summary.attendancePercentage}%`}
          icon={Percent}
          accent="green"
          badge="Healthy"
          badgeTone="success"
        />
        <StatCard label="Present" value={summary.present} icon={UserCheck} accent="blue" />
        <StatCard
          label="Absent / Leave"
          value={`${summary.absent} / ${summary.leave}`}
          icon={UserX}
          accent="orange"
        />
        <StatCard label="Late" value={summary.late} icon={Clock} accent="orange" alert />
        <StatCard
          label="Holiday / Week Off"
          value={`${summary.holiday} / ${summary.weekOff}`}
          icon={CalendarDays}
          accent="purple"
        />
        <StatCard
          label="Overtime Total"
          value={`${summary.overtimeHours}h`}
          icon={Hourglass}
          accent="indigo"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <CheckInOutCard
          session={session}
          onCheckIn={() => checkIn.mutate()}
          onCheckOut={() => checkOut.mutate()}
        />
        <AttendanceCalendar days={calendarDays} monthLabel={summary.monthLabel} />
      </div>
    </PageContainer>
  )
}
