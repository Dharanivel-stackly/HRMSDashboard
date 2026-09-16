import { Link, useNavigate } from 'react-router-dom'
import { Plus, ClipboardList, CheckSquare, Settings, CalendarDays, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { LeaveStatusBadge } from '@/features/hrms/leave/components/LeaveStatusBadge'
import { useLeaveBalance, useLeaveRequests } from '@/features/hrms/leave/hooks/useLeave'
import { ROUTES } from '@/lib/constants/routes'

export default function Leave() {
  const navigate = useNavigate()

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
      <PageContainer>
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Clock className="mr-2 h-5 w-5 animate-spin" />
          Loading leave information...
        </div>
      </PageContainer>
    )
  }

  if (balanceError || requestsError) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 font-semibold text-destructive">Failed to load leave information</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh or try again later.
          </p>
        </div>
      </PageContainer>
    )
  }

  const totalEntitlement = leaveBalance.reduce((total, leave) => total + leave.total, 0)
  const totalAvailable = leaveBalance.reduce((total, leave) => total + leave.available, 0)
  const totalUsed = leaveBalance.reduce((total, leave) => total + leave.used, 0)
  const totalPending = leaveBalance.reduce((total, leave) => total + leave.pending, 0)
  const pendingApprovalsCount = leaveRequests.filter((req) => req.status === 'PENDING').length

  return (
    <PageContainer>
      <PageHeader
        title="Leave Management"
        description="Track your leave entitlements, submit leave applications, and manage leave requests."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate(ROUTES.HRMS.LEAVE_MY)}>
              <ClipboardList className="mr-2 h-4 w-4" />
              My Requests
            </Button>
            <Button variant="outline" onClick={() => navigate(ROUTES.HRMS.LEAVE_APPROVALS)}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Approvals ({pendingApprovalsCount})
            </Button>
            <Button onClick={() => navigate(ROUTES.HRMS.LEAVE_APPLY)}>
              <Plus className="mr-2 h-4 w-4" />
              Apply Leave
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Available Leave</p>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">{totalAvailable} <span className="text-sm font-normal text-muted-foreground">Days</span></p>
          <p className="mt-1 text-xs text-muted-foreground">Out of {totalEntitlement} total days</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Used Leave</p>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">{totalUsed} <span className="text-sm font-normal text-muted-foreground">Days</span></p>
          <p className="mt-1 text-xs text-muted-foreground">Approved leave days taken</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending Requests</p>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">{totalPending} <span className="text-sm font-normal text-muted-foreground">Days</span></p>
          <p className="mt-1 text-xs text-muted-foreground">Awaiting manager approval</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick Actions</p>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600">
              <Settings className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link to={ROUTES.HRMS.LEAVE_TYPES} className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Manage Types
              </Button>
            </Link>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Configure entitlements</p>
        </div>
      </div>

      {/* Main Grid: Balance & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Leave Balance Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Leave Balance Breakdown</h3>
                <p className="text-xs text-muted-foreground">Entitlement status by leave category</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {leaveBalance.map((leave) => {
                const percentage = leave.total > 0 ? Math.round((leave.used / leave.total) * 100) : 0
                return (
                  <div key={leave.leaveTypeId} className="rounded-lg border border-border/50 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{leave.leaveTypeName}</span>
                      <span className="font-semibold text-primary">{leave.available} days left</span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Used: {leave.used} / {leave.total} days</span>
                      {leave.pending > 0 && (
                        <span className="text-amber-600 font-medium">({leave.pending} days pending)</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="text-base font-semibold">Recent Leave Requests</h3>
                <p className="text-xs text-muted-foreground">Latest leave applications submitted</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HRMS.LEAVE_MY)}>
                View All
              </Button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium">Type</th>
                    <th className="px-3 py-2.5 font-medium">From - To</th>
                    <th className="px-3 py-2.5 font-medium">Days</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.slice(0, 5).map((request) => (
                    <tr
                      key={request.id}
                      className="border-b last:border-b-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-3 py-3 font-medium">{request.leaveTypeName}</td>
                      <td className="px-3 py-3 text-muted-foreground text-xs">
                        {request.fromDate} to {request.toDate}
                      </td>
                      <td className="px-3 py-3 font-medium">{request.numberOfDays}</td>
                      <td className="px-3 py-3">
                        <LeaveStatusBadge status={request.status} />
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(ROUTES.HRMS.LEAVE_DETAIL(request.id))}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {leaveRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No leave requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}