import type { LucideIcon } from 'lucide-react'
import type { Permission } from '@/lib/constants/permissions'

export interface NavigationItem {
  label: string
  path: string
  icon?: LucideIcon
  module?: string
  permission?: Permission
  children?: NavigationItem[]
}

export interface NavigationGroup {
  label: string
  items: NavigationItem[]
}
