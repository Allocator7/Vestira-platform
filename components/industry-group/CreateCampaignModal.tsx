"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Mail } from "lucide-react"

interface CreateCampaignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCampaignCreated: (campaign: any) => void
}

export function CreateCampaignModal({ open, onOpenChange, onCampaignCreated }: CreateCampaignModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    subject: "",
    content: "",
    recipients: [] as string[],
    scheduledDate: "",
    scheduledTime: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const memberGroups = [
    { id: "all", name: "All Members", count: 1450 },
    { id: "premium", name: "Premium Members", count: 320 },
    { id: "corporate", name: "Corporate Members", count: 180 },
    { id: "individual", name: "Individual Members", count: 950 },
    { id: "event-attendees", name: "Recent Event Attendees", count: 245 },
    { id: "newsletter-subscribers", name: "Newsletter Subscribers", count: 1200 },
  ]

  const handleSubmit = async () => {
    if (!formData.title || !formData.type || !formData.subject || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newCampaign = {
      id: Date.now().toString(),
      ...formData,
      status: formData.scheduledDate ? "scheduled" : "sent",
      recipients: formData.recipients.reduce((sum, groupId) => {
        const group = memberGroups.find((g) => g.id === groupId)
        return sum + (group?.count || 0)
      }, 0),
      opened: 0,
      clicked: 0,
      sentDate: formData.scheduledDate || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    }

    onCampaignCreated(newCampaign)

    toast({
      title: "Campaign Created",
      description: formData.scheduledDate ? "Campaign scheduled successfully!" : "Campaign sent successfully!",
    })

    setIsLoading(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      title: "",
      type: "",
      subject: "",
      content: "",
      recipients: [],
      scheduledDate: "",
      scheduledTime: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Create New Campaign
          </DialogTitle>
          <DialogDescription>Create and send email campaigns to your members</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Name *</Label>
              <Input
                id="title"
                placeholder="Enter campaign name"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Campaign</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="survey">Survey</SelectItem>
                  <SelectItem value="invitation">Event Invitation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line *</Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Recipients *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-lg p-3">
              {memberGroups.map((group) => (
                <div key={group.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={group.id}
                    checked={formData.recipients.includes(group.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ ...formData, recipients: [...formData.recipients, group.id] })
                      } else {
                        setFormData({
                          ...formData,
                          recipients: formData.recipients.filter((id) => id !== group.id),
                        })
                      }
                    }}
                  />
                  <label htmlFor={group.id} className="text-sm cursor-pointer">
                    {group.name} ({group.count})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter your message..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Schedule Time (Optional)</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Campaign Preview</h4>
            <div className="text-sm space-y-1">
              <div>
                <strong>Recipients:</strong>{" "}
                {formData.recipients.reduce((sum, groupId) => {
                  const group = memberGroups.find((g) => g.id === groupId)
                  return sum + (group?.count || 0)
                }, 0)}{" "}
                members
              </div>
              <div>
                <strong>Subject:</strong> {formData.subject || "Enter subject line"}
              </div>
              <div>
                <strong>Type:</strong> {formData.type || "Select type"}
              </div>
              {formData.scheduledDate && (
                <div>
                  <strong>Scheduled:</strong> {formData.scheduledDate} {formData.scheduledTime}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Creating..." : formData.scheduledDate ? "Schedule Campaign" : "Send Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
