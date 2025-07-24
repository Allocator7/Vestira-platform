"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, Star, Building, Mail, Phone } from "lucide-react"

interface EventDetailsModalProps {
  event: any
  isOpen: boolean
  onClose: () => void
  onRegister: () => void
}

export function EventDetailsModal({ event, isOpen, onClose, onRegister }: EventDetailsModalProps) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      {event.attendees}/{event.maxAttendees} attendees
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>{event.organizer}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Event Type & Rating</h3>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{event.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{event.rating}</span>
                    <span className="text-gray-500 text-sm">rating</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Pricing</h3>
                <div className="text-2xl font-bold text-green-600">{event.price}</div>
                <p className="text-sm text-gray-500">Per person registration fee</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What You'll Learn</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Industry best practices and emerging trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Networking opportunities with industry leaders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Practical tools and strategies you can implement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Access to exclusive resources and materials</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>events@{event.organizer.toLowerCase().replace(/\s+/g, "")}.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {event.isRegistered ? (
              <Badge variant="default" className="flex-1 justify-center py-2">
                Already Registered
              </Badge>
            ) : (
              <Button onClick={onRegister} className="flex-1">
                Register for {event.price}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
