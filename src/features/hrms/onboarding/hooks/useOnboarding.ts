import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { onboardingService } from '../services/onboardingService'
import type { OnboardingEmployeeUpdate } from '../validation/onboarding.schema'

export function useOnboardingEmployees(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['onboardingEmployees', params],
    queryFn: () => onboardingService.getOnboardingEmployees(params),
  })
}

export function useOnboardingEmployee(id: string) {
  return useQuery({
    queryKey: ['onboardingEmployee', id],
    queryFn: () => onboardingService.getOnboardingEmployeeById(id),
    enabled: !!id,
  })
}

export function useUpdateOnboardingEmployee(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OnboardingEmployeeUpdate) =>
      onboardingService.updateOnboardingEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingEmployees'] })
      queryClient.invalidateQueries({ queryKey: ['onboardingEmployee', id] })
    },
  })
}

export function useOnboardingStats() {
  return useQuery({
    queryKey: ['onboardingStats'],
    queryFn: () => onboardingService.getOnboardingStats(),
  })
}