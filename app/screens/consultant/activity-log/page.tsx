"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Activity, ArrowUpDown, FileText, Calendar, Users, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DataExportButton } from "@/components/ui/data-action-buttons"
import { useToast } from "@/components/ui/use-toast"

import { X } from "lucide-react"

// Mock data for activity log - consultant specific
const activityData = [
  {
    id: "act-001",
    type: "consultation",
    user: "Alexandra Thompson",
    userRole: "Senior Consultant",
    target: "Portfolio Review",
    targetType: "consultation",
    client: "State Teachers' Retirement System",
    timestamp: "2023-11-05T14:30:00Z",
    details: "Completed 90-minute portfolio review session",
    category: "consultations",
  },
  {
    id: "act-002",
    type: "research_published",
    user: "Robert Chen",
    userRole: "Research Analyst",
    target: "Q4 Private Markets Outlook Report",
    targetType: "research",
    client: "Multiple Clients",
    timestamp: "2023-11-04T10:15:00Z",
    details: "Published quarterly research report",
    category: "research",
  },
  {
    id: "act-003",
    type: "advisory_session",
    user: "Maria Rodriguez",
    userRole: "Advisory Director",
    target: "Asset Allocation Review",
    targetType: "advisory",
    client: "California Public Employees' Retirement System",
    timestamp: "2023-11-03T16:45:00Z",
    details: "Conducted asset allocation review session",
    category: "advisory",
  },
  {
    id: "act-004",
    type: "client_meeting",
    user: "James Wilson",
    userRole: "Principal Consultant",
    target: "Due Diligence Presentation",
    targetType: "meeting",
    client: "New York State Common Retirement Fund",
    timestamp: "2023-11-03T09:20:00Z",
    details: "Presented due diligence findings for new manager selection",
    category: "meetings",
  },
  {
    id: "act-005",
    type: "report_delivered",
    user: "Sarah Kim",
    userRole: "Performance Analyst",
    target: "Quarterly Performance Analysis",
    targetType: "report",
    client: "Boeing Corporate Pension",
    timestamp: "2023-11-02T13:10:00Z",
    details: "Delivered quarterly performance analysis report",
    category: "reports",
  },
  {
    id: "act-006",
    type: "manager_evaluation",
    user: "Daniel Brown",
    userRole: "Manager Research",
    target: "Manager Evaluation",
    targetType: "research",
    client: "Florida State Board of Administration",
    timestamp: "2023-11-01T11:05:00Z",
    details: "Completed evaluation of emerging markets equity manager",
    category: "research",
  },
  {
    id: "act-007",
    type: "risk_assessment",
    user: "Emily Chen",
    userRole: "Risk Analyst",
    target: "Portfolio Risk Assessment",
    targetType: "report",
    client: "Ohio Public Employees Retirement System",
    timestamp: "2023-10-31T15:30:00Z",
    details: "Conducted comprehensive portfolio risk assessment",
    category: "reports",
  },
  {
    id: "act-008",
    type: "strategy_recommendation",
    user: "Michael Davis",
    userRole: "Investment Strategist",
    target: "Strategic Asset Allocation",
    targetType: "advisory",
    client: "General Motors Pension Fund",
    timestamp: "2023-10-30T09:45:00Z",
    details: "Provided strategic asset allocation recommendations",
    category: "advisory",
  },
  {
    id: "act-009",
    type: "performance_review",
    user: "Jennifer Lopez",
    userRole: "Senior Consultant",
    target: "Annual Performance Review",
    targetType: "meeting",
    client: "AT&T Pension Benefit Plan",
    timestamp: "2023-10-29T14:20:00Z",
    details: "Conducted annual performance review meeting",
    category: "meetings",
  },
  {
    id: "act-010",
    type: "education_session",
    user: "Thomas Wright",
    userRole: "Client Education",
    target: "ESG Investing Workshop",
    targetType: "education",
    client: "Multiple Clients",
    timestamp: "2023-10-28T11:00:00Z",
    details: "Delivered educational workshop on ESG investing trends",
    category: "education",
  },
  {
    id: "act-011",
    type: "market_update",
    user: "Lisa Johnson",
    userRole: "Market Strategist",
    target: "Monthly Market Update",
    targetType: "research",
    client: "Multiple Clients",
    timestamp: "2023-10-27T13:15:00Z",
    details: "Published monthly market update and commentary",
    category: "research",
  },
  {
    id: "act-012",
    type: "portfolio_construction",
    user: "Robert Kim",
    userRole: "Portfolio Specialist",
    target: "Portfolio Construction Session",
    targetType: "consultation",
    client: "IBM Retirement Fund",
    timestamp: "2023-10-26T10:30:00Z",
    details: "Assisted with portfolio construction and optimization",
    category: "consultations",
  },
  {
    id: "act-013",
    type: "fee_analysis",
    user: "Amanda Garcia",
    userRole: "Fee Specialist",
    target: "Fee Benchmarking Analysis",
    targetType: "report",
    client: "ExxonMobil Pension Trust",
    timestamp: "2023-10-25T16:45:00Z",
    details: "Completed comprehensive fee benchmarking analysis",
    category: "reports",
  },
  {
    id: "act-014",
    type: "governance_review",
    user: "David Wilson",
    userRole: "Governance Specialist",
    target: "Investment Governance Review",
    targetType: "consultation",
    client: "FedEx Corporation Pension Plan",
    timestamp: "2023-10-24T09:20:00Z",
    details: "Conducted investment governance structure review",
    category: "consultations",
  },
  {
    id: "act-015",
    type: "client_onboarding",
    user: "Sophia Martinez",
    userRole: "Client Relations",
    target: "New Client Onboarding",
    targetType: "meeting",
    client: "Lockheed Martin Corporation Pension Trust",
    timestamp: "2023-10-23T14:10:00Z",
    details: "Completed new client onboarding process",
    category: "meetings",
  },
]

