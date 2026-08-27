import { StatCard } from '@/components/common/StatCard'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  Timer,
  AlertCircle,
  Percent,
  Hourglass,
  Coffee,
} from 'lucide-react'
import type { AttendanceKpis } from '../types/attendance.types'

interface AttendanceKpiCardsProps {
  kpis: AttendanceKpis
}

export function AttendanceKpiCards({ kpis }: AttendanceKpiCardsProps) {
  const cards = [
    {
      label: 'Total Employees',
      value: kpis.totalEmployees,
      icon: Users,
      accent: 'purple' as const,
      subtext: 'Active workforce',
    },
    {
      label: 'Present Today',
      value: kpis.presentToday,
      icon: UserCheck,
      accent: 'green' as const,
      badge: 'Live',
      badgeTone: 'success' as const,
    },
    {
      label: 'Absent Today',
      value: kpis.absentToday,
      icon: UserX,
      accent: 'pink' as const,
      alert: true,
    },
    {
      label: 'Late Today',
      value: kpis.lateToday,
      icon: Clock,
      accent: 'orange' as const,
      badge: 'Review',
      badgeTone: 'warning' as const,
      alert: true,
    },
    {
      label: 'On Leave',
      value: kpis.onLeave,
      icon: CalendarDays,
      accent: 'blue' as const,
    },
    {
      label: 'Half Day',
      value: kpis.halfDay,
      icon: Coffee,
      accent: 'indigo' as const,
    },
    {
      label: 'Avg Work Hours',
      value: `${kpis.averageWorkHours}h`,
      icon: Timer,
      accent: 'teal' as const,
    },
    {
      label: 'Overtime Hours',
      value: `${kpis.overtimeHours}h`,
      icon: Hourglass,
      accent: 'indigo' as const,
    },
    {
      label: 'Pending Corrections',
      value: kpis.pendingCorrections,
      icon: AlertCircle,
      accent: 'orange' as const,
      badge: 'Action',
      badgeTone: 'warning' as const,
      alert: true,
    },
    {
      label: 'Attendance %',
      value: `${kpis.attendancePercentage}%`,
      icon: Percent,
      accent: 'green' as const,
      badge: 'Healthy',
      badgeTone: 'success' as const,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  )
}
