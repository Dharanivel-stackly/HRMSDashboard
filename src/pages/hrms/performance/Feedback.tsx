import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
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

const initialFeedback = [
  { employee: 'Karan Joshi', respondents: 8, completed: 8, deadline: 'Sep 05, 2026', status: 'Complete' },
  { employee: 'Ananya Iyer', respondents: 6, completed: 4, deadline: 'Sep 12, 2026', status: 'In progress' },
  { employee: 'Dev Malhotra', respondents: 7, completed: 3, deadline: 'Sep 18, 2026', status: 'In progress' },
]

const statusClasses: Record<string, string> = {
  Complete: 'bg-emerald-50 text-emerald-700',
  'In progress': 'bg-blue-50 text-blue-700',
}

export default function Feedback() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [feedback, setFeedback] = useState(initialFeedback)

  const activeTab = tabs.find((tab) => tab.path === location.pathname)?.key ?? 'overview'

  const filteredFeedback = feedback.filter((item) => item.employee.toLowerCase().includes(search.toLowerCase()))

  const selectTab = (tab: (typeof tabs)[number]) => {
    navigate(tab.path)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Performance Management"
        description="Set goals, measure outcomes, and build a continuous feedback culture"
        actions={<Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> New campaign</Button>}
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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-brand-navy">360 feedback campaigns</h2>
            <p className="text-xs text-muted-foreground">Collect structured feedback from peers, managers, and direct reports</p>
          </div>
          <label className="relative block sm:w-72">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {filteredFeedback.map((item) => (
            <div key={item.employee} className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {item.employee.split(' ').map((part) => part[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{item.employee}</p>
                  <p className="text-xs text-muted-foreground">{item.respondents} respondents</p>
                </div>
              </div>

              <ProgressRow label={`${item.completed} of ${item.respondents} responses`} value={(item.completed / item.respondents) * 100} />

              <div className="mt-3 flex items-center justify-between text-xs">
                <StatusBadge status={item.status} />
                <span className="text-muted-foreground">Due {item.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <PerformanceCreateDialog
        module="feedback"
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreate={(values) => setFeedback((current) => [{ employee: values.employee, respondents: Number(values.respondents), completed: 0, deadline: values.deadline, status: 'In progress' }, ...current])}
      />
    </PageContainer>
  )
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
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






// import { CircleDashed, Plus } from 'lucide-react'
// import { PageContainer } from '@/components/layout/PageContainer'
// import { PageHeader } from '@/components/common/PageHeader'
// import { Button } from '@/components/ui/button'

// export default function Feedback() {
//   return (
//     <PageContainer>
//       <PageHeader
//         title="360 Feedback"
//         description="Collect structured feedback from managers, peers, and team members"
//         actions={
//           <Button>
//             <Plus className="h-4 w-4" />
//             Start New Feedback
//           </Button>
//         }
//       />

//       <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
//         <div className="max-w-xl px-6 text-center">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
//             <CircleDashed className="h-8 w-8 text-primary" />
//           </div>

//           <h1 className="text-3xl font-bold text-brand-navy">
//             Welcome to 360 Feedback
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-muted-foreground">
//             Gather meaningful feedback from managers, peers, direct reports,
//             and other stakeholders to understand employee strengths,
//             development areas, and overall performance.
//           </p>

//           <div className="mt-6 flex justify-center gap-3">
//             <Button>
//               <Plus className="h-4 w-4" />
//               Start Your First Feedback
//             </Button>
//           </div>

//           <div className="mt-8 grid gap-3 sm:grid-cols-3">
//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-brand-navy">
//                 Collect
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Collect feedback from multiple reviewers
//               </p>
//             </div>

//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-brand-navy">
//                 Evaluate
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Evaluate skills, behaviors, and competencies
//               </p>
//             </div>

//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-brand-navy">
//                 Improve
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Identify strengths and development opportunities
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </PageContainer>
//   )
// }