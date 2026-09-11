import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'react-router-dom';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useOnboardingEmployee, useUpdateOnboardingEmployee } from '@/features/hrms/onboarding/hooks/useOnboarding';
import { useHRTasks, useUpdateTaskStatus } from '@/features/hrms/onboarding/hooks/useChecklist';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { CheckCircle2, Clock, AlertCircle, Banknote } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '@/features/hrms/onboarding/services/onboardingService';

const statusMap: Record<string, { label: string; variant: 'active' | 'pending' | 'warning' | 'error' | 'inactive' }> = {
  not_started: { label: 'Not Started', variant: 'inactive' },
  document_collection: { label: 'Document Collection', variant: 'pending' },
  document_verification: { label: 'Document Verification', variant: 'pending' },
  background_verification: { label: 'Background Verification', variant: 'pending' },
  orientation: { label: 'Orientation', variant: 'pending' },
  policy_acceptance: { label: 'Policy Acceptance', variant: 'pending' },
  system_access: { label: 'System Access', variant: 'pending' },
  it_tasks: { label: 'IT Tasks', variant: 'pending' },
  asset_allocation: { label: 'Asset Allocation', variant: 'pending' },
  manager_tasks: { label: 'Manager Tasks', variant: 'pending' },
  hr_tasks: { label: 'HR Tasks', variant: 'pending' },
  completed: { label: 'Completed', variant: 'active' },
};

