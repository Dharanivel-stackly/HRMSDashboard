import { useCallback, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  className?: string
}

export function FileUpload({
  onFilesSelected,
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFiles = useCallback(
    (files: FileList) => {
      const validFiles = Array.from(files).filter((f) => f.size <= maxSize)
      setSelectedFiles(validFiles)
      onFilesSelected(validFiles)
    },
    [maxSize, onFilesSelected]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updated)
    onFilesSelected(updated)
  }

  return (
    <div className={className}>
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
          Drag and drop files here, or
        </p>
        <label>
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <span>Browse files</span>
          </Button>
        </label>
      </div>
      {selectedFiles.length > 0 && (
        <ul className="mt-3 space-y-1">
          {selectedFiles.map((file, index) => (
            <li key={index} className="flex items-center justify-between rounded bg-muted px-3 py-1.5 text-sm">
              <span className="truncate">{file.name}</span>
              <button onClick={() => removeFile(index)} className="ml-2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
