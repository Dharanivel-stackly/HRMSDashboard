import { useState } from 'react'

export default function PayrollProcessing() {
  const [processed, setProcessed] = useState(false)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Payroll Processing</h1>

      <div className="border rounded-lg p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Employee</p>
            <p className="font-medium">John Doe</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Pay Period</p>
            <p className="font-medium">August 2026</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Salary Details</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Basic Salary</span>
            <span>₹35,000</span>
          </div>

          <div className="flex justify-between">
            <span>Allowances</span>
            <span>₹15,000</span>
          </div>

          <div className="flex justify-between">
            <span>Deductions</span>
            <span>₹5,000</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold">
            <span>Net Salary</span>
            <span>₹45,000</span>
          </div>
        </div>

        <button
  className="mt-6 px-4 py-2 rounded-md border"
  onClick={() => setProcessed(true)}
>
  Process Payroll
</button>

{processed && (
  <p className="mt-4 text-green-600 font-medium">
    Payroll processed successfully.
  </p>
)}

      </div>
    </div>
  )
}