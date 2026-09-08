// src/pages/hrms/recruitment/OfferGeneration.tsx
import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { OfferLetterPreview } from '@/features/hrms/recruitment/components/OfferLetterPreview'
import { mockCandidates, mockOffers } from '@/features/hrms/recruitment/mock/recruitment.mock'
import { useNavigate } from 'react-router-dom'
import { Plus, Send, X, Mail, Phone, Briefcase, CalendarDays, Building, Award, ExternalLink } from 'lucide-react'
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
    if (flippedCandidateId === candidate.id) return
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'sent':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'declined':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200'
    }
  }

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Offer Generation"
        description="Generate and send offer letters to selected candidates"
        actions={
          <Button
            size="sm"
            onClick={handleNewOffer}
            className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Offer
          </Button>
        }
      />

      <div className="mt-6 space-y-4">
        {offers.length === 0 ? (
          <div className="rounded-xl border border-[#0b3d91]/5 bg-white/80 backdrop-blur-sm p-12 text-center shadow-lg shadow-[#0b3d91]/5">
            <p className="text-muted-foreground">No offers generated yet.</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-[#0b3d91]/5 border border-white/50 p-1">
              <OfferLetterPreview
                offer={offer}
                onDownload={() => console.log('Download offer', offer.id)}
                onSend={() => handleSendOffer(offer.id)}
                onAccept={() => handleAcceptOffer(offer.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* ========== SELECT CANDIDATE DIALOG – THEMED ========== */}
      <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl p-0 gap-0 rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15">
          <div className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] px-6 py-5 rounded-t-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-xl font-bold">Select Candidate for Offer</DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Choose a candidate who has completed the interview process.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 space-y-4 bg-white rounded-b-2xl">
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
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden">
                          <Card className="h-full border-[#0b3d91]/5 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow rounded-xl">
                            <CardContent className="flex h-full flex-col items-center justify-center p-4">
                              <Avatar className="h-14 w-14 border-2 border-[#0b3d91]/10">
                                <AvatarFallback className="bg-gradient-to-br from-[#0b3d91]/10 to-[#0b3d91]/5 text-base font-semibold text-[#0b3d91]">
                                  {getInitials(candidate)}
                                </AvatarFallback>
                              </Avatar>
                              <p className="mt-2 font-semibold text-foreground">
                                {candidate.firstName} {candidate.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">{candidate.position}</p>
                              <Badge
                                variant="outline"
                                className={`mt-1 border font-medium ${getStatusColor(candidate.status)}`}
                              >
                                {candidate.status}
                              </Badge>
                            </CardContent>
                          </Card>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180">
                          <Card className="flex h-full flex-col items-center justify-center border-[#0b3d91]/5 bg-gradient-to-br from-[#f0f4ff] to-white rounded-xl shadow-md">
                            <p className="text-sm font-medium text-[#0b3d91]">Ready to send offer?</p>
                            <Button
                              className="mt-3 bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
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
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCandidateDialog(false)} className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5">
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========== CREATE OFFER DIALOG – THEMED ========== */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15 p-0 gap-0">
          <div className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] px-6 py-5 rounded-t-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-xl font-bold">Create Offer Letter</DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Review and send offer to {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 space-y-4 bg-white rounded-b-2xl">
            {selectedCandidate && (
              <>
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#f8faff] border border-[#0b3d91]/5 p-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Candidate</p>
                    <p className="font-medium text-foreground">{selectedCandidate.firstName} {selectedCandidate.lastName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Position</p>
                    <p className="font-medium text-foreground">{selectedCandidate.position}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-sm font-medium">Annual CTC (₹)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={offerForm.salary}
                    onChange={(e) => setOfferForm({ ...offerForm, salary: Number(e.target.value) })}
                    className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits" className="text-sm font-medium">Benefits (comma separated)</Label>
                  <Input
                    id="benefits"
                    value={offerForm.benefits}
                    onChange={(e) => setOfferForm({ ...offerForm, benefits: e.target.value })}
                    placeholder="e.g. Health Insurance, Performance Bonus"
                    className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joiningDate" className="text-sm font-medium">Joining Date</Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    value={offerForm.joiningDate}
                    onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                    className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                  <Textarea
                    id="notes"
                    value={offerForm.notes}
                    onChange={(e) => setOfferForm({ ...offerForm, notes: e.target.value })}
                    placeholder="Additional notes"
                    className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                  />
                </div>
              </>
            )}
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowOfferDialog(false)} className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5">
                Cancel
              </Button>
              <Button onClick={handleOfferSubmit} className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20">
                <Send className="mr-2 h-4 w-4" />
                Send Offer
              </Button>
            </DialogFooter>
          </div>
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