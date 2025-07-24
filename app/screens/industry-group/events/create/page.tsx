"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Plus, X, MapPin, Video, Users, Clock, ArrowLeft, Save, Send } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateEventPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    isVirtual: false,
    location: "",
    venue: "",
    maxAttendees: "",
    registrationFee: "",
    speakers: [] as string[],
    tags: [] as string[],
    requiresApproval: false,
    allowWaitlist: true,
    sendConfirmationEmail: true,
  })

  const [newSpeaker, setNewSpeaker] = useState("")
  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Event title is required"
    if (!formData.type) newErrors.type = "Event type is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.startTime) newErrors.startTime = "Start time is required"
    if (!formData.endTime) newErrors.endTime = "End time is required"
    if (!formData.isVirtual && !formData.location.trim())
      newErrors.location = "Location is required for in-person events"
    if (!formData.maxAttendees || Number.parseInt(formData.maxAttendees) <= 0)
      newErrors.maxAttendees = "Valid max attendees required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Draft Saved",
      description: "Your event has been saved as a draft.",
    })
    setIsSaving(false)
  }

  const handlePublish = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Event Published",
      description: `${formData.title} has been published successfully.`,
    })

    // Redirect to events page
    router.push("/screens/industry-group/events")
  }

  const addSpeaker = () => {
    if (newSpeaker.trim() && !formData.speakers.includes(newSpeaker.trim())) {
      setFormData({ ...formData, speakers: [...formData.speakers, newSpeaker.trim()] })
      setNewSpeaker("")
    }
  }

  const removeSpeaker = (speaker: string) => {
    setFormData({ ...formData, speakers: formData.speakers.filter((s) => s !== speaker) })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  return (
    <div className="p-6 space-y-6 bg-canvas-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/screens/industry-group/home">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-deep-brand">Create New Event</h1>
            <p className="text-base-gray mt-1">Create a new conference, webinar, workshop, or networking event</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="gap-2 bg-transparent">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={handlePublish} disabled={isSaving} className="gap-2">
            <Send className="h-4 w-4" />
            {isSaving ? "Publishing..." : "Publish Event"}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-xl font-semibold text-deep-brand">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter event title"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="networking">Networking Event</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="panel">Panel Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your event..."
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>
              </div>

              <Separator />

              {/* Date and Time */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-xl font-semibold text-deep-brand">Date & Time</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground",
                            errors.startDate && "border-red-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData({ ...formData, startDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Same as start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData({ ...formData, endDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className={errors.startTime ? "border-red-500" : ""}
                    />
                    {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className={errors.endTime ? "border-red-500" : ""}
                    />
                    {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-xl font-semibold text-deep-brand">Location</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVirtual"
                    checked={formData.isVirtual}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVirtual: checked })}
                  />
                  <Label htmlFor="isVirtual" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Virtual Event
                  </Label>
                </div>

                {!formData.isVirtual && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, State/Country"
                        className={errors.location ? "border-red-500" : ""}
                      />
                      {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        placeholder="Venue name and address"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Registration */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-xl font-semibold text-deep-brand">Registration</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees">Max Attendees *</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={formData.maxAttendees}
                      onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                      placeholder="100"
                      className={errors.maxAttendees ? "border-red-500" : ""}
                    />
                    {errors.maxAttendees && <p className="text-sm text-red-500">{errors.maxAttendees}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationFee">Registration Fee ($)</Label>
                    <Input
                      id="registrationFee"
                      type="number"
                      value={formData.registrationFee}
                      onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresApproval"
                      checked={formData.requiresApproval}
                      onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: checked })}
                    />
                    <Label htmlFor="requiresApproval">Require approval for registration</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowWaitlist"
                      checked={formData.allowWaitlist}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowWaitlist: checked })}
                    />
                    <Label htmlFor="allowWaitlist">Allow waitlist when full</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendConfirmationEmail"
                      checked={formData.sendConfirmationEmail}
                      onCheckedChange={(checked) => setFormData({ ...formData, sendConfirmationEmail: checked })}
                    />
                    <Label htmlFor="sendConfirmationEmail">Send confirmation emails</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Speakers */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-deep-brand">Speakers (Optional)</h2>

                <div className="flex gap-2">
                  <Input
                    value={newSpeaker}
                    onChange={(e) => setNewSpeaker(e.target.value)}
                    placeholder="Add speaker name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSpeaker()
                      }
                    }}
                  />
                  <Button type="button" onClick={addSpeaker} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.speakers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.speakers.map((speaker, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {speaker}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpeaker(speaker)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-deep-brand">Tags (Optional)</h2>

                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
