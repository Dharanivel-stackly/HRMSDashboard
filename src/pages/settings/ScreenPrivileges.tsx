import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, RotateCcw, Shield, TriangleAlert } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS, type Role } from '@/lib/constants/roles'
import { ApiError } from '@/lib/api/apiError'
import { PrivilegeMatrixTable } from '@/features/admin/privileges/components/PrivilegeMatrixTable'
import {
  useResetRolePrivileges,
  useRolePrivileges,
  useUpdateRolePrivileges,
} from '@/features/admin/privileges/hooks/usePrivileges'
import {
  buildPermissionsFromScreenAccess,
  toggleScreenFlag,
} from '@/features/admin/privileges/utils/privilegeMatrix'
import type { RoleScreenAccess } from '@/features/admin/privileges/types/privilege.types'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function ScreenPrivileges() {
  const { data, isLoading, isError, refetch } = useRolePrivileges()
  const updatePrivileges = useUpdateRolePrivileges()
  const resetPrivileges = useResetRolePrivileges()

  const roles = data?.roles ?? []
  const screens = data?.screens ?? []
  const defaultRole = roles.find((item) => !item.locked)?.role ?? roles[0]?.role

  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined)
  const [access, setAccess] = useState<RoleScreenAccess>({})
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const accessRef = useRef<RoleScreenAccess>({})
  const syncedRoleRef = useRef<Role | null>(null)

  const activeRole = selectedRole ?? defaultRole
  const roleMatrix = roles.find((item) => item.role === activeRole)
  const locked = Boolean(roleMatrix?.locked)

  // Adopt server state on first load and whenever the selected role changes.
  // Optimistic edits are otherwise left alone so saves do not fight the UI.
  useEffect(() => {
    if (!roleMatrix) return
    if (syncedRoleRef.current === roleMatrix.role) return

    syncedRoleRef.current = roleMatrix.role
    setAccess(roleMatrix.screens)
    accessRef.current = roleMatrix.screens
    setStatus('idle')
    setErrorMessage(null)
  }, [roleMatrix])

  const applyAccess = (next: RoleScreenAccess) => {
    accessRef.current = next
    setAccess(next)
  }

  const handleToggle = async (screenId: string, flag: 'view' | 'edit', enabled: boolean) => {
    const screen = screens.find((item) => item.id === screenId)
    if (!screen || !activeRole || locked) return

    const previous = accessRef.current
    const next = toggleScreenFlag(previous, screen, flag, enabled)
    applyAccess(next)
    setStatus('saving')
    setErrorMessage(null)

    // The full permission list is sent every time, so the last write wins cleanly.
    const permissions = buildPermissionsFromScreenAccess(
      screens,
      next,
      roleMatrix?.permissions ?? []
    )

    try {
      const updated = await updatePrivileges.mutateAsync({ role: activeRole, permissions })
      applyAccess(updated.screens)
      setStatus('saved')
    } catch (error) {
      applyAccess(previous)
      setStatus('error')
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Could not save privileges. Please retry.'
      )
    }
  }

  const handleReset = async () => {
    if (!activeRole || locked) return
    setStatus('saving')
    setErrorMessage(null)

    try {
      const updated = await resetPrivileges.mutateAsync(activeRole)
      applyAccess(updated.screens)
      setStatus('saved')
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Could not reset privileges. Please retry.'
      )
    }
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Screen Privileges"
        description="Set View and Edit access for each page per role — changes save automatically"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <SaveIndicator status={status} message={errorMessage} />
            <Button
              variant="outline"
              disabled={locked || resetPrivileges.isPending || !activeRole}
              onClick={() => void handleReset()}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Role
            </Button>
          </div>
        }
      />

      {isLoading || !data ? (
        <LoadingState rows={8} />
      ) : (
        <>
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
            <Shield className="mt-0.5 h-5 w-5 text-primary" />
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Toggle <span className="font-medium text-foreground">View</span> to show a page in
                the sidebar, and <span className="font-medium text-foreground">Edit</span> to allow
                create/update/manage actions on that page.
              </p>
              <p>
                Super Admin and Admin always keep full access. Other users pick up changes on their
                next page refresh.
              </p>
            </div>
          </div>

          <Tabs
            value={activeRole}
            onValueChange={(value) => setSelectedRole(value as Role)}
            className="gap-4"
          >
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
              {roles.map((item) => (
                <TabsTrigger key={item.role} value={item.role} className="gap-2">
                  {ROLE_LABELS[item.role]}
                  {item.locked ? (
                    <Badge variant="secondary" className="text-[10px]">
                      Full
                    </Badge>
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>

            {roles.map((item) => (
              <TabsContent key={item.role} value={item.role} className="space-y-4">
                {item.locked ? (
                  <p className="text-sm text-muted-foreground">
                    {ROLE_LABELS[item.role]} is locked with full system access. Privileges cannot be
                    reduced for this role.
                  </p>
                ) : null}

                <PrivilegeMatrixTable
                  screens={screens}
                  access={item.role === activeRole ? access : item.screens}
                  locked={item.locked}
                  onToggle={(screenId, flag, enabled) =>
                    void handleToggle(screenId, flag, enabled)
                  }
                />
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </PageContainer>
  )
}

function SaveIndicator({ status, message }: { status: SaveStatus; message: string | null }) {
  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Saving...
      </span>
    )
  }

  if (status === 'saved') {
    return (
      <span className="flex items-center gap-1.5 text-sm text-emerald-700">
        <Check className="h-3.5 w-3.5" />
        All changes saved
      </span>
    )
  }

  if (status === 'error') {
    return (
      <span className="flex items-center gap-1.5 text-sm text-destructive">
        <TriangleAlert className="h-3.5 w-3.5" />
        {message ?? 'Save failed'}
      </span>
    )
  }

  return null
}
