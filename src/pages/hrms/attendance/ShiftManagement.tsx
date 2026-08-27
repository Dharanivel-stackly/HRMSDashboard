import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ShiftFormDialog } from '@/features/hrms/attendance/components/ShiftFormDialog'
import { mockShifts } from '@/features/hrms/attendance/mock/attendance.mock'
import type { Shift } from '@/features/hrms/attendance/types/attendance.types'

export default function ShiftManagement() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreate = (shift: Shift) => {
    setShifts((prev) => [shift, ...prev])
  }

  return (
    <PageContainer>
      <PageHeader
        title="Shift Management"
        description="Configure shift timings, grace, break and overtime rules"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Shift
          </Button>
        }
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ShiftFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
    </PageContainer>
  )
}
