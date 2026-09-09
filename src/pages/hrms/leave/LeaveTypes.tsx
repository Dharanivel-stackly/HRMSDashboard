import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  useLeaveTypes,useToggleLeaveTypeStatus
} from '@/features/hrms/leave/hooks/useLeave'

export default function LeaveTypes() {
  const {
    data: leaveTypes = [],
    isLoading,
    error,
  } = useLeaveTypes()
  const toggleStatus =
  useToggleLeaveTypeStatus()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading leave types...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border p-6">
        <p className="font-medium">
          Failed to load leave types.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            Leave Types
          </h1>

          <p className="text-muted-foreground">
            Manage leave types and their annual entitlements.
          </p>
        </div>

        <Link to="/hrms/leave/types/new">
  <Button>
    Add Leave Type
  </Button>
</Link>

      </div>

      {/* Leave Types Table */}
      <div className="rounded-lg border bg-card">

        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Leave Type Configuration
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Available leave types configured for employees.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* <thead>
              <tr className="border-b text-left">

                <th className="px-4 py-3 font-medium">
                  Leave Type
                </th>

                <th className="px-4 py-3 font-medium">
                  Code
                </th>

                <th className="px-4 py-3 font-medium">
                  Annual Days
                </th>

                <th className="px-4 py-3 font-medium">
                  Paid
                </th>

                <th className="px-4 py-3 font-medium text-right">
                  Actions
                </th>

              </tr>
            </thead> */}

            <thead>
  <tr className="border-b text-left">

    <th className="px-4 py-3 font-medium">
      Leave Type
    </th>

    <th className="px-4 py-3 font-medium">
      Code
    </th>

    <th className="px-4 py-3 font-medium">
      Annual Days
    </th>

    <th className="px-4 py-3 font-medium">
      Paid
    </th>

    <th className="px-4 py-3 font-medium">
      Status
    </th>

    <th className="px-4 py-3 font-medium text-right">
      Actions
    </th>

  </tr>
</thead>

            <tbody>

              {leaveTypes.map((leaveType) => (
                <tr
                  key={leaveType.id}
                  className="border-b last:border-b-0"
                >

                  <td className="px-4 py-4 font-medium">
                    {leaveType.name}
                  </td>

                  <td className="px-4 py-4">
                    {leaveType.code}
                  </td>

                  <td className="px-4 py-4">
                    {leaveType.totalDays} days
                  </td>

                  {/* <td className="px-4 py-4">
                    {leaveType.isPaid ? 'Yes' : 'No'}
                  </td> */}
<td className="px-4 py-4">
  {leaveType.isPaid ? 'Yes' : 'No'}
</td>

<td className="px-4 py-4">
  <span
    className={
      leaveType.isActive
        ? 'text-sm font-medium text-green-600'
        : 'text-sm font-medium text-muted-foreground'
    }
  >
    {leaveType.isActive ? 'Active' : 'Inactive'}
  </span>
</td>

                  {/* <td className="px-4 py-4 text-right">

                   <Link
  to={`/hrms/leave/types/${leaveType.id}/edit`}
>
  <Button
    variant="outline"
    size="sm"
  >
    Edit
  </Button>
</Link>

                  </td> */}
                  <td className="px-4 py-4 text-right">
  <div className="flex justify-end gap-2">

    <Link
      to={`/hrms/leave/types/${leaveType.id}/edit`}
    >
      <Button
        variant="outline"
        size="sm"
      >
        Edit
      </Button>
    </Link>

    <Button
      variant="outline"
      size="sm"
      disabled={toggleStatus.isPending}
      onClick={() =>
        toggleStatus.mutate(leaveType.id)
      }
    >
      {leaveType.isActive
        ? 'Deactivate'
        : 'Activate'}
    </Button>

  </div>
</td>

                </tr>
              ))}

              {leaveTypes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No leave types found.
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