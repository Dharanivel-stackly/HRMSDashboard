// src/pages/hrms/recruitment/AppliedCandidates.tsx
import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Star, Briefcase, CalendarDays, GraduationCap, Mail, Phone, MapPin, Building, Award, ExternalLink } from 'lucide-react'
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'new':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'reviewing':
      case 'in review':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'interviewed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'offered':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Applied Candidates"
        description="View all candidates who have applied"
        hideTitle={false}
        actions={
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5 hover:border-[#0b3d91]/40"
          >
            Back
          </Button>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {mockCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="group cursor-pointer border border-[#0b3d91]/5 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#0b3d91]/10 hover:border-[#0b3d91]/20 rounded-2xl overflow-hidden"
            onClick={() => handleCardClick(candidate)}
          >
            {/* Gradient accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#0b3d91] via-[#1a5bb5] to-[#2d7ad9]" />

            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 border-2 border-[#0b3d91]/10 shadow-sm group-hover:border-[#0b3d91]/30 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-[#0b3d91]/10 to-[#0b3d91]/5 text-base font-semibold text-[#0b3d91]">
                    {getInitials(candidate)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-[#0b3d91] transition-colors">
                        {candidate.firstName} {candidate.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {candidate.position}
                      </p>
                    </div>
                    {candidate.rating && (
                      <div className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-2 py-0.5 border border-amber-200/50">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-700">{candidate.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {candidate.department}
                    </span>
                    <span className="text-[#0b3d91]/20">•</span>
                    <span>{candidate.experienceYears}y exp</span>
                    <span className="text-[#0b3d91]/20">•</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {candidate.appliedDate}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`border font-medium ${getStatusColor(candidate.status)} flex items-center gap-1.5 px-3 py-0.5 text-xs`}
                    >
                      {CANDIDATE_STATUS_LABELS[candidate.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {candidate.source}
                    </span>
                  </div>

                  {candidate.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#e8eeff] px-2.5 py-0.5 text-xs font-medium text-[#0b3d91] border border-[#0b3d91]/5"
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

      {/* ========== VIEW CANDIDATE DIALOG – MATCHES IMAGE THEME ========== */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl p-0 gap-0 rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15">
          {/* ——— Header with gradient ——— */}
          <div className="relative bg-gradient-to-r from-[#0b3d91] via-[#1a5bb5] to-[#2d7ad9] px-8 pt-8 pb-20 rounded-t-2xl">
            <div className="absolute right-4 top-4 flex items-center gap-2">
              {selectedCandidate && (
                <Badge
                  className={`border font-medium ${getStatusColor(selectedCandidate.status)} flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider shadow-sm`}
                >
                  {CANDIDATE_STATUS_LABELS[selectedCandidate.status]}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-5">
              {selectedCandidate && (
                <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl ring-2 ring-white/50">
                  <AvatarFallback className="bg-white/20 text-3xl font-bold text-white backdrop-blur-sm">
                    {getInitials(selectedCandidate)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-1 text-white">
                <h3 className="text-2xl font-bold tracking-tight">
                  {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                </h3>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 opacity-70" />
                  {selectedCandidate?.position} • {selectedCandidate?.department}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/70">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {selectedCandidate?.email}
                  </span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {selectedCandidate?.phone}
                  </span>
                </div>
              </div>
            </div>
            {/* Decorative blur circles */}
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-white/5 blur-xl" />
          </div>

          {/* ——— Body ——— */}
          <div className="px-8 pb-8 pt-14 space-y-6 bg-white rounded-b-2xl">
            {/* Rating & quick info */}
            <div className="flex flex-wrap items-center justify-between gap-3 -mt-12">
              {selectedCandidate?.rating && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 border border-amber-200/60 shadow-sm">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-amber-700 text-lg">{selectedCandidate.rating}</span>
                  <span className="text-amber-600/60 text-xs">/ 5</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 rounded-full bg-[#f0f4ff] px-3 py-1 text-[#0b3d91]/80">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Applied {selectedCandidate?.appliedDate}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-[#f0f4ff] px-3 py-1 text-[#0b3d91]/80 capitalize">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedCandidate?.source}
                </span>
              </div>
            </div>

            {/* ——— Details list ——— */}
            <div className="rounded-xl bg-[#f8faff] border border-[#0b3d91]/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#0b3d91]" />
                  Experience
                </span>
                <span className="font-medium text-foreground">
                  {selectedCandidate?.experienceYears} years
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[#0b3d91]/5 pt-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building className="h-4 w-4 text-[#0b3d91]" />
                  Current Company
                </span>
                <span className="font-medium text-foreground">
                  {selectedCandidate?.currentCompany || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[#0b3d91]/5 pt-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#0b3d91]" />
                  Current Designation
                </span>
                <span className="font-medium text-foreground">
                  {selectedCandidate?.currentDesignation || '—'}
                </span>
              </div>
            </div>

            {/* ——— Education ——— */}
            {selectedCandidate?.education && selectedCandidate.education.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <GraduationCap className="h-4 w-4 text-[#0b3d91]" />
                  Education
                </h4>
                <div className="space-y-2.5">
                  {selectedCandidate.education.map((edu, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[#0b3d91]/5 bg-gradient-to-br from-white to-[#f8faff] p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <p className="font-semibold text-[#0b3d91]">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution} • {edu.year}
                      </p>
                      {edu.grade && (
                        <Badge
                          variant="outline"
                          className="mt-1 border-[#0b3d91]/10 bg-[#0b3d91]/5 text-[#0b3d91] text-[10px]"
                        >
                          Grade: {edu.grade}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ——— Skills ——— */}
            {selectedCandidate?.skills && selectedCandidate.skills.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-gradient-to-br from-[#e8eeff] to-[#d4e0ff] text-[#0b3d91] border-[#0b3d91]/10 font-medium px-3 py-1 text-xs shadow-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* ——— Notes ——— */}
            {selectedCandidate?.notes && (
              <div className="rounded-xl bg-amber-50/60 border border-amber-200/40 p-4 text-sm">
                <p className="text-xs font-medium text-amber-700/70 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-foreground/80">{selectedCandidate.notes}</p>
              </div>
            )}

            {/* ——— Contact info ——— */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#0b3d91]/5 bg-[#f8faff] p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b3d91]/10 text-[#0b3d91]">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{selectedCandidate?.email}</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-[#0b3d91]/10" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{selectedCandidate?.phone}</span>
              </div>
            </div>

            {/* ——— Action buttons ——— */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#0b3d91]/5">
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
                className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5"
              >
                Close
              </Button>
              <Button
                onClick={() => setViewDialogOpen(false)}
                className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}