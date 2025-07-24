"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { SendInvitationModal } from "@/components/industry-group/SendInvitationModal"
import { IssueCertificateModal } from "@/components/industry-group/IssueCertificateModal"
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  Users,
  CheckCircle,
  Award,
  MessageSquare,
  MoreHorizontal,
  FileText,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockAttendees = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@pension.gov",
    organization: "State Teachers Pension Fund",
    title: "Chief Investment Officer",
    registrationDate: "2024-01-15",
    status: "confirmed",
    eventsAttended: 12,
    lastEventDate: "2024-01-10",
    phone: "+1 (555) 123-4567",
    certificatesEarned: 8,
    memberType: "premium",
    location: "Sacramento, CA",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@globalcap.com",
    organization: "Global Capital Management",
    title: "Portfolio Manager",
    registrationDate: "2024-01-12",
    status: "registered",
    eventsAttended: 8,
    lastEventDate: "2023-12-15",
    phone: "+1 (555) 234-5678",
    certificatesEarned: 5,
    memberType: "standard",
    location: "New York, NY",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@consultgroup.com",
    organization: "Strategic Investment Consultants",
    title: "Senior Consultant",
    registrationDate: "2024-01-18",
    status: "attended",
    eventsAttended: 15,
    lastEventDate: "2024-01-20",
    phone: "+1 (555) 345-6789",
    certificatesEarned: 12,
    memberType: "premium",
    location: "Chicago, IL",
  },
]

const mockEvents = [
  { id: "1", title: "ESG Investment Summit 2024", date: "2024-02-15" },
  { id: "2", title: "Private Markets Outlook", date: "2024-02-22" },
  { id: "3", title: "Regulatory Updates Webinar", date: "2024-03-01" },
]

