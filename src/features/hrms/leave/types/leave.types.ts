export type LeaveStatus =| 'PENDING'| 'APPROVED'| 'REJECTED'| 'CANCELLED'

export interface LeaveType {
  id: string
  name: string
  code: string
  totalDays: number
  isPaid: boolean
}

export interface LeaveBalance {
  leaveTypeId: string
  leaveTypeName: string
  total: number
  accrued: number
  used: number
  pending: number
  available: number
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveTypeId: string
  leaveTypeName: string
  fromDate: string
  toDate: string
  numberOfDays: number
  reason: string
  status: LeaveStatus
  appliedOn: string
  rejectionReason?: string
}

export interface CreateLeaveRequest {
  leaveTypeId: string
  fromDate: string
  toDate: string
  numberOfDays: number
  reason: string
}