const statusOrder = [
  'not_started',
  'document_collection',
  'document_verification',
  'background_verification',
  'orientation',
  'policy_acceptance',
  'system_access',
  'it_tasks',
  'asset_allocation',
  'manager_tasks',
  'hr_tasks',
  'completed',
];

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', ifsc: '', branch: '' });

  const { data: employee, isLoading, isError, refetch: refetchEmployee } = useOnboardingEmployee(id!);
  const { data: hrTasks, isLoading: tasksLoading, refetch: refetchTasks } = useHRTasks(id);
  const { mutate: updateEmployee } = useUpdateOnboardingEmployee(id!);
  const { mutate: updateTask } = useUpdateTaskStatus();

  if (isLoading || tasksLoading) return <LoadingState variant="page" />;
  if (isError || !employee) return <ErrorState onRetry={refetchEmployee} />;

  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
  const statusInfo = statusMap[employee.status] || { label: employee.status, variant: 'pending' as const };

  const hrTaskList = hrTasks || [];
  const bankAccountTask = hrTaskList.find(t => t.taskType === 'bank_account');
  const isBankAccountPending = bankAccountTask?.status === 'pending';

  const handleAddBankAccount = () => {
    if (!bankAccountTask) return;
    updateTask(
      { taskId: bankAccountTask.id, status: 'completed' },
      {
        onSuccess: () => {
          const allHrTasksCompleted = hrTaskList.every(t => t.status === 'completed' || t.id === bankAccountTask.id);
          if (allHrTasksCompleted) {
            const currentIdx = statusOrder.indexOf(employee.status);
            const nextStatus = currentIdx < statusOrder.length - 1 ? statusOrder[currentIdx + 1] : employee.status;
            const progress = Math.min(employee.progress + 10, 100);
            updateEmployee(
              { status: nextStatus as any, progress },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ['onboardingEmployee', id] });
                  queryClient.invalidateQueries({ queryKey: ['hrTasks'] });
                  setDialogOpen(false);
                },
              }
            );
          } else {
            refetchTasks();
            refetchEmployee();
            setDialogOpen(false);
          }
        },
      }
    );
  };

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader title="Onboarding Profile" description={`${employee.firstName} ${employee.lastName}`} />

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Left Card - Profile */}
        <Card className="border-[#0b3d91]/5 bg-white/80 backdrop-blur-sm shadow-lg shadow-[#0b3d91]/5 rounded-2xl overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-[#0b3d91]/10 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-[#0b3d91]/10 to-[#0b3d91]/5 text-3xl font-semibold text-[#0b3d91]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold text-[#0b3d91]">{employee.firstName} {employee.lastName}</h2>
              <p className="text-muted-foreground">{employee.designation}</p>
              <p className="text-sm text-muted-foreground">{employee.department}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <Badge variant="outline" className="border-[#0b3d91]/10 bg-[#f0f4ff] text-[#0b3d91]">
                  {employee.employeeId}
                </Badge>
                <StatusBadge status={statusInfo.variant} label={statusInfo.label} />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joining Date</span>
                <span className="font-medium">{employee.joiningDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manager</span>
                <span className="font-medium">{employee.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HR Coordinator</span>
                <span className="font-medium">{employee.hrCoordinator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-sm">{employee.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{employee.phone}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{employee.progress}%</span>
              </div>
              <Progress value={employee.progress} className="mt-2 h-2 [&>div]:bg-[#0b3d91]" />
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Onboarding Status Card */}
          <Card className="border-[#0b3d91]/5 bg-white/80 backdrop-blur-sm shadow-lg shadow-[#0b3d91]/5 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-[#0b3d91]">Onboarding Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statusMap).map(([key, value]) => {
                  const isActive = key === employee.status;
                  const isCompleted = key === 'completed' && employee.status === 'completed';
                  const isPast = statusOrder.indexOf(key) < statusOrder.indexOf(employee.status);

                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          isActive
                            ? 'bg-[#0b3d91]'
                            : isCompleted || isPast
                            ? 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isActive
                            ? 'font-semibold text-[#0b3d91]'
                            : isCompleted || isPast
                            ? 'text-muted-foreground'
                            : 'text-muted-foreground/60'
                        }`}
                      >
                        {value.label}
                      </span>
                      {isActive && (
                        <Badge className="ml-auto bg-[#0b3d91]/10 text-[#0b3d91] hover:bg-[#0b3d91]/20 border-0">
                          Current
                        </Badge>
                      )}
                      {(isCompleted || isPast) && !isActive && (
                        <span className="ml-auto text-xs text-emerald-600">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* HR Tasks Card */}
          <Card className="border-[#0b3d91]/5 bg-white/80 backdrop-blur-sm shadow-lg shadow-[#0b3d91]/5 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-[#0b3d91]">
                <span>HR Tasks</span>
                {bankAccountTask && isBankAccountPending && (
                  <Button
                    size="sm"
                    onClick={() => setDialogOpen(true)}
                    className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
                  >
                    <Banknote className="mr-2 h-4 w-4" />
                    Add Bank Account
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hrTaskList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No HR tasks.</p>
              ) : (
                <div className="space-y-3">
                  {hrTaskList.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-xl border border-[#0b3d91]/5 bg-[#f8faff] p-3 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : task.status === 'in_progress' ? (
                          <Clock className="h-5 w-5 text-[#0b3d91]" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{task.taskType.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          task.status === 'completed'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : task.status === 'in_progress'
                            ? 'border-[#0b3d91]/20 bg-[#f0f4ff] text-[#0b3d91]'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }
                      >
                        {task.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Bank Account Dialog - Themed */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15 p-0 gap-0">
          <div className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] px-6 py-5 rounded-t-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-xl font-bold">Add Bank Account</DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Enter bank account details for {employee.firstName} {employee.lastName}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 space-y-4 bg-white rounded-b-2xl">
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-sm font-medium">Bank Name</Label>
              <Input
                id="bankName"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                placeholder="e.g. HDFC Bank"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-sm font-medium">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="1234567890"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc" className="text-sm font-medium">IFSC Code</Label>
              <Input
                id="ifsc"
                value={bankDetails.ifsc}
                onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                placeholder="HDFC0001234"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch" className="text-sm font-medium">Branch</Label>
              <Input
                id="branch"
                value={bankDetails.branch}
                onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                placeholder="e.g. Bangalore Main"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5">
              Cancel
            </Button>
            <Button
              onClick={handleAddBankAccount}
              disabled={!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifsc}
              className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
            >
              Save & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}