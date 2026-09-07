// import { useEffect, useState, type FormEvent } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   ArrowUpRight,
//   CheckCircle2,
//   CircleDashed,
//   MessageCircleMore,
//   Plus,
//   Search,
//   Star,
//   Target,
//   Users,
// } from 'lucide-react'
// import { PageContainer } from '@/components/layout/PageContainer'
// import { PageHeader } from '@/components/common/PageHeader'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { ROUTES } from '@/lib/constants/routes'

// type PerformanceSection = 'overview' | 'goals' | 'kpis' | 'appraisal' | 'feedback'

// interface PerformanceProps {
//   section?: PerformanceSection
// }

// const tabs: { key: PerformanceSection; label: string; path: string }[] = [
//   { key: 'overview', label: 'Overview', path: ROUTES.HRMS.PERFORMANCE },
//   { key: 'goals', label: 'Goals', path: ROUTES.HRMS.PERFORMANCE_GOALS },
//   { key: 'kpis', label: 'KPI Management', path: ROUTES.HRMS.PERFORMANCE_KPIS },
//   { key: 'appraisal', label: 'Appraisal', path: ROUTES.HRMS.PERFORMANCE_APPRAISAL },
//   { key: 'feedback', label: '360 Feedback', path: ROUTES.HRMS.PERFORMANCE_FEEDBACK },
// ]

// const goals = [
//   { title: 'Improve customer onboarding time', owner: 'Aarav Sharma', team: 'Customer Success', progress: 78, due: 'Sep 30, 2026', status: 'On track' },
//   { title: 'Launch Q4 demand generation plan', owner: 'Maya Patel', team: 'Marketing', progress: 54, due: 'Oct 15, 2026', status: 'On track' },
//   { title: 'Reduce production incident resolution time', owner: 'Rohan Mehta', team: 'Engineering', progress: 32, due: 'Nov 01, 2026', status: 'At risk' },
//   { title: 'Complete leadership development track', owner: 'Isha Nair', team: 'People Operations', progress: 91, due: 'Sep 20, 2026', status: 'On track' },
// ]

// const kpis = [
//   { name: 'Revenue achievement', owner: 'Sales', target: '₹1.2 Cr', actual: '₹98 L', score: 82 },
//   { name: 'Customer retention', owner: 'Customer Success', target: '92%', actual: '94%', score: 96 },
//   { name: 'Deployment frequency', owner: 'Engineering', target: '18 / month', actual: '15 / month', score: 83 },
//   { name: 'Time to hire', owner: 'Recruitment', target: '30 days', actual: '26 days', score: 92 },
// ]

// const appraisals = [
//   { employee: 'Neha Verma', role: 'Product Designer', reviewer: 'Vikram Singh', cycle: '2026 Mid-year', status: 'Completed', rating: '4.5 / 5' },
//   { employee: 'Arjun Rao', role: 'Software Engineer', reviewer: 'Priya Shah', cycle: '2026 Mid-year', status: 'In review', rating: 'Pending' },
//   { employee: 'Simran Kaur', role: 'Account Manager', reviewer: 'Vikram Singh', cycle: '2026 Mid-year', status: 'Awaiting self-review', rating: 'Pending' },
// ]

// const feedback = [
//   { employee: 'Karan Joshi', respondents: 8, completed: 8, deadline: 'Sep 05, 2026', status: 'Complete' },
//   { employee: 'Ananya Iyer', respondents: 6, completed: 4, deadline: 'Sep 12, 2026', status: 'In progress' },
//   { employee: 'Dev Malhotra', respondents: 7, completed: 3, deadline: 'Sep 18, 2026', status: 'In progress' },
// ]

// const statusClasses: Record<string, string> = {
//   'On track': 'bg-emerald-50 text-emerald-700',
//   'At risk': 'bg-amber-50 text-amber-700',
//   Completed: 'bg-emerald-50 text-emerald-700',
//   Complete: 'bg-emerald-50 text-emerald-700',
//   'In review': 'bg-blue-50 text-blue-700',
//   'In progress': 'bg-blue-50 text-blue-700',
//   'Awaiting self-review': 'bg-amber-50 text-amber-700',
// }

// export default function Performance({ section = 'overview' }: PerformanceProps) {
//   const navigate = useNavigate()
//   const [activeSection, setActiveSection] = useState<PerformanceSection>(section)
//   const [search, setSearch] = useState('')
//   const [toast, setToast] = useState('')
//   const [formOpen, setFormOpen] = useState(false)

