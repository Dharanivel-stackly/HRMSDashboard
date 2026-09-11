import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { usePolicyAcceptances, useAcceptPolicy } from '@/features/hrms/onboarding/hooks/useChecklist';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { PolicyCard } from '@/features/hrms/onboarding/components/PolicyCard';

export default function PolicyAcceptance() {
  const { data: policies, isLoading, isError, refetch } = usePolicyAcceptances();
  const { mutate: acceptPolicy } = useAcceptPolicy();

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const handleAccept = (policyId: string) => {
    acceptPolicy(
      { policyId, accepted: true },
      { onSuccess: () => refetch() }
    );
  };

  const handleDecline = (policyId: string) => {
    acceptPolicy(
      { policyId, accepted: false },
      { onSuccess: () => refetch() }
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Policy Acceptance"
        description="Track policy acknowledgments from employees"
      />

      <div className="space-y-4">
        {policies?.length === 0 ? (
          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-12 text-center">
            <p className="text-muted-foreground">No policies to accept.</p>
          </div>
        ) : (
          policies?.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))
        )}
      </div>
    </PageContainer>
  );
}