import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROLE_LABELS } from '@/lib/constants/roles'
import type { Role } from '@/lib/constants/roles'
import { ROLE_OPTIONS } from '../constants/user.constants'
import { userFormSchema, type UserFormData } from '../validation/user.schema'
import type { CreateUserPayload, ManagedUser } from '../types/user.types'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateUserPayload) => void | Promise<void>
  isLoading?: boolean
  user?: ManagedUser | null
}

const emptyDefaults: UserFormData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  roles: [],
  status: 'active',
}

export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  user,
}: UserFormDialogProps) {
  const isEdit = Boolean(user)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: emptyDefaults,
  })

  const selectedRoles = watch('roles')

  useEffect(() => {
    if (!open) return

    if (user) {
      reset({
        email: user.email,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        status: user.status,
      })
      return
    }

    reset(emptyDefaults)
  }, [open, user, reset])

  const toggleRole = (role: Role) => {
    const nextRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((item) => item !== role)
      : [...selectedRoles, role]
    setValue('roles', nextRoles, { shouldValidate: true })
  }

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit({
      email: data.email,
      password: data.password || '',
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles,
      status: data.status,
    })
    reset(emptyDefaults)
    onOpenChange(false)
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset(emptyDefaults)
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update user details and role-based access. Leave password blank to keep the current one.'
              : 'Create a login account and assign roles to control sidebar and screen access.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="off" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{isEdit ? 'New Password (optional)' : 'Password'}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: isEdit ? false : 'Password is required',
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as UserFormData['status'])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Roles &amp; Access</Label>
            <p className="text-sm text-muted-foreground">
              Selected roles determine which screens appear in the sidebar after login.
            </p>
            <div className="space-y-2 rounded-lg border border-border/60 p-3">
              {ROLE_OPTIONS.map((role) => {
                const checked = selectedRoles.includes(role.value)
                return (
                  <label
                    key={role.value}
                    className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-input"
                      checked={checked}
                      onChange={() => toggleRole(role.value)}
                    />
                    <span>
                      <span className="block text-sm font-medium">{role.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {role.description}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
            {errors.roles && <p className="text-sm text-destructive">{errors.roles.message}</p>}
            {selectedRoles.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Assigned: {selectedRoles.map((role) => ROLE_LABELS[role]).join(', ')}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
