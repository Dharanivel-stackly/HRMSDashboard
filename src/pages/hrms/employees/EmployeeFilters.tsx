import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type EmployeeFilterValues = {
  id: string
  name: string
  department: string
  designation: string
  type: string
  joined: string
  status: string
}

type Props = {
  value: EmployeeFilterValues
  onChange: (value: EmployeeFilterValues) => void
}

const emptyFilters: EmployeeFilterValues = {
  id: '',
  name: '',
  department: '',
  designation: '',
  type: 'all',
  joined: '',
  status: 'all',
}

export function EmployeeFilters({ value, onChange }: Props) {
  const setFilter = (key: keyof EmployeeFilterValues, filterValue: string) =>
    onChange({ ...value, [key]: filterValue })

  const clearFilters = () => onChange(emptyFilters)

  const hasFilters = Object.entries(value).some(
    ([key, filterValue]) =>
      filterValue !== '' &&
      !(key === 'type' && filterValue === 'all') &&
      !(key === 'status' && filterValue === 'all'),
  )

  return (
    <div className="mb-6 grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        placeholder="Employee ID"
        value={value.id}
        onChange={(e) => setFilter('id', e.target.value)}
      />

      <Input
        placeholder="Name"
        value={value.name}
        onChange={(e) => setFilter('name', e.target.value)}
      />

      <Input
        placeholder="Department"
        value={value.department}
        onChange={(e) => setFilter('department', e.target.value)}
      />

      <Input
        placeholder="Designation"
        value={value.designation}
        onChange={(e) => setFilter('designation', e.target.value)}
      />

      <Select value={value.type} onValueChange={(v) => setFilter('type', v)}>
        <SelectTrigger>
          <SelectValue placeholder="Employee Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="full-time">Full-time</SelectItem>
          <SelectItem value="part-time">Part-time</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="intern">Intern</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={value.joined}
        onChange={(e) => setFilter('joined', e.target.value)}
      />

      <Select value={value.status} onValueChange={(v) => setFilter('status', v)}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="on-leave">On Leave</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        onClick={clearFilters}
        disabled={!hasFilters}
      >
        Clear Filters
      </Button>
    </div>
  )
}
