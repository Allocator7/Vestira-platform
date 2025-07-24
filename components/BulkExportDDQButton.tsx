"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DDQData {
  id: string
  templateName: string
  allocatorName?: string
  managerName: string
  managerFirm: string
  status: string
  submittedDate?: string
  completedDate?: string
  dueDate?: string
  lastUpdated?: string
  strategy: string
  fundSize?: string
  vintage?: string
  priority?: string
  progress?: number
}

interface BulkExportDDQButtonProps {
  ddqs: DDQData[]
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showLabel?: boolean
}

export function BulkExportDDQButton({
  ddqs,
  variant = "outline",
  size = "sm",
  showLabel = true,
}: BulkExportDDQButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleBulkExport = async (format: "txt" | "json") => {
    if (ddqs.length === 0) {
      alert("No DDQs to export")
      return
    }

    setIsExporting(true)

    try {
      let content = ""
      let filename = ""
      let mimeType = ""

      if (format === "txt") {
        content = `Bulk DDQ Export Report
Total DDQs: ${ddqs.length}
Exported: ${new Date().toLocaleString()}

${ddqs
  .map(
    (ddq, index) => `
DDQ ${index + 1}:
Template: ${ddq.templateName}
Manager: ${ddq.managerName}
Firm: ${ddq.managerFirm}
Strategy: ${ddq.strategy}
Status: ${ddq.status}
Progress: ${ddq.progress || 0}%
Fund Size: ${ddq.fundSize || "N/A"}
Due Date: ${ddq.dueDate || "N/A"}
${"=".repeat(50)}`,
  )
  .join("\n")}`

        filename = `Bulk_DDQ_Export_${ddqs.length}_DDQs_${new Date().toISOString().split("T")[0]}.txt`
        mimeType = "text/plain"
      } else {
        content = JSON.stringify({ exportDate: new Date().toISOString(), totalDDQs: ddqs.length, ddqs }, null, 2)
        filename = `Bulk_DDQ_Export_${ddqs.length}_DDQs_${new Date().toISOString().split("T")[0]}.json`
        mimeType = "application/json"
      }

      // Simple download
      const element = document.createElement("a")
      const file = new Blob([content], { type: mimeType })
      element.href = URL.createObjectURL(file)
      element.download = filename
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      URL.revokeObjectURL(element.href)

      // Show success message
      alert(`✅ ${ddqs.length} DDQs exported successfully as ${filename}`)
    } catch (error) {
      console.error("Bulk export failed:", error)
      alert("❌ Bulk export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  if (isExporting) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Exporting...
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={ddqs.length === 0}>
          <Download className={`h-4 w-4 ${showLabel ? "mr-2" : ""}`} />
          {showLabel && `Export All (${ddqs.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleBulkExport("txt")}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBulkExport("json")}>
          <FileText className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
