// src/features/hrms/recruitment/hooks/useRequisition.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recruitmentService } from '../services/recruitmentService'
import type { RequisitionFormData } from '../validation/requisition.schema'

export function useRequisitions(params?: any) {
  return useQuery({
    queryKey: ['requisitions', params],
    queryFn: () => recruitmentService.getRequisitions(params),
  })
}

export function useRequisition(id: string) {
  return useQuery({
    queryKey: ['requisition', id],
    queryFn: () => recruitmentService.getRequisitionById(id),
    enabled: !!id,
  })
}

export function useCreateRequisition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RequisitionFormData) => recruitmentService.createRequisition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] })
    },
  })
}

export function useUpdateRequisition(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<RequisitionFormData>) => recruitmentService.updateRequisition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] })
      queryClient.invalidateQueries({ queryKey: ['requisition', id] })
    },
  })
}