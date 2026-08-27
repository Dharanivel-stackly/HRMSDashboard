import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/features/auth/validation/auth.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/lib/constants/routes'
import { appConfig } from '@/config/app.config'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading?: boolean
  error?: string | null
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="mb-8 text-center">
        <img
          src="/stackly-logo.jpg"
          alt="Stackly"
          className="mx-auto mb-4 h-14 w-auto max-w-[200px] object-contain"
        />
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          {appConfig.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{appConfig.description}</p>
      </div>

      <h2 className="mb-6 text-center text-xl font-semibold text-foreground">
        Login to Platform
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Username
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            className="h-11 rounded-lg border-border bg-white"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="h-11 rounded-lg border-border bg-white pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          className="h-11 w-full rounded-lg text-base font-semibold shadow-md shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Forgot Password?{' '}
        <Link to={ROUTES.FORGOT_PASSWORD} className="font-semibold text-primary hover:underline">
          Click Here
        </Link>
      </p>
    </div>
  )
}
