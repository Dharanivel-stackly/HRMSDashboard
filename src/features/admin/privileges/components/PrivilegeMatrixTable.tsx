import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ScreenPrivilegeDefinition } from '../constants/screenCatalog'
import type { RoleScreenAccess } from '../types/privilege.types'

interface PrivilegeMatrixTableProps {
  screens: ScreenPrivilegeDefinition[]
  access: RoleScreenAccess
  locked?: boolean
  onToggle: (screenId: string, flag: 'view' | 'edit', enabled: boolean) => void
}

export function PrivilegeMatrixTable({
  screens,
  access,
  locked = false,
  onToggle,
}: PrivilegeMatrixTableProps) {
  const modules = [...new Set(screens.map((screen) => screen.module))]

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[40%]">Screen</TableHead>
            <TableHead className="w-[20%]">Module</TableHead>
            <TableHead className="w-[20%] text-center">View</TableHead>
            <TableHead className="w-[20%] text-center">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((module) => {
            const moduleScreens = screens.filter((screen) => screen.module === module)
            return moduleScreens.map((screen, index) => {
              const flags = access[screen.id] ?? { view: false, edit: false }
              const canEdit = Boolean(screen.editPermissions?.length)
              return (
                <TableRow key={screen.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium">{screen.label}</p>
                      <p className="text-xs text-muted-foreground">{screen.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {index === 0 ? (
                      <Badge variant="secondary">{module}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={flags.view}
                        disabled={locked}
                        onCheckedChange={(checked) => onToggle(screen.id, 'view', checked)}
                        aria-label={`${screen.label} view`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {canEdit ? (
                        <Switch
                          checked={flags.edit}
                          disabled={locked || !flags.view}
                          onCheckedChange={(checked) => onToggle(screen.id, 'edit', checked)}
                          aria-label={`${screen.label} edit`}
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          })}
        </TableBody>
      </Table>
    </div>
  )
}
