import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/features/auth/validation/auth.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { appConfig } from '@/config/app.config'
import { ROUTES } from '@/lib/constants/routes'

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void
  isLoading?: boolean
}

export function ForgotPasswordForm({ onSubmit, isLoading }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
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

      <h2 className="mb-2 text-center text-xl font-semibold">Reset password</h2>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Enter your email address and we&apos;ll send you a reset link
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            className="h-11 rounded-lg bg-white"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="h-11 w-full rounded-lg text-base font-semibold shadow-md shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember password?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  )
}
