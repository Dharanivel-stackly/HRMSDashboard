import { useParams, useNavigate } from 'react-router-dom'
import { Edit, ArrowLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmployeeProfile } from '@/features/hrms/employees/components/EmployeeProfile'
import { useEmployee } from '@/features/hrms/employees/hooks/useEmployee'
import { ROUTES } from '@/lib/constants/routes'

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: employee, isLoading, isError, refetch } = useEmployee(id!)

  if (isLoading) return <LoadingState variant="page" />
  if (isError || !employee) return <ErrorState onRetry={refetch} />

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(ROUTES.HRMS.EMPLOYEES)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
        <Button onClick={() => navigate(ROUTES.HRMS.EMPLOYEE_EDIT(id!))}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
      <EmployeeProfile employee={employee} />
    </PageContainer>
  )
}
