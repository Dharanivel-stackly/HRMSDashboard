import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema, type OtpFormData } from '@/features/auth/validation/auth.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { appConfig } from '@/config/app.config'
import { ROUTES } from '@/lib/constants/routes'

interface OtpVerificationFormProps {
  email: string
  onSubmit: (data: OtpFormData) => void
  onBack: () => void
  error?: string | null
}

export function OtpVerificationForm({
  email,
  onSubmit,
  onBack,
  error,
}: OtpVerificationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <img
          src="/stackly-logo.jpg"
          alt="Stackly"
          className="mx-auto mb-4 h-14 w-auto max-w-[200px] object-contain"
        />
        <h1 className="text-2xl font-bold tracking-tight text-primary">{appConfig.name}</h1>
      </div>

      <h2 className="mb-2 text-center text-xl font-semibold">Verify your email</h2>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Enter the 6-digit OTP sent to <span className="font-medium text-foreground">{email}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP</Label>
          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="h-11 rounded-lg bg-white tracking-[0.35em]"
            {...register('otp')}
          />
          {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
          <p className="text-xs text-muted-foreground">Demo OTP: 123456</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          className="h-11 w-full rounded-lg text-base font-semibold shadow-md shadow-primary/20"
        >
          Verify OTP
        </Button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 block w-full text-center text-sm font-semibold text-primary hover:underline"
      >
        Use a different email
      </button>

      <p className="mt-3 text-center text-sm text-muted-foreground">
        Remember password?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  )
}
