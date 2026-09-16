import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Clock, AlertCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import {
  useLeaveTypes,
  useToggleLeaveTypeStatus,
} from '@/features/hrms/leave/hooks/useLeave'
import { ROUTES } from '@/lib/constants/routes'

export default function LeaveTypes() {
  const navigate = useNavigate()
  const { data: leaveTypes = [], isLoading, error } = useLeaveTypes()
  const toggleStatus = useToggleLeaveTypeStatus()

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Clock className="mr-2 h-5 w-5 animate-spin" />
          Loading leave types...
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 font-semibold text-destructive">Failed to load leave types</h3>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Leave Types"
        description="Configure available leave categories, codes, and annual entitlements."
        actions={
          <Button onClick={() => navigate(ROUTES.HRMS.LEAVE_TYPE_NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Leave Type
          </Button>
        }
      />

      <div className="rounded-xl border border-border/60 bg-card shadow-xs">
        <div className="border-b border-border/60 px-6 py-4">
          <h3 className="text-base font-semibold">Leave Type Configuration</h3>
          <p className="text-xs text-muted-foreground">
            Active and inactive leave types configured for all employees.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/20">
                <th className="px-6 py-3 font-medium">Leave Type</th>
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Annual Entitlement</th>
                <th className="px-6 py-3 font-medium">Paid</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.map((leaveType) => (
                <tr
                  key={leaveType.id}
                  className="border-b border-border/40 last:border-b-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-foreground">{leaveType.name}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-medium">
                      {leaveType.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{leaveType.totalDays} days / year</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        leaveType.isPaid
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-slate-500/10 text-slate-600'
                      }`}
                    >
                      {leaveType.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        leaveType.isActive
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {leaveType.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(ROUTES.HRMS.LEAVE_TYPE_EDIT(leaveType.id))}
                      >
                        <Edit2 className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={toggleStatus.isPending}
                        onClick={() => toggleStatus.mutate(leaveType.id)}
                      >
                        {leaveType.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {leaveTypes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No leave types found. Click "Add Leave Type" to create one.
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