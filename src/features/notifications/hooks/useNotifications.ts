// src/features/notifications/hooks/useNotifications.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../services/notificationService'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}