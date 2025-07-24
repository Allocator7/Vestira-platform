"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, BookOpen, Briefcase, Building, Calendar, ExternalLink, Mail, MapPin } from "lucide-react"

interface ConsultantProfileProps {
  consultant: {
    id: string | number
    name: string
    logo?: string
    category: string
    location: string
    yearsInBusiness: number
    specializations: string[]
    status: "connected" | "pending"
    lastInteraction: string
  }
  onViewProfile?: (id: string | number) => void
  onMessage?: (id: string | number) => void
  onSchedule?: (id: string | number) => void
}

export function ConsultantProfileCard({ consultant, onViewProfile, onMessage, onSchedule }: ConsultantProfileProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="h-2 bg-purple-600" />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={consultant.logo || "/placeholder.svg"} alt={consultant.name} />
              <AvatarFallback>
                {consultant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{consultant.name}</h3>
              <div className="flex items-center mt-1">
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Consultant</Badge>
                <Badge
                  className={
                    consultant.status === "connected"
                      ? "ml-2 bg-green-100 text-green-800 hover:bg-green-100"
                      : "ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100"
                  }
                >
                  {consultant.status === "connected" ? "Connected" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 mr-2 text-base-gray" />
            <span>{consultant.category}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-base-gray" />
            <span>{consultant.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-2 text-base-gray" />
            <span>{consultant.yearsInBusiness} Years in Business</span>
          </div>
          <div className="flex items-start text-sm">
            <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-base-gray" />
            <div>
              <span className="block">Services:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="outline" className="text-xs bg-purple-50">
                  Investment Consulting
                </Badge>
                <Badge variant="outline" className="text-xs bg-purple-50">
                  OCIO
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-start text-sm">
            <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-base-gray" />
            <div>
              <span className="block">Specializations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {consultant.specializations.map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-base-gray mb-3">Last interaction: {consultant.lastInteraction}</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
              onClick={() => onViewProfile && onViewProfile(consultant.id)}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
              onClick={() => onMessage && onMessage(consultant.id)}
            >
              <Mail className="h-3 w-3 mr-1" />
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
              onClick={() => onSchedule && onSchedule(consultant.id)}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