export default function AttendeeManagementPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [memberTypeFilter, setMemberTypeFilter] = useState("all")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [showInvitationModal, setShowInvitationModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [attendees, setAttendees] = useState(mockAttendees)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Registered</Badge>
      case "attended":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Attended</Badge>
      case "no-show":
        return <Badge className="bg-red-100 text-red-800 border-red-200">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getMemberTypeBadge = (type: string) => {
    switch (type) {
      case "premium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Premium</Badge>
      case "standard":
        return <Badge variant="outline">Standard</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || attendee.status === statusFilter
    const matchesMemberType = memberTypeFilter === "all" || attendee.memberType === memberTypeFilter
    return matchesSearch && matchesStatus && matchesMemberType
  })

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your attendee data is being prepared for download.",
    })
    // Simulate export
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Attendee data has been exported successfully.",
      })
    }, 2000)
  }

  const handleBulkAction = (action: string) => {
    if (selectedAttendees.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select attendees to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    switch (action) {
      case "email":
        toast({
          title: "Bulk Email Sent",
          description: `Email sent to ${selectedAttendees.length} attendees.`,
        })
        break
      case "certificate":
        setShowCertificateModal(true)
        break
      case "export":
        toast({
          title: "Export Started",
          description: `Exporting data for ${selectedAttendees.length} selected attendees.`,
        })
        break
    }
  }

  const handleAttendeeAction = (attendeeId: string, action: string) => {
    const attendee = attendees.find((a) => a.id === attendeeId)

    switch (action) {
      case "email":
        toast({
          title: "Email Sent",
          description: `Email sent to ${attendee?.name}.`,
        })
        break
      case "call":
        toast({
          title: "Call Initiated",
          description: `Calling ${attendee?.name} at ${attendee?.phone}.`,
        })
        break
      case "message":
        toast({
          title: "Message Sent",
          description: `Message sent to ${attendee?.name}.`,
        })
        break
      case "edit":
        toast({
          title: "Edit Mode",
          description: `Opening edit form for ${attendee?.name}.`,
        })
        break
      case "delete":
        setAttendees(attendees.filter((a) => a.id !== attendeeId))
        toast({
          title: "Attendee Removed",
          description: `${attendee?.name} has been removed from the system.`,
        })
        break
    }
  }

  const stats = {
    total: attendees.length,
    active: attendees.filter((a) => a.status === "confirmed" || a.status === "attended").length,
    certificates: attendees.reduce((sum, a) => sum + a.certificatesEarned, 0),
    avgAttendance: Math.round((attendees.reduce((sum, a) => sum + a.eventsAttended, 0) / attendees.length) * 100) / 100,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendee Management</h1>
          <p className="text-gray-600 mt-1">Manage event attendees and track engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowInvitationModal(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Attendees</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificates Issued</p>
                <p className="text-2xl font-bold">{stats.certificates}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Events Attended</p>
                <p className="text-2xl font-bold">{stats.avgAttendance}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendees">All Attendees</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Analytics</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="attendees" className="space-y-4">
          {/* Search and Filter Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search attendees by name, organization, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="attended">Attended</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={memberTypeFilter} onValueChange={setMemberTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedAttendees.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{selectedAttendees.length} attendee(s) selected</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("email")}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("certificate")}>
                      <Award className="h-4 w-4 mr-2" />
                      Issue Certificate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attendees List */}
          <Card>
            <CardHeader>
              <CardTitle>Attendee Directory</CardTitle>
              <CardDescription>{filteredAttendees.length} attendees found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedAttendees.includes(attendee.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAttendees([...selectedAttendees, attendee.id])
                          } else {
                            setSelectedAttendees(selectedAttendees.filter((id) => id !== attendee.id))
                          }
                        }}
                      />
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {attendee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{attendee.name}</h3>
                          {getStatusBadge(attendee.status)}
                          {getMemberTypeBadge(attendee.memberType)}
                        </div>
                        <p className="text-sm text-gray-600">{attendee.title}</p>
                        <p className="text-sm text-gray-500">{attendee.organization}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{attendee.email}</span>
                          <span>{attendee.phone}</span>
                          <span>{attendee.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <p className="font-medium">{attendee.eventsAttended} events</p>
                        <p className="text-gray-500">{attendee.certificatesEarned} certificates</p>
                        <p className="text-xs text-gray-400">Last: {attendee.lastEventDate}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleAttendeeAction(attendee.id, "email")}>
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAttendeeAction(attendee.id, "call")}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAttendeeAction(attendee.id, "message")}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAttendeeAction(attendee.id, "edit")}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Certificates
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleAttendeeAction(attendee.id, "delete")}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analytics</CardTitle>
              <CardDescription>Track attendee participation and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Top Engaged Attendees</h4>
                  {attendees
                    .sort((a, b) => b.eventsAttended - a.eventsAttended)
                    .slice(0, 5)
                    .map((attendee, index) => (
                      <div key={attendee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{attendee.name}</p>
                            <p className="text-sm text-gray-600">{attendee.organization}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{attendee.eventsAttended}</p>
                          <p className="text-sm text-gray-600">events</p>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Engagement Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Engagement (10+ events)</span>
                      <span className="font-semibold text-green-600">
                        {attendees.filter((a) => a.eventsAttended >= 10).length} members
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium Engagement (5-9 events)</span>
                      <span className="font-semibold text-yellow-600">
                        {attendees.filter((a) => a.eventsAttended >= 5 && a.eventsAttended < 10).length} members
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low Engagement (1-4 events)</span>
                      <span className="font-semibold text-red-600">
                        {attendees.filter((a) => a.eventsAttended < 5).length} members
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Certificate Management</CardTitle>
                  <CardDescription>Manage and track professional certificates</CardDescription>
                </div>
                <Button onClick={() => setShowCertificateModal(true)}>
                  <Award className="h-4 w-4 mr-2" />
                  Issue Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{stats.certificates}</div>
                      <div className="text-sm text-gray-600">Total Certificates</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">24</div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-600">4</div>
                      <div className="text-sm text-gray-600">Certificate Types</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Recent Certificates Issued</h4>
                  {[
                    { name: "Sarah Johnson", course: "ESG Investment Fundamentals", date: "2024-01-20", type: "CPE" },
                    {
                      name: "Michael Chen",
                      course: "Risk Management Certification",
                      date: "2024-01-18",
                      type: "Completion",
                    },
                    {
                      name: "Emily Rodriguez",
                      course: "Alternative Investments",
                      date: "2024-01-15",
                      type: "Achievement",
                    },
                    { name: "David Wilson", course: "Regulatory Compliance", date: "2024-01-12", type: "Attendance" },
                  ].map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Award className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-gray-600">{cert.course}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {cert.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{cert.date}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SendInvitationModal open={showInvitationModal} onOpenChange={setShowInvitationModal} events={mockEvents} />

      <IssueCertificateModal open={showCertificateModal} onOpenChange={setShowCertificateModal} />
    </div>
  )
}
