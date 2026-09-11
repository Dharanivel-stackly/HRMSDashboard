// src/pages/hrms/recruitment/InterviewSchedule.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus, Mail, Phone, Briefcase, MapPin, CalendarDays, Clock, Award, XCircle, ExternalLink, MessageCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { InterviewPanel } from '@/features/hrms/recruitment/components/InterviewPanel'
import { useInterviews } from '@/features/hrms/recruitment/hooks/useRecruitment'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import {
  INTERVIEW_TYPE_LABELS,
  INTERVIEW_STATUS_LABELS,
} from '@/features/hrms/recruitment/constants/recruitment.constants'
import type { Interview } from '@/features/hrms/recruitment/types/recruitment.types'

export default function InterviewSchedule() {
  const navigate = useNavigate()
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)

  // Schedule form state
  const [scheduleData, setScheduleData] = useState({
    candidateName: '',
    position: '',
    interviewType: 'panel',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    panel: '',
    location: '',
    notes: '',
  })

  const { data: interviews = [], isLoading, isError, refetch } = useInterviews()

  if (isLoading) return <LoadingState variant="page" />
  if (isError) return <ErrorState onRetry={refetch} />

  const handleSelectInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setDetailDialogOpen(true)
  }

  const handleScheduleSubmit = () => {
    console.log('Scheduling interview:', scheduleData)
    setScheduleDialogOpen(false)
    navigate('/hrms/recruitment/interviews')
  }

  const openScheduleDialog = () => {
    setScheduleData({
      candidateName: '',
      position: '',
      interviewType: 'panel',
      scheduledDate: new Date().toISOString().slice(0, 10),
      scheduledTime: '10:00',
      duration: 60,
      panel: '',
      location: '',
      notes: '',
    })
    setScheduleDialogOpen(true)
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    return parts.length > 1 ? `${parts[0].charAt(0)}${parts[1].charAt(0)}` : name.charAt(0)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Clock className="h-3.5 w-3.5 text-amber-600" />
      case 'completed':
        return <Award className="h-3.5 w-3.5 text-emerald-600" />
      case 'cancelled':
        return <XCircle className="h-3.5 w-3.5 text-red-600" />
      default:
        return <CalendarPlus className="h-3.5 w-3.5 text-blue-600" />
    }
  }

  return (
    <PageContainer className="bg-gradient-to-b from-[#f0f4ff] to-white min-h-screen">
      <PageHeader
        title="Interview Schedule"
        description="Schedule and manage candidate interviews"
        actions={
          <Button
            size="sm"
            onClick={openScheduleDialog}
            className="bg-gradient-to-r from-[#0b3d91] to-[#1a5bb5] text-white hover:from-[#0a357a] hover:to-[#154f9e] shadow-md shadow-[#0b3d91]/20"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        }
      />

      <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-[#0b3d91]/5 border border-white/50 p-1">
        <InterviewPanel interviews={interviews} onSelect={handleSelectInterview} />
      </div>

      {/* ========== INTERVIEW DETAIL DIALOG – THEMED ========== */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl p-0 gap-0 rounded-2xl border-[#0b3d91]/10 shadow-2xl shadow-[#0b3d91]/15">
          {/* ——— Header with gradient ——— */}
          <div className="relative bg-gradient-to-r from-[#0b3d91] via-[#1a5bb5] to-[#2d7ad9] px-8 pt-8 pb-20 rounded-t-2xl">
            <div className="absolute right-4 top-4 flex items-center gap-2">
              {selectedInterview && (
                <Badge
                  className={`border font-medium ${getStatusColor(selectedInterview.status)} flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider shadow-sm`}
                >
                  {getStatusIcon(selectedInterview.status)}
                  {INTERVIEW_STATUS_LABELS[selectedInterview.status]}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-5">
              {selectedInterview && (
                <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl ring-2 ring-white/50">
                  <AvatarFallback className="bg-white/20 text-3xl font-bold text-white backdrop-blur-sm">
                    {getInitials(selectedInterview.candidateName)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-1 text-white">
                <h3 className="text-2xl font-bold tracking-tight">
                  {selectedInterview?.candidateName}
                </h3>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 opacity-70" />
                  {selectedInterview?.position}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/70">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> {selectedInterview?.scheduledDate}
                  </span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {selectedInterview?.scheduledTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-white/5 blur-xl" />
          </div>

          {/* ——— Body ——— */}
          <div className="px-8 pb-8 pt-6 space-y-6 bg-white rounded-b-2xl">
            {/* Quick info chips */}
            <div className="flex flex-wrap items-center gap-3 -mt-12">
              <span className="flex items-center gap-1.5 rounded-full bg-[#f0f4ff] px-3 py-1 text-[#0b3d91]/80 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {INTERVIEW_TYPE_LABELS[selectedInterview?.interviewType || 'panel']}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-[#f0f4ff] px-3 py-1 text-[#0b3d91]/80 text-sm">
                <Clock className="h-3.5 w-3.5" />
                {selectedInterview?.duration} min
              </span>
            </div>

            {/* ——— Details list ——— */}
            <div className="rounded-xl bg-[#f8faff] border border-[#0b3d91]/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#0b3d91]" />
                  Date
                </span>
                <span className="font-medium text-foreground">{selectedInterview?.scheduledDate}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#0b3d91]/5 pt-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#0b3d91]" />
                  Time
                </span>
                <span className="font-medium text-foreground">{selectedInterview?.scheduledTime}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#0b3d91]/5 pt-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#0b3d91]" />
                  Type
                </span>
                <span className="font-medium text-foreground">
                  {INTERVIEW_TYPE_LABELS[selectedInterview?.interviewType || 'panel']}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[#0b3d91]/5 pt-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#0b3d91]" />
                  Duration
                </span>
                <span className="font-medium text-foreground">{selectedInterview?.duration} min</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#0b3d91]/5 pt-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0b3d91]" />
                  Location
                </span>
                <span className="font-medium text-foreground">{selectedInterview?.location}</span>
              </div>
            </div>

            {/* Panel Members */}
            {selectedInterview?.panel && selectedInterview.panel.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Panel Members</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInterview.panel.map((member) => (
                    <Badge
                      key={member}
                      className="bg-gradient-to-br from-[#e8eeff] to-[#d4e0ff] text-[#0b3d91] border-[#0b3d91]/10 font-medium px-3 py-1 text-xs shadow-sm"
                    >
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedInterview?.notes && (
              <div className="rounded-xl bg-amber-50/60 border border-amber-200/40 p-4 text-sm">
                <p className="text-xs font-medium text-amber-700/70 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-foreground/80">{selectedInterview.notes}</p>
              </div>
            )}

            {/* Feedback (if completed) */}
            {selectedInterview?.status === 'completed' && (
              <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/40 p-4 text-sm">
                <p className="text-xs font-medium text-emerald-700/70 uppercase tracking-wider mb-1">Feedback</p>
                {selectedInterview.feedback && (
                  <p className="text-foreground/80">{selectedInterview.feedback}</p>
                )}
                {selectedInterview.rating && (
                  <p className="mt-2 text-sm font-medium text-amber-600">
                    Rating: {selectedInterview.rating}★
                  </p>
                )}
              </div>
            )}

            {/* ——— Action buttons ——— */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#0b3d91]/5">
              {selectedInterview?.status === 'scheduled' && (
                <>
                  <Button variant="outline" size="sm" className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                    Cancel
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setDetailDialogOpen(false)}
                className="border-[#0b3d91]/20 text-[#0b3d91] hover:bg-[#0b3d91]/5"
              >
                Close
              </Button>
            </div>
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
                Schedule New Interview
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Enter the details for the new interview.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 space-y-4 bg-white rounded-b-2xl">
            <div className="space-y-2">
              <Label htmlFor="candidateName" className="text-sm font-medium">Candidate Name</Label>
              <Input
                id="candidateName"
                value={scheduleData.candidateName}
                onChange={(e) => setScheduleData({ ...scheduleData, candidateName: e.target.value })}
                placeholder="Full name"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium">Position</Label>
              <Input
                id="position"
                value={scheduleData.position}
                onChange={(e) => setScheduleData({ ...scheduleData, position: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schedule-date" className="text-sm font-medium">Date</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleData.scheduledDate}
                  onChange={(e) => setScheduleData({ ...scheduleData, scheduledDate: e.target.value })}
                  className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-time" className="text-sm font-medium">Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleData.scheduledTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, scheduledTime: e.target.value })}
                  className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Interview Type</Label>
              <Select
                value={scheduleData.interviewType}
                onValueChange={(v) => setScheduleData({ ...scheduleData, interviewType: v })}
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
              <Label htmlFor="panel" className="text-sm font-medium">Panel Members (comma separated)</Label>
              <Input
                id="panel"
                value={scheduleData.panel}
                onChange={(e) => setScheduleData({ ...scheduleData, panel: e.target.value })}
                placeholder="e.g. Priya Sharma, Arjun Nair"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location / Meeting Link</Label>
              <Input
                id="location"
                value={scheduleData.location}
                onChange={(e) => setScheduleData({ ...scheduleData, location: e.target.value })}
                placeholder="Zoom link or office room"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
              <Textarea
                id="notes"
                value={scheduleData.notes}
                onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                placeholder="Additional instructions"
                className="border-[#0b3d91]/10 focus:border-[#0b3d91] focus:ring-[#0b3d91]/20"
              />
            </div>
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