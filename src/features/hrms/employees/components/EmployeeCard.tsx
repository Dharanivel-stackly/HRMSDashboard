import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { Employee } from '../types/employee.types'
import { STATUS_VARIANT_MAP, EMPLOYMENT_TYPE_LABELS } from '../constants/employee.constants'
import { formatDate } from '@/lib/utils/formatDate'

interface EmployeeCardProps {
  employee: Employee
  onClick?: () => void
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`

  return (
    <Card
      className={onClick ? 'cursor-pointer transition-shadow hover:shadow-md' : ''}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{employee.fullName}</p>
          <p className="text-sm text-muted-foreground">{employee.designation}</p>
        </div>
        <StatusBadge
          status={STATUS_VARIANT_MAP[employee.status]}
          label={employee.status.replace('_', ' ')}
        />
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Department</span>
          <span>{employee.department}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type</span>
          <span>{EMPLOYMENT_TYPE_LABELS[employee.employmentType]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Joined</span>
          <span>{formatDate(employee.joiningDate)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