//   useEffect(() => {
//     setActiveSection(section)
//   }, [section])

//   const selectTab = (tab: (typeof tabs)[number]) => {
//     setActiveSection(tab.key)
//     setSearch('')
//     navigate(tab.path)
//   }

//   const showToast = (message: string) => {
//     setToast(message)
//     window.setTimeout(() => setToast(''), 2500)
//   }

//   const formSection = activeSection === 'overview' ? 'goals' : activeSection
//   const formTitle = {
//     goals: 'Add new goal',
//     kpis: 'Add new KPI',
//     appraisal: 'Start new appraisal',
//     feedback: 'Create 360 feedback campaign',
//   }[formSection]

//   const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     setFormOpen(false)
//     showToast(`${formTitle} saved in demo mode`)
//   }

//   return (
//     <PageContainer>
//       <PageHeader
//         title="Performance Management"
//         description="Set goals, measure outcomes, and build a continuous feedback culture"
//         actions={<Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" /> Add new</Button>}
//       />

//       <div className="flex flex-wrap gap-1 rounded-xl border border-border/60 bg-card p-1 shadow-sm">
//         {tabs.map((tab) => (
//           <button key={tab.key} type="button" onClick={() => selectTab(tab)} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeSection === tab.key ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {toast && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{toast}</div>}

//       {activeSection === 'overview' && (
//         <>
//           <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             {[
//               ['Active goals', '24', '6 due this month', Target],
//               ['Average KPI score', '86%', '+4.2% this cycle', ArrowUpRight],
//               ['Appraisals due', '12', '4 awaiting review', CircleDashed],
//               ['Feedback completion', '72%', '18 responses pending', MessageCircleMore],
//             ].map(([label, value, note, Icon]) => (
//               <div key={label as string} className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
//                 <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label as string}</p><Icon className="h-5 w-5 text-primary" /></div>
//                 <p className="mt-3 text-3xl font-bold text-[#0b3d91]">{value as string}</p><p className="mt-1 text-xs text-muted-foreground">{note as string}</p>
//               </div>
//             ))}
//           </div>
//           <div className="grid gap-5 lg:grid-cols-2">
//             <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
//               <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-[#0b3d91]">Goal progress</h2><p className="text-xs text-muted-foreground">Current cycle · Q3 2026</p></div><Button variant="ghost" size="sm" onClick={() => selectTab(tabs[1])}>View all</Button></div>
//               <div className="space-y-4">{goals.slice(0, 3).map((goal) => <ProgressRow key={goal.title} label={goal.title} value={goal.progress} />)}</div>
//             </div>
//             <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
//               <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-[#0b3d91]">Upcoming actions</h2><p className="text-xs text-muted-foreground">Items needing your attention</p></div><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
//               <div className="space-y-3 text-sm"><ActionRow title="Complete Arjun Rao's self-review" due="Due in 2 days" /><ActionRow title="Review Q3 sales KPI targets" due="Due in 5 days" /><ActionRow title="Nominate 360 feedback respondents" due="Due Sep 12, 2026" /></div>
//             </div>
//           </div>
//         </>
//       )}

//       {activeSection === 'kpis' && <section className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5"><SectionToolbar search={search} setSearch={setSearch} placeholder="Search KPI library" /><div className="mt-4 grid gap-4 md:grid-cols-2">{kpis.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((kpi) => <div key={kpi.name} className="rounded-xl border border-border/60 p-4"><div className="flex justify-between"><div><p className="font-semibold">{kpi.name}</p><p className="text-xs text-muted-foreground">{kpi.owner}</p></div><span className="text-2xl font-bold text-primary">{kpi.score}%</span></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-brand-soft p-3"><p className="text-xs text-muted-foreground">Target</p><p className="font-semibold">{kpi.target}</p></div><div className="rounded-lg bg-brand-soft p-3"><p className="text-xs text-muted-foreground">Actual</p><p className="font-semibold">{kpi.actual}</p></div></div><ProgressRow label="" value={kpi.score} /></div>)}</div></section>}

//       {activeSection === 'appraisal' && <section className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5"><SectionToolbar search={search} setSearch={setSearch} placeholder="Search employees or reviewers" /><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b text-xs uppercase text-muted-foreground"><th className="pb-3">Employee</th><th className="pb-3">Reviewer</th><th className="pb-3">Cycle</th><th className="pb-3">Rating</th><th className="pb-3">Status</th></tr></thead><tbody>{appraisals.filter((item) => `${item.employee} ${item.reviewer}`.toLowerCase().includes(search.toLowerCase())).map((item) => <tr key={item.employee} className="border-b last:border-0"><td className="py-4 font-medium">{item.employee}<p className="text-xs text-muted-foreground">{item.role}</p></td><td className="py-4">{item.reviewer}</td><td className="py-4">{item.cycle}</td><td className="py-4 font-semibold">{item.rating}</td><td className="py-4"><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div></section>}

