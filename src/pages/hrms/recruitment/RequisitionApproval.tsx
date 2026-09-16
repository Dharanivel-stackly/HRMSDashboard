// src/pages/hrms/recruitment/RequisitionApproval.tsx
import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ApprovalWorkflow } from '@/features/hrms/recruitment/components/ApprovalWorkflow'
import { mockApprovals } from '@/features/hrms/recruitment/mock/recruitment.mock'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function RequisitionApproval() {
  const [approvals] = useState(mockApprovals)

  const pending = approvals.filter(a => a.status === 'pending')
  const approved = approvals.filter(a => a.status === 'approved')
  const rejected = approvals.filter(a => a.status === 'rejected')

  const handleApprove = (id: string, comments?: string) => {
    console.log('Approve', id, comments)
  }

  const handleReject = (id: string, comments?: string) => {
    console.log('Reject', id, comments)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Requisition Approvals"
        description="Review and approve job requisitions"
      />

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <ApprovalWorkflow
            approvals={pending}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="approved">
          <ApprovalWorkflow approvals={approved} />
        </TabsContent>

        <TabsContent value="rejected">
          <ApprovalWorkflow approvals={rejected} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}