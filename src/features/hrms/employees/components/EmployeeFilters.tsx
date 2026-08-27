import { FilterBar } from '@/components/common/FilterBar'
import { SearchInput } from '@/components/common/SearchInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { EmployeeFilters } from '../types/employee.types'
import { DEPARTMENT_OPTIONS, EMPLOYEE_STATUS_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from '../constants/employee.constants'

interface EmployeeFiltersProps {
  filters: EmployeeFilters
  onFilterChange: (filters: EmployeeFilters) => void
}

export function EmployeeFiltersBar({ filters, onFilterChange }: EmployeeFiltersProps) {
  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search })
  }

  const handleClearFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = filters.department || filters.status || filters.employmentType

  return (
    <FilterBar>
      <SearchInput
        placeholder="Search employees..."
        value={filters.search}
        onSearch={handleSearchChange}
        className="w-64"
      />
      <Select
        value={filters.department || ''}
        onValueChange={(val) => onFilterChange({ ...filters, department: val || undefined })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          {DEPARTMENT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status || ''}
        onValueChange={(val) =>
          onFilterChange({ ...filters, status: (val || undefined) as EmployeeFilters['status'] })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {EMPLOYEE_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.employmentType || ''}
        onValueChange={(val) =>
          onFilterChange({ ...filters, employmentType: (val || undefined) as EmployeeFilters['employmentType'] })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </FilterBar>
  )
}
