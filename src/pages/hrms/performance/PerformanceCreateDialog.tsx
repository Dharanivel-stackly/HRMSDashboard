import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type PerformanceModule = 'goal' | 'kpi' | 'appraisal' | 'feedback'

type FormValues = Record<string, string>

interface PerformanceCreateDialogProps {
  module: PerformanceModule
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (values: FormValues) => void | Promise<void>
  isSubmitting?: boolean
  initialValues?: FormValues
  isEditing?: boolean
}

const config: Record<PerformanceModule, { title: string; description: string; submit: string; fields: { name: string; label: string; type?: string; placeholder?: string }[] }> = {
  goal: {
    title: 'Create goal',
    description: 'Define an outcome, assign an owner, and set a due date.',
    submit: 'Create goal',
    fields: [
      { name: 'title', label: 'Goal title', placeholder: 'e.g. Improve customer onboarding time' },
      { name: 'owner', label: 'Owner', placeholder: 'Employee name' },
      { name: 'team', label: 'Team', placeholder: 'e.g. Customer Success' },
      { name: 'due', label: 'Due date', type: 'date' },
    ],
  },
  kpi: {
    title: 'Create KPI',
    description: 'Add a measurable indicator with target and current performance.',
    submit: 'Create KPI',
    fields: [
      { name: 'name', label: 'KPI name', placeholder: 'e.g. Customer retention' },
      { name: 'owner', label: 'Owner / team', placeholder: 'e.g. Customer Success' },
      { name: 'target', label: 'Target', placeholder: 'e.g. 92%' },
      { name: 'actual', label: 'Actual value', placeholder: 'e.g. 94%' },
    ],
  },
  appraisal: {
    title: 'Start appraisal',
    description: 'Set up a performance review for an employee.',
    submit: 'Start appraisal',
    fields: [
      { name: 'employee', label: 'Employee', placeholder: 'Employee name' },
      { name: 'role', label: 'Role', placeholder: 'e.g. Software Engineer' },
      { name: 'reviewer', label: 'Reviewer', placeholder: 'Reviewer name' },
      { name: 'cycle', label: 'Review cycle', placeholder: 'e.g. 2026 Annual' },
    ],
  },
  feedback: {
    title: 'Create feedback campaign',
    description: 'Collect structured feedback from selected respondents.',
    submit: 'Create campaign',
    fields: [
      { name: 'employee', label: 'Employee', placeholder: 'Employee name' },
      { name: 'respondents', label: 'Number of respondents', type: 'number', placeholder: 'e.g. 6' },
      { name: 'deadline', label: 'Response deadline', type: 'date' },
    ],
  },
}

export function PerformanceCreateDialog({ module, open, onOpenChange, onCreate, isSubmitting = false, initialValues = {}, isEditing = false }: PerformanceCreateDialogProps) {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [error, setError] = useState('')
  const currentConfig = config[module]

  useEffect(() => {
    if (open) setValues(initialValues)
  }, [initialValues, open])

  const updateValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentConfig.fields.some((field) => !values[field.name]?.trim())) {
      setError('Complete all required fields before submitting.')
      return
    }
    try {
      await onCreate(values)
      onOpenChange(false)
    } catch {
      setError('Unable to create the goal. Please try again.')
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setValues({})
      setError('')
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? currentConfig.title.replace('Create', 'Edit') : currentConfig.title}</DialogTitle>
          <DialogDescription>{currentConfig.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentConfig.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={`performance-${field.name}`}>{field.label}</Label>
              <Input
                id={`performance-${field.name}`}
                type={field.type ?? 'text'}
                placeholder={field.placeholder}
                value={values[field.name] ?? ''}
                onChange={(event) => updateValue(field.name, event.target.value)}
                required
              />
            </div>
          ))}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : isEditing ? currentConfig.submit.replace('Create', 'Update') : currentConfig.submit}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
