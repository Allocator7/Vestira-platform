"use client"
import { useState } from "react"
import { Flag, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Tag {
  id: string
  name: string
  type: "asset-class" | "strategy" | "topic"
}

interface InsightTagManagerProps {
  tags: Tag[]
  insightId: string
  insightTitle: string
  onReportTag: (tagId: string, reason: string) => void
}

export function InsightTagManager({ tags, insightId, insightTitle, onReportTag }: InsightTagManagerProps) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

  const getTagColor = (type: string) => {
    switch (type) {
      case "asset-class":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "strategy":
        return "bg-green-100 text-green-800 border-green-200"
      case "topic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleReportTag = (tag: Tag) => {
    setSelectedTag(tag)
    setReportDialogOpen(true)
  }

  const submitReport = (reason: string) => {
    if (selectedTag) {
      onReportTag(selectedTag.id, reason)
      setReportDialogOpen(false)
      setSelectedTag(null)
    }
  }

  const reportReasons = [
    "Wrong asset class",
    "Wrong strategy type",
    "Content doesn't match tag",
    "Tag is too broad/generic",
    "Duplicate tag",
    "Other",
  ]

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center">
            <Badge variant="outline" className={`text-xs ${getTagColor(tag.type)} flex items-center gap-1`}>
              {tag.name}
              <button
                onClick={() => handleReportTag(tag)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                title="Report irrelevant tag"
              >
                <Flag size={10} />
              </button>
            </Badge>
          </div>
        ))}
      </div>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-500" />
              Report Irrelevant Tag
            </DialogTitle>
            <DialogDescription>
              Help us improve content quality by reporting tags that don't belong with this insight.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Insight:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{insightTitle}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Tag being reported:</h4>
              {selectedTag && (
                <Badge variant="outline" className={`text-xs ${getTagColor(selectedTag.type)}`}>
                  {selectedTag.name}
                </Badge>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Why doesn't this tag belong?</h4>
              <div className="space-y-2">
                {reportReasons.map((reason) => (
                  <Button
                    key={reason}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => submitReport(reason)}
                  >
                    {reason}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
