// src/pages/hrms/recruitment/Shortlist.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { CalendarPlus, UserCheck, Mail, Phone, Briefcase, GraduationCap, Star, MapPin, CalendarDays, Building, Award, ExternalLink, Clock, XCircle, MessageCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { CandidateList } from '@/features/hrms/recruitment/components/CandidateList'
import { mockCandidates } from '@/features/hrms/recruitment/mock/recruitment.mock'
import { useUpdateCandidateStatus } from '@/features/hrms/recruitment/hooks/useCandidates'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Candidate } from '@/features/hrms/recruitment/types/recruitment.types'
import {
  CANDIDATE_STATUS_LABELS,
  CANDIDATE_STATUS_STYLES,
  INTERVIEW_TYPE_LABELS,
} from '@/features/hrms/recruitment/constants/recruitment.constants'

export default function Shortlist() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [candidates] = useState(
    mockCandidates.filter((c) => c.status === 'shortlisted')
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)

  const { mutate: updateStatus } = useUpdateCandidateStatus()

  // --- Handlers ---
  const handleView = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setViewDialogOpen(true)
  }

  const handleContact = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setContactDialogOpen(true)
  }

  const handleReject = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setRejectDialogOpen(true)
  }

  const confirmReject = () => {
    if (!selectedCandidate) return
    updateStatus(
      { id: selectedCandidate.id, status: 'rejected' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['candidates'] })
          setRejectDialogOpen(false)
          setSelectedCandidate(null)
        },
      }
    )
  }

  const handleMoveToInterview = () => {
    if (selectedIds.length === 0) return
    const promises = selectedIds.map((id) =>
      updateStatus(
        { id, status: 'interview_scheduled' },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] })
          },
        }
      )
    )
    Promise.all(promises).then(() => {
      navigate('/hrms/recruitment/interviews')
    })
  }

  const handleScheduleInterview = () => {
    if (selectedIds.length === 0) return
    const first = candidates.find((c) => c.id === selectedIds[0])
    if (first) {
      setSelectedCandidate(first)
      setScheduleDialogOpen(true)
    }
  }

  const getInitials = (c: Candidate) =>
    `${c.firstName.charAt(0)}${c.lastName.charAt(0)}`

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'new':
        return <Clock className="h-3.5 w-3.5 text-emerald-600" />
      case 'reviewing':
      case 'in review':
        return <Clock className="h-3.5 w-3.5 text-amber-600" />
      case 'interviewed':
        return <MessageCircle className="h-3.5 w-3.5 text-blue-600" />
      case 'offered':
        return <Award className="h-3.5 w-3.5 text-indigo-600" />
      case 'rejected':
        return <XCircle className="h-3.5 w-3.5 text-red-600" />
      default:
        return null
    }
  }

  // --- Schedule Interview State ---
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    type: 'panel',
    duration: 60,
    panel: '',
    location: '',
    notes: '',
  })

  const handleScheduleSubmit = () => {
    console.log('Scheduling interview for:', selectedCandidate?.id, scheduleData)
    setScheduleDialogOpen(false)
    navigate('/hrms/recruitment/interviews')
  }

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Shortlist"
        description="Shortlisted candidates for interview rounds"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveToInterview}
              disabled={selectedIds.length === 0}
              className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5 hover:border-[#0b3d91]/40"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Move to Interview ({selectedIds.length})
            </Button>
            <Button
              size="sm"
              onClick={handleScheduleInterview}
              disabled={selectedIds.length === 0}
              className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
          </div>
        }
      />

      <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-[#0b3d91]/5 border border-white/50 p-1">
        <CandidateList
          candidates={candidates}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onView={handleView}
          onEdit={(c) => console.log('Edit candidate', c.id)}
          onContact={handleContact}
          onReject={handleReject}
          onStatusChange={(c, status) => console.log('Status change', c.id, status)}
        />
      </div>

      {/* ========== VIEW CANDIDATE DIALOG – MATCHES THEME ========== */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl p-0 gap-0 rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15">
          {/* ——— Header with gradient ——— */}
          <div className="relative bg-gradient-to-r from-[#0b3d91] via-[#1a5bb5] to-[#2d7ad9] px-8 pt-8 pb-20 rounded-t-2xl">
            <div className="absolute right-4 top-4 flex items-center gap-2">
              {selectedCandidate && (
                <Badge
                  className={`border font-medium ${getStatusColor(selectedCandidate.status)} flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider shadow-sm`}
                >
                  {getStatusIcon(selectedCandidate.status)}
                  {CANDIDATE_STATUS_LABELS[selectedCandidate.status] || selectedCandidate.status}
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
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-white/5 blur-xl" />
          </div>

          {/* ——— Body ——— */}
          <div className="px-8 pb-8 pt-6 space-y-6 bg-white rounded-b-2xl">
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

            {/* Education */}
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

            {/* Skills */}
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

            {/* Notes */}
            {selectedCandidate?.notes && (
              <div className="rounded-xl bg-amber-50/60 border border-amber-200/40 p-4 text-sm">
                <p className="text-xs font-medium text-amber-700/70 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-foreground/80">{selectedCandidate.notes}</p>
              </div>
            )}

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
                onClick={() => {
                  setViewDialogOpen(false)
                  handleContact(selectedCandidate!)
                }}
                className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========== CONTACT DIALOG – THEMED ========== */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15 p-0 gap-0">
          <div className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] px-6 py-5 rounded-t-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-xl font-bold">Contact Candidate</DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Reach out to {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 space-y-4 bg-white rounded-b-2xl">
            {selectedCandidate && (
              <>
                <div className="flex items-center gap-4 rounded-xl border border-[#0b3d91]/5 bg-[#f8faff] p-4 transition-all hover:border-[#0b3d91]/15">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#0b3d91]/10 to-[#0b3d91]/5 text-[#0b3d91] shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</p>
                    <a href={`mailto:${selectedCandidate.email}`} className="font-medium text-[#0b3d91] hover:underline">
                      {selectedCandidate.email}
                    </a>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground/40" />
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-[#0b3d91]/5 bg-[#f8faff] p-4 transition-all hover:border-[#0b3d91]/15">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-700 shadow-sm">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone</p>
                    <a href={`tel:${selectedCandidate.phone}`} className="font-medium text-emerald-700 hover:underline">
                      {selectedCandidate.phone}
                    </a>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground/40" />
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-[#0b3d91]/5 bg-[#f8faff] p-4 transition-all hover:border-[#0b3d91]/15">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 shadow-sm">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Position</p>
                    <p className="font-medium text-foreground">{selectedCandidate.position}</p>
                  </div>
                </div>
              </>
            )}
            <DialogFooter className="gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setContactDialogOpen(false)}
                className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5"
              >
                Close
              </Button>
              <Button
                onClick={() => setContactDialogOpen(false)}
                className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========== REJECT DIALOG – THEMED ========== */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-red-200/30 shadow-2xl shadow-red-500/10 p-0 gap-0">
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 rounded-t-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Reject Candidate
              </DialogTitle>
              <DialogDescription className="text-white/75 text-sm">
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 space-y-4 bg-white rounded-b-2xl">
            <div className="flex items-center gap-4 rounded-xl border border-red-100 bg-red-50/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{selectedCandidate?.position}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject <span className="font-semibold text-foreground">{selectedCandidate?.firstName} {selectedCandidate?.lastName}</span>?
              This will move the candidate to the rejected list.
            </p>
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="border-gray-200 hover:bg-gray-50">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmReject}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-md shadow-red-500/25"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Confirm Reject
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========== SCHEDULE INTERVIEW DIALOG – THEMED ========== */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15 p-0 gap-0">
          <div className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] px-6 py-5 rounded-t-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                <CalendarPlus className="h-5 w-5" />
                Schedule Interview
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Set up interview details for {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 space-y-4 bg-white rounded-b-2xl">
            {selectedCandidate && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date" className="text-sm font-medium">Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                      className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time" className="text-sm font-medium">Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleData.time}
                      onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                      className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Interview Type</Label>
                  <Select
                    value={scheduleData.type}
                    onValueChange={(v) => setScheduleData({ ...scheduleData, type: v })}
                  >
                    <SelectTrigger className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={scheduleData.duration}
                    onChange={(e) => setScheduleData({ ...scheduleData, duration: Number(e.target.value) })}
                    className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panel" className="text-sm font-medium">Panel Members</Label>
                  <Input
                    id="panel"
                    placeholder="e.g. Priya Sharma, Arjun Nair"
                    value={scheduleData.panel}
                    onChange={(e) => setScheduleData({ ...scheduleData, panel: e.target.value })}
                    className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location / Meeting Link</Label>
                  <Input
                    id="location"
                    placeholder="Zoom link or office room"
                    value={scheduleData.location}
                    onChange={(e) => setScheduleData({ ...scheduleData, location: e.target.value })}
                    className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional instructions..."
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                    className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                  />
                </div>
              </div>
            )}
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" onClick={() => setScheduleDialogOpen(false)} className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5">
                Cancel
              </Button>
              <Button onClick={handleScheduleSubmit} className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}