import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { OfferLetterPreview } from '@/features/hrms/recruitment/components/OfferLetterPreview'
import { mockCandidates, mockOffers } from '@/features/hrms/recruitment/mock/recruitment.mock'
import { useNavigate } from 'react-router-dom'
import { Plus, Send, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Candidate, Offer } from '@/features/hrms/recruitment/types/recruitment.types'
import { cn } from '@/lib/utils/cn'

export default function OfferGeneration() {
  const navigate = useNavigate()
  const [offers, setOffers] = useState<Offer[]>(mockOffers)

  const [showCandidateDialog, setShowCandidateDialog] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [flippedCandidateId, setFlippedCandidateId] = useState<string | null>(null)
  const [showOfferDialog, setShowOfferDialog] = useState(false)

  const [offerForm, setOfferForm] = useState({
    salary: 0,
    benefits: '',
    joiningDate: '',
    notes: '',
  })

  const eligibleCandidates = mockCandidates.filter(
    (c) => c.status === 'interviewed' || c.status === 'evaluated' || c.status === 'selected'
  )

  const getInitials = (c: Candidate) => `${c.firstName.charAt(0)}${c.lastName.charAt(0)}`

  const handleNewOffer = () => {
    setShowCandidateDialog(true)
    setFlippedCandidateId(null)
    setSelectedCandidate(null)
  }

  const handleCardClick = (candidate: Candidate) => {
    if (flippedCandidateId === candidate.id) {
      return
    }
    setFlippedCandidateId(candidate.id)
    setSelectedCandidate(candidate)
  }

  const handleSendOfferClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setOfferForm({
      salary: candidate.salaryMin ? candidate.salaryMin : 1200000,
      benefits: 'Health Insurance, Performance Bonus, Flexible Hours',
      joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: '',
    })
    setShowOfferDialog(true)
  }

  const handleOfferSubmit = () => {
    if (!selectedCandidate) return

    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      candidateId: selectedCandidate.id,
      candidateName: `${selectedCandidate.firstName} ${selectedCandidate.lastName}`,
      position: selectedCandidate.position,
      department: selectedCandidate.department,
      status: 'draft',
      offerDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      joiningDate: offerForm.joiningDate,
      salary: offerForm.salary,
      benefits: offerForm.benefits.split(',').map((b) => b.trim()),
      notes: offerForm.notes,
      sentDate: undefined,
      acceptedDate: undefined,
      declinedReason: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockOffers.unshift(newOffer)
    setOffers([newOffer, ...offers])

    setShowOfferDialog(false)
    setShowCandidateDialog(false)
    setFlippedCandidateId(null)
    setSelectedCandidate(null)

    console.log('Offer sent to candidate:', selectedCandidate.email)
  }

  const handleSendOffer = (offerId: string) => {
    console.log('Send offer', offerId)
    const updated = offers.map((o) =>
      o.id === offerId ? { ...o, status: 'sent' as const, sentDate: new Date().toISOString().slice(0, 10) } : o
    )
    setOffers(updated)
    const idx = mockOffers.findIndex((o) => o.id === offerId)
    if (idx !== -1) {
      mockOffers[idx] = { ...mockOffers[idx], status: 'sent', sentDate: new Date().toISOString().slice(0, 10) }
    }
  }

    const handleAcceptOffer = (offerId: string) => {
    const updated = offers.map((o) =>
      o.id === offerId ? { ...o, status: 'accepted' as const, acceptedDate: new Date().toISOString().slice(0, 10) } : o
    )
    setOffers(updated)
    const idx = mockOffers.findIndex((o) => o.id === offerId)
    if (idx !== -1) {
      mockOffers[idx] = { ...mockOffers[idx], status: 'accepted', acceptedDate: new Date().toISOString().slice(0, 10) }
    }
  }
  return (
    <PageContainer>
      <PageHeader
        title="Offer Generation"
        description="Generate and send offer letters to selected candidates"
        actions={
          <Button size="sm" onClick={handleNewOffer}>
            <Plus className="mr-2 h-4 w-4" />
            New Offer
          </Button>
        }
      />

      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-12 text-center">
            <p className="text-muted-foreground">No offers generated yet.</p>
          </div>
        ) : (
          offers.map((offer) => (
            <OfferLetterPreview
              key={offer.id}
              offer={offer}
              onDownload={() => console.log('Download offer', offer.id)}
              onSend={() => handleSendOffer(offer.id)}
              onAccept={() => handleAcceptOffer(offer.id)}
            />
          ))
        )}
      </div>

      <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Candidate for Offer</DialogTitle>
            <DialogDescription>
              Choose a candidate who has completed the interview process.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {eligibleCandidates.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No eligible candidates found. Candidates must be in "Interviewed", "Evaluated", or "Selected" status.
              </div>
            ) : (
              eligibleCandidates.map((candidate) => {
                const isFlipped = flippedCandidateId === candidate.id
                return (
                  <div
                    key={candidate.id}
                    className="relative h-48 w-full cursor-pointer perspective"
                    onClick={() => handleCardClick(candidate)}
                  >
                    <div
                      className={cn(
                        'relative h-full w-full transition-transform duration-500 transform-style-3d',
                        isFlipped && 'rotate-y-180'
                      )}
                    >
                      <div className="absolute inset-0 backface-hidden">
                        <Card className="ui-card-elevated h-full border border-border/60 transition-shadow hover:shadow-md">
                          <CardContent className="flex h-full flex-col items-center justify-center p-4">
                            <Avatar className="h-12 w-12 border border-border">
                              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                                {getInitials(candidate)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="mt-2 font-semibold text-foreground">
                              {candidate.firstName} {candidate.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{candidate.position}</p>
                            <Badge variant="outline" className="mt-1 border-sky-200 bg-sky-50 text-sky-700">
                              {candidate.status}
                            </Badge>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="absolute inset-0 backface-hidden rotate-y-180">
                        <Card className="ui-card-elevated flex h-full flex-col items-center justify-center border border-border/60 bg-card p-4">
                          <p className="text-sm font-medium text-foreground">Ready to send offer?</p>
                          <Button
                            className="mt-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSendOfferClick(candidate)
                            }}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Offer Letter
                          </Button>
                        </Card>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCandidateDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Offer Letter</DialogTitle>
            <DialogDescription>
              Review and send offer to {selectedCandidate?.firstName} {selectedCandidate?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidate-name">Candidate</Label>
                  <div className="mt-1 font-medium">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </div>
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <div className="mt-1 font-medium">{selectedCandidate.position}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Annual CTC (₹)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={offerForm.salary}
                  onChange={(e) => setOfferForm({ ...offerForm, salary: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (comma separated)</Label>
                <Input
                  id="benefits"
                  value={offerForm.benefits}
                  onChange={(e) => setOfferForm({ ...offerForm, benefits: e.target.value })}
                  placeholder="e.g. Health Insurance, Performance Bonus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={offerForm.joiningDate}
                  onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={offerForm.notes}
                  onChange={(e) => setOfferForm({ ...offerForm, notes: e.target.value })}
                  placeholder="Additional notes"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOfferSubmit}>
              <Send className="mr-2 h-4 w-4" />
              Send Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        .perspective {
          perspective: 800px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </PageContainer>
  )
}