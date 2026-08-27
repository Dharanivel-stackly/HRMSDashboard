import { Eye, PencilLine, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import type { AttendanceRecord } from '../types/attendance.types'

interface AttendanceTableProps {
  records: AttendanceRecord[]
  onView?: (record: AttendanceRecord) => void
  onCorrect?: (record: AttendanceRecord) => void
}

function formatHours(value: number | null) {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(1)}h`
}

function formatMinutes(value: number | null) {
  if (value === null || value === undefined) return '—'
  return `${value}m`
}

export function AttendanceTable({ records, onView, onCorrect }: AttendanceTableProps) {
  return (
    <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-brand-soft/60 hover:bg-brand-soft/60">
            <TableHead className="w-[220px]">Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Work Hours</TableHead>
            <TableHead>Break</TableHead>
            <TableHead>Late</TableHead>
            <TableHead>OT</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                No attendance records found for the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {record.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{record.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{record.employeeCode}</p>
                    </div>
                    {record.hasCorrection && (
                      <span
                        title="Correction pending"
                        className="h-2 w-2 rounded-full bg-amber-500"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{record.department}</p>
                    <p className="text-xs text-muted-foreground">{record.branch}</p>
                  </div>
                </TableCell>
                <TableCell>{record.shift}</TableCell>
                <TableCell className="font-medium">{record.checkIn ?? '—'}</TableCell>
                <TableCell className="font-medium">{record.checkOut ?? '—'}</TableCell>
                <TableCell>{formatHours(record.workHours)}</TableCell>
                <TableCell>{formatMinutes(record.breakMinutes)}</TableCell>
                <TableCell
                  className={
                    record.lateMinutes && record.lateMinutes > 0
                      ? 'font-medium text-amber-700'
                      : undefined
                  }
                >
                  {formatMinutes(record.lateMinutes)}
                </TableCell>
                <TableCell>{formatHours(record.overtimeHours)}</TableCell>
                <TableCell>
                  <AttendanceStatusBadge status={record.status} />
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(record)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCorrect?.(record)}>
                          <PencilLine className="mr-2 h-4 w-4" />
                          Correct
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
