import { useParams, useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmployeeForm } from '@/features/hrms/employees/components/EmployeeForm'
import { useEmployee, useUpdateEmployee } from '@/features/hrms/employees/hooks/useEmployee'
import type { EmployeeFormData } from '@/features/hrms/employees/types/employee.types'
import { ROUTES } from '@/lib/constants/routes'

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: employee, isLoading, isError, refetch } = useEmployee(id!)
  const { mutate, isPending } = useUpdateEmployee(id!)

  if (isLoading) return <LoadingState variant="page" />
  if (isError || !employee) return <ErrorState onRetry={refetch} />

  const handleSubmit = (data: EmployeeFormData) => {
    mutate(data, {
      onSuccess: () => navigate(ROUTES.HRMS.EMPLOYEE_DETAIL(id!)),
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Employee"
        description={`Editing ${employee.fullName}`}
      />
      <EmployeeForm
        defaultValues={employee}
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Update Employee"
      />
    </PageContainer>
  )
}
