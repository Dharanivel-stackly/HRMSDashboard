import { useEffect, useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useAttendanceSettings,
  useUpdateAttendanceSettings,
} from '@/features/hrms/attendance/hooks/useAttendance'
import type { AttendanceSettingsData } from '@/features/hrms/attendance/types/attendance.types'

export default function AttendanceSettings() {
  const { data, isLoading, isError, refetch } = useAttendanceSettings()
  const updateSettings = useUpdateAttendanceSettings()
  const [form, setForm] = useState<AttendanceSettingsData | null>(null)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (isLoading || !form) {
    return (
      <PageContainer>
        <LoadingState variant="page" rows={6} />
      </PageContainer>
    )
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  const update = <K extends keyof AttendanceSettingsData>(
    key: K,
    value: AttendanceSettingsData[K]
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  return (
    <PageContainer>
      <PageHeader
        title="Attendance Settings"
        description="Configure attendance rules, policies and calculation thresholds"
        actions={
          <Button
            disabled={updateSettings.isPending}
            onClick={() => updateSettings.mutate(form)}
          >
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        }
      />

      <div className="space-y-5">
        <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-base font-semibold text-[#0b3d91]">Work day rules</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Full-day minimum hours
              </label>
              <Input
                type="number"
                value={form.fullDayMinHours}
                onChange={(e) => update('fullDayMinHours', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Half-day threshold
              </label>
              <Input
                type="number"
                value={form.halfDayThreshold}
                onChange={(e) => update('halfDayThreshold', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Default grace period
              </label>
              <Input
                type="number"
                value={form.defaultGraceMinutes}
                onChange={(e) => update('defaultGraceMinutes', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-base font-semibold text-[#0b3d91]">Overtime policy</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Overtime starts after
              </label>
              <Input
                type="number"
                step="0.5"
                value={form.overtimeStartsAfter}
                onChange={(e) => update('overtimeStartsAfter', Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.autoCreateOtRequest}
                onChange={(e) => update('autoCreateOtRequest', e.target.checked)}
              />
              <label className="text-sm">Auto-create OT request</label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.requireManagerApproval}
                onChange={(e) => update('requireManagerApproval', e.target.checked)}
              />
              <label className="text-sm">Require manager approval</label>
            </div>
          </div>
        </div>

        <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-base font-semibold text-[#0b3d91]">Correction policy</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Correction window (days)
              </label>
              <Input
                type="number"
                value={form.correctionWindowDays}
                onChange={(e) => update('correctionWindowDays', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Attachment required
              </label>
              <Select
                value={form.attachmentRequired}
                onValueChange={(v) =>
                  update('attachmentRequired', (v as AttendanceSettingsData['attachmentRequired']) ?? 'optional')
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="optional">Optional</SelectItem>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.autoNotifyEmployee}
                onChange={(e) => update('autoNotifyEmployee', e.target.checked)}
              />
              <label className="text-sm">Auto-notify employee</label>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
