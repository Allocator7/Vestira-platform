"use client"

import { useState } from "react"
import { Calendar, Search, Filter, MapPin, Clock, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { EventRegistrationModal } from "@/components/events/EventRegistrationModal"
import { EventDetailsModal } from "@/components/events/EventDetailsModal"
import { EventCalendar } from "@/components/events/EventCalendar"
import { EventCertificateModal } from "@/components/events/EventCertificateModal"

export default function AllocatorEventsCenter() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [registrationEvent, setRegistrationEvent] = useState<any>(null)
  const [certificateEvent, setCertificateEvent] = useState<any>(null)

  // Mock data for available events - focused on allocator interests
  const availableEvents = [
    {
      id: 1,
      title: "Institutional Investor Due Diligence Summit",
      organizer: "Institutional Investor Network",
      date: "2025-07-18",
      time: "08:30 AM - 05:30 PM",
      location: "New York, NY",
      type: "Summit",
      category: "due-diligence",
      attendees: 380,
      maxAttendees: 450,
      price: "$1,500",
      rating: 4.9,
      description: "Comprehensive summit covering advanced due diligence methodologies and risk assessment strategies.",
      isRegistered: false,
      image: "/placeholder.svg?height=200&width=400&text=DD+Summit",
    },
    {
      id: 2,
      title: "Alternative Investment Allocation Strategies",
      organizer: "Pension Fund Institute",
      date: "2025-07-25",
      time: "09:00 AM - 04:00 PM",
      location: "Chicago, IL",
      type: "Conference",
      category: "strategy",
      attendees: 250,
      maxAttendees: 300,
      price: "$950",
      rating: 4.7,
      description: "Strategic insights into alternative investment allocation for institutional portfolios.",
      isRegistered: true,
      image: "/placeholder.svg?height=200&width=400&text=Allocation+Strategies",
    },
    {
      id: 3,
      title: "Private Markets Performance Analytics Workshop",
      organizer: "Analytics Institute",
      date: "2025-08-08",
      time: "01:00 PM - 06:00 PM",
      location: "Boston, MA",
      type: "Workshop",
      category: "analytics",
      attendees: 95,
      maxAttendees: 120,
      price: "$650",
      rating: 4.8,
      description: "Hands-on workshop on performance measurement and benchmarking in private markets.",
      isRegistered: false,
      image: "/placeholder.svg?height=200&width=400&text=Analytics+Workshop",
    },
    {
      id: 4,
      title: "Endowment & Foundation Investment Forum",
      organizer: "Nonprofit Investment Alliance",
      date: "2025-08-15",
      time: "10:00 AM - 03:00 PM",
      location: "San Francisco, CA",
      type: "Forum",
      category: "networking",
      attendees: 180,
      maxAttendees: 200,
      price: "$750",
      rating: 4.6,
      description: "Networking and knowledge sharing for endowment and foundation investment professionals.",
      isRegistered: false,
      image: "/placeholder.svg?height=200&width=400&text=Investment+Forum",
    },
  ]

  // Mock data for registered events
  const myEvents = [
    {
      id: 2,
      title: "Alternative Investment Allocation Strategies",
      organizer: "Pension Fund Institute",
      date: "2025-07-25",
      time: "09:00 AM - 04:00 PM",
      location: "Chicago, IL",
      type: "Conference",
      status: "registered",
      registrationDate: "2025-06-15",
    },
    {
      id: 5,
      title: "Risk Management in Private Equity",
      organizer: "Risk Management Society",
      date: "2025-05-20",
      time: "02:00 PM - 05:00 PM",
      location: "Virtual Event",
      type: "Webinar",
      status: "attended",
      registrationDate: "2025-05-05",
      rating: 4.4,
    },
  ]

  const handleRegister = (event: any) => {
    setRegistrationEvent(event)
  }

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event)
  }

  const handleCancelRegistration = (eventId: number) => {
    toast({
      title: "Registration Cancelled",
      description: "You have successfully cancelled your event registration.",
    })
  }

  const filteredEvents = availableEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Center</h1>
          <p className="text-gray-600 mt-1">Discover professional development and networking opportunities</p>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Events</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="due-diligence">Due Diligence</SelectItem>
                <SelectItem value="strategy">Investment Strategy</SelectItem>
                <SelectItem value="analytics">Performance Analytics</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant={event.isRegistered ? "default" : "secondary"}>{event.type}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{event.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                  <p className="text-sm text-gray-600">{event.organizer}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.attendees}/{event.maxAttendees} attendees
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-lg">{event.price}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(event)}>
                        Details
                      </Button>
                      {event.isRegistered ? (
                        <Badge variant="default">Registered</Badge>
                      ) : (
                        <Button size="sm" onClick={() => handleRegister(event)}>
                          Register
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myEvents.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant={event.status === "registered" ? "default" : "secondary"}>
                      {event.status === "registered" ? "Upcoming" : "Completed"}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Registered: {new Date(event.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle>{event.title}</CardTitle>
                  <p className="text-gray-600">{event.organizer}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="space-y-2 text-sm text-gray-600 flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    {event.status === "registered" ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(event)}>
                          View Details
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleCancelRegistration(event.id)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setCertificateEvent(event)}>
                          View Certificate
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <EventCalendar
            events={[...availableEvents.filter((e) => e.isRegistered), ...myEvents]}
            onEventClick={handleViewDetails}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={() => {
            setRegistrationEvent(selectedEvent)
            setSelectedEvent(null)
          }}
        />
      )}

      {registrationEvent && (
        <EventRegistrationModal
          event={registrationEvent}
          isOpen={!!registrationEvent}
          onClose={() => setRegistrationEvent(null)}
          onSuccess={() => {
            setRegistrationEvent(null)
            toast({
              title: "Registration Successful",
              description: "You have successfully registered for the event.",
            })
          }}
        />
      )}

      {certificateEvent && (
        <EventCertificateModal
          event={certificateEvent}
          isOpen={!!certificateEvent}
          onClose={() => setCertificateEvent(null)}
        />
      )}
    </div>
  )
}
