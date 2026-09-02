// src/features/hrms/recruitment/hooks/useApproval.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recruitmentService } from '../services/recruitmentService'

export function useApprovals() {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: () => recruitmentService.getApprovals(),
  })
}

export function useUpdateApproval() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, comments }: { id: string; status: 'approved' | 'rejected'; comments?: string }) =>
      recruitmentService.updateApproval(id, status, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] })
    },
  })
}