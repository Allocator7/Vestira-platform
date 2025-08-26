"use client"

import type React from "react"
import { useState } from "react"
import { Screen } from "../../../../components/Screen"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "../../../../components/ui/select"
import { Checkbox } from "../../../../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  Star,
  Upload,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  X,
  Calendar,
  Users,
  FileUp,
  Plus,
  LayoutTemplateIcon as Template,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AllocatorDueDiligenceHubPage() {
  console.log('AllocatorDueDiligenceHubPage: Component starting to render')
  
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStrategy, setSelectedStrategy] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [notification, setNotification] = useState("")
  
  // Safe defaults
  const userRole = "allocator"
  const currentPersonProfile = { name: "Current User" }
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  console.log('AllocatorDueDiligenceHubPage: Hooks initialized successfully')
  
  // Simple error boundary
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We encountered an unexpected error. Please try again or contact support if the problem persists.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  // Mock data for testing
  const activeDDQs = [
    {
      id: "ddq-1",
      templateName: "Vestira Infrastructure Fund DDQ",
      managerId: "mgr-1",
      managerName: "Global Infrastructure Partners",
      contactName: "Sarah Chen",
      contactTitle: "Managing Director",
      status: "under_review",
      completionPercentage: 100,
      submittedDate: "2024-01-20",
      dueDate: "2024-02-15",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.5B",
      vintage: "2024",
      reviewers: ["John Smith", "Maria Garcia"],
      lastActivity: "2024-01-25",
      progress: 85,
      lastUpdated: "2024-01-25T10:30:00Z",
      sections: []
    },
    {
      id: "ddq-2",
      templateName: "Vestira Private Equity DDQ",
      managerId: "mgr-2",
      managerName: "Growth Capital Partners",
      contactName: "David Rodriguez",
      contactTitle: "Managing Partner",
      status: "approved",
      completionPercentage: 100,
      submittedDate: "2024-01-15",
      dueDate: "2024-02-01",
      strategy: "Private Equity",
      investmentType: "fund",
      fundSize: "$1.8B",
      vintage: "2024",
      reviewers: ["John Smith"],
      lastActivity: "2024-01-28",
      progress: 100,
      lastUpdated: "2024-01-28T16:45:00Z",
      sections: []
    }
  ]

  // Filter active DDQs based on search, strategy, and status
  const filteredActiveDDQs = activeDDQs.filter((ddq) => {
    const matchesSearch = searchQuery === "" || 
      ddq.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ddq.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ddq.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStrategy = selectedStrategy === "All" || ddq.strategy === selectedStrategy
    const matchesStatus = selectedStatus === "All" || ddq.status === selectedStatus
    
    return matchesSearch && matchesStrategy && matchesStatus
  })

  const availableStrategies = [
    "Infrastructure",
    "Private Equity",
    "Real Estate",
    "Credit",
    "Hedge Funds",
    "Venture Capital",
    "Distressed Debt",
    "Growth Equity",
  ]

  console.log('AllocatorDueDiligenceHubPage: About to render JSX')

  return (
    <Screen>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Due Diligence Hub</h1>
          <p className="text-gray-600">Manage and review due diligence questionnaires</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{notification}</p>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active DDQs</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search DDQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Strategies</SelectItem>
                  {availableStrategies.map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="requires_clarification">Requires Clarification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* DDQ List */}
            <div className="space-y-4">
              {filteredActiveDDQs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active due diligence questionnaires found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating a new DDQ or inviting managers to complete questionnaires.</p>
                  <Button onClick={() => showNotification("Create DDQ functionality coming soon")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New DDQ
                  </Button>
                </div>
              ) : (
                filteredActiveDDQs.map((ddq) => (
                  <Card key={ddq.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                            <Badge 
                              variant={
                                ddq.status === "approved" ? "default" :
                                ddq.status === "under_review" ? "secondary" : "destructive"
                              }
                            >
                              {ddq.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{ddq.managerName}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                            <span>Contact: {ddq.contactName}</span>
                            <span>•</span>
                            <span>Strategy: {ddq.strategy}</span>
                            <span>•</span>
                            <span>Due: {ddq.dueDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Completed DDQs</h3>
              <p className="text-gray-500">View completed due diligence questionnaires here.</p>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="text-center py-12">
              <Template className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">DDQ Templates</h3>
              <p className="text-gray-500">Manage and create DDQ templates here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  )
}
