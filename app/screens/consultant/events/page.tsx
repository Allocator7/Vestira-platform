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
import { EventCertificateModal } from "@/components/events/EventCertificateModal"
import { EventCalendar } from "@/components/events/EventCalendar"

export default function ConsultantEventsCenter() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [registrationEvent, setRegistrationEvent] = useState<any>(null)
  const [certificateEvent, setCertificateEvent] = useState<any>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock data for available events - focused on consultant interests
  const availableEvents = [
    {
      id: 1,
      title: "Financial Advisory Best Practices Summit",
      organizer: "Advisory Professional Network",
      date: "2025-07-20",
      time: "09:00 AM - 05:00 PM",
      location: "New York, NY",
      type: "Summit",
      category: "advisory",
      attendees: 320,
      maxAttendees: 400,
      price: "$1,100",
      rating: 4.8,
      description: "Comprehensive summit covering latest trends and best practices in financial advisory services.",
      isRegistered: false,
      image: "/placeholder.svg?height=200&width=400&text=Advisory+Summit",
    },
    {
      id: 2,
      title: "Regulatory Compliance in Private Markets",
      organizer: "Compliance Institute",
      date: "2025-07-28",
      time: "10:00 AM - 04:00 PM",
      location: "Washington, DC",
      type: "Conference",
      category: "regulatory",
      attendees: 180,
      maxAttendees: 250,
      price: "$850",
      rating: 4.7,
      description: "Stay updated on the latest regulatory requirements and compliance strategies.",
      isRegistered: true,
      image: "/placeholder.svg?height=200&width=400&text=Compliance+Conference",
    },
    {
      id: 3,
      title: "Client Relationship Management Workshop",
      organizer: "Professional Development Corp",
      date: "2025-08-10",
      time: "01:00 PM - 06:00 PM",
      location: "Chicago, IL",
      type: "Workshop",
      category: "professional-development",
      attendees: 75,
      maxAttendees: 100,
      price: "$550",
      rating: 4.9,
      description: "Enhance your client relationship management skills and grow your practice.",
      isRegistered: false,
      image: "/placeholder.svg?height=200&width=400&text=CRM+Workshop",
    },
    {
      id: 4,
      title: "Technology in Financial Services Forum",
      organizer: "FinTech Innovation Hub",
      date: "2025-08-18",
      time: "11:00 AM - 05:00 PM",
      location: "San Francisco, CA",
      type: "Forum",
      category: "technology",
      attendees: 200,
      maxAttendees: 300,
      price: "$750",
      rating: 4.6,
      description: "Explore how technology is transforming financial services and advisory practices.",
      isRegistered: false,
      image: "/placeholder.svg?height=200&width=400&text=FinTech+Forum",
    },
  ]

  // Mock data for registered events
  const myEvents = [
    {
      id: 2,
      title: "Regulatory Compliance in Private Markets",
      organizer: "Compliance Institute",
      date: "2025-07-28",
      time: "10:00 AM - 04:00 PM",
      location: "Washington, DC",
      type: "Conference",
      status: "registered",
      registrationDate: "2025-06-18",
    },
    {
      id: 5,
      title: "Ethics in Financial Advisory",
      organizer: "Ethics Board",
      date: "2025-05-25",
      time: "09:00 AM - 12:00 PM",
      location: "Virtual Event",
      type: "Seminar",
      status: "attended",
      registrationDate: "2025-05-10",
      rating: 4.3,
    },
  ]

  const handleRegister = (event: any) => {
    setRegistrationEvent(event)
  }

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event)
  }

  const handleViewCertificate = (event: any) => {
    setCertificateEvent(event)
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
          <p className="text-gray-600 mt-1">Professional development and industry networking events</p>
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
                <SelectItem value="advisory">Advisory Services</SelectItem>
                <SelectItem value="regulatory">Regulatory & Compliance</SelectItem>
                <SelectItem value="professional-development">Professional Development</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
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
                        <Button variant="outline" size="sm" onClick={() => handleViewCertificate(event)}>
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
