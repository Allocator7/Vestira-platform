"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  X,
  Share2,
  Bookmark,
} from "lucide-react"
import Link from "next/link"

export default function AllocatorHomePage() {
  const [selectedInsight, setSelectedInsight] = useState<any>(null)
  const [showInsightModal, setShowInsightModal] = useState(false)

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

  // Sample insights data with full content
  const insights = [
    {
      id: 1,
      title: "Q4 Market Outlook: Navigating Volatility",
      manager: "BlackRock Capital",
      category: "Market Analysis",
      publishedAt: "2 days ago",
      readTime: "5 min read",
      summary: "Our latest perspective on market conditions and positioning for Q4 2024.",
      content: `As we approach the final quarter of 2024, market participants are grappling with a complex set of economic indicators and geopolitical developments. Our analysis suggests that while volatility may persist, there are strategic opportunities for allocators who maintain a disciplined approach.

Key Themes for Q4:
• Inflation dynamics and central bank policy responses
• Corporate earnings resilience amid economic uncertainty
• Sector rotation opportunities in technology and healthcare
• International diversification benefits

Our proprietary models indicate that a balanced approach to risk management, combined with selective exposure to growth-oriented sectors, may provide optimal positioning for the current environment. We recommend maintaining adequate liquidity while selectively deploying capital into areas of relative value.`,
      author: "Dr. Sarah Chen",
      authorTitle: "Chief Investment Strategist",
      tags: ["Market Analysis", "Volatility", "Q4 Outlook"],
    },
    {
      id: 2,
      title: "ESG Integration in Private Equity",
      manager: "Meridian Partners",
      category: "ESG Strategy",
      publishedAt: "1 week ago",
      readTime: "8 min read",
      summary: "How we're incorporating ESG factors into our investment process.",
      content: `Environmental, Social, and Governance (ESG) considerations have become increasingly important in private equity investing. At Meridian Partners, we've developed a comprehensive framework for integrating ESG factors throughout our investment lifecycle.

Our ESG Integration Framework:
• Pre-investment ESG due diligence and scoring
• Portfolio company ESG improvement programs
• Regular ESG performance monitoring and reporting
• Stakeholder engagement and transparency initiatives

We've found that companies with strong ESG practices often demonstrate better long-term performance, lower risk profiles, and enhanced stakeholder relationships. Our approach focuses on creating value through ESG improvements while maintaining strong financial returns.

Case Study: Our recent investment in GreenTech Solutions demonstrates how ESG integration can drive both impact and returns. Through our ESG improvement program, the company achieved a 30% reduction in carbon emissions while increasing operational efficiency by 15%.`,
      author: "Michael Rodriguez",
      authorTitle: "ESG Director",
      tags: ["ESG", "Private Equity", "Sustainability"],
    },
    {
      id: 3,
      title: "Emerging Markets Opportunities",
      manager: "Alpha Ventures",
      category: "Investment Strategy",
      publishedAt: "2 weeks ago",
      readTime: "6 min read",
      summary: "Identifying value in emerging market equities amid global uncertainty.",
      content: `Emerging markets present unique opportunities for allocators willing to navigate the inherent complexities. Our research indicates that current market conditions have created attractive entry points in select emerging market equities.

Investment Opportunities:
• Technology adoption and digital transformation trends
• Consumer growth driven by rising middle classes
• Infrastructure development and urbanization
• Natural resource and commodity exposure

Risk Management Considerations:
• Currency volatility and hedging strategies
• Political and regulatory risk assessment
• Liquidity constraints and exit planning
• Diversification across regions and sectors

Our emerging markets strategy focuses on companies with strong competitive positions, robust balance sheets, and exposure to secular growth trends. We maintain a disciplined approach to position sizing and risk management while seeking to capture the growth potential of these dynamic markets.`,
      author: "Lisa Thompson",
      authorTitle: "Emerging Markets Portfolio Manager",
      tags: ["Emerging Markets", "Equities", "Global Strategy"],
    },
  ]

  const handleInsightClick = (insight: any) => {
    setSelectedInsight(insight)
    setShowInsightModal(true)
  }

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
                  <h3 className="font-medium text-deep-brand group-hover:text-electric-blue transition-colors">
                    Find Managers
                  </h3>
                  <p className="text-sm text-base-gray">Search and connect with investment managers</p>
                </div>
              </div>
            </Link>

            <Link href="/screens/allocator/due-diligence-hub">
              <div className="group flex items-center gap-3 p-4 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 min-h-[80px]">
                <div className="p-2 rounded-full bg-white shadow-sm">
                  <FileSearch className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-deep-brand group-hover:text-purple-500 transition-colors">
                    Due Diligence
                  </h3>
                  <p className="text-sm text-base-gray">Launch and manage due diligence processes</p>
                </div>
              </div>
            </Link>

            <Link href="/screens/allocator/data-rooms">
              <div className="group flex items-center gap-3 p-4 rounded-lg bg-green-500/5 hover:bg-green-500/10 border border-green-500/20 hover:border-green-500/30 transition-all duration-300 min-h-[80px]">
                <div className="p-2 rounded-full bg-white shadow-sm">
                  <FolderOpen className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-deep-brand group-hover:text-green-500 transition-colors">
                    Data Rooms
                  </h3>
                  <p className="text-sm text-base-gray">Access manager documents and materials</p>
                </div>
              </div>
            </Link>

            <Link href="/screens/allocator/events">
              <div className="group flex items-center gap-3 p-4 rounded-lg bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/30 transition-all duration-300 min-h-[80px]">
                <div className="p-2 rounded-full bg-white shadow-sm">
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-deep-brand group-hover:text-orange-500 transition-colors">
                    Events
                  </h3>
                  <p className="text-sm text-base-gray">Browse and register for industry events</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="vestira-card-minimal">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-electric-blue/10">
                  <Users className="h-5 w-5 text-electric-blue" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-deep-brand">24</p>
                  <p className="text-sm text-base-gray">Active Managers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="vestira-card-minimal">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/10">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-deep-brand">156</p>
                  <p className="text-sm text-base-gray">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="vestira-card-minimal">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Briefcase className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-deep-brand">8</p>
                  <p className="text-sm text-base-gray">Active DDQs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="vestira-card-minimal">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-deep-brand">12</p>
                  <p className="text-sm text-base-gray">Unread Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="vestira-card-minimal">
            <CardHeader>
              <CardTitle className="text-deep-brand">Recent Activity</CardTitle>
              <CardDescription className="text-base-gray">Latest updates from your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 rounded-full bg-gray-100">
                      {activity.type === "document" && <FileText className="h-4 w-4 text-blue-600" />}
                      {activity.type === "meeting" && <Calendar className="h-4 w-4 text-green-600" />}
                      {activity.type === "alert" && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                      {activity.type === "message" && <MessageSquare className="h-4 w-4 text-purple-600" />}
                      {activity.type === "insight" && <BarChart3 className="h-4 w-4 text-indigo-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-deep-brand text-sm">{activity.title}</p>
                      <p className="text-xs text-base-gray">{activity.manager}</p>
                      <p className="text-xs text-base-gray">{activity.time}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        activity.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : activity.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "attention"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-purple-100 text-purple-800"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link href="/screens/allocator/activity-log">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View All Activity
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="vestira-card-minimal">
            <CardHeader>
              <CardTitle className="text-deep-brand">Upcoming Events</CardTitle>
              <CardDescription className="text-base-gray">Your registered events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg border border-gray-200 hover:border-electric-blue/30 transition-all duration-300">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-deep-brand">{event.title}</h4>
                            <p className="text-sm text-base-gray">{event.organizer}</p>
                            <p className="text-sm text-base-gray">{event.location}</p>
                            <p className="text-sm text-base-gray">{event.time}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-electric-blue">{event.date}</div>
                            <Badge
                              variant="outline"
                              className={
                                event.type === "conference"
                                  ? "bg-blue-100 text-blue-800"
                                  : event.type === "webinar"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }
                            >
                              {event.type}
                            </Badge>
                          </div>
                        </div>
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
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 hover:border-electric-blue/30 transition-all duration-300 cursor-pointer hover:shadow-md"
                  onClick={() => handleInsightClick(insight)}
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

      {/* Insight Detail Modal */}
      <Dialog open={showInsightModal} onOpenChange={setShowInsightModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold text-deep-brand pr-4">
                  {selectedInsight?.title}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-base-gray">
                  <span>{selectedInsight?.manager}</span>
                  <span>•</span>
                  <span>{selectedInsight?.publishedAt}</span>
                  <span>•</span>
                  <span>{selectedInsight?.readTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowInsightModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            {selectedInsight && (
              <>
                <div className="flex items-center gap-2">
                  <Badge className="bg-electric-blue/10 text-electric-blue">{selectedInsight.category}</Badge>
                  {selectedInsight.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-deep-brand mb-2">Summary</h3>
                    <p className="text-base-gray">{selectedInsight.summary}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-deep-brand">Full Content</h3>
                    <div className="prose prose-sm max-w-none">
                      {selectedInsight.content.split('\n\n').map((paragraph: string, index: number) => (
                        <p key={index} className="text-base-gray leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center">
                        <span className="text-electric-blue font-medium">
                          {selectedInsight.author.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-deep-brand">{selectedInsight.author}</p>
                        <p className="text-sm text-base-gray">{selectedInsight.authorTitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
