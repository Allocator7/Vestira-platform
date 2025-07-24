"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react"
import { Screen } from "@/components/Screen"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RoleIndicator } from "@/components/RoleIndicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for allocator requests for a specific DDQ type
const allocatorRequests = [
  {
    id: "req-001",
    allocatorId: "alloc-001",
    allocatorName: "State Pension Fund",
    allocatorLogo: "SP",
    allocatorType: "Public Pension",
    aum: "$5.2B",
    requestDate: "2023-10-15",
    dueDate: "2023-12-15",
    status: "pending",
    priority: "high",
    lastActivity: "2023-11-05",
    relationshipStatus: "existing",
    requirements: {
      sections: 12,
      questions: 150,
      customizations: ["ESG Focus", "Infrastructure Allocation"],
    },
  },
  {
    id: "req-002",
    allocatorId: "alloc-002",
    allocatorName: "University Endowment",
    allocatorLogo: "UE",
    allocatorType: "Endowment",
    aum: "$1.8B",
    requestDate: "2023-09-20",
    dueDate: "2023-11-20",
    status: "completed",
    priority: "medium",
    lastActivity: "2023-11-03",
    relationshipStatus: "existing",
    requirements: {
      sections: 10,
      questions: 120,
      customizations: ["Education Sector Focus"],
    },
  },
  {
    id: "req-003",
    allocatorId: "alloc-003",
    allocatorName: "Family Office Partners",
    allocatorLogo: "FO",
    allocatorType: "Family Office",
    aum: "$750M",
    requestDate: "2023-11-01",
    dueDate: "2024-01-15",
    status: "draft",
    priority: "medium",
    lastActivity: "2023-11-02",
    relationshipStatus: "prospective",
    requirements: {
      sections: 8,
      questions: 95,
      customizations: ["Impact Investing", "Multi-generational"],
    },
  },
]

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending Response" },
    completed: { color: "bg-green-100 text-green-800", label: "Completed" },
    draft: { color: "bg-blue-100 text-blue-800", label: "Draft" },
    overdue: { color: "bg-red-100 text-red-800", label: "Overdue" },
  }

  const config = statusConfig[status] || statusConfig.pending

  return <Badge className={config.color}>{config.label}</Badge>
}

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    high: { color: "bg-red-50 text-red-700 border-red-200", label: "High Priority" },
    medium: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Medium Priority" },
    low: { color: "bg-green-50 text-green-700 border-green-200", label: "Low Priority" },
  }

  const config = priorityConfig[priority] || priorityConfig.medium

  return (
    <Badge variant="outline" className={config.color}>
      {config.label}
    </Badge>
  )
}

export default function ManagerDueDiligenceComparison() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ddqType = searchParams.get("type") || "Private Credit SMA DDQ"
  const [selectedTab, setSelectedTab] = useState("overview")

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`
    } else if (diffDays === 0) {
      return "Due today"
    } else {
      return `${diffDays} days remaining`
    }
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
                <h1 className="text-3xl font-bold text-deepBrand">{ddqType} - Allocator Requests</h1>
                <p className="text-baseGray">Manage responses to allocator due diligence requests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RoleIndicator role="manager" showLabel={true} />
              <Button className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Bulk Response
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-baseGray">Total Requests</p>
                    <p className="text-2xl font-bold text-deepBrand">{allocatorRequests.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-baseGray">Pending</p>
                    <p className="text-2xl font-bold text-deepBrand">
                      {allocatorRequests.filter((r) => r.status === "pending").length}
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
                    <p className="text-sm text-baseGray">Completed</p>
                    <p className="text-2xl font-bold text-deepBrand">
                      {allocatorRequests.filter((r) => r.status === "completed").length}
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
                    <p className="text-sm text-baseGray">High Priority</p>
                    <p className="text-2xl font-bold text-deepBrand">
                      {allocatorRequests.filter((r) => r.priority === "high").length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests Overview */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requirements">Requirements Comparison</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Allocator Request Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {allocatorRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-deepBrand text-white font-semibold">
                              {request.allocatorLogo}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-deepBrand">{request.allocatorName}</CardTitle>
                            <p className="text-sm text-baseGray">{request.allocatorType}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={request.status} />
                          <PriorityBadge priority={request.priority} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-baseGray">AUM</p>
                          <p className="font-medium">{request.aum}</p>
                        </div>
                        <div>
                          <p className="text-baseGray">Relationship</p>
                          <p className="font-medium capitalize">{request.relationshipStatus}</p>
                        </div>
                        <div>
                          <p className="text-baseGray">Due Date</p>
                          <p className="font-medium">{formatDate(request.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-baseGray">Time Remaining</p>
                          <p className={`font-medium text-sm ${request.status === "overdue" ? "text-red-600" : ""}`}>
                            {getDaysRemaining(request.dueDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-baseGray mb-1">Requirements</p>
                        <p className="font-medium">
                          {request.requirements.sections} sections, {request.requirements.questions} questions
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {request.requirements.customizations.map((custom) => (
                            <Badge key={custom} variant="secondary" className="text-xs">
                              {custom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          {request.status === "completed" ? "View Response" : "Start Response"}
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

            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-baseGray border-b">
                          <th className="pb-2 font-medium">Allocator</th>
                          <th className="pb-2 font-medium">Sections</th>
                          <th className="pb-2 font-medium">Questions</th>
                          <th className="pb-2 font-medium">Customizations</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocatorRequests.map((request) => (
                          <tr key={request.id} className="border-b hover:bg-gray-50">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-deepBrand text-white text-sm">
                                    {request.allocatorLogo}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-deepBrand">{request.allocatorName}</p>
                                  <p className="text-xs text-baseGray">{request.allocatorType}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">{request.requirements.sections}</td>
                            <td className="py-3">{request.requirements.questions}</td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {request.requirements.customizations.map((custom) => (
                                  <Badge key={custom} variant="secondary" className="text-xs">
                                    {custom}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-3">
                              <StatusBadge status={request.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-baseGray">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Timeline view coming soon</p>
                    <p className="text-sm">Track due dates and response progress over time</p>
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
