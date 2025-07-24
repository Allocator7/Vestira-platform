"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Video,
  Mail,
  MessageSquare,
  Download,
  Search,
  UserCheck,
  MoreHorizontal,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EventDetailsModalProps {
  event: any
  isOpen: boolean
  onClose: () => void
}

// Mock attendee data - updated to match the actual event registrations
const mockAttendees = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@pension.gov",
    organization: "State Teachers Pension Fund",
    title: "Chief Investment Officer",
    registrationDate: "2024-01-15",
    status: "confirmed",
    phone: "+1 (555) 123-4567",
    location: "Sacramento, CA",
    memberType: "premium",
    checkInTime: null,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@globalcap.com",
    organization: "Global Capital Management",
    title: "Portfolio Manager",
    registrationDate: "2024-01-12",
    status: "registered",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    memberType: "standard",
    checkInTime: null,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@consultgroup.com",
    organization: "Strategic Investment Consultants",
    title: "Senior Consultant",
    registrationDate: "2024-01-18",
    status: "attended",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    memberType: "premium",
    checkInTime: "2024-02-15 09:15 AM",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "d.wilson@insurancecorp.com",
    organization: "National Insurance Corp",
    title: "Investment Director",
    registrationDate: "2024-01-20",
    status: "confirmed",
    phone: "+1 (555) 456-7890",
    location: "Atlanta, GA",
    memberType: "standard",
    checkInTime: null,
  },
  {
    id: "5",
    name: "Lisa Park",
    email: "l.park@retirementfund.org",
    organization: "Municipal Retirement Fund",
    title: "Senior Analyst",
    registrationDate: "2024-01-22",
    status: "no-show",
    phone: "+1 (555) 567-8901",
    location: "Denver, CO",
    memberType: "premium",
    checkInTime: null,
  },
  {
    id: "6",
    name: "Robert Kim",
    email: "r.kim@advisorygroup.com",
    organization: "Premier Advisory Group",
    title: "Managing Director",
    registrationDate: "2024-01-25",
    status: "attended",
    phone: "+1 (555) 678-9012",
    location: "Los Angeles, CA",
    memberType: "premium",
    checkInTime: "2024-02-15 08:45 AM",
  },
]

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [memberTypeFilter, setMemberTypeFilter] = useState("all")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [attendees, setAttendees] = useState(mockAttendees)

  if (!event) return null

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
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || attendee.status === statusFilter
    const matchesMemberType = memberTypeFilter === "all" || attendee.memberType === memberTypeFilter
    return matchesSearch && matchesStatus && matchesMemberType
  })

  // Calculate stats based on actual attendee data
  const attendeeStats = {
    total: attendees.length,
    registered: attendees.filter((a) => a.status === "registered").length,
    confirmed: attendees.filter((a) => a.status === "confirmed").length,
    attended: attendees.filter((a) => a.status === "attended").length,
    noShow: attendees.filter((a) => a.status === "no-show").length,
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
      case "checkin":
        setAttendees(
          attendees.map((a) =>
            selectedAttendees.includes(a.id)
              ? { ...a, status: "attended", checkInTime: new Date().toLocaleString() }
              : a,
          ),
        )
        toast({
          title: "Bulk Check-in Complete",
          description: `${selectedAttendees.length} attendees checked in.`,
        })
        setSelectedAttendees([])
        break
    }
  }

  const handleAttendeeAction = (attendeeId: string, action: string) => {
    const attendee = attendees.find((a) => a.id === attendeeId)

    switch (action) {
      case "checkin":
        setAttendees(
          attendees.map((a) =>
            a.id === attendeeId ? { ...a, status: "attended", checkInTime: new Date().toLocaleString() } : a,
          ),
        )
        toast({
          title: "Check-in Complete",
          description: `${attendee?.name} has been checked in.`,
        })
        break
      case "email":
        toast({
          title: "Email Sent",
          description: `Email sent to ${attendee?.name}.`,
        })
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Event Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-3">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {event.startDate} - {event.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.isVirtual ? (
                      <Video className="h-4 w-4 text-gray-500" />
                    ) : (
                      <MapPin className="h-4 w-4 text-gray-500" />
                    )}
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      {attendeeStats.total}/{event.maxAttendees} registered
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>

            {/* Attendee Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Attendance Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{attendeeStats.total}</div>
                  <div className="text-sm text-blue-800">Total Registered</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{attendeeStats.attended}</div>
                  <div className="text-sm text-purple-800">Attended</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{attendeeStats.confirmed}</div>
                  <div className="text-sm text-green-800">Confirmed</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{attendeeStats.registered}</div>
                  <div className="text-sm text-yellow-800">Registered</div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendee Management */}
          <Tabs defaultValue="attendees" className="space-y-4">
            <TabsList>
              <TabsTrigger value="attendees">Attendee List ({attendeeStats.total})</TabsTrigger>
              <TabsTrigger value="checkin">Check-in Management</TabsTrigger>
            </TabsList>

            <TabsContent value="attendees" className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search attendees..."
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
              </div>

              {/* Bulk Actions */}
              {selectedAttendees.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-800">{selectedAttendees.length} attendee(s) selected</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("email")}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("checkin")}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                  </div>
                </div>
              )}

              {/* Attendee List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
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
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {attendee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium">{attendee.name}</h4>
                          {getStatusBadge(attendee.status)}
                          {getMemberTypeBadge(attendee.memberType)}
                        </div>
                        <p className="text-sm text-gray-600">{attendee.title}</p>
                        <p className="text-sm text-gray-500">{attendee.organization}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{attendee.email}</span>
                          <span>{attendee.location}</span>
                          {attendee.checkInTime && <span>Checked in: {attendee.checkInTime}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {attendee.status !== "attended" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAttendeeAction(attendee.id, "checkin")}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Check In
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAttendeeAction(attendee.id, "email")}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="checkin" className="space-y-4">
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Check-in Management</h3>
                <p className="text-gray-600 mb-4">Manage attendee check-ins for this event</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{attendeeStats.attended}</div>
                    <div className="text-sm text-purple-800">Checked In</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{attendeeStats.confirmed}</div>
                    <div className="text-sm text-green-800">Confirmed</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{attendeeStats.registered}</div>
                    <div className="text-sm text-yellow-800">Registered</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{attendeeStats.noShow}</div>
                    <div className="text-sm text-red-800">No Show</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => toast({ title: "Export Started", description: "Attendee data is being prepared." })}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Attendees
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
