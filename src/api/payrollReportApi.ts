export type PayrollStatus =
  | 'Paid'
  | 'Pending'
  | 'Processed'

export interface PayrollRecord {
  id: number
  employeeId: string
  employeeName: string
  department: string
  designation: string
  payrollMonth: string
  basicSalary: number
  allowances: number
  deductions: number
  grossSalary: number
  netSalary: number
  status: PayrollStatus
}

const MOCK_PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'Arun Kumar',
    department: 'IT',
    designation: 'Software Engineer',
    payrollMonth: '2026-08',
    basicSalary: 40000,
    allowances: 8000,
    deductions: 3000,
    grossSalary: 48000,
    netSalary: 45000,
    status: 'Paid',
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Priya Sharma',
    department: 'HR',
    designation: 'HR Executive',
    payrollMonth: '2026-08',
    basicSalary: 35000,
    allowances: 7000,
    deductions: 2500,
    grossSalary: 42000,
    netSalary: 39500,
    status: 'Paid',
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Rahul Raj',
    department: 'Finance',
    designation: 'Accountant',
    payrollMonth: '2026-08',
    basicSalary: 32000,
    allowances: 6000,
    deductions: 2000,
    grossSalary: 38000,
    netSalary: 36000,
    status: 'Processed',
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'Sneha Devi',
    department: 'IT',
    designation: 'Frontend Developer',
    payrollMonth: '2026-08',
    basicSalary: 45000,
    allowances: 9000,
    deductions: 3500,
    grossSalary: 54000,
    netSalary: 50500,
    status: 'Pending',
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employeeName: 'Karthik S',
    department: 'Operations',
    designation: 'Operations Executive',
    payrollMonth: '2026-07',
    basicSalary: 30000,
    allowances: 5000,
    deductions: 1800,
    grossSalary: 35000,
    netSalary: 33200,
    status: 'Paid',
  },
  {
    id: 6,
    employeeId: 'EMP006',
    employeeName: 'Divya R',
    department: 'Marketing',
    designation: 'Marketing Executive',
    payrollMonth: '2026-07',
    basicSalary: 34000,
    allowances: 6500,
    deductions: 2200,
    grossSalary: 40500,
    netSalary: 38300,
    status: 'Paid',
  },
  {
    id: 7,
    employeeId: 'EMP007',
    employeeName: 'Vijay Kumar',
    department: 'IT',
    designation: 'Backend Developer',
    payrollMonth: '2026-07',
    basicSalary: 42000,
    allowances: 8500,
    deductions: 3200,
    grossSalary: 50500,
    netSalary: 47300,
    status: 'Processed',
  },
  {
    id: 8,
    employeeId: 'EMP008',
    employeeName: 'Anitha M',
    department: 'HR',
    designation: 'HR Manager',
    payrollMonth: '2026-06',
    basicSalary: 50000,
    allowances: 10000,
    deductions: 4000,
    grossSalary: 60000,
    netSalary: 56000,
    status: 'Paid',
  },
  {
    id: 9,
    employeeId: 'EMP009',
    employeeName: 'Suresh B',
    department: 'Finance',
    designation: 'Senior Accountant',
    payrollMonth: '2026-06',
    basicSalary: 38000,
    allowances: 7500,
    deductions: 2800,
    grossSalary: 45500,
    netSalary: 42700,
    status: 'Pending',
  },
  {
    id: 10,
    employeeId: 'EMP010',
    employeeName: 'Meena K',
    department: 'Operations',
    designation: 'Operations Manager',
    payrollMonth: '2026-06',
    basicSalary: 46000,
    allowances: 9000,
    deductions: 3500,
    grossSalary: 55000,
    netSalary: 51500,
    status: 'Paid',
  },
]

export const getPayrollReport = async (): Promise<PayrollRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PAYROLL_RECORDS)
    }, 500)
  })
}