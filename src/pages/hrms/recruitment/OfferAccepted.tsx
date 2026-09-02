// src/pages/hrms/recruitment/OfferAccepted.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { OfferLetterPreview } from '@/features/hrms/recruitment/components/OfferLetterPreview'
import { mockOffers } from '@/features/hrms/recruitment/mock/recruitment.mock'
import { UserPlus } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export default function OfferAccepted() {
  const navigate = useNavigate()
  const [offers] = useState(
    mockOffers.filter(o => o.status === 'accepted')
  )

  return (
    <PageContainer>
      <PageHeader
        title="Offer Accepted"
        description="Track offer acceptance and onboarding status"
        actions={
          <Button size="sm" onClick={() => navigate(ROUTES.HRMS.ONBOARDING.DASHBOARD)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Initiate Onboarding
          </Button>
        }
      />

      {offers.length === 0 ? (
        <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-12 text-center">
          <p className="text-muted-foreground">No accepted offers yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <OfferLetterPreview key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}