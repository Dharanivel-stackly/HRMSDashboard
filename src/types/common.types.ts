export type Status = 'active' | 'inactive' | 'pending' | 'archived'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface AuditableEntity extends BaseEntity {
  createdBy: string
  updatedBy: string
}
