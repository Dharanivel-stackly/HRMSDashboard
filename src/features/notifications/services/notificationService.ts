import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { ApiResponse } from '@/types/api.types'
import type { Notification } from '../types/notification.types'

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<ApiResponse<Notification[]>>(
      API_ENDPOINTS.NOTIFICATIONS.BASE
    )
    return response.data.data
  },

  markAllAsRead: async () => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    return response.data
  },
}