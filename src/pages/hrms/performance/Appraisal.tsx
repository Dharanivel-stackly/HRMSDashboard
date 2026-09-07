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

const initialAppraisals = [
  { employee: 'Neha Verma', role: 'Product Designer', reviewer: 'Vikram Singh', cycle: '2026 Mid-year', status: 'Completed', rating: '4.5 / 5' },
  { employee: 'Arjun Rao', role: 'Software Engineer', reviewer: 'Priya Shah', cycle: '2026 Mid-year', status: 'In review', rating: 'Pending' },
  { employee: 'Simran Kaur', role: 'Account Manager', reviewer: 'Vikram Singh', cycle: '2026 Mid-year', status: 'Awaiting self-review', rating: 'Pending' },
]

const statusClasses: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700',
  'In review': 'bg-blue-50 text-blue-700',
  'Awaiting self-review': 'bg-amber-50 text-amber-700',
}

export default function Appraisal() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [appraisals, setAppraisals] = useState(initialAppraisals)

  const activeTab = tabs.find((tab) => tab.path === location.pathname)?.key ?? 'overview'

  const filteredAppraisals = useMemo(
    () => appraisals.filter((item) => `${item.employee} ${item.reviewer}`.toLowerCase().includes(search.toLowerCase())),
    [appraisals, search]
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
            <h2 className="font-semibold text-[#0b3d91]">Performance workspace</h2>
            <p className="text-xs text-muted-foreground">Demo data only · changes are not sent to an API</p>
          </div>
          <label className="relative block sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees or reviewers"
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="pb-3">Employee</th>
                <th className="pb-3">Reviewer</th>
                <th className="pb-3">Cycle</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppraisals.map((item) => (
                <tr key={item.employee} className="border-b last:border-0">
                  <td className="py-4 font-medium">
                    {item.employee}
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </td>
                  <td className="py-4">{item.reviewer}</td>
                  <td className="py-4">{item.cycle}</td>
                  <td className="py-4 font-semibold">{item.rating}</td>
                  <td className="py-4">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <PerformanceCreateDialog
        module="appraisal"
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreate={(values) => setAppraisals((current) => [{ employee: values.employee, role: values.role, reviewer: values.reviewer, cycle: values.cycle, status: 'Awaiting self-review', rating: 'Pending' }, ...current])}
      />
    </PageContainer>
  )
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status] ?? 'bg-slate-100 text-slate-700'}`}>{status}</span>
}


// import { CircleDashed, Plus } from 'lucide-react'
// import { PageContainer } from '@/components/layout/PageContainer'
// import { PageHeader } from '@/components/common/PageHeader'
// import { Button } from '@/components/ui/button'

// export default function Appraisal() {
//   return (
//     <PageContainer>
//       <PageHeader
//         title="Performance Management"
//         description="Set goals, measure outcomes, and build a continuous feedback culture"
//         actions={
//           <Button>
//             <Plus className="h-4 w-4" />
//             Start New Appraisal
//           </Button>
//         }
//       />

//       <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
//         <div className="max-w-xl px-6 text-center">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
//             <CircleDashed className="h-8 w-8 text-primary" />
//           </div>

//           <h1 className="text-3xl font-bold text-[#0b3d91]">
//             Welcome to Appraisal
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-muted-foreground">
//             Manage employee performance reviews, evaluate achievements,
//             provide ratings, and support fair and structured appraisal
//             decisions throughout the performance cycle.
//           </p>

//           <div className="mt-6 flex justify-center gap-3">
//             <Button>
//               <Plus className="h-4 w-4" />
//               Start Your First Appraisal
//             </Button>
//           </div>

//           <div className="mt-8 grid gap-3 sm:grid-cols-3">
//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-[#0b3d91]">
//                 Review
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Review employee performance
//               </p>
//             </div>

//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-[#0b3d91]">
//                 Evaluate
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Evaluate goals and achievements
//               </p>
//             </div>

//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-[#0b3d91]">
//                 Rate
//               </p>

//               <p className="mt-1 text-xs text-muted-foreground">
//                 Provide ratings and feedback
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </PageContainer>
//   )
// }
// // ```
