import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { EmployeeForm } from '@/features/hrms/employees/components/EmployeeForm'
import { useCreateEmployee } from '@/features/hrms/employees/hooks/useEmployee'
import type { EmployeeFormData } from '@/features/hrms/employees/types/employee.types'
import { ROUTES } from '@/lib/constants/routes'

export default function AddEmployee() {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateEmployee()

  const handleSubmit = (data: EmployeeFormData) => {
    mutate(data, {
      onSuccess: () => navigate(ROUTES.HRMS.EMPLOYEES),
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Add Employee"
        description="Create a new employee record"
      />
      <EmployeeForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Create Employee" />
    </PageContainer>
  )
}
