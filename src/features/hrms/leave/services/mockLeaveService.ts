import type {LeaveBalance,LeaveRequest,LeaveType,CreateLeaveRequest, CreateLeaveType, UpdateLeaveType} from '../types/leave.types'
import {MOCK_LEAVE_BALANCE,MOCK_LEAVE_REQUESTS,MOCK_LEAVE_TYPES,} from '@/lib/mock/mockLeaveData'
import { ApiError } from '@/lib/api/apiError'

const delay = (ms = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let leaveRequests: LeaveRequest[] = [...MOCK_LEAVE_REQUESTS]
let leaveBalances: LeaveBalance[] = MOCK_LEAVE_BALANCE.map(
  (balance) => ({ ...balance })
)
let nextId = 3
let leaveTypes: LeaveType[] = [...MOCK_LEAVE_TYPES]
let nextLeaveTypeId = 4

 export const mockLeaveService = {
//   async getLeaveTypes(): Promise<LeaveType[]> {
//     await delay()
//     return MOCK_LEAVE_TYPES
//   },

async getLeaveTypes(): Promise<LeaveType[]> {
  await delay()
  return leaveTypes
},

  async getLeaveBalance(): Promise<LeaveBalance[]> {
  await delay()
  return leaveBalances
},

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    await delay()
    return leaveRequests
  },

  async getLeaveRequestById(id: string): Promise<LeaveRequest> {
    await delay()
    const request = leaveRequests.find((item) => item.id === id)
    if (!request) {
      throw new ApiError('Leave request not found', 404)
    }
    return request
  },

  async createLeaveRequest(
  data: CreateLeaveRequest
): Promise<LeaveRequest> {
  await delay()

  const leaveType = MOCK_LEAVE_TYPES.find(
    (type) => type.id === data.leaveTypeId
  )

  if (!leaveType) {
    throw new ApiError(
      'Leave type not found',
      404
    )
  }

  const balanceIndex = leaveBalances.findIndex(
    (balance) =>
      balance.leaveTypeId === data.leaveTypeId
  )

  if (balanceIndex === -1) {
    throw new ApiError(
      'Leave balance not found',
      404
    )
  }

  const balance = leaveBalances[balanceIndex]

  // Check available balance
  if (data.numberOfDays > balance.available) {
    throw new ApiError(
      'Insufficient leave balance',
      400
    )
  }

  // Update pending and available balance
  const updatedBalance: LeaveBalance = {
    ...balance,
    pending: balance.pending + data.numberOfDays,
    available:
      balance.available - data.numberOfDays,
  }

  leaveBalances = [
    ...leaveBalances.slice(0, balanceIndex),
    updatedBalance,
    ...leaveBalances.slice(balanceIndex + 1),
  ]

  const request: LeaveRequest = {
    id: `LR-${String(nextId).padStart(3, '0')}`,
    employeeId: 'EMP-1001',
    employeeName: 'Hari Vignesh',
    leaveTypeId: data.leaveTypeId,
    leaveTypeName: leaveType.name,
    fromDate: data.fromDate,
    toDate: data.toDate,
    numberOfDays: data.numberOfDays,
    reason: data.reason,
    status: 'PENDING',
    appliedOn: new Date()
      .toISOString()
      .split('T')[0],
  }

  nextId += 1

  leaveRequests = [
    request,
    ...leaveRequests,
  ]

  return request
},

async cancelLeaveRequest(
  id: string
): Promise<LeaveRequest> {
  await delay()

  const index = leaveRequests.findIndex(
    (request) => request.id === id
  )

  if (index === -1) {
    throw new ApiError(
      'Leave request not found',
      404
    )
  }

  const request = leaveRequests[index]

  if (request.status !== 'PENDING') {
    throw new ApiError(
      'Only pending leave requests can be cancelled',
      400
    )
  }

  const balanceIndex = leaveBalances.findIndex(
    (balance) =>
      balance.leaveTypeId === request.leaveTypeId
  )

  if (balanceIndex === -1) {
    throw new ApiError(
      'Leave balance not found',
      404
    )
  }

  const balance = leaveBalances[balanceIndex]

  const updatedBalance: LeaveBalance = {
    ...balance,
    pending: Math.max(
      0,
      balance.pending - request.numberOfDays
    ),
    available:
      balance.available + request.numberOfDays,
  }

  leaveBalances = [
    ...leaveBalances.slice(0, balanceIndex),
    updatedBalance,
    ...leaveBalances.slice(balanceIndex + 1),
  ]

  const updatedRequest: LeaveRequest = {
    ...request,
    status: 'CANCELLED',
  }

  leaveRequests = [
    ...leaveRequests.slice(0, index),
    updatedRequest,
    ...leaveRequests.slice(index + 1),
  ]

  return updatedRequest
},

async approveLeaveRequest(
  id: string
): Promise<LeaveRequest> {
  await delay()

  const index = leaveRequests.findIndex(
    (request) => request.id === id
  )

  if (index === -1) {
    throw new ApiError(
      'Leave request not found',
      404
    )
  }

  const request = leaveRequests[index]

  if (request.status !== 'PENDING') {
    throw new ApiError(
      'Only pending leave requests can be approved',
      400
    )
  }

  const balanceIndex = leaveBalances.findIndex(
    (balance) =>
      balance.leaveTypeId === request.leaveTypeId
  )

  if (balanceIndex === -1) {
    throw new ApiError(
      'Leave balance not found',
      404
    )
  }

  const balance = leaveBalances[balanceIndex]

  const updatedBalance: LeaveBalance = {
    ...balance,
    used: balance.used + request.numberOfDays,
    pending: Math.max(
      0,
      balance.pending - request.numberOfDays
    ),
    // available: Math.max(
    //   0,
    //   balance.available
    // ),
    available: balance.available
  }

  leaveBalances = [
    ...leaveBalances.slice(0, balanceIndex),
    updatedBalance,
    ...leaveBalances.slice(balanceIndex + 1),
  ]

  const updatedRequest: LeaveRequest = {
    ...request,
    status: 'APPROVED',
  }

  leaveRequests = [
    ...leaveRequests.slice(0, index),
    updatedRequest,
    ...leaveRequests.slice(index + 1),
  ]

  return updatedRequest
},
async rejectLeaveRequest(
  id: string,
  reason: string
): Promise<LeaveRequest> {
  await delay()

  const index = leaveRequests.findIndex(
    (request) => request.id === id
  )

  if (index === -1) {
    throw new ApiError(
      'Leave request not found',
      404
    )
  }

  const request = leaveRequests[index]

  if (request.status !== 'PENDING') {
    throw new ApiError(
      'Only pending leave requests can be rejected',
      400
    )
  }

  if (!reason.trim()) {
    throw new ApiError(
      'Rejection reason is required',
      400
    )
  }

  const balanceIndex = leaveBalances.findIndex(
    (balance) =>
      balance.leaveTypeId === request.leaveTypeId
  )

  if (balanceIndex === -1) {
    throw new ApiError(
      'Leave balance not found',
      404
    )
  }

  const balance = leaveBalances[balanceIndex]

  // Restore the pending leave days
  const updatedBalance: LeaveBalance = {
    ...balance,
    pending: Math.max(
      0,
      balance.pending - request.numberOfDays
    ),
    available:
      balance.available + request.numberOfDays,
  }

  leaveBalances = [
    ...leaveBalances.slice(0, balanceIndex),
    updatedBalance,
    ...leaveBalances.slice(balanceIndex + 1),
  ]

  const updatedRequest: LeaveRequest = {
    ...request,
    status: 'REJECTED',
    rejectionReason: reason.trim(),
  }

  leaveRequests = [
    ...leaveRequests.slice(0, index),
    updatedRequest,
    ...leaveRequests.slice(index + 1),
  ]

  return updatedRequest
},
async createLeaveType(
  data: CreateLeaveType
): Promise<LeaveType> {
  await delay()

  // const duplicateCode = leaveTypes.some(
  //   (type) =>
  //     type.code.toLowerCase() ===
  //     data.code.toLowerCase()
  // )

  // if (duplicateCode) {
  //   throw new ApiError(
  //     'Leave type code already exists',
  //     400
  //   )
  // }

const duplicateCode = leaveTypes.some(
  (type) =>
    type.code.toLowerCase() ===
    data.code.trim().toLowerCase()
)

if (duplicateCode) {
  throw new ApiError(
    'Leave type code already exists',
    400
  )
}

  const leaveType: LeaveType = {
    id: `leave-type-${String(nextLeaveTypeId).padStart(3, '0')}`,
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    totalDays: data.totalDays,
    isPaid: data.isPaid,
    isActive: true,
  }

  nextLeaveTypeId += 1

  leaveTypes = [
    ...leaveTypes,
    leaveType,
  ]

  return leaveType
},
async updateLeaveType(
  id: string,
  data: UpdateLeaveType
): Promise<LeaveType> {
  await delay()

  const index = leaveTypes.findIndex(
    (type) => type.id === id
  )

  if (index === -1) {
    throw new ApiError(
      'Leave type not found',
      404
    )
  }

  const duplicateCode = leaveTypes.some(
    (type) =>
      type.id !== id &&
      type.code.toLowerCase() ===
        data.code.trim().toLowerCase()
  )

  if (duplicateCode) {
    throw new ApiError(
      'Leave type code already exists',
      400
    )
  }

  const updatedLeaveType: LeaveType = {
    ...leaveTypes[index],
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    totalDays: data.totalDays,
    isPaid: data.isPaid,
  }

  leaveTypes = [
    ...leaveTypes.slice(0, index),
    updatedLeaveType,
    ...leaveTypes.slice(index + 1),
  ]

  return updatedLeaveType
},
async toggleLeaveTypeStatus(
  id: string
): Promise<LeaveType> {
  await delay()

  const index = leaveTypes.findIndex(
    (type) => type.id === id
  )

  if (index === -1) {
    throw new ApiError(
      'Leave type not found',
      404
    )
  }

  const current = leaveTypes[index]

  const updatedLeaveType: LeaveType = {
    ...current,
    isActive: !current.isActive,
  }

  leaveTypes = [
    ...leaveTypes.slice(0, index),
    updatedLeaveType,
    ...leaveTypes.slice(index + 1),
  ]

  return updatedLeaveType
},
}