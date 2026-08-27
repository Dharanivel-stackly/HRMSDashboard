import { useMemo, useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/common/StatCard'
import { AttendanceCalendar } from '@/features/hrms/attendance/components/AttendanceCalendar'
import { CheckInOutCard } from '@/features/hrms/attendance/components/CheckInOutCard'
import {
  mockCalendarDays,
  mockCheckInSession,
  mockMySummary,
} from '@/features/hrms/attendance/mock/attendance.mock'
import type { CheckInSession } from '@/features/hrms/attendance/types/attendance.types'
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
  const [session, setSession] = useState<CheckInSession>(mockCheckInSession)

  const summary = mockMySummary
  const monthLabel = useMemo(() => {
    const [y, m] = month.split('-').map(Number)
    return new Date(y, m - 1, 1).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    })
  }, [month])

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
        <StatCard label="Absent / Leave" value={`${summary.absent} / ${summary.leave}`} icon={UserX} accent="orange" />
        <StatCard label="Late" value={summary.late} icon={Clock} accent="orange" alert />
        <StatCard label="Holiday / Week Off" value={`${summary.holiday} / ${summary.weekOff}`} icon={CalendarDays} accent="purple" />
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
          onCheckIn={() => {
            const time = new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })
            setSession({
              ...session,
              checkedIn: true,
              checkInTime: time,
              statusToday: 'present',
              lastActivity: `Checked in at ${time}`,
              validationMessage: 'Work session active.',
            })
          }}
          onCheckOut={() => {
            const time = new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })
            setSession({
              ...session,
              checkOutTime: time,
              workHoursToday: 8.2,
              statusToday: 'present',
              lastActivity: `Checked out at ${time}`,
              validationMessage: 'Daily attendance finalized for today.',
            })
          }}
        />
        <AttendanceCalendar days={mockCalendarDays} monthLabel={monthLabel} />
      </div>
    </PageContainer>
  )
}
