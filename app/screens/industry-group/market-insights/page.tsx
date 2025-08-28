"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import {
  Search,
  Download,
  Share2,
  Calendar,
  ChevronDown,
  Filter,
  Clock,
  User,
  TrendingUpIcon,
  X,
  Upload,
} from "lucide-react"
import { Input } from "../../../../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { InsightModal } from "../../../../components/InsightModal"
import { TrendingUp, BookOpen, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"
import StandardInsightCard from "../../../../components/StandardInsightCard"
import EventCard from "../../../../components/EventCard"
import { UploadInsightModal } from "../../../../components/market-insights/UploadInsightModal"
import { MarketInsightFilters } from "../../../../components/MarketInsightFilters"

// Industry Group-specific insights data
const allInsights = [
  {
    id: "1",
    title: "Member Engagement Analytics",
    description: "Comprehensive analysis of member engagement and participation trends across industry events",
    date: "June 2, 2025",
    dateObj: new Date("2025-06-02"),
    category: "member-analytics",
    categoryDisplay: "Member Analytics",
    image: "/sustainable-investing.png",
    icon: BookOpen,
    tab: "my-member-insights",
    content: "Detailed analysis of member engagement metrics and participation patterns...",
    author: "Industry Analytics Team",
    readTime: "6 min read",
    readTimeMinutes: 6,
    likes: 124,
    shares: 45,
    bookmarks: 67,
    tags: ["Member Engagement", "Analytics", "Participation"],
  },
  {
    id: "2",
    title: "Industry Event Performance Trends",
    description: "Analysis of event success metrics and member participation across different event types",
    date: "May 28, 2025",
    dateObj: new Date("2025-05-28"),
    category: "event-analytics",
    categoryDisplay: "Event Analytics",
    image: "/private-equity-market.png",
    icon: TrendingUp,
    tab: "all-insights",
    content: "Comprehensive guide to event performance and member engagement...",
    author: "Event Management Team",
    readTime: "8 min read",
    readTimeMinutes: 8,
    likes: 89,
    shares: 32,
    bookmarks: 54,
    tags: ["Event Performance", "Analytics", "Trends"],
  },
  {
    id: "3",
    title: "Industry Standards and Best Practices",
    description: "Key insights from industry standards development and best practice implementation",
    date: "May 25, 2025",
    dateObj: new Date("2025-05-25"),
    category: "standards",
    categoryDisplay: "Standards & Best Practices",
    image: "/market-volatility-chart.png",
    icon: TrendingUp,
    tab: "all-insights",
    content: "Analysis of industry standards and best practices...",
    author: "Standards Committee",
    readTime: "5 min read",
    readTimeMinutes: 5,
    likes: 76,
    shares: 28,
    bookmarks: 41,
    tags: ["Standards", "Best Practices", "Industry"],
  },
  {
    id: "4",
    title: "Regulatory Compliance Updates",
    description: "Latest regulatory developments affecting industry group operations and member compliance",
    date: "May 20, 2025",
    dateObj: new Date("2025-05-20"),
    category: "compliance",
    categoryDisplay: "Compliance",
    image: "/private-credit-market.png",
    icon: TrendingUp,
    tab: "all-insights",
    content: "Latest regulatory updates affecting industry group operations...",
    author: "Compliance Team",
    readTime: "7 min read",
    readTimeMinutes: 7,
    likes: 92,
    shares: 38,
    bookmarks: 56,
    tags: ["Compliance", "Regulation", "Updates"],
  },
  {
    id: "5",
    title: "Industry Networking Impact Report",
    description: "Analysis of networking event effectiveness and member relationship building outcomes",
    date: "May 15, 2025",
    dateObj: new Date("2025-05-15"),
    category: "networking",
    categoryDisplay: "Networking",
    image: "/sustainable-investing.png",
    icon: Users,
    tab: "all-insights",
    content: "Comprehensive analysis of networking event outcomes...",
    author: "Networking Committee",
    readTime: "4 min read",
    readTimeMinutes: 4,
    likes: 67,
    shares: 23,
    bookmarks: 34,
    tags: ["Networking", "Relationships", "Events"],
  },
]

export default function IndustryGroupMarketInsightsPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("my-member-insights")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [filters, setFilters] = useState({ assetClasses: [], strategies: [] })
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<any>(null)
  const [showInsightModal, setShowInsightModal] = useState(false)

  // Set initial tab from URL params
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && ["my-member-insights", "all-insights", "industry-trends"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Filter insights based on active tab and search
  const filteredInsights = allInsights.filter((insight) => {
    const matchesTab = insight.tab === activeTab || activeTab === "all-insights" || activeTab === "industry-trends"
    const matchesSearch = searchQuery === "" || 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || insight.category === selectedCategory
    
    return matchesTab && matchesSearch && matchesCategory
  })

  const handleReadMore = (insight: any) => {
    setSelectedInsight(insight)
    setShowInsightModal(true)
  }

  const handleShare = (method: string) => {
    toast({
      title: "Insights Shared",
      description: `Insights shared via ${method}`,
    })
    setShowShareDialog(false)
  }

  const handleUpload = () => {
    setShowUploadModal(true)
  }

  const handleFiltersChange = (newFilters: { assetClasses: string[]; strategies: string[] }) => {
    setFilters(newFilters)
  }

  const handleUploadSuccess = () => {
    toast({
      title: "Insight Uploaded",
      description: "Your insight has been uploaded successfully.",
    })
    setShowUploadModal(false)
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deep-brand">Market Insights</h1>
            <p className="text-base-gray">Industry research and insights for our member community</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpload} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Insight
            </Button>
            <Button variant="outline" onClick={() => setShowShareDialog(true)} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                  <Input
                    placeholder="Search insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <MarketInsightFilters onFiltersChange={handleFiltersChange} initialFilters={filters} />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
          }}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="my-member-insights" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Member Insights
            </TabsTrigger>
            <TabsTrigger value="all-insights" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              All Insights
            </TabsTrigger>
            <TabsTrigger value="industry-trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Industry Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-member-insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInsights.length > 0 ? (
                filteredInsights.map((insight) => (
                  <StandardInsightCard key={insight.id} insight={insight} onReadMore={() => handleReadMore(insight)} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Search className="h-12 w-12 text-base-gray mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-deep-brand mb-2">No member insights found</h3>
                  <p className="text-base-gray">
                    Try adjusting your search or filters to find relevant insights about your members.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all-insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInsights.length > 0 ? (
                filteredInsights.map((insight) => (
                  <StandardInsightCard key={insight.id} insight={insight} onReadMore={() => handleReadMore(insight)} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Search className="h-12 w-12 text-base-gray mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-deep-brand mb-2">No insights found</h3>
                  <p className="text-base-gray">Try adjusting your search or filters to find relevant insights.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="industry-trends" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInsights.length > 0 ? (
                filteredInsights.map((insight) => (
                  <StandardInsightCard key={insight.id} insight={insight} onReadMore={() => handleReadMore(insight)} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Search className="h-12 w-12 text-base-gray mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-deep-brand mb-2">No industry trends found</h3>
                  <p className="text-base-gray">
                    Try adjusting your search or filters to find relevant industry trend insights.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Click outside to close dropdown */}
        {showFilterDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />}

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Insights</DialogTitle>
              <DialogDescription>Choose how you want to share these insights</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button onClick={() => handleShare("Email")} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share via Email
              </Button>
              <Button onClick={() => handleShare("Link")} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Copy Link
              </Button>
              <Button onClick={() => handleShare("PDF")} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share as PDF
              </Button>
              <Button onClick={() => handleShare("Team")} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share with Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Insight Modal */}
        {selectedInsight && (
          <InsightModal
            insight={selectedInsight}
            isOpen={showInsightModal}
            onClose={() => {
              setShowInsightModal(false)
              setSelectedInsight(null)
            }}
            onLike={(insightId) => {
              toast({
                title: "Insight Liked",
                description: `Insight ${insightId} has been liked.`,
              })
            }}
            onClose={() => {
              setShowInsightModal(false)
              setSelectedInsight(null)
            }}
          />
        )}

        {/* Upload Modal */}
        <UploadInsightModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          onSuccess={handleUploadSuccess}
          userRole="industry-group"
        />
      </div>
    </div>
  )
}