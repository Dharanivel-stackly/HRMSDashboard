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
import { BRANCHES, HOLIDAY_TYPE_LABELS } from '../constants/attendance.constants'
import { holidayFormSchema, type HolidayFormData } from '../validation/attendance.schema'
import type { Holiday } from '../types/attendance.types'

interface HolidayFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (holiday: Holiday) => void
}

const branchOptions = BRANCHES.filter((b) => b !== 'All Branches')

export function HolidayFormDialog({ open, onOpenChange, onSubmit }: HolidayFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HolidayFormData>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      name: '',
      date: '',
      type: 'public',
      branch: branchOptions[0],
      companyWide: true,
      published: false,
    },
  })

  const handleFormSubmit = (data: HolidayFormData) => {
    onSubmit({
      id: `hol-${Date.now()}`,
      name: data.name,
      date: data.date,
      type: data.type,
      branch: data.companyWide ? 'All Branches' : data.branch,
      companyWide: data.companyWide,
      published: data.published,
    })
    reset()
    onOpenChange(false)
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  const companyWide = watch('companyWide')

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Holiday</DialogTitle>
          <DialogDescription>
            Create a holiday and publish it for attendance calculation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Holiday Name</Label>
            <Input id="name" placeholder="e.g. Independence Day" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Holiday Type</Label>
              <Select
                value={watch('type')}
                onValueChange={(v) => setValue('type', (v as HolidayFormData['type']) ?? 'public')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(HOLIDAY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="companyWide"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register('companyWide')}
            />
            <Label htmlFor="companyWide" className="font-normal">
              Company-wide holiday
            </Label>
          </div>

          {!companyWide && (
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select
                value={watch('branch')}
                onValueChange={(v) => setValue('branch', v ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register('published')}
            />
            <Label htmlFor="published" className="font-normal">
              Publish immediately
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Holiday</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
