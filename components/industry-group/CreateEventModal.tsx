"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, MapPin, Users, DollarSign, Tag, UserPlus, X, Plus, Globe, Building } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form state
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
    virtualLink: "",
    capacity: "",
    registrationFee: "",
    requiresApproval: false,
    speakers: [] as string[],
    tags: [] as string[],
  })

  const [newSpeaker, setNewSpeaker] = useState("")
  const [newTag, setNewTag] = useState("")

  const eventTypes = [
    "Conference",
    "Workshop",
    "Webinar",
    "Networking Event",
    "Symposium",
    "Panel Discussion",
    "Training Session",
    "Social Event"
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSpeaker = () => {
    if (newSpeaker.trim() && !formData.speakers.includes(newSpeaker.trim())) {
      setFormData(prev => ({
        ...prev,
        speakers: [...prev.speakers, newSpeaker.trim()]
      }))
      setNewSpeaker("")
    }
  }

  const removeSpeaker = (speaker: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(s => s !== speaker)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Draft Saved",
        description: "Your event has been saved as a draft.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "Event Published",
        description: "Your event has been published successfully.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
      isVirtual: false,
      location: "",
      virtualLink: "",
      capacity: "",
      registrationFee: "",
      requiresApproval: false,
      speakers: [],
      tags: [],
    })
    setCurrentStep(1)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-deep-brand">
            Create New Event
          </DialogTitle>
          <p className="text-sm text-base-gray">
            Create a new conference, webinar, workshop, or networking event for your members.
          </p>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-deep-brand">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-electric-blue" />
                <h3 className="text-lg font-medium text-deep-brand">Date & Time</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
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
                        onSelect={(date) => handleInputChange("startDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
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
                        onSelect={(date) => handleInputChange("endDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-electric-blue" />
                <h3 className="text-lg font-medium text-deep-brand">Location</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="virtual"
                  checked={formData.isVirtual}
                  onCheckedChange={(checked) => handleInputChange("isVirtual", checked)}
                />
                <Label htmlFor="virtual" className="flex items-center gap-2">
                  {formData.isVirtual ? <Globe className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                  {formData.isVirtual ? "Virtual Event" : "In-Person Event"}
                </Label>
              </div>

              {formData.isVirtual ? (
                <div className="space-y-2">
                  <Label htmlFor="virtualLink">Virtual Meeting Link</Label>
                  <Input
                    id="virtualLink"
                    placeholder="https://zoom.us/j/..."
                    value={formData.virtualLink}
                    onChange={(e) => handleInputChange("virtualLink", e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="location">Venue Address</Label>
                  <Input
                    id="location"
                    placeholder="Enter venue address"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-electric-blue" />
                <h3 className="text-lg font-medium text-deep-brand">Registration</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Maximum Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fee">Registration Fee ($)</Label>
                  <Input
                    id="fee"
                    type="number"
                    placeholder="0.00"
                    value={formData.registrationFee}
                    onChange={(e) => handleInputChange("registrationFee", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="approval"
                  checked={formData.requiresApproval}
                  onCheckedChange={(checked) => handleInputChange("requiresApproval", checked)}
                />
                <Label htmlFor="approval">Require approval for registration</Label>
              </div>
            </CardContent>
          </Card>

          {/* Speakers (Optional) */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-electric-blue" />
                <h3 className="text-lg font-medium text-deep-brand">Speakers (Optional)</h3>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add speaker name"
                  value={newSpeaker}
                  onChange={(e) => setNewSpeaker(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSpeaker()}
                />
                <Button type="button" onClick={addSpeaker} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.speakers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.speakers.map((speaker) => (
                    <Badge key={speaker} variant="secondary" className="flex items-center gap-1">
                      {speaker}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSpeaker(speaker)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags (Optional) */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-electric-blue" />
                <h3 className="text-lg font-medium text-deep-brand">Tags (Optional)</h3>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={isLoading}
            >
              Save Draft
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={isLoading || !formData.title || !formData.type}
              className="bg-electric-blue hover:bg-electric-blue/90"
            >
              {isLoading ? "Publishing..." : "Publish Event"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
