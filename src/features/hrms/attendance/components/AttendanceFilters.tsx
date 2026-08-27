import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BRANCHES, DEPARTMENTS, SHIFTS, ATTENDANCE_STATUS_LABELS } from '../constants/attendance.constants'
import type { AttendanceFilters, AttendanceStatus } from '../types/attendance.types'

interface AttendanceFiltersBarProps {
  filters: AttendanceFilters
  onChange: (filters: AttendanceFilters) => void
  showDate?: boolean
  showStatus?: boolean
  showSearch?: boolean
}

export function AttendanceFiltersBar({
  filters,
  onChange,
  showDate = true,
  showStatus = true,
  showSearch = true,
}: AttendanceFiltersBarProps) {
  const update = (patch: Partial<AttendanceFilters>) => onChange({ ...filters, ...patch })

  return (
    <div className="ui-card-elevated flex flex-wrap items-end gap-3 rounded-xl border border-border/60 bg-card p-4">
      {showDate && (
        <div className="min-w-[160px] flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Date</label>
          <Input
            type="date"
            value={filters.date ?? ''}
            onChange={(e) => update({ date: e.target.value })}
          />
        </div>
      )}

      <div className="min-w-[150px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Branch</label>
        <Select
          value={filters.branch ?? 'All Branches'}
          onValueChange={(v) => update({ branch: v ?? undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            {BRANCHES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[150px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Department</label>
        <Select
          value={filters.department ?? 'All Departments'}
          onValueChange={(v) => update({ department: v ?? undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Shift</label>
        <Select
          value={filters.shift ?? 'All Shifts'}
          onValueChange={(v) => update({ shift: v ?? undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            {SHIFTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showStatus && (
        <div className="min-w-[140px] flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select
            value={filters.status ?? 'all'}
            onValueChange={(v) =>
              update({ status: (v as AttendanceStatus | 'all') ?? 'all' })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(ATTENDANCE_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showSearch && (
        <div className="min-w-[200px] flex-[1.5] space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Name or employee ID"
              value={filters.search ?? ''}
              onChange={(e) => update({ search: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
