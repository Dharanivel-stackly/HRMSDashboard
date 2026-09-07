import { api } from '@/lib/api/apiClient'
import { API_ENDPOINTS } from '@/lib/api/apiEndpoints'
import type { ApiResponse } from '@/types/api.types'
import type { Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'
import type {
  RolePrivilegeMatrix,
  RolePrivilegesResponse,
} from '../types/privilege.types'

export const privilegeService = {
  async getMatrix(): Promise<RolePrivilegesResponse> {
    const res = await api.get<ApiResponse<RolePrivilegesResponse>>(
      API_ENDPOINTS.ROLE_PRIVILEGES.BASE
    )
    return res.data.data
  },

  async updateRolePermissions(
    role: Role,
    permissions: Permission[]
  ): Promise<RolePrivilegeMatrix> {
    const res = await api.put<ApiResponse<RolePrivilegeMatrix>>(
      API_ENDPOINTS.ROLE_PRIVILEGES.BASE,
      { role, permissions }
    )
    return res.data.data
  },

  async resetRole(role: Role): Promise<RolePrivilegeMatrix> {
    const res = await api.post<ApiResponse<RolePrivilegeMatrix>>(
      API_ENDPOINTS.ROLE_PRIVILEGES.RESET(role)
    )
    return res.data.data
  },
}
