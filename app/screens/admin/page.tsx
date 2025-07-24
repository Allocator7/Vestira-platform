"use client"

import { useState } from "react"
import { Screen } from "../../../components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Users,
  UserCheck,
  Mail,
  Globe,
  Calendar,
  DollarSign,
} from "lucide-react"

interface PendingApplication {
  id: string
  firmName: string
  firmType: "manager" | "allocator" | "consultant"
  firmSubType: string
  applicantName: string
  applicantEmail: string
  applicantTitle: string
  aum?: string
  location: string
  founded?: string
  website?: string
  description?: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
}

const mockApplications: PendingApplication[] = [
  {
    id: "app-001",
    firmName: "Meridian Capital Partners",
    firmType: "manager",
    firmSubType: "Private Equity",
    applicantName: "Sarah Johnson",
    applicantEmail: "sarah.johnson@meridiancap.com",
    applicantTitle: "Managing Director",
    aum: "$2.5B",
    location: "New York, NY",
    founded: "2010",
    website: "https://meridiancap.com",
    description: "Mid-market private equity firm focused on technology and healthcare investments",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending",
  },
  {
    id: "app-002",
    firmName: "State Teachers Retirement System",
    firmType: "allocator",
    firmSubType: "Public Pension",
    applicantName: "Michael Chen",
    applicantEmail: "m.chen@strs.gov",
    applicantTitle: "Investment Director",
    aum: "$45B",
    location: "Sacramento, CA",
    founded: "1972",
    website: "https://strs.ca.gov",
    description: "Public pension fund serving California's educators",
    submittedAt: "2024-01-14T14:20:00Z",
    status: "pending",
  },
  {
    id: "app-003",
    firmName: "Institutional Advisory Group",
    firmType: "consultant",
    firmSubType: "Consultant",
    applicantName: "David Rodriguez",
    applicantEmail: "d.rodriguez@iag-consulting.com",
    applicantTitle: "Senior Consultant",
    location: "Chicago, IL",
    founded: "2005",
    website: "https://iag-consulting.com",
    description: "Investment consulting firm serving institutional investors",
    submittedAt: "2024-01-13T09:15:00Z",
    status: "pending",
  },
]

export default function AdminPage() {
  const [applications, setApplications] = useState(mockApplications)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedApplication, setSelectedApplication] = useState<PendingApplication | null>(null)

  const handleApprove = (id: string) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: "approved" as const } : app)))
    setSelectedApplication(null)
  }

  const handleReject = (id: string) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: "rejected" as const } : app)))
    setSelectedApplication(null)
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus === "all" || app.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const getFirmTypeIcon = (type: string) => {
    switch (type) {
      case "manager":
        return <Building className="h-4 w-4" />
      case "allocator":
        return <Users className="h-4 w-4" />
      case "consultant":
        return <UserCheck className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-deep-brand">Admin Dashboard</h1>
            <p className="text-base-gray mt-1">Manage firm applications and user access</p>
          </div>
          <Badge className="bg-deep-brand/10 text-deep-brand">Admin Access</Badge>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6 bg-gray-100">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="firms">Firms</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Applications List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-deep-brand">Pending Applications</CardTitle>
                        <CardDescription>
                          {filteredApplications.filter((app) => app.status === "pending").length} applications awaiting
                          review
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                          <Input
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-64"
                          />
                        </div>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as any)}
                          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredApplications.map((app) => (
                        <div
                          key={app.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedApplication?.id === app.id
                              ? "border-electric-blue bg-electric-blue/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedApplication(app)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-canvas-neutral rounded-lg">{getFirmTypeIcon(app.firmType)}</div>
                              <div>
                                <h3 className="font-semibold text-deep-brand">{app.firmName}</h3>
                                <p className="text-sm text-base-gray">{app.firmSubType}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-base-gray">{app.applicantName}</span>
                                  <span className="text-xs text-base-gray">•</span>
                                  <span className="text-sm text-base-gray">{app.location}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(app.status)}
                              <span className="text-xs text-base-gray">
                                {new Date(app.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Application Details */}
              <div className="lg:col-span-1">
                {selectedApplication ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-deep-brand">Application Details</CardTitle>
                      <CardDescription>Review and approve or reject</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Firm Information */}
                      <div>
                        <h4 className="font-semibold text-deep-brand mb-3">Firm Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {getFirmTypeIcon(selectedApplication.firmType)}
                            <span className="text-sm font-medium">{selectedApplication.firmName}</span>
                          </div>
                          <div className="text-sm text-base-gray">
                            <strong>Type:</strong> {selectedApplication.firmSubType}
                          </div>
                          {selectedApplication.aum && (
                            <div className="flex items-center gap-2 text-sm text-base-gray">
                              <DollarSign className="h-3 w-3" />
                              <span>
                                <strong>AUM:</strong> {selectedApplication.aum}
                              </span>
                            </div>
                          )}
                          <div className="text-sm text-base-gray">
                            <strong>Location:</strong> {selectedApplication.location}
                          </div>
                          {selectedApplication.founded && (
                            <div className="flex items-center gap-2 text-sm text-base-gray">
                              <Calendar className="h-3 w-3" />
                              <span>
                                <strong>Founded:</strong> {selectedApplication.founded}
                              </span>
                            </div>
                          )}
                          {selectedApplication.website && (
                            <div className="flex items-center gap-2 text-sm text-base-gray">
                              <Globe className="h-3 w-3" />
                              <a
                                href={selectedApplication.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-electric-blue hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                          {selectedApplication.description && (
                            <div className="text-sm text-base-gray">
                              <strong>Description:</strong>
                              <p className="mt-1">{selectedApplication.description}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Applicant Information */}
                      <div>
                        <h4 className="font-semibold text-deep-brand mb-3">Applicant Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {selectedApplication.applicantName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-deep-brand">{selectedApplication.applicantName}</p>
                              <p className="text-sm text-base-gray">{selectedApplication.applicantTitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-base-gray">
                            <Mail className="h-3 w-3" />
                            <a
                              href={`mailto:${selectedApplication.applicantEmail}`}
                              className="text-electric-blue hover:underline"
                            >
                              {selectedApplication.applicantEmail}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {selectedApplication.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(selectedApplication.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(selectedApplication.id)}
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {selectedApplication.status !== "pending" && (
                        <div className="text-center py-4">{getStatusBadge(selectedApplication.status)}</div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64 text-center">
                      <div>
                        <Filter className="h-8 w-8 text-base-gray mx-auto mb-2" />
                        <p className="text-base-gray">Select an application to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="firms">
            <Card>
              <CardHeader>
                <CardTitle className="text-deep-brand">Approved Firms</CardTitle>
                <CardDescription>Manage verified firms on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base-gray">Firm management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-deep-brand">User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base-gray">User management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  )
}
