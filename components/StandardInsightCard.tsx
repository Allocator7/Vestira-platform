"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, BookOpen } from "lucide-react"

interface StandardInsightCardProps {
  insight: {
    id: string
    title: string
    description: string
    date: string
    category: string
    categoryDisplay: string
    image?: string
    author: string
    readTime: string
    readTimeMinutes: number
    likes: number
    shares: number
    bookmarks: number
    tags?: string[]
  }
  onReadMore: () => void
}

export default function StandardInsightCard({ insight, onReadMore }: StandardInsightCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-vestira-lg transition-all duration-200 h-full flex flex-col">
      {/* Image Section */}
      {insight.image && (
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img src={insight.image || "/placeholder.svg"} alt={insight.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        {/* Header with Badge and Read Time */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {insight.categoryDisplay}
          </Badge>
          <span className="text-xs text-base-gray font-medium">{insight.readTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-deep-brand line-clamp-2 mb-3 leading-tight">{insight.title}</h3>

        {/* Description */}
        <p className="text-sm text-base-gray line-clamp-3 mb-4 flex-1 leading-relaxed">{insight.description}</p>

        {/* Engagement Metrics */}
        <div className="flex items-center space-x-4 mb-4 py-2 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-base-gray">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">{insight.likes}</span>
          </span>
        </div>

        {/* Tags */}
        {insight.tags && insight.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {insight.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer with Author and Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-deep-brand rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-white font-semibold">
                {insight.author
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "A"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-deep-brand truncate">{insight.author}</p>
              <p className="text-xs text-base-gray">{insight.date}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onReadMore}
            className="text-xs px-3 py-1.5 h-auto font-medium flex-shrink-0 ml-3 bg-transparent"
          >
            Read More
          </Button>
        </div>
      </div>
    </Card>
  )
}
