"use client"
import { useState } from "react"
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Activity,
  Bell,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { MobileLayout } from "@/components/MobileLayout"
import { MobileOptimizedCard } from "@/components/MobileOptimizedCard"
import { MobileMetricCard } from "@/components/MobileMetricCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/AppContext"

export default function MobileDashboard() {
  const { userRole } = useApp()
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")

  const timeframes = ["1W", "1M", "3M", "6M", "1Y"]

  // Sample data based on user role
  const getMetrics = () => {
    switch (userRole) {
      case "manager":
        return [
          {
            title: "Assets Under Management",
            value: "$2.4B",
            change: "+12.5%",
            changeType: "positive" as const,
            icon: DollarSign,
          },
          { title: "Active Allocators", value: "47", change: "+3", changeType: "positive" as const, icon: Users },
          { title: "Pending DDQs", value: "8", change: "2 urgent", changeType: "neutral" as const, icon: FileText },
          {
            title: "Fund Performance",
            value: "15.2%",
            change: "+2.1%",
            changeType: "positive" as const,
            icon: TrendingUp,
          },
        ]
      case "consultant":
        return [
          { title: "Client AUM", value: "$1.8B", change: "+8.3%", changeType: "positive" as const, icon: DollarSign },
          { title: "Active Clients", value: "23", change: "+2", changeType: "positive" as const, icon: Users },
          { title: "Advisory Projects", value: "12", change: "3 due", changeType: "neutral" as const, icon: FileText },
          { title: "Performance", value: "11.7%", change: "+1.4%", changeType: "positive" as const, icon: TrendingUp },
        ]
      default: // allocator
        return [
          {
            title: "Portfolio Value",
            value: "$850M",
            change: "+5.2%",
            changeType: "positive" as const,
            icon: DollarSign,
          },
          { title: "Active Managers", value: "12", change: "+1", changeType: "positive" as const, icon: Users },
          { title: "Due Diligence", value: "6", change: "2 pending", changeType: "neutral" as const, icon: FileText },
          { title: "YTD Return", value: "8.9%", change: "+0.7%", changeType: "positive" as const, icon: TrendingUp },
        ]
    }
  }

  const metrics = getMetrics()

  const recentActivity = [
    {
      id: "1",
      type: "document",
      title: "Q3 Performance Report uploaded",
      subtitle: "BlackRock Global Fund",
      time: "2 hours ago",
      urgent: false,
    },
    {
      id: "2",
      type: "meeting",
      title: "Due diligence call scheduled",
      subtitle: "Vanguard - Tomorrow 2:00 PM",
      time: "4 hours ago",
      urgent: true,
    },
    {
      id: "3",
      type: "message",
      title: "New message from Wellington",
      subtitle: "Regarding ESG questionnaire",
      time: "6 hours ago",
      urgent: false,
    },
    {
      id: "4",
      type: "alert",
      title: "Portfolio rebalancing alert",
      subtitle: "Allocation drift detected",
      time: "1 day ago",
      urgent: true,
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText
      case "meeting":
        return Calendar
      case "message":
        return MessageSquare
      case "alert":
        return Bell
      default:
        return Activity
    }
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-deep-brand mb-2">
            Welcome back, {userRole === "manager" ? "Jane" : userRole === "consultant" ? "Alex" : "John"}
          </h1>
          <p className="text-base-gray">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-deep-brand">Key Metrics</h2>
            <div className="flex gap-1">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className="text-xs px-2 py-1 h-7"
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {metrics.map((metric, index) => (
              <MobileMetricCard key={index} {...metric} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <MobileOptimizedCard id="quick-actions" title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-12 flex flex-col gap-1 text-xs" variant="outline">
              <FileText className="h-4 w-4" />
              Upload Doc
            </Button>
            <Button className="h-12 flex flex-col gap-1 text-xs" variant="outline">
              <Users className="h-4 w-4" />
              New Meeting
            </Button>
            <Button className="h-12 flex flex-col gap-1 text-xs" variant="outline">
              <BarChart3 className="h-4 w-4" />
              View Reports
            </Button>
            <Button className="h-12 flex flex-col gap-1 text-xs" variant="outline">
              <MessageSquare className="h-4 w-4" />
              Send Message
            </Button>
          </div>
        </MobileOptimizedCard>

        {/* Recent Activity */}
        <MobileOptimizedCard id="recent-activity" title="Recent Activity">
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-canvas-bg transition-colors duration-200"
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.urgent ? "bg-red-100" : "bg-electric-blue/10"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${activity.urgent ? "text-red-600" : "text-electric-blue"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-deep-brand truncate">{activity.title}</p>
                        <p className="text-xs text-base-gray truncate">{activity.subtitle}</p>
                      </div>
                      {activity.urgent && (
                        <Badge className="bg-red-100 text-red-600 text-xs flex-shrink-0">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-xs text-base-gray mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </MobileOptimizedCard>

        {/* Performance Chart Placeholder */}
        <MobileOptimizedCard id="performance-chart" title="Performance Overview">
          <div className="h-48 bg-canvas-bg rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-base-gray mx-auto mb-2" />
              <p className="text-sm text-base-gray">Performance chart</p>
              <p className="text-xs text-base-gray">Tap to view details</p>
            </div>
          </div>
        </MobileOptimizedCard>
      </div>
    </MobileLayout>
  )
}
