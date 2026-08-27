import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1400px] space-y-5', className)}>
      {children}
    </div>
  )
}
