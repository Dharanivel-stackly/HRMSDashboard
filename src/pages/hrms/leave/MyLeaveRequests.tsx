import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Clock, AlertCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LeaveStatusBadge } from '@/features/hrms/leave/components/LeaveStatusBadge'
import { useLeaveRequests } from '@/features/hrms/leave/hooks/useLeave'
import { ROUTES } from '@/lib/constants/routes'

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export default function MyLeaveRequests() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: leaveRequests = [],
    isLoading,
    error,
  } = useLeaveRequests()

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((request) => {
      const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter
      const matchesSearch =
        searchQuery.trim() === '' ||
        request.leaveTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [leaveRequests, statusFilter, searchQuery])

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Clock className="mr-2 h-5 w-5 animate-spin" />
          Loading leave requests...
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 font-semibold text-destructive">Failed to load leave requests</h3>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="My Leave Requests"
        description="View and track your submitted leave applications and their status."
        actions={
          <Button onClick={() => navigate(ROUTES.HRMS.LEAVE_APPLY)}>
            <Plus className="mr-2 h-4 w-4" />
            Apply Leave
          </Button>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as StatusFilter[]).map((status) => (
            <Button
              key={status}
              type="button"
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="text-xs"
            >
              {status === 'ALL' ? 'All Requests' : status.charAt(0) + status.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by leave type or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Requests Card */}
      <div className="rounded-xl border border-border/60 bg-card shadow-xs">
        <div className="border-b border-border/60 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Leave Applications</h3>
            <p className="text-xs text-muted-foreground">
              Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/20">
                <th className="px-6 py-3 font-medium">Leave Type</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Days</th>
                <th className="px-6 py-3 font-medium">Applied On</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-border/40 last:border-b-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{request.leaveTypeName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{request.reason}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">
                    {request.fromDate} to {request.toDate}
                  </td>
                  <td className="px-6 py-4 font-semibold">{request.numberOfDays}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{request.appliedOn}</td>
                  <td className="px-6 py-4">
                    <LeaveStatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(ROUTES.HRMS.LEAVE_DETAIL(request.id))}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No leave requests found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}