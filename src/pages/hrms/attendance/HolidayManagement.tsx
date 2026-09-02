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
import { HolidayFormDialog } from '@/features/hrms/attendance/components/HolidayFormDialog'
import { HOLIDAY_TYPE_LABELS } from '@/features/hrms/attendance/constants/attendance.constants'
import {
  useCreateHoliday,
  useDeleteHoliday,
  useHolidays,
  useUpdateHoliday,
} from '@/features/hrms/attendance/hooks/useAttendance'
import type { Holiday } from '@/features/hrms/attendance/types/attendance.types'

export default function HolidayManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null)

  const { data: holidays = [], isLoading, isError, refetch } = useHolidays()
  const createHoliday = useCreateHoliday()
  const updateHoliday = useUpdateHoliday()
  const deleteHoliday = useDeleteHoliday()

  const isSaving = createHoliday.isPending || updateHoliday.isPending
  const isDeleting = deleteHoliday.isPending

  const openCreateDialog = () => {
    setEditingHoliday(null)
    setDialogOpen(true)
  }

  const openEditDialog = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditingHoliday(null)
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Holiday Management"
        description="Create and publish holidays used by the attendance engine"
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Holiday
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
                <TableHead>Holiday</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No holidays configured. Add your first holiday.
                  </TableCell>
                </TableRow>
              ) : (
                holidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell>{holiday.date}</TableCell>
                    <TableCell>{HOLIDAY_TYPE_LABELS[holiday.type]}</TableCell>
                    <TableCell>{holiday.branch}</TableCell>
                    <TableCell>{holiday.companyWide ? 'Company-wide' : 'Branch'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          holiday.published
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }
                      >
                        {holiday.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${holiday.name}`}
                          onClick={() => openEditDialog(holiday)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${holiday.name}`}
                          onClick={() => setDeleteTarget(holiday)}
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

      <HolidayFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        holiday={editingHoliday}
        isLoading={isSaving}
        onSubmit={async (payload) => {
          if (editingHoliday) {
            await updateHoliday.mutateAsync({ id: editingHoliday.id, payload })
            return
          }
          await createHoliday.mutateAsync(payload)
        }}
      />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete holiday?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <span className="font-medium">{deleteTarget?.name}</span> from the
              holiday calendar. This action cannot be undone.
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
                await deleteHoliday.mutateAsync(deleteTarget.id)
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
