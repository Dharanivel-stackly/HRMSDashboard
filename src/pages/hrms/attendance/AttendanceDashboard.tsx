import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogIn,
  LogOut,
  PencilLine,
  Eye,
  FileBarChart,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { AttendanceKpiCards } from '@/features/hrms/attendance/components/AttendanceKpiCards'
import { AttendanceFiltersBar } from '@/features/hrms/attendance/components/AttendanceFilters'
import { AttendanceStatusBadge } from '@/features/hrms/attendance/components/AttendanceStatusBadge'
import { CheckInOutCard } from '@/features/hrms/attendance/components/CheckInOutCard'
import {
  mockAttendanceKpis,
  mockAttendanceTrend,
  mockCheckInSession,
  mockCorrections,
  mockDailyAttendance,
  mockDepartmentDistribution,
} from '@/features/hrms/attendance/mock/attendance.mock'
import type { AttendanceFilters, CheckInSession } from '@/features/hrms/attendance/types/attendance.types'
import { ROUTES } from '@/lib/constants/routes'

export default function AttendanceDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: '2026-08-25',
    branch: 'All Branches',
    department: 'All Departments',
    shift: 'All Shifts',
  })
  const [session, setSession] = useState<CheckInSession>(mockCheckInSession)

  const maxTrend = useMemo(
    () => Math.max(...mockAttendanceTrend.map((t) => t.present + t.absent + t.late), 1),
    []
  )

  const lateOrAbsent = mockDailyAttendance.filter(
    (r) => r.status === 'late' || r.status === 'absent'
  )
  const pending = mockCorrections.filter((c) => c.status === 'pending')

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
    setSession({
      ...session,
      checkedIn: true,
      checkInTime: time,
      sessionSeconds: 0,
      statusToday: 'present',
      lastActivity: `Checked in at ${time}`,
      validationMessage: 'Active work session started. Remember to check out at end of day.',
    })
  }

  const handleCheckOut = () => {
    const time = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const hours = Math.max(0.1, session.sessionSeconds / 3600)
    setSession({
      ...session,
      checkOutTime: time,
      workHoursToday: Number(hours.toFixed(1)),
      statusToday: hours >= 8 ? 'present' : 'half_day',
      lastActivity: `Checked out at ${time}`,
      validationMessage: 'Attendance saved. Hours and status calculated for today.',
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Attendance Dashboard"
        description="Monitor daily attendance, exceptions, and quick actions"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate(ROUTES.HRMS.ATTENDANCE_DAILY)}>
              <Eye className="mr-2 h-4 w-4" />
              View Attendance
            </Button>
            <Button variant="outline" onClick={() => navigate(ROUTES.HRMS.ATTENDANCE_CORRECTIONS)}>
              <PencilLine className="mr-2 h-4 w-4" />
              Add Correction
            </Button>
            <Button onClick={() => navigate(ROUTES.HRMS.ATTENDANCE_REPORTS)}>
              <FileBarChart className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        }
      />

      <AttendanceFiltersBar
        filters={filters}
        onChange={setFilters}
        showStatus={false}
        showSearch={false}
      />

      <AttendanceKpiCards kpis={mockAttendanceKpis} />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-base font-semibold text-[#0b3d91]">Weekly Attendance Trend</h3>
            <p className="mt-1 text-xs text-muted-foreground">Present / Absent / Late</p>
            <div className="mt-5 flex h-44 items-end gap-3">
              {mockAttendanceTrend.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end gap-0.5">
                    <div
                      className="flex-1 rounded-t bg-emerald-500/80"
                      style={{ height: `${(point.present / maxTrend) * 100}%` }}
                      title={`Present ${point.present}`}
                    />
                    <div
                      className="flex-1 rounded-t bg-red-400/80"
                      style={{ height: `${(point.absent / maxTrend) * 100}%` }}
                      title={`Absent ${point.absent}`}
                    />
                    <div
                      className="flex-1 rounded-t bg-amber-400/80"
                      style={{ height: `${(point.late / maxTrend) * 100}%` }}
                      title={`Late ${point.late}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{point.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-base font-semibold text-[#0b3d91]">Department-wise Distribution</h3>
            <div className="mt-4 space-y-3">
              {mockDepartmentDistribution.map((dept) => {
                const total = dept.present + dept.absent + dept.late + dept.onLeave
                return (
                  <div key={dept.department}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium">{dept.department}</span>
                      <span className="text-muted-foreground">{total} people</span>
                    </div>
                    <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${(dept.present / total) * 100}%` }}
                      />
                      <div
                        className="bg-amber-400"
                        style={{ width: `${(dept.late / total) * 100}%` }}
                      />
                      <div
                        className="bg-red-400"
                        style={{ width: `${(dept.absent / total) * 100}%` }}
                      />
                      <div
                        className="bg-sky-400"
                        style={{ width: `${(dept.onLeave / total) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <CheckInOutCard
            session={session}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />

          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#0b3d91]">Pending Corrections</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.HRMS.ATTENDANCE_CORRECTIONS)}
              >
                View all
              </Button>
            </div>
            <div className="space-y-3">
              {pending.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 bg-brand-soft/50 px-3 py-2.5"
                >
                  <p className="text-sm font-medium">{item.employeeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.attendanceDate} · {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-base font-semibold text-[#0b3d91]">Late / Absent Today</h3>
            <div className="mt-3 space-y-2">
              {lateOrAbsent.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{row.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{row.department}</p>
                  </div>
                  <AttendanceStatusBadge status={row.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="flex-1" onClick={handleCheckIn}>
              <LogIn className="mr-2 h-4 w-4" />
              Check-In
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleCheckOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Check-Out
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
