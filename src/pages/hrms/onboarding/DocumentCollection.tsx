import { useState } from 'react';
import { Download } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { DocumentUploadDropzone } from '@/features/hrms/onboarding/components/DocumentUploadDropzone';
import { useDocuments, useUploadDocument } from '@/features/hrms/onboarding/hooks/useDocumentUpload';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Document } from '@/features/hrms/onboarding/types/onboarding.types';

export default function DocumentCollection() {
  const [employeeIdFilter, setEmployeeIdFilter] = useState<string>('');
  const { data: documents, isLoading, isError, refetch } = useDocuments(employeeIdFilter || undefined);
  const { mutate: upload, isPending: isUploading } = useUploadDocument();

  const handleUpload = (formData: FormData) => {
    upload(formData, {
      onSuccess: () => refetch(),
    });
  };

  const handleDownload = (doc: Document) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      const content = `Document: ${doc.documentName}
Type: ${doc.documentType}
Employee: ${doc.employeeName}
Uploaded: ${doc.uploadedDate}
Status: ${doc.status}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.documentName || 'document'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const docs = documents || [];

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Document Collection"
        description="Collect and manage employee documents for onboarding"
      />

      <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-[#0b3d91]/5 p-6 transition-all hover:shadow-[#0b3d91]/10">
        <h3 className="text-base font-semibold text-[#0b3d91] mb-4">Upload New Document</h3>
        <DocumentUploadDropzone
          employeeId={employeeIdFilter || 'default-id'}
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-[#0b3d91]/5 overflow-hidden transition-all hover:shadow-[#0b3d91]/10">
        <div className="p-4 flex items-center gap-4 border-b border-[#0b3d91]/5">
          <span className="text-sm font-medium text-[#0b3d91]">Filter by Employee:</span>
          <Select value={employeeIdFilter} onValueChange={setEmployeeIdFilter}>
            <SelectTrigger className="w-[200px] border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20">
              <SelectValue placeholder="All employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="ob-1">Aisha Patel</SelectItem>
              <SelectItem value="ob-2">Rohan Kumar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f0f4ff] hover:bg-[#f0f4ff]/80">
              <TableHead className="text-[#0b3d91] font-semibold">Document</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Employee</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Type</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Uploaded</TableHead>
              <TableHead className="text-[#0b3d91] font-semibold">Status</TableHead>
              <TableHead className="text-right text-[#0b3d91] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No documents found.
                </TableCell>
              </TableRow>
            ) : (
              docs.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-[#f0f4ff]/40 transition-colors">
                  <TableCell className="font-medium">{doc.documentName}</TableCell>
                  <TableCell>{doc.employeeName}</TableCell>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell>{new Date(doc.uploadedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        doc.status === 'verified'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : doc.status === 'uploaded'
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : doc.status === 'rejected'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      aria-label={`Download ${doc.documentName}`}
                      className="text-[#0b3d91] hover:text-[#0b3d91]/80 hover:bg-[#f0f4ff]"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
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