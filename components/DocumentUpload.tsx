"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, CheckCircle, AlertCircle, FileText, ImageIcon, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
  preview?: string
}

interface DocumentUploadProps {
  onUpload?: (files: File[]) => Promise<void>
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedTypes?: string[]
  className?: string
  compact?: boolean
}

export function DocumentUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = [".pdf", ".docx", ".xlsx", ".pptx", ".jpg", ".png"],
  className,
  compact = false,
}: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragDepth, setDragDepth] = useState(0)
  const dragCounter = useRef(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setIsUploading(true)

      // Create upload file objects with previews
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2),
        file,
        progress: 0,
        status: "uploading",
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Simulate upload progress with more realistic timing
      for (const uploadFile of newFiles) {
        try {
          // Simulate realistic upload progress
          const steps = [0, 15, 35, 60, 85, 95, 100]
          for (const progress of steps) {
            await new Promise((resolve) => setTimeout(resolve, progress === 0 ? 0 : 200 + Math.random() * 300))
            setUploadedFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)))
          }

          // Mark as success
          setUploadedFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "success" } : f)))
        } catch (error) {
          // Mark as error
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: "Upload failed" } : f)),
          )
        }
      }

      setIsUploading(false)

      if (onUpload) {
        await onUpload(acceptedFiles)
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    onDragEnter: () => {
      dragCounter.current++
      setDragDepth(dragCounter.current)
    },
    onDragLeave: () => {
      dragCounter.current--
      setDragDepth(dragCounter.current)
    },
    onDropAccepted: () => {
      dragCounter.current = 0
      setDragDepth(0)
    },
    onDropRejected: () => {
      dragCounter.current = 0
      setDragDepth(0)
    },
  })

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.includes("pdf")) return FileText
    if (file.type.includes("zip") || file.type.includes("rar")) return Archive
    return File
  }

  const getDropzoneState = () => {
    if (isDragReject) return "reject"
    if (isDragActive || dragDepth > 0) return "active"
    return "idle"
  }

  const dropzoneStates = {
    idle: {
      border: "border-gray-300 hover:border-gray-400",
      bg: "bg-gray-50 hover:bg-gray-100",
      text: "text-gray-600",
      icon: "text-gray-400",
    },
    active: {
      border: "border-primary border-2",
      bg: "bg-primary/5",
      text: "text-primary",
      icon: "text-primary",
    },
    reject: {
      border: "border-red-300 border-2",
      bg: "bg-red-50",
      text: "text-red-600",
      icon: "text-red-400",
    },
  }

  const currentState = dropzoneStates[getDropzoneState()]

  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200",
            currentState.border,
            currentState.bg,
          )}
        >
          <input {...getInputProps()} />
          <Upload className={cn("h-6 w-6 mx-auto mb-2", currentState.icon)} />
          <p className={cn("text-sm font-medium", currentState.text)}>
            {isDragActive ? "Drop files here" : "Click or drag files"}
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadedFiles.map((uploadFile) => {
              const FileIcon = getFileIcon(uploadFile.file)
              return (
                <div key={uploadFile.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                  <FileIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="flex-1 truncate">{uploadFile.file.name}</span>
                  {uploadFile.status === "uploading" && (
                    <div className="w-16">
                      <Progress value={uploadFile.progress} className="h-1" />
                    </div>
                  )}
                  {uploadFile.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {uploadFile.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                    className="h-6 w-6 p-0"
                    disabled={uploadFile.status === "uploading" && uploadFile.progress > 0 && uploadFile.progress < 100}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 transform",
          currentState.border,
          currentState.bg,
          isDragActive && "scale-105",
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn("h-10 w-10 mx-auto mb-4 transition-colors duration-200", currentState.icon)} />
        <p className={cn("text-lg font-medium mb-2 transition-colors duration-200", currentState.text)}>
          {isDragReject ? "File type not supported" : isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-gray-500 mb-4">or click to browse files</p>
        <p className="text-xs text-gray-400">
          Supports {acceptedTypes.join(", ")} up to {formatFileSize(maxSize)}
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadedFiles.map((uploadFile) => {
              const FileIcon = getFileIcon(uploadFile.file)
              return (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {uploadFile.preview ? (
                    <img
                      src={uploadFile.preview || "/placeholder.svg"}
                      alt={uploadFile.file.name}
                      className="h-10 w-10 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <FileIcon className="h-10 w-10 text-gray-500 flex-shrink-0 p-2 bg-white rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(uploadFile.file.size)}</p>
                    {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="mt-1 h-1" />}
                    {uploadFile.status === "error" && uploadFile.error && (
                      <p className="text-xs text-red-500 mt-1">{uploadFile.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadFile.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {uploadFile.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
