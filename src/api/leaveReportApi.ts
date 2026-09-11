export type LeaveRecord = {
  id: number
  employeeId: string
  employeeName: string
  department: string
  leaveType:
    | 'Casual Leave'
    | 'Sick Leave'
    | 'Earned Leave'
    | 'Unpaid Leave'
    | 'Maternity Leave'
  fromDate: string
  toDate: string
  totalDays: number
  reason: string
  status: 'Approved' | 'Pending' | 'Rejected'
}

const leaveData: LeaveRecord[] = [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'Arun Kumar',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2026-09-01',
    toDate: '2026-09-02',
    totalDays: 2,
    reason: 'Personal work',
    status: 'Approved',
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Priya Sharma',
    department: 'HR',
    leaveType: 'Sick Leave',
    fromDate: '2026-09-03',
    toDate: '2026-09-03',
    totalDays: 1,
    reason: 'Not feeling well',
    status: 'Pending',
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Rahul Raj',
    department: 'Finance',
    leaveType: 'Earned Leave',
    fromDate: '2026-09-04',
    toDate: '2026-09-06',
    totalDays: 3,
    reason: 'Family function',
    status: 'Approved',
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'Divya S',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2026-09-07',
    toDate: '2026-09-07',
    totalDays: 1,
    reason: 'Personal work',
    status: 'Rejected',
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employeeName: 'Vijay Kumar',
    department: 'Sales',
    leaveType: 'Sick Leave',
    fromDate: '2026-09-08',
    toDate: '2026-09-09',
    totalDays: 2,
    reason: 'Medical rest',
    status: 'Approved',
  },
  {
    id: 6,
    employeeId: 'EMP006',
    employeeName: 'Sneha R',
    department: 'Marketing',
    leaveType: 'Earned Leave',
    fromDate: '2026-09-10',
    toDate: '2026-09-12',
    totalDays: 3,
    reason: 'Vacation',
    status: 'Pending',
  },
  {
    id: 7,
    employeeId: 'EMP007',
    employeeName: 'Karthik M',
    department: 'Operations',
    leaveType: 'Unpaid Leave',
    fromDate: '2026-09-13',
    toDate: '2026-09-14',
    totalDays: 2,
    reason: 'Personal reasons',
    status: 'Rejected',
  },
  {
    id: 8,
    employeeId: 'EMP008',
    employeeName: 'Anitha P',
    department: 'Finance',
    leaveType: 'Casual Leave',
    fromDate: '2026-09-15',
    toDate: '2026-09-16',
    totalDays: 2,
    reason: 'Travel',
    status: 'Approved',
  },
  {
    id: 9,
    employeeId: 'EMP009',
    employeeName: 'Suresh B',
    department: 'Engineering',
    leaveType: 'Earned Leave',
    fromDate: '2026-09-17',
    toDate: '2026-09-19',
    totalDays: 3,
    reason: 'Family vacation',
    status: 'Approved',
  },
  {
    id: 10,
    employeeId: 'EMP010',
    employeeName: 'Meena K',
    department: 'HR',
    leaveType: 'Maternity Leave',
    fromDate: '2026-09-20',
    toDate: '2026-09-25',
    totalDays: 6,
    reason: 'Maternity leave',
    status: 'Pending',
  },
]

export const getLeaveReport = async (): Promise<
  LeaveRecord[]
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(leaveData)
    }, 500)
  })
}