import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { AuthUser } from '@/types/auth.types'
import { getToken, clearTokens } from '@/lib/auth/auth'
import { getStoredUser, setStoredUser, clearSession } from '@/lib/auth/session'
import { authService } from '@/features/auth/services/authService'
import { ApiError } from '@/lib/api/apiError'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser) => void
  logout: () => void
  updateUser: (user: AuthUser) => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

/** Minimum gap between focus-triggered permission refreshes */
const REFRESH_THROTTLE_MS = 10_000

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const lastRefreshRef = useRef(0)

  const logout = useCallback(() => {
    setUser(null)
    clearTokens()
    clearSession()
  }, [])

  const login = useCallback((authUser: AuthUser) => {
    setUser(authUser)
    setStoredUser(authUser)
  }, [])

  const updateUser = useCallback((authUser: AuthUser) => {
    setUser(authUser)
    setStoredUser(authUser)
  }, [])

  /**
   * Pulls roles and permissions from the server so privilege changes take effect
   * without forcing a re-login.
   */
  const refreshUser = useCallback(async () => {
    if (!getToken()) return

    lastRefreshRef.current = Date.now()
    try {
      const fresh = await authService.getMe()
      setUser(fresh)
      setStoredUser(fresh)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        logout()
      }
      // Other failures keep the cached session so a flaky request cannot sign the user out.
    }
  }, [logout])

  useEffect(() => {
    const token = getToken()
    const storedUser = getStoredUser()

    // Hydrate from the cached session first so the shell paints immediately.
    if (token && storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)

    if (token) {
      void refreshUser()
    }
  }, [refreshUser])

  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === 'hidden') return
      if (Date.now() - lastRefreshRef.current < REFRESH_THROTTLE_MS) return
      void refreshUser()
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
    }
  }, [refreshUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
