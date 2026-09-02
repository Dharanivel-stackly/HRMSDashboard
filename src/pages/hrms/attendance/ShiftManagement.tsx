import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ShiftFormDialog } from '@/features/hrms/attendance/components/ShiftFormDialog'
import {
  useCreateShift,
  useDeleteShift,
  useShifts,
  useUpdateShift,
} from '@/features/hrms/attendance/hooks/useAttendance'
import type { Shift } from '@/features/hrms/attendance/types/attendance.types'

export default function ShiftManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null)

  const { data: shifts = [], isLoading, isError, refetch } = useShifts()
  const createShift = useCreateShift()
  const updateShift = useUpdateShift()
  const deleteShift = useDeleteShift()

  const isSaving = createShift.isPending || updateShift.isPending
  const isDeleting = deleteShift.isPending

  const openCreateDialog = () => {
    setEditingShift(null)
    setDialogOpen(true)
  }

  const openEditDialog = (shift: Shift) => {
    setEditingShift(shift)
    setDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditingShift(null)
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Shift Management"
        description="Configure shift timings, grace, break and overtime rules"
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Shift
          </Button>
        }
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        {isLoading ? (
          <div className="p-6">
            <LoadingState rows={4} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-soft/60 hover:bg-brand-soft/60">
                <TableHead>Code</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Timing</TableHead>
                <TableHead>Grace</TableHead>
                <TableHead>Break</TableHead>
                <TableHead>Min Hours</TableHead>
                <TableHead>Half-day</TableHead>
                <TableHead>OT After</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                    No shifts configured. Create your first shift.
                  </TableCell>
                </TableRow>
              ) : (
                shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-mono text-xs font-semibold">{shift.code}</TableCell>
                    <TableCell className="font-medium">{shift.name}</TableCell>
                    <TableCell>
                      {shift.startTime} – {shift.endTime}
                      {shift.crossMidnight && (
                        <span className="ml-1 text-xs text-muted-foreground">(cross-midnight)</span>
                      )}
                    </TableCell>
                    <TableCell>{shift.graceMinutes}m</TableCell>
                    <TableCell>{shift.breakMinutes}m</TableCell>
                    <TableCell>{shift.minWorkHours}h</TableCell>
                    <TableCell>{shift.halfDayThreshold}h</TableCell>
                    <TableCell>{shift.overtimeThreshold}h</TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs">
                      {shift.departments.join(', ')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          shift.status === 'active'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }
                      >
                        {shift.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${shift.name}`}
                          onClick={() => openEditDialog(shift)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${shift.name}`}
                          onClick={() => setDeleteTarget(shift)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <ShiftFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        shift={editingShift}
        isLoading={isSaving}
        onSubmit={async (payload) => {
          if (editingShift) {
            await updateShift.mutateAsync({ id: editingShift.id, payload })
            return
          }
          await createShift.mutateAsync(payload)
        }}
      />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete shift?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove shift <span className="font-medium">{deleteTarget?.name}</span> (
              {deleteTarget?.code}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={async (event) => {
                event.preventDefault()
                if (!deleteTarget) return
                await deleteShift.mutateAsync(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}
