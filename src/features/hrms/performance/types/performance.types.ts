export interface Goal {
  id: string
  title: string
  owner: string
  team: string
  progress: number
  due: string
  status: string
}

export interface CreateGoalPayload {
  title: string
  owner: string
  team: string
  due: string
}

export interface UpdateGoalProgressPayload {
  progress: number
}

export type UpdateGoalPayload = CreateGoalPayload

export interface GoalListParams {
  page?: number
  limit?: number
  search?: string
}