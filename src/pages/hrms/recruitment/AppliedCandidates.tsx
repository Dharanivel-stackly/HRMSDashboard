// src/pages/hrms/recruitment/AppliedCandidates.tsx
import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Star, Briefcase, CalendarDays, GraduationCap, Mail, Phone } from 'lucide-react'
import { mockCandidates } from '@/features/hrms/recruitment/mock/recruitment.mock'
import {
  CANDIDATE_STATUS_LABELS,
  CANDIDATE_STATUS_STYLES,
} from '@/features/hrms/recruitment/constants/recruitment.constants'
import type { Candidate } from '@/features/hrms/recruitment/types/recruitment.types'

export default function AppliedCandidates() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const handleCardClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setViewDialogOpen(true)
  }

  const getInitials = (c: Candidate) => `${c.firstName.charAt(0)}${c.lastName.charAt(0)}`

  return (
    <PageContainer>
      <PageHeader
        title="Applied Candidates"
        description="View all candidates who have applied"
        hideTitle={false}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {mockCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="ui-card-elevated cursor-pointer border border-border/60 transition-shadow hover:shadow-md"
            onClick={() => handleCardClick(candidate)}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                    {getInitials(candidate)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {candidate.firstName} {candidate.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {candidate.position}
                      </p>
                    </div>
                    {candidate.rating && (
                      <div className="flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-semibold">{candidate.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{candidate.department}</span>
                    <span>•</span>
                    <span>{candidate.experienceYears}y exp</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {candidate.appliedDate}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="outline" className={CANDIDATE_STATUS_STYLES[candidate.status]}>
                      {CANDIDATE_STATUS_LABELS[candidate.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize">{candidate.source}</span>
                  </div>

                  {candidate.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{candidate.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Candidate Dialog - reused from CandidateApplication */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidate Profile</DialogTitle>
            <DialogDescription>Complete details of the selected candidate.</DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarFallback className="text-2xl font-semibold text-primary">
                    {getInitials(selectedCandidate)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-[#0b3d91]">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </h3>
                    <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                      {selectedCandidate.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {selectedCandidate.position} • {selectedCandidate.department}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.email} • {selectedCandidate.phone}
                  </p>
                </div>
                {selectedCandidate.rating && (
                  <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1 text-amber-700">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-semibold">{selectedCandidate.rating}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-brand-soft/60 p-4">
                <div>
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <p className="font-medium">{selectedCandidate.experienceYears} years</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Source</span>
                  <p className="font-medium capitalize">{selectedCandidate.source}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Applied</span>
                  <p className="font-medium">{selectedCandidate.appliedDate}</p>
                </div>
                {selectedCandidate.currentCompany && (
                  <div>
                    <span className="text-sm text-muted-foreground">Current Company</span>
                    <p className="font-medium">{selectedCandidate.currentCompany}</p>
                  </div>
                )}
                {selectedCandidate.currentDesignation && (
                  <div className="col-span-2">
                    <span className="text-sm text-muted-foreground">Current Designation</span>
                    <p className="font-medium">{selectedCandidate.currentDesignation}</p>
                  </div>
                )}
              </div>

              {selectedCandidate.education.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                    <GraduationCap className="h-4 w-4" /> Education
                  </h4>
                  <div className="space-y-2">
                    {selectedCandidate.education.map((edu, i) => (
                      <div key={i} className="rounded-lg border border-border/60 p-3">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                        {edu.grade && <p className="text-sm text-muted-foreground">Grade: {edu.grade}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCandidate.skills.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCandidate.notes && (
                <div className="rounded-lg border border-border/60 p-3 text-sm">
                  <span className="text-muted-foreground">Notes: </span>{selectedCandidate.notes}
                </div>
              )}

              {/* Contact info */}
              <div className="flex items-center gap-4 rounded-lg border border-border/60 p-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCandidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCandidate.phone}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}