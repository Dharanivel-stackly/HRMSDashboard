// src/features/hrms/onboarding/components/DocumentUploadDropzone.tsx
import { useCallback, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DocumentType } from '../types/onboarding.types'

interface DocumentUploadDropzoneProps {
  employeeId: string
  onUpload: (formData: FormData) => void
  isUploading?: boolean
}

export function DocumentUploadDropzone({
  employeeId,
  onUpload,
  isUploading,
}: DocumentUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [docType, setDocType] = useState<DocumentType>('other')

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) return
    const formData = new FormData()
    formData.append('employeeId', employeeId)
    formData.append('documentType', docType)
    formData.append('file', file)
    onUpload(formData)
    setFile(null)
    setDocType('other')
  }

  const removeFile = () => setFile(null)

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag and drop a file here, or
        </p>
        <label>
          <input
            type="file"
            onChange={handleFileInput}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          />
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <span>Browse files</span>
          </Button>
        </label>
      </div>

      {file && (
        <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm">
          <span className="flex-1 truncate">{file.name}</span>
          <button onClick={removeFile} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[150px]">
          <Label>Document Type</Label>
          <Select value={docType} onValueChange={(v) => setDocType(v as DocumentType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aadhar">Aadhar</SelectItem>
              <SelectItem value="pan">PAN</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="driving_license">Driving License</SelectItem>
              <SelectItem value="degree_certificate">Degree Certificate</SelectItem>
              <SelectItem value="experience_letter">Experience Letter</SelectItem>
              <SelectItem value="salary_slip">Salary Slip</SelectItem>
              <SelectItem value="offer_letter">Offer Letter</SelectItem>
              <SelectItem value="background_check">Background Check</SelectItem>
              <SelectItem value="medical_report">Medical Report</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  )
}