import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import type { CreateUserPayload, ManagedUser, UpdateUserPayload } from '../types/user.types'

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => userService.getUsers(),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userService.createUser(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<ManagedUser[]>(userKeys.list(), (current = []) => [created, ...current])
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userService.updateUser(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<ManagedUser[]>(userKeys.list(), (current = []) =>
        current.map((user) => (user.id === updated.id ? updated : user))
      )
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: ({ id }) => {
      queryClient.setQueryData<ManagedUser[]>(userKeys.list(), (current = []) =>
        current.filter((user) => user.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
