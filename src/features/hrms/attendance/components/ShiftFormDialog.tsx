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
import { DEPARTMENTS } from '../constants/attendance.constants'
import { shiftFormSchema, type ShiftFormData } from '../validation/attendance.schema'
import type { CreateShiftPayload, Shift } from '../types/attendance.types'

interface ShiftFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateShiftPayload) => void | Promise<void>
  isLoading?: boolean
  shift?: Shift | null
}

const departmentOptions = DEPARTMENTS.filter((d) => d !== 'All Departments')

const emptyDefaults: ShiftFormData = {
  code: '',
  name: '',
  startTime: '09:00',
  endTime: '18:00',
  crossMidnight: false,
  graceMinutes: 15,
  breakMinutes: 45,
  minWorkHours: 8,
  halfDayThreshold: 4,
  overtimeThreshold: 8.5,
  departments: departmentOptions[0],
  effectiveDate: new Date().toISOString().slice(0, 10),
  status: 'active',
}

export function ShiftFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  shift,
}: ShiftFormDialogProps) {
  const isEdit = Boolean(shift)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShiftFormData>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: emptyDefaults,
  })

  useEffect(() => {
    if (!open) return

    if (shift) {
      reset({
        code: shift.code,
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        crossMidnight: shift.crossMidnight,
        graceMinutes: shift.graceMinutes,
        breakMinutes: shift.breakMinutes,
        minWorkHours: shift.minWorkHours,
        halfDayThreshold: shift.halfDayThreshold,
        overtimeThreshold: shift.overtimeThreshold,
        departments: shift.departments[0] ?? departmentOptions[0],
        effectiveDate: shift.effectiveDate,
        status: shift.status,
      })
      return
    }

    reset(emptyDefaults)
  }, [open, shift, reset])

  const handleFormSubmit = async (data: ShiftFormData) => {
    await onSubmit({
      code: data.code.toUpperCase(),
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      crossMidnight: data.crossMidnight,
      graceMinutes: data.graceMinutes,
      breakMinutes: data.breakMinutes,
      minWorkHours: data.minWorkHours,
      halfDayThreshold: data.halfDayThreshold,
      overtimeThreshold: data.overtimeThreshold,
      departments: data.departments.split(',').map((d) => d.trim()).filter(Boolean),
      effectiveDate: data.effectiveDate,
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
          <DialogTitle>{isEdit ? 'Edit Shift' : 'Create Shift'}</DialogTitle>
          <DialogDescription>
            Configure shift timing, grace period, break and overtime rules.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Shift Code</Label>
              <Input id="code" placeholder="GEN" {...register('code')} />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Shift Name</Label>
              <Input id="name" placeholder="General" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" {...register('startTime')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" {...register('endTime')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graceMinutes">Grace Period (min)</Label>
              <Input id="graceMinutes" type="number" {...register('graceMinutes')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakMinutes">Break Duration (min)</Label>
              <Input id="breakMinutes" type="number" {...register('breakMinutes')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minWorkHours">Min Work Hours</Label>
              <Input id="minWorkHours" type="number" step="0.5" {...register('minWorkHours')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="halfDayThreshold">Half-day Threshold (h)</Label>
              <Input id="halfDayThreshold" type="number" step="0.5" {...register('halfDayThreshold')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overtimeThreshold">Overtime After (h)</Label>
              <Input id="overtimeThreshold" type="number" step="0.5" {...register('overtimeThreshold')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input id="effectiveDate" type="date" {...register('effectiveDate')} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Department(s)</Label>
              <Select
                value={watch('departments')}
                onValueChange={(v) => setValue('departments', v ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departments && (
                <p className="text-sm text-destructive">{errors.departments.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(v) => setValue('status', (v as ShiftFormData['status']) ?? 'active')}
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
            <div className="flex items-center gap-2 pt-6">
              <input
                id="crossMidnight"
                type="checkbox"
                className="h-4 w-4 rounded border-input"
                {...register('crossMidnight')}
              />
              <Label htmlFor="crossMidnight" className="font-normal">
                Cross-midnight shift
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Shift'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
