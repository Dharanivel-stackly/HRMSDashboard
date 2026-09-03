import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { REQUISITION_STATUS_LABELS, REQUISITION_STATUS_STYLES, JOB_TYPE_LABELS, PRIORITY_LABELS } from '@/features/hrms/recruitment/constants/recruitment.constants';
import { usePermissions } from '@/hooks/usePermissions';
import { useRequisitions } from '@/features/hrms/recruitment/hooks/useRequisition';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

export default function JobRequisition() {
  const navigate = useNavigate();
  const { isRole } = usePermissions();
  const isAdmin = isRole('ADMIN') || isRole('SUPER_ADMIN');

  // FETCH VIA API
  const { data, isLoading, isError, refetch } = useRequisitions();
  const requisitions = data?.data || [];

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  // Keep identical return statement
  return (
    <PageContainer>
      <PageHeader
        title="Job Requisitions"
        description="Create and manage job requisitions"
        actions={
          isAdmin && (
            <Button onClick={() => navigate('/hrms/recruitment/requisitions/new')}>
              <Plus className="mr-2 h-4 w-4" />
              New Requisition
            </Button>
          )
        }
      />
      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-soft/60 hover:bg-brand-soft/60">
              <TableHead>Requisition ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Positions</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {requisitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No requisitions found.
                </TableCell>
              </TableRow>
            ) : (
              requisitions.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono text-xs font-semibold">{req.requisitionId}</TableCell>
                  <TableCell className="font-medium">{req.title}</TableCell>
                  <TableCell>{req.department}</TableCell>
                  <TableCell>{JOB_TYPE_LABELS[req.jobType]}</TableCell>
                  <TableCell>{req.filledPositions}/{req.positions}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={ req.priority === 'urgent' ? 'border-red-200 bg-red-50 text-red-700' : req.priority === 'high' ? 'border-orange-200 bg-orange-50 text-orange-700' : req.priority === 'medium' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-50 text-slate-600' }>
                      {PRIORITY_LABELS[req.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={REQUISITION_STATUS_STYLES[req.status]}>
                      {REQUISITION_STATUS_LABELS[req.status]}
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
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
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