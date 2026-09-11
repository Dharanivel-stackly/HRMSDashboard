import type { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from './ThemeProvider'
import { LocaleProvider } from './LocaleProvider'
import { ToastProvider } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <LocaleProvider>
            <ToastProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </ToastProvider>
          </LocaleProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
