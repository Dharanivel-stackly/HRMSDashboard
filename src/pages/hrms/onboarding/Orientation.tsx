import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useTasks } from '@/features/hrms/onboarding/hooks/useChecklist';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { ChecklistItem } from '@/features/hrms/onboarding/components/ChecklistItem';
import { useUpdateTaskStatus } from '@/features/hrms/onboarding/hooks/useChecklist';

export default function Orientation() {
  const { data: tasks, isLoading, isError, refetch } = useTasks();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const orientationTasks = tasks?.filter((t) => t.category === 'manager' || t.category === 'hr') || [];

  const handleToggle = (id: string, status: 'pending' | 'completed') => {
    updateStatus(
      { taskId: id, status },
      { onSuccess: () => refetch() }
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Orientation"
        description="Manage employee orientation sessions"
      />

      <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
        {orientationTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No orientation tasks found.</p>
        ) : (
          <div className="space-y-3">
            {orientationTasks.map((task) => (
              <ChecklistItem key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}