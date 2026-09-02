import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useBackgroundVerifications } from '@/features/hrms/onboarding/hooks/useDocumentUpload'; 
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// We need to add a hook for background verifications – we'll define it later.
// For now we'll use the service directly.
import { onboardingService } from '@/features/hrms/onboarding/services/onboardingService';
import { useQuery } from '@tanstack/react-query';

export default function BackgroundVerification() {
  const { data: verifications, isLoading, isError, refetch } = useQuery({
    queryKey: ['backgroundVerifications'],
    queryFn: () => onboardingService.getBackgroundVerifications(),
  });

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const list = verifications || [];

  return (
    <PageContainer>
      <PageHeader
        title="Background Verification"
        description="Conduct background checks for new employees"
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Verified By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No background verifications.
                </TableCell>
              </TableRow>
            ) : (
              list.map((bg) => (
                <TableRow key={bg.id}>
                  <TableCell className="font-medium">{bg.employeeName}</TableCell>
                  <TableCell>{bg.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        bg.status === 'cleared'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : bg.status === 'failed'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : bg.status === 'in_progress'
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }
                    >
                      {bg.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(bg.submittedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{bg.completedDate ? new Date(bg.completedDate).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>{bg.verifiedBy || '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}