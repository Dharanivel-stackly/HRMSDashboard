// src/pages/hrms/recruitment/Evaluation.tsx
import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { CandidateList } from '@/features/hrms/recruitment/components/CandidateList'
import { mockCandidates } from '@/features/hrms/recruitment/mock/recruitment.mock'
import { useNavigate } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Evaluation() {
  const navigate = useNavigate()
  const [candidates] = useState(
    mockCandidates.filter(c => c.status === 'interviewed' || c.status === 'evaluated')
  )

  return (
    <PageContainer>
      <PageHeader
        title="Evaluation"
        description="Evaluate candidate performance in interviews"
        actions={
          <Button variant="outline" size="sm">
            <ClipboardList className="mr-2 h-4 w-4" />
            Evaluation Form
          </Button>
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