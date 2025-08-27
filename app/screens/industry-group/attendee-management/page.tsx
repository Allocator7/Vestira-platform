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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SendInvitationModal } from "@/components/industry-group/SendInvitationModal"
import { SendMessageModal } from "@/components/profile-modals/SendMessageModal"
import { ComprehensiveFilters } from "@/components/ComprehensiveFilters"

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
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [memberTypeFilter, setMemberTypeFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [showInvitationModal, setShowInvitationModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedAttendeeForMessage, setSelectedAttendeeForMessage] = useState<any>(null)
  const [showViewProfileModal, setShowViewProfileModal] = useState(false)
  const [selectedAttendeeForView, setSelectedAttendeeForView] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    assetClasses: [],
    strategies: [],
    sectors: [],
    organizationTypes: [],
    experience: []
  })

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
    const matchesEvent = eventFilter === "all" || attendee.eventsAttended > 0 // For now, just check if they've attended any events
    return matchesSearch && matchesStatus && matchesMemberType && matchesEvent
  })

  const handleExportData = () => {
    const dataToExport = attendees.map((attendee) => ({
      name: attendee.name,
      email: attendee.email,
      organization: attendee.organization,
      title: attendee.title,
      phone: attendee.phone,
      location: attendee.location,
      status: attendee.status,
      memberType: attendee.memberType,
      eventsAttended: attendee.eventsAttended,
      lastEventDate: attendee.lastEventDate,
      registrationDate: attendee.registrationDate,
      certificatesEarned: attendee.certificatesEarned || 0,
    }))

    // Create CSV content
    const headers = Object.keys(dataToExport[0] || {})
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `attendee-data-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Attendee data exported successfully!",
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedAttendees.length === 0) {
      toast.error("Please select attendees to perform bulk actions.", "No Selection")
      return
    }

    switch (action) {
      case "email":
        toast.success(`Email sent to ${selectedAttendees.length} attendees.`, "Bulk Email Sent")
        break

      case "export":
        // Export only selected attendees
        const selectedAttendeeData = attendees.filter(a => selectedAttendees.includes(a.id))
        const csvHeaders = [
          "Name",
          "Email", 
          "Organization",
          "Title",
          "Phone",
          "Location",
          "Status",
          "Member Type",
          "Events Attended",
          "Last Event Date",
          "Registration Date"
        ]
        
        const csvData = selectedAttendeeData.map(attendee => [
          attendee.name,
          attendee.email,
          attendee.organization,
          attendee.title,
          attendee.phone,
          attendee.location,
          attendee.status,
          attendee.memberType,
          attendee.eventsAttended,
          attendee.lastEventDate,
          attendee.registrationDate
        ])
        
        const csvContent = [csvHeaders, ...csvData]
          .map(row => row.map(field => `"${field}"`).join(','))
          .join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `selected-attendees-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success(`Exported data for ${selectedAttendees.length} selected attendees.`, "Export Complete")
        break
    }
  }

  const handleAttendeeAction = (attendeeId: string, action: string) => {
    const attendee = attendees.find((a) => a.id === attendeeId)

    switch (action) {
      case "email":
        // Open default email client
        const emailSubject = encodeURIComponent("Industry Group Event Update")
        const emailBody = encodeURIComponent(`Dear ${attendee?.name},\n\nThank you for your participation in our events.\n\nBest regards,\nIndustry Group Team`)
        window.open(`mailto:${attendee?.email}?subject=${emailSubject}&body=${emailBody}`)
        toast.success(`Email client opened for ${attendee?.name}.`, "Email Initiated")
        break
        
      case "call":
        // Open phone dialer
        const phoneNumber = attendee?.phone?.replace(/\D/g, '') || ''
        if (phoneNumber) {
          window.open(`tel:${phoneNumber}`)
          toast.success(`Phone dialer opened for ${attendee?.name}.`, "Call Initiated")
        } else {
          toast.error("Phone number not available.", "Call Failed")
        }
        break
        
      case "message":
        // Open SendMessageModal
        setSelectedAttendeeForMessage(attendee)
        setShowMessageModal(true)
        break
        
      case "view":
        // Open View Profile modal
        try {
          setSelectedAttendeeForView(attendee)
          setShowViewProfileModal(true)
        } catch (error) {
          console.error("Error opening view profile:", error)
          toast.error("Failed to open attendee profile. Please try again.", "Error")
        }
        break
        
      case "delete":
        if (confirm(`Are you sure you want to remove ${attendee?.name} from the system?`)) {
          setAttendees(attendees.filter((a) => a.id !== attendeeId))
          toast.success(`${attendee?.name} has been removed from the system.`, "Attendee Removed")
        }
        break
    }
  }

  const stats = {
    total: attendees.length,
    totalYTD: attendees.filter((a) => {
      const registrationYear = new Date(a.registrationDate).getFullYear()
      return registrationYear === new Date().getFullYear()
    }).length,
    avgPerEvent: Math.round((attendees.reduce((sum, a) => sum + a.eventsAttended, 0) / attendees.length) * 100) / 100,
    avgEventsPerAttendee: Math.round((attendees.reduce((sum, a) => sum + a.eventsAttended, 0) / attendees.length) * 100) / 100,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendee Management</h1>
          <p className="text-gray-600 mt-1">Manage event attendees and track engagement</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button onClick={() => setShowInvitationModal(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-600">Total Attendees YTD</p>
                <p className="text-2xl font-bold">{stats.totalYTD}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendees Per Event</p>
                <p className="text-2xl font-bold">{stats.avgPerEvent}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Events Per Attendee</p>
                <p className="text-2xl font-bold">{stats.avgEventsPerAttendee}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendees">All Attendees</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Analytics</TabsTrigger>

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
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="attended">Has Attended Events</SelectItem>
                    <SelectItem value="not-attended">No Events Attended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Filters */}
          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <ComprehensiveFilters
                  onFiltersChange={setFilters}
                  initialFilters={filters}
                  showSectors={true}
                  showOrganizationTypes={true}
                  showExperience={true}
                  userType="manager"
                />
              </CardContent>
            </Card>
          )}

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
                            <DropdownMenuItem onClick={() => handleAttendeeAction(attendee.id, "view")}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleAttendeeAction(attendee.id, "delete")}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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


      </Tabs>

      {/* Modals */}
      <SendInvitationModal open={showInvitationModal} onOpenChange={setShowInvitationModal} events={mockEvents} />
      
      {selectedAttendeeForMessage && (
        <SendMessageModal
          isOpen={showMessageModal}
          onClose={() => {
            setShowMessageModal(false)
            setSelectedAttendeeForMessage(null)
          }}
          recipientName={selectedAttendeeForMessage.name}
          recipientTitle={selectedAttendeeForMessage.title}
          organizationName={selectedAttendeeForMessage.organization}
        />
      )}

      {/* View Profile Modal */}
      {selectedAttendeeForView && (
        <Dialog open={showViewProfileModal} onOpenChange={setShowViewProfileModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Attendee Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Header with avatar and basic info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {selectedAttendeeForView.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedAttendeeForView.name}</h3>
                  <p className="text-gray-600">{selectedAttendeeForView.title}</p>
                  <p className="text-sm text-gray-500">{selectedAttendeeForView.organization}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {selectedAttendeeForView.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedAttendeeForView.phone}</p>
                    <p><span className="font-medium">Location:</span> {selectedAttendeeForView.location}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Membership Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Status:</span> {getStatusBadge(selectedAttendeeForView.status)}</p>
                    <p><span className="font-medium">Member Type:</span> {getMemberTypeBadge(selectedAttendeeForView.memberType)}</p>
                    <p><span className="font-medium">Registration Date:</span> {selectedAttendeeForView.registrationDate}</p>
                  </div>
                </div>
              </div>

              {/* Engagement Statistics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Engagement Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedAttendeeForView.eventsAttended}</p>
                    <p className="text-sm text-gray-600">Events Attended</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedAttendeeForView.certificatesEarned || 0}</p>
                    <p className="text-sm text-gray-600">Certificates Earned</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{selectedAttendeeForView.lastEventDate}</p>
                    <p className="text-sm text-gray-600">Last Event</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}


    </div>
  )
}
