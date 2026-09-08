import { useState } from 'react';
import { Download } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { useDocuments, useVerifyDocument } from '@/features/hrms/onboarding/hooks/useDocumentUpload';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Document } from '@/features/hrms/onboarding/types/onboarding.types';

export default function DocumentVerification() {
  const { data: documents, isLoading, isError, refetch } = useDocuments();
  const { mutate: verify, isPending } = useVerifyDocument();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'verified' | 'rejected'>('verified');
  const [comments, setComments] = useState('');

  const pendingDocs = documents?.filter((d) => d.status === 'uploaded' || d.status === 'pending') || [];

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

  const handleVerify = () => {
    if (!selectedDocId) return;
    verify(
      { documentId: selectedDocId, status: verifyStatus, comments },
      {
        onSuccess: () => {
          setDialogOpen(false);
          refetch();
          setSelectedDocId(null);
          setComments('');
        },
      }
    );
  };

  if (isLoading) return <LoadingState variant="page" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Document Verification"
        description="Verify employee documents for compliance"
      />

      <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-[#0b3d91]/5 overflow-hidden transition-all hover:shadow-[#0b3d91]/10">
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
            {pendingDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No documents pending verification.
                </TableCell>
              </TableRow>
            ) : (
              pendingDocs.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-[#f0f4ff]/40 transition-colors">
                  <TableCell className="font-medium">{doc.documentName}</TableCell>
                  <TableCell>{doc.employeeName}</TableCell>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell>{new Date(doc.uploadedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(doc)}
                        aria-label={`Download ${doc.documentName}`}
                        className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#f0f4ff]"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedDocId(doc.id);
                          setDialogOpen(true);
                        }}
                        className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-sm shadow-[#0b3d91]/20"
                      >
                        Verify
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Verify Dialog - Themed */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15 p-0 gap-0">
          <div className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] px-6 py-5 rounded-t-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-xl font-bold">Verify Document</DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Approve or reject this document.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 space-y-4 bg-white rounded-b-2xl">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Verification Result</label>
              <Select value={verifyStatus} onValueChange={(v) => setVerifyStatus(v as 'verified' | 'rejected')}>
                <SelectTrigger className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Comments</label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Optional feedback"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5">
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={isPending} className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20">
              {isPending ? 'Submitting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}