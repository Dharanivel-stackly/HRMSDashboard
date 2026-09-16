import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useBackgroundVerifications } from '@/features/hrms/onboarding/hooks/useDocumentUpload';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// We'll use the service directly if the hook isn't defined yet.
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
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Background Verification"
        description="Conduct background checks for new employees"
      />

      <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-[#0b3d91]/5 overflow-hidden transition-all hover:shadow-[#0b3d91]/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f0f4ff] hover:bg-[#f0f4ff]/80">
              <TableHead className="text-[#0b3d91] font-semibold">Employee</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Type</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Status</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Submitted</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Completed</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Verified By</TableHead>
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
                <TableRow key={bg.id} className="hover:bg-[#f0f4ff]/40 transition-colors">
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