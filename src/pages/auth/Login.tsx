import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/LoginForm'
import type { LoginFormData } from '@/features/auth/validation/auth.schema'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { authService } from '@/features/auth/services/authService'
import { setToken, setRefreshToken } from '@/lib/auth/auth'
import { ROUTES } from '@/lib/constants/routes'
import { ApiError } from '@/lib/api/apiError'
import { useState } from 'react'
import { appConfig } from '@/config/app.config'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.login(data)
      setToken(response.accessToken)
      setRefreshToken(response.refreshToken)
      login(response.user)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to sign in. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#0b3d91] via-[#1565c0] to-[#0d47a1] lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.25) 0%, transparent 45%), radial-gradient(circle at 90% 30%, transparent 40%, rgba(255,255,255,0.08) 41%, transparent 42%), radial-gradient(circle at 85% 25%, transparent 55%, rgba(255,255,255,0.08) 56%, transparent 57%)',
          }}
        />
        <div className="relative z-10 mt-auto p-12 pb-16">
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white">
            Welcome back to {appConfig.name}!
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-blue-100">
            Login and continue where you left off. You will be signed in based on
            your roles and permissions.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex w-full items-center justify-center bg-[#f4f7fb] px-6 py-12 lg:w-1/2">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]"
          aria-hidden
        >
          <img
            src="/stackly-logo.jpg"
            alt=""
            className="h-48 w-auto max-w-[420px] object-contain select-none"
          />
        </div>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}
