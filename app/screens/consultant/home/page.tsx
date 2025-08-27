"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  FileText,
  Search,
  Calendar,
  ArrowRight,
  Lightbulb,
  Network,
  TrendingUp,
  MessageCircle,
  Building,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  DollarSign,
  Briefcase,
  Eye,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function ConsultantHomePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")

  // Mock data matching other dashboards
  const recentActivity = [
    {
      id: 1,
      type: "connection",
      icon: UserPlus,
      title: "New connection request",
      description: "Sarah Chen from CalPERS sent you a connection request",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      type: "document",
      icon: FileText,
      title: "Document shared",
      description: "Market Research Q3 2024 was shared with 3 clients",
      time: "5 hours ago",
      status: "completed",
    },
    {
      id: 3,
      type: "meeting",
      icon: Calendar,
      title: "Meeting scheduled",
      description: "Advisory call with Rockefeller Family Office confirmed",
      time: "1 day ago",
      status: "scheduled",
    },
    {
      id: 4,
      type: "research",
      icon: TrendingUp,
      title: "Research completed",
      description: "Due diligence report for Apollo Global Management finalized",
      time: "2 days ago",
      status: "completed",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      date: "Jul 15",
      title: "Private Markets Summit 2024",
      organizer: "Institutional Investor",
      type: "conference",
      location: "New York, NY",
      status: "registered",
    },
    {
      id: 2,
      date: "Jul 28",
      title: "Regulatory Compliance in Private Markets",
      organizer: "Compliance Institute",
      type: "conference",
      location: "Washington, DC",
      status: "registered",
    },
    {
      id: 3,
      date: "Aug 05",
      title: "ESG Investing Strategies Workshop",
      organizer: "CFA Institute",
      type: "workshop",
      location: "Virtual",
      status: "pending",
    },
  ]



  const clientMetrics = [
    { label: "Active Clients", value: "24", change: "+3", trend: "up", icon: Users },
    { label: "Total AUA", value: "$2.1B", change: "+12%", trend: "up", icon: DollarSign },
    { label: "Active Engagements", value: "8", change: "0", trend: "neutral", icon: Briefcase },
  ]

  const actionItems = [
    {
      id: 1,
      type: "urgent",
      icon: AlertCircle,
      title: "Follow up required",
      description: "3 client meetings need scheduling",
      color: "yellow",
    },
    {
      id: 2,
      type: "pending",
      icon: Clock,
      title: "Due diligence pending",
      description: "2 manager evaluations due this week",
      color: "blue",
    },
    {
      id: 3,
      type: "completed",
      icon: CheckCircle2,
      title: "Reports ready",
      description: "5 quarterly reports completed",
      color: "green",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "connection":
        return UserPlus
      case "document":
        return FileText
      case "meeting":
        return Calendar
      case "research":
        return TrendingUp
      case "client":
        return Building
      default:
        return FileText
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "scheduled":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionItemColor = (color: string) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "green":
        return "bg-green-50 border-green-200 text-green-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getActionIconColor = (color: string) => {
    switch (color) {
      case "yellow":
        return "text-yellow-600"
      case "blue":
        return "text-blue-600"
      case "green":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Screen>
      <div className="container mx-auto px-6 py-8 md:px-8 lg:px-10 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-deep-brand">Dashboard</h1>
            <p className="text-base text-base-gray">
              Welcome back to your consultant dashboard. Here's what's happening with your clients and prospects.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-vestira p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-deep-brand mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/screens/consultant/client-search">
                <div className="group flex items-center gap-3 p-4 rounded-lg bg-electric-blue/5 hover:bg-electric-blue/10 border border-electric-blue/20 hover:border-electric-blue/30 transition-all duration-300 min-h-[80px]">
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    <Search className="h-5 w-5 text-electric-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-deep-brand text-sm">Find Clients</h3>
                    <p className="text-xs text-base-gray">Search prospects</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link href="/screens/consultant/market-research">
                <div className="group flex items-center gap-3 p-4 rounded-lg bg-electric-blue/5 hover:bg-electric-blue/10 border border-electric-blue/20 hover:border-electric-blue/30 transition-all duration-300 min-h-[80px]">
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    <TrendingUp className="h-5 w-5 text-electric-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-deep-brand text-sm">Research Hub</h3>
                    <p className="text-xs text-base-gray">Find allocators & managers</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link href="/screens/consultant/due-diligence-hub">
                <div className="group flex items-center gap-3 p-4 rounded-lg bg-electric-blue/5 hover:bg-electric-blue/10 border border-electric-blue/20 hover:border-electric-blue/30 transition-all duration-300 min-h-[80px]">
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    <Lightbulb className="h-5 w-5 text-electric-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-deep-brand text-sm">Due Diligence</h3>
                    <p className="text-xs text-base-gray">Start research</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              <Link href="/screens/general/connection-center">
                <div className="group flex items-center gap-3 p-4 rounded-lg bg-electric-blue/5 hover:bg-electric-blue/10 border border-electric-blue/20 hover:border-electric-blue/30 transition-all duration-300 min-h-[80px]">
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    <Network className="h-5 w-5 text-electric-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-deep-brand text-sm">Network</h3>
                    <p className="text-xs text-base-gray">Manage connections</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Client Metrics */}
              <Card className="shadow-vestira border-gray-100">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-deep-brand">Client Overview</CardTitle>
                      <CardDescription>Key metrics from your client portfolio</CardDescription>
                    </div>
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {clientMetrics.map((metric, index) => (
                      <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <metric.icon className="h-5 w-5 text-electric-blue" />
                          <div
                            className={`text-xs font-medium ${
                              metric.trend === "up"
                                ? "text-green-600"
                                : metric.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {metric.change !== "0" && (metric.trend === "up" ? "+" : "")}
                            {metric.change}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-deep-brand mb-1">{metric.value}</div>
                        <div className="text-sm text-base-gray">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-vestira border-gray-100">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-deep-brand">Recent Activity</CardTitle>
                      <CardDescription>Your latest actions and updates</CardDescription>
                    </div>
                    <Link href="/screens/consultant/activity-log">
                      <Button variant="ghost" size="sm" className="text-electric-blue hover:text-electric-blue/80">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type)
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-1.5 rounded-full bg-electric-blue/10">
                          <IconComponent className="h-4 w-4 text-electric-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-deep-brand">{activity.title}</p>
                          <p className="text-xs text-base-gray">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-base-gray">{activity.time}</p>
                            <span className={`text-xs font-medium ${getActivityColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Action Items */}
              <Card className="shadow-vestira border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-deep-brand">Action Items</CardTitle>
                  <CardDescription>Tasks requiring your attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {actionItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${getActionItemColor(item.color)}`}
                    >
                      <item.icon className={`h-4 w-4 mt-0.5 ${getActionIconColor(item.color)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs opacity-80">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="shadow-vestira border-gray-100">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-deep-brand">Upcoming Events</CardTitle>
                    <Link href="/screens/consultant/events">
                      <Button variant="ghost" size="sm" className="text-electric-blue hover:text-electric-blue/80">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center min-w-[48px]">
                        <div className="text-sm font-semibold text-electric-blue">{event.date.split(" ")[1]}</div>
                        <div className="text-xs text-base-gray">{event.date.split(" ")[0]}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-deep-brand line-clamp-2">{event.title}</h4>
                        <p className="text-xs text-base-gray mt-1">{event.organizer}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(event.status)}`}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>




            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}
