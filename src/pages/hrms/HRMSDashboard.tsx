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
} from 'lucide-react'

/** HRMS module metrics aligned to One Enterprise BRD */
const hrmsStats = [
  {
    label: 'Total Employees',
    value: '842',
    icon: Users,
    accent: 'purple' as const,
    badge: '+18 this month',
    badgeTone: 'success' as const,
    subtext: 'All employment types',
  },
  {
    label: 'Active Workforce',
    value: '791',
    icon: UserCheck,
    accent: 'green' as const,
    badge: '94%',
    badgeTone: 'success' as const,
    subtext: 'Active employment status',
  },
  {
    label: 'Attendance Today',
    value: '736',
    icon: Clock,
    accent: 'blue' as const,
    badge: 'Live',
    badgeTone: 'success' as const,
    subtext: 'Checked in / present',
  },
  {
    label: 'Leave Requests',
    value: '27',
    icon: CalendarDays,
    accent: 'orange' as const,
    badge: 'Pending approve',
    badgeTone: 'warning' as const,
    subtext: 'Awaiting manager / HR',
    alert: true,
  },
  {
    label: 'Payroll Runs',
    value: '3',
    icon: DollarSign,
    accent: 'teal' as const,
    badge: 'In progress',
    badgeTone: 'neutral' as const,
    subtext: 'Current pay cycle',
  },
  {
    label: 'Open Positions',
    value: '14',
    icon: UserPlus,
    accent: 'indigo' as const,
    subtext: 'Recruitment pipeline',
  },
  {
    label: 'Performance Reviews',
    value: '56',
    icon: TrendingUp,
    accent: 'pink' as const,
    subtext: 'Due this quarter',
  },
  {
    label: 'Employee Documents',
    value: '1,204',
    icon: FileText,
    accent: 'gray' as const,
    subtext: 'Contracts, IDs & policies',
  },
]

export default function HRMSDashboard() {
  return (
    <PageContainer>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {hrmsStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </PageContainer>
  )
}
