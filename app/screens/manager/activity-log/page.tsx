"use client"

import { useState, useEffect } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Activity,
  Download,
  ArrowUpDown,
  FileText,
  Calendar,
  Users,
  MessageSquare,
  Eye,
  Search,
  Filter,
  X,
  Clock,
  Building2,
  User,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { DataExportButton } from "@/components/ui/data-action-buttons"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for activity log - manager specific
const activityData = [
  {
    id: "act-001",
    type: "document_shared",
    user: "Sarah Johnson",
    userRole: "Portfolio Manager",
    target: "Q3 2023 Performance Report",
    targetType: "document",
    client: "CalPERS Investment Team",
    timestamp: "2023-11-05T14:30:00Z",
    details: "Shared document with client",
    category: "document",
    filters: ["document", "document_shared", "calpers", "sarah johnson", "portfolio manager"],
  },
  {
    id: "act-002",
    type: "meeting_scheduled",
    user: "Michael Chen",
    userRole: "Client Relations",
    target: "Due Diligence Meeting",
    targetType: "meeting",
    client: "Ontario Teachers' Pension Plan",
    timestamp: "2023-11-04T10:15:00Z",
    details: "Scheduled a meeting for November 15, 2023",
    category: "meeting",
    filters: ["meeting", "meeting_scheduled", "ontario teachers", "michael chen", "client relations"],
  },
  {
    id: "act-003",
    type: "data_room_updated",
    user: "Emily Rodriguez",
    userRole: "Investment Analyst",
    target: "Growth Strategy Fund - Q3 Materials",
    targetType: "data_room",
    client: "Multiple Clients",
    timestamp: "2023-11-03T16:45:00Z",
    details: "Updated data room with new materials",
    category: "data_room",
    filters: ["data_room", "data_room_updated", "multiple clients", "emily rodriguez", "investment analyst"],
  },
  {
    id: "act-004",
    type: "message_sent",
    user: "David Kim",
    userRole: "Senior Associate",
    target: "Follow-up on investment committee presentation",
    targetType: "conversation",
    client: "State of Wisconsin Investment Board",
    timestamp: "2023-11-03T09:20:00Z",
    details: "Sent a message to client",
    category: "communication",
    filters: ["communication", "message_sent", "wisconsin", "david kim", "senior associate"],
  },
  {
    id: "act-005",
    type: "document_uploaded",
    user: "Lisa Wang",
    userRole: "ESG Analyst",
    target: "ESG Impact Report 2024",
    targetType: "document",
    client: "Multiple Clients",
    timestamp: "2023-11-02T13:10:00Z",
    details: "Uploaded new document to data room",
    category: "document",
    filters: ["document", "document_uploaded", "multiple clients", "lisa wang", "esg analyst"],
  },
  {
    id: "act-006",
    type: "client_access",
    user: "Robert Wilson",
    userRole: "Client",
    target: "Fixed Income Strategy Data Room",
    targetType: "data_room",
    client: "New York State Common Retirement Fund",
    timestamp: "2023-11-01T11:05:00Z",
    details: "Client accessed data room for 30 minutes",
    category: "data_room",
    filters: ["data_room", "client_access", "new york state", "robert wilson", "client"],
  },
  {
    id: "act-007",
    type: "document_comment",
    user: "Jennifer Lee",
    userRole: "Client",
    target: "Investment Policy Statement",
    targetType: "document",
    client: "California State Teachers' Retirement System",
    timestamp: "2023-10-31T15:30:00Z",
    details: "Client added a comment to document",
    category: "document",
    filters: ["document", "document_comment", "california state teachers", "jennifer lee", "client"],
  },
  {
    id: "act-008",
    type: "message_received",
    user: "Amanda Taylor",
    userRole: "Client",
    target: "Request for Additional Information",
    targetType: "conversation",
    client: "Florida State Board of Administration",
    timestamp: "2023-10-30T09:45:00Z",
    details: "Received a message from client",
    category: "communication",
    filters: ["communication", "message_received", "florida state", "amanda taylor", "client"],
  },
  {
    id: "act-009",
    type: "meeting_completed",
    user: "James Johnson",
    userRole: "Managing Director",
    target: "Quarterly Performance Review",
    targetType: "meeting",
    client: "Washington State Investment Board",
    timestamp: "2023-10-29T14:20:00Z",
    details: "Completed a 60-minute meeting",
    category: "meeting",
    filters: ["meeting", "meeting_completed", "washington state", "james johnson", "managing director"],
  },
  {
    id: "act-010",
    type: "connection_accepted",
    user: "Sophia Garcia",
    userRole: "Client",
    target: "Connection Request",
    targetType: "connection",
    client: "Teacher Retirement System of Texas",
    timestamp: "2023-10-28T11:00:00Z",
    details: "Client accepted connection request",
    category: "connection",
    filters: ["connection", "connection_accepted", "texas", "sophia garcia", "client"],
  },
  {
    id: "act-011",
    type: "document_viewed",
    user: "Thomas Wright",
    userRole: "Client",
    target: "Investment Strategy Presentation",
    targetType: "document",
    client: "Virginia Retirement System",
    timestamp: "2023-10-27T13:15:00Z",
    details: "Client viewed document for 15 minutes",
    category: "document",
    filters: ["document", "document_viewed", "virginia", "thomas wright", "client"],
  },
  {
    id: "act-012",
    type: "data_room_created",
    user: "Lisa Chen",
    userRole: "Product Manager",
    target: "New Product Launch Data Room",
    targetType: "data_room",
    client: "Multiple Clients",
    timestamp: "2023-10-26T10:30:00Z",
    details: "Created new data room for product launch",
    category: "data_room",
    filters: ["data_room", "data_room_created", "multiple clients", "lisa chen", "product manager"],
  },
  {
    id: "act-013",
    type: "message_sent",
    user: "Daniel Brown",
    userRole: "Relationship Manager",
    target: "Quarterly Update",
    targetType: "conversation",
    client: "Oregon Public Employees Retirement System",
    timestamp: "2023-10-25T16:45:00Z",
    details: "Sent quarterly update message to client",
    category: "communication",
    filters: ["communication", "message_sent", "oregon", "daniel brown", "relationship manager"],
  },
  {
    id: "act-014",
    type: "meeting_scheduled",
    user: "Rachel Kim",
    userRole: "Client",
    target: "Due Diligence Follow-up",
    targetType: "meeting",
    client: "Minnesota State Board of Investment",
    timestamp: "2023-10-24T09:20:00Z",
    details: "Client scheduled a follow-up meeting",
    category: "meeting",
    filters: ["meeting", "meeting_scheduled", "minnesota", "rachel kim", "client"],
  },
  {
    id: "act-015",
    type: "document_downloaded",
    user: "Mark Johnson",
    userRole: "Client",
    target: "Risk Analysis Report",
    targetType: "document",
    client: "Ohio Public Employees Retirement System",
    timestamp: "2023-10-23T14:10:00Z",
    details: "Client downloaded document",
    category: "document",
    filters: ["document", "document_downloaded", "ohio", "mark johnson", "client"],
  },
]

