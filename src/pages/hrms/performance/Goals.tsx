import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { appConfig } from '@/config/app.config'
import { useDebounce } from '@/hooks/useDebounce'
import { ROUTES } from '@/lib/constants/routes'
import {
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useUpdateGoal,
  useUpdateGoalProgress,
} from '@/features/hrms/performance/hooks/usePerformance'
import type { Goal } from '@/features/hrms/performance/types/performance.types'
import { PerformanceCreateDialog } from './PerformanceCreateDialog'

const tabs: { key: 'overview' | 'goals' | 'kpis' | 'appraisal' | 'feedback'; label: string; path: string }[] = [
  { key: 'overview', label: 'Overview', path: ROUTES.HRMS.PERFORMANCE },
  { key: 'goals', label: 'Goals', path: ROUTES.HRMS.PERFORMANCE_GOALS },
  { key: 'kpis', label: 'KPI Management', path: ROUTES.HRMS.PERFORMANCE_KPIS },
  { key: 'appraisal', label: 'Appraisal', path: ROUTES.HRMS.PERFORMANCE_APPRAISAL },
  { key: 'feedback', label: '360 Feedback', path: ROUTES.HRMS.PERFORMANCE_FEEDBACK },
]

const statusClasses: Record<string, string> = {
  'On track': 'bg-emerald-50 text-emerald-700',
  'At risk': 'bg-amber-50 text-amber-700',
}

export default function Goals() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(appConfig.pagination.defaultPageSize)
  const [showCreate, setShowCreate] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null)
  const { data, isLoading, isError, refetch } = useGoals({ page, limit: pageSize, search: debouncedSearch })
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const updateGoalProgress = useUpdateGoalProgress()
  const deleteGoal = useDeleteGoal()

  const activeTab = tabs.find((tab) => tab.path === location.pathname)?.key ?? 'overview'

  const goals = data?.data ?? []
  const totalItems = data?.meta?.total ?? 0
  const totalPages = data?.meta?.totalPages ?? 1

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, pageSize])

  useEffect(() => {
    if (page > totalPages) setPage(Math.max(1, totalPages))
  }, [page, totalPages])

  const selectTab = (tab: (typeof tabs)[number]) => {
    navigate(tab.path)
  }

  const openCreateDialog = () => {
    setEditingGoal(null)
    setShowCreate(true)
  }

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal)
    setShowCreate(true)
  }

  const handleDialogChange = (open: boolean) => {
    setShowCreate(open)
    if (!open) setEditingGoal(null)
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <PageContainer>
      <PageHeader
        title="Performance Management"
        description="Set goals, measure outcomes, and build a continuous feedback culture"
        actions={<Button onClick={openCreateDialog}><Plus className="h-4 w-4" /> Add new</Button>}
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
            <p className="text-xs text-muted-foreground">Track objectives and progress across your teams</p>
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

        {isLoading ? <LoadingState rows={5} /> : <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="pb-3">Goal</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Due date</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr key={goal.id} className="border-b last:border-0">
                  <td className="py-4 font-medium">
                    {goal.title}
                    <p className="text-xs text-muted-foreground">{goal.team}</p>
                  </td>
                  <td className="py-4">{goal.owner}</td>
                  <td className="py-4 text-muted-foreground">{goal.due}</td>
                  <td className="w-44 py-4">
                    <ProgressRow
                      value={goal.progress}
                      isSaving={updateGoalProgress.isPending && updateGoalProgress.variables?.id === goal.id}
                      onCommit={async (progress) => {
                        await updateGoalProgress.mutateAsync({
                          id: goal.id,
                          payload: { progress },
                        })
                      }}
                    />
                  </td>
                  <td className="py-4">
                    <StatusBadge status={goal.status} />
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label={`Edit ${goal.title}`} onClick={() => openEditDialog(goal)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Delete ${goal.title}`} onClick={() => setDeletingGoal(goal)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </section>
      {totalItems > 0 && <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />}
      <PerformanceCreateDialog
        module="goal"
        open={showCreate}
        onOpenChange={handleDialogChange}
        isSubmitting={createGoal.isPending || updateGoal.isPending}
        isEditing={Boolean(editingGoal)}
        initialValues={editingGoal ? { title: editingGoal.title, owner: editingGoal.owner, team: editingGoal.team, due: editingGoal.due } : {}}
        onCreate={async (values) => {
          if (editingGoal) {
            await updateGoal.mutateAsync({
              id: editingGoal.id,
              payload: { title: values.title, owner: values.owner, team: values.team, due: values.due },
            })
            return
          }
          await createGoal.mutateAsync({
            title: values.title,
            owner: values.owner,
            team: values.team,
            due: values.due,
          })
        }}
      />
      <ConfirmDialog
        open={Boolean(deletingGoal)}
        onOpenChange={(open) => !open && setDeletingGoal(null)}
        title="Delete goal?"
        description={`This will permanently remove ${deletingGoal?.title ?? 'this goal'}.`}
        confirmLabel={deleteGoal.isPending ? 'Deleting...' : 'Delete'}
        variant="destructive"
        onConfirm={() => {
          if (!deletingGoal) return
          void deleteGoal.mutateAsync(deletingGoal.id).then(() => setDeletingGoal(null))
        }}
      />
    </PageContainer>
  )
}

function ProgressRow({
  value,
  isSaving,
  onCommit,
}: {
  value: number
  isSaving: boolean
  onCommit: (progress: number) => Promise<void>
}) {
  const [draftValue, setDraftValue] = useState(value)
  const submittedValue = useRef<number | null>(null)

  useEffect(() => {
    setDraftValue(value)
  }, [value])

  const commit = (nextValue = draftValue) => {
    if (nextValue === value || isSaving || submittedValue.current === nextValue) return

    submittedValue.current = nextValue
    void onCommit(nextValue).catch(() => {
      submittedValue.current = null
      setDraftValue(value)
    })
  }

  const handlePointerRelease = (event: React.PointerEvent<HTMLInputElement>) => {
    commit(Number(event.currentTarget.value))
  }

  const handleBlur = () => {
    commit()
  }

  useEffect(() => {
    if (value === draftValue) {
      submittedValue.current = null
    }
  }, [draftValue, value])

  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{isSaving ? 'Saving...' : 'Progress'}</span>
        <span>{Math.round(draftValue)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={draftValue}
        disabled={isSaving}
        aria-label="Goal progress"
        onChange={(event) => setDraftValue(Number(event.target.value))}
        onPointerUp={handlePointerRelease}
        onBlur={handleBlur}
        className="mt-2 h-2 w-full cursor-pointer accent-primary disabled:cursor-wait"
      />
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
