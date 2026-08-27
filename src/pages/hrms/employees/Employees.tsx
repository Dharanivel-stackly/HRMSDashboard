import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { EmployeeTable } from '@/features/hrms/employees/components/EmployeeTable'
import { EmployeeFiltersBar } from '@/features/hrms/employees/components/EmployeeFilters'
import { useEmployees } from '@/features/hrms/employees/hooks/useEmployees'
import type { EmployeeFilters } from '@/features/hrms/employees/types/employee.types'
import { ROUTES } from '@/lib/constants/routes'
import { ErrorState } from '@/components/common/ErrorState'
import { appConfig } from '@/config/app.config'

export default function Employees() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<EmployeeFilters>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(appConfig.pagination.defaultPageSize)

  const { data, isLoading, isError, refetch } = useEmployees({
    ...filters,
    page,
    limit: pageSize,
  })

  const totalItems = data?.meta?.total ?? 0
  const totalPages = data?.meta?.totalPages ?? 1

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1)
    }
  }, [page, totalPages])

  const handleFilterChange = useCallback((newFilters: EmployeeFilters) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Employees"
        description="Manage your organization's employees"
        actions={
          <Button onClick={() => navigate(ROUTES.HRMS.EMPLOYEE_NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        }
      />

      <EmployeeFiltersBar filters={filters} onFilterChange={handleFilterChange} />

      <EmployeeTable employees={data?.data ?? []} isLoading={isLoading} />

      {data?.meta && totalItems > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </PageContainer>
  )
}