// Activity type icon mapping with enhanced styling
const activityIcons = {
  document_shared: <FileText className="h-5 w-5 text-purple-600" />,
  document_uploaded: <FileText className="h-5 w-5 text-blue-600" />,
  document_viewed: <Eye className="h-5 w-5 text-green-600" />,
  document_downloaded: <Download className="h-5 w-5 text-emerald-600" />,
  document_comment: <MessageSquare className="h-5 w-5 text-orange-600" />,
  meeting_scheduled: <Calendar className="h-5 w-5 text-purple-600" />,
  meeting_completed: <Calendar className="h-5 w-5 text-green-600" />,
  data_room_updated: <FileText className="h-5 w-5 text-blue-600" />,
  data_room_created: <FileText className="h-5 w-5 text-indigo-600" />,
  client_access: <Eye className="h-5 w-5 text-amber-600" />,
  message_sent: <MessageSquare className="h-5 w-5 text-blue-600" />,
  message_received: <MessageSquare className="h-5 w-5 text-green-600" />,
  connection_accepted: <Users className="h-5 w-5 text-green-600" />,
}

// Activity category badge mapping with enhanced colors
const categoryBadges = {
  document: { color: "bg-blue-50 text-blue-700 border border-blue-200", label: "Document" },
  communication: { color: "bg-green-50 text-green-700 border border-green-200", label: "Communication" },
  meeting: { color: "bg-purple-50 text-purple-700 border border-purple-200", label: "Meeting" },
  connection: { color: "bg-yellow-50 text-yellow-700 border border-yellow-200", label: "Connection" },
  data_room: { color: "bg-orange-50 text-orange-700 border border-orange-200", label: "Data Room" },
}

