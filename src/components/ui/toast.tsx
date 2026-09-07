import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastInput {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastItem extends Required<Pick<ToastInput, 'title' | 'variant' | 'duration'>> {
  id: string
  description?: string
}

interface ToastContextValue {
  toast: (input: ToastInput | string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const DEFAULT_DURATION = 3500

const variantStyles: Record<
  ToastVariant,
  { shell: string; icon: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    shell: 'border-emerald-200 bg-white text-foreground',
    icon: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  error: {
    shell: 'border-red-200 bg-white text-foreground',
    icon: 'text-red-600',
    Icon: CircleAlert,
  },
  info: {
    shell: 'border-blue-200 bg-white text-foreground',
    icon: 'text-brand-blue',
    Icon: Info,
  },
}

function ToastView({
  item,
  onDismiss,
}: {
  item: ToastItem
  onDismiss: (id: string) => void
}) {
  const style = variantStyles[item.variant]
  const Icon = style.Icon

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-[min(100vw-2rem,22rem)] items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-brand-navy/10 animate-in fade-in slide-in-from-top-2',
        style.shell
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', style.icon)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-brand-navy">{item.title}</p>
        {item.description && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (input: ToastInput | string) => {
      const payload: ToastInput = typeof input === 'string' ? { title: input } : input
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const item: ToastItem = {
        id,
        title: payload.title,
        description: payload.description,
        variant: payload.variant ?? 'info',
        duration: payload.duration ?? DEFAULT_DURATION,
      }

      setToasts((current) => [...current, item].slice(-4))

      window.setTimeout(() => {
        dismiss(id)
      }, item.duration)
    },
    [dismiss]
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (title, description) => toast({ title, description, variant: 'success' }),
      error: (title, description) => toast({ title, description, variant: 'error' }),
      info: (title, description) => toast({ title, description, variant: 'info' }),
      dismiss,
    }),
    [dismiss, toast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((item) => (
          <ToastView key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
