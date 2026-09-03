export type AttendanceRecord = {
  id: number
  employeeId: string
  employeeName: string
  department: string
  date: string
  checkIn: string
  checkOut: string
  workHours: string
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Leave'
  overtime: string
}


const attendanceData: AttendanceRecord[] = [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'Arun Kumar',
    department: 'Engineering',
    date: '2026-09-01',
    checkIn: '09:05 AM',
    checkOut: '06:10 PM',
    workHours: '8h 35m',
    status: 'Present',
    overtime: '10m',
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Priya Sharma',
    department: 'HR',
    date: '2026-09-02',
    checkIn: '09:25 AM',
    checkOut: '06:00 PM',
    workHours: '8h 05m',
    status: 'Late',
    overtime: '0m',
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Rahul Raj',
    department: 'Finance',
    date: '2026-09-03',
    checkIn: '-',
    checkOut: '-',
    workHours: '0h',
    status: 'Absent',
    overtime: '0m',
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'Divya S',
    department: 'Engineering',
    date: '2026-09-04',
    checkIn: '09:00 AM',
    checkOut: '01:00 PM',
    workHours: '4h',
    status: 'Half Day',
    overtime: '0m',
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employeeName: 'Vijay Kumar',
    department: 'Sales',
    date: '2026-09-05',
    checkIn: '-',
    checkOut: '-',
    workHours: '0h',
    status: 'Leave',
    overtime: '0m',
  },
  {
    id: 6,
    employeeId: 'EMP006',
    employeeName: 'Sneha R',
    department: 'Marketing',
    date: '2026-09-06',
    checkIn: '09:10 AM',
    checkOut: '06:05 PM',
    workHours: '8h 25m',
    status: 'Present',
    overtime: '5m',
  },
  {
    id: 7,
    employeeId: 'EMP007',
    employeeName: 'Karthik M',
    department: 'Operations',
    date: '2026-09-07',
    checkIn: '10:05 AM',
    checkOut: '06:00 PM',
    workHours: '7h 25m',
    status: 'Late',
    overtime: '0m',
  },
  {
    id: 8,
    employeeId: 'EMP008',
    employeeName: 'Anitha P',
    department: 'Finance',
    date: '2026-09-08',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workHours: '8h 30m',
    status: 'Present',
    overtime: '0m',
  },
  {
    id: 9,
    employeeId: 'EMP009',
    employeeName: 'Suresh B',
    department: 'Engineering',
    date: '2026-09-09',
    checkIn: '09:00 AM',
    checkOut: '06:30 PM',
    workHours: '9h',
    status: 'Present',
    overtime: '30m',
  },
  {
    id: 10,
    employeeId: 'EMP010',
    employeeName: 'Meena K',
    department: 'HR',
    date: '2026-09-10',
    checkIn: '09:00 AM',
    checkOut: '01:15 PM',
    workHours: '4h 15m',
    status: 'Half Day',
    overtime: '0m',
  },
]



export const getAttendanceReport = async (): Promise<AttendanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(attendanceData)
    }, 500)
  })
}