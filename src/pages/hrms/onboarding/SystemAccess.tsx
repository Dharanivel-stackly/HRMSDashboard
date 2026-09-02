import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useITTasks } from '@/features/hrms/onboarding/hooks/useDocumentUpload'; // We'll reuse
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// We'll add a hook for IT tasks in useChecklist.ts later, but for now use the service directly.
import { onboardingService } from '@/features/hrms/onboarding/services/onboardingService';
import { useQuery } from '@tanstack/react-query';

export default function SystemAccess() {
  const { data: itTasks, isLoading, isError, refetch } = useQuery({
    queryKey: ['itTasks'],
    queryFn: () => onboardingService.getITTasks(),
  });

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const tasks = itTasks || [];

  return (
    <PageContainer>
      <PageHeader
        title="System Access"
        description="Provision system access for new employees"
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No IT tasks found.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.employeeName}</TableCell>
                  <TableCell>{task.taskType.replace('_', ' ')}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        task.status === 'completed'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : task.status === 'in_progress'
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : task.status === 'blocked'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}