// Activity type icon mapping
const activityIcons = {
  consultation: <Users className="h-4 w-4 text-blue-500" />,
  research_published: <FileText className="h-4 w-4 text-purple-500" />,
  advisory_session: <TrendingUp className="h-4 w-4 text-green-500" />,
  client_meeting: <Calendar className="h-4 w-4 text-blue-500" />,
  report_delivered: <FileText className="h-4 w-4 text-orange-500" />,
  manager_evaluation: <Users className="h-4 w-4 text-purple-500" />,
  risk_assessment: <TrendingUp className="h-4 w-4 text-red-500" />,
  strategy_recommendation: <TrendingUp className="h-4 w-4 text-blue-500" />,
  performance_review: <TrendingUp className="h-4 w-4 text-green-500" />,
  education_session: <Users className="h-4 w-4 text-yellow-500" />,
  market_update: <TrendingUp className="h-4 w-4 text-purple-500" />,
  portfolio_construction: <TrendingUp className="h-4 w-4 text-blue-500" />,
  fee_analysis: <FileText className="h-4 w-4 text-green-500" />,
  governance_review: <FileText className="h-4 w-4 text-blue-500" />,
  client_onboarding: <Users className="h-4 w-4 text-orange-500" />,
}

// Activity category badge mapping
const categoryBadges = {
  consultations: { color: "bg-blue-100 text-blue-800", label: "Consultations" },
  research: { color: "bg-purple-100 text-purple-800", label: "Research" },
  advisory: { color: "bg-green-100 text-green-800", label: "Advisory" },
  meetings: { color: "bg-yellow-100 text-yellow-800", label: "Meetings" },
  reports: { color: "bg-orange-100 text-orange-800", label: "Reports" },
  education: { color: "bg-indigo-100 text-indigo-800", label: "Education" },
}

export default function ConsultantActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredActivities, setFilteredActivities] = useState(activityData)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  // Filter activities based on search query and selected filters
  useEffect(() => {
    const filtered = activityData.filter((activity) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        activity.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchQuery.toLowerCase())

      // Date range filter
      let matchesDateRange = true
      if (dateRange.start || dateRange.end) {
        const activityDate = new Date(activity.timestamp)
        if (dateRange.start && new Date(dateRange.start) > activityDate) {
          matchesDateRange = false
        }
        if (dateRange.end && new Date(dateRange.end) < activityDate) {
          matchesDateRange = false
        }
      }

      return matchesSearch && matchesDateRange
    })

    setFilteredActivities(filtered)
  }, [searchQuery, dateRange])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  // Get relative time (e.g., "2 days ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`
    }
  }

  // Handle export
  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Exporting activities:", filteredActivities)
      // In a real app, this would generate and download a CSV/Excel file
      toast({
        title: "Export Complete",
        description: "The activity data has been exported.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deepBrand">Activity Log</h1>
            <p className="text-deepBrand">Track all consulting activities and client interactions</p>
          </div>
        </div>

        {/* Activity List with Enhanced Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-electric-blue" />
                Activity Log
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <DataExportButton
                  onExport={handleExport}
                  format="csv"
                  filename="activity-log.csv"
                  recordCount={filteredActivities.length}
                  fileSize="~25KB"
                  loading={isExporting}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Enhanced Filter Controls */}
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 items-center flex-wrap">
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setDateRange({ start: "", end: "" })
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col">
                  <label htmlFor="start-date" className="text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="end-date" className="text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
                {(dateRange.start || dateRange.end) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 mt-auto"
                    onClick={() => setDateRange({ start: "", end: "" })}
                  >
                    Clear Dates
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-500">
                Showing {filteredActivities.length} of {activityData.length} activities
              </div>

              {/* Activity Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-baseGray border-b">
                      <th className="pb-2 font-medium">
                        <Button variant="ghost" size="sm" className="flex items-center p-0 h-auto font-medium">
                          Time
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </th>
                      <th className="pb-2 font-medium">Activity</th>
                      <th className="pb-2 font-medium">
                        <Button variant="ghost" size="sm" className="flex items-center p-0 h-auto font-medium">
                          Client
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </th>
                      <th className="pb-2 font-medium">Consultant</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                        <tr key={activity.id} className="border-b hover:bg-gray-50">
                          <td className="py-4">
                            <div>
                              <div className="text-sm text-deepBrand">{formatDate(activity.timestamp)}</div>
                              <div className="text-xs text-baseGray">{getRelativeTime(activity.timestamp)}</div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {activityIcons[activity.type] || <Activity className="h-4 w-4 text-gray-500" />}
                              <span className="text-sm font-medium text-deepBrand">{activity.target}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="text-sm text-deepBrand">{activity.client}</div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {activity.user
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm text-deepBrand">{activity.user}</div>
                                <div className="text-xs text-baseGray">{activity.userRole}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge
                              className={`${categoryBadges[activity.category]?.color || "bg-gray-100 text-gray-800"}`}
                            >
                              {categoryBadges[activity.category]?.label || activity.category}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="text-sm text-baseGray">{activity.details}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-baseGray">
                          No activities match your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
