// src/features/hrms/recruitment/components/OfferLetterPreview.tsx
import { FileText, Download, Mail, Calendar, DollarSign, Briefcase, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Offer } from '../types/recruitment.types'
import { OFFER_STATUS_LABELS } from '../constants/recruitment.constants'

interface OfferLetterPreviewProps {
  offer: Offer
  onDownload?: () => void
  onSend?: () => void
  onAccept?: () => void
}

export function OfferLetterPreview({ offer, onDownload, onSend, onAccept }: OfferLetterPreviewProps) {
  const status = offer.status

  return (
    <Card className="ui-card-elevated border border-border/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-[#0b3d91]">
          Offer Letter
        </CardTitle>
        <div className="flex gap-2">
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
          {onSend && status === 'draft' && (
            <Button size="sm" onClick={onSend}>
              <Mail className="mr-2 h-4 w-4" />
              Send Offer
            </Button>
          )}
          {onAccept && status === 'sent' && (
            <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={onAccept}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept Offer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-brand-soft/60 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">Offer for {offer.candidateName}</p>
            <p className="text-sm text-muted-foreground">
              {offer.position} • {offer.department}
            </p>
          </div>
          <div className="ml-auto">
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
              status === 'accepted' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
              status === 'sent' ? 'border-sky-200 bg-sky-50 text-sky-700' :
              status === 'draft' ? 'border-slate-200 bg-slate-50 text-slate-600' :
              status === 'declined' ? 'border-red-200 bg-red-50 text-red-700' :
              'border-slate-200 bg-slate-100 text-slate-500'
            }`}>
              {OFFER_STATUS_LABELS[status]}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Offer Date</span>
            </div>
            <p className="mt-1 font-medium">{offer.offerDate}</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joining Date</span>
            </div>
            <p className="mt-1 font-medium">{offer.joiningDate}</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Annual CTC</span>
            </div>
            <p className="mt-1 font-medium">₹{offer.salary.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>Benefits</span>
            </div>
            <p className="mt-1 text-sm font-medium">{offer.benefits.join(', ')}</p>
          </div>
        </div>

        {offer.notes && (
          <div className="rounded-lg border border-border/60 p-3 text-sm">
            <span className="text-muted-foreground">Notes:</span> {offer.notes}
          </div>
        )}

        <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          {status === 'sent' && 'Offer sent to candidate. Awaiting response.'}
          {status === 'accepted' && '✅ Offer accepted by candidate.'}
          {status === 'declined' && '❌ Offer declined by candidate.'}
          {status === 'draft' && 'Draft offer - ready to send.'}
          {status === 'expired' && '⏰ Offer has expired.'}
        </div>
      </CardContent>
    </Card>
  )
}