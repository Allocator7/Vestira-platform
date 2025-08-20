"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, X, Plus, Users, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadInsightModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: string
}

export function UploadInsightModal({ open, onOpenChange, userRole }: UploadInsightModalProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assetClass: "",
    strategy: "",
    type: "",
    tags: [] as string[],
    readTime: "",
    file: null as File | null,
    visibility: "public" as "public" | "selective",
    selectedManagers: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  // Mock manager data for selection
  const availableManagers = [
    { id: "1", name: "Global Infrastructure Partners", contact: "Sarah Chen" },
    { id: "2", name: "Quantum Capital Partners", contact: "Robert Chen" },
    { id: "3", name: "Venture Dynamics", contact: "Jennifer Park" },
    { id: "4", name: "Fixed Income Strategies", contact: "Robert Williams" },
    { id: "5", name: "Strategic Investment Advisors", contact: "Lisa Thompson" },
    { id: "6", name: "Event Management Solutions", contact: "Emily Zhang" },
  ]

  const assetClasses = [
    "Public Equities",
    "Public Fixed Income",
    "Private Equity & Other Alternatives",
    "Real Estate",
    "Hedge Funds",
    "Infrastructure",
    "Natural Resources",
    "Cash & Cash Equivalents",
  ]

  const insightTypes = [
    { value: "research", label: "Research Report" },
    { value: "market-update", label: "Market Update" },
    { value: "outlook", label: "Market Outlook" },
    { value: "analysis", label: "Analysis" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, file })
      // Force re-render to ensure file display updates
      setTimeout(() => {
        setFormData(prev => ({ ...prev, file }))
      }, 100)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleManagerSelection = (managerId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        selectedManagers: [...formData.selectedManagers, managerId],
      })
    } else {
      setFormData({
        ...formData,
        selectedManagers: formData.selectedManagers.filter(id => id !== managerId),
      })
    }
  }

  const handleSelectAllManagers = (checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        selectedManagers: availableManagers.map(manager => manager.id),
      })
    } else {
      setFormData({
        ...formData,
        selectedManagers: [],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Validate manager selection if visibility is selective
      if (formData.visibility === "selective" && formData.selectedManagers.length === 0) {
        toast({
          title: "Manager selection required",
          description: "Please select at least one manager to share with.",
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }

      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const visibilityMessage = formData.visibility === "public" 
        ? "Your market insight has been uploaded and is now available to the community."
        : `Your market insight has been shared with ${formData.selectedManagers.length} selected manager(s).`

      toast({
        title: "Insight uploaded successfully",
        description: visibilityMessage,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        assetClass: "",
        strategy: "",
        type: "",
        tags: [],
        readTime: "",
        file: null,
        visibility: "public",
        selectedManagers: [],
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your insight. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-deep-brand">Upload Market Insight</DialogTitle>
          <DialogDescription>Share your market research and insights with the Vestira community.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter insight title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a brief description of your insight"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetClass">Asset Class *</Label>
              <Select
                value={formData.assetClass}
                onValueChange={(value) => setFormData({ ...formData, assetClass: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset class" />
                </SelectTrigger>
                <SelectContent>
                  {assetClasses.map((assetClass) => (
                    <SelectItem key={assetClass} value={assetClass}>
                      {assetClass}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Insight Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {insightTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Input
                id="strategy"
                value={formData.strategy}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                placeholder="e.g., Private Equity, ESG Equity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Estimated Read Time</Label>
              <Input
                id="readTime"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="e.g., 5 min, 10 min"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" onClick={addTag} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Visibility *</Label>
              <RadioGroup
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value as "public" | "selective" })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Post Publicly on Vestira
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selective" id="selective" />
                  <Label htmlFor="selective" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Share with Select Managers
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.visibility === "selective" && (
              <div className="space-y-2">
                <Label>Select Managers *</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-managers"
                      checked={formData.selectedManagers.length === availableManagers.length}
                      onCheckedChange={handleSelectAllManagers}
                    />
                    <Label htmlFor="select-all-managers" className="font-medium">Select All Managers</Label>
                  </div>
                  <div className="border-t pt-2">
                    {availableManagers.map((manager) => (
                      <div key={manager.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`manager-${manager.id}`}
                          checked={formData.selectedManagers.includes(manager.id)}
                          onCheckedChange={(checked) => handleManagerSelection(manager.id, checked as boolean)}
                        />
                        <Label htmlFor={`manager-${manager.id}`} className="text-sm">
                          {manager.contact} at {manager.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, PPT, PPTX (max 10MB)</p>
              </label>
            </div>
            
            {/* Show uploaded file with preview/download options */}
            {formData.file && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-deep-brand">{formData.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = URL.createObjectURL(formData.file!)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = formData.file!.name
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = URL.createObjectURL(formData.file!)
                        window.open(url, '_blank')
                        URL.revokeObjectURL(url)
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="bg-electric-blue hover:bg-electric-blue/90">
              {isUploading ? "Uploading..." : "Upload Insight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
