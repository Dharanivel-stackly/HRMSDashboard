import {useLeaveBalance,useLeaveRequests,} from '@/features/hrms/leave/hooks/useLeave'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Leave() {
  const {
    data: leaveBalance = [],
    isLoading: balanceLoading,
    error: balanceError,
  } = useLeaveBalance()

  const {
    data: leaveRequests = [],
    isLoading: requestsLoading,
    error: requestsError,
  } = useLeaveRequests()

  if (balanceLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading leave information...
      </div>
    )
  }

  if (balanceError || requestsError) {
    return (
      <div className="rounded-lg border p-6">
        <p className="font-medium">
          Failed to load leave information.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>
      </div>
    )
  }

  const totalAvailable = leaveBalance.reduce(
    (total, leave) => total + leave.available,
    0
  )

  const totalUsed = leaveBalance.reduce(
    (total, leave) => total + leave.used,
    0
  )

  const totalPending = leaveBalance.reduce(
    (total, leave) => total + leave.pending,
    0
  )

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-start justify-between">
  <div>
    <h1 className="text-2xl font-semibold">
      Leave Management
    </h1>

    <p className="text-muted-foreground">
      Manage employee leave requests, balances, and approvals.
    </p>
  </div>

  <div className="flex gap-2">

    <Link to="/hrms/leave/my">
      <Button variant="outline">
        My Leave Requests
      </Button>
    </Link>

    <Link to="/hrms/leave/apply">
      <Button>
        Apply Leave
      </Button>
    </Link>

  </div>
</div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Available Leave
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {totalAvailable} Days
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Used Leave
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {totalUsed} Days
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Pending Leave
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {totalPending} Days
          </p>
        </div>

      </div>

      {/* Leave Balance */}
      <div className="rounded-lg border bg-card p-6">

        <div>
          <h2 className="text-lg font-semibold">
            Leave Balance
          </h2>

          <p className="text-sm text-muted-foreground">
            Current leave balance by leave type
          </p>
        </div>

        <div className="mt-6 space-y-5">

          {leaveBalance.map((leave) => (
            <div
              key={leave.leaveTypeId}
              className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
            >

              <div>
                <p className="font-medium">
                  {leave.leaveTypeName}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Used: {leave.used} days
                  {' • '}
                  Accrued: {leave.accrued} days
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {leave.available} Days
                </p>

                <p className="text-sm text-muted-foreground">
                  Available
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Recent Leave Requests */}
      <div className="rounded-lg border bg-card p-6">

        <div>
          <h2 className="text-lg font-semibold">
            Recent Leave Requests
          </h2>

          <p className="text-sm text-muted-foreground">
            Your latest leave applications
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-left">

                <th className="px-3 py-3 font-medium">
                  Leave Type
                </th>

                <th className="px-3 py-3 font-medium">
                  From
                </th>

                <th className="px-3 py-3 font-medium">
                  To
                </th>

                <th className="px-3 py-3 font-medium">
                  Days
                </th>

                <th className="px-3 py-3 font-medium">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {leaveRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b last:border-b-0"
                >

                  <td className="px-3 py-3">
                    {request.leaveTypeName}
                  </td>

                  <td className="px-3 py-3">
                    {request.fromDate}
                  </td>

                  <td className="px-3 py-3">
                    {request.toDate}
                  </td>

                  <td className="px-3 py-3">
                    {request.numberOfDays}
                  </td>

                  <td className="px-3 py-3">
                    {request.status}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}