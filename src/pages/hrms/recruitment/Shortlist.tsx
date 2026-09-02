// src/pages/hrms/recruitment/Shortlist.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { CalendarPlus, UserCheck } from 'lucide-react'
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
import { Mail, Phone, Briefcase, GraduationCap, Star } from 'lucide-react'
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
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  )
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
          // Optionally remove from list or refetch
        },
      }
    )
  }

  const handleMoveToInterview = () => {
    if (selectedIds.length === 0) {
      // Optionally show a toast
      return
    }
    // Update status for all selected candidates
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
    // After updating, navigate to interview page
    Promise.all(promises).then(() => {
      navigate('/hrms/recruitment/interviews')
    })
  }

  const handleScheduleInterview = () => {
    if (selectedIds.length === 0) {
      // Optionally show a toast
      return
    }
    // For simplicity, we open the dialog with the first selected candidate
    const first = candidates.find((c) => c.id === selectedIds[0])
    if (first) {
      setSelectedCandidate(first)
      setScheduleDialogOpen(true)
    }
  }

  const getInitials = (c: Candidate) =>
    `${c.firstName.charAt(0)}${c.lastName.charAt(0)}`

  // --- Schedule Interview Dialog ---
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
    // In real app, call API to create interview
    console.log('Scheduling interview for:', selectedCandidate?.id, scheduleData)
    // Close dialog and navigate to interviews page
    setScheduleDialogOpen(false)
    navigate('/hrms/recruitment/interviews')
  }

  return (
    <PageContainer>
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
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Move to Interview ({selectedIds.length})
            </Button>
            <Button
              size="sm"
              onClick={handleScheduleInterview}
              disabled={selectedIds.length === 0}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
          </div>
        }
      />

      <CandidateList
        candidates={candidates}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onView={handleView}
        onEdit={(c) => console.log('Edit candidate', c.id)}
        onContact={handleContact}
        onReject={handleReject}
        onStatusChange={(c, status) =>
          console.log('Status change', c.id, status)
        }
      />

      {/* View Candidate Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidate Profile</DialogTitle>
            <DialogDescription>
              Complete details of the selected candidate.
            </DialogDescription>
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
                    <Badge
                      variant="outline"
                      className="border-sky-200 bg-sky-50 text-sky-700"
                    >
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
                    <span className="font-semibold">
                      {selectedCandidate.rating}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-brand-soft/60 p-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Experience
                  </span>
                  <p className="font-medium">
                    {selectedCandidate.experienceYears} years
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Source</span>
                  <p className="font-medium capitalize">
                    {selectedCandidate.source}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Applied</span>
                  <p className="font-medium">{selectedCandidate.appliedDate}</p>
                </div>
                {selectedCandidate.currentCompany && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Current Company
                    </span>
                    <p className="font-medium">
                      {selectedCandidate.currentCompany}
                    </p>
                  </div>
                )}
                {selectedCandidate.currentDesignation && (
                  <div className="col-span-2">
                    <span className="text-sm text-muted-foreground">
                      Current Designation
                    </span>
                    <p className="font-medium">
                      {selectedCandidate.currentDesignation}
                    </p>
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
                      <div
                        key={i}
                        className="rounded-lg border border-border/60 p-3"
                      >
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu.institution} • {edu.year}
                        </p>
                        {edu.grade && (
                          <p className="text-sm text-muted-foreground">
                            Grade: {edu.grade}
                          </p>
                        )}
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
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCandidate.notes && (
                <div className="rounded-lg border border-border/60 p-3 text-sm">
                  <span className="text-muted-foreground">Notes: </span>
                  {selectedCandidate.notes}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Candidate</DialogTitle>
            <DialogDescription>
              Contact details for the selected candidate.
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedCandidate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedCandidate.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{selectedCandidate.position}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject{' '}
              <span className="font-semibold text-foreground">
                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </span>
              ? This action will move the candidate to the rejected list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set up interview details for {selectedCandidate?.firstName}{' '}
              {selectedCandidate?.lastName}.
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schedule-date">Date</Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) =>
                      setScheduleData({ ...scheduleData, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Time</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleData.time}
                    onChange={(e) =>
                      setScheduleData({ ...scheduleData, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Select
                  value={scheduleData.type}
                  onValueChange={(v) =>
                    setScheduleData({ ...scheduleData, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INTERVIEW_TYPE_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={scheduleData.duration}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      duration: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panel">Panel Members</Label>
                <Input
                  id="panel"
                  placeholder="e.g. Priya Sharma, Arjun Nair"
                  value={scheduleData.panel}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, panel: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location / Meeting Link</Label>
                <Input
                  id="location"
                  placeholder="Zoom link or office room"
                  value={scheduleData.location}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional instructions..."
                  value={scheduleData.notes}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, notes: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleSubmit}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}