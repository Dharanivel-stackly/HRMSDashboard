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
      // Generate a text file with metadata
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
    <PageContainer>
      <PageHeader
        title="Document Verification"
        description="Verify employee documents for compliance"
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                <TableRow key={doc.id}>
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
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedDocId(doc.id);
                          setDialogOpen(true);
                        }}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Document</DialogTitle>
            <DialogDescription>Approve or reject this document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Verification Result</label>
              <Select value={verifyStatus} onValueChange={(v) => setVerifyStatus(v as 'verified' | 'rejected')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Optional feedback"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleVerify} disabled={isPending}>
              {isPending ? 'Submitting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}