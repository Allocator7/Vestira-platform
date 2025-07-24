"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Users,
  Briefcase,
  AlertTriangle,
  Search,
  FileSearch,
  FolderOpen,
  UserPlus,
  Calendar,
  ArrowRight,
  PlusCircle,
  Network,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function AllocatorHomePage() {
  const recentActivity = [
    {
      id: 1,
      type: "document",
      title: "Q3 Performance Report",
      manager: "BlackRock Capital",
      time: "2 hours ago",
      status: "new",
    },
    {
      id: 2,
      type: "meeting",
      title: "Due Diligence Call",
      manager: "Meridian Partners",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      type: "alert",
      title: "Risk Threshold Alert",
      manager: "Alpha Ventures",
      time: "2 days ago",
      status: "attention",
    },
    {
      id: 4,
      type: "message",
      title: "New Message Received",
      manager: "TPG Inc",
      time: "3 days ago",
      status: "unread",
    },
    {
      id: 5,
      type: "insight",
      title: "Market Outlook Published",
      manager: "Apollo Global",
      time: "4 days ago",
      status: "new",
    },
  ]

  // Upcoming events that match exactly what's in Events Center My Events for Allocators
  const upcomingEvents = [
    {
      id: 2,
      date: "Jul 25",
      title: "Alternative Investment Allocation Strategies",
      organizer: "Pension Fund Institute",
      type: "conference",
      location: "Chicago, IL",
      time: "09:00 AM - 04:00 PM",
      fullDate: "2025-07-25",
      status: "registered",
    },
  ]

  return (
    <div className="container mx-auto px-6 py-8 md:px-8 lg:px-10 max-w-7xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-deep-brand">Dashboard</h1>
          <p className="text-base text-base-gray">Welcome back to your allocator dashboard.</p>
        </div>

        {/* Quick Actions - Perfect Brand Consistency */}
        <div className="bg-white rounded-xl shadow-vestira p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-deep-brand mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/screens/allocator/manager-search">
              <div className="group flex items-center gap-3 p-4 rounded-lg bg-electric-blue/5 hover:bg-electric-blue/10 border border-electric-blue/20 hover:border-electric-blue/30 transition-all duration-300 min-h-[80px]">
                <div className="p-2 rounded-full bg-white shadow-sm">
                  <Search className="h-5 w-5 text-electric-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-deep-brand text-sm">Find Managers</h3>
                  <p className="text-xs text-base-gray">Search managers</p>
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
                  <h3 className="font-medium text-deep-brand text-sm">Grow Network</h3>
                  <p className="text-xs text-base-gray">Expand network</p>
                </div>
                <ArrowRight className="h-4 w-4 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            <Link href="/screens/allocator/due-diligence-hub">
              <div className="group flex items-center gap-3 p-4 rounded-lg bg-electric-blue/5 hover:bg-electric-blue/10 border border-electric-blue/20 hover:border-electric-blue/30 transition-all duration-300 min-h-[80px]">
                <div className="p-2 rounded-full bg-white shadow-sm">
                  <PlusCircle className="h-5 w-5 text-electric-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-deep-brand text-sm">Due Diligence</h3>
                  <p className="text-xs text-base-gray">Start due diligence</p>
                </div>
                <ArrowRight className="h-4 w-4 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            <Link href="/screens/allocator/data-rooms">
              <div className="group flex items-center gap-3 p-4 rounded-lg bg-electric-blue/5 hover:bg-electric-blue/10 border border-electric-blue/20 hover:border-electric-blue/30 transition-all duration-300 min-h-[80px]">
                <div className="p-2 rounded-full bg-white shadow-sm">
                  <FolderOpen className="h-5 w-5 text-electric-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-deep-brand text-sm">Data Rooms</h3>
                  <p className="text-xs text-base-gray">Access documents</p>
                </div>
                <ArrowRight className="h-4 w-4 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/screens/allocator/managers">
            <Card className="vestira-card-minimal hover:shadow-vestira-lg transition-all duration-300 cursor-pointer border-2 hover:border-electric-blue/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-gray">Total Managers</p>
                    <p className="text-3xl font-bold text-deep-brand">24</p>
                  </div>
                  <div className="p-3 bg-electric-blue/10 rounded-full">
                    <Briefcase className="h-6 w-6 text-electric-blue" />
                  </div>
                </div>
                <p className="text-sm text-base-gray mt-2">Active relationships</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/screens/allocator/due-diligence-hub?tab=active">
            <Card className="vestira-card-minimal hover:shadow-vestira-lg transition-all duration-300 cursor-pointer border-2 hover:border-electric-blue/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-gray">Active Searches</p>
                    <p className="text-3xl font-bold text-deep-brand">8</p>
                  </div>
                  <div className="p-3 bg-electric-blue/10 rounded-full">
                    <FileSearch className="h-6 w-6 text-electric-blue" />
                  </div>
                </div>
                <p className="text-sm text-base-gray mt-2">Due diligence in progress</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/screens/general/connection-center?tab=pending">
            <Card className="vestira-card-minimal hover:shadow-vestira-lg transition-all duration-300 cursor-pointer border-2 hover:border-electric-blue/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-gray">New Connection Requests</p>
                    <p className="text-3xl font-bold text-deep-brand">3</p>
                  </div>
                  <div className="p-3 bg-electric-blue/10 rounded-full">
                    <UserPlus className="h-6 w-6 text-electric-blue" />
                  </div>
                </div>
                <p className="text-sm text-base-gray mt-2">Pending connections</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 vestira-card-minimal">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-deep-brand">Recent Activity</CardTitle>
                  <CardDescription className="text-base-gray">Your recent interactions with managers</CardDescription>
                </div>
                <Link href="/screens/allocator/activity-log">
                  <Button variant="outline" size="sm">
                    View All Activity
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 bg-white hover:border-electric-blue/30 transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === "document"
                            ? "bg-blue-100"
                            : activity.type === "meeting"
                              ? "bg-green-100"
                              : activity.type === "alert"
                                ? "bg-amber-100"
                                : activity.type === "message"
                                  ? "bg-purple-100"
                                  : "bg-indigo-100"
                        }`}
                      >
                        {activity.type === "document" && <FileText className="h-4 w-4 text-blue-600" />}
                        {activity.type === "meeting" && <Users className="h-4 w-4 text-green-600" />}
                        {activity.type === "alert" && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        {activity.type === "message" && <MessageSquare className="h-4 w-4 text-purple-600" />}
                        {activity.type === "insight" && <BarChart3 className="h-4 w-4 text-indigo-600" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-deep-brand">{activity.title}</p>
                      <p className="text-sm text-base-gray truncate">{activity.manager}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          activity.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : activity.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "attention"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-purple-100 text-purple-800"
                        }
                      >
                        {activity.status}
                      </Badge>
                      <div className="text-sm text-base-gray">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 vestira-card-minimal">
            <CardHeader>
              <CardTitle className="text-deep-brand">Upcoming Events</CardTitle>
              <CardDescription className="text-base-gray">Your registered events and conferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-electric-blue/10 rounded-md flex flex-col items-center justify-center text-electric-blue">
                          <span className="text-xs font-medium">{event.date.split(" ")[0]}</span>
                          <span className="text-xs">{event.date.split(" ")[1]}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-deep-brand">{event.title}</h4>
                        <p className="text-sm text-base-gray">
                          {event.organizer} • {event.location}
                        </p>
                        <p className="text-xs text-base-gray mt-1">{event.time}</p>
                        <Badge
                          className={
                            event.type === "conference"
                              ? "bg-blue-100 text-blue-800"
                              : event.type === "workshop"
                                ? "bg-green-100 text-green-800"
                                : event.type === "summit"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-orange-100 text-orange-800"
                          }
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No upcoming events</p>
                    <p className="text-xs">Register for events to see them here</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link href="/screens/allocator/events">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Events Center
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Insights Section */}
        <Card className="vestira-card-minimal">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-deep-brand">Latest Insights</CardTitle>
                <CardDescription className="text-base-gray">
                  Recent insights from your followed managers
                </CardDescription>
              </div>
              <Link href="/screens/allocator/insights">
                <Button variant="outline" size="sm">
                  View All Insights
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Q4 Market Outlook: Navigating Volatility",
                  manager: "BlackRock Capital",
                  category: "Market Analysis",
                  publishedAt: "2 days ago",
                  readTime: "5 min read",
                  summary: "Our latest perspective on market conditions and positioning for Q4 2024.",
                },
                {
                  title: "ESG Integration in Private Equity",
                  manager: "Meridian Partners",
                  category: "ESG Strategy",
                  publishedAt: "1 week ago",
                  readTime: "8 min read",
                  summary: "How we're incorporating ESG factors into our investment process.",
                },
                {
                  title: "Emerging Markets Opportunities",
                  manager: "Alpha Ventures",
                  category: "Investment Strategy",
                  publishedAt: "2 weeks ago",
                  readTime: "6 min read",
                  summary: "Identifying value in emerging market equities amid global uncertainty.",
                },
              ].map((insight, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 hover:border-electric-blue/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div>
                      <Badge className="bg-electric-blue/10 text-electric-blue mb-2">{insight.category}</Badge>
                      <h4 className="font-medium text-deep-brand line-clamp-2">{insight.title}</h4>
                    </div>
                    <p className="text-sm text-base-gray line-clamp-2">{insight.summary}</p>
                    <div className="flex items-center justify-between text-xs text-base-gray">
                      <span>{insight.manager}</span>
                      <span>{insight.readTime}</span>
                    </div>
                    <div className="text-xs text-base-gray">{insight.publishedAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
