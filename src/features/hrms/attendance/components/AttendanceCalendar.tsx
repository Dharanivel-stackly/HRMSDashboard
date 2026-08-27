import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import type { CalendarDay } from '../types/attendance.types'

interface AttendanceCalendarProps {
  days: CalendarDay[]
  monthLabel: string
  onSelectDay?: (day: CalendarDay) => void
}

const STATUS_DOT: Record<string, string> = {
  present: 'bg-emerald-500',
  late: 'bg-amber-500',
  half_day: 'bg-orange-500',
  absent: 'bg-red-500',
  holiday: 'bg-violet-500',
  week_off: 'bg-slate-400',
  on_leave: 'bg-sky-500',
  overtime: 'bg-indigo-500',
  correction_pending: 'bg-amber-600',
}

export function AttendanceCalendar({
  days,
  monthLabel,
  onSelectDay,
}: AttendanceCalendarProps) {
  const [selected, setSelected] = useState<CalendarDay | null>(
    days.find((d) => d.date.endsWith('-25')) ?? days[0] ?? null
  )

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarDay>()
    days.forEach((d) => map.set(d.date, d))
    return map
  }, [days])

  const year = 2026
  const month = 7 // August (0-indexed)
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = 31
  const cells: Array<CalendarDay | null> = []

  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `2026-08-${String(d).padStart(2, '0')}`
    cells.push(byDate.get(date) ?? { date, status: null })
  }

  const handleSelect = (day: CalendarDay) => {
    setSelected(day)
    onSelectDay?.(day)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0b3d91]">{monthLabel}</h3>
          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            {Object.entries(STATUS_DOT).map(([key, color]) => (
              <span key={key} className="inline-flex items-center gap-1.5 capitalize">
                <span className={cn('h-2 w-2 rounded-full', color)} />
                {key.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />
            const dayNum = Number(day.date.split('-')[2])
            const isSelected = selected?.date === day.date
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => handleSelect(day)}
                className={cn(
                  'flex min-h-[64px] flex-col items-center justify-center rounded-lg border border-transparent p-1 text-sm transition-colors hover:bg-brand-soft',
                  isSelected && 'border-primary bg-primary/5 shadow-sm'
                )}
              >
                <span className="font-medium">{dayNum}</span>
                {day.status && (
                  <span
                    className={cn(
                      'mt-1 h-2 w-2 rounded-full',
                      STATUS_DOT[day.status] ?? 'bg-slate-300'
                    )}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-base font-semibold text-[#0b3d91]">Day Detail</h3>
        {selected ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">{selected.date}</p>
            {selected.status ? (
              <AttendanceStatusBadge status={selected.status} />
            ) : (
              <p className="text-sm text-muted-foreground">No attendance recorded yet.</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-brand-soft p-3">
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="mt-1 font-semibold">{selected.checkIn ?? '—'}</p>
              </div>
              <div className="rounded-lg bg-brand-soft p-3">
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="mt-1 font-semibold">{selected.checkOut ?? '—'}</p>
              </div>
              <div className="col-span-2 rounded-lg bg-brand-soft p-3">
                <p className="text-xs text-muted-foreground">Work hours</p>
                <p className="mt-1 font-semibold">
                  {selected.workHours != null ? `${selected.workHours}h` : '—'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Select a date to view details.</p>
        )}
      </div>
    </div>
  )
}
