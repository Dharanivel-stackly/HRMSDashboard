import { ApiError } from '@/lib/api/apiError'
import { getPermissionsForRoles } from '@/lib/auth/rolePermissions'
import { ROLES } from '@/lib/constants/roles'
import type { AuthUser } from '@/types/auth.types'
import type {
  CreateUserPayload,
  ManagedUser,
  UpdateUserPayload,
} from '@/features/admin/users/types/user.types'
import { ALL_PERMISSIONS } from '@/lib/auth/rolePermissions'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

type StoredUser = ManagedUser & { password: string }

function formatDateTime(date = new Date()) {
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toManagedUser(user: StoredUser): ManagedUser {
  const { password: _password, ...managed } = user
  return managed
}

function toAuthUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    permissions: user.permissions,
    avatar: undefined,
  }
}

const seedUsers: StoredUser[] = [
  {
    id: 'demo-user-1',
    email: 'admin@oneenterprise.com',
    password: 'admin123',
    firstName: 'Alex',
    lastName: 'Admin',
    roles: [ROLES.SUPER_ADMIN],
    permissions: ALL_PERMISSIONS,
    status: 'active',
    lastLoginAt: formatDateTime(),
    createdAt: '2026-01-01 09:00',
  },
  {
    id: 'demo-user-2',
    email: 'hr@oneenterprise.com',
    password: 'hr12345',
    firstName: 'Jordan',
    lastName: 'HR',
    roles: [ROLES.HR_MANAGER],
    permissions: getPermissionsForRoles([ROLES.HR_MANAGER]),
    status: 'active',
    lastLoginAt: '2026-08-20 10:30',
    createdAt: '2026-02-15 11:00',
  },
  {
    id: 'demo-user-3',
    email: 'employee@oneenterprise.com',
    password: 'employee123',
    firstName: 'Priya',
    lastName: 'Sharma',
    roles: [ROLES.EMPLOYEE],
    permissions: getPermissionsForRoles([ROLES.EMPLOYEE]),
    status: 'active',
    lastLoginAt: '2026-08-25 08:45',
    createdAt: '2026-03-10 14:20',
  },
  {
    id: 'demo-user-4',
    email: 'ldharanivel@thestackly.com',
    password: '123456',
    firstName: 'Dharanivel',
    lastName: 'L',
    roles: [ROLES.EMPLOYEE],
    permissions: getPermissionsForRoles([ROLES.EMPLOYEE]),
    status: 'active',
    lastLoginAt: null,
    createdAt: '2026-09-01 10:00',
  },
]

let users: StoredUser[] = [...seedUsers]

export const mockUserService = {
  async getUsers(): Promise<ManagedUser[]> {
    await delay()
    return users.map(toManagedUser)
  },

  async getUserById(id: string): Promise<ManagedUser> {
    await delay(200)
    const user = users.find((item) => item.id === id)
    if (!user) throw new ApiError('User not found', 404)
    return toManagedUser(user)
  },

  async createUser(payload: CreateUserPayload): Promise<ManagedUser> {
    await delay()
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === payload.email.toLowerCase()
    )
    if (emailExists) {
      throw new ApiError('A user with this email already exists', 409)
    }

    const user: StoredUser = {
      id: `user-${Date.now()}`,
      email: payload.email.toLowerCase(),
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      roles: payload.roles,
      permissions: getPermissionsForRoles(payload.roles),
      status: payload.status,
      lastLoginAt: null,
      createdAt: formatDateTime(),
    }
    users = [user, ...users]
    return toManagedUser(user)
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<ManagedUser> {
    await delay()
    const index = users.findIndex((user) => user.id === id)
    if (index === -1) throw new ApiError('User not found', 404)

    if (
      payload.email &&
      users.some(
        (user, itemIndex) =>
          itemIndex !== index && user.email.toLowerCase() === payload.email!.toLowerCase()
      )
    ) {
      throw new ApiError('A user with this email already exists', 409)
    }

    const current = users[index]
    const roles = payload.roles ?? current.roles
    const updated: StoredUser = {
      ...current,
      email: payload.email?.toLowerCase() ?? current.email,
      password: payload.password?.trim() ? payload.password : current.password,
      firstName: payload.firstName ?? current.firstName,
      lastName: payload.lastName ?? current.lastName,
      roles,
      permissions: getPermissionsForRoles(roles),
      status: payload.status ?? current.status,
    }
    users[index] = updated
    return toManagedUser(updated)
  },

  async deleteUser(id: string): Promise<{ id: string }> {
    await delay()
    const user = users.find((item) => item.id === id)
    if (!user) throw new ApiError('User not found', 404)
    if (user.roles.includes(ROLES.SUPER_ADMIN)) {
      throw new ApiError('Super Admin account cannot be deleted', 400)
    }
    users = users.filter((item) => item.id !== id)
    return { id }
  },

  async authenticate(email: string, password: string): Promise<AuthUser> {
    await delay(400)
    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    )
    if (!user) {
      throw new ApiError('Invalid email or password', 401)
    }
    if (user.status !== 'active') {
      throw new ApiError('Your account is inactive. Contact your administrator.', 403)
    }

    users = users.map((item) =>
      item.id === user.id ? { ...item, lastLoginAt: formatDateTime() } : item
    )

    return toAuthUser(users.find((item) => item.id === user.id)!)
  },
}
