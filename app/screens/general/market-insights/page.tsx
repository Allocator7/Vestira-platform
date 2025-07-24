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
import { TrendingUp, TrendingDown, Calendar, Eye, Download, BookOpen, BarChart3, Upload } from "lucide-react"
import { useApp } from "@/context/AppContext"

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
}

const mockInsights: MarketInsight[] = [
  {
    id: "1",
    title: "Private Equity Market Outlook 2024",
    description:
      "Comprehensive analysis of private equity trends, valuations, and opportunities in the current market environment.",
    assetClass: "Private Equity & Other Alternatives",
    strategy: "Private Equity",
    publishDate: "2024-01-15",
    readTime: "12 min",
    views: 2847,
    trending: "up",
    tags: ["Market Outlook", "Valuations", "Fundraising"],
    type: "outlook",
  },
  {
    id: "2",
    title: "ESG Integration in Public Equities",
    description:
      "How institutional investors are incorporating ESG factors into their public equity investment strategies.",
    assetClass: "Public Equities",
    strategy: "ESG/Sustainable Equity",
    publishDate: "2024-01-12",
    readTime: "8 min",
    views: 1923,
    trending: "up",
    tags: ["ESG", "Sustainability", "Integration"],
    type: "research",
  },
  {
    id: "3",
    title: "Infrastructure Debt Market Update",
    description: "Current trends and opportunities in infrastructure debt investments across global markets.",
    assetClass: "Private Fixed Income",
    strategy: "Infrastructure Debt",
    publishDate: "2024-01-10",
    readTime: "6 min",
    views: 1456,
    trending: "neutral",
    tags: ["Infrastructure", "Debt Markets", "Global"],
    type: "market-update",
  },
  {
    id: "4",
    title: "Real Estate Equity Performance Analysis",
    description: "Deep dive into real estate equity returns and market dynamics across different property sectors.",
    assetClass: "Real Estate",
    strategy: "Real Estate Equity",
    publishDate: "2024-01-08",
    readTime: "10 min",
    views: 2134,
    trending: "down",
    tags: ["Performance", "Property Sectors", "Returns"],
    type: "analysis",
  },
  {
    id: "5",
    title: "High Yield Bond Market Dynamics",
    description:
      "Analysis of credit spreads, default rates, and investment opportunities in the high yield bond market.",
    assetClass: "Public Fixed Income",
    strategy: "High Yield Bonds",
    publishDate: "2024-01-05",
    readTime: "7 min",
    views: 1789,
    trending: "up",
    tags: ["Credit", "Spreads", "Default Risk"],
    type: "analysis",
  },
  {
    id: "6",
    title: "Venture Capital Funding Trends",
    description: "Latest trends in venture capital funding, sector preferences, and startup valuations.",
    assetClass: "Private Equity & Other Alternatives",
    strategy: "Venture Capital",
    publishDate: "2024-01-03",
    readTime: "9 min",
    views: 3021,
    trending: "up",
    tags: ["Funding", "Startups", "Valuations"],
    type: "research",
  },
]

export default function MarketInsightsPage() {
  const appContext = useApp()
  const { userRole } = appContext || {}
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
            <p className="text-baseGray mt-1">Stay informed with the latest market research and analysis</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-electric-blue hover:bg-electric-blue/90 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Insight
            </Button>
            <ExportButton
              data={filteredInsights}
              filename="market-insights"
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

        <UploadInsightModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          userRole={userRole || "general"}
        />
      </div>
    </Screen>
  )
}
