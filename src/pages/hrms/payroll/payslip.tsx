const handleDownload = () => {
  const payslip =
    'Employee: John Doe\n' +
    'Pay Period: August 2026\n\n' +
    'Salary Details\n' +
    'Basic Salary: ₹35,000\n' +
    'Allowances: ₹15,000\n' +
    'Gross Salary: ₹50,000\n' +
    'Deductions: ₹5,000\n' +
    'Tax: ₹0\n\n' +
    'Net Salary: ₹45,000'

  const blob = new Blob([payslip], {
    type: 'text/plain;charset=utf-8',
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'John-Doe-Payslip-August-2026.txt'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export default function Payslip() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Payslip</h1>
        <p className="text-muted-foreground">
          View and download employee salary details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Employee</p>
          <p className="mt-2 font-semibold">John Doe</p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Pay Period</p>
          <p className="mt-2 font-semibold">August 2026</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Salary Details</h2>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between">
            <span>Basic Salary</span>
            <span>₹35,000</span>
          </div>

          <div className="flex justify-between">
            <span>Allowances</span>
            <span>₹15,000</span>
          </div>

          <div className="flex justify-between">
            <span>Gross Salary</span>
            <span>₹50,000</span>
          </div>

          <div className="flex justify-between">
            <span>Deductions</span>
            <span>₹5,000</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹0</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold">
            <span>Net Salary</span>
            <span>₹45,000</span>
          </div>
        </div>

        <button
          type="button"
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
          onClick={handleDownload}
        >
          Download Payslip
        </button>
      </div>
    </div>
  )
}