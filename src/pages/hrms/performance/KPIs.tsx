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

const initialKpis = [
  { name: 'Revenue achievement', owner: 'Sales', target: '₹1.2 Cr', actual: '₹98 L', score: 82 },
  { name: 'Customer retention', owner: 'Customer Success', target: '92%', actual: '94%', score: 96 },
  { name: 'Deployment frequency', owner: 'Engineering', target: '18 / month', actual: '15 / month', score: 83 },
  { name: 'Time to hire', owner: 'Recruitment', target: '30 days', actual: '26 days', score: 92 },
]

export default function KPIs() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [kpis, setKpis] = useState(initialKpis)

  const activeTab = tabs.find((tab) => tab.path === location.pathname)?.key ?? 'overview'

  const filteredKpis = useMemo(
    () => kpis.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [kpis, search]
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
              placeholder="Search KPI library"
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filteredKpis.map((kpi) => (
            <div key={kpi.name} className="rounded-xl border border-border/60 p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{kpi.name}</p>
                  <p className="text-xs text-muted-foreground">{kpi.owner}</p>
                </div>
                <span className="text-2xl font-bold text-primary">{kpi.score}%</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-brand-soft p-3">
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="font-semibold">{kpi.target}</p>
                </div>
                <div className="rounded-lg bg-brand-soft p-3">
                  <p className="text-xs text-muted-foreground">Actual</p>
                  <p className="font-semibold">{kpi.actual}</p>
                </div>
              </div>

              <ProgressRow value={kpi.score} />
            </div>
          ))}
        </div>
      </section>
      <PerformanceCreateDialog
        module="kpi"
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreate={(values) => setKpis((current) => [{ name: values.name, owner: values.owner, target: values.target, actual: values.actual, score: 0 }, ...current])}
      />
    </PageContainer>
  )
}

function ProgressRow({ value }: { value: number }) {
  return (
    <div className="mt-4">
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



// import { ArrowUpRight, Plus } from 'lucide-react'
// import { PageContainer } from '@/components/layout/PageContainer'
// import { PageHeader } from '@/components/common/PageHeader'
// import { Button } from '@/components/ui/button'

// export default function KPIManagement() {
//   return (
//     <PageContainer>
//       <PageHeader
//         title="Performance Management"
//         description="Set goals, measure outcomes, and build a continuous feedback culture"
//         actions={
//           <Button>
//             <Plus className="h-4 w-4" />
//             Add New KPI
//           </Button>
//         }
//       />

//       <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
//         <div className="max-w-xl px-6 text-center">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
//             <ArrowUpRight className="h-8 w-8 text-primary" />
//           </div>

//           <h1 className="text-3xl font-bold text-[#0b3d91]">
//             Welcome to KPI Management
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-muted-foreground">
//             Define, manage, and track key performance indicators
//             throughout the performance cycle. Set measurable
//             targets, monitor actual performance, and identify
//             areas that require attention.
//           </p>

//           <div className="mt-6 flex justify-center gap-3">
//             <Button>
//               <Plus className="h-4 w-4" />
//               Create Your First KPI
//             </Button>
//           </div>

//           <div className="mt-8 grid gap-3 sm:grid-cols-3">
//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-[#0b3d91]">
//                 Define
//               </p>
//               <p className="mt-1 text-xs text-muted-foreground">
//                 Create measurable KPIs
//               </p>
//             </div>

//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-[#0b3d91]">
//                 Measure
//               </p>
//               <p className="mt-1 text-xs text-muted-foreground">
//                 Track actual vs target
//               </p>
//             </div>

//             <div className="rounded-xl border border-border/60 p-4">
//               <p className="text-sm font-semibold text-[#0b3d91]">
//                 Improve
//               </p>
//               <p className="mt-1 text-xs text-muted-foreground">
//                 Identify performance gaps
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </PageContainer>
//   )
// }
// // ```
