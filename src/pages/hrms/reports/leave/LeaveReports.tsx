import { useEffect, useMemo, useState } from 'react'
import {
  FileSpreadsheet,
  FileText,
  //   RotateCcw,
  Search,
} from 'lucide-react'

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import type { LeaveRecord } from '@/api/leaveReportApi'

import { getLeaveReport } from '@/api/leaveReportApi'

import { Button } from '@/components/ui/button'

const LeaveReports = () => {
  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [leaveRecords, setLeaveRecords] = useState<
    LeaveRecord[]
  >([])

  const [loading, setLoading] = useState(true)

  // Search and dropdown filters
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [leaveType, setLeaveType] = useState('all')
  const [status, setStatus] = useState('all')

  // Date input values
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Dates applied after clicking Load
  const [loadedStartDate, setLoadedStartDate] =
    useState('')

  const [loadedEndDate, setLoadedEndDate] =
    useState('')

  // --------------------------------------------------
  // Load Leave Data
  // --------------------------------------------------

  useEffect(() => {
    const loadLeaveReport = async () => {
      try {
        const data = await getLeaveReport()

        setLeaveRecords(data)
      } catch (error) {
        console.error(
          'Failed to load leave report:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadLeaveReport()
  }, [])

  // --------------------------------------------------
  // Get Departments
  // --------------------------------------------------

  const departments = useMemo(() => {
    return [
      ...new Set(
        leaveRecords.map(
          (item) => item.department,
        ),
      ),
    ]
  }, [leaveRecords])

  // --------------------------------------------------
  // Filter Leave Records
  // --------------------------------------------------

  const filteredLeaveRecords = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase()

    return leaveRecords.filter((item) => {
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

      // Leave type filter
      const matchesLeaveType =
        leaveType === 'all' ||
        item.leaveType === leaveType

      // Status filter
      const matchesStatus =
        status === 'all' ||
        item.status === status

      // Start date filter
      const matchesStartDate =
        !loadedStartDate ||
        item.fromDate >= loadedStartDate

      // End date filter
      const matchesEndDate =
        !loadedEndDate ||
        item.toDate <= loadedEndDate

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesLeaveType &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      )
    })
  }, [
    leaveRecords,
    search,
    department,
    leaveType,
    status,
    loadedStartDate,
    loadedEndDate,
  ])

  // --------------------------------------------------
  // Summary Counts
  // --------------------------------------------------

  const totalRequests =
    leaveRecords.length

  const approvedCount =
    filteredLeaveRecords.filter(
      (item) => item.status === 'Approved',
    ).length

  const pendingCount =
    filteredLeaveRecords.filter(
      (item) => item.status === 'Pending',
    ).length

  const rejectedCount =
    filteredLeaveRecords.filter(
      (item) => item.status === 'Rejected',
    ).length

  // --------------------------------------------------
  // Load Button
  // --------------------------------------------------

  const handleLoad = () => {
    setLoadedStartDate(startDate)
    setLoadedEndDate(endDate)
  }

  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const resetFilters = () => {
    setSearch('')
    setDepartment('all')
    setLeaveType('all')
    setStatus('all')

    setStartDate('')
    setEndDate('')

    setLoadedStartDate('')
    setLoadedEndDate('')
  }

  // --------------------------------------------------
  // Export Excel
  // --------------------------------------------------

  const exportExcel = () => {
    if (
      filteredLeaveRecords.length === 0
    ) {
      return
    }

    const data =
      filteredLeaveRecords.map(
        (item) => ({
          'Employee ID': item.employeeId,
          'Employee Name': item.employeeName,
          Department: item.department,
          'Leave Type': item.leaveType,
          'From Date': item.fromDate,
          'To Date': item.toDate,
          'Total Days': item.totalDays,
          Reason: item.reason,
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
      'Leave Report',
    )

    XLSX.writeFile(
      workbook,
      'leave-report.xlsx',
    )
  }

  // --------------------------------------------------
  // Export PDF
  // --------------------------------------------------

  const exportPDF = () => {
    if (
      filteredLeaveRecords.length === 0
    ) {
      return
    }

    const doc = new jsPDF('landscape')

    doc.setFontSize(18)

    doc.text(
      'Leave Report',
      14,
      15,
    )

    doc.setFontSize(10)

    doc.text(
      `${filteredLeaveRecords.length} leave requests found`,
      14,
      22,
    )

    const tableData =
      filteredLeaveRecords.map(
        (item) => [
          item.employeeId,
          item.employeeName,
          item.department,
          item.leaveType,
          item.fromDate,
          item.toDate,
          item.totalDays.toString(),
          item.reason,
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
          'Leave Type',
          'From Date',
          'To Date',
          'Total Days',
          'Reason',
          'Status',
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
    })

    doc.save(
      'leave-report.pdf',
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
          Leave Reports
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and filter employee leave information
        </p>
      </div>

      {/* -------------------------------------------- */}
      {/* Summary Cards */}
      {/* -------------------------------------------- */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Requests */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Total Requests
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalRequests}
          </p>
        </div>

        {/* Approved */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Approved
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {approvedCount}
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

        {/* Rejected */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Rejected
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {rejectedCount}
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

          {/* Leave Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">
              Leave Type
            </label>

            <select
              value={leaveType}
              onChange={(e) =>
                setLeaveType(e.target.value)
              }
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Leave Types
              </option>

              <option value="Casual Leave">
                Casual Leave
              </option>

              <option value="Sick Leave">
                Sick Leave
              </option>

              <option value="Earned Leave">
                Earned Leave
              </option>

              <option value="Unpaid Leave">
                Unpaid Leave
              </option>

              <option value="Maternity Leave">
                Maternity Leave
              </option>
            </select>
          </div>

          {/* Status */}
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

              <option value="Approved">
                Approved
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Date Filters */}
        {/* ------------------------------------------ */}

        <div className="mt-4 flex flex-wrap items-end gap-4">

          {/* Start Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="h-11 w-[190px] rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="h-11 w-[190px] rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Load Button */}
          <Button
            type="button"
            onClick={handleLoad}
            className="h-11 rounded-md bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Load
          </Button>

          {/* Reset Button */}
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
      {/* Leave List */}
      {/* -------------------------------------------- */}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

        {/* List Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Leave List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredLeaveRecords.length}{' '}
              leave requests found
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">

            {/* Excel */}
            <Button
              type="button"
              onClick={exportExcel}
              disabled={
                filteredLeaveRecords.length === 0
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
                filteredLeaveRecords.length === 0
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
              Loading leave records...
            </div>
          ) : (
            <table className="w-full min-w-[1200px] text-left text-sm">

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
                    Leave Type
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    From Date
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    To Date
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Total Days
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Reason
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Status
                  </th>

                </tr>

              </thead>

              {/* Table Body */}
              <tbody>

                {filteredLeaveRecords.length > 0 ? (

                  filteredLeaveRecords.map(
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
                          {item.leaveType}
                        </td>

                        <td className="px-4 py-3">
                          {item.fromDate}
                        </td>

                        <td className="px-4 py-3">
                          {item.toDate}
                        </td>

                        <td className="px-4 py-3">
                          {item.totalDays}
                        </td>

                        <td className="px-4 py-3">
                          {item.reason}
                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${item.status ===
                                'Approved'
                                ? 'bg-green-100 text-green-700'
                                : item.status ===
                                  'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
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
                      colSpan={9}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No leave records found
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

export default LeaveReports