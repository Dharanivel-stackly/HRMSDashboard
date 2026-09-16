import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
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
import { OVERTIME_STATUS_LABELS } from '@/features/hrms/attendance/constants/attendance.constants'
import {
  useOvertime,
  useApproveOvertime,
  useRejectOvertime,
} from '@/features/hrms/attendance/hooks/useAttendance'
import { Check, X } from 'lucide-react'

export default function OvertimePage() {
  const { data: records = [], isLoading, isError, refetch } = useOvertime()
  const approveOvertime = useApproveOvertime()
  const rejectOvertime = useRejectOvertime()

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Overtime"
        description="Review overtime calculation, approvals and payroll handoff"
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
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Regular</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payroll</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium">{row.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{row.department}</p>
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.regularHours}h</TableCell>
                  <TableCell className="font-semibold text-indigo-700">
                    {row.overtimeHours}h
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{row.reason}</TableCell>
                  <TableCell>{row.approver}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {OVERTIME_STATUS_LABELS[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{row.payrollStatus}</TableCell>
                  <TableCell>
                    {row.status === 'pending' ? (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-emerald-600"
                          disabled={approveOvertime.isPending}
                          onClick={() => approveOvertime.mutate(row.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600"
                          disabled={rejectOvertime.isPending}
                          onClick={() => rejectOvertime.mutate(row.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </PageContainer>
  )
}
