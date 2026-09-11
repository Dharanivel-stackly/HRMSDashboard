import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { StatCard } from '@/components/common/StatCard'
import {
  Users,
  UserCheck,
  Clock,
  CalendarDays,
  DollarSign,
  UserPlus,
  TrendingUp,
  FileText,
  Loader2,
} from 'lucide-react'

const getDateString = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

const getDaysBetween = (from: string, to: string) => {
  const start = new Date(from)
  const end = new Date(to)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1

  const diffMs = end.getTime() - start.getTime()
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1)
}

const staticHrmsStats = [
  {
    label: 'Total Employee',
    value: '842',
    icon: Users,
    accent: 'purple' as const,
    badge: '+18 this month',
    badgeTone: 'success' as const,
    subtext: 'All employment types',
  },
  {
    label: 'Active Workforce',
    icon: UserCheck,
    accent: 'green' as const,
    badge: '94%',
    badgeTone: 'success' as const,
    subtext: 'Active employment status',
  },
  {
    label: 'Attendance Today',
    icon: Clock,
    accent: 'blue' as const,
    badge: 'Live',
    badgeTone: 'success' as const,
    subtext: 'Checked in / present',
  },
  {
    label: 'Leave Requests',
    icon: CalendarDays,
    accent: 'orange' as const,
    badge: 'Pending approve',
    badgeTone: 'warning' as const,
    subtext: 'Awaiting manager / HR',
    alert: true,
  },
  {
    label: 'Payroll Runs',
    icon: DollarSign,
    accent: 'teal' as const,
    badge: 'In progress',
    badgeTone: 'neutral' as const,
    subtext: 'Current pay cycle',
  },
  {
    label: 'Open Positions',
    icon: UserPlus,
    accent: 'indigo' as const,
    subtext: 'Recruitment pipeline',
  },
  {
    label: 'Performance Reviews',
    icon: TrendingUp,
    accent: 'pink' as const,
    subtext: 'Due this quarter',
  },
  {
    label: 'Employee Documents',
    icon: FileText,
    accent: 'gray' as const,
    subtext: 'Contracts, IDs & policies',
  },
]

export default function HRMSDashboard() {
  const [employeeCount, setEmployeeCount] = useState<number | null>(null)
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true)
  const [fromDate, setFromDate] = useState<string>(getDateString(30))
  const [toDate, setToDate] = useState<string>(getDateString(0))

  useEffect(() => {
    const loadEmployees = async () => {
      setIsLoadingEmployees(true)
      try {
        const response = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users')
        if (!response.ok) throw new Error('Unable to load employees')

        const employees: unknown = await response.json()
        if (Array.isArray(employees)) setEmployeeCount(employees.length)
      } catch {
        setEmployeeCount(null)
      } finally {
        setIsLoadingEmployees(false)
      }
    }

    void loadEmployees()
  }, [])

  const daysInRange = useMemo(() => getDaysBetween(fromDate, toDate), [fromDate, toDate])

  const hrmsStats = useMemo(() => {
    const totalEmployeesBase = employeeCount ?? 842
    const rangeFactor = daysInRange / 30

    return staticHrmsStats.map((stat) => {
      let value = 0

      switch (stat.label) {
        case 'Total Employees':
          value = Math.round(totalEmployeesBase + rangeFactor * 25)
          break
        case 'Active Workforce':
          value = Math.round(totalEmployeesBase * (0.9 + rangeFactor * 0.04))
          break
        case 'Attendance Today':
          value = Math.round(720 + rangeFactor * 40)
          break
        case 'Leave Requests':
          value = Math.round(20 + rangeFactor * 12)
          break
        case 'Payroll Runs':
          value = Math.round(2 + rangeFactor * 2)
          break
        case 'Open Positions':
          value = Math.round(10 + rangeFactor * 6)
          break
        case 'Performance Reviews':
          value = Math.round(45 + rangeFactor * 10)
          break
        case 'Employee Documents':
          value = Math.round(1180 + rangeFactor * 90)
          break
        default:
          value = 0
      }

      return {
        ...stat,
        value: value.toLocaleString('en-IN'),
      }
    })
  }, [daysInRange, employeeCount])

  return (
    <PageContainer>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-4 md:grid-cols-2 lg:min-w-[420px]">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              From date
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              To date
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600 lg:self-auto">
            {isLoadingEmployees ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span>Loading HRMS data...</span>
              </>
            ) : (
              <span>
                Showing data from {new Date(fromDate).toLocaleDateString()} to{' '}
                {new Date(toDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {hrmsStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </PageContainer>
  )
}