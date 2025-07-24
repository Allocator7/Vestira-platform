"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { Download, Upload, CheckCircle, AlertCircle, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface DataExportButtonProps {
  onExport: () => Promise<void>
  format?: "csv" | "xlsx" | "pdf" | "json"
  filename?: string
  recordCount?: number
  fileSize?: string
  className?: string
  disabled?: boolean
}

export function DataExportButton({
  onExport,
  format = "csv",
  filename,
  recordCount,
  fileSize,
  className,
  disabled = false,
}: DataExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [exported, setExported] = React.useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await onExport()

      clearInterval(progressInterval)
      setProgress(100)
      setExported(true)

      setTimeout(() => {
        setIsExporting(false)
        setExported(false)
        setProgress(0)
      }, 2000)
    } catch (error) {
      setIsExporting(false)
      setProgress(0)
      console.error("Export failed:", error)
    }
  }

  const formatLabels = {
    csv: "CSV",
    xlsx: "Excel",
    pdf: "PDF",
    json: "JSON",
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleExport}
        disabled={disabled || isExporting}
        className={cn("relative", className)}
        variant="outline"
      >
        {exported ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Exported</span>
          </div>
        ) : isExporting ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span>Exporting...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export {formatLabels[format]}</span>
          </div>
        )}
      </Button>

      {isExporting && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{progress}% complete</span>
            {recordCount && <span>{recordCount} records</span>}
          </div>
        </div>
      )}

      {!isExporting && (recordCount || fileSize) && (
        <div className="flex gap-2 text-xs text-gray-500">
          {recordCount && <span>{recordCount} records</span>}
          {fileSize && <span>~{fileSize}</span>}
        </div>
      )}
    </div>
  )
}

interface DataImportButtonProps {
  onImport: (file: File) => Promise<void>
  acceptedFormats?: string[]
  maxFileSize?: number
  className?: string
  disabled?: boolean
}

export function DataImportButton({
  onImport,
  acceptedFormats = [".csv", ".xlsx"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  className,
  disabled = false,
}: DataImportButtonProps) {
  const [isImporting, setIsImporting] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [validationError, setValidationError] = React.useState<string | null>(null)
  const [imported, setImported] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setValidationError(null)

    // Validate file size
    if (file.size > maxFileSize) {
      setValidationError(`File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit`)
      return
    }

    // Validate file format
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!acceptedFormats.includes(fileExtension)) {
      setValidationError(`Invalid file format. Accepted: ${acceptedFormats.join(", ")}`)
      return
    }

    setIsImporting(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 300)

      await onImport(file)

      clearInterval(progressInterval)
      setProgress(100)
      setImported(true)

      setTimeout(() => {
        setIsImporting(false)
        setImported(false)
        setProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 2000)
    } catch (error) {
      setIsImporting(false)
      setProgress(0)
      setValidationError("Import failed. Please check your file and try again.")
      console.error("Import failed:", error)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled || isImporting}
        />
        <Button disabled={disabled || isImporting} className={cn("relative", className)} variant="outline">
          {imported ? (
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-green-600" />
              <span>Imported</span>
            </div>
          ) : isImporting ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span>Importing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
            </div>
          )}
        </Button>
      </div>

      {isImporting && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-gray-500">{progress}% complete</div>
        </div>
      )}

      {validationError && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span>{validationError}</span>
        </div>
      )}

      {!isImporting && !validationError && (
        <div className="text-xs text-gray-500">
          Accepted: {acceptedFormats.join(", ")} (max {Math.round(maxFileSize / 1024 / 1024)}MB)
        </div>
      )}
    </div>
  )
}

interface BulkActionButtonProps {
  selectedCount: number
  totalCount: number
  onAction: () => Promise<void>
  actionLabel: string
  icon?: React.ReactNode
  variant?: "default" | "destructive"
  className?: string
  disabled?: boolean
}

export function BulkActionButton({
  selectedCount,
  totalCount,
  onAction,
  actionLabel,
  icon,
  variant = "default",
  className,
  disabled = false,
}: BulkActionButtonProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const handleAction = async () => {
    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate progress based on selection count
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + (100 / selectedCount) * 0.5
        })
      }, 100)

      await onAction()

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setIsProcessing(false)
        setProgress(0)
      }, 1000)
    } catch (error) {
      setIsProcessing(false)
      setProgress(0)
      console.error("Bulk action failed:", error)
    }
  }

  const isDisabled = disabled || selectedCount === 0 || isProcessing

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleAction} disabled={isDisabled} variant={variant} className={cn("relative", className)}>
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {icon}
            <span>{actionLabel}</span>
            {selectedCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedCount}
              </Badge>
            )}
          </div>
        )}
      </Button>

      {isProcessing && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-gray-500">
            Processing {selectedCount} of {totalCount} items
          </div>
        </div>
      )}

      {selectedCount === 0 && !isProcessing && (
        <div className="text-xs text-gray-500">Select items to perform bulk actions</div>
      )}
    </div>
  )
}
