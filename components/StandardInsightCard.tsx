"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, BookOpen, Share2, Heart, Download, Bookmark } from "lucide-react"
import { useState } from "react"

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
  onShare?: () => void
}

export default function StandardInsightCard({ insight, onReadMore, onShare }: StandardInsightCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    // In a real app, this would call an API to update the like count
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // In a real app, this would call an API to update the bookmark count
  }

  const handleDownload = () => {
    // In a real app, this would trigger a download of the article
    const link = document.createElement('a')
    link.href = `/api/insights/${insight.id}/download`
    link.download = `${insight.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: insight.title,
        text: insight.description,
        url: window.location.href,
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${insight.title}\n${insight.description}\n${window.location.href}`)
    }
  }

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

        {/* Engagement Metrics and Actions */}
        <div className="flex items-center justify-between mb-4 py-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-xs text-base-gray">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">{insight.likes}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-base-gray">
              <Share2 className="h-3 w-3" />
              <span className="font-medium">{insight.shares}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-base-gray">
              <Bookmark className="h-3 w-3" />
              <span className="font-medium">{insight.bookmarks}</span>
            </span>
          </div>
          
          {/* Article Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-8 w-8 p-0 ${isLiked ? 'text-red-500' : 'text-base-gray hover:text-red-500'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`h-8 w-8 p-0 ${isBookmarked ? 'text-blue-500' : 'text-base-gray hover:text-blue-500'}`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0 text-base-gray hover:text-deep-brand"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 w-8 p-0 text-base-gray hover:text-deep-brand"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
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

        {/* Footer with Author and Buttons */}
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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReadMore}
              className="text-xs px-3 py-1.5 h-auto font-medium flex-shrink-0 bg-transparent"
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
