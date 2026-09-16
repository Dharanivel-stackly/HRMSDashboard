// src/features/notifications/types/notification.types.ts
export type NotificationIcon =
  | 'bell'
  | 'calendar'
  | 'clock'
  | 'user-check'
  | 'briefcase'
  | 'user-plus'
  | 'file-text'

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
  href?: string
  icon: NotificationIcon
  tone?: 'default' | 'warning' | 'success'
}