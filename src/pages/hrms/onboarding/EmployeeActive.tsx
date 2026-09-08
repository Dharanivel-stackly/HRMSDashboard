import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useOnboardingEmployees } from '@/features/hrms/onboarding/hooks/useOnboarding';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function EmployeeActive() {
  const { data, isLoading, isError, refetch } = useOnboardingEmployees({ status: 'completed' });

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const employees = data?.data || [];

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Active Employees"
        description="View active employees who completed onboarding"
      />

      <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-[#0b3d91]/5 overflow-hidden transition-all hover:shadow-[#0b3d91]/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f0f4ff] hover:bg-[#f0f4ff]/80">
              <TableHead className="text-[#0b3d91] font-semibold">Employee</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Department</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Designation</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Joining Date</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No active employees found.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-[#f0f4ff]/40 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-[#0b3d91]/10">
                        <AvatarFallback className="bg-gradient-to-br from-[#0b3d91]/10 to-[#0b3d91]/5 text-xs font-semibold text-[#0b3d91]">
                          {emp.firstName[0]}{emp.lastName[0]}
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
                  <TableCell>
                    <StatusBadge status="active" label="Active" />
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