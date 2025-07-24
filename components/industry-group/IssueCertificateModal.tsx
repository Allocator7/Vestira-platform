"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Award } from "lucide-react"

interface IssueCertificateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IssueCertificateModal({ open, onOpenChange }: IssueCertificateModalProps) {
  const { toast } = useToast()
  const [certificateType, setCertificateType] = useState("")
  const [eventId, setEventId] = useState("")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const certificateTypes = [
    { id: "attendance", name: "Certificate of Attendance", description: "For event participation" },
    { id: "completion", name: "Certificate of Completion", description: "For course completion" },
    { id: "achievement", name: "Certificate of Achievement", description: "For special recognition" },
    { id: "cpe", name: "CPE Certificate", description: "Continuing Professional Education" },
  ]

  const events = [
    { id: "1", title: "ESG Investment Summit 2024", date: "2024-02-15", attendees: 245 },
    { id: "2", title: "Private Markets Outlook", date: "2024-02-22", attendees: 189 },
    { id: "3", title: "Regulatory Updates Webinar", date: "2024-03-01", attendees: 156 },
  ]

  const attendees = [
    { id: "1", name: "Sarah Johnson", email: "sarah.johnson@pension.gov", organization: "State Teachers Pension Fund" },
    { id: "2", name: "Michael Chen", email: "m.chen@globalcap.com", organization: "Global Capital Management" },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.r@consultgroup.com",
      organization: "Strategic Investment Consultants",
    },
  ]

  const handleIssueCertificate = async () => {
    if (!certificateType || !eventId || selectedAttendees.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select certificate type, event, and at least one attendee.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Certificates Issued Successfully",
      description: `Issued ${selectedAttendees.length} certificate(s) and sent to recipients.`,
    })

    setIsLoading(false)
    onOpenChange(false)

    // Reset form
    setCertificateType("")
    setEventId("")
    setSelectedAttendees([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Issue Certificates
          </DialogTitle>
          <DialogDescription>Issue professional certificates to event attendees</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Certificate Type *</Label>
            <Select value={certificateType} onValueChange={setCertificateType}>
              <SelectTrigger>
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                {certificateTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Event *</Label>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-gray-500">
                        {event.date} • {event.attendees} attendees
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Attendee Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Recipients *</Label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Checkbox
                    id="select-all"
                    checked={selectedAttendees.length === attendees.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAttendees(attendees.map((a) => a.id))
                      } else {
                        setSelectedAttendees([])
                      }
                    }}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                    Select All ({attendees.length})
                  </label>
                </div>
                {attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={attendee.id}
                      checked={selectedAttendees.includes(attendee.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAttendees([...selectedAttendees, attendee.id])
                        } else {
                          setSelectedAttendees(selectedAttendees.filter((id) => id !== attendee.id))
                        }
                      }}
                    />
                    <label htmlFor={attendee.id} className="text-sm cursor-pointer flex-1">
                      <div className="font-medium">{attendee.name}</div>
                      <div className="text-gray-500 text-xs">{attendee.organization}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {selectedAttendees.length} of {attendees.length} attendees selected
            </p>
          </div>

          {/* Certificate Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hours">CPE Hours (if applicable)</Label>
              <Input id="hours" type="number" placeholder="Enter CPE hours" min="0" max="24" step="0.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor/Presenter</Label>
              <Input id="instructor" placeholder="Enter instructor name" />
            </div>
          </div>

          {/* Preview */}
          {certificateType && eventId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Certificate Preview</h4>
              <div className="text-sm space-y-1">
                <div>
                  <strong>Type:</strong> {certificateTypes.find((t) => t.id === certificateType)?.name}
                </div>
                <div>
                  <strong>Event:</strong> {events.find((e) => e.id === eventId)?.title}
                </div>
                <div>
                  <strong>Recipients:</strong> {selectedAttendees.length} selected
                </div>
                <div>
                  <strong>Issue Date:</strong> {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleIssueCertificate} disabled={isLoading}>
              {isLoading ? "Issuing..." : "Issue Certificates"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
