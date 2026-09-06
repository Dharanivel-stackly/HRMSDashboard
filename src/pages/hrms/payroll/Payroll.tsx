import { useNavigate } from 'react-router-dom'
export default function Payroll() {
  
  const navigate = useNavigate()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Payroll</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Employee</p>
          <p className="font-medium">John Doe</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Pay Period</p>
          <p className="font-medium">August 2026</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Net Salary</p>
          <p className="font-medium">₹45,000</p>
        </div>
      </div>

      <div className="border rounded-lg p-5">
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

        <div className="flex gap-3 mt-6">
          <button
  className="px-4 py-2 rounded-md border"
  onClick={() => navigate('/hrms/payroll/process')}
>
  Process Payroll
</button>

          <button
  className="px-4 py-2 rounded-md border"
  onClick={() => navigate('/hrms/payroll/payslip')}
>
  View Payslip
</button>
        </div>
      </div>
    </div>
  )
}
