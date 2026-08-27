import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Separator } from '@/components/ui/separator'
import type { Employee } from '../types/employee.types'
import { STATUS_VARIANT_MAP, EMPLOYMENT_TYPE_LABELS } from '../constants/employee.constants'
import { formatDate } from '@/lib/utils/formatDate'

interface EmployeeProfileProps {
  employee: Employee
}

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex items-center gap-6 pt-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{employee.fullName}</h2>
            <p className="text-muted-foreground">{employee.designation}</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge
                status={STATUS_VARIANT_MAP[employee.status]}
                label={employee.status.replace('_', ' ')}
              />
              <span className="text-sm text-muted-foreground">
                ID: {employee.employeeId}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Email" value={employee.email} />
            <InfoRow label="Phone" value={employee.phone} />
            <InfoRow label="Gender" value={employee.gender} />
            <InfoRow label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
            {employee.address && (
              <>
                <Separator />
                <InfoRow label="Address" value={employee.address} />
                <InfoRow label="City" value={employee.city || '—'} />
                <InfoRow label="State" value={employee.state || '—'} />
                <InfoRow label="Country" value={employee.country || '—'} />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Department" value={employee.department} />
            <InfoRow label="Designation" value={employee.designation} />
            <InfoRow label="Employment Type" value={EMPLOYMENT_TYPE_LABELS[employee.employmentType]} />
            <InfoRow label="Joining Date" value={formatDate(employee.joiningDate)} />
            <InfoRow label="Reporting To" value={employee.reportingTo || '—'} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  )
}
