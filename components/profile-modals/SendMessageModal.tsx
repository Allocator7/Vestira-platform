"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Building2 } from "lucide-react"

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
  recipientName: string
  recipientTitle?: string
  organizationName: string
  contactSelector?: React.ReactNode
}

export function SendMessageModal({
  isOpen,
  onClose,
  recipientName,
  recipientTitle,
  organizationName,
  contactSelector,
}: SendMessageModalProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("Normal")

  const handleClose = () => {
    setSubject("")
    setMessage("")
    setPriority("Normal")
    onClose()
  }

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      return
    }

    // Here you would typically send the message
    console.log("Sending message:", {
      to: recipientName,
      organization: organizationName,
      subject,
      message,
      priority,
    })

    // Show success notification or handle the response
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Send Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {contactSelector ? (
            contactSelector
          ) : (
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-deepBrand">{organizationName}</span>
              </div>
              <div className="ml-6">
                Send a message to{" "}
                <span className="font-medium">
                  {recipientName}
                  {recipientTitle && ` • ${recipientTitle}`}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={`${recipientName} <${recipientName.toLowerCase().replace(" ", ".")}@${organizationName.toLowerCase().replace(/\s+/g, "")}.com>`}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder={`Re: ${organizationName} - Consulting Services`}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder={`Dear ${recipientName},\n\nI hope this message finds you well. I wanted to follow up regarding ${organizationName}'s investment consulting needs...\n\nBest regards,`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!subject.trim() || !message.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
