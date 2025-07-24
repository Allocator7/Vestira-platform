"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  Users,
  MapPin,
  Video,
  Clock,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Download,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Copy,
  Share,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CreateEventModal } from "@/components/industry-group/CreateEventModal"
import { EventDetailsModal } from "@/components/industry-group/EventDetailsModal"

export default function IndustryGroupEventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [filterType, setFilterType] = useState("all")
  const { toast } = useToast()
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false)

  // Mock events data with state management
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Annual Insurance Investment Summit",
      type: "conference",
      description: "Premier gathering of insurance investment professionals",
      startDate: "2025-02-15",
      endDate: "2025-02-17",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      location: "Chicago, IL",
      venue: "McCormick Place Convention Center",
      isVirtual: false,
      maxAttendees: 300,
      registrations: 245,
      confirmed: 198,
      attended: 0,
      status: "published",
      registrationDeadline: "2025-02-10",
      registrationFee: 495,
      speakers: ["Dr. Sarah Johnson", "Michael Chen", "Lisa Rodriguez"],
      tags: ["investment", "insurance", "summit"],
      createdAt: "2024-12-01",
    },
    {
      id: "2",
      title: "Regulatory Update Webinar",
      type: "webinar",
      description: "Latest regulatory changes affecting life insurance investments",
      startDate: "2025-01-28",
      endDate: "2025-01-28",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      location: "Virtual",
      venue: "Zoom Platform",
      isVirtual: true,
      maxAttendees: 500,
      registrations: 156,
      confirmed: 142,
      attended: 0,
      status: "published",
      registrationDeadline: "2025-01-26",
      registrationFee: 0,
      speakers: ["Robert Kim", "Jennifer Walsh"],
      tags: ["regulatory", "compliance", "webinar"],
      createdAt: "2024-12-15",
    },
    {
      id: "3",
      title: "ESG Investment Workshop",
      type: "workshop",
      description: "Hands-on workshop on ESG investment strategies",
      startDate: "2025-03-10",
      endDate: "2025-03-10",
      startTime: "10:00 AM",
      endTime: "04:00 PM",
      location: "New York, NY",
      venue: "Financial District Conference Center",
      isVirtual: false,
      maxAttendees: 150,
      registrations: 89,
      confirmed: 76,
      attended: 0,
      status: "draft",
      registrationDeadline: "2025-03-05",
      registrationFee: 295,
      speakers: ["Amanda Foster", "David Park"],
      tags: ["esg", "sustainability", "workshop"],
      createdAt: "2024-12-20",
    },
  ])

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTab = activeTab === "all" || event.status === activeTab
      const matchesType = filterType === "all" || event.type === filterType

      return matchesSearch && matchesTab && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "registrations":
          return b.registrations - a.registrations
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conference":
        return <Users className="h-4 w-4" />
      case "webinar":
        return <Video className="h-4 w-4" />
      case "workshop":
        return <Calendar className="h-4 w-4" />
      case "networking":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const eventStats = {
    total: events.length,
    published: events.filter((e) => e.status === "published").length,
    draft: events.filter((e) => e.status === "draft").length,
    completed: events.filter((e) => e.status === "completed").length,
    totalRegistrations: events.reduce((sum, e) => sum + e.registrations, 0),
  }

  const handleCreateEvent = (newEvent: any) => {
    setEvents([...events, newEvent])
    setCreateEventOpen(false)
    toast({
      title: "Event Created",
      description: `${newEvent.title} has been created successfully.`,
    })
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId))
    setDeleteEventId(null)
    toast({
      title: "Event Deleted",
      description: "The event has been deleted successfully.",
    })
  }

  const handlePublishEvent = (eventId: string) => {
    setEvents(events.map((e) => (e.id === eventId ? { ...e, status: "published" } : e)))
    toast({
      title: "Event Published",
      description: "The event is now live and accepting registrations.",
    })
  }

  const handleDuplicateEvent = (event: any) => {
    const duplicatedEvent = {
      ...event,
      id: Date.now().toString(),
      title: `${event.title} (Copy)`,
      status: "draft",
      registrations: 0,
      confirmed: 0,
      attended: 0,
      createdAt: new Date().toISOString(),
    }
    setEvents([...events, duplicatedEvent])
    toast({
      title: "Event Duplicated",
      description: "A copy of the event has been created as a draft.",
    })
  }

  const handleExportData = () => {
    // Mock export functionality
    toast({
      title: "Export Started",
      description: "Your event data is being prepared for download.",
    })
  }

  const handleShareEvent = (event: any) => {
    // Mock share functionality
    navigator.clipboard.writeText(`Check out this event: ${event.title}`)
    toast({
      title: "Link Copied",
      description: "Event link has been copied to clipboard.",
    })
  }

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event)
    setEventDetailsOpen(true)
  }

  return (
    <div className="p-6 space-y-6 bg-canvas-bg min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-deep-brand">Event Management</h1>
          <p className="text-base-gray mt-1">Manage conferences, webinars, and workshops</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExportData}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={() => setCreateEventOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-deep-brand">{eventStats.total}</div>
            <div className="text-sm text-base-gray">Total Events</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{eventStats.published}</div>
            <div className="text-sm text-base-gray">Published</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{eventStats.draft}</div>
            <div className="text-sm text-base-gray">Draft</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{eventStats.completed}</div>
            <div className="text-sm text-base-gray">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-electric-blue">{eventStats.totalRegistrations}</div>
            <div className="text-sm text-base-gray">Total Registrations</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white shadow-vestira">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="registrations">Registrations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="all">All ({eventStats.total})</TabsTrigger>
          <TabsTrigger value="published">Published ({eventStats.published})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({eventStats.draft})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({eventStats.completed})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled (0)</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredEvents.length === 0 ? (
            <Card className="bg-white shadow-vestira">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-base-gray opacity-50" />
                <h3 className="text-lg font-medium text-deep-brand mb-2">No events found</h3>
                <p className="text-base-gray mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first event"}
                </p>
                <Button className="gap-2" onClick={() => setCreateEventOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white shadow-vestira hover:shadow-vestira-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6" onClick={() => handleViewEvent(event)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(event.type)}
                            <h3 className="text-lg font-semibold text-deep-brand">{event.title}</h3>
                          </div>
                          <Badge className={`${getStatusColor(event.status)} border-0`}>{event.status}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>

                        <p className="text-base-gray mb-4">{event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-base-gray">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {event.startDate}
                              {event.startDate !== event.endDate && ` - ${event.endDate}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-base-gray">
                            <Clock className="h-4 w-4" />
                            <span>
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-base-gray">
                            {event.isVirtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-base-gray">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.registrations}/{event.maxAttendees} registered
                            </span>
                          </div>
                        </div>

                        {event.status === "published" && (
                          <div className="mt-4 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>{event.confirmed} confirmed</span>
                            </div>
                            {event.attended > 0 && (
                              <div className="flex items-center gap-2 text-blue-600">
                                <UserCheck className="h-4 w-4" />
                                <span>{event.attended} attended</span>
                              </div>
                            )}
                            {new Date(event.registrationDeadline) < new Date() && (
                              <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>Registration closed</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => handleViewEvent(event)}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Event
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleDuplicateEvent(event)}>
                              <Copy className="h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleShareEvent(event)}>
                              <Share className="h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            {event.status === "draft" && (
                              <DropdownMenuItem className="gap-2" onClick={() => handlePublishEvent(event.id)}>
                                <CheckCircle className="h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-red-600 hover:text-red-700"
                              onClick={() => setDeleteEventId(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={createEventOpen}
        onClose={() => setCreateEventOpen(false)}
        onEventCreated={handleCreateEvent}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={eventDetailsOpen}
        onClose={() => {
          setEventDetailsOpen(false)
          setSelectedEvent(null)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEventId && handleDeleteEvent(deleteEventId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
