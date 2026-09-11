import { useEffect, useMemo, useState } from 'react'

import {
  FileSpreadsheet,
  FileText,
  Search,
} from 'lucide-react'

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import type { RecruitmentRecord } from '@/api/recruitmentReportApi'
import { getRecruitmentReport } from '@/api/recruitmentReportApi'

import { Button } from '@/components/ui/button'

const RecruitmentReports = () => {
  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [recruitmentRecords, setRecruitmentRecords] =
    useState<RecruitmentRecord[]>([])

  const [loading, setLoading] = useState(true)

  // Search and dropdown filters
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState('all')

  // Recruitment month
  const [recruitmentMonth, setRecruitmentMonth] =
    useState('')

  // Month applied after clicking Load
  const [loadedRecruitmentMonth, setLoadedRecruitmentMonth] =
    useState('')

  // --------------------------------------------------
  // Load Recruitment Data
  // --------------------------------------------------

  useEffect(() => {
    const loadRecruitmentReport = async () => {
      try {
        const data = await getRecruitmentReport()

        setRecruitmentRecords(data)
      } catch (error) {
        console.error(
          'Failed to load recruitment report:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadRecruitmentReport()
  }, [])

  // --------------------------------------------------
  // Get Departments
  // --------------------------------------------------

  const departments = useMemo(() => {
    return [
      ...new Set(
        recruitmentRecords.map(
          (item) => item.department,
        ),
      ),
    ]
  }, [recruitmentRecords])

  // --------------------------------------------------
  // Filter Recruitment Records
  // --------------------------------------------------

  const filteredRecruitmentRecords = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase()

    return recruitmentRecords.filter((item) => {
      // Search filter
      const matchesSearch =
        item.candidateName
          .toLowerCase()
          .includes(searchValue) ||
        item.candidateId
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

      // Recruitment month filter
      const matchesRecruitmentMonth =
        !loadedRecruitmentMonth ||
        item.recruitmentMonth ===
          loadedRecruitmentMonth

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesRecruitmentMonth
      )
    })
  }, [
    recruitmentRecords,
    search,
    department,
    status,
    loadedRecruitmentMonth,
  ])

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const totalRecords =
    recruitmentRecords.length

  const shortlistedCount =
    filteredRecruitmentRecords.filter(
      (item) => item.status === 'Shortlisted',
    ).length

  const interviewedCount =
    filteredRecruitmentRecords.filter(
      (item) => item.status === 'Interviewed',
    ).length

  const hiredCount =
    filteredRecruitmentRecords.filter(
      (item) => item.status === 'Hired',
    ).length

  // --------------------------------------------------
  // Load Button
  // --------------------------------------------------

  const handleLoad = () => {
    setLoadedRecruitmentMonth(
      recruitmentMonth,
    )
  }

  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const resetFilters = () => {
    setSearch('')
    setDepartment('all')
    setStatus('all')

    setRecruitmentMonth('')
    setLoadedRecruitmentMonth('')
  }

  // --------------------------------------------------
  // Export Excel
  // --------------------------------------------------

  const exportExcel = () => {
    if (
      filteredRecruitmentRecords.length === 0
    ) {
      return
    }

    const data =
      filteredRecruitmentRecords.map(
        (item) => ({
          'Candidate ID': item.candidateId,
          'Candidate Name': item.candidateName,
          Email: item.email,
          Phone: item.phone,
          Department: item.department,
          Position: item.position,
          'Recruitment Month':
            item.recruitmentMonth,
          'Applied Date': item.appliedDate,
          'Interview Date':
            item.interviewDate,
          Source: item.source,
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
      'Recruitment Report',
    )

    XLSX.writeFile(
      workbook,
      'recruitment-report.xlsx',
    )
  }

  // --------------------------------------------------
  // Export PDF
  // --------------------------------------------------

  const exportPDF = () => {
    if (
      filteredRecruitmentRecords.length === 0
    ) {
      return
    }

    const doc = new jsPDF('landscape')

    doc.setFontSize(18)

    doc.text(
      'Recruitment Report',
      14,
      15,
    )

    doc.setFontSize(10)

    doc.text(
      `${filteredRecruitmentRecords.length} recruitment records found`,
      14,
      22,
    )

    const tableData =
      filteredRecruitmentRecords.map(
        (item) => [
          item.candidateId,
          item.candidateName,
          item.department,
          item.position,
          item.recruitmentMonth,
          item.appliedDate,
          item.interviewDate,
          item.source,
          item.status,
        ],
      )

    autoTable(doc, {
      startY: 28,

      head: [
        [
          'Candidate ID',
          'Candidate Name',
          'Department',
          'Position',
          'Month',
          'Applied Date',
          'Interview Date',
          'Source',
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
      'recruitment-report.pdf',
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
          Recruitment Reports
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and filter employee recruitment information
        </p>
      </div>

      {/* -------------------------------------------- */}
      {/* Summary Cards */}
      {/* -------------------------------------------- */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Applications */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Total Applications
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalRecords}
          </p>
        </div>

        {/* Shortlisted */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Shortlisted
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {shortlistedCount}
          </p>
        </div>

        {/* Interviewed */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Interviewed
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {interviewedCount}
          </p>
        </div>

        {/* Hired */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Hired
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {hiredCount}
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

          {/* Recruitment Status */}

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

              <option value="Applied">
                Applied
              </option>

              <option value="Shortlisted">
                Shortlisted
              </option>

              <option value="Interviewed">
                Interviewed
              </option>

              <option value="Hired">
                Hired
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>

          {/* Recruitment Month */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">
              Recruitment Month
            </label>

            <input
              type="month"
              value={recruitmentMonth}
              onChange={(e) =>
                setRecruitmentMonth(
                  e.target.value,
                )
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
      {/* Recruitment List */}
      {/* -------------------------------------------- */}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

        {/* List Header */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recruitment List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredRecruitmentRecords.length}{' '}
              recruitment records found
            </p>
          </div>

          {/* Export Buttons */}

          <div className="flex gap-2">

            {/* Excel */}

            <Button
              type="button"
              onClick={exportExcel}
              disabled={
                filteredRecruitmentRecords.length ===
                0
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
                filteredRecruitmentRecords.length ===
                0
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
              Loading recruitment records...
            </div>
          ) : (
            <table className="w-full min-w-[1400px] text-left text-sm">

              {/* Table Head */}

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Candidate ID
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Candidate Name
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Email
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Phone
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Department
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Position
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Recruitment Month
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Applied Date
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Interview Date
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Source
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-900">
                    Status
                  </th>

                </tr>

              </thead>

              {/* Table Body */}

              <tbody>

                {filteredRecruitmentRecords.length >
                0 ? (

                  filteredRecruitmentRecords.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
                      >

                        <td className="px-4 py-3">
                          {item.candidateId}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-900">
                          {item.candidateName}
                        </td>

                        <td className="px-4 py-3">
                          {item.email}
                        </td>

                        <td className="px-4 py-3">
                          {item.phone}
                        </td>

                        <td className="px-4 py-3">
                          {item.department}
                        </td>

                        <td className="px-4 py-3">
                          {item.position}
                        </td>

                        <td className="px-4 py-3">
                          {item.recruitmentMonth}
                        </td>

                        <td className="px-4 py-3">
                          {item.appliedDate}
                        </td>

                        <td className="px-4 py-3">
                          {item.interviewDate}
                        </td>

                        <td className="px-4 py-3">
                          {item.source}
                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              item.status ===
                              'Hired'
                                ? 'bg-green-100 text-green-700'
                                : item.status ===
                                  'Interviewed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : item.status ===
                                    'Shortlisted'
                                    ? 'bg-purple-100 text-purple-700'
                                    : item.status ===
                                      'Rejected'
                                      ? 'bg-red-100 text-red-700'
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
                      No recruitment records found
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

export default RecruitmentReports