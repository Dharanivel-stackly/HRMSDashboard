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
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Offer Accepted"
        description="Track offer acceptance and onboarding status"
        actions={
          <Button
            size="sm"
            onClick={() => navigate(ROUTES.HRMS.ONBOARDING.DASHBOARD)}
            className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Initiate Onboarding
          </Button>
        }
      />

      <div className="mt-6 space-y-4">
        {offers.length === 0 ? (
          <div className="rounded-xl border border-[#0b3d91]/5 bg-white/80 backdrop-blur-sm p-12 text-center shadow-lg shadow-[#0b3d91]/5">
            <p className="text-muted-foreground">No accepted offers yet.</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-[#0b3d91]/5 border border-white/50 p-1">
              <OfferLetterPreview offer={offer} />
            </div>
          ))
        )}
      </div>
    </PageContainer>
  )
}