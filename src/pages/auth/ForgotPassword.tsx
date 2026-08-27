import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import type { ForgotPasswordFormData } from '@/features/auth/validation/auth.schema'
import { authService } from '@/features/auth/services/authService'
import { ROUTES } from '@/lib/constants/routes'
import { appConfig } from '@/config/app.config'
import { Button } from '@/components/ui/button'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword(data)
      setIsSuccess(true)
    } catch {
      // Error handled by API client interceptor
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#0b3d91] via-[#1565c0] to-[#0d47a1] lg:flex">
        <div className="relative z-10 mt-auto p-12 pb-16">
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white">
            Reset your password
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-blue-100">
            Enter your email and we&apos;ll send a secure link to restore access to{' '}
            {appConfig.name}.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#f4f7fb] px-6 py-12 lg:w-1/2">
        {isSuccess ? (
          <div className="w-full max-w-md space-y-4 text-center">
            <img
              src="/stackly-logo.jpg"
              alt="Stackly"
              className="mx-auto mb-2 h-14 w-auto max-w-[200px] object-contain"
            />
            <h2 className="text-2xl font-bold text-[#0b3d91]">Check your email</h2>
            <p className="text-muted-foreground">
              If an account exists, we&apos;ve sent a password reset link.
            </p>
            <Button asChild className="mt-2">
              <Link to={ROUTES.LOGIN}>Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}
