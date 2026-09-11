import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LeaveStatusBadge } from '@/features/hrms/leave/components/LeaveStatusBadge'
import { Button } from '@/components/ui/button'
import { useLeaveRequests } from '@/features/hrms/leave/hooks/useLeave'
import { useNavigate } from 'react-router-dom'

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

export default function MyLeaveRequests() {
    const navigate = useNavigate()
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('ALL')

  const {
    data: leaveRequests = [],
    isLoading,
    error,
  } = useLeaveRequests()

  const filteredRequests =
    statusFilter === 'ALL'
      ? leaveRequests
      : leaveRequests.filter(
          (request) => request.status === statusFilter
        )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading leave requests...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border p-6">
        <p className="font-medium">
          Failed to load leave requests.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            My Leave Requests
          </h1>

          <p className="text-muted-foreground">
            View and track your leave applications.
          </p>
        </div>

        <Link to="/hrms/leave/apply">
          <Button>
            Apply Leave
          </Button>
        </Link>

      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">

        {(
          [
            'ALL',
            'PENDING',
            'APPROVED',
            'REJECTED',
          ] as StatusFilter[]
        ).map((status) => (
          <Button
            key={status}
            type="button"
            variant={
              statusFilter === status
                ? 'default'
                : 'outline'
            }
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status === 'ALL'
              ? 'All'
              : status.charAt(0) +
                status.slice(1).toLowerCase()}
          </Button>
        ))}

      </div>

      {/* Requests Table */}
      <div className="rounded-lg border bg-card">

        <div className="border-b p-6">
          <h2 className="font-semibold">
            Leave Applications
          </h2>

          <p className="text-sm text-muted-foreground">
            {filteredRequests.length} request
            {filteredRequests.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-left">

                <th className="px-4 py-3 font-medium">
                  Leave Type
                </th>

                <th className="px-4 py-3 font-medium">
                  From
                </th>

                <th className="px-4 py-3 font-medium">
                  To
                </th>

                <th className="px-4 py-3 font-medium">
                  Days
                </th>

                <th className="px-4 py-3 font-medium">
                  Applied On
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredRequests.map((request) => (
                <tr
                 key={request.id}
                 className="cursor-pointer border-b last:border-b-0 hover:bg-muted/50"
                 onClick={() =>
                 navigate(`/hrms/leave/${request.id}`)
                  }
                  >
                  <td className="px-4 py-3">
                    {request.leaveTypeName}
                  </td>

                  <td className="px-4 py-3">
                    {request.fromDate}
                  </td>

                  <td className="px-4 py-3">
                    {request.toDate}
                  </td>

                  <td className="px-4 py-3">
                    {request.numberOfDays}
                  </td>

                  <td className="px-4 py-3">
                    {request.appliedOn}
                  </td>

                 <td className="px-4 py-3">
  <LeaveStatusBadge status={request.status} />
</td>

                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No leave requests found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}