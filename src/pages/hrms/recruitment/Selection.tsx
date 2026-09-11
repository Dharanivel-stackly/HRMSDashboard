// src/pages/hrms/recruitment/Selection.tsx
import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { CandidateList } from '@/features/hrms/recruitment/components/CandidateList'
import { mockCandidates } from '@/features/hrms/recruitment/mock/recruitment.mock'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, FileText } from 'lucide-react'

export default function Selection() {
  const navigate = useNavigate()
  const [candidates] = useState(
    mockCandidates.filter(c => c.status === 'selected' || c.status === 'offer_sent')
  )

  return (
    <PageContainer>
      <PageHeader
        title="Selection"
        description="Review and select final candidates for offers"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Generate Offer
            </Button>
            <Button size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Selection
            </Button>
          </div>
        }
      />

      <CandidateList
        candidates={candidates}
        onView={(c) => navigate(`/hrms/recruitment/candidates/${c.id}`)}
        onEdit={(c) => console.log('Edit candidate', c.id)}
      />
    </PageContainer>
  )
}