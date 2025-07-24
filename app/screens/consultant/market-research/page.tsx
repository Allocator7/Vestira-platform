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
import { TrendingUp, TrendingDown, Calendar, Eye, Download, BookOpen, BarChart3, Users, FileText } from "lucide-react"

interface ResearchReport {
  id: string
  title: string
  description: string
  assetClass: string
  strategy: string
  publishDate: string
  readTime: string
  views: number
  downloads: number
  trending: "up" | "down" | "neutral"
  tags: string[]
  type: "white-paper" | "market-research" | "due-diligence" | "performance-analysis"
  clientRelevance: "high" | "medium" | "low"
  author: string
  organization: string
}

const mockReports: ResearchReport[] = [
  {
    id: "1",
    title: "Private Equity Due Diligence Framework 2024",
    description:
      "Comprehensive framework for conducting thorough due diligence on private equity investments, including ESG considerations and risk assessment methodologies.",
    assetClass: "Private Equity & Other Alternatives",
    strategy: "Private Equity",
    publishDate: "2024-01-15",
    readTime: "25 min",
    views: 4567,
    downloads: 892,
    trending: "up",
    tags: ["Due Diligence", "Framework", "ESG", "Risk Assessment"],
    type: "white-paper",
    clientRelevance: "high",
    author: "Investment Research Institute",
    organization: "IRI",
  },
  {
    id: "2",
    title: "ESG Integration Best Practices for Institutional Investors",
    description:
      "Detailed analysis of ESG integration strategies across different asset classes, with case studies from leading institutional investors.",
    assetClass: "Public Equities",
    strategy: "ESG/Sustainable Equity",
    publishDate: "2024-01-12",
    readTime: "18 min",
    views: 3421,
    downloads: 654,
    trending: "up",
    tags: ["ESG", "Integration", "Best Practices", "Case Studies"],
    type: "market-research",
    clientRelevance: "high",
    author: "Sustainable Finance Research",
    organization: "SFR",
  },
  {
    id: "3",
    title: "Infrastructure Debt Market Analysis Q4 2023",
    description:
      "Quarterly analysis of infrastructure debt markets, including deal flow, pricing trends, and sector-specific opportunities.",
    assetClass: "Private Fixed Income",
    strategy: "Infrastructure Debt",
    publishDate: "2024-01-10",
    readTime: "15 min",
    views: 2789,
    downloads: 423,
    trending: "neutral",
    tags: ["Infrastructure", "Debt Markets", "Quarterly Analysis", "Deal Flow"],
    type: "market-research",
    clientRelevance: "medium",
    author: "Infrastructure Capital Research",
    organization: "ICR",
  },
  {
    id: "4",
    title: "Real Estate Investment Performance Benchmarking",
    description:
      "Comprehensive benchmarking study of real estate investment performance across different property types and geographic regions.",
    assetClass: "Real Estate",
    strategy: "Real Estate Equity",
    publishDate: "2024-01-08",
    readTime: "22 min",
    views: 3156,
    downloads: 578,
    trending: "up",
    tags: ["Performance", "Benchmarking", "Property Types", "Geographic Analysis"],
    type: "performance-analysis",
    clientRelevance: "high",
    author: "Real Estate Analytics Group",
    organization: "REAG",
  },
  {
    id: "5",
    title: "High Yield Credit Risk Assessment Methodology",
    description:
      "Advanced methodologies for assessing credit risk in high yield bond portfolios, including stress testing and scenario analysis.",
    assetClass: "Public Fixed Income",
    strategy: "High Yield Bonds",
    publishDate: "2024-01-05",
    readTime: "20 min",
    views: 2634,
    downloads: 389,
    trending: "neutral",
    tags: ["Credit Risk", "Methodology", "Stress Testing", "Scenario Analysis"],
    type: "due-diligence",
    clientRelevance: "medium",
    author: "Credit Research Institute",
    organization: "CRI",
  },
  {
    id: "6",
    title: "Venture Capital Portfolio Construction Guide",
    description:
      "Strategic guide to building diversified venture capital portfolios, including allocation strategies and risk management techniques.",
    assetClass: "Private Equity & Other Alternatives",
    strategy: "Venture Capital",
    publishDate: "2024-01-03",
    readTime: "16 min",
    views: 3892,
    downloads: 721,
    trending: "up",
    tags: ["Portfolio Construction", "Diversification", "Risk Management", "Allocation"],
    type: "white-paper",
    clientRelevance: "high",
    author: "Venture Capital Research Center",
    organization: "VCRC",
  },
]

