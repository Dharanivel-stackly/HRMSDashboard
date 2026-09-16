// src/features/hrms/recruitment/components/InterviewPanel.tsx
import { Calendar, Clock, Users, Video, Phone, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils/cn'
import { INTERVIEW_TYPE_LABELS, INTERVIEW_STATUS_LABELS } from '../constants/recruitment.constants'
import type { Interview } from '../types/recruitment.types'

interface InterviewPanelProps {
  interviews: Interview[]
  onSelect?: (interview: Interview) => void
}

const statusStyles: Record<Interview['status'], string> = {
  scheduled: 'border-amber-200 bg-amber-50 text-amber-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
  rescheduled: 'border-blue-200 bg-blue-50 text-blue-700',
}

const typeIcons = {
  phone: Phone,
  video: Video,
  in_person: MapPin,
  technical: Users,
  panel: Users,
}

const statusIcons = {
  scheduled: Calendar,
  completed: CheckCircle,
  cancelled: XCircle,
  rescheduled: AlertCircle,
}

export function InterviewPanel({ interviews, onSelect }: InterviewPanelProps) {
  if (interviews.length === 0) {
    return (
      <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-8 text-center">
        <p className="text-muted-foreground">No interviews scheduled</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {interviews.map((interview) => {
        const TypeIcon = typeIcons[interview.interviewType] || Calendar
        const StatusIcon = statusIcons[interview.status] || Calendar

        return (
          <div
            key={interview.id}
            className="ui-card-elevated cursor-pointer rounded-xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-md"
            onClick={() => onSelect?.(interview)}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{interview.candidateName}</p>
                  <Badge variant="outline" className={cn('text-xs', statusStyles[interview.status])}>
                    {INTERVIEW_STATUS_LABELS[interview.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{interview.position}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <TypeIcon className="h-4 w-4" />
                    {INTERVIEW_TYPE_LABELS[interview.interviewType]}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {interview.scheduledDate}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {interview.scheduledTime} ({interview.duration}m)
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {interview.location}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex -space-x-2">
                  {interview.panel.map((name, i) => {
                    const initials = name.split(' ').map(n => n[0]).join('')
                    return (
                      <Avatar key={i} className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    )
                  })}
                </div>
                <span className="text-xs text-muted-foreground">
                  {interview.panel.length} panelist(s)
                </span>
              </div>
            </div>

            {interview.notes && (
              <div className="mt-3 rounded-lg bg-brand-soft/60 px-3 py-2 text-sm text-muted-foreground">
                📝 {interview.notes}
              </div>
            )}

            {interview.feedback && interview.status === 'completed' && (
              <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <span className="font-medium">Feedback:</span> {interview.feedback}
                {interview.rating && (
                  <span className="ml-2 font-semibold text-amber-600">{interview.rating}★</span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}