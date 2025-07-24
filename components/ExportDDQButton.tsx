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

// Update the props interface to accept either ddqData or ddqs
interface ExportDDQButtonProps {
  ddqData?: DDQData
  ddqs?: DDQData[]
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showLabel?: boolean
}

export function ExportDDQButton({
  ddqData,
  ddqs,
  variant = "outline",
  size = "sm",
  showLabel = true,
}: ExportDDQButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Determine if this is single or bulk export
  const isBulkExport = ddqs && ddqs.length > 0
  const exportData = isBulkExport ? ddqs : ddqData ? [ddqData] : []

  const handleExport = async (format: "txt" | "json") => {
    if (exportData.length === 0) {
      alert("No DDQ data to export")
      return
    }

    setIsExporting(true)

    try {
      let content = ""
      let filename = ""
      let mimeType = ""

      if (format === "txt") {
        if (isBulkExport) {
          content = `Bulk DDQ Export Report
Total DDQs: ${exportData.length}
Exported: ${new Date().toLocaleString()}

${exportData
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
          filename = `Bulk_DDQ_Export_${exportData.length}_DDQs_${new Date().toISOString().split("T")[0]}.txt`
        } else {
          const ddq = exportData[0]
          content = `DDQ Export Report
Template: ${ddq.templateName}
Manager: ${ddq.managerName}
Firm: ${ddq.managerFirm}
Strategy: ${ddq.strategy}
Status: ${ddq.status}
Progress: ${ddq.progress || 0}%
Fund Size: ${ddq.fundSize || "N/A"}
Due Date: ${ddq.dueDate || "N/A"}
Exported: ${new Date().toLocaleString()}`
          filename = `DDQ_${ddq.managerName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`
        }
        mimeType = "text/plain"
      } else {
        if (isBulkExport) {
          content = JSON.stringify(
            { exportDate: new Date().toISOString(), totalDDQs: exportData.length, ddqs: exportData },
            null,
            2,
          )
          filename = `Bulk_DDQ_Export_${exportData.length}_DDQs_${new Date().toISOString().split("T")[0]}.json`
        } else {
          content = JSON.stringify(exportData[0], null, 2)
          filename = `DDQ_${exportData[0].managerName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.json`
        }
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
      if (isBulkExport) {
        alert(`✅ ${exportData.length} DDQs exported successfully as ${filename}`)
      } else {
        alert(`✅ DDQ exported successfully as ${filename}`)
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("❌ Export failed. Please try again.")
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

  const buttonLabel = isBulkExport ? `Export All (${exportData.length})` : "Export DDQ"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={exportData.length === 0}>
          <Download className={`h-4 w-4 ${showLabel ? "mr-2" : ""}`} />
          {showLabel && buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("txt")}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileText className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
