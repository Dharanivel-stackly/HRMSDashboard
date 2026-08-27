import { PageContainer } from '@/components/layout/PageContainer'
import { StatCard } from '@/components/common/StatCard'
import {
  Building2,
  Users,
  LayoutGrid,
  Network,
  ClipboardCheck,
  KeyRound,
  ShieldAlert,
  Activity,
} from 'lucide-react'

/** Platform-level metrics aligned to One Enterprise BRD (Platform Admin + modules) */
const stats = [
  {
    label: 'Active Tenants',
    value: '12',
    icon: Building2,
    accent: 'blue' as const,
    badge: '+2 this quarter',
    badgeTone: 'success' as const,
    subtext: 'Multi-tenant organizations',
  },
  {
    label: 'Platform User',
    value: '1,248',
    icon: Users,
    accent: 'purple' as const,
    badge: 'Active',
    badgeTone: 'success' as const,
    subtext: 'Across all tenants',
  },
  {
    label: 'Enabled Modules',
    value: '1',
    icon: LayoutGrid,
    accent: 'indigo' as const,
    badge: 'HRMS live',
    badgeTone: 'neutral' as const,
    subtext: 'More modules coming soon',
  },
  {
    label: 'Org Units',
    value: '46',
    icon: Network,
    accent: 'teal' as const,
    subtext: 'Companies, depts & branches',
  },
  {
    label: 'Pending Approvals',
    value: '23',
    icon: ClipboardCheck,
    accent: 'orange' as const,
    badge: 'Action needed',
    badgeTone: 'warning' as const,
    subtext: 'Leave, access & workflows',
    alert: true,
  },
  {
    label: 'License Utilization',
    value: '86%',
    icon: KeyRound,
    accent: 'green' as const,
    badge: 'Healthy',
    badgeTone: 'success' as const,
    subtext: 'Assigned vs available seats',
  },
  {
    label: 'Security Alerts',
    value: '5',
    icon: ShieldAlert,
    accent: 'pink' as const,
    badge: 'Review',
    badgeTone: 'warning' as const,
    subtext: 'Failed logins & lockouts',
    alert: true,
  },
  {
    label: 'Platform Health',
    value: '99.2%',
    icon: Activity,
    accent: 'green' as const,
    badge: 'Operational',
    badgeTone: 'success' as const,
    subtext: 'API & service uptime (30d)',
  },
]

export default function Dashboard() {
  return (
    <PageContainer>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </PageContainer>
  )
}
