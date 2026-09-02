import { useState } from 'react'
import { Plus, Shield } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UserFormDialog } from '@/features/admin/users/components/UserFormDialog'
import { UserTable } from '@/features/admin/users/components/UserTable'
import { ROLE_OPTIONS } from '@/features/admin/users/constants/user.constants'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from '@/features/admin/users/hooks/useUsers'
import type { ManagedUser } from '@/features/admin/users/types/user.types'

export default function UserManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null)

  const { data: users = [], isLoading, isError, refetch } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const isSaving = createUser.isPending || updateUser.isPending
  const isDeleting = deleteUser.isPending

  const openCreateDialog = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const openEditDialog = (user: ManagedUser) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditingUser(null)
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Users & Roles"
        description="Create login accounts and assign roles to control module and screen access"
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ROLE_OPTIONS.map((role) => (
          <div
            key={role.value}
            className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{role.label}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>
        ))}
      </div>

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        {isLoading ? (
          <div className="p-6">
            <LoadingState rows={5} />
          </div>
        ) : (
          <UserTable users={users} onEdit={openEditDialog} onDelete={setDeleteTarget} />
        )}
      </div>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        user={editingUser}
        isLoading={isSaving}
        onSubmit={async (payload) => {
          if (editingUser) {
            await updateUser.mutateAsync({
              id: editingUser.id,
              payload: {
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                roles: payload.roles,
                status: payload.status,
                ...(payload.password ? { password: payload.password } : {}),
              },
            })
            return
          }
          await createUser.mutateAsync(payload)
        }}
      />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{' '}
              <span className="font-medium">
                {deleteTarget?.firstName} {deleteTarget?.lastName}
              </span>{' '}
              ({deleteTarget?.email}). They will no longer be able to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={async (event) => {
                event.preventDefault()
                if (!deleteTarget) return
                await deleteUser.mutateAsync(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}
