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
import { HolidayFormDialog } from '@/features/hrms/attendance/components/HolidayFormDialog'
import { HOLIDAY_TYPE_LABELS } from '@/features/hrms/attendance/constants/attendance.constants'
import { mockHolidays } from '@/features/hrms/attendance/mock/attendance.mock'
import type { Holiday } from '@/features/hrms/attendance/types/attendance.types'

export default function HolidayManagement() {
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreate = (holiday: Holiday) => {
    setHolidays((prev) => [holiday, ...prev])
  }

  return (
    <PageContainer>
      <PageHeader
        title="Holiday Management"
        description="Create and publish holidays used by the attendance engine"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Holiday
          </Button>
        }
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-soft/60 hover:bg-brand-soft/60">
              <TableHead>Holiday</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <HolidayFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
    </PageContainer>
  )
}
