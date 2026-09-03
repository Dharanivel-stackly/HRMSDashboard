import { useEffect, useMemo, useState } from 'react'
import {
  FileSpreadsheet,
  FileText,
  //RotateCcw,
  Search,
} from 'lucide-react'

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import type {
  AttendanceRecord,
} from '@/api/attendanceReportApi'

import {
  getAttendanceReport,  
} from '@/api/attendanceReportApi'

import { Button } from '@/components/ui/button'

const AttendanceReports = () => {
  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [attendance, setAttendance] = useState<
    AttendanceRecord[]
  >([])

  const [loading, setLoading] = useState(true)

  // Search / dropdown filters
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState('all')

  // Date input values
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Dates actually applied to the report
  // These change only after clicking Load
  const [loadedStartDate, setLoadedStartDate] = useState('')
  const [loadedEndDate, setLoadedEndDate] = useState('')

  // --------------------------------------------------
  // Load Attendance Data
  // --------------------------------------------------

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const data = await getAttendanceReport()

        setAttendance(data)
      } catch (error) {
        console.error(
          'Failed to load attendance report:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadAttendance()
  }, [])

  // --------------------------------------------------
  // Departments
  // --------------------------------------------------

  const departments = useMemo(() => {
    return [
      ...new Set(
        attendance.map(
          (item) => item.department,
        ),
      ),
    ]
  }, [attendance])

  // --------------------------------------------------
  // Filter Attendance
  // --------------------------------------------------

  const filteredAttendance = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase()

    return attendance.filter((item) => {
      // Search
      const matchesSearch =
        item.employeeName
          .toLowerCase()
          .includes(searchValue) ||
        item.employeeId
          .toLowerCase()
          .includes(searchValue)

      // Department
      const matchesDepartment =
        department === 'all' ||
        item.department === department

      // Status
      const matchesStatus =
        status === 'all' ||
        item.status === status

      // Date
      // Uses loaded dates, NOT the input dates.
      // Therefore date filtering happens only
      // after clicking Load.
      const matchesStartDate =
        !loadedStartDate ||
        item.date >= loadedStartDate

      const matchesEndDate =
        !loadedEndDate ||
        item.date <= loadedEndDate

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      )
    })
  }, [
    attendance,
    search,
    department,
    status,
    loadedStartDate,
    loadedEndDate,
  ])

  // --------------------------------------------------
  // Summary Counts
  // --------------------------------------------------

  const totalRecords = attendance.length

  const presentCount =
    filteredAttendance.filter(
      (item) => item.status === 'Present',
    ).length

  const absentCount =
    filteredAttendance.filter(
      (item) => item.status === 'Absent',
    ).length

  const lateCount =
    filteredAttendance.filter(
      (item) => item.status === 'Late',
    ).length

  // --------------------------------------------------
  // Load Date Filter
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
    if (filteredAttendance.length === 0) {
      return
    }

    const data = filteredAttendance.map(
      (item) => ({
        'Employee ID': item.employeeId,
        'Employee Name': item.employeeName,
        Department: item.department,
        Date: item.date,
        'Check In': item.checkIn,
        'Check Out': item.checkOut,
        'Work Hours': item.workHours,
        Status: item.status,
        Overtime: item.overtime,
      }),
    )

    const worksheet =
      XLSX.utils.json_to_sheet(data)

    const workbook =
      XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Attendance Report',
    )

    XLSX.writeFile(
      workbook,
      'attendance-report.xlsx',
    )
  }

  // --------------------------------------------------
  // Export PDF
  // --------------------------------------------------

  const exportPDF = () => {
    if (filteredAttendance.length === 0) {
      return
    }

    const doc = new jsPDF('landscape')

    doc.setFontSize(18)

    doc.text(
      'Attendance Report',
      14,
      15,
    )

    doc.setFontSize(10)

    doc.text(
      `${filteredAttendance.length} attendance records found`,
      14,
      22,
    )

    const tableData =
      filteredAttendance.map(
        (item) => [
          item.employeeId,
          item.employeeName,
          item.department,
          item.date,
          item.checkIn,
          item.checkOut,
          item.workHours,
          item.status,
          item.overtime,
        ],
      )

    autoTable(doc, {
      startY: 28,

      head: [
        [
          'Employee ID',
          'Employee Name',
          'Department',
          'Date',
          'Check In',
          'Check Out',
          'Work Hours',
          'Status',
          'Overtime',
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
      'attendance-report.pdf',
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
          Attendance Reports
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and filter employee attendance information
        </p>
      </div>

      {/* -------------------------------------------- */}
      {/* Summary Cards */}
      {/* -------------------------------------------- */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Records */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Total Records
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalRecords}
          </p>
        </div>

        {/* Present */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Present
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {presentCount}
          </p>
        </div>

        {/* Absent */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Absent
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {absentCount}
          </p>
        </div>

        {/* Late */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Late
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {lateCount}
          </p>
        </div>

      </div>

      {/* -------------------------------------------- */}
      {/* Filters */}
      {/* -------------------------------------------- */}

      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">

        {/* First Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

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

              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Late">
                Late
              </option>

              <option value="Half Day">
                Half Day
              </option>

              <option value="Leave">
                Leave
              </option>
            </select>
          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Date Row */}
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
      {/* Attendance List */}
      {/* -------------------------------------------- */}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Attendance List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredAttendance.length}{' '}
              attendance records found
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">

            {/* Excel */}
            <Button
              type="button"
              onClick={exportExcel}
              disabled={
                filteredAttendance.length === 0
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
                filteredAttendance.length === 0
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
              Loading attendance records...
            </div>
          ) : (
            <table className="w-full min-w-[1100px] text-left text-sm">

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
                    Date
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Check In
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Check Out
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Work Hours
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Status
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Overtime
                  </th>

                </tr>

              </thead>

              {/* Table Body */}
              <tbody>

                {filteredAttendance.length > 0 ? (

                  filteredAttendance.map(
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
                          {item.date}
                        </td>

                        <td className="px-4 py-3">
                          {item.checkIn}
                        </td>

                        <td className="px-4 py-3">
                          {item.checkOut}
                        </td>

                        <td className="px-4 py-3">
                          {item.workHours}
                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              item.status ===
                              'Present'
                                ? 'bg-green-100 text-green-700'
                                : item.status ===
                                  'Absent'
                                  ? 'bg-red-100 text-red-700'
                                  : item.status ===
                                    'Late'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : item.status ===
                                      'Leave'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.status}
                          </span>

                        </td>

                        <td className="px-4 py-3">
                          {item.overtime}
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
                      No attendance records found
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

export default AttendanceReports