import { useEffect, useMemo, useState } from 'react'

import {
  FileSpreadsheet,
  FileText,
  Search,
} from 'lucide-react'

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import type { PayrollRecord } from '@/api/payrollReportApi'
import { getPayrollReport } from '@/api/payrollReportApi'

import { Button } from '@/components/ui/button'

const PayrollReports = () => {
  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [payrollRecords, setPayrollRecords] = useState<
    PayrollRecord[]
  >([])

  const [loading, setLoading] = useState(true)

  // Search and dropdown filters
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState('all')

  // Payroll month
  const [payrollMonth, setPayrollMonth] = useState('')

  // Month applied after clicking Load
  const [loadedPayrollMonth, setLoadedPayrollMonth] =
    useState('')

  // --------------------------------------------------
  // Load Payroll Data
  // --------------------------------------------------

  useEffect(() => {
    const loadPayrollReport = async () => {
      try {
        const data = await getPayrollReport()

        setPayrollRecords(data)
      } catch (error) {
        console.error(
          'Failed to load payroll report:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadPayrollReport()
  }, [])

  // --------------------------------------------------
  // Get Departments
  // --------------------------------------------------

  const departments = useMemo(() => {
    return [
      ...new Set(
        payrollRecords.map(
          (item) => item.department,
        ),
      ),
    ]
  }, [payrollRecords])

  // --------------------------------------------------
  // Filter Payroll Records
  // --------------------------------------------------

  const filteredPayrollRecords = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase()

    return payrollRecords.filter((item) => {
      // Search filter
      const matchesSearch =
        item.employeeName
          .toLowerCase()
          .includes(searchValue) ||
        item.employeeId
          .toLowerCase()
          .includes(searchValue)

      // Department filter
      const matchesDepartment =
        department === 'all' ||
        item.department === department

      // Status filter
      const matchesStatus =
        status === 'all' ||
        item.status === status

      // Payroll month filter
      const matchesPayrollMonth =
        !loadedPayrollMonth ||
        item.payrollMonth === loadedPayrollMonth

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesPayrollMonth
      )
    })
  }, [
    payrollRecords,
    search,
    department,
    status,
    loadedPayrollMonth,
  ])

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const totalRecords =
    payrollRecords.length

  const paidCount =
    filteredPayrollRecords.filter(
      (item) => item.status === 'Paid',
    ).length

  const pendingCount =
    filteredPayrollRecords.filter(
      (item) => item.status === 'Pending',
    ).length

  const totalNetSalary =
    filteredPayrollRecords.reduce(
      (total, item) =>
        total + item.netSalary,
      0,
    )

  // --------------------------------------------------
  // Load Button
  // --------------------------------------------------

  const handleLoad = () => {
    setLoadedPayrollMonth(payrollMonth)
  }

  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const resetFilters = () => {
    setSearch('')
    setDepartment('all')
    setStatus('all')

    setPayrollMonth('')
    setLoadedPayrollMonth('')
  }

  // --------------------------------------------------
  // Format Currency
  // --------------------------------------------------

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // --------------------------------------------------
  // Export Excel
  // --------------------------------------------------

  const exportExcel = () => {
    if (
      filteredPayrollRecords.length === 0
    ) {
      return
    }

    const data =
      filteredPayrollRecords.map(
        (item) => ({
          'Employee ID': item.employeeId,
          'Employee Name': item.employeeName,
          Department: item.department,
          Designation: item.designation,
          'Payroll Month': item.payrollMonth,
          'Basic Salary': item.basicSalary,
          Allowances: item.allowances,
          'Gross Salary': item.grossSalary,
          Deductions: item.deductions,
          'Net Salary': item.netSalary,
          Status: item.status,
        }),
      )

    const worksheet =
      XLSX.utils.json_to_sheet(data)

    const workbook =
      XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Payroll Report',
    )

    XLSX.writeFile(
      workbook,
      'payroll-report.xlsx',
    )
  }

  // --------------------------------------------------
  // Export PDF
  // --------------------------------------------------

  const exportPDF = () => {
    if (
      filteredPayrollRecords.length === 0
    ) {
      return
    }

    const doc = new jsPDF('landscape')

    doc.setFontSize(18)

    doc.text(
      'Payroll Report',
      14,
      15,
    )

    doc.setFontSize(10)

    doc.text(
      `${filteredPayrollRecords.length} payroll records found`,
      14,
      22,
    )

    const tableData =
      filteredPayrollRecords.map(
        (item) => [
          item.employeeId,
          item.employeeName,
          item.department,
          item.payrollMonth,
          formatCurrency(item.basicSalary),
          formatCurrency(item.allowances),
          formatCurrency(item.deductions),
          formatCurrency(item.grossSalary),
          formatCurrency(item.netSalary),
          item.status,
        ],
      )

    autoTable(doc, {
      startY: 28,

      head: [
        [
          'Employee ID',
          'Employee Name',
          'Department',
          'Month',
          'Basic Salary',
          'Allowances',
          'Deductions',
          'Gross Salary',
          'Net Salary',
          'Status',
        ],
      ],

      body: tableData,

      styles: {
        fontSize: 7,
        cellPadding: 3,
      },

      headStyles: {
        fontSize: 7,
      },
    })

    doc.save(
      'payroll-report.pdf',
    )
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="p-6">

      {/* -------------------------------------------- */}
      {/* Page Header */}
      {/* -------------------------------------------- */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Payroll Reports
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and filter employee payroll information
        </p>
      </div>

      {/* -------------------------------------------- */}
      {/* Summary Cards */}
      {/* -------------------------------------------- */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Records */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Total Payroll Records
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalRecords}
          </p>
        </div>

        {/* Paid */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Paid
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {paidCount}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {pendingCount}
          </p>
        </div>

        {/* Total Net Salary */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Total Net Salary
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(totalNetSalary)}
          </p>
        </div>

      </div>

      {/* -------------------------------------------- */}
      {/* Filters */}
      {/* -------------------------------------------- */}

      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">

        {/* First Row */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          {/* Search */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">
              Search
            </label>

            <div className="relative">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Name or ID"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="h-11 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>
          </div>

          {/* Department */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">
              Department
            </label>

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Departments
              </option>

              {departments.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Payroll Status */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Processed">
                Processed
              </option>

              <option value="Pending">
                Pending
              </option>
            </select>
          </div>

          {/* Payroll Month */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">
              Payroll Month
            </label>

            <input
              type="month"
              value={payrollMonth}
              onChange={(e) =>
                setPayrollMonth(e.target.value)
              }
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Buttons */}
        {/* ------------------------------------------ */}

        <div className="mt-4 flex flex-wrap items-end gap-4">

          {/* Load */}

          <Button
            type="button"
            onClick={handleLoad}
            className="h-11 rounded-md bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Load
          </Button>

          {/* Reset */}

          <Button
            type="button"
            onClick={resetFilters}
            className="h-11 rounded-md bg-red-500 px-5 text-sm font-medium text-white hover:bg-red-600"
          >
            Reset Filters
          </Button>

        </div>

      </div>

      {/* -------------------------------------------- */}
      {/* Payroll List */}
      {/* -------------------------------------------- */}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

        {/* List Header */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Payroll List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredPayrollRecords.length}{' '}
              payroll records found
            </p>
          </div>

          {/* Export Buttons */}

          <div className="flex gap-2">

            {/* Excel */}

            <Button
              type="button"
              onClick={exportExcel}
              disabled={
                filteredPayrollRecords.length === 0
              }
              className="flex h-10 items-center gap-2 rounded-md bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet className="h-4 w-4" />

              Export Excel
            </Button>

            {/* PDF */}

            <Button
              type="button"
              onClick={exportPDF}
              disabled={
                filteredPayrollRecords.length === 0
              }
              className="flex h-10 items-center gap-2 rounded-md bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />

              Export PDF
            </Button>

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Table */}
        {/* ------------------------------------------ */}

        <div className="overflow-x-auto">

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading payroll records...
            </div>
          ) : (
            <table className="w-full min-w-[1500px] text-left text-sm">

              {/* Table Head */}

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Employee ID
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Employee Name
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Department
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Designation
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Payroll Month
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Basic Salary
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Allowances
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Deductions
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Gross Salary
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Net Salary
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Status
                  </th>

                </tr>

              </thead>

              {/* Table Body */}

              <tbody>

                {filteredPayrollRecords.length > 0 ? (

                  filteredPayrollRecords.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
                      >

                        <td className="px-4 py-3">
                          {item.employeeId}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-900">
                          {item.employeeName}
                        </td>

                        <td className="px-4 py-3">
                          {item.department}
                        </td>

                        <td className="px-4 py-3">
                          {item.designation}
                        </td>

                        <td className="px-4 py-3">
                          {item.payrollMonth}
                        </td>

                        <td className="px-4 py-3">
                          {formatCurrency(
                            item.basicSalary,
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatCurrency(
                            item.allowances,
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatCurrency(
                            item.deductions,
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatCurrency(
                            item.grossSalary,
                          )}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-900">
                          {formatCurrency(
                            item.netSalary,
                          )}
                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              item.status ===
                              'Paid'
                                ? 'bg-green-100 text-green-700'
                                : item.status ===
                                  'Processed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {item.status}
                          </span>

                        </td>

                      </tr>
                    ),
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={11}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No payroll records found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  )
}

export default PayrollReports