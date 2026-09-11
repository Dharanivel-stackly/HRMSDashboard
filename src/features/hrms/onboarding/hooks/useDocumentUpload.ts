import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { onboardingService } from '../services/onboardingService'
import type { DocumentVerification } from '../validation/onboarding.schema'

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => onboardingService.uploadDocument(formData),
    onSuccess: (_, variables) => {
      const employeeId = variables.get('employeeId')
      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: ['documents', { employeeId }],
        })
      }
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useVerifyDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DocumentVerification) => onboardingService.verifyDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useDocuments(employeeId?: string) {
  return useQuery({
    queryKey: ['documents', { employeeId }],
    queryFn: () => onboardingService.getDocuments(employeeId),
  })
}

export function useBackgroundVerifications(employeeId?: string) {
  return useQuery({
    queryKey: ['backgroundVerifications', { employeeId }],
    queryFn: () => onboardingService.getBackgroundVerifications(employeeId),
  });
}

export function useAssetAllocations(employeeId?: string) {
  return useQuery({
    queryKey: ['assetAllocations', { employeeId }],
    queryFn: () => onboardingService.getAssetAllocations(employeeId),
  });
}

export function useITTasks(employeeId?: string) {
  return useQuery({
    queryKey: ['itTasks', { employeeId }],
    queryFn: () => onboardingService.getITTasks(employeeId),
  });
}

export function useManagerTasks(employeeId?: string) {
  return useQuery({
    queryKey: ['managerTasks', { employeeId }],
    queryFn: () => onboardingService.getManagerTasks(employeeId),
  });
}

export function useHRTasks(employeeId?: string) {
  return useQuery({
    queryKey: ['hrTasks', { employeeId }],
    queryFn: () => onboardingService.getHRTasks(employeeId),
  });
}