// src/features/hrms/onboarding/components/OnboardingStepper.tsx
import { cn } from '@/lib/utils/cn'
import type { OnboardingStatus } from '../types/onboarding.types'

const steps: { id: OnboardingStatus; label: string }[] = [
  { id: 'not_started', label: 'Not Started' },
  { id: 'document_collection', label: 'Documents' },
  { id: 'document_verification', label: 'Verification' },
  { id: 'background_verification', label: 'Background' },
  { id: 'orientation', label: 'Orientation' },
  { id: 'policy_acceptance', label: 'Policies' },
  { id: 'system_access', label: 'Access' },
  { id: 'it_tasks', label: 'IT Setup' },
  { id: 'asset_allocation', label: 'Assets' },
  { id: 'manager_tasks', label: 'Manager' },
  { id: 'hr_tasks', label: 'HR Tasks' },
  { id: 'completed', label: 'Completed' },
]

interface OnboardingStepperProps {
  currentStatus: OnboardingStatus
  progress: number
}

export function OnboardingStepper({ currentStatus, progress }: OnboardingStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStatus)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {steps.map((step, idx) => {
          const isActive = idx <= currentIndex
          const isCurrent = idx === currentIndex
          return (
            <div
              key={step.id}
              className={cn(
                'flex-1 rounded-full px-2 py-1 text-center text-[10px] font-medium transition-colors min-w-[60px]',
                isActive
                  ? isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-emerald-100 text-emerald-800'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {step.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}