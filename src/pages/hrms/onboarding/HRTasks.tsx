import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useHRTasks } from '@/features/hrms/onboarding/hooks/useDocumentUpload';
import { useUpdateTaskStatus } from '@/features/hrms/onboarding/hooks/useChecklist';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function HRTasks() {
  const navigate = useNavigate();
  const { data: tasks, isLoading, isError, refetch } = useHRTasks();
  const { mutate: updateStatus, isPending } = useUpdateTaskStatus();

  const handleStatusUpdate = (taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'blocked') => {
    updateStatus(
      { taskId, status },
      { onSuccess: () => refetch() }
    );
  };

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const list = tasks || [];

  return (
    <PageContainer>
      <PageHeader
        title="HR Tasks"
        description="Manage HR tasks for employee onboarding"
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No HR tasks found.
                </TableCell>
              </TableRow>
            ) : (
              list.map((task) => (
                <TableRow
                  key={task.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/hrms/onboarding/employees/${task.employeeId}`)}
                >
                  <TableCell className="font-medium">{task.employeeName}</TableCell>
                  <TableCell>{task.taskType.replace(/_/g, ' ')}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        task.status === 'completed'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : task.status === 'in_progress'
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }
                    >
                      {task.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                          disabled={task.status === 'in_progress'}
                        >
                          Start
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(task.id, 'completed')}
                          disabled={task.status === 'completed'}
                        >
                          Complete
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
    </PageContainer>
  );
}