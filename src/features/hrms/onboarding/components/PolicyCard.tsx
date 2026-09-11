// src/features/hrms/onboarding/components/PolicyCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PolicyAcceptance } from '../types/onboarding.types'

interface PolicyCardProps {
  policy: PolicyAcceptance
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
}

export function PolicyCard({ policy, onAccept, onDecline }: PolicyCardProps) {
  return (
    <Card className="ui-card-elevated border border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {policy.policyName} <span className="text-sm text-muted-foreground">v{policy.policyVersion}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={
              policy.status === 'accepted'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : policy.status === 'declined'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }
          >
            {policy.status}
          </Badge>
          <div className="flex gap-2">
            {policy.status === 'pending' && (
              <>
                <Button size="sm" onClick={() => onAccept?.(policy.id)}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDecline?.(policy.id)}>
                  Decline
                </Button>
              </>
            )}
            {policy.status === 'accepted' && policy.signedUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={policy.signedUrl} target="_blank" rel="noopener noreferrer">
                  View Signed
                </a>
              </Button>
            )}
          </div>
        </div>
        {policy.acceptedDate && (
          <p className="mt-2 text-xs text-muted-foreground">
            Accepted on {new Date(policy.acceptedDate).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}