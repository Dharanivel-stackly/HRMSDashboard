import { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { MOCK_EMPLOYEES } from '@/lib/mock/mockEmployees'
import { StatusBadge } from '@/components/common/StatusBadge'
import { STATUS_VARIANT_MAP } from '@/features/hrms/employees/constants/employee.constants'
import { Button } from '@/components/ui/button'
import { FileSpreadsheet, FileText } from 'lucide-react'

const EmployeeReports = () => {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState('all')
  const [employmentType, setEmploymentType] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loadedStartDate, setLoadedStartDate] = useState('')
  const [loadedEndDate, setLoadedEndDate] = useState('')

  // Filter employees
  const filteredEmployees = useMemo(() => {
    console.log('Search:', search)
    // console.log('Department:', department)
    // console.log('Status:', status)
    // console.log('Employment Type:', employmentType)
    console.log('All employees:', MOCK_EMPLOYEES)
    return MOCK_EMPLOYEES.filter((employee) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        employee.fullName.toLowerCase().includes(searchValue) ||
        employee.employeeId.toLowerCase().includes(searchValue) ||
        employee.email.toLowerCase().includes(searchValue)

      const matchesDepartment =
        department === 'all' || employee.department === department

      const matchesStatus =
        status === 'all' || employee.status === status

      const matchesEmploymentType =
        employmentType === 'all' ||
        employee.employmentType === employmentType

      const matchesDate =
        (!loadedStartDate ||
          new Date(employee.joiningDate) >= new Date(loadedStartDate)) &&
        (!loadedEndDate ||
          new Date(employee.joiningDate) <= new Date(loadedEndDate))

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesEmploymentType &&
        matchesDate
      )

    })
  }, [search, department, status, employmentType, loadedStartDate, loadedEndDate])

  // Reset filters
  const resetFilters = () => {
    setSearch('')
    setDepartment('all')
    setStatus('all')
    setEmploymentType('all')
    setLoadedStartDate('')
    setLoadedEndDate('')
  }

  // Export Excel
  const exportExcel = () => {
    const data = filteredEmployees.map((employee) => ({
      'Employee ID': employee.employeeId,
      'Employee Name': employee.fullName,
      Email: employee.email,
      Department: employee.department.replace('_', ' '),
      Designation: employee.designation,
      'Employment Type': employee.employmentType.replace('_', ' '),
      Status: employee.status.replace('_', ' '),
      'Joining Date': employee.joiningDate,
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Employee Report'
    )

    XLSX.writeFile(workbook, 'employee-report.xlsx')
  }

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF('landscape')

    // PDF title
    doc.setFontSize(18)
    doc.text('Employee Report', 14, 15)

    // Result count
    doc.setFontSize(10)
    doc.text(
      `Showing ${filteredEmployees.length} of ${MOCK_EMPLOYEES.length} employees`,
      14,
      22
    )

    // Table data
    const tableData = filteredEmployees.map((employee) => [
      employee.employeeId,
      employee.fullName,
      employee.email,
      employee.department.replace('_', ' '),
      employee.designation,
      employee.employmentType.replace('_', ' '),
      employee.status.replace('_', ' '),
      employee.joiningDate,
    ])

    autoTable(doc, {
      startY: 28,

      head: [
        [
          'Employee ID',
          'Employee Name',
          'Email',
          'Department',
          'Designation',
          'Employment Type',
          'Status',
          'Joining Date',
        ],
      ],

      body: tableData,

      styles: {
        fontSize: 8,
        cellPadding: 3,
      },

      headStyles: {
        fontSize: 8,
      },

      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 50 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
        7: { cellWidth: 30 },
      },
    })

    doc.save('employee-report.pdf')
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Employee Reports
        </h1>

        <p className="text-gray-500">
          View and filter employee information
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Total Employees */}
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">
            Total Employees
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {MOCK_EMPLOYEES.length}
          </p>
        </div>

        {/* Active Employees */}
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">
            Active Employees
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {
              MOCK_EMPLOYEES.filter(
                (employee) => employee.status === 'active'
              ).length
            }
          </p>
        </div>

        {/* Report Results */}
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">
            Report Results
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {filteredEmployees.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-white p-4">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          {/* Search */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Search
            </label>

            <input
              type="text"
              placeholder="Name, ID or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
            />
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Department
            </label>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="all">
                All Departments
              </option>

              <option value="engineering">
                Engineering
              </option>

              <option value="product">
                Product
              </option>

              <option value="design">
                Design
              </option>

              <option value="marketing">
                Marketing
              </option>

              <option value="sales">
                Sales
              </option>

              <option value="human_resources">
                Human Resources
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="probation">
                Probation
              </option>

              <option value="on_leave">
                On Leave
              </option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Employment Type
            </label>

            <select
              value={employmentType}
              onChange={(e) =>
                setEmploymentType(e.target.value)
              }
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="all">
                All Types
              </option>

              <option value="full_time">
                Full Time
              </option>

              <option value="part_time">
                Part Time
              </option>

              <option value="contract">
                Contract
              </option>

              <option value="intern">
                Intern
              </option>
            </select>
          </div>
        </div>

        {/* Reset */}
        {/* Date Filters */}
        <div className="mt-4 flex flex-wrap items-end gap-4">

          {/* Start Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border px-3 py-2"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border px-3 py-2"
            />
          </div>

          {/* Load Button */}
          <Button
            onClick={() => {
              setLoadedStartDate(startDate)
              setLoadedEndDate(endDate)
            }}
          >
            Load
          </Button>

          {/* Reset Button */}
          <Button
            onClick={resetFilters}
            variant="danger"

          >
            Reset Filters
          </Button>

        </div>
      </div>

      {/* Employee Table */}
      <div className="rounded-lg border bg-white">

        {/* Table Header / Export Buttons */}
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold">
              Employee List
            </h2>

            <p className="text-sm text-gray-500">
              {filteredEmployees.length} employees found
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">

            {/* Excel */}
            <Button
              variant="success"
              onClick={exportExcel}
              disabled={filteredEmployees.length === 0}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>

            {/* PDF */}
            <Button
              variant="danger"
              onClick={exportPDF}
              disabled={filteredEmployees.length === 0}
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            {/* Table Head */}
            <thead className="border-b bg-gray-50">

              <tr>

                <th className="px-4 py-3 font-medium">
                  Employee ID
                </th>

                <th className="px-4 py-3 font-medium">
                  Employee Name
                </th>

                <th className="px-4 py-3 font-medium">
                  Email
                </th>

                <th className="px-4 py-3 font-medium">
                  Department
                </th>

                <th className="px-4 py-3 font-medium">
                  Designation
                </th>

                <th className="px-4 py-3 font-medium">
                  Employment Type
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

                <th className="px-4 py-3 font-medium">
                  Joining Date
                </th>

              </tr>

            </thead>

            {/* Table Body */}
            <tbody>

              {filteredEmployees.length > 0 ? (

                filteredEmployees.map((employee) => (

                  <tr
                    key={employee.id}
                    className="border-b last:border-b-0"
                  >

                    {/* Employee ID */}
                    <td className="px-4 py-3">
                      {employee.employeeId}
                    </td>

                    {/* Employee Name */}
                    <td className="px-4 py-3 font-medium">
                      {employee.fullName}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      {employee.email}
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3 capitalize">
                      {employee.department.replace('_', ' ')}
                    </td>

                    {/* Designation */}
                    <td className="px-4 py-3">
                      {employee.designation}
                    </td>

                    {/* Employment Type */}
                    <td className="px-4 py-3 capitalize">
                      {employee.employmentType.replace(
                        '_',
                        ' '
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">

                      <StatusBadge
                        status={
                          STATUS_VARIANT_MAP[employee.status]
                        }
                        label={employee.status.replace(
                          '_',
                          ' '
                        )}
                      />

                    </td>

                    {/* Joining Date */}
                    <td className="px-4 py-3">
                      {employee.joiningDate}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No employees found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Result */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredEmployees.length} of{' '}
        {MOCK_EMPLOYEES.length} employees
      </div>

    </div>
  )
}

export default EmployeeReports