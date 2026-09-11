// src/features/hrms/recruitment/hooks/useCandidates.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recruitmentService } from '../services/recruitmentService'
import type { CandidateFilters } from '../types/recruitment.types'
import type { Candidate } from '../types/recruitment.types'

export function useCandidates(params?: CandidateFilters) {
  return useQuery({
    queryKey: ['candidates', params],
    queryFn: () => recruitmentService.getCandidates(params),
  })
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => recruitmentService.getCandidateById(id),
    enabled: !!id,
  })
}

export function useUpdateCandidateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Candidate['status'] }) =>
      recruitmentService.updateCandidateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] })
    },
  })
}