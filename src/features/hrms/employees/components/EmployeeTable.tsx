import { useNavigate } from 'react-router-dom'
import { DataTable, type Column } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { Employee } from '../types/employee.types'
import { STATUS_VARIANT_MAP, EMPLOYMENT_TYPE_LABELS } from '../constants/employee.constants'
import { formatDate } from '@/lib/utils/formatDate'
import { ROUTES } from '@/lib/constants/routes'

interface EmployeeTableProps {
  employees: Employee[]
  isLoading?: boolean
}

export function EmployeeTable({ employees, isLoading }: EmployeeTableProps) {
  const navigate = useNavigate()

  const columns: Column<Employee>[] = [
    {
      key: 'employeeId',
      header: 'ID',
      cell: (emp) => <span className="font-mono text-sm">{emp.employeeId}</span>,
      className: 'w-[100px]',
    },
    {
      key: 'name',
      header: 'Name',
      cell: (emp) => (
        <div>
          <p className="font-medium">{emp.fullName}</p>
          <p className="text-sm text-muted-foreground">{emp.email}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      cell: (emp) => emp.department,
    },
    {
      key: 'designation',
      header: 'Designation',
      cell: (emp) => emp.designation,
    },
    {
      key: 'type',
      header: 'Type',
      cell: (emp) => EMPLOYMENT_TYPE_LABELS[emp.employmentType],
    },
    {
      key: 'joiningDate',
      header: 'Joined',
      cell: (emp) => formatDate(emp.joiningDate),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (emp) => (
        <StatusBadge
          status={STATUS_VARIANT_MAP[emp.status]}
          label={emp.status.replace('_', ' ')}
        />
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={employees}
      isLoading={isLoading}
      emptyMessage="No employees found"
      onRowClick={(emp) => navigate(ROUTES.HRMS.EMPLOYEE_DETAIL(emp.id))}
    />
  )
}
