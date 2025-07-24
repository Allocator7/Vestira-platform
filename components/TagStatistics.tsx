"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, ListFilter } from "lucide-react"
import type { TagWithCount } from "@/hooks/useDocumentTags"

interface TagStatisticsProps {
  tags: TagWithCount[]
}

export function TagStatistics({ tags }: TagStatisticsProps) {
  const [viewMode, setViewMode] = useState<"list" | "chart">("list")

  // Sort tags by count (descending)
  const sortedTags = [...tags].sort((a, b) => b.count - a.count)

  // Calculate total documents tagged
  const totalTagged = sortedTags.reduce((sum, tag) => sum + tag.count, 0)

  // Calculate percentages for each tag
  const tagsWithPercentage = sortedTags.map((tag) => ({
    ...tag,
    percentage: totalTagged > 0 ? Math.round((tag.count / totalTagged) * 100) : 0,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Tag Statistics</CardTitle>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-none ${viewMode === "list" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <ListFilter className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-none ${viewMode === "chart" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("chart")}
            >
              <BarChart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {totalTagged === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            <p>No tag statistics available</p>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-2">
            {tagsWithPercentage.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                  <span className="text-sm">{tag.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{tag.count}</span>
                  <div className="w-12 text-right">
                    <span className="text-xs font-medium">{tag.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-40 flex items-end gap-1">
            {tagsWithPercentage.map((tag) => (
              <div
                key={tag.id}
                className="flex-1 flex flex-col items-center justify-end"
                title={`${tag.name}: ${tag.count} documents (${tag.percentage}%)`}
              >
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    backgroundColor: tag.color,
                    height: `${Math.max(5, tag.percentage)}%`,
                  }}
                />
                <div className="w-2.5 h-2.5 rounded-full mt-1 mb-0.5" style={{ backgroundColor: tag.color }} />
                <span className="text-xs text-gray-500 truncate w-full text-center">
                  {tag.name.length > 6 ? `${tag.name.substring(0, 6)}...` : tag.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
