"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Share,
  Eye,
  FileText,
  ImageIcon,
  Video,
  Archive,
  Shield,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react"

export default function DataRoomManagementPage() {
  const [selectedDataRoom, setSelectedDataRoom] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [newDataRoom, setNewDataRoom] = useState({
    name: "",
    description: "",
    type: "",
    accessLevel: "restricted",
    expiryDate: "",
  })

  const dataRooms = [
    {
      id: "dr-001",
      name: "Meridian Growth Fund IV",
      description: "Due diligence materials for our latest growth equity fund",
      type: "Fund Marketing",
      status: "active",
      participants: 12,
      documents: 45,
      lastActivity: "2 hours ago",
      createdDate: "2024-01-15",
      expiryDate: "2024-06-15",
      accessLevel: "restricted",
      owner: "Sarah Johnson",
      totalSize: "2.3 GB",
      downloadCount: 156,
      viewCount: 892,
      securityLevel: "high",
    },
    {
      id: "dr-002",
      name: "Alpha Ventures ESG Strategy",
      description: "ESG-focused investment strategy documentation",
      type: "Strategy Presentation",
      status: "active",
      participants: 8,
      documents: 23,
      lastActivity: "1 day ago",
      createdDate: "2024-01-10",
      expiryDate: "2024-04-10",
      accessLevel: "confidential",
      owner: "Michael Chen",
      totalSize: "1.8 GB",
      downloadCount: 89,
      viewCount: 445,
      securityLevel: "high",
    },
    {
      id: "dr-003",
      name: "Beta Asset Management DDQ",
      description: "Due diligence questionnaire responses and supporting documents",
      type: "Due Diligence",
      status: "pending",
      participants: 5,
      documents: 67,
      lastActivity: "3 days ago",
      createdDate: "2024-01-05",
      expiryDate: "2024-03-05",
      accessLevel: "restricted",
      owner: "Emily Rodriguez",
      totalSize: "3.1 GB",
      downloadCount: 234,
      viewCount: 1203,
      securityLevel: "maximum",
    },
    {
      id: "dr-004",
      name: "Infrastructure Fund Quarterly",
      description: "Q4 2023 performance and portfolio updates",
      type: "Performance Report",
      status: "archived",
      participants: 15,
      documents: 34,
      lastActivity: "2 weeks ago",
      createdDate: "2023-12-01",
      expiryDate: "2024-02-01",
      accessLevel: "internal",
      owner: "David Kim",
      totalSize: "1.2 GB",
      downloadCount: 78,
      viewCount: 312,
      securityLevel: "medium",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "uploaded",
      target: "Fund Performance Report Q4.pdf",
      dataRoom: "Meridian Growth Fund IV",
      timestamp: "2 hours ago",
      type: "upload",
    },
    {
      id: 2,
      user: "Michael Chen",
      action: "downloaded",
      target: "ESG Policy Document.docx",
      dataRoom: "Alpha Ventures ESG Strategy",
      timestamp: "4 hours ago",
      type: "download",
    },
    {
      id: 3,
      user: "Emily Rodriguez",
      action: "invited",
      target: "james.wilson@pension.gov",
      dataRoom: "Beta Asset Management DDQ",
      timestamp: "1 day ago",
      type: "invite",
    },
    {
      id: 4,
      user: "David Kim",
      action: "archived",
      target: "Infrastructure Fund Quarterly",
      dataRoom: "Infrastructure Fund Quarterly",
      timestamp: "2 weeks ago",
      type: "archive",
    },
  ]

  const securityMetrics = {
    totalDataRooms: dataRooms.length,
    activeDataRooms: dataRooms.filter((dr) => dr.status === "active").length,
    totalParticipants: dataRooms.reduce((sum, dr) => sum + dr.participants, 0),
    totalDocuments: dataRooms.reduce((sum, dr) => sum + dr.documents, 0),
    totalDownloads: dataRooms.reduce((sum, dr) => sum + dr.downloadCount, 0),
    securityIncidents: 0,
    complianceScore: 98,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "maximum":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-600" />
      case "video":
        return <Video className="h-4 w-4 text-purple-600" />
      case "archive":
        return <Archive className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredDataRooms = dataRooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus === "all" || room.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleCreateDataRoom = () => {
    // Simulate creating data room
    console.log("Creating data room:", newDataRoom)
    setShowCreateModal(false)
    setNewDataRoom({
      name: "",
      description: "",
      type: "",
      accessLevel: "restricted",
      expiryDate: "",
    })
  }

  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-deep-brand">Data Room Management</h1>
            <p className="text-base-gray mt-1">Secure document sharing and collaboration platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowInviteModal(true)}>
              <Users className="h-4 w-4 mr-2" />
              Invite Users
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-electric-blue hover:bg-electric-blue/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Data Room
            </Button>
          </div>
        </div>

        {/* Security & Compliance Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-gray">Active Data Rooms</p>
                  <p className="text-2xl font-semibold text-deep-brand">{securityMetrics.activeDataRooms}</p>
                </div>
                <div className="p-3 bg-electric-blue/10 rounded-full">
                  <FolderOpen className="h-5 w-5 text-electric-blue" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500">+2</span>
                <span className="text-base-gray ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-gray">Total Participants</p>
                  <p className="text-2xl font-semibold text-deep-brand">{securityMetrics.totalParticipants}</p>
                </div>
                <div className="p-3 bg-electric-blue/10 rounded-full">
                  <Users className="h-5 w-5 text-electric-blue" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500">+8</span>
                <span className="text-base-gray ml-1">new this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-gray">Security Score</p>
                  <p className="text-2xl font-semibold text-deep-brand">{securityMetrics.complianceScore}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-base-gray">SOC2 Compliant</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-gray">Security Incidents</p>
                  <p className="text-2xl font-semibold text-deep-brand">{securityMetrics.securityIncidents}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500">0</span>
                <span className="text-base-gray ml-1">this quarter</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="data-rooms" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 shadow-vestira">
            <TabsTrigger
              value="data-rooms"
              className="text-deep-brand data-[state=active]:bg-electric-blue data-[state=active]:text-white"
            >
              Data Rooms
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="text-deep-brand data-[state=active]:bg-electric-blue data-[state=active]:text-white"
            >
              Activity Log
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-deep-brand data-[state=active]:bg-electric-blue data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-deep-brand data-[state=active]:bg-electric-blue data-[state=active]:text-white"
            >
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data-rooms" className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-gray h-4 w-4" />
                  <Input
                    placeholder="Search data rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Data Rooms Grid */}
            <div className="grid gap-6">
              {filteredDataRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-electric-blue/10 rounded-lg">
                          <FolderOpen className="h-6 w-6 text-electric-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-deep-brand">{room.name}</h3>
                          <p className="text-sm text-base-gray mt-1">{room.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-base-gray">
                            <span>Created: {room.createdDate}</span>
                            <span>•</span>
                            <span>Expires: {room.expiryDate}</span>
                            <span>•</span>
                            <span>Owner: {room.owner}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                        <Badge className={getSecurityLevelColor(room.securityLevel)}>
                          <Shield className="h-3 w-3 mr-1" />
                          {room.securityLevel}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-deep-brand">{room.participants}</div>
                        <div className="text-xs text-base-gray">Participants</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-deep-brand">{room.documents}</div>
                        <div className="text-xs text-base-gray">Documents</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-deep-brand">{room.downloadCount}</div>
                        <div className="text-xs text-base-gray">Downloads</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-deep-brand">{room.totalSize}</div>
                        <div className="text-xs text-base-gray">Total Size</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-base-gray">
                        <Clock className="h-4 w-4" />
                        <span>Last activity: {room.lastActivity}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Real-time activity across all data rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-base-gray">{activity.action}</span>{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-base-gray">
                          in {activity.dataRoom} • {activity.timestamp}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>Data room engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-base-gray">Total Views</span>
                      <span className="font-semibold">2,852</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-base-gray">Total Downloads</span>
                      <span className="font-semibold">557</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-base-gray">Average Session Duration</span>
                      <span className="font-semibold">12m 34s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-base-gray">Most Active Data Room</span>
                      <span className="font-semibold">Meridian Growth Fund IV</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                  <CardDescription>Security and compliance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-base-gray">Failed Login Attempts</span>
                      <span className="font-semibold text-green-600">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-base-gray">Unauthorized Access Attempts</span>
                      <span className="font-semibold text-green-600">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-base-gray">Data Encryption Status</span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-base-gray">Compliance Score</span>
                      <span className="font-semibold text-green-600">98%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security policies and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                      <p className="text-xs text-base-gray">Require 2FA for all data room access</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Document Watermarking</Label>
                      <p className="text-xs text-base-gray">Add user watermarks to all documents</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Download Restrictions</Label>
                      <p className="text-xs text-base-gray">Prevent document downloads</p>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Session Timeout</Label>
                      <p className="text-xs text-base-gray">Auto-logout after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15m</SelectItem>
                        <SelectItem value="30">30m</SelectItem>
                        <SelectItem value="60">1h</SelectItem>
                        <SelectItem value="120">2h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Log</CardTitle>
                  <CardDescription>Recent security events and access logs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        event: "User login",
                        user: "sarah.johnson@meridian.com",
                        time: "2 hours ago",
                        status: "success",
                      },
                      {
                        event: "Document download",
                        user: "michael.chen@alpha.com",
                        time: "4 hours ago",
                        status: "success",
                      },
                      {
                        event: "Failed login attempt",
                        user: "unknown@domain.com",
                        time: "1 day ago",
                        status: "blocked",
                      },
                      {
                        event: "Data room created",
                        user: "emily.rodriguez@beta.com",
                        time: "2 days ago",
                        status: "success",
                      },
                    ].map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                        <div>
                          <p className="text-sm font-medium">{log.event}</p>
                          <p className="text-xs text-base-gray">{log.user}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              log.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {log.status}
                          </Badge>
                          <p className="text-xs text-base-gray mt-1">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Data Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Create New Data Room</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Data Room Name</Label>
                  <Input
                    id="name"
                    value={newDataRoom.name}
                    onChange={(e) => setNewDataRoom({ ...newDataRoom, name: e.target.value })}
                    placeholder="Enter data room name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDataRoom.description}
                    onChange={(e) => setNewDataRoom({ ...newDataRoom, description: e.target.value })}
                    placeholder="Brief description of the data room purpose"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newDataRoom.type}
                    onValueChange={(value) => setNewDataRoom({ ...newDataRoom, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fund-marketing">Fund Marketing</SelectItem>
                      <SelectItem value="due-diligence">Due Diligence</SelectItem>
                      <SelectItem value="performance-report">Performance Report</SelectItem>
                      <SelectItem value="strategy-presentation">Strategy Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select
                    value={newDataRoom.accessLevel}
                    onValueChange={(value) => setNewDataRoom({ ...newDataRoom, accessLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newDataRoom.expiryDate}
                    onChange={(e) => setNewDataRoom({ ...newDataRoom, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDataRoom}>Create Data Room</Button>
              </div>
            </div>
          </div>
        )}

        {/* Invite Users Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Invite Users to Data Room</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="dataRoom">Select Data Room</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose data room" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataRooms
                        .filter((dr) => dr.status === "active")
                        .map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="emails">Email Addresses</Label>
                  <Textarea id="emails" placeholder="Enter email addresses (one per line)" className="h-24" />
                </div>

                <div>
                  <Label htmlFor="permissions">Permission Level</Label>
                  <Select defaultValue="view">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="download">View & Download</SelectItem>
                      <SelectItem value="upload">View, Download & Upload</SelectItem>
                      <SelectItem value="admin">Full Admin Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Invitation Message (Optional)</Label>
                  <Textarea id="message" placeholder="Add a personal message to the invitation" className="h-20" />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowInviteModal(false)}>Send Invitations</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Screen>
  )
}
