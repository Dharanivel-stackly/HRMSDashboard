// src/features/hrms/recruitment/components/CandidateList.tsx
import { useState, useMemo } from 'react'
import { Search, Filter, MoreHorizontal, Eye, Edit, Mail, UserX, CheckSquare, Square } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CANDIDATE_STATUS_LABELS,
  CANDIDATE_STATUS_STYLES,
} from '../constants/recruitment.constants'
import type { Candidate, CandidateStatus } from '../types/recruitment.types'

interface CandidateListProps {
  candidates: Candidate[]
  isLoading?: boolean
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  onView?: (candidate: Candidate) => void
  onEdit?: (candidate: Candidate) => void
  onContact?: (candidate: Candidate) => void
  onReject?: (candidate: Candidate) => void
  onStatusChange?: (candidate: Candidate, status: CandidateStatus) => void
}

export function CandidateList({
  candidates,
  isLoading = false,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  onView,
  onEdit,
  onContact,
  onReject,
  onStatusChange,
}: CandidateListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.position.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [candidates, search, statusFilter])

  const getInitials = (c: { firstName: string; lastName: string }) =>
    `${c.firstName.charAt(0)}${c.lastName.charAt(0)}`

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(filtered.map((c) => c.id))
    } else {
      onSelectionChange?.([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedIds, id])
    } else {
      onSelectionChange?.(selectedIds.filter((i) => i !== id))
    }
  }

  const isAllSelected = filtered.length > 0 && filtered.every((c) => selectedIds.includes(c.id))
  const isSomeSelected = filtered.some((c) => selectedIds.includes(c.id))

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as CandidateStatus | 'all')}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(CANDIDATE_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-soft/60 hover:bg-brand-soft/60">
              {selectable && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    aria-label="Select all"
                    className={isSomeSelected && !isAllSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                  />
                </TableHead>
              )}
              <TableHead>Candidate</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={selectable ? 9 : 8} className="h-24 text-center text-muted-foreground">
                  No candidates found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(c.id)}
                        onCheckedChange={(checked) => handleSelectOne(c.id, !!checked)}
                        aria-label={`Select ${c.firstName} ${c.lastName}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {getInitials(c)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{c.position}</TableCell>
                  <TableCell>{c.department}</TableCell>
                  <TableCell>{c.experienceYears}y</TableCell>
                  <TableCell>{c.appliedDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={CANDIDATE_STATUS_STYLES[c.status]}>
                      {CANDIDATE_STATUS_LABELS[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {c.rating ? (
                      <span className="font-semibold text-amber-600">{c.rating}★</span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(c)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(c)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onContact?.(c)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onReject?.(c)}
                          className="text-destructive"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Reject
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
    </div>
  )
}