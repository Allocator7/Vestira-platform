"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, X } from "lucide-react"

interface SendInvitationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: Array<{ id: string; title: string; date: string }>
}

export function SendInvitationModal({ open, onOpenChange, events }: SendInvitationModalProps) {
  const { toast } = useToast()
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [recipientType, setRecipientType] = useState<"all" | "selected" | "custom">("all")
  const [customEmails, setCustomEmails] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const recipientGroups = [
    { id: "all-members", name: "All Members", count: 1247 },
    { id: "premium-members", name: "Premium Members", count: 320 },
    { id: "recent-attendees", name: "Recent Event Attendees", count: 245 },
    { id: "newsletter-subscribers", name: "Newsletter Subscribers", count: 892 },
  ]

  const handleSendInvitation = async () => {
    if (!subject.trim() || !message.trim() || selectedEvents.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one event.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Invitations Sent Successfully",
      description: `Sent invitations for ${selectedEvents.length} event(s) to selected recipients.`,
    })

    setIsLoading(false)
    onOpenChange(false)

    // Reset form
    setSelectedEvents([])
    setSubject("")
    setMessage("")
    setCustomEmails("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Event Invitations
          </DialogTitle>
          <DialogDescription>Send personalized invitations to your members for upcoming events</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Events *</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={event.id}
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEvents([...selectedEvents, event.id])
                      } else {
                        setSelectedEvents(selectedEvents.filter((id) => id !== event.id))
                      }
                    }}
                  />
                  <label htmlFor={event.id} className="text-sm flex-1 cursor-pointer">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-gray-500 text-xs">{event.date}</div>
                  </label>
                </div>
              ))}
            </div>
            {selectedEvents.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedEvents.map((eventId) => {
                  const event = events.find((e) => e.id === eventId)
                  return (
                    <Badge key={eventId} variant="secondary" className="text-xs">
                      {event?.title}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setSelectedEvents(selectedEvents.filter((id) => id !== eventId))}
                      />
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recipient Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Recipients *</Label>
            <Select
              value={recipientType}
              onValueChange={(value: "all" | "selected" | "custom") => setRecipientType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members (1,247)</SelectItem>
                <SelectItem value="selected">Selected Groups</SelectItem>
                <SelectItem value="custom">Custom Email List</SelectItem>
              </SelectContent>
            </Select>

            {recipientType === "selected" && (
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg">
                {recipientGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox id={group.id} />
                    <label htmlFor={group.id} className="text-sm cursor-pointer">
                      {group.name} ({group.count})
                    </label>
                  </div>
                ))}
              </div>
            )}

            {recipientType === "custom" && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter email addresses separated by commas or new lines..."
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500">Example: john@company.com, sarah@organization.org</p>
              </div>
            )}
          </div>

          {/* Email Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line *</Label>
              <Input
                id="subject"
                placeholder="You're invited to our upcoming events!"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personal Message *</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to your invitation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Preview</h4>
            <div className="text-sm space-y-2">
              <div>
                <strong>To:</strong>{" "}
                {recipientType === "all"
                  ? "All Members (1,247)"
                  : recipientType === "selected"
                    ? "Selected Groups"
                    : "Custom List"}
              </div>
              <div>
                <strong>Subject:</strong> {subject || "You're invited to our upcoming events!"}
              </div>
              <div>
                <strong>Events:</strong> {selectedEvents.length} selected
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvitation} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Invitations"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
