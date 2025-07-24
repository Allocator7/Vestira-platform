"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar"
import { Activity, ArrowUpDown, FileText, Calendar, Users, MessageSquare, Search, X } from "lucide-react"
import { DataExportButton } from "../../../../components/ui/data-action-buttons"
import { Input } from "../../../../components/ui/input"

// Mock data for activity log - filtered for allocator privacy
const activityData = [
  {
    id: "act-002",
    type: "message_sent",
    user: "Sarah Johnson",
    userRole: "Manager",
    target: "Due Diligence Follow-up",
    targetType: "conversation",
    manager: "Vanguard Fixed Income",
    timestamp: "2023-11-04T10:15:00Z",
    details: "Sent a message regarding upcoming due diligence meeting",
    category: "communication",
  },
  {
    id: "act-003",
    type: "meeting_scheduled",
    user: "Michael Chen",
    userRole: "Allocator",
    target: "Quarterly Review",
    targetType: "meeting",
    manager: "Wellington Management",
    timestamp: "2023-11-03T16:45:00Z",
    details: "Scheduled a meeting for November 15, 2023",
    category: "meeting",
  },
  {
    id: "act-004",
    type: "document_shared",
    user: "Emily Rodriguez",
    userRole: "Manager",
    target: "Q3 2023 Quarterly Report",
    targetType: "document",
    manager: "Bridgewater Associates",
    timestamp: "2023-11-03T09:20:00Z",
    details: "Shared quarterly report with your organization",
    category: "document",
  },
  {
    id: "act-005",
    type: "connection_request",
    user: "David Kim",
    userRole: "Manager",
    target: "Connection Request",
    targetType: "connection",
    manager: "PIMCO",
    timestamp: "2023-11-02T13:10:00Z",
    details: "Sent a connection request to your organization",
    category: "connection",
  },
  {
    id: "act-008",
    type: "message_received",
    user: "Amanda Taylor",
    userRole: "Manager",
    target: "Investment Opportunity",
    targetType: "conversation",
    manager: "TPG Inc",
    timestamp: "2023-10-30T09:45:00Z",
    details: "Received a message about new investment opportunity",
    category: "communication",
  },
  {
    id: "act-010",
    type: "meeting_completed",
    user: "Sophia Garcia",
    userRole: "Manager",
    target: "Introduction Call",
    targetType: "meeting",
    manager: "Carlyle Group",
    timestamp: "2023-10-28T11:00:00Z",
    details: "Completed a 30-minute meeting",
    category: "meeting",
  },
  {
    id: "act-013",
    type: "message_sent",
    user: "Daniel Brown",
    userRole: "Allocator",
    target: "Performance Clarification",
    targetType: "conversation",
    manager: "BlackRock Global Equity",
    timestamp: "2023-10-25T16:45:00Z",
    details: "Sent a message requesting clarification on Q3 performance",
    category: "communication",
  },
  {
    id: "act-014",
    type: "meeting_scheduled",
    user: "Rachel Kim",
    userRole: "Manager",
    target: "Annual Review",
    targetType: "meeting",
    manager: "Wellington Management",
    timestamp: "2023-10-24T09:20:00Z",
    details: "Scheduled a meeting for December 5, 2023",
    category: "meeting",
  },
  {
    id: "act-015",
    type: "document_shared",
    user: "Mark Johnson",
    userRole: "Manager",
    target: "Market Outlook 2024 - Public Insights",
    targetType: "document",
    manager: "J.P. Morgan Asset Management",
    timestamp: "2023-10-23T14:10:00Z",
    details: "Published general market insights",
    category: "document",
  },
  {
    id: "act-016",
    type: "document_shared",
    user: "Lisa Chen",
    userRole: "Manager",
    target: "ESG Investment Trends Report",
    targetType: "document",
    manager: "State Street Global Advisors",
    timestamp: "2023-10-22T11:30:00Z",
    details: "Shared ESG trends report with your organization",
    category: "document",
  },
  {
    id: "act-017",
    type: "document_shared",
    user: "Thomas Wright",
    userRole: "Manager",
    target: "Fixed Income Market Commentary",
    targetType: "document",
    manager: "PIMCO",
    timestamp: "2023-10-21T09:15:00Z",
    details: "Published public market commentary",
    category: "document",
  },
  {
    id: "act-018",
    type: "message_received",
    user: "Jennifer Martinez",
    userRole: "Manager",
    target: "Portfolio Update",
    targetType: "conversation",
    manager: "Fidelity Investments",
    timestamp: "2023-10-20T14:45:00Z",
    details: "Received portfolio performance update",
    category: "communication",
  },
]

// Activity type icon mapping - filtered for allocator view
const activityIcons = {
  document_shared: <FileText className="h-4 w-4 text-purple-500" />,
  document_comment: <MessageSquare className="h-4 w-4 text-orange-500" />,
  message_sent: <MessageSquare className="h-4 w-4 text-blue-500" />,
  message_received: <MessageSquare className="h-4 w-4 text-green-500" />,
  meeting_scheduled: <Calendar className="h-4 w-4 text-purple-500" />,
  meeting_completed: <Calendar className="h-4 w-4 text-green-500" />,
  connection_request: <Users className="h-4 w-4 text-blue-500" />,
}

// Activity category badge mapping
const categoryBadges = {
  document: { color: "bg-blue-100 text-blue-800", label: "Document" },
  communication: { color: "bg-green-100 text-green-800", label: "Communication" },
  meeting: { color: "bg-purple-100 text-purple-800", label: "Meeting" },
  connection: { color: "bg-yellow-100 text-yellow-800", label: "Connection" },
  data_room: { color: "bg-orange-100 text-orange-800", label: "Data Room" },
}

export default function AllocatorActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredActivities, setFilteredActivities] = useState(activityData)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  // Filter activities based on search query and selected filters
  useEffect(() => {
    const filtered = activityData.filter((activity) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        activity.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    try {
      // Create CSV content
      const headers = ["Time", "Activity", "Manager", "User", "Category", "Details"]
      const csvContent = [
        headers.join(","),
        ...filteredActivities.map((activity) =>
          [
            formatDate(activity.timestamp),
            activity.target,
            activity.manager,
            activity.user,
            activity.category,
            activity.details,
          ]
            .map((field) => `"${field}"`)
            .join(","),
        ),
      ].join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "activity-log.csv"
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deepBrand">Activity Log</h1>
            <p className="text-deepBrand">
              Track communications, shared documents, and meeting activities with managers
            </p>
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

                {/* Filter Controls */}
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
                          Manager
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </th>
                      <th className="pb-2 font-medium">User</th>
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
                            <div className="text-sm text-deepBrand">{activity.manager}</div>
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
