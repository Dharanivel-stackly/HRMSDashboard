import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { onboardingService } from '../services/onboardingService'
import type { OnboardingTask } from '../types/onboarding.types'

export function useTasks(params?: { employeeId?: string; status?: OnboardingTask['status'] }) {
  return useQuery({
    queryKey: ['onboardingTasks', params],
    queryFn: () => onboardingService.getOnboardingTasks(params),
  })
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: OnboardingTask['status'] }) =>
      onboardingService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingTasks'] })
    },
  })
}

export function usePolicyAcceptances(employeeId?: string) {
  return useQuery({
    queryKey: ['policyAcceptances', { employeeId }],
    queryFn: () => onboardingService.getPolicyAcceptances(employeeId),
  })
}

export function useAcceptPolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { policyId: string; accepted: boolean }) =>
      onboardingService.acceptPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policyAcceptances'] })
    },
  })
}
export function useHRTasks(employeeId?: string) {
  return useQuery({
    queryKey: ['hrTasks', { employeeId }],
    queryFn: () => onboardingService.getHRTasks(employeeId),
  })
}