import { useEffect, useMemo, useState } from 'react'
import { FileSpreadsheet, FileText, Search } from 'lucide-react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { getPerformanceReport } from '@/api/performanceReportApi'
import type { PerformanceRecord } from '@/api/performanceReportApi'

export function PerformanceReports() {
  const [performanceRecords, setPerformanceRecords] = useState<
    PerformanceRecord[]
  >([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [performanceLevel, setPerformanceLevel] = useState('')
  const [reviewYear, setReviewYear] = useState('')

  const [loadedReviewYear, setLoadedReviewYear] = useState('')

  // Load performance records
  useEffect(() => {
    const loadPerformanceReport = async () => {
      try {
        setLoading(true)

        const data = await getPerformanceReport()

        setPerformanceRecords(data)
      } catch (error) {
        console.error('Failed to load performance report:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPerformanceReport()
  }, [])

  // Get unique departments
  const departments = useMemo(() => {
    return Array.from(
      new Set(performanceRecords.map((record) => record.department)),
    )
  }, [performanceRecords])

  // Get unique review years
  const reviewYears = useMemo(() => {
    return Array.from(
      new Set(performanceRecords.map((record) => record.reviewYear)),
    ).sort()
  }, [performanceRecords])

  // Filter records
  const filteredRecords = useMemo(() => {
    return performanceRecords.filter((record) => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(search.toLowerCase())

      const matchesDepartment =
        !department || record.department === department

      const matchesPerformanceLevel =
        !performanceLevel ||
        record.performanceLevel === performanceLevel

      const matchesReviewYear =
        !loadedReviewYear || record.reviewYear === loadedReviewYear

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesPerformanceLevel &&
        matchesReviewYear
      )
    })
  }, [
    performanceRecords,
    search,
    department,
    performanceLevel,
    loadedReviewYear,
  ])

  // Summary values
  const totalEmployees = filteredRecords.length

  const excellentCount = filteredRecords.filter(
    (record) => record.performanceLevel === 'Excellent',
  ).length

  const goodCount = filteredRecords.filter(
    (record) => record.performanceLevel === 'Good',
  ).length

  const needsImprovementCount = filteredRecords.filter(
    (record) => record.performanceLevel === 'Needs Improvement',
  ).length

  // Load button
  const handleLoad = () => {
    setLoadedReviewYear(reviewYear)
  }

  // Reset button
  const handleReset = () => {
    setSearch('')
    setDepartment('')
    setPerformanceLevel('')
    setReviewYear('')
    setLoadedReviewYear('')
  }

  // Export Excel
  const handleExportExcel = () => {
    const exportData = filteredRecords.map((record) => ({
      'Employee ID': record.employeeId,
      'Employee Name': record.employeeName,
      Department: record.department,
      Designation: record.designation,
      'Review Year': record.reviewYear,
      'Review Date': record.reviewDate,
      Rating: record.rating,
      'Performance Level': record.performanceLevel,
      'Goals Completed': record.goalsCompleted,
      'Total Goals': record.totalGoals,
      Reviewer: record.reviewer,
      Comments: record.comments,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Performance Report',
    )

    XLSX.writeFile(workbook, 'Performance_Report.xlsx')
  }

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape')

    doc.setFontSize(16)
    doc.text('Performance Report', 14, 15)

    autoTable(doc, {
      startY: 22,
      head: [
        [
          'Employee ID',
          'Employee Name',
          'Department',
          'Designation',
          'Year',
          'Rating',
          'Level',
          'Goals',
          'Reviewer',
        ],
      ],
      body: filteredRecords.map((record) => [
        record.employeeId,
        record.employeeName,
        record.department,
        record.designation,
        record.reviewYear,
        record.rating,
        record.performanceLevel,
        `${record.goalsCompleted}/${record.totalGoals}`,
        record.reviewer,
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fontSize: 8,
      },
    })

    doc.save('Performance_Report.pdf')
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Performance Reports
        </h1>

        <p className="text-sm text-muted-foreground">
          View and analyze employee performance records
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Employees
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {totalEmployees}
          </h2>
        </div>

        {/* Excellent */}
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Excellent
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {excellentCount}
          </h2>
        </div>

        {/* Good */}
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Good
          </p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {goodCount}
          </h2>
        </div>

        {/* Needs Improvement */}
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Needs Improvement
          </p>

          <h2 className="mt-2 text-2xl font-bold text-red-600">
            {needsImprovementCount}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Search
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Employee name or ID"
                className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Department
            </label>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Departments</option>

              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Performance Level */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Performance Level
            </label>

            <select
              value={performanceLevel}
              onChange={(e) => setPerformanceLevel(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Levels</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Needs Improvement">
                Needs Improvement
              </option>
            </select>
          </div>

          {/* Review Year */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Review Year
            </label>

            <select
              value={reviewYear}
              onChange={(e) => setReviewYear(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Years</option>

              {reviewYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleLoad}
            className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Load
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Report List */}
      <div className="rounded-lg border bg-card shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Performance List
            </h2>

            <p className="text-sm text-muted-foreground">
              {filteredRecords.length} record
              {filteredRecords.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={filteredRecords.length === 0}
              className="flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={filteredRecords.length === 0}
              className="flex items-center gap-2 rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Loading performance records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No performance records found.
            </div>
          ) : (
            <table className="w-full min-w-[1200px] text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">
                    Employee ID
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Employee Name
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Department
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Designation
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Review Year
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Rating
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Performance Level
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Goals
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Review Date
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Reviewer
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Comments
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      {record.employeeId}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {record.employeeName}
                    </td>

                    <td className="px-4 py-3">
                      {record.department}
                    </td>

                    <td className="px-4 py-3">
                      {record.designation}
                    </td>

                    <td className="px-4 py-3">
                      {record.reviewYear}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      ⭐ {record.rating}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          record.performanceLevel === 'Excellent'
                            ? 'bg-green-100 text-green-700'
                            : record.performanceLevel === 'Good'
                              ? 'bg-blue-100 text-blue-700'
                              : record.performanceLevel === 'Average'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {record.performanceLevel}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {record.goalsCompleted}/{record.totalGoals}
                    </td>

                    <td className="px-4 py-3">
                      {record.reviewDate}
                    </td>

                    <td className="px-4 py-3">
                      {record.reviewer}
                    </td>

                    <td className="max-w-[250px] px-4 py-3">
                      {record.comments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}