import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useAssetAllocations } from '@/features/hrms/onboarding/hooks/useDocumentUpload'; // we'll add later
import { AssetPicker } from '@/features/hrms/onboarding/components/AssetPicker';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Use service directly for now
import { onboardingService } from '@/features/hrms/onboarding/services/onboardingService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function AssetAllocation() {
  const queryClient = useQueryClient();
  const { data: assets, isLoading, isError, refetch } = useQuery({
    queryKey: ['assetAllocations'],
    queryFn: () => onboardingService.getAssetAllocations(),
  });

  const { mutate: allocate, isPending } = useMutation({
    mutationFn: (data: any) => onboardingService.allocateAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetAllocations'] });
    },
  });

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const list = assets || [];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Allocation"
        description="Allocate assets and equipment to employees"
      />

      <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
        <AssetPicker
          employeeId="ob-1" // Placeholder; in real app use selected employee
          onAllocate={allocate}
          isAllocating={isPending}
        />
      </div>

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No assets allocated.
                </TableCell>
              </TableRow>
            ) : (
              list.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.employeeName}</TableCell>
                  <TableCell>{asset.assetType}</TableCell>
                  <TableCell>{asset.assetTag}</TableCell>
                  <TableCell>{asset.serialNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        asset.status === 'allocated'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : asset.status === 'pending'
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }
                    >
                      {asset.status}
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