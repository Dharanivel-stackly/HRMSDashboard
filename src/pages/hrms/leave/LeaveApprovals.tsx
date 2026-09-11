import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { LeaveStatusBadge } from '@/features/hrms/leave/components/LeaveStatusBadge'
import { useLeaveRequests } from '@/features/hrms/leave/hooks/useLeave'

export default function LeaveApprovals() {
  const navigate = useNavigate()

  const {
    data: leaveRequests = [],
    isLoading,
    error,
  } = useLeaveRequests()

  const pendingRequests = leaveRequests.filter(
    (request) => request.status === 'PENDING'
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading leave approvals...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border p-6">
        <p className="text-destructive">
          Failed to load leave requests.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Leave Approvals
        </h1>

        <p className="text-muted-foreground">
          Review and manage employee leave requests.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-muted-foreground">
              Pending Requests
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {pendingRequests.length}
            </p>
          </div>

        </div>
      </div>

      {/* Requests */}
      <div className="rounded-lg border bg-card">

        <div className="border-b p-6">
          <h2 className="font-semibold">
            Pending Leave Requests
          </h2>

          <p className="text-sm text-muted-foreground">
            Requests waiting for manager approval.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-left">

                <th className="px-4 py-3 font-medium">
                  Employee
                </th>

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
                  Status
                </th>

                <th className="px-4 py-3 font-medium text-right">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {pendingRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b last:border-b-0"
                >

                  <td className="px-4 py-3 font-medium">
                    {request.employeeName}
                  </td>

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
                    <LeaveStatusBadge
                      status={request.status}
                    />
                  </td>

                  <td className="px-4 py-3 text-right">

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/hrms/leave/${request.id}`
                        )
                      }
                    >
                      View
                    </Button>

                  </td>

                </tr>
              ))}

              {pendingRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No pending leave requests.
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