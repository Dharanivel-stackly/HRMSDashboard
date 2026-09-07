import type { Notification } from '@/features/notifications/types/notification.types'

let notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Pending correction',
    message: 'Rahul Mehta submitted an attendance correction for review.',
    time: '12 min ago',
    unread: true,
    href: '/hrms/attendance/corrections',
    icon: 'clock',
    tone: 'warning',
  },
  {
    id: 'n2',
    title: 'Leave request',
    message: 'Sneha Kapoor applied for leave on Aug 28.',
    time: '1 hr ago',
    unread: true,
    href: '/hrms/leave',
    icon: 'calendar',
    tone: 'default',
  },
  
]

export const mockNotificationService = {
  async getNotifications(): Promise<Notification[]> {
    return notifications
  },

  async markAllAsRead(): Promise<void> {
    notifications = notifications.map((notification) => ({
      ...notification,
      unread: false,
    }))
  },
}