import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { performanceService } from '../services/performanceService'
import type {
  CreateGoalPayload,
  GoalListParams,
  Goal,
  UpdateGoalPayload,
  UpdateGoalProgressPayload,
} from '../types/performance.types'

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => performanceService.createGoal(payload),
    onSuccess: (data) => {
        console.log('Created Goal:', data)
      queryClient.invalidateQueries({ queryKey: ['performance', 'goals'] })
    },
  })
}

export function useGoals(params?: GoalListParams) {
  return useQuery({
    queryKey: ['performance', 'goals', params],
    queryFn: () => performanceService.getGoals(params),
  })
}

export function useUpdateGoalProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalProgressPayload }) =>
      performanceService.updateGoalProgress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance', 'goals'] })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) =>
      performanceService.updateGoal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance', 'goals'] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => performanceService.deleteGoal(id),
    onSuccess: ({ id }) => {
      queryClient.setQueriesData<{ data: Goal[]; meta: { total: number } }>(
        { queryKey: ['performance', 'goals'] },
        (current) => current
          ? { ...current, data: current.data.filter((goal) => goal.id !== id), meta: { ...current.meta, total: Math.max(0, current.meta.total - 1) } }
          : current
      )
      queryClient.invalidateQueries({ queryKey: ['performance', 'goals'] })
    },
  })
}