// Filter options for the dropdown
const filterOptions = {
  categories: [
    { label: "Document", value: "document" },
    { label: "Communication", value: "communication" },
    { label: "Meeting", value: "meeting" },
    { label: "Data Room", value: "data_room" },
    { label: "Connection", value: "connection" },
  ],
  activityTypes: [
    { label: "Document Shared", value: "document_shared" },
    { label: "Document Uploaded", value: "document_uploaded" },
    { label: "Document Viewed", value: "document_viewed" },
    { label: "Document Downloaded", value: "document_downloaded" },
    { label: "Document Comment", value: "document_comment" },
    { label: "Meeting Scheduled", value: "meeting_scheduled" },
    { label: "Meeting Completed", value: "meeting_completed" },
    { label: "Data Room Updated", value: "data_room_updated" },
    { label: "Data Room Created", value: "data_room_created" },
    { label: "Client Access", value: "client_access" },
    { label: "Message Sent", value: "message_sent" },
    { label: "Message Received", value: "message_received" },
    { label: "Connection Accepted", value: "connection_accepted" },
  ],
  userRoles: [
    { label: "Portfolio Manager", value: "portfolio manager" },
    { label: "Client Relations", value: "client relations" },
    { label: "Investment Analyst", value: "investment analyst" },
    { label: "Senior Associate", value: "senior associate" },
    { label: "ESG Analyst", value: "esg analyst" },
    { label: "Client", value: "client" },
    { label: "Managing Director", value: "managing director" },
    { label: "Product Manager", value: "product manager" },
    { label: "Relationship Manager", value: "relationship manager" },
  ],
}

