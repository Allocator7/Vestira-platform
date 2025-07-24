"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, MessageSquare, Eye, Building2, TrendingUp, CheckCircle2, Clock } from "lucide-react"
import { Screen } from "../../../../components/Screen"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar"
import { RoleIndicator } from "../../../../components/RoleIndicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

// Mock data for manager responses to a specific DDQ
const managerResponses = [
  {
    id: "resp-001",
    managerId: "mgr-001",
    managerName: "Blackrock Global Equity",
    managerLogo: "BG",
    strategy: "Global Equity",
    aum: "$2.3T",
    submissionDate: "2023-11-05",
    status: "completed",
    completionRate: 100,
    lastUpdated: "2023-11-05",
    keyMetrics: {
      experience: "25+ years",
      teamSize: "150+ professionals",
      irr: "12.4% (10yr)",
      volatility: "Low-Medium",
    },
    responses: {
      "Investment Philosophy": "Long-term value creation through fundamental analysis...",
      "Risk Management": "Comprehensive risk framework with daily monitoring...",
      "ESG Integration": "Fully integrated ESG considerations across all investments...",
      "Performance Track Record": "Consistent outperformance over 10+ year periods...",
    },
  },
  {
    id: "resp-002",
    managerId: "mgr-002",
    managerName: "Vanguard Fixed Income",
    managerLogo: "VF",
    strategy: "Fixed Income",
    aum: "$1.8T",
    submissionDate: "2023-11-03",
    status: "completed",
    completionRate: 95,
    lastUpdated: "2023-11-04",
    keyMetrics: {
      experience: "30+ years",
      teamSize: "200+ professionals",
      irr: "8.2% (10yr)",
      volatility: "Low",
    },
    responses: {
      "Investment Philosophy": "Conservative approach focused on capital preservation...",
      "Risk Management": "Multi-layered risk controls with stress testing...",
      "ESG Integration": "ESG factors considered in credit analysis...",
      "Performance Track Record": "Stable returns with low volatility...",
    },
  },
  {
    id: "resp-003",
    managerId: "mgr-003",
    managerName: "Wellington Management",
    managerLogo: "WM",
    strategy: "Multi-Strategy",
    aum: "$1.2T",
    submissionDate: "2023-11-02",
    status: "in-progress",
    completionRate: 78,
    lastUpdated: "2023-11-06",
    keyMetrics: {
      experience: "20+ years",
      teamSize: "120+ professionals",
      irr: "14.1% (10yr)",
      volatility: "Medium",
    },
    responses: {
      "Investment Philosophy": "Active management with research-driven approach...",
      "Risk Management": "Dynamic risk management with scenario analysis...",
      "ESG Integration": "Proprietary ESG scoring methodology...",
      "Performance Track Record": "Strong alpha generation across cycles...",
    },
  },
]

const StatusBadge = ({ status, completionRate }) => {
  if (status === "completed") {
    return <Badge className="bg-green-100 text-green-800">Completed ({completionRate}%)</Badge>
  } else if (status === "in-progress") {
    return <Badge className="bg-yellow-100 text-yellow-800">In Progress ({completionRate}%)</Badge>
  } else {
    return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
  }
}

export default function DueDiligenceComparison() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ddqType = searchParams.get("type") || "Private Credit SMA DDQ"
  const [selectedSection, setSelectedSection] = useState("Investment Philosophy")
  const [showFilters, setShowFilters] = useState(false)

  const sections = ["Investment Philosophy", "Risk Management", "ESG Integration", "Performance Track Record"]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Screen>
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-deepBrand">{ddqType} - Manager Comparison</h1>
                <p className="text-baseGray">Compare manager responses side by side</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RoleIndicator role="allocator" showLabel={true} />
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Comparison
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-baseGray">Total Responses</p>
                    <p className="text-2xl font-bold text-deepBrand">{managerResponses.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-baseGray">Completed</p>
                    <p className="text-2xl font-bold text-deepBrand">
                      {managerResponses.filter((r) => r.status === "completed").length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-baseGray">In Progress</p>
                    <p className="text-2xl font-bold text-deepBrand">
                      {managerResponses.filter((r) => r.status === "in-progress").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-baseGray">Avg Completion</p>
                    <p className="text-2xl font-bold text-deepBrand">
                      {Math.round(
                        managerResponses.reduce((sum, r) => sum + r.completionRate, 0) / managerResponses.length,
                      )}
                      %
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison View */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Comparison</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Manager Cards Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {managerResponses.map((response) => (
                  <Card key={response.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-deepBrand text-white font-semibold">
                              {response.managerLogo}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-deepBrand">{response.managerName}</CardTitle>
                            <p className="text-sm text-baseGray">{response.strategy}</p>
                          </div>
                        </div>
                        <StatusBadge status={response.status} completionRate={response.completionRate} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-baseGray">AUM</p>
                          <p className="font-medium">{response.aum}</p>
                        </div>
                        <div>
                          <p className="text-baseGray">Experience</p>
                          <p className="font-medium">{response.keyMetrics.experience}</p>
                        </div>
                        <div>
                          <p className="text-baseGray">Team Size</p>
                          <p className="font-medium">{response.keyMetrics.teamSize}</p>
                        </div>
                        <div>
                          <p className="text-baseGray">10yr IRR</p>
                          <p className="font-medium">{response.keyMetrics.irr}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-baseGray">Last Updated</p>
                        <p className="font-medium">{formatDate(response.lastUpdated)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View Full Response
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              {/* Section Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {sections.map((section) => (
                  <Button
                    key={section}
                    variant={selectedSection === section ? "default" : "outline"}
                    onClick={() => setSelectedSection(section)}
                    className={selectedSection === section ? "bg-deepBrand text-white" : ""}
                  >
                    {section}
                  </Button>
                ))}
              </div>

              {/* Side-by-side Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {managerResponses.map((response) => (
                  <Card key={response.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-deepBrand text-white text-sm">
                            {response.managerLogo}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base text-deepBrand">{response.managerName}</CardTitle>
                          <p className="text-xs text-baseGray">{selectedSection}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-baseGray leading-relaxed">
                        {response.responses[selectedSection] || "Response not provided"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-baseGray">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics dashboard coming soon</p>
                    <p className="text-sm">Compare performance metrics, risk profiles, and more</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Screen>
  )
}
