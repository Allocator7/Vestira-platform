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
import { useToast } from "../../../../components/ui/use-toast"
import { InsightModal } from "../../../../components/InsightModal"
import { TrendingUp, BookOpen, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"
import StandardInsightCard from "../../../../components/StandardInsightCard"
import EventCard from "../../../../components/EventCard"
import { UploadInsightModal } from "../../../../components/market-insights/UploadInsightModal"
import { Screen } from "@/components/Screen"

// Consultant-specific insights data
const allInsights = [
  {
    id: "1",
    title: "Private Equity Due Diligence Best Practices",
    description:
      "Comprehensive guide for consultants on conducting thorough due diligence for private equity investments",
    date: "June 2, 2025",
    dateObj: new Date("2025-06-02"),
    category: "due-diligence",
    categoryDisplay: "Due Diligence",
    image: "/private-equity-market.png",
    icon: BookOpen,
    tab: "my-client-insights",
    content: "Detailed analysis of due diligence best practices and methodologies...",
    author: "Due Diligence Team",
    readTime: "15 min read",
    readTimeMinutes: 15,
    likes: 324,
    shares: 78,
    bookmarks: 156,
    tags: ["Due Diligence", "Best Practices", "Risk Assessment"],
  },
  {
    id: "2",
    title: "ESG Integration Framework for Institutional Clients",
    description:
      "Practical framework for helping institutional clients integrate ESG considerations into their investment processes",
    date: "May 28, 2025",
    dateObj: new Date("2025-05-28"),
    category: "esg",
    categoryDisplay: "ESG",
    image: "/sustainability-investing.png",
    icon: TrendingUp,
    tab: "all-insights",
    content: "Comprehensive ESG integration strategies for institutional portfolios...",
    author: "ESG Advisory Team",
    readTime: "12 min read",
    readTimeMinutes: 12,
    likes: 215,
    shares: 56,
    bookmarks: 89,
    tags: ["ESG", "Framework", "Implementation"],
  },
  {
    id: "3",
    title: "Infrastructure Debt Market Opportunities",
    description:
      "Analysis of current infrastructure debt market conditions and opportunities for institutional investors",
    date: "May 25, 2025",
    dateObj: new Date("2025-05-25"),
    category: "infrastructure",
    categoryDisplay: "Infrastructure",
    image: "/commercial-real-estate.png",
    icon: TrendingUp,
    tab: "all-insights",
    content: "Infrastructure debt market analysis and investment opportunities...",
    author: "Infrastructure Team",
    readTime: "8 min read",
    readTimeMinutes: 8,
    likes: 178,
    shares: 34,
    bookmarks: 67,
    tags: ["Infrastructure", "Market Analysis", "Opportunities"],
  },
  {
    id: "4",
    title: "Real Estate Investment Strategy Comparison",
    description: "Comparative analysis of different real estate investment strategies for pension fund allocations",
    date: "May 20, 2025",
    dateObj: new Date("2025-05-20"),
    category: "real-estate",
    categoryDisplay: "Real Estate",
    image: "/pension-fund-allocation.png",
    icon: TrendingUp,
    tab: "all-insights",
    content: "Real estate strategy comparison and allocation recommendations...",
    author: "Real Estate Team",
    readTime: "10 min read",
    readTimeMinutes: 10,
    likes: 245,
    shares: 62,
    bookmarks: 94,
    tags: ["Strategy Comparison", "Pension Funds", "Allocation"],
  },
  {
    id: "5",
    title: "High Yield Credit Risk Assessment",
    description: "Tools and methodologies for assessing credit risk in high yield bond portfolios",
    date: "June 1, 2025",
    dateObj: new Date("2025-06-01"),
    category: "credit",
    categoryDisplay: "Credit",
    image: "/market-volatility-chart.png",
    icon: BookOpen,
    tab: "investment-trends",
    content: "Credit risk assessment tools and portfolio management strategies...",
    author: "Credit Research Team",
    readTime: "9 min read",
    readTimeMinutes: 9,
    likes: 192,
    shares: 45,
    bookmarks: 73,
    tags: ["Credit Risk", "Assessment Tools", "Portfolio Management"],
  },
  {
    id: "6",
    title: "Venture Capital Portfolio Construction",
    description: "Best practices for building diversified venture capital portfolios for institutional investors",
    date: "May 27, 2025",
    dateObj: new Date("2025-05-27"),
    category: "venture-capital",
    categoryDisplay: "Venture Capital",
    image: "/private-credit-market.png",
    icon: TrendingUp,
    tab: "investment-trends",
    content: "Venture capital portfolio construction and diversification strategies...",
    author: "VC Advisory Team",
    readTime: "11 min read",
    readTimeMinutes: 11,
    likes: 283,
    shares: 67,
    bookmarks: 112,
    tags: ["Portfolio Construction", "Diversification", "VC Strategy"],
  },
  {
    id: "7",
    title: "Client Advisory Best Practices",
    description: "Proven methodologies for delivering exceptional advisory services to institutional clients",
    date: "June 5, 2025",
    dateObj: new Date("2025-06-05"),
    category: "advisory",
    categoryDisplay: "Advisory",
    image: "/portfolio-diversification.png",
    icon: Users,
    tab: "my-client-insights",
    content: "Client advisory best practices and relationship management strategies...",
    author: "Advisory Services Team",
    readTime: "14 min read",
    readTimeMinutes: 14,
    likes: 267,
    shares: 89,
    bookmarks: 134,
    tags: ["Advisory", "Client Relations", "Best Practices"],
  },
  {
    id: "8",
    title: "Investment Committee Presentation Guidelines",
    description: "Framework for creating compelling investment committee presentations for institutional clients",
    date: "May 30, 2025",
    dateObj: new Date("2025-05-30"),
    category: "presentations",
    categoryDisplay: "Presentations",
    image: "/financial-market-outlook.png",
    icon: Users,
    tab: "my-client-insights",
    content: "Investment committee presentation best practices and templates...",
    author: "Client Services Team",
    readTime: "7 min read",
    readTimeMinutes: 7,
    likes: 156,
    shares: 43,
    bookmarks: 78,
    tags: ["Presentations", "Investment Committee", "Client Services"],
  },
  {
    id: "9",
    title: "Digital Assets Integration for Institutions",
    description: "Strategic approach to integrating digital assets into institutional investment portfolios",
    date: "June 3, 2025",
    dateObj: new Date("2025-06-03"),
    category: "digital-assets",
    categoryDisplay: "Digital Assets",
    image: "/sustainable-investing.png",
    icon: TrendingUp,
    tab: "investment-trends",
    content: "Digital assets integration strategies for institutional investors...",
    author: "Digital Assets Team",
    readTime: "13 min read",
    readTimeMinutes: 13,
    likes: 298,
    shares: 87,
    bookmarks: 145,
    tags: ["Digital Assets", "Integration", "Innovation"],
  },
]

// STANDARDIZED filter options - SAME ACROSS ALL USER TYPES
const FILTER_SECTIONS = {
  category: {
    title: "Category",
    icon: BookOpen,
    options: [
      { value: "due-diligence", label: "Due Diligence" },
      { value: "esg", label: "ESG" },
      { value: "infrastructure", label: "Infrastructure" },
      { value: "real-estate", label: "Real Estate" },
      { value: "credit", label: "Credit" },
      { value: "venture-capital", label: "Venture Capital" },
      { value: "advisory", label: "Advisory" },
      { value: "presentations", label: "Presentations" },
      { value: "digital-assets", label: "Digital Assets" },
    ],
  },
  dateRange: {
    title: "Date Range",
    icon: Calendar,
    options: [
      { value: "last-7-days", label: "Last 7 days" },
      { value: "last-30-days", label: "Last 30 days" },
      { value: "last-3-months", label: "Last 3 months" },
      { value: "last-6-months", label: "Last 6 months" },
      { value: "this-year", label: "This year" },
    ],
  },
  readTime: {
    title: "Read Time",
    icon: Clock,
    options: [
      { value: "quick", label: "Quick reads (< 5 min)" },
      { value: "medium", label: "Medium reads (5-8 min)" },
      { value: "long", label: "Long reads (> 8 min)" },
    ],
  },
  author: {
    title: "Author",
    icon: User,
    options: [
      { value: "due-diligence-team", label: "Due Diligence Team" },
      { value: "esg-advisory-team", label: "ESG Advisory Team" },
      { value: "infrastructure-team", label: "Infrastructure Team" },
      { value: "real-estate-team", label: "Real Estate Team" },
      { value: "credit-research-team", label: "Credit Research Team" },
      { value: "vc-advisory-team", label: "VC Advisory Team" },
      { value: "advisory-services-team", label: "Advisory Services Team" },
      { value: "client-services-team", label: "Client Services Team" },
      { value: "digital-assets-team", label: "Digital Assets Team" },
    ],
  },
  engagement: {
    title: "Engagement",
    icon: TrendingUpIcon,
    options: [
      { value: "most-liked", label: "Most liked (100+ likes)" },
      { value: "most-shared", label: "Most shared (40+ shares)" },
      { value: "most-bookmarked", label: "Most bookmarked (60+ bookmarks)" },
    ],
  },
}

function ConsultantMarketInsightsPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("all-insights") // Default to "all-insights" tab
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    category: [],
    dateRange: [],
    readTime: [],
    author: [],
    engagement: [],
  })
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<any | null>(null)
  const [filteredInsights, setFilteredInsights] = useState(allInsights)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const { toast } = useToast()

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Get total active filters count
  const totalActiveFilters = Object.values(selectedFilters).reduce((sum, filters) => sum + filters.length, 0)

  // Filter insights based on search and selected filters
  useEffect(() => {
    let filtered = allInsights

    // Filter by active tab
    filtered = filtered.filter((insight) => insight.tab === activeTab)

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (insight) =>
          insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          insight.categoryDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
          insight.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedFilters.category.length > 0) {
      filtered = filtered.filter((insight) => selectedFilters.category.includes(insight.category))
    }

    // Filter by date range
    if (selectedFilters.dateRange.length > 0) {
      const now = new Date()
      filtered = filtered.filter((insight) => {
        return selectedFilters.dateRange.some((range) => {
          const insightDate = insight.dateObj
          switch (range) {
            case "last-7-days":
              return now.getTime() - insightDate.getTime() <= 7 * 24 * 60 * 60 * 1000
            case "last-30-days":
              return now.getTime() - insightDate.getTime() <= 30 * 24 * 60 * 60 * 1000
            case "last-3-months":
              return now.getTime() - insightDate.getTime() <= 90 * 24 * 60 * 60 * 1000
            case "last-6-months":
              return now.getTime() - insightDate.getTime() <= 180 * 24 * 60 * 60 * 1000
            case "this-year":
              return insightDate.getFullYear() === now.getFullYear()
            default:
              return true
          }
        })
      })
    }

    // Filter by read time
    if (selectedFilters.readTime.length > 0) {
      filtered = filtered.filter((insight) => {
        return selectedFilters.readTime.some((timeRange) => {
          switch (timeRange) {
            case "quick":
              return insight.readTimeMinutes < 5
            case "medium":
              return insight.readTimeMinutes >= 5 && insight.readTimeMinutes <= 8
            case "long":
              return insight.readTimeMinutes > 8
            default:
              return true
          }
        })
      })
    }

    // Filter by author
    if (selectedFilters.author.length > 0) {
      filtered = filtered.filter((insight) => {
        const authorSlug = insight.author.toLowerCase().replace(/\s+/g, "-")
        return selectedFilters.author.includes(authorSlug)
      })
    }

    // Filter by engagement
    if (selectedFilters.engagement.length > 0) {
      filtered = filtered.filter((insight) => {
        return selectedFilters.engagement.some((engagementType) => {
          switch (engagementType) {
            case "most-liked":
              return insight.likes >= 100
            case "most-shared":
              return insight.shares >= 40
            case "most-bookmarked":
              return insight.bookmarks >= 60
            default:
              return true
          }
        })
      })
    }

    setFilteredInsights(filtered)
  }, [activeTab, searchQuery, selectedFilters])

  // Handle filter toggle
  const toggleFilter = (section: string, filterValue: string) => {
    setSelectedFilters((prev) => {
      const sectionFilters = prev[section] || []
      const newSectionFilters = sectionFilters.includes(filterValue)
        ? sectionFilters.filter((f) => f !== filterValue)
        : [...sectionFilters, filterValue]

      return {
        ...prev,
        [section]: newSectionFilters,
      }
    })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      category: [],
      dateRange: [],
      readTime: [],
      author: [],
      engagement: [],
    })
  }

  // Handle export functionality
  const handleExport = (format: string) => {
    toast.info(`Exporting insights in ${format} format...`)
    setShowExportDialog(false)

    setTimeout(() => {
      toast.success(`Insights have been exported in ${format} format.`)
    }, 1500)
  }

  // Handle share functionality
  const handleShare = (method: string) => {
    toast.info(`Sharing insights via ${method}...`)
    setShowShareDialog(false)

    setTimeout(() => {
      toast.success(`Insights have been shared via ${method}.`)
    }, 1500)
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle read more
  const handleReadMore = (insight: any) => {
    setSelectedInsight(insight)
  }

  // Remove individual filter
  const removeFilter = (section: string, filterId: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [section]: prev[section].filter((id) => id !== filterId),
    }))
  }

  // Get filter label by value
  const getFilterLabel = (section: string, value: string) => {
    const sectionData = FILTER_SECTIONS[section]
    const option = sectionData?.options.find((opt) => opt.value === value)
    return option?.label || value
  }

  return (
    <Screen>
      <main className="flex-1 overflow-y-auto bg-canvas-bg p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-deep-brand">Market Insights</h1>
              <p className="text-base-gray mt-1">Research and analysis to support your client advisory services</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-electric-blue hover:bg-electric-blue/90 flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Insight
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
              <Input
                placeholder="Search insights..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {/* SOPHISTICATED FILTER DROPDOWN - WITH VESTIRA BRAND COLORS */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 h-10 px-4 border-deep-brand/20 hover:border-deep-brand/40 hover:bg-deep-brand/5 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Filter className="h-4 w-4 text-deep-brand" />
                <span className="text-deep-brand font-medium">Filters</span>
                {totalActiveFilters > 0 && (
                  <Badge className="ml-1 bg-deep-brand text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                    {totalActiveFilters}
                  </Badge>
                )}
                <ChevronDown
                  className={`h-4 w-4 text-deep-brand/70 transition-transform duration-200 ${
                    showFilterDropdown ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-[800px] bg-white border border-deep-brand/10 rounded-xl shadow-vestira-lg z-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-deep-brand/10 bg-gradient-to-r from-deep-brand/5 to-deep-brand/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-deep-brand text-base">Filter Insights</h4>
                      {totalActiveFilters > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="h-8 text-sm px-3 text-deep-brand/70 hover:text-deep-brand hover:bg-deep-brand/10"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Filter Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-4 gap-6">
                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-deep-brand mb-3">Category</label>
                        <div className="space-y-2">
                          {FILTER_SECTIONS.category.options.map((option) => {
                            const isSelected = selectedFilters.category?.includes(option.value) || false
                            return (
                              <button
                                key={option.value}
                                onClick={() => toggleFilter("category", option.value)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors mr-2 mb-2 ${
                                  isSelected
                                    ? "bg-deep-brand text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-deep-brand/10 hover:text-deep-brand"
                                }`}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Date Range Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-deep-brand mb-3">Date Range</label>
                        <div className="space-y-2">
                          {FILTER_SECTIONS.dateRange.options.map((option) => {
                            const isSelected = selectedFilters.dateRange?.includes(option.value) || false
                            return (
                              <button
                                key={option.value}
                                onClick={() => toggleFilter("dateRange", option.value)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors mr-2 mb-2 ${
                                  isSelected
                                    ? "bg-deep-brand text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-deep-brand/10 hover:text-deep-brand"
                                }`}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Read Time Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-deep-brand mb-3">Read Time</label>
                        <div className="space-y-2">
                          {FILTER_SECTIONS.readTime.options.map((option) => {
                            const isSelected = selectedFilters.readTime?.includes(option.value) || false
                            return (
                              <button
                                key={option.value}
                                onClick={() => toggleFilter("readTime", option.value)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors mr-2 mb-2 ${
                                  isSelected
                                    ? "bg-deep-brand text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-deep-brand/10 hover:text-deep-brand"
                                }`}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Author Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-deep-brand mb-3">Author</label>
                        <div className="space-y-2">
                          {FILTER_SECTIONS.author.options.map((option) => {
                            const isSelected = selectedFilters.author?.includes(option.value) || false
                            return (
                              <button
                                key={option.value}
                                onClick={() => toggleFilter("author", option.value)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors mr-2 mb-2 ${
                                  isSelected
                                    ? "bg-deep-brand text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-deep-brand/10 hover:text-deep-brand"
                                }`}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Engagement Filter - Full Width */}
                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-deep-brand mb-3">Engagement</label>
                      <div className="space-y-2">
                        {FILTER_SECTIONS.engagement.options.map((option) => {
                          const isSelected = selectedFilters.engagement?.includes(option.value) || false
                          return (
                            <button
                              key={option.value}
                              onClick={() => toggleFilter("engagement", option.value)}
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors mr-2 mb-2 ${
                                isSelected
                                  ? "bg-deep-brand text-white shadow-sm"
                                  : "bg-gray-100 text-gray-700 hover:bg-deep-brand/10 hover:text-deep-brand"
                              }`}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-deep-brand/10 bg-gradient-to-r from-deep-brand/5 to-deep-brand/10">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="h-9 px-4 text-sm border-deep-brand/30 text-deep-brand hover:bg-deep-brand/10 hover:border-deep-brand/50 transition-all duration-200 bg-transparent"
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={() => setShowFilterDropdown(false)}
                        className="h-9 px-4 text-sm bg-deep-brand hover:bg-deep-brand/90 text-white shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Active Filters Display */}
          {totalActiveFilters > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm font-medium text-deep-brand flex items-center">Active filters:</span>
              {Object.entries(selectedFilters).map(([section, filters]) =>
                filters.map((filterId) => (
                  <Badge
                    key={`${section}-${filterId}`}
                    variant="secondary"
                    className="px-3 py-1 flex items-center gap-2 bg-deep-brand/10 text-deep-brand border border-deep-brand/20 hover:bg-deep-brand/20 transition-colors"
                  >
                    {getFilterLabel(section, filterId)}
                    <button
                      onClick={() => removeFilter(section, filterId)}
                      className="ml-1 rounded-full hover:bg-deep-brand/30 p-0.5 transition-colors"
                      aria-label={`Remove ${getFilterLabel(section, filterId)} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )),
              )}
            </div>
          )}

          <Tabs
            value={activeTab}
            className="mb-8"
            onValueChange={(value) => {
              setActiveTab(value)
            }}
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="my-client-insights" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                My Client Insights
              </TabsTrigger>
              <TabsTrigger value="all-insights" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                All Insights
              </TabsTrigger>
              <TabsTrigger value="investment-trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Investment Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-client-insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInsights.length > 0 ? (
                  filteredInsights.map((insight) => (
                    <StandardInsightCard
                      key={insight.id}
                      insight={insight}
                      onReadMore={() => handleReadMore(insight)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Search className="h-12 w-12 text-base-gray mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-deep-brand mb-2">No client insights found</h3>
                    <p className="text-base-gray">
                      Try adjusting your search or filters to find relevant insights for your clients.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all-insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInsights.length > 0 ? (
                  filteredInsights.map((insight) => (
                    <StandardInsightCard
                      key={insight.id}
                      insight={insight}
                      onReadMore={() => handleReadMore(insight)}
                    />
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

            <TabsContent value="investment-trends" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInsights.length > 0 ? (
                  filteredInsights.map((insight) => (
                    <StandardInsightCard
                      key={insight.id}
                      insight={insight}
                      onReadMore={() => handleReadMore(insight)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Search className="h-12 w-12 text-base-gray mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-deep-brand mb-2">No investment trends found</h3>
                    <p className="text-base-gray">
                      Try adjusting your search or filters to find relevant investment trend insights.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Removed Upcoming Industry Events section - now using dedicated Events Center */}
        </div>

        {/* Click outside to close dropdown */}
        {showFilterDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />}

        {/* Export Dialog removed as per feedback - users should download individual pieces instead */}

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
          <InsightModal insight={selectedInsight} isOpen={!!selectedInsight} onClose={() => setSelectedInsight(null)} />
        )}

        {/* Upload Insight Modal */}
        <UploadInsightModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} userRole="consultant" />
      </main>
    </Screen>
  )
}

export default ConsultantMarketInsightsPage
