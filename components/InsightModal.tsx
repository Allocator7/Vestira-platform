"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, Share2, Bookmark, Download, Eye, X, FileText, TrendingUp } from "lucide-react"

interface InsightModalProps {
  insight: any
  isOpen: boolean
  onClose: () => void
  onLike?: (insightId: number) => void
  onBookmark?: (insightId: number) => void
  onShare?: (insight: any) => void
  onExport?: (insight: any) => void
}

export function InsightModal({ insight, isOpen, onClose, onLike, onBookmark, onShare, onExport }: InsightModalProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!insight) return null

  // Add default values for missing data:
  const safeInsight = {
    id: insight.id || 1,
    title: insight.title || "Untitled Insight",
    author: insight.author || "Unknown Author",
    firm: insight.firm || "Unknown Firm",
    date: insight.date || new Date().toLocaleDateString(),
    category: insight.category || "General",
    summary: insight.summary || insight.description || "No summary available",
    image: insight.image || "/placeholder.svg",
    assetClasses: insight.assetClasses || ["General"],
    strategies: insight.strategies || ["General Strategy"],
    tags: insight.tags || ["General"],
    engagement: insight.engagement || { views: 0, likes: 0, shares: 0 },
    liked: insight.liked || false,
    bookmarked: insight.bookmarked || false,
    isMyManager: insight.isMyManager || false,
    isMyInsight: insight.isMyInsight || false,
  }

  // Generate full content for the insight
  const generateFullContent = (insight: any) => {
    const sections = [
      {
        title: "Executive Summary",
        content: insight.summary,
      },
      {
        title: "Market Analysis",
        content: `The current market environment presents both opportunities and challenges for ${insight.assetClasses.join(", ")} investments. Our analysis indicates that ${insight.strategies.join(" and ")} strategies are particularly well-positioned in the current cycle.`,
      },
      {
        title: "Key Findings",
        content: `Based on our comprehensive research and market analysis, we have identified several key trends that are shaping the investment landscape. These findings are critical for institutional investors looking to optimize their portfolio allocation and risk management strategies.`,
      },
      {
        title: "Strategic Recommendations",
        content: `We recommend a measured approach to portfolio construction, with particular attention to risk-adjusted returns and long-term value creation. The integration of ESG factors and sustainable investment practices should be considered as part of any comprehensive investment strategy.`,
      },
      {
        title: "Market Outlook",
        content: `Looking ahead, we anticipate continued volatility in global markets, driven by macroeconomic factors and geopolitical uncertainties. However, selective opportunities exist for investors with the right expertise and risk management frameworks.`,
      },
    ]

    return sections
  }

  const fullContent = generateFullContent(safeInsight)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
        {/* Simplified Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {safeInsight.category}
                </Badge>
                {safeInsight.isMyManager && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    My Manager
                  </Badge>
                )}
              </div>

              <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                {safeInsight.title}
              </DialogTitle>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    {safeInsight.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="font-medium">{safeInsight.author}</span>
                </div>
                <span>•</span>
                <span>{safeInsight.firm}</span>
                <span>•</span>
                <span>{safeInsight.date}</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 max-h-[calc(95vh-200px)]">
          <div className="p-6 space-y-8">
            {/* Summary Box */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
              <p className="text-gray-700 leading-relaxed text-base">{safeInsight.summary}</p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Asset Classes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {safeInsight.assetClasses.map((ac, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {ac}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Strategies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {safeInsight.strategies.map((strategy, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {strategy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8">
              {fullContent.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">{section.title}</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base">{section.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Engagement Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{safeInsight.engagement.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="h-4 w-4" />
                  <span className="font-medium">{safeInsight.engagement.likes} likes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Share2 className="h-4 w-4" />
                  <span className="font-medium">{safeInsight.engagement.shares} shares</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {safeInsight.tags && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {safeInsight.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Sticky Footer */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike?.(safeInsight.id)}
                className={`gap-2 ${safeInsight.liked ? "text-blue-600" : ""}`}
              >
                <Heart className={`h-4 w-4 ${safeInsight.liked ? "fill-blue-600" : ""}`} />
                Like
              </Button>

              <Button variant="ghost" size="sm" onClick={() => onShare?.(safeInsight)} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark?.(safeInsight.id)}
                className={`gap-2 ${safeInsight.bookmarked ? "text-blue-600" : ""}`}
              >
                <Bookmark className={`h-4 w-4 ${safeInsight.bookmarked ? "fill-blue-600" : ""}`} />
                Save
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onExport?.(safeInsight)} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
