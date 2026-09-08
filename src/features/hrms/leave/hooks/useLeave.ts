import {useMutation,useQuery,useQueryClient,} from '@tanstack/react-query'
import { leaveService } from '../services/leaveService'
import type {CreateLeaveRequest,} from '../types/leave.types'

export function useLeaveTypes() {
  return useQuery({
    queryKey: ['leave', 'types'],
    queryFn: () => leaveService.getLeaveTypes(),
  })
}

export function useLeaveBalance() {
  return useQuery({
    queryKey: ['leave', 'balance'],
    queryFn: () => leaveService.getLeaveBalance(),
  })
}

export function useLeaveRequests() {
  return useQuery({
    queryKey: ['leave', 'requests'],
    queryFn: () => leaveService.getLeaveRequests(),
  })
}

export function useLeaveRequest(id: string) {
  return useQuery({
    queryKey: ['leave', 'request', id],
    queryFn: () => leaveService.getLeaveRequestById(id),
    enabled: !!id,
  })
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLeaveRequest) =>
      leaveService.createLeaveRequest(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['leave', 'requests'],
      })

      queryClient.invalidateQueries({
        queryKey: ['leave', 'balance'],
      })
    },
  })
}

export function useCancelLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      leaveService.cancelLeaveRequest(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ['leave', 'requests'],
      })

      queryClient.invalidateQueries({
        queryKey: ['leave', 'balance'],
      })

      queryClient.invalidateQueries({
        queryKey: ['leave', 'request', id],
      })
    },
  })
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      leaveService.approveLeaveRequest(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ['leave', 'requests'],
      })

      queryClient.invalidateQueries({
        queryKey: ['leave', 'balance'],
      })

      queryClient.invalidateQueries({
        queryKey: ['leave', 'request', id],
      })
    },
  })
}

export function useRejectLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string
      reason: string
    }) =>
      leaveService.rejectLeaveRequest(
        id,
        reason
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['leave', 'requests'],
      })

      queryClient.invalidateQueries({
        queryKey: ['leave', 'balance'],
      })

      queryClient.invalidateQueries({
        queryKey: [
          'leave',
          'request',
          variables.id,
        ],
      })
    },
  })
}