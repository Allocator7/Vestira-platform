"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MarketInsightFilters } from "@/components/MarketInsightFilters"
import { SearchInput } from "@/components/SearchInput"
import { SortDropdown } from "@/components/SortDropdown"
import { ExportButton } from "@/components/ExportButton"
import { UploadInsightModal } from "@/components/market-insights/UploadInsightModal"
import { TrendingUp, TrendingDown, Calendar, Eye, Download, BookOpen, BarChart3, Share2, Upload } from "lucide-react"

interface MarketInsight {
  id: string
  title: string
  description: string
  assetClass: string
  strategy: string
  publishDate: string
  readTime: string
  views: number
  trending: "up" | "down" | "neutral"
  tags: string[]
  type: "research" | "market-update" | "outlook" | "analysis"
  competitiveIntel: boolean
}

const mockInsights: MarketInsight[] = [
  {
    id: "1",
    title: "Private Equity Fundraising Landscape 2024",
    description:
      "Analysis of current fundraising trends, LP preferences, and competitive positioning in the private equity market.",
    assetClass: "Private Equity & Other Alternatives",
    strategy: "Private Equity",
    publishDate: "2024-01-15",
    readTime: "14 min",
    views: 4123,
    trending: "up",
    tags: ["Fundraising", "LP Relations", "Market Positioning"],
    type: "research",
    competitiveIntel: true,
  },
  {
    id: "2",
    title: "ESG Reporting Requirements Update",
    description: "Latest regulatory developments in ESG reporting and their impact on investment management practices.",
    assetClass: "Public Equities",
    strategy: "ESG/Sustainable Equity",
    publishDate: "2024-01-12",
    readTime: "10 min",
    views: 2789,
    trending: "up",
    tags: ["ESG", "Regulation", "Reporting"],
    type: "market-update",
    competitiveIntel: false,
  },
  {
    id: "3",
    title: "Infrastructure Investment Opportunities",
    description: "Emerging opportunities in infrastructure investments and strategies for manager positioning.",
    assetClass: "Private Fixed Income",
    strategy: "Infrastructure Debt",
    publishDate: "2024-01-10",
    readTime: "12 min",
    views: 3456,
    trending: "up",
    tags: ["Infrastructure", "Opportunities", "Strategy"],
    type: "outlook",
    competitiveIntel: true,
  },
  {
    id: "4",
    title: "Real Estate Market Cycle Analysis",
    description: "Current position in the real estate cycle and implications for investment strategies.",
    assetClass: "Real Estate",
    strategy: "Real Estate Equity",
    publishDate: "2024-01-08",
    readTime: "11 min",
    views: 2934,
    trending: "neutral",
    tags: ["Market Cycle", "Strategy", "Timing"],
    type: "analysis",
    competitiveIntel: false,
  },
  {
    id: "5",
    title: "Credit Market Volatility Strategies",
    description: "Strategies for navigating credit market volatility and capitalizing on dislocations.",
    assetClass: "Public Fixed Income",
    strategy: "High Yield Bonds",
    publishDate: "2024-01-05",
    readTime: "9 min",
    views: 2156,
    trending: "up",
    tags: ["Credit", "Volatility", "Strategy"],
    type: "analysis",
    competitiveIntel: true,
  },
  {
    id: "6",
    title: "Venture Capital Exit Environment",
    description: "Analysis of current exit opportunities and strategies for venture capital portfolios.",
    assetClass: "Private Equity & Other Alternatives",
    strategy: "Venture Capital",
    publishDate: "2024-01-03",
    readTime: "13 min",
    views: 3678,
    trending: "up",
    tags: ["Exit Strategy", "IPO Market", "M&A"],
    type: "research",
    competitiveIntel: true,
  },
]

export default function ManagerMarketInsightsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filters, setFilters] = useState({
    assetClasses: [] as string[],
    strategies: [] as string[],
  })
  const [filteredInsights, setFilteredInsights] = useState(mockInsights)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleFiltersChange = (newFilters: { assetClasses: string[]; strategies: string[] }) => {
    setFilters(newFilters)

    const filtered = mockInsights.filter((insight) => {
      const matchesSearch =
        insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesAssetClass =
        newFilters.assetClasses.length === 0 || newFilters.assetClasses.includes(insight.assetClass)

      const matchesStrategy = newFilters.strategies.length === 0 || newFilters.strategies.includes(insight.strategy)

      return matchesSearch && matchesAssetClass && matchesStrategy
    })

    // Apply sorting
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    } else if (sortBy === "views") {
      filtered.sort((a, b) => b.views - a.views)
    } else if (sortBy === "competitive") {
      filtered.sort((a, b) => (b.competitiveIntel ? 1 : 0) - (a.competitiveIntel ? 1 : 0))
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredInsights(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    handleFiltersChange(filters)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    handleFiltersChange(filters)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "research":
        return <BookOpen className="h-4 w-4" />
      case "market-update":
        return <TrendingUp className="h-4 w-4" />
      case "outlook":
        return <Eye className="h-4 w-4" />
      case "analysis":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "research":
        return "bg-blue-100 text-blue-800"
      case "market-update":
        return "bg-green-100 text-green-800"
      case "outlook":
        return "bg-purple-100 text-purple-800"
      case "analysis":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-deepBrand">Market Insights</h1>
            <p className="text-baseGray mt-1">Strategic intelligence and market analysis for investment managers</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-electric-blue hover:bg-electric-blue/90 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Insight
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share Insights
            </Button>
            <ExportButton
              data={filteredInsights}
              filename="manager-market-insights"
              className="bg-electric-blue hover:bg-electric-blue/90"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchInput
                      placeholder="Search insights by title, description, or tags..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <SortDropdown
                      value={sortBy}
                      onChange={handleSortChange}
                      options={[
                        { value: "date", label: "Latest" },
                        { value: "competitive", label: "Competitive Intel" },
                        { value: "views", label: "Most Viewed" },
                        { value: "title", label: "Title A-Z" },
                      ]}
                    />
                  </div>
                </div>

                <MarketInsightFilters onFiltersChange={handleFiltersChange} initialFilters={filters} />
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-baseGray">
              Showing {filteredInsights.length} of {mockInsights.length} insights
            </p>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`p-3 rounded-full bg-white shadow-md ${getTypeColor(insight.type)}`}>
                      {getTypeIcon(insight.type)}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="text-xs bg-white">
                      {insight.assetClass}
                    </Badge>
                  </div>
                  {insight.competitiveIntel && (
                    <div className="absolute top-3 right-3">
                      <Badge className="text-xs bg-red-100 text-red-800">Competitive Intel</Badge>
                    </div>
                  )}
                  {insight.trending !== "neutral" && (
                    <div className="absolute bottom-3 right-3">
                      {insight.trending === "up" && <TrendingUp className="h-5 w-5 text-green-500" />}
                      {insight.trending === "down" && <TrendingDown className="h-5 w-5 text-red-500" />}
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight line-clamp-2">{insight.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{insight.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {insight.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {insight.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{insight.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-baseGray">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(insight.publishDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {insight.views.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{insight.readTime}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInsights.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-baseGray mx-auto mb-4" />
              <h3 className="text-lg font-medium text-deepBrand mb-2">No insights found</h3>
              <p className="text-baseGray">
                Try adjusting your search terms or filters to find relevant market insights.
              </p>
            </div>
          )}
        </div>

        <UploadInsightModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} userRole="manager" />
      </div>
    </Screen>
  )
}
