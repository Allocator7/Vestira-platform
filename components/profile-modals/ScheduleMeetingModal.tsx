"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, Video, Phone, MapPin, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScheduleMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  recipientName: string
  recipientEmail: string
  organizationName?: string
  contactSelector?: React.ReactNode
}

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  recipientName,
  recipientEmail,
  organizationName,
  contactSelector,
}: ScheduleMeetingModalProps) {
  const { toast } = useToast()
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [meetingDuration, setMeetingDuration] = useState("60")
  const [meetingType, setMeetingType] = useState("video")
  const [meetingLocation, setMeetingLocation] = useState("")
  const [meetingAgenda, setMeetingAgenda] = useState("")
  const [meetingContext, setMeetingContext] = useState("general")
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  const handleScheduleMeeting = async () => {
    if (!meetingTitle.trim() || !meetingDate || !meetingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in meeting title, date, and time.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setScheduleSuccess(true)

    setTimeout(() => {
      onClose()
      setScheduleSuccess(false)
      setMeetingTitle("")
      setMeetingDate("")
      setMeetingTime("")
      setMeetingDuration("60")
      setMeetingType("video")
      setMeetingLocation("")
      setMeetingAgenda("")
      setMeetingContext("general")
    }, 1500)
  }

  const handleClose = () => {
    onClose()
    setScheduleSuccess(false)
    setMeetingTitle("")
    setMeetingDate("")
    setMeetingTime("")
    setMeetingDuration("60")
    setMeetingType("video")
    setMeetingLocation("")
    setMeetingAgenda("")
    setMeetingContext("general")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Meeting
          </DialogTitle>
          <DialogDescription>
            {contactSelector ? "Schedule a meeting with selected contact" : `Schedule a meeting with ${recipientName}`}
          </DialogDescription>
        </DialogHeader>

        {contactSelector && (
          <div className="mb-4">
            {contactSelector}
          </div>
        )}

        {scheduleSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-medium text-center">Meeting scheduled!</p>
            <p className="text-sm text-center mt-1 text-gray-600">
              Your meeting with {recipientName} has been scheduled for {meetingDate} at {meetingTime}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                placeholder="e.g., Investment Discussion"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingContext">Meeting Context</Label>
              <Select value={meetingContext} onValueChange={setMeetingContext}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Discussion</SelectItem>
                  <SelectItem value="private-equity">Private Equity</SelectItem>
                  <SelectItem value="hedge-funds">Hedge Funds</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="fixed-income">Fixed Income</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="venture-capital">Venture Capital</SelectItem>
                  <SelectItem value="growth-equity">Growth Equity</SelectItem>
                  <SelectItem value="buyouts">Buyouts</SelectItem>
                  <SelectItem value="credit-strategies">Credit Strategies</SelectItem>
                  <SelectItem value="esg-sustainable">ESG/Sustainable Investing</SelectItem>
                  <SelectItem value="direct-lending">Direct Lending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={meetingDuration} onValueChange={setMeetingDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingType">Meeting Type</Label>
                <Select value={meetingType} onValueChange={setMeetingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video Call
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Call
                      </div>
                    </SelectItem>
                    <SelectItem value="in-person">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        In Person
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(meetingType === "in-person" || meetingType === "video") && (
                <div className="space-y-2">
                  <Label htmlFor="location">{meetingType === "video" ? "Meeting Link" : "Location"}</Label>
                  <Input
                    id="location"
                    placeholder={meetingType === "video" ? "Paste Zoom/Teams link here" : "Enter location"}
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda (Optional)</Label>
              <Textarea
                id="agenda"
                placeholder="Meeting agenda or topics to discuss..."
                value={meetingAgenda}
                onChange={(e) => setMeetingAgenda(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {!scheduleSuccess && (
            <Button onClick={handleScheduleMeeting}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
