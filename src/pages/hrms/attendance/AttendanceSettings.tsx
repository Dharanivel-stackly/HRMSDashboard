import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const settingsGroups = [
  {
    title: 'Work day rules',
    fields: [
      { label: 'Full-day minimum hours', value: '8', suffix: 'hours' },
      { label: 'Half-day threshold', value: '4', suffix: 'hours' },
      { label: 'Default grace period', value: '15', suffix: 'minutes' },
    ],
  },
  {
    title: 'Overtime policy',
    fields: [
      { label: 'Overtime starts after', value: '8.5', suffix: 'hours' },
      { label: 'Auto-create OT request', value: 'Yes', suffix: '' },
      { label: 'Require manager approval', value: 'Yes', suffix: '' },
    ],
  },
  {
    title: 'Correction policy',
    fields: [
      { label: 'Correction window', value: '7', suffix: 'days' },
      { label: 'Attachment required', value: 'Optional', suffix: '' },
      { label: 'Auto-notify employee', value: 'Yes', suffix: '' },
    ],
  },
]

export default function AttendanceSettings() {
  return (
    <PageContainer>
      <PageHeader
        title="Attendance Settings"
        description="Configure attendance rules, policies and calculation thresholds"
        actions={<Button>Save Settings</Button>}
      />

      <div className="space-y-5">
        {settingsGroups.map((group) => (
          <div
            key={group.title}
            className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5"
          >
            <h3 className="text-base font-semibold text-[#0b3d91]">{group.title}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {group.fields.map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    {field.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input defaultValue={field.value} />
                    {field.suffix && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {field.suffix}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
