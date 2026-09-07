import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Role } from '@/lib/constants/roles'
import type { Permission } from '@/lib/constants/permissions'
import { privilegeService } from '../services/privilegeService'
import type { RolePrivilegeMatrix, RolePrivilegesResponse } from '../types/privilege.types'

export const privilegeKeys = {
  all: ['role-privileges'] as const,
  matrix: () => [...privilegeKeys.all, 'matrix'] as const,
}

export function useRolePrivileges() {
  return useQuery({
    queryKey: privilegeKeys.matrix(),
    queryFn: () => privilegeService.getMatrix(),
  })
}

export function useUpdateRolePrivileges() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ role, permissions }: { role: Role; permissions: Permission[] }) =>
      privilegeService.updateRolePermissions(role, permissions),
    onSuccess: (updated) => {
      queryClient.setQueryData<RolePrivilegesResponse>(privilegeKeys.matrix(), (current) => {
        if (!current) return current
        return {
          ...current,
          roles: current.roles.map((item) => (item.role === updated.role ? updated : item)),
        }
      })
    },
  })
}

export function useResetRolePrivileges() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (role: Role) => privilegeService.resetRole(role),
    onSuccess: (updated: RolePrivilegeMatrix) => {
      queryClient.setQueryData<RolePrivilegesResponse>(privilegeKeys.matrix(), (current) => {
        if (!current) return current
        return {
          ...current,
          roles: current.roles.map((item) => (item.role === updated.role ? updated : item)),
        }
      })
    },
  })
}
