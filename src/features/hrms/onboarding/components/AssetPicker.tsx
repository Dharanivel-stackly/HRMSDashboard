// src/features/hrms/onboarding/components/AssetPicker.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { AssetType } from '../types/onboarding.types'

interface AssetPickerProps {
  employeeId: string
  onAllocate: (data: { employeeId: string; assetType: AssetType; assetTag: string; serialNumber: string; notes?: string }) => void
  isAllocating?: boolean
}

export function AssetPicker({ employeeId, onAllocate, isAllocating }: AssetPickerProps) {
  const [assetType, setAssetType] = useState<AssetType>('laptop')
  const [assetTag, setAssetTag] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    if (!assetTag || !serialNumber) return
    onAllocate({ employeeId, assetType, assetTag, serialNumber, notes })
    setAssetTag('')
    setSerialNumber('')
    setNotes('')
  }

  return (
    <Card className="ui-card-elevated border border-border/60">
      <CardContent className="p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Asset Type</Label>
            <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="monitor">Monitor</SelectItem>
                <SelectItem value="keyboard">Keyboard</SelectItem>
                <SelectItem value="mouse">Mouse</SelectItem>
                <SelectItem value="headset">Headset</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="access_card">Access Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assetTag">Asset Tag</Label>
            <Input id="assetTag" value={assetTag} onChange={(e) => setAssetTag(e.target.value)} placeholder="e.g. AST-2026-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="SN-1234-5678" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={!assetTag || !serialNumber || isAllocating}>
          {isAllocating ? 'Allocating...' : 'Allocate Asset'}
        </Button>
      </CardContent>
    </Card>
  )
}