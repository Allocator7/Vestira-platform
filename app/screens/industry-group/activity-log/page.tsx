"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Users,
  AlertTriangle,
  Search,
  UserPlus,
  Calendar,
  MessageSquare,
  BarChart3,
  Mail,
  Filter,
} from "lucide-react"
import { useState } from "react"

export default function IndustryGroupActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const activityData = [
    {
      id: 1,
      type: "document",
      title: "Event Registration Report Generated",
      description: "Annual Investment Summit registration report created",
      user: "System",
      time: "2 hours ago",
      status: "completed",
      details: "Generated comprehensive report with 450 registrations",
    },
    {
      id: 2,
      type: "meeting",
      title: "Sponsor Meeting Scheduled",
      description: "BlackRock Partnership sponsor meeting arranged",
      user: "Jennifer Walsh",
      time: "4 hours ago",
      status: "scheduled",
      details: "Meeting scheduled for next Tuesday at 2:00 PM",
    },
    {
      id: 3,
      type: "alert",
      title: "Member Capacity Alert Triggered",
      description: "ESG Webinar Series approaching capacity limit",
      user: "System",
      time: "6 hours ago",
      status: "attention",
      details: "Current capacity: 95% (475/500 members)",
    },
    {
      id: 4,
      type: "message",
      title: "VeMail Campaign Sent",
      description: "Q4 Newsletter distributed to all members",
      user: "Communications Team",
      time: "1 day ago",
      status: "completed",
      details: "Sent to 1,450 members with 78% open rate",
    },
    {
      id: 5,
      type: "member",
      title: "New Member Registration",
      description: "Sarah Chen from Goldman Sachs joined",
      user: "System",
      time: "1 day ago",
      status: "completed",
      details: "Member ID: MEM-2024-1451, Tier: Premium",
    },
    {
      id: 6,
      type: "event",
      title: "Event Created",
      description: "Alternative Investment Strategies Summit scheduled",
      user: "Event Management",
      time: "2 days ago",
      status: "active",
      details: "Event date: July 15, 2025, Location: New York, NY",
    },
    {
      id: 7,
      type: "connection",
      title: "Connection Request Approved",
      description: "Michael Torres connected with Lisa Park",
      user: "Connection Center",
      time: "2 days ago",
      status: "completed",
      details: "Connection facilitated through networking event",
    },
    {
      id: 8,
      type: "insight",
      title: "Market Insight Published",
      description: "Q4 Private Equity Market Analysis released",
      user: "Research Team",
      time: "3 days ago",
      status: "published",
      details: "Available in Market Insights section",
    },
    {
      id: 9,
      type: "certificate",
      title: "Certificate Issued",
      description: "CPE Certificate issued to John Smith",
      user: "System",
      time: "3 days ago",
      status: "completed",
      details: "Certificate ID: CERT-2024-0892, Credits: 2.5",
    },
    {
      id: 10,
      type: "communication",
      title: "Invitation Sent",
      description: "Board meeting invitations distributed",
      user: "Admin Team",
      time: "4 days ago",
      status: "sent",
      details: "Sent to 12 board members for January meeting",
    },
  ]

  const filteredActivities = activityData.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || activity.type === filterType
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "meeting":
        return <Users className="h-4 w-4 text-green-600" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      case "member":
        return <UserPlus className="h-4 w-4 text-indigo-600" />
      case "event":
        return <Calendar className="h-4 w-4 text-orange-600" />
      case "connection":
        return <Users className="h-4 w-4 text-teal-600" />
      case "insight":
        return <BarChart3 className="h-4 w-4 text-pink-600" />
      case "certificate":
        return <FileText className="h-4 w-4 text-emerald-600" />
      case "communication":
        return <Mail className="h-4 w-4 text-cyan-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100"
      case "meeting":
        return "bg-green-100"
      case "alert":
        return "bg-amber-100"
      case "message":
        return "bg-purple-100"
      case "member":
        return "bg-indigo-100"
      case "event":
        return "bg-orange-100"
      case "connection":
        return "bg-teal-100"
      case "insight":
        return "bg-pink-100"
      case "certificate":
        return "bg-emerald-100"
      case "communication":
        return "bg-cyan-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-orange-100 text-orange-800"
      case "attention":
        return "bg-amber-100 text-amber-800"
      case "published":
        return "bg-purple-100 text-purple-800"
      case "sent":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 md:px-8 lg:px-10 max-w-7xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-deep-brand">Activity Log</h1>
          <p className="text-base text-base-gray">Track all industry group activities and system events.</p>
        </div>

        {/* Filters */}
        <Card className="vestira-card-minimal">
          <CardHeader>
            <CardTitle className="text-deep-brand flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-brand">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-brand">Activity Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="alert">Alerts</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                    <SelectItem value="member">Members</SelectItem>
                    <SelectItem value="event">Events</SelectItem>
                    <SelectItem value="connection">Connections</SelectItem>
                    <SelectItem value="insight">Insights</SelectItem>
                    <SelectItem value="certificate">Certificates</SelectItem>
                    <SelectItem value="communication">Communications</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-brand">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="attention">Needs Attention</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <Card className="vestira-card-minimal">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-deep-brand">Recent Activities</CardTitle>
                <CardDescription className="text-base-gray">
                  Showing {filteredActivities.length} of {activityData.length} activities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 bg-white hover:border-electric-blue/30 transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${getActivityBgColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-deep-brand">{activity.title}</h4>
                          <p className="text-sm text-base-gray">{activity.description}</p>
                          <p className="text-xs text-base-gray">{activity.details}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={getStatusBadgeColor(activity.status)}>{activity.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-base-gray">
                        <span>By {activity.user}</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No activities found matching your filters</p>
                  <p className="text-xs">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
