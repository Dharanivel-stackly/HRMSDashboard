// src/pages/hrms/recruitment/JobRequisition.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, MoreHorizontal, Calendar, MapPin, Building2, Briefcase, Users, DollarSign, FileText, ListChecks, CheckCircle, Clock } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { REQUISITION_STATUS_LABELS, REQUISITION_STATUS_STYLES, JOB_TYPE_LABELS, PRIORITY_LABELS } from '@/features/hrms/recruitment/constants/recruitment.constants';
import { usePermissions } from '@/hooks/usePermissions';
import { useRequisitions } from '@/features/hrms/recruitment/hooks/useRequisition';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { cn } from '@/lib/utils/cn';
import type { Requisition } from '@/features/hrms/recruitment/types/recruitment.types';

export default function JobRequisition() {
  const navigate = useNavigate();
  const { isRole } = usePermissions();
  const isAdmin = isRole('ADMIN') || isRole('SUPER_ADMIN');

  const { data, isLoading, isError, refetch } = useRequisitions();
  const requisitions = data?.data || [];

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingRequisition, setViewingRequisition] = useState<Requisition | null>(null);

  const handleView = (req: Requisition) => {
    setViewingRequisition(req);
    setViewDialogOpen(true);
  };

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

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
                        <DropdownMenuItem onClick={() => handleView(req)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
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

      {/* View Dialog for Requisition - Enhanced with colorful cards & left borders */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl p-0 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-10 duration-300">
          {viewingRequisition && (
            <div className="flex flex-col">
              {/* Header with multi-color gradient */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-5 animate-in slide-in-from-top-5 duration-500">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-white/80" />
                        {viewingRequisition.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-sky-300 text-sky-300"
                      >
                        {viewingRequisition.requisitionId}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/80">
                      <Building2 className="h-4 w-4" />
                      <span>{viewingRequisition.department}</span>
                      <span className="text-white/40">•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{viewingRequisition.location}</span>
                      <span className="text-white/40">•</span>
                      <Calendar className="h-4 w-4" />
                      <span>Closing: {viewingRequisition.closingDate}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-2 px-3 py-1 text-sm font-semibold shadow-lg',
                      viewingRequisition.status === 'approved' ? 'border-emerald-300 bg-emerald-100/20 text-emerald-300' :
                      viewingRequisition.status === 'pending_approval' ? 'border-amber-300 bg-amber-100/20 text-amber-300' :
                      viewingRequisition.status === 'rejected' ? 'border-red-300 bg-red-100/20 text-red-300' :
                      'border-slate-300 bg-slate-100/20 text-slate-300'
                    )}
                  >
                    {REQUISITION_STATUS_LABELS[viewingRequisition.status]}
                  </Badge>
                </div>
              </div>

              {/* Content with staggered animations */}
              <div className="space-y-5 px-6 py-5">
                {/* Metadata grid with colorful cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 p-4 border border-sky-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-100">
                    <p className="text-xs font-medium uppercase tracking-wider text-sky-600">Job Type</p>
                    <p className="mt-1 font-semibold text-slate-800">{JOB_TYPE_LABELS[viewingRequisition.jobType]}</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 p-4 border border-amber-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-150">
                    <p className="text-xs font-medium uppercase tracking-wider text-amber-600">Priority</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'mt-1 font-semibold',
                        viewingRequisition.priority === 'urgent' ? 'border-red-400 bg-red-50 text-red-700' :
                        viewingRequisition.priority === 'high' ? 'border-orange-400 bg-orange-50 text-orange-700' :
                        viewingRequisition.priority === 'medium' ? 'border-amber-400 bg-amber-50 text-amber-700' :
                        'border-slate-300 bg-slate-50 text-slate-600'
                      )}
                    >
                      {PRIORITY_LABELS[viewingRequisition.priority]}
                    </Badge>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 p-4 border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-200">
                    <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">Positions</p>
                    <p className="mt-1 font-semibold text-slate-800">{viewingRequisition.filledPositions} / {viewingRequisition.positions} filled</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 p-4 border border-purple-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-250">
                    <p className="text-xs font-medium uppercase tracking-wider text-purple-600">Salary Range</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {viewingRequisition.salaryMin && viewingRequisition.salaryMax
                        ? `₹${viewingRequisition.salaryMin.toLocaleString()} - ₹${viewingRequisition.salaryMax.toLocaleString()}`
                        : 'Not specified'}
                    </p>
                  </div>
                  {viewingRequisition.approvedBy && (
                    <div className="col-span-2 rounded-lg bg-gradient-to-br from-slate-50 to-gray-50 p-4 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-300">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Approved By</p>
                      <p className="mt-1 font-semibold text-slate-800">{viewingRequisition.approvedBy} on {viewingRequisition.approvalDate}</p>
                    </div>
                  )}
                </div>

                {/* Description with left border accent */}
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-300 delay-350">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Description
                  </h4>
                  <div className="rounded-lg border-l-4 border-blue-500 bg-white p-3 text-sm text-slate-700 shadow-sm">
                    {viewingRequisition.description}
                  </div>
                </div>

                {/* Requirements with left border accent */}
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-300 delay-400">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ListChecks className="h-4 w-4 text-amber-500" />
                    Requirements
                  </h4>
                  <ul className="list-disc space-y-1 rounded-lg border-l-4 border-amber-500 bg-white p-3 pl-6 text-sm text-slate-700 shadow-sm">
                    {viewingRequisition.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Qualifications with left border accent */}
                {viewingRequisition.qualifications && viewingRequisition.qualifications.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-5 duration-300 delay-450">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Preferred Qualifications
                    </h4>
                    <ul className="list-disc space-y-1 rounded-lg border-l-4 border-emerald-500 bg-white p-3 pl-6 text-sm text-slate-700 shadow-sm">
                      {viewingRequisition.qualifications.map((qual, i) => (
                        <li key={i}>{qual}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <DialogFooter className="border-t border-slate-100 px-6 py-4">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}