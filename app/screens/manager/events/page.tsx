"use client"

import { useState } from "react"
import { Calendar, Search, Filter, MapPin, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { EventRegistrationModal } from "@/components/events/EventRegistrationModal"
import { EventDetailsModal } from "@/components/events/EventDetailsModal"
import { EventCertificateModal } from "@/components/events/EventCertificateModal"
import { EventCalendar } from "@/components/events/EventCalendar"
import { CreateEventButton } from "@/components/events/CreateEventButton"

export default function ManagerEventsCenter() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [registrationEvent, setRegistrationEvent] = useState<any>(null)
  const [certificateEvent, setCertificateEvent] = useState<any>(null)

  // Mock data for available events
  const availableEvents = [
    {
      id: 1,
      title: "Alternative Investment Summit 2025",
      organizer: "Private Equity Association",
      date: "2025-07-15",
      time: "09:00 AM - 05:00 PM",
      location: "New York, NY",
      type: "Conference",
      category: "fundraising",
      attendees: 450,
      maxAttendees: 500,
      price: "$1,200",
      description:
        "Premier event for alternative investment professionals focusing on fundraising strategies and market trends.",
      isRegistered: false,
      image: "/events/investment-summit.jpg",
    },
    {
      id: 2,
      title: "Investor Relations Best Practices Workshop",
      organizer: "IR Professional Network",
      date: "2025-07-22",
      time: "02:00 PM - 06:00 PM",
      location: "Chicago, IL",
      type: "Workshop",
      category: "networking",
      attendees: 85,
      maxAttendees: 100,
      price: "$450",
      description: "Hands-on workshop covering effective investor communication and relationship management.",
      isRegistered: false,
      image: "/events/ir-workshop.jpg",
    },
    {
      id: 3,
      title: "ESG in Private Markets Symposium",
      organizer: "Sustainable Finance Institute",
      date: "2025-08-05",
      time: "10:00 AM - 04:00 PM",
      location: "San Francisco, CA",
      type: "Symposium",
      category: "education",
      attendees: 220,
      maxAttendees: 300,
      price: "$800",
      description: "Exploring ESG integration strategies in private market investments.",
      isRegistered: true,
      image: "/events/esg-symposium.jpg",
    },
  ]

  // Mock data for registered events
  const myEvents = [
    {
      id: 3,
      title: "ESG in Private Markets Symposium",
      organizer: "Sustainable Finance Institute",
      date: "2025-08-05",
      time: "10:00 AM - 04:00 PM",
      location: "San Francisco, CA",
      type: "Symposium",
      status: "registered",
      registrationDate: "2025-06-20",
    },
    {
      id: 4,
      title: "Private Credit Market Outlook",
      organizer: "Credit Investment Forum",
      date: "2025-05-15",
      time: "09:00 AM - 12:00 PM",
      location: "Boston, MA",
      type: "Webinar",
      status: "attended",
      registrationDate: "2025-05-01",
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
          <p className="text-gray-600 mt-1">Discover and register for industry events and conferences</p>
        </div>
        <CreateEventButton />
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
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="education">Education</SelectItem>
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
