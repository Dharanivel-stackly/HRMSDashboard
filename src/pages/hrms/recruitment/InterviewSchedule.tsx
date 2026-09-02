// src/pages/hrms/recruitment/InterviewSchedule.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus, X } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { InterviewPanel } from '@/features/hrms/recruitment/components/InterviewPanel'
import { mockInterviews } from '@/features/hrms/recruitment/mock/recruitment.mock'
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
  const [interviews] = useState(mockInterviews)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  )
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

  const handleSelectInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setDetailDialogOpen(true)
  }

  const handleScheduleSubmit = () => {
    // In real app, call API to create interview
    console.log('Scheduling interview:', scheduleData)
    setScheduleDialogOpen(false)
    // Optionally navigate or refresh
    navigate('/hrms/recruitment/interviews')
  }

  const openScheduleDialog = () => {
    // Pre-fill with some default values if needed
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

  return (
    <PageContainer>
      <PageHeader
        title="Interview Schedule"
        description="Schedule and manage candidate interviews"
        actions={
          <Button size="sm" onClick={openScheduleDialog}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        }
      />

      <InterviewPanel
        interviews={interviews}
        onSelect={handleSelectInterview}
      />

      {/* Interview Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected interview.
            </DialogDescription>
          </DialogHeader>
          {selectedInterview && (
            <div className="space-y-6">
              {/* Header: Candidate + Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0b3d91]">
                    {selectedInterview.candidateName}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedInterview.position}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    selectedInterview.status === 'scheduled'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : selectedInterview.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : selectedInterview.status === 'cancelled'
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : 'border-blue-200 bg-blue-50 text-blue-700'
                  }
                >
                  {INTERVIEW_STATUS_LABELS[selectedInterview.status]}
                </Badge>
              </div>

              {/* Key details grid */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-brand-soft/60 p-4">
                <div>
                  <span className="text-sm text-muted-foreground">Type</span>
                  <p className="font-medium">
                    {INTERVIEW_TYPE_LABELS[selectedInterview.interviewType]}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Date</span>
                  <p className="font-medium">{selectedInterview.scheduledDate}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Time</span>
                  <p className="font-medium">{selectedInterview.scheduledTime}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <p className="font-medium">{selectedInterview.duration} min</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <p className="font-medium">{selectedInterview.location}</p>
                </div>
              </div>

              {/* Panel Members */}
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Panel Members</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInterview.panel.map((member) => (
                    <Badge
                      key={member}
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedInterview.notes && (
                <div className="rounded-lg border border-border/60 p-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Notes:
                  </span>
                  <p className="mt-1 text-sm">{selectedInterview.notes}</p>
                </div>
              )}

              {/* Feedback (if completed) */}
              {selectedInterview.status === 'completed' && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <h4 className="font-semibold text-emerald-800">Feedback</h4>
                  {selectedInterview.feedback && (
                    <p className="mt-1 text-sm text-emerald-700">
                      {selectedInterview.feedback}
                    </p>
                  )}
                  {selectedInterview.rating && (
                    <p className="mt-2 text-sm font-medium text-amber-600">
                      Rating: {selectedInterview.rating}★
                    </p>
                  )}
                </div>
              )}

              {/* Additional actions (optional) */}
              {selectedInterview.status === 'scheduled' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
            <DialogDescription>
              Enter the details for the new interview.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="candidateName">Candidate Name</Label>
              <Input
                id="candidateName"
                value={scheduleData.candidateName}
                onChange={(e) =>
                  setScheduleData({
                    ...scheduleData,
                    candidateName: e.target.value,
                  })
                }
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={scheduleData.position}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, position: e.target.value })
                }
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schedule-date">Date</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleData.scheduledDate}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      scheduledDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-time">Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleData.scheduledTime}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      scheduledTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select
                value={scheduleData.interviewType}
                onValueChange={(v) =>
                  setScheduleData({ ...scheduleData, interviewType: v })
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
              <Label htmlFor="panel">Panel Members (comma separated)</Label>
              <Input
                id="panel"
                value={scheduleData.panel}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, panel: e.target.value })
                }
                placeholder="e.g. Priya Sharma, Arjun Nair"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location / Meeting Link</Label>
              <Input
                id="location"
                value={scheduleData.location}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, location: e.target.value })
                }
                placeholder="Zoom link or office room"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={scheduleData.notes}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, notes: e.target.value })
                }
                placeholder="Additional instructions"
              />
            </div>
          </div>
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