import { useState } from 'react'

export default function PayrollProcessing() {
  const [processed, setProcessed] = useState(false)

  const basicSalary = 35000
  const allowances = 15000
  const deductions = 5000
  const tax = 0

  const grossSalary = basicSalary + allowances
  const netSalary = grossSalary - deductions - tax

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Payroll Processing</h1>
        <p className="text-muted-foreground">
          Process employee payroll and review salary details.
        </p>
      </div>

      {/* Employee Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Employee</p>
          <p className="mt-2 font-semibold">John Doe</p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Pay Period</p>
          <p className="mt-2 font-semibold">August 2026</p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="mt-2 font-semibold">
            {processed ? 'Processed' : 'Pending'}
          </p>
        </div>
      </div>

      {/* Salary Details */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Salary Details</h2>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between">
            <span>Basic Salary</span>
            <span>₹{basicSalary.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Allowances</span>
            <span>₹{allowances.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Gross Salary</span>
            <span>₹{grossSalary.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Deductions</span>
            <span>₹{deductions.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold">
            <span>Net Salary</span>
            <span>₹{netSalary.toLocaleString()}</span>
          </div>
        </div>

        <button
  type="button"
  className="mt-6 rounded-md border px-4 py-2"
  onClick={() => {
    setProcessed(true)
    localStorage.setItem('payrollStatus', 'Processed')
  }}
>
  Process Payroll
</button>

        {processed && (
          <p className="mt-4 font-medium text-green-600">
            Payroll processed successfully.
          </p>
        )}
      </div>
    </div>
  )
}