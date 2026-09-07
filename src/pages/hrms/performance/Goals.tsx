import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'
import { PerformanceCreateDialog } from './PerformanceCreateDialog'

const tabs: { key: 'overview' | 'goals' | 'kpis' | 'appraisal' | 'feedback'; label: string; path: string }[] = [
  { key: 'overview', label: 'Overview', path: ROUTES.HRMS.PERFORMANCE },
  { key: 'goals', label: 'Goals', path: ROUTES.HRMS.PERFORMANCE_GOALS },
  { key: 'kpis', label: 'KPI Management', path: ROUTES.HRMS.PERFORMANCE_KPIS },
  { key: 'appraisal', label: 'Appraisal', path: ROUTES.HRMS.PERFORMANCE_APPRAISAL },
  { key: 'feedback', label: '360 Feedback', path: ROUTES.HRMS.PERFORMANCE_FEEDBACK },
]

const initialGoals = [
  { title: 'Improve customer onboarding time', owner: 'Aarav Sharma', team: 'Customer Success', progress: 78, due: 'Sep 30, 2026', status: 'On track' },
  { title: 'Launch Q4 demand generation plan', owner: 'Maya Patel', team: 'Marketing', progress: 54, due: 'Oct 15, 2026', status: 'On track' },
  { title: 'Reduce production incident resolution time', owner: 'Rohan Mehta', team: 'Engineering', progress: 32, due: 'Nov 01, 2026', status: 'At risk' },
  { title: 'Complete leadership development track', owner: 'Isha Nair', team: 'People Operations', progress: 91, due: 'Sep 20, 2026', status: 'On track' },
]

const statusClasses: Record<string, string> = {
  'On track': 'bg-emerald-50 text-emerald-700',
  'At risk': 'bg-amber-50 text-amber-700',
}

export default function Goals() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [goals, setGoals] = useState(initialGoals)

  const activeTab = tabs.find((tab) => tab.path === location.pathname)?.key ?? 'overview'

  const filteredGoals = useMemo(
    () => goals.filter((item) => `${item.title} ${item.owner} ${item.team}`.toLowerCase().includes(search.toLowerCase())),
    [goals, search]
  )

  const selectTab = (tab: (typeof tabs)[number]) => {
    navigate(tab.path)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Performance Management"
        description="Set goals, measure outcomes, and build a continuous feedback culture"
        actions={<Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> Add new</Button>}
      />

      <div className="flex flex-wrap gap-1 rounded-xl border border-border/60 bg-card p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => selectTab(tab)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab.key === activeTab ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-brand-navy">Performance workspace</h2>
            <p className="text-xs text-muted-foreground">Demo data only · changes are not sent to an API</p>
          </div>
          <label className="relative block sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search goals, owners, or teams"
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="pb-3">Goal</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Due date</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGoals.map((goal) => (
                <tr key={goal.title} className="border-b last:border-0">
                  <td className="py-4 font-medium">
                    {goal.title}
                    <p className="text-xs text-muted-foreground">{goal.team}</p>
                  </td>
                  <td className="py-4">{goal.owner}</td>
                  <td className="py-4 text-muted-foreground">{goal.due}</td>
                  <td className="w-44 py-4">
                    <ProgressRow value={goal.progress} />
                  </td>
                  <td className="py-4">
                    <StatusBadge status={goal.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <PerformanceCreateDialog
        module="goal"
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreate={(values) => setGoals((current) => [{ title: values.title, owner: values.owner, team: values.team, progress: 0, due: values.due, status: 'On track' }, ...current])}
      />
    </PageContainer>
  )
}

function ProgressRow({ value }: { value: number }) {
  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span></span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status] ?? 'bg-slate-100 text-slate-700'}`}>{status}</span>
}


// import { Plus, Target } from 'lucide-react'
// import { PageContainer } from '@/components/layout/PageContainer'
// import { PageHeader } from '@/components/common/PageHeader'
// import { Button } from '@/components/ui/button'
// // import { ROUTES } from '@/lib/constants/routes'

// export default function Goals() {
//   return (
//     <PageContainer>
//       <PageHeader
//         title="Performance Management"
//         description="Set goals, measure outcomes, and build a continuous feedback culture"
//         actions={
//           <Button>
//             <Plus className="h-4 w-4" />
//             Add New Goal
//           </Button>
//         }
//       />

//       <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
//         <div className="max-w-xl px-6 text-center">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
//             <Target className="h-8 w-8 text-primary" />
//           </div>

//           <h1 className="text-3xl font-bold text-brand-navy">
//             Welcome to Goals
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-muted-foreground">
//             Create, manage, and track employee goals throughout
//             the performance cycle. Set measurable objectives,
//             assign owners, define deadlines, and monitor progress.
//           </p>

//           <div className="mt-6 flex justify-center gap-3">
//             <Button>
//               <Plus className="h-4 w-4" />
//               Create Your First Goal
//             </Button>
//           </div>
//         </div>
//       </section>
//     </PageContainer>
//   )
// }
