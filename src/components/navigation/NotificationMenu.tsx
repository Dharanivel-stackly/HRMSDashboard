import { Bell, CalendarDays, Clock, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
  href?: string
  icon: typeof Bell
  tone?: 'default' | 'warning' | 'success'
}

const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Pending correction',
    message: 'Rahul Mehta submitted an attendance correction for review.',
    time: '12 min ago',
    unread: true,
    href: ROUTES.HRMS.ATTENDANCE_CORRECTIONS,
    icon: Clock,
    tone: 'warning',
  },
  {
    id: 'n2',
    title: 'Leave request',
    message: 'Sneha Kapoor applied for leave on Aug 28.',
    time: '1 hr ago',
    unread: true,
    href: ROUTES.HRMS.LEAVE,
    icon: CalendarDays,
    tone: 'default',
  },
  {
    id: 'n3',
    title: 'Late check-ins',
    message: '27 employees checked in late today across departments.',
    time: '2 hrs ago',
    unread: true,
    href: ROUTES.HRMS.ATTENDANCE_DAILY,
    icon: UserCheck,
    tone: 'warning',
  },
  {
    id: 'n4',
    title: 'Overtime approval',
    message: 'Arjun Nair overtime request is awaiting your approval.',
    time: 'Yesterday',
    unread: false,
    href: ROUTES.HRMS.ATTENDANCE_OVERTIME,
    icon: Clock,
    tone: 'default',
  },
]

const toneStyles = {
  default: 'bg-primary/10 text-primary',
  warning: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
}

export function NotificationMenu() {
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-full border-border bg-white shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-primary" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <DropdownMenuLabel className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {unreadCount} new
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <div className="max-h-[320px] overflow-y-auto py-1">
          {notifications.map((item) => {
            const Icon = item.icon
            const content = (
              <>
                <div
                  className={cn(
                    'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    toneStyles[item.tone ?? 'default']
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight text-foreground">
                      {item.title}
                    </p>
                    {item.unread && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {item.message}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">{item.time}</p>
                </div>
              </>
            )

            if (item.href) {
              return (
                <DropdownMenuItem key={item.id} className="cursor-pointer px-4 py-3" asChild>
                  <Link to={item.href} className="flex items-start gap-3">
                    {content}
                  </Link>
                </DropdownMenuItem>
              )
            }

            return (
              <DropdownMenuItem key={item.id} className="flex items-start gap-3 px-4 py-3">
                {content}
              </DropdownMenuItem>
            )
          })}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button variant="ghost" className="h-9 w-full text-sm font-medium text-primary">
            Mark all as read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
