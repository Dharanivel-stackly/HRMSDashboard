import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Payroll() {
  const navigate = useNavigate()
  const location = useLocation()

  const [basicSalary, setBasicSalary] = useState(35000)
  const [allowances, setAllowances] = useState(15000)
  const [deductions, setDeductions] = useState(5000)
  const [tax, setTax] = useState(0)
  const [processed, setProcessed] = useState(false)

  useEffect(() => {
    setProcessed(localStorage.getItem('payrollStatus') === 'Processed')
  }, [location.pathname])

  const grossSalary = basicSalary + allowances
  const netSalary = grossSalary - deductions - tax

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Payroll Management</h1>
          <p className="text-muted-foreground">
            Manage employee payroll, salary details, deductions, tax, and payslips.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border px-4 py-2 font-medium hover:bg-muted"
            onClick={() => navigate('/hrms/payroll/payslip')}
          >
            View Payslip
          </button>

          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground shadow-sm hover:opacity-90"
            onClick={() => {
              setProcessed(true)
              localStorage.setItem('payrollStatus', 'Processed')
            }}
          >
            Process Payroll
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Employee</p>
          <p className="mt-2 text-xl font-semibold">John Doe</p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Pay Period</p>
          <p className="mt-2 text-xl font-semibold">August 2026</p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Gross Salary</p>
          <p className="mt-2 text-xl font-semibold">
            ₹{grossSalary.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Net Salary</p>
          <p className="mt-2 text-xl font-semibold">
            ₹{netSalary.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payroll Details Table */}
      <div className="rounded-lg border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">Payroll Details</h2>
          <p className="text-sm text-muted-foreground">
            Employee salary details for the selected pay period.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-3 py-3 font-medium">Employee</th>
                <th className="px-3 py-3 font-medium">Pay Period</th>
                <th className="px-3 py-3 font-medium">Basic Salary</th>
                <th className="px-3 py-3 font-medium">Allowances</th>
                <th className="px-3 py-3 font-medium">Deductions</th>
                <th className="px-3 py-3 font-medium">Tax</th>
                <th className="px-3 py-3 font-medium">Net Salary</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="px-3 py-3">John Doe</td>
                <td className="px-3 py-3">August 2026</td>
                <td className="px-3 py-3">
                  ₹{basicSalary.toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  ₹{allowances.toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  ₹{deductions.toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  ₹{tax.toLocaleString()}
                </td>
                <td className="px-3 py-3 font-medium">
                  ₹{netSalary.toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  {processed ? 'Processed' : 'Pending'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Calculator */}
      <div className="rounded-lg border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">Salary Calculator</h2>
          <p className="text-sm text-muted-foreground">
            Calculate the employee's net salary.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Basic Salary
            </label>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Allowances
            </label>
            <input
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(Number(e.target.value))}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Deductions
            </label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tax
            </label>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="mt-6 rounded-lg border p-5">
          <div className="flex justify-between py-2">
            <span>Basic Salary</span>
            <span>₹{basicSalary.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Allowances</span>
            <span>₹{allowances.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Gross Salary</span>
            <span>₹{grossSalary.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Deductions</span>
            <span>₹{deductions.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Tax</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-semibold">
            <span>Net Salary</span>
            <span>₹{netSalary.toLocaleString()}</span>
          </div>
        </div>

        {processed && (
          <p className="mt-4 font-medium text-green-600">
            Payroll processed successfully.
          </p>
        )}
      </div>
    </div>
  )
}