export default function ManagerActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredActivities, setFilteredActivities] = useState(activityData)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    activityTypes: [] as string[],
    userRoles: [] as string[],
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const { toast } = useToast()

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

      // Category filter
      const matchesCategory =
        selectedFilters.categories.length === 0 || selectedFilters.categories.includes(activity.category)

      // Activity type filter
      const matchesActivityType =
        selectedFilters.activityTypes.length === 0 || selectedFilters.activityTypes.includes(activity.type)

      // User role filter
      const matchesUserRole =
        selectedFilters.userRoles.length === 0 ||
        selectedFilters.userRoles.some((role) => activity.userRole.toLowerCase().includes(role.toLowerCase()))

      return matchesSearch && matchesDateRange && matchesCategory && matchesActivityType && matchesUserRole
    })

    setFilteredActivities(filtered)
  }, [searchQuery, dateRange, selectedFilters])

  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string, checked: boolean) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: checked ? [...prev[filterType], value] : prev[filterType].filter((item) => item !== value),
    }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setDateRange({ start: "", end: "" })
    setSelectedFilters({
      categories: [],
      activityTypes: [],
      userRoles: [],
    })
    setShowAdvancedFilters(false)
  }

  // Get total active filters count
  const activeFiltersCount =
    selectedFilters.categories.length + selectedFilters.activityTypes.length + selectedFilters.userRoles.length

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
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Exporting activities:", filteredActivities)
      // In a real app, this would generate and download a CSV/Excel file
      toast({
        title: "Exporting data...",
        description: "Your activity log data is being prepared for export.",
      })
      setTimeout(() => {
        toast({
          title: "Export Complete!",
          description: "Your activity log data has been successfully exported.",
        })
      }, 2000)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
      })
    }
  }

  return (
    <Screen title="Activity Log" description="Track all interactions with clients and investment activities">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
              <p className="text-gray-600">Track all interactions with clients and investment activities</p>
            </div>
          </div>
          <DataExportButton
            onExport={handleExport}
            format="csv"
            filename="activity-log.csv"
            recordCount={filteredActivities.length}
            fileSize="~25KB"
          />
        </div>

        {/* Controls Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-white">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search and Filter Row */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search activities, clients, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Filters Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="gap-2 h-12 px-6 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-blue-600 hover:bg-blue-700 text-white">{activeFiltersCount}</Badge>
                  )}
                  {showAdvancedFilters ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>

              {/* Date Range Filters */}
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="start-date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="end-date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    className="px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>

                {/* Clear All Button */}
                {(searchQuery || dateRange.start || dateRange.end || activeFiltersCount > 0) && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="h-12 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Advanced Filters Panel */}
              {showAdvancedFilters && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Categories */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-800">Category</h4>
                      </div>
                      <div className="space-y-3">
                        {filterOptions.categories.map((option) => (
                          <div key={option.value} className="flex items-center space-x-3">
                            <Checkbox
                              id={`category-${option.value}`}
                              checked={selectedFilters.categories.includes(option.value)}
                              onCheckedChange={(checked) =>
                                handleFilterChange("categories", option.value, checked as boolean)
                              }
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <label
                              htmlFor={`category-${option.value}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity Types */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-800">Activity Type</h4>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {filterOptions.activityTypes.map((option) => (
                          <div key={option.value} className="flex items-center space-x-3">
                            <Checkbox
                              id={`activity-${option.value}`}
                              checked={selectedFilters.activityTypes.includes(option.value)}
                              onCheckedChange={(checked) =>
                                handleFilterChange("activityTypes", option.value, checked as boolean)
                              }
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <label
                              htmlFor={`activity-${option.value}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* User Roles */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-800">User Role</h4>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {filterOptions.userRoles.map((option) => (
                          <div key={option.value} className="flex items-center space-x-3">
                            <Checkbox
                              id={`role-${option.value}`}
                              checked={selectedFilters.userRoles.includes(option.value)}
                              onCheckedChange={(checked) =>
                                handleFilterChange("userRoles", option.value, checked as boolean)
                              }
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <label
                              htmlFor={`role-${option.value}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filter Tags */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.categories.map((category) => {
                    const option = filterOptions.categories.find((opt) => opt.value === category)
                    return option ? (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      >
                        {option.label}
                        <button
                          onClick={() => handleFilterChange("categories", category, false)}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                  {selectedFilters.activityTypes.map((type) => {
                    const option = filterOptions.activityTypes.find((opt) => opt.value === type)
                    return option ? (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      >
                        {option.label}
                        <button
                          onClick={() => handleFilterChange("activityTypes", type, false)}
                          className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                  {selectedFilters.userRoles.map((role) => {
                    const option = filterOptions.userRoles.find((opt) => opt.value === role)
                    return option ? (
                      <Badge
                        key={role}
                        variant="secondary"
                        className="gap-2 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                      >
                        {option.label}
                        <button
                          onClick={() => handleFilterChange("userRoles", role, false)}
                          className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">
              Showing {filteredActivities.length} of {activityData.length} activities
            </span>
          </div>
        </div>

        {/* Activity List */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 font-semibold text-gray-700">
                      <Clock className="h-4 w-4" />
                      Time
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Activity</th>
                  <th className="px-6 py-4 text-left">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 font-semibold text-gray-700">
                      <Building2 className="h-4 w-4" />
                      Client
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity, index) => (
                    <tr
                      key={activity.id}
                      className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-900">{formatDate(activity.timestamp)}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getRelativeTime(activity.timestamp)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                            {activityIcons[activity.type] || <Activity className="h-5 w-5 text-gray-500" />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{activity.target}</div>
                            <div className="text-xs text-gray-500 capitalize">{activity.type.replace("_", " ")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{activity.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                            <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{activity.user}</div>
                            <div className="text-xs text-gray-500">{activity.userRole}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge className={`${categoryBadges[activity.category]?.color || "bg-gray-100 text-gray-800"}`}>
                          {categoryBadges[activity.category]?.label || activity.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 max-w-xs">{activity.details}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-full">
                          <Activity className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">No activities found</div>
                          <div className="text-xs text-gray-500">Try adjusting your filters or search terms</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Screen>
  )
}
