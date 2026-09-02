import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useITTasks } from '@/features/hrms/onboarding/hooks/useDocumentUpload';
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

export default function ITTasks() {
  const { data: tasks, isLoading, isError, refetch } = useITTasks();
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
        title="IT Setup Tasks"
        description="Manage IT setup tasks for new employees"
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
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No IT tasks found.
                </TableCell>
              </TableRow>
            ) : (
              list.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.employeeName}</TableCell>
                  <TableCell>{task.taskType.replace(/_/g, ' ')}</TableCell>
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
                      {task.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(task.id, 'blocked')}
                          disabled={task.status === 'blocked'}
                          className="text-destructive"
                        >
                          Block
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