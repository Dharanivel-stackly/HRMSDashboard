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
import {
  CORRECTION_TYPE_LABELS,
  DEPARTMENTS,
} from '../constants/attendance.constants'
import { correctionFormSchema, type CorrectionFormData } from '../validation/attendance.schema'
import type { CorrectionRequest } from '../types/attendance.types'

interface CorrectionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (correction: CorrectionRequest) => void
}

const departmentOptions = DEPARTMENTS.filter((d) => d !== 'All Departments')

export function CorrectionFormDialog({
  open,
  onOpenChange,
  onSubmit,
}: CorrectionFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CorrectionFormData>({
    resolver: zodResolver(correctionFormSchema),
    defaultValues: {
      employeeName: '',
      department: departmentOptions[0],
      attendanceDate: new Date().toISOString().slice(0, 10),
      existingCheckIn: '',
      existingCheckOut: '',
      requestedCheckIn: '',
      requestedCheckOut: '',
      correctionType: 'check_in',
      reason: '',
      attachmentName: '',
      approver: 'Jordan HR',
    },
  })

  const handleFormSubmit = (data: CorrectionFormData) => {
    onSubmit({
      id: `corr-${Date.now()}`,
      employeeId: `emp-${Date.now()}`,
      employeeName: data.employeeName,
      department: data.department,
      attendanceDate: data.attendanceDate,
      existingCheckIn: data.existingCheckIn || null,
      existingCheckOut: data.existingCheckOut || null,
      requestedCheckIn: data.requestedCheckIn || null,
      requestedCheckOut: data.requestedCheckOut || null,
      correctionType: data.correctionType,
      reason: data.reason,
      attachmentName: data.attachmentName || undefined,
      approver: data.approver,
      status: 'pending',
      submittedAt: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })
    reset()
    onOpenChange(false)
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New Correction Request</DialogTitle>
          <DialogDescription>
            Submit a correction for incorrect check-in, check-out or missed punch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="employeeName">Employee Name</Label>
              <Input id="employeeName" placeholder="Full name" {...register('employeeName')} />
              {errors.employeeName && (
                <p className="text-sm text-destructive">{errors.employeeName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={watch('department')}
                onValueChange={(v) => setValue('department', v ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendanceDate">Attendance Date</Label>
              <Input id="attendanceDate" type="date" {...register('attendanceDate')} />
            </div>
            <div className="space-y-2">
              <Label>Correction Type</Label>
              <Select
                value={watch('correctionType')}
                onValueChange={(v) =>
                  setValue('correctionType', (v as CorrectionFormData['correctionType']) ?? 'check_in')
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CORRECTION_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approver">Approver</Label>
              <Input id="approver" {...register('approver')} />
              {errors.approver && (
                <p className="text-sm text-destructive">{errors.approver.message}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-brand-soft/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Existing vs Requested Times
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="existingCheckIn">Existing Check-in</Label>
                <Input id="existingCheckIn" type="time" {...register('existingCheckIn')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="existingCheckOut">Existing Check-out</Label>
                <Input id="existingCheckOut" type="time" {...register('existingCheckOut')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedCheckIn">Requested Check-in</Label>
                <Input id="requestedCheckIn" type="time" {...register('requestedCheckIn')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedCheckOut">Requested Check-out</Label>
                <Input id="requestedCheckOut" type="time" {...register('requestedCheckOut')} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <textarea
              id="reason"
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              placeholder="Explain why this correction is needed..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Supporting Document (optional)</Label>
            <Input
              id="attachment"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setValue('attachmentName', file?.name ?? '')
              }}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
