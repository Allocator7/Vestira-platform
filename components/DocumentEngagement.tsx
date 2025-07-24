"use client"

import { useState } from "react"
import { Eye, Download, Clock, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EngagementMetric {
  count: number
  change?: number
  users?: string[]
  timestamps?: string[]
}

interface DocumentEngagementProps {
  documentId: string
  documentName: string
  views: EngagementMetric
  downloads: EngagementMetric
  lastAccessed?: string
  userRole: "manager" | "allocator"
  className?: string
}

export function DocumentEngagement({
  documentId,
  documentName,
  views,
  downloads,
  lastAccessed,
  userRole,
  className,
}: DocumentEngagementProps) {
  const [expanded, setExpanded] = useState(false)

  // Only managers can see detailed engagement metrics
  const canSeeEngagement = userRole === "manager"

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">{documentName}</h3>
          {canSeeEngagement && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-blue-600 hover:underline">
              {expanded ? "Show less" : "Show details"}
            </button>
          )}
        </div>

        {canSeeEngagement ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Views</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{views.count}</span>
                {views.change && views.change > 0 && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    +{views.change}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Downloads</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{downloads.count}</span>
                {downloads.change && downloads.change > 0 && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    +{downloads.change}
                  </Badge>
                )}
              </div>
            </div>

            {lastAccessed && (
              <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last accessed</span>
                </div>
                <span>{lastAccessed}</span>
              </div>
            )}

            {expanded && views.users && views.users.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-medium mb-2">Recent viewers</h4>
                <div className="space-y-2">
                  {views.users.slice(0, 3).map((user, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-gray-500" />
                        <span>{user}</span>
                      </div>
                      {views.timestamps && <span className="text-gray-500">{views.timestamps[i]}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Document engagement metrics are only visible to document owners.</div>
        )}
      </CardContent>
    </Card>
  )
}
