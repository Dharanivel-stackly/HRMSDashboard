import type {LeaveBalance,LeaveRequest,LeaveType,} from '../../features/hrms/leave/types/leave.types'

export const MOCK_LEAVE_TYPES: LeaveType[] = [
  {
    id: 'leave-type-001',
    name: 'Casual Leave',
    code: 'CL',
    totalDays: 12,
    isPaid: true,
    isActive: true,
  },
  {
    id: 'leave-type-002',
    name: 'Sick Leave',
    code: 'SL',
    totalDays: 10,
    isPaid: true,
    isActive: true,
  },
  {
    id: 'leave-type-003',
    name: 'Earned Leave',
    code: 'EL',
    totalDays: 15,
    isPaid: true,
    isActive: true,
  },
]

export const MOCK_LEAVE_BALANCE: LeaveBalance[] = [
  {
    leaveTypeId: 'leave-type-001',
    leaveTypeName: 'Casual Leave',
    total: 12,
    accrued: 8,
    used: 3,
    pending: 1,
    available: 4,
  },
  {
    leaveTypeId: 'leave-type-002',
    leaveTypeName: 'Sick Leave',
    total: 10,
    accrued: 6,
    used: 2,
    pending: 0,
    available: 4,
  },
  {
    leaveTypeId: 'leave-type-003',
    leaveTypeName: 'Earned Leave',
    total: 15,
    accrued: 10,
    used: 4,
    pending: 2,
    available: 4,
  },
]

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-001',
    employeeId: 'EMP-1001',
    employeeName: 'Hari Vignesh',
    leaveTypeId: 'leave-type-001',
    leaveTypeName: 'Casual Leave',
    fromDate: '2026-09-10',
    toDate: '2026-09-11',
    numberOfDays: 2,
    reason: 'Personal work',
    status: 'PENDING',
    appliedOn: '2026-09-01',
  },
  {
    id: 'LR-002',
    employeeId: 'EMP-1001',
    employeeName: 'Hari Vignesh',
    leaveTypeId: 'leave-type-002',
    leaveTypeName: 'Sick Leave',
    fromDate: '2026-08-20',
    toDate: '2026-08-20',
    numberOfDays: 1,
    reason: 'Not feeling well',
    status: 'APPROVED',
    appliedOn: '2026-08-19',
  },
]