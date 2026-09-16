import type {
  CreateGoalPayload,
  Goal,
  UpdateGoalProgressPayload,
} from '@/features/hrms/performance/types/performance.types'
import type { PaginatedResponse } from '@/types/api.types'
import { parseRequestBody } from '@/lib/api/requestBody'
import { readMockState, writeMockState } from './mockStateStore'
import type { MockHttpRequest, MockHttpResponse } from './mockAttendanceApiRouter'

function success<T>(data: T): MockHttpResponse {
  return { status: 200, body: { success: true, data, message: 'OK' } }
}

const seededGoals: Record<string, Goal> = {
  'seed-1': { id: 'seed-1', title: 'Improve customer onboarding time', owner: 'Aarav Sharma', team: 'Customer Success', progress: 78, due: 'Sep 30, 2026', status: 'On track' },
  'seed-2': { id: 'seed-2', title: 'Launch Q4 demand generation plan', owner: 'Maya Patel', team: 'Marketing', progress: 54, due: 'Oct 15, 2026', status: 'On track' },
  'seed-3': { id: 'seed-3', title: 'Reduce production incident resolution time', owner: 'Rohan Mehta', team: 'Engineering', progress: 32, due: 'Nov 01, 2026', status: 'At risk' },
  'seed-4': { id: 'seed-4', title: 'Complete leadership development track', owner: 'Isha Nair', team: 'People Operations', progress: 91, due: 'Sep 20, 2026', status: 'On track' },
}

function getStoredGoals(): Goal[] {
  const storedGoals = (readMockState().goals ?? []) as Goal[]
  const storedIds = new Set(storedGoals.map((goal) => goal.id))
  return [
    ...storedGoals,
    ...Object.values(seededGoals).filter((goal) => !storedIds.has(goal.id)),
  ]
}

export async function executePerformanceMockRequest(
  request: MockHttpRequest
): Promise<MockHttpResponse> {
  if (request.method === 'GET' && request.path === '/performance/goals') {
    const search = request.query.search?.toLowerCase() ?? ''
    const page = Math.max(1, Number(request.query.page ?? 1))
    const limit = Math.max(1, Number(request.query.limit ?? 10))
    const filteredGoals = getStoredGoals().filter((goal) =>
      `${goal.title} ${goal.owner} ${goal.team}`.toLowerCase().includes(search)
    )
    const data: PaginatedResponse<Goal> = {
      data: filteredGoals.slice((page - 1) * limit, page * limit),
      meta: {
        page,
        limit,
        total: filteredGoals.length,
        totalPages: Math.max(1, Math.ceil(filteredGoals.length / limit)),
      },
    }
    return { status: 200, body: data }
  }
  const goalByIdMatch = request.path.match(/^\/performance\/goals\/([^/]+)$/)
  if (goalByIdMatch && request.method === 'DELETE') {
    const goals = getStoredGoals()
    if (!goals.some((goal) => goal.id === goalByIdMatch[1])) {
      return { status: 404, body: { success: false, message: 'Goal not found' } }
    }
    writeMockState({ goals: goals.filter((goal) => goal.id !== goalByIdMatch[1]) })
    return success({ id: goalByIdMatch[1] })
  }

  if (goalByIdMatch && request.method === 'PUT') {
    const payload = parseRequestBody(request.body) as Partial<CreateGoalPayload>
    const goals = getStoredGoals()
    const currentGoal = goals.find((goal) => goal.id === goalByIdMatch[1])
    if (!currentGoal) {
      return { status: 404, body: { success: false, message: 'Goal not found' } }
    }
    if (!payload.title || !payload.owner || !payload.team || !payload.due) {
      return { status: 400, body: { success: false, message: 'Goal title, owner, team, and due date are required' } }
    }
    const updatedGoal = { ...currentGoal, ...payload }
    writeMockState({ goals: goals.map((goal) => goal.id === updatedGoal.id ? updatedGoal : goal) })
    return success(updatedGoal)
  }

  if (request.method === 'PATCH' && goalByIdMatch) {
    const payload = parseRequestBody(request.body) as Partial<UpdateGoalProgressPayload>
    const progress = Number(payload.progress)
    if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
      return { status: 400, body: { success: false, message: 'Progress must be an integer from 0 to 100' } }
    }

    const goals = getStoredGoals()
    const currentGoal = goals.find((goal) => goal.id === goalByIdMatch[1])
    if (!currentGoal) {
      return { status: 404, body: { success: false, message: 'Goal not found' } }
    }

    const updatedGoal = {
      ...currentGoal,
      progress,
      status: progress === 100 ? 'Complete' : progress < 40 ? 'At risk' : 'On track',
    }
    writeMockState({ goals: goals.map((goal) => goal.id === updatedGoal.id ? updatedGoal : goal) })
    return success(updatedGoal)
  }

  if (request.method !== 'POST' || request.path !== '/performance/goals') {
    return { status: 404, body: { success: false, message: `Route not found: ${request.method} ${request.path}` } }
  }

  const payload = parseRequestBody(request.body) as Partial<CreateGoalPayload>
  if (!payload.title || !payload.owner || !payload.team || !payload.due) {
    return { status: 400, body: { success: false, message: 'Goal title, owner, team, and due date are required' } }
  }

  const goal: Goal = {
    id: `goal-${Date.now()}`,
    title: payload.title,
    owner: payload.owner,
    team: payload.team,
    progress: 0,
    due: payload.due,
    status: 'On track',
  }
  const goals = (readMockState().goals ?? []) as Goal[]
  writeMockState({ goals: [goal, ...goals] })

  return success(goal)
}