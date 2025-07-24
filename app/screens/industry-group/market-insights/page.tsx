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
import { TrendingUp, TrendingDown, Calendar, Eye, Download, BookOpen, BarChart3, Users, Upload } from "lucide-react"

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
  memberAccess: "public" | "members-only" | "premium"
}

const mockInsights: MarketInsight[] = [
  {
    id: "1",
    title: "Industry Standards for Alternative Investment Reporting",
    description:
      "Comprehensive guidelines for standardized reporting practices across alternative investment strategies.",
    assetClass: "Private Equity & Other Alternatives",
    strategy: "Industry Standards",
    publishDate: "2024-01-15",
    readTime: "18 min",
    views: 5247,
    trending: "up",
    tags: ["Standards", "Reporting", "Best Practices"],
    type: "research",
    memberAccess: "members-only",
  },
  {
    id: "2",
    title: "Regulatory Update: ESG Disclosure Requirements",
    description: "Latest regulatory developments affecting ESG disclosure requirements for institutional investors.",
    assetClass: "Public Equities",
    strategy: "ESG/Sustainable Equity",
    publishDate: "2024-01-12",
    readTime: "12 min",
    views: 3456,
    trending: "up",
    tags: ["Regulation", "ESG", "Disclosure"],
    type: "market-update",
    memberAccess: "public",
  },
  {
    id: "3",
    title: "Infrastructure Investment Trends 2024",
    description:
      "Analysis of emerging trends and opportunities in infrastructure investments for institutional portfolios.",
    assetClass: "Private Fixed Income",
    strategy: "Infrastructure Debt",
    publishDate: "2024-01-10",
    readTime: "15 min",
    views: 4123,
    trending: "up",
    tags: ["Infrastructure", "Trends", "Institutional"],
    type: "outlook",
    memberAccess: "premium",
  },
  {
    id: "4",
    title: "Real Estate Market Outlook: Post-Pandemic Recovery",
    description: "Comprehensive analysis of real estate market recovery patterns and investment implications.",
    assetClass: "Real Estate",
    strategy: "Real Estate Equity",
    publishDate: "2024-01-08",
    readTime: "14 min",
    views: 3789,
    trending: "neutral",
    tags: ["Recovery", "Market Analysis", "Post-Pandemic"],
    type: "analysis",
    memberAccess: "members-only",
  },
  {
    id: "5",
    title: "Credit Risk Management Best Practices",
    description: "Industry best practices for credit risk assessment and management in fixed income portfolios.",
    assetClass: "Public Fixed Income",
    strategy: "High Yield Bonds",
    publishDate: "2024-01-05",
    readTime: "11 min",
    views: 2934,
    trending: "up",
    tags: ["Risk Management", "Credit", "Best Practices"],
    type: "research",
    memberAccess: "public",
  },
  {
    id: "6",
    title: "Venture Capital Industry Survey Results",
    description: "Annual survey results covering venture capital industry trends, challenges, and opportunities.",
    assetClass: "Private Equity & Other Alternatives",
    strategy: "Venture Capital",
    publishDate: "2024-01-03",
    readTime: "16 min",
    views: 4567,
    trending: "up",
    tags: ["Survey", "Industry Trends", "VC"],
    type: "research",
    memberAccess: "premium",
  },
]

export default function IndustryGroupMarketInsightsPage() {
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
    } else if (sortBy === "access") {
      const accessOrder = { premium: 3, "members-only": 2, public: 1 }
      filtered.sort((a, b) => accessOrder[b.memberAccess] - accessOrder[a.memberAccess])
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

  const getAccessColor = (access: string) => {
    switch (access) {
      case "premium":
        return "bg-yellow-100 text-yellow-800"
      case "members-only":
        return "bg-blue-100 text-blue-800"
      case "public":
        return "bg-green-100 text-green-800"
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
            <p className="text-baseGray mt-1">Industry research and insights for our member community</p>
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
              <Users className="h-4 w-4" />
              Share with Members
            </Button>
            <ExportButton
              data={filteredInsights}
              filename="industry-group-market-insights"
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
                        { value: "access", label: "Member Access" },
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${getTypeColor(insight.type)}`}>{getTypeIcon(insight.type)}</div>
                      <Badge variant="outline" className="text-xs">
                        {insight.assetClass}
                      </Badge>
                      <Badge className={`text-xs ${getAccessColor(insight.memberAccess)}`}>
                        {insight.memberAccess === "members-only" ? "Members" : insight.memberAccess}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-baseGray">
                      {insight.trending === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {insight.trending === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{insight.title}</CardTitle>
                  <CardDescription className="text-sm">{insight.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {insight.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-baseGray">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(insight.publishDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {insight.views.toLocaleString()} views
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{insight.readTime}</span>
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
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-baseGray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-deepBrand mb-2">No insights found</h3>
                <p className="text-baseGray">
                  Try adjusting your search terms or filters to find relevant market insights.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <UploadInsightModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} userRole="industry-group" />
      </div>
    </Screen>
  )
}
