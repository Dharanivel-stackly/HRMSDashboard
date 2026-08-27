import { useEffect, useState } from 'react'
import { LogIn, LogOut, Clock3, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import type { CheckInSession } from '../types/attendance.types'

interface CheckInOutCardProps {
  session: CheckInSession
  onCheckIn?: () => void
  onCheckOut?: () => void
}

function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function CheckInOutCard({ session, onCheckIn, onCheckOut }: CheckInOutCardProps) {
  const [now, setNow] = useState(new Date())
  const [elapsed, setElapsed] = useState(session.sessionSeconds)

  useEffect(() => {
    const tick = setInterval(() => {
      setNow(new Date())
      if (session.checkedIn && !session.checkOutTime) {
        setElapsed((prev) => prev + 1)
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [session.checkedIn, session.checkOutTime])

  useEffect(() => {
    setElapsed(session.sessionSeconds)
  }, [session.sessionSeconds])

  const dateLabel = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeLabel = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="bg-gradient-to-r from-[#0b3d91] to-[#1a73e8] px-6 py-5 text-white">
        <p className="text-sm text-white/80">{dateLabel}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">{timeLabel}</p>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{session.employeeName}</p>
            <p className="text-sm text-muted-foreground">{session.employeeCode}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Shift: <span className="font-medium text-foreground">{session.shift}</span>{' '}
              ({session.shiftTiming})
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-brand-soft px-4 py-3">
            <p className="text-xs text-muted-foreground">Check-in</p>
            <p className="mt-1 text-lg font-semibold">{session.checkInTime ?? '—'}</p>
          </div>
          <div className="rounded-xl bg-brand-soft px-4 py-3">
            <p className="text-xs text-muted-foreground">Session timer</p>
            <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold">
              <Clock3 className="h-4 w-4 text-primary" />
              {formatDuration(elapsed)}
            </p>
          </div>
          <div className="rounded-xl bg-brand-soft px-4 py-3">
            <p className="text-xs text-muted-foreground">Check-out</p>
            <p className="mt-1 text-lg font-semibold">{session.checkOutTime ?? '—'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Today&apos;s status</p>
            <div className="mt-1">
              <AttendanceStatusBadge status={session.statusToday} />
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Work hours today</p>
            <p className="mt-1 text-lg font-semibold">
              {session.workHoursToday !== null ? `${session.workHoursToday.toFixed(1)}h` : '—'}
            </p>
          </div>
        </div>

        {session.validationMessage && (
          <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">
            {session.validationMessage}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            className="min-w-[140px]"
            disabled={session.checkedIn && !session.checkOutTime}
            onClick={onCheckIn}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Check-In
          </Button>
          <Button
            variant="outline"
            className="min-w-[140px]"
            disabled={!session.checkedIn || Boolean(session.checkOutTime)}
            onClick={onCheckOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Check-Out
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">Last activity: {session.lastActivity}</p>
      </div>
    </div>
  )
}
