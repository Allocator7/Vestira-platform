"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet, FileImage } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ExportButtonProps {
  data: any
  filename: string
  label?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  icon?: boolean
  onExportStart?: () => void
  onExportComplete?: () => void
  formats?: Array<"json" | "csv" | "pdf" | "xlsx">
}

export function ExportButton({
  data,
  filename,
  label = "Export",
  variant = "outline",
  size = "default",
  icon = true,
  onExportStart,
  onExportComplete,
  formats = ["json", "csv", "xlsx"],
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: string) => {
    setIsExporting(true)
    onExportStart?.()

    try {
      let content: string
      let mimeType: string
      let fileExtension: string

      switch (format) {
        case "csv":
          content = convertToCSV(data)
          mimeType = "text/csv"
          fileExtension = "csv"
          break
        case "xlsx":
          content = await convertToExcel(data)
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          fileExtension = "xlsx"
          break
        case "pdf":
          content = await convertToPDF(data)
          mimeType = "application/pdf"
          fileExtension = "pdf"
          break
        default:
          content = JSON.stringify(data, null, 2)
          mimeType = "application/json"
          fileExtension = "json"
      }

      // Create blob and download link
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      // Set download attributes
      link.href = url
      link.download = `${filename}.${fileExtension}`

      // Append to body, click, and clean up
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Show success notification
      if ((window as any).addNotification) {
        ;(window as any).addNotification({
          title: "Export Successful",
          message: `${filename}.${fileExtension} has been downloaded successfully.`,
          type: "success",
        })
      }

      console.log(`Exported ${filename}.${fileExtension} successfully`)
    } catch (error) {
      console.error("Export failed:", error)
      if ((window as any).addNotification) {
        ;(window as any).addNotification({
          title: "Export Failed",
          message: "There was an error exporting the data. Please try again.",
          type: "error",
        })
      }
    } finally {
      setIsExporting(false)
      onExportComplete?.()
    }
  }

  const convertToCSV = (data: any[]): string => {
    if (!Array.isArray(data) || data.length === 0) return ""

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" && value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    return csvContent
  }

  const convertToExcel = async (data: any[]): Promise<string> => {
    // Simulate Excel conversion (in production, use a library like xlsx)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return convertToCSV(data) // Simplified for demo
  }

  const convertToPDF = async (data: any[]): Promise<string> => {
    // Simulate PDF conversion (in production, use a library like jsPDF)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return JSON.stringify(data, null, 2) // Simplified for demo
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "csv":
      case "xlsx":
        return <FileSpreadsheet className="h-4 w-4 mr-2" />
      case "pdf":
        return <FileImage className="h-4 w-4 mr-2" />
      default:
        return <FileText className="h-4 w-4 mr-2" />
    }
  }

  if (formats.length === 1) {
    return (
      <Button variant={variant} size={size} onClick={() => handleExport(formats[0])} disabled={isExporting}>
        {icon && <Download className={`h-4 w-4 ${label ? "mr-2" : ""}`} />}
        {label}
        {isExporting && <span className="ml-2">...</span>}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          {icon && <Download className={`h-4 w-4 ${label ? "mr-2" : ""}`} />}
          {label}
          {isExporting && <span className="ml-2">...</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {formats.map((format) => (
          <DropdownMenuItem key={format} onClick={() => handleExport(format)} disabled={isExporting}>
            {getFormatIcon(format)}
            Export as {format.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
