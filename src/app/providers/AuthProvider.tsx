import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { AuthUser } from '@/types/auth.types'
import { getToken, clearTokens } from '@/lib/auth/auth'
import { getStoredUser, setStoredUser, clearSession } from '@/lib/auth/session'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser) => void
  logout: () => void
  updateUser: (user: AuthUser) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const storedUser = getStoredUser()
    if (token && storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((authUser: AuthUser) => {
    setUser(authUser)
    setStoredUser(authUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearTokens()
    clearSession()
  }, [])

  const updateUser = useCallback((authUser: AuthUser) => {
    setUser(authUser)
    setStoredUser(authUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