export default function ConsultantMarketResearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filters, setFilters] = useState({
    assetClasses: [] as string[],
    strategies: [] as string[],
  })
  const [filteredReports, setFilteredReports] = useState(mockReports)

  const handleFiltersChange = (newFilters: { assetClasses: string[]; strategies: string[] }) => {
    setFilters(newFilters)

    const filtered = mockReports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        report.author.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAssetClass =
        newFilters.assetClasses.length === 0 || newFilters.assetClasses.includes(report.assetClass)

      const matchesStrategy = newFilters.strategies.length === 0 || newFilters.strategies.includes(report.strategy)

      return matchesSearch && matchesAssetClass && matchesStrategy
    })

    // Apply sorting
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    } else if (sortBy === "views") {
      filtered.sort((a, b) => b.views - a.views)
    } else if (sortBy === "downloads") {
      filtered.sort((a, b) => b.downloads - a.downloads)
    } else if (sortBy === "relevance") {
      const relevanceOrder = { high: 3, medium: 2, low: 1 }
      filtered.sort((a, b) => relevanceOrder[b.clientRelevance] - relevanceOrder[a.clientRelevance])
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredReports(filtered)
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
      case "white-paper":
        return <FileText className="h-4 w-4" />
      case "market-research":
        return <BarChart3 className="h-4 w-4" />
      case "due-diligence":
        return <BookOpen className="h-4 w-4" />
      case "performance-analysis":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "white-paper":
        return "bg-purple-100 text-purple-800"
      case "market-research":
        return "bg-blue-100 text-blue-800"
      case "due-diligence":
        return "bg-green-100 text-green-800"
      case "performance-analysis":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "white-paper":
        return "White Paper"
      case "market-research":
        return "Market Research"
      case "due-diligence":
        return "Due Diligence"
      case "performance-analysis":
        return "Performance Analysis"
      default:
        return "Research"
    }
  }

  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-deepBrand">Market Research</h1>
            <p className="text-baseGray mt-1">
              In-depth research reports and analysis to support your advisory services
            </p>
          </div>
          <ExportButton
            data={filteredReports}
            filename="market-research-reports"
            className="bg-electric-blue hover:bg-electric-blue/90"
          />
        </div>

        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchInput
                      placeholder="Search research by title, description, author, or tags..."
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
                        { value: "relevance", label: "Client Relevance" },
                        { value: "downloads", label: "Most Downloaded" },
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
              Showing {filteredReports.length} of {mockReports.length} research reports
            </p>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${getTypeColor(report.type)}`}>{getTypeIcon(report.type)}</div>
                      <Badge variant="outline" className="text-xs">
                        {report.assetClass}
                      </Badge>
                      <Badge className={`text-xs ${getRelevanceColor(report.clientRelevance)}`}>
                        <Users className="h-3 w-3 mr-1" />
                        {report.clientRelevance} relevance
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-baseGray">
                      {report.trending === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {report.trending === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
                  <CardDescription className="text-sm">{report.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-baseGray">
                      <span className={`px-2 py-1 rounded ${getTypeColor(report.type)}`}>
                        {getTypeLabel(report.type)}
                      </span>
                      <span>by {report.author}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {report.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-baseGray">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.publishDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {report.views.toLocaleString()} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {report.downloads.toLocaleString()} downloads
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{report.readTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge variant="outline" className="text-xs">
                        {report.strategy}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="h-8 bg-electric-blue hover:bg-electric-blue/90 text-white">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-baseGray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-deepBrand mb-2">No research reports found</h3>
                <p className="text-baseGray">
                  Try adjusting your search terms or filters to find relevant research reports.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Screen>
  )
}
