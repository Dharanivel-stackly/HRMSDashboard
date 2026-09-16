import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { Progress } from '@/components/ui/progress';
import { useOnboardingEmployees } from '@/features/hrms/onboarding/hooks/useOnboarding';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

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
}

export default function OnboardingEmployees() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // FETCH VIA API
  const { data, isLoading, isError, refetch } = useOnboardingEmployees({ search });

  const getInitials = (e: { firstName: string; lastName: string }) =>
    `${e.firstName.charAt(0)}${e.lastName.charAt(0)}`;

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filtered = data?.data || [];

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Onboarding Employees"
        description="Track all employees going through onboarding"
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="w-64 pl-9 border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />
      <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-[#0b3d91]/5 overflow-hidden transition-all hover:shadow-[#0b3d91]/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f0f4ff] hover:bg-[#f0f4ff]/80">
              <TableHead className="text-[#0b3d91] font-semibold">Employee</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Department</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Designation</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Joining Date</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Progress</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No onboarding employees found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((emp) => {
                const info = statusMap[emp.status] || { label: emp.status, variant: 'pending' as const };
                return (
                  <TableRow
                    key={emp.id}
                    className="cursor-pointer hover:bg-[#f0f4ff]/40 transition-colors"
                    onClick={() => navigate(ROUTES.HRMS.ONBOARDING.PROFILE(emp.id))}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-[#0b3d91]/10">
                          <AvatarFallback className="bg-gradient-to-br from-[#0b3d91]/10 to-[#0b3d91]/5 text-xs font-semibold text-[#0b3d91]">
                            {getInitials(emp)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-muted-foreground">{emp.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.designation}</TableCell>
                    <TableCell>{emp.joiningDate}</TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={emp.progress} 
                          className="h-2 flex-1 [&>div]:bg-[#0b3d91]" 
                        />
                        <span className="text-xs font-medium">{emp.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={info.variant} label={info.label} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}