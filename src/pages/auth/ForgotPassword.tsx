import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { OtpVerificationForm } from '@/features/auth/components/OtpVerificationForm'
import type {
  ForgotPasswordFormData,
  OtpFormData,
} from '@/features/auth/validation/auth.schema'
import { authService } from '@/features/auth/services/authService'
import { ROUTES } from '@/lib/constants/routes'
import { appConfig } from '@/config/app.config'
import { Button } from '@/components/ui/button'

const DUMMY_OTP = '123456'
const OTP_STORAGE_KEY = 'forgot-password-otp'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword(data)
     sessionStorage.setItem(OTP_STORAGE_KEY, DUMMY_OTP)
      setEmail(data.email)
      setOtpError(null)
      setShowOtp(true)
    } catch {
      // Error handled by API client interceptor
    } finally {
      setIsLoading(false)
    }
  }


  const handleVerifyOtp = (data: OtpFormData) => {
    const savedOtp = sessionStorage.getItem(OTP_STORAGE_KEY)
    if (data.otp !== savedOtp) {
      setOtpError('Invalid OTP. Please enter the OTP sent to your email.')
      return
    }

    sessionStorage.removeItem(OTP_STORAGE_KEY)
    setOtpError(null)
    setIsSuccess(true)
  }

  const handleChangeEmail = () => {
    sessionStorage.removeItem(OTP_STORAGE_KEY)
    setShowOtp(false)
    setOtpError(null)
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-navy via-[#151a3d] to-brand-blue lg:flex">
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

      <div className="flex w-full items-center justify-center bg-brand-soft px-6 py-12 lg:w-1/2">
        {isSuccess ? (
          <div className="w-full max-w-md space-y-4 text-center">
            <img
              src="/stackly-logo.jpg"
              alt="Stackly"
              className="mx-auto mb-2 h-14 w-auto max-w-[200px] object-contain"
            />
            <h2 className="text-2xl font-bold text-brand-navy">Check your email</h2>
            <p className="text-muted-foreground">
              If an account exists, we&apos;ve sent a password reset link.
            </p>
            <Button asChild className="mt-2">
              <Link to={ROUTES.LOGIN}>Back to sign in</Link>
            </Button>
          </div>
        ) : showOtp ? (
          <OtpVerificationForm
            email={email}
            onSubmit={handleVerifyOtp}
            onBack={handleChangeEmail}
            error={otpError}
          />
        ) : (
          <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}
