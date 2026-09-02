// src/pages/hrms/onboarding/Employees.tsx
import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { mockOnboardingEmployees } from '@/features/hrms/onboarding/mock/onboarding.mock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { Progress } from '@/components/ui/progress';

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
};

export default function OnboardingEmployees() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filtered] = useState(mockOnboardingEmployees);

  const getInitials = (e: { firstName: string; lastName: string }) =>
    `${e.firstName.charAt(0)}${e.lastName.charAt(0)}`;

  return (
    <PageContainer>
      <PageHeader
        title="Onboarding Employees"
        description="Track all employees going through onboarding"
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="w-64 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-soft/60 hover:bg-brand-soft/60">
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
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
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(ROUTES.HRMS.ONBOARDING.EMPLOYEE(emp.id))}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
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
                        <Progress value={emp.progress} className="h-2 flex-1" />
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