//       {activeSection === 'feedback' && <section className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-[#0b3d91]">360 feedback campaigns</h2><p className="text-xs text-muted-foreground">Collect structured feedback from peers, managers, and direct reports</p></div><Button onClick={() => showToast('New campaign created in demo mode')}><Plus className="h-4 w-4" /> New campaign</Button></div><div className="grid gap-4 md:grid-cols-3">{feedback.map((item) => <div key={item.employee} className="rounded-xl border border-border/60 p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{item.employee.split(' ').map((part) => part[0]).join('')}</div><div><p className="font-semibold">{item.employee}</p><p className="text-xs text-muted-foreground">{item.respondents} respondents</p></div></div><ProgressRow label={`${item.completed} of ${item.respondents} responses`} value={(item.completed / item.respondents) * 100} /><div className="mt-3 flex items-center justify-between text-xs"><StatusBadge status={item.status} /><span className="text-muted-foreground">Due {item.deadline}</span></div></div>)}</div></section>}

//       <Dialog open={formOpen} onOpenChange={setFormOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>{formTitle}</DialogTitle>
//             <DialogDescription>
//               Fill in the details below. This is a local demo form; nothing is sent to an API.
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleFormSubmit} className="space-y-4">
//             {formSection === 'goals' && (
//               <>
//                 <FormField id="goal-title" label="Goal title" placeholder="e.g. Improve customer retention" />
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <FormField id="goal-owner" label="Owner" placeholder="Employee name" />
//                   <FormField id="goal-due-date" label="Due date" type="date" />
//                 </div>
//                 <FormField id="goal-description" label="Description" placeholder="Describe the expected outcome" />
//               </>
//             )}
//             {formSection === 'kpis' && (
//               <>
//                 <FormField id="kpi-name" label="KPI name" placeholder="e.g. Customer retention" />
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <FormField id="kpi-owner" label="Department" placeholder="e.g. Customer Success" />
//                   <FormField id="kpi-target" label="Target" placeholder="e.g. 95%" />
//                 </div>
//                 <FormField id="kpi-description" label="Measurement notes" placeholder="How will this KPI be measured?" />
//               </>
//             )}
//             {formSection === 'appraisal' && (
//               <>
//                 <FormField id="appraisal-employee" label="Employee" placeholder="Employee name" />
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <FormField id="appraisal-reviewer" label="Reviewer" placeholder="Manager name" />
//                   <FormField id="appraisal-cycle" label="Review cycle" placeholder="e.g. 2026 Mid-year" />
//                 </div>
//                 <FormField id="appraisal-focus" label="Review focus" placeholder="Key areas to discuss" />
//               </>
//             )}
//             {formSection === 'feedback' && (
//               <>
//                 <FormField id="feedback-employee" label="Employee" placeholder="Employee name" />
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <FormField id="feedback-respondents" label="Respondents" type="number" placeholder="e.g. 6" />
//                   <FormField id="feedback-deadline" label="Deadline" type="date" />
//                 </div>
//                 <FormField id="feedback-message" label="Instructions" placeholder="Add instructions for respondents" />
//               </>
//             )}
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
//               <Button type="submit">Save demo record</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </PageContainer>
//   )
// }

// function FormField({
//   id,
//   label,
//   placeholder,
//   type = 'text',
// }: {
//   id: string
//   label: string
//   placeholder?: string
//   type?: string
// }) {
//   return (
//     <div className="space-y-2">
//       <Label htmlFor={id}>{label}</Label>
//       <Input id={id} name={id} type={type} placeholder={placeholder} required />
//     </div>
//   )
// }

// function ProgressRow({ label, value }: { label: string; value: number }) {
//   return <div className="mt-2"><div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{label}</span><span>{Math.round(value)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></div></div>
// }

// function StatusBadge({ status }: { status: string }) {
//   return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status] ?? 'bg-slate-100 text-slate-700'}`}>{status}</span>
// }

// function SectionToolbar({ search, setSearch, placeholder }: { search: string; setSearch: (value: string) => void; placeholder: string }) {
//   return <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-[#0b3d91]">Performance workspace</h2><p className="text-xs text-muted-foreground">Demo data only · changes are not sent to an API</p></div><label className="relative block sm:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label></div>
// }

// function ActionRow({ title, due }: { title: string; due: string }) {
//   return <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3"><Users className="h-4 w-4 text-primary" /><div className="flex-1"><p className="font-medium">{title}</p><p className="text-xs text-muted-foreground">{due}</p></div><Star className="h-4 w-4 text-amber-400" /></div>
// }








import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  MessageCircleMore,
  Plus,
  Search,
  Star,
  Target,
  Users,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ROUTES } from '@/lib/constants/routes'

type PerformanceSection =
  | 'overview'
  | 'goals'
  | 'kpis'
  | 'appraisal'
  | 'feedback'

interface PerformanceProps {
  section?: PerformanceSection
}

const tabs: {
  key: PerformanceSection
  label: string
  path: string
}[] = [
  {
    key: 'overview',
    label: 'Overview',
    path: ROUTES.HRMS.PERFORMANCE,
  },
  {
    key: 'goals',
    label: 'Goals',
    path: ROUTES.HRMS.PERFORMANCE_GOALS,
  },
  {
    key: 'kpis',
    label: 'KPI Management',
    path: ROUTES.HRMS.PERFORMANCE_KPIS,
  },
  {
    key: 'appraisal',
    label: 'Appraisal',
    path: ROUTES.HRMS.PERFORMANCE_APPRAISAL,
  },
  {
    key: 'feedback',
    label: '360 Feedback',
    path: ROUTES.HRMS.PERFORMANCE_FEEDBACK,
  },
]

/* -------------------------------------------------------------------------- */
/* Demo Data                                                                  */
/* -------------------------------------------------------------------------- */

const goals = [
  {
    title: 'Improve customer onboarding time',
    owner: 'Aarav Sharma',
    team: 'Customer Success',
    progress: 78,
    due: 'Sep 30, 2026',
    status: 'On track',
  },
  {
    title: 'Launch Q4 demand generation plan',
    owner: 'Maya Patel',
    team: 'Marketing',
    progress: 54,
    due: 'Oct 15, 2026',
    status: 'On track',
  },
  {
    title: 'Reduce production incident resolution time',
    owner: 'Rohan Mehta',
    team: 'Engineering',
    progress: 32,
    due: 'Nov 01, 2026',
    status: 'At risk',
  },
  {
    title: 'Complete leadership development track',
    owner: 'Isha Nair',
    team: 'People Operations',
    progress: 91,
    due: 'Sep 20, 2026',
    status: 'On track',
  },
]

const kpis = [
  {
    name: 'Revenue achievement',
    owner: 'Sales',
    target: '₹1.2 Cr',
    actual: '₹98 L',
    score: 82,
  },
  {
    name: 'Customer retention',
    owner: 'Customer Success',
    target: '92%',
    actual: '94%',
    score: 96,
  },
  {
    name: 'Deployment frequency',
    owner: 'Engineering',
    target: '18 / month',
    actual: '15 / month',
    score: 83,
  },
  {
    name: 'Time to hire',
    owner: 'Recruitment',
    target: '30 days',
    actual: '26 days',
    score: 92,
  },
]

const appraisals = [
  {
    employee: 'Neha Verma',
    role: 'Product Designer',
    reviewer: 'Vikram Singh',
    cycle: '2026 Mid-year',
    status: 'Completed',
    rating: '4.5 / 5',
  },
  {
    employee: 'Arjun Rao',
    role: 'Software Engineer',
    reviewer: 'Priya Shah',
    cycle: '2026 Mid-year',
    status: 'In review',
    rating: 'Pending',
  },
  {
    employee: 'Simran Kaur',
    role: 'Account Manager',
    reviewer: 'Vikram Singh',
    cycle: '2026 Mid-year',
    status: 'Awaiting self-review',
    rating: 'Pending',
  },
]

const feedback = [
  {
    employee: 'Karan Joshi',
    respondents: 8,
    completed: 8,
    deadline: 'Sep 05, 2026',
    status: 'Complete',
  },
  {
    employee: 'Ananya Iyer',
    respondents: 6,
    completed: 4,
    deadline: 'Sep 12, 2026',
    status: 'In progress',
  },
  {
    employee: 'Dev Malhotra',
    respondents: 7,
    completed: 3,
    deadline: 'Sep 18, 2026',
    status: 'In progress',
  },
]

const statusClasses: Record<string, string> = {
  'On track': 'bg-emerald-50 text-emerald-700',
  'At risk': 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Complete: 'bg-emerald-50 text-emerald-700',
  'In review': 'bg-blue-50 text-blue-700',
  'In progress': 'bg-blue-50 text-blue-700',
  'Awaiting self-review': 'bg-amber-50 text-amber-700',
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function Performance({
  section = 'overview',
}: PerformanceProps) {
  const navigate = useNavigate()

  const [activeSection, setActiveSection] =
    useState<PerformanceSection>(section)

  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    setActiveSection(section)
  }, [section])

  const selectTab = (tab: (typeof tabs)[number]) => {
    setActiveSection(tab.key)
    setSearch('')
    navigate(tab.path)
  }

  const showToast = (message: string) => {
    setToast(message)

    window.setTimeout(() => {
      setToast('')
    }, 2500)
  }

  /*
   * When Overview is active, Add New defaults to Goal.
   * The Quick Actions section below allows users to directly
   * open Goal, KPI, Appraisal and 360 Feedback forms.
   */
  const formSection =
    activeSection === 'overview' ? 'goals' : activeSection

  const formTitle = {
    goals: 'Add new goal',
    kpis: 'Add new KPI',
    appraisal: 'Start new appraisal',
    feedback: 'Create 360 feedback campaign',
  }[formSection]

  const handleFormSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setFormOpen(false)

    showToast(`${formTitle} saved in demo mode`)
  }

  return (
    <PageContainer>
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}

      <PageHeader
        title="Performance Management"
        description="Set goals, measure outcomes, and build a continuous feedback culture"
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Add new
          </Button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Navigation Tabs                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-wrap gap-1 rounded-xl border border-border/60 bg-card p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => selectTab(tab)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeSection === tab.key
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Toast                                                              */}
      {/* ------------------------------------------------------------------ */}

      {toast && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {toast}
        </div>
      )}

      {/* ================================================================== */}
      {/* OVERVIEW                                                            */}
      {/* ================================================================== */}

      {activeSection === 'overview' && (
        <>
          {/* -------------------------------------------------------------- */}
          {/* Performance Cycle                                              */}
          {/* -------------------------------------------------------------- */}

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Performance Cycle
                </p>

                <div className="mt-1 flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#0b3d91]">
                    Q3 2026
                  </h2>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Active
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Jul 01, 2026 – Sep 30, 2026
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => selectTab(tabs[1])}
                >
                  View Goals
                </Button>

                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Overall Performance                                             */}
          {/* -------------------------------------------------------------- */}

          <div className="grid gap-5 lg:grid-cols-[1.2fr_2fr]">
            <div className="ui-card-elevated rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Overall Performance Score
                  </p>

                  <p className="mt-2 text-5xl font-bold text-[#0b3d91]">
                    86%
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="font-medium text-emerald-600">
                      <ArrowUpRight className="inline h-4 w-4" />
                      4.2%
                    </span>

                    <span className="text-muted-foreground">
                      vs previous cycle
                    </span>
                  </div>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-7 w-7 text-primary" />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>Performance achievement</span>
                  <span>86 / 100</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: '86%' }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-brand-soft p-3">
                  <p className="text-lg font-bold text-[#0b3d91]">
                    24
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active Goals
                  </p>
                </div>

                <div className="rounded-lg bg-brand-soft p-3">
                  <p className="text-lg font-bold text-[#0b3d91]">
                    32
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active KPIs
                  </p>
                </div>

                <div className="rounded-lg bg-brand-soft p-3">
                  <p className="text-lg font-bold text-[#0b3d91]">
                    120
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reviews
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Performance Summary                                           */}
            {/* ------------------------------------------------------------ */}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Goals */}
              <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0b3d91]">
                      Goals
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Goal achievement
                    </p>
                  </div>

                  <Target className="h-5 w-5 text-primary" />
                </div>

                <p className="mt-4 text-3xl font-bold text-[#0b3d91]">
                  78%
                </p>

                <ProgressRow
                  label="Overall progress"
                  value={78}
                />

                <div className="mt-4 flex justify-between text-xs">
                  <span className="text-emerald-600">
                    18 On Track
                  </span>

                  <span className="text-amber-600">
                    4 At Risk
                  </span>

                  <span className="text-muted-foreground">
                    2 Completed
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 px-0"
                  onClick={() => selectTab(tabs[1])}
                >
                  View Goals →
                </Button>
              </div>

              {/* KPI Management */}
              <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0b3d91]">
                      KPI Management
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Average KPI achievement
                    </p>
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>

                <p className="mt-4 text-3xl font-bold text-[#0b3d91]">
                  86%
                </p>

                <ProgressRow
                  label="Average KPI score"
                  value={86}
                />

                <div className="mt-4 flex justify-between text-xs">
                  <span className="text-emerald-600">
                    24 Achieved
                  </span>

                  <span className="text-amber-600">
                    8 Need Attention
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 px-0"
                  onClick={() => selectTab(tabs[2])}
                >
                  View KPIs →
                </Button>
              </div>

              {/* Appraisal */}
              <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0b3d91]">
                      Appraisal
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Review cycle status
                    </p>
                  </div>

                  <CircleDashed className="h-5 w-5 text-primary" />
                </div>

                <p className="mt-4 text-3xl font-bold text-[#0b3d91]">
                  12
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Appraisals due
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <p className="font-bold text-emerald-700">
                      6
                    </p>

                    <p className="text-emerald-700">
                      Completed
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-2">
                    <p className="font-bold text-blue-700">
                      4
                    </p>

                    <p className="text-blue-700">
                      In Review
                    </p>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-2">
                    <p className="font-bold text-amber-700">
                      2
                    </p>

                    <p className="text-amber-700">
                      Pending
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 px-0"
                  onClick={() => selectTab(tabs[3])}
                >
                  View Appraisals →
                </Button>
              </div>

              {/* 360 Feedback */}
              <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0b3d91]">
                      360 Feedback
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Feedback completion
                    </p>
                  </div>

                  <MessageCircleMore className="h-5 w-5 text-primary" />
                </div>

                <p className="mt-4 text-3xl font-bold text-[#0b3d91]">
                  72%
                </p>

                <ProgressRow
                  label="Response completion"
                  value={72}
                />

                <div className="mt-4 flex justify-between text-xs">
                  <span className="text-emerald-600">
                    94 Received
                  </span>

                  <span className="text-amber-600">
                    18 Pending
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 px-0"
                  onClick={() => selectTab(tabs[4])}
                >
                  View Feedback →
                </Button>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Goal Progress + KPI Performance                                */}
          {/* -------------------------------------------------------------- */}

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Goal Progress */}
            <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#0b3d91]">
                    Goal Progress
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Current cycle · Q3 2026
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectTab(tabs[1])}
                >
                  View all
                </Button>
              </div>

              <div className="space-y-5">
                {goals.map((goal) => (
                  <div key={goal.title}>
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          {goal.title}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {goal.owner} · {goal.team}
                        </p>
                      </div>

                      <StatusBadge status={goal.status} />
                    </div>

                    <ProgressRow
                      label={`Due ${goal.due}`}
                      value={goal.progress}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Performance */}
            <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#0b3d91]">
                    KPI Performance
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Current KPI achievement
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectTab(tabs[2])}
                >
                  View all
                </Button>
              </div>

              <div className="space-y-5">
                {kpis.map((kpi) => (
                  <div key={kpi.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {kpi.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {kpi.owner}
                        </p>
                      </div>

                      <span className="text-sm font-bold text-primary">
                        {kpi.score}%
                      </span>
                    </div>

                    <ProgressRow
                      label={`${kpi.actual} / ${kpi.target}`}
                      value={kpi.score}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Performance Trend                                               */}
          {/* -------------------------------------------------------------- */}

          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#0b3d91]">
                  Performance Trend
                </h2>

                <p className="text-xs text-muted-foreground">
                  Overall performance across review cycles
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Improving
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Q1 2026', '78%', 78],
                ['Q2 2026', '82%', 82],
                ['Q3 2026', '86%', 86],
              ].map(([cycle, score, value]) => (
                <div
                  key={cycle as string}
                  className="rounded-xl border border-border/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {cycle as string}
                    </p>

                    <p className="text-lg font-bold text-[#0b3d91]">
                      {score as string}
                    </p>
                  </div>

                  <ProgressRow
                    label="Performance score"
                    value={value as number}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Upcoming Actions                                                 */}
          {/* -------------------------------------------------------------- */}

          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#0b3d91]">
                  Upcoming Actions
                </h2>

                <p className="text-xs text-muted-foreground">
                  Items requiring your attention
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <ActionRow
                title="Complete Arjun Rao's self-review"
                due="Due in 2 days"
              />

              <ActionRow
                title="Review Q3 sales KPI targets"
                due="Due in 5 days"
              />

              <ActionRow
                title="Nominate 360 feedback respondents"
                due="Due Sep 12, 2026"
              />
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Quick Actions                                                    */}
          {/* -------------------------------------------------------------- */}

          {/* <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <div className="mb-4">
              <h2 className="font-semibold text-[#0b3d91]">
                Quick Actions
              </h2>

              <p className="text-xs text-muted-foreground">
                Quickly access common performance activities
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  selectTab(tabs[1])
                  setFormOpen(true)
                }}
              >
                <Target className="h-4 w-4" />
                Create Goal
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  selectTab(tabs[2])
                  setFormOpen(true)
                }}
              >
                <ArrowUpRight className="h-4 w-4" />
                Add KPI
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  selectTab(tabs[3])
                  setFormOpen(true)
                }}
              >
                <CircleDashed className="h-4 w-4" />
                Start Appraisal
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  selectTab(tabs[4])
                  setFormOpen(true)
                }}
              >
                <MessageCircleMore className="h-4 w-4" />
                Launch 360 Feedback
              </Button>
            </div>
          </div> */}
        </>
      )}

      {/* ================================================================== */}
      {/* GOALS                                                               */}
      {/* ================================================================== */}

      {activeSection === 'goals' && (
        <section className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <SectionToolbar
            search={search}
            setSearch={setSearch}
            placeholder="Search goals"
          />

          <div className="mt-4 space-y-4">
            {goals
              .filter((goal) =>
                `${goal.title} ${goal.owner} ${goal.team}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map((goal) => (
                <div
                  key={goal.title}
                  className="rounded-xl border border-border/60 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">
                        {goal.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {goal.owner} · {goal.team}
                      </p>
                    </div>

                    <StatusBadge status={goal.status} />
                  </div>

                  <ProgressRow
                    label={`Due ${goal.due}`}
                    value={goal.progress}
                  />
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* KPI MANAGEMENT                                                      */}
      {/* ================================================================== */}

      {activeSection === 'kpis' && (
        <section className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <SectionToolbar
            search={search}
            setSearch={setSearch}
            placeholder="Search KPI library"
          />

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {kpis
              .filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map((kpi) => (
                <div
                  key={kpi.name}
                  className="rounded-xl border border-border/60 p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {kpi.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {kpi.owner}
                      </p>
                    </div>

                    <span className="text-2xl font-bold text-primary">
                      {kpi.score}%
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-brand-soft p-3">
                      <p className="text-xs text-muted-foreground">
                        Target
                      </p>

                      <p className="font-semibold">
                        {kpi.target}
                      </p>
                    </div>

                    <div className="rounded-lg bg-brand-soft p-3">
                      <p className="text-xs text-muted-foreground">
                        Actual
                      </p>

                      <p className="font-semibold">
                        {kpi.actual}
                      </p>
                    </div>
                  </div>

                  <ProgressRow
                    label="KPI achievement"
                    value={kpi.score}
                  />
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* APPRAISAL                                                           */}
      {/* ================================================================== */}

      {activeSection === 'appraisal' && (
        <section className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <SectionToolbar
            search={search}
            setSearch={setSearch}
            placeholder="Search employees or reviewers"
          />

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-muted-foreground">
                  <th className="pb-3">
                    Employee
                  </th>

                  <th className="pb-3">
                    Reviewer
                  </th>

                  <th className="pb-3">
                    Cycle
                  </th>

                  <th className="pb-3">
                    Rating
                  </th>

                  <th className="pb-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {appraisals
                  .filter((item) =>
                    `${item.employee} ${item.reviewer}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                  .map((item) => (
                    <tr
                      key={item.employee}
                      className="border-b last:border-0"
                    >
                      <td className="py-4 font-medium">
                        {item.employee}

                        <p className="text-xs text-muted-foreground">
                          {item.role}
                        </p>
                      </td>

                      <td className="py-4">
                        {item.reviewer}
                      </td>

                      <td className="py-4">
                        {item.cycle}
                      </td>

                      <td className="py-4 font-semibold">
                        {item.rating}
                      </td>

                      <td className="py-4">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* 360 FEEDBACK                                                        */}
      {/* ================================================================== */}

      {activeSection === 'feedback' && (
        <section className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#0b3d91]">
                360 Feedback Campaigns
              </h2>

              <p className="text-xs text-muted-foreground">
                Collect structured feedback from peers, managers,
                and direct reports
              </p>
            </div>

            <Button
              onClick={() =>
                showToast(
                  'New campaign created in demo mode',
                )
              }
            >
              <Plus className="h-4 w-4" />
              New campaign
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {feedback.map((item) => (
              <div
                key={item.employee}
                className="rounded-xl border border-border/60 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {item.employee
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {item.employee}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.respondents} respondents
                    </p>
                  </div>
                </div>

                <ProgressRow
                  label={`${item.completed} of ${item.respondents} responses`}
                  value={
                    (item.completed / item.respondents) *
                    100
                  }
                />

                <div className="mt-3 flex items-center justify-between text-xs">
                  <StatusBadge status={item.status} />

                  <span className="text-muted-foreground">
                    Due {item.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* ADD / EDIT DIALOG                                                   */}
      {/* ================================================================== */}

      <Dialog
        open={formOpen}
        onOpenChange={setFormOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formTitle}
            </DialogTitle>

            <DialogDescription>
              Fill in the details below. This is a local demo
              form; nothing is sent to an API.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleFormSubmit}
            className="space-y-4"
          >
            {/* Goal Form */}
            {formSection === 'goals' && (
              <>
                <FormField
                  id="goal-title"
                  label="Goal title"
                  placeholder="e.g. Improve customer retention"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    id="goal-owner"
                    label="Owner"
                    placeholder="Employee name"
                  />

                  <FormField
                    id="goal-due-date"
                    label="Due date"
                    type="date"
                  />
                </div>

                <FormField
                  id="goal-description"
                  label="Description"
                  placeholder="Describe the expected outcome"
                />
              </>
            )}

            {/* KPI Form */}
            {formSection === 'kpis' && (
              <>
                <FormField
                  id="kpi-name"
                  label="KPI name"
                  placeholder="e.g. Customer retention"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    id="kpi-owner"
                    label="Department"
                    placeholder="e.g. Customer Success"
                  />

                  <FormField
                    id="kpi-target"
                    label="Target"
                    placeholder="e.g. 95%"
                  />
                </div>

                <FormField
                  id="kpi-description"
                  label="Measurement notes"
                  placeholder="How will this KPI be measured?"
                />
              </>
            )}

            {/* Appraisal Form */}
            {formSection === 'appraisal' && (
              <>
                <FormField
                  id="appraisal-employee"
                  label="Employee"
                  placeholder="Employee name"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    id="appraisal-reviewer"
                    label="Reviewer"
                    placeholder="Manager name"
                  />

                  <FormField
                    id="appraisal-cycle"
                    label="Review cycle"
                    placeholder="e.g. 2026 Mid-year"
                  />
                </div>

                <FormField
                  id="appraisal-focus"
                  label="Review focus"
                  placeholder="Key areas to discuss"
                />
              </>
            )}

            {/* 360 Feedback Form */}
            {formSection === 'feedback' && (
              <>
                <FormField
                  id="feedback-employee"
                  label="Employee"
                  placeholder="Employee name"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    id="feedback-respondents"
                    label="Respondents"
                    type="number"
                    placeholder="e.g. 6"
                  />

                  <FormField
                    id="feedback-deadline"
                    label="Deadline"
                    type="date"
                  />
                </div>

                <FormField
                  id="feedback-message"
                  label="Instructions"
                  placeholder="Add instructions for respondents"
                />
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit">
                Save demo record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}

/* -------------------------------------------------------------------------- */
/* Form Field                                                                 */
/* -------------------------------------------------------------------------- */

function FormField({
  id,
  label,
  placeholder,
  type = 'text',
}: {
  id: string
  label: string
  placeholder?: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
      </Label>

      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Progress Row                                                               */
/* -------------------------------------------------------------------------- */

function ProgressRow({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>

        <span>{Math.round(value)}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: string
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        statusClasses[status] ??
        'bg-slate-100 text-slate-700'
      }`}
    >
      {status}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Section Toolbar                                                            */
/* -------------------------------------------------------------------------- */

function SectionToolbar({
  search,
  setSearch,
  placeholder,
}: {
  search: string
  setSearch: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-semibold text-[#0b3d91]">
          Performance Workspace
        </h2>

        <p className="text-xs text-muted-foreground">
          Demo data only · changes are not sent to an API
        </p>
      </div>

      <label className="relative block sm:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder={placeholder}
          className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Action Row                                                                 */
/* -------------------------------------------------------------------------- */

function ActionRow({
  title,
  due,
}: {
  title: string
  due: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
      <Users className="h-4 w-4 text-primary" />

      <div className="flex-1">
        <p className="font-medium">
          {title}
        </p>

        <p className="text-xs text-muted-foreground">
          {due}
        </p>
      </div>

      <Star className="h-4 w-4 text-amber-400" />
    </div>
  )
}