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
import { UserPlus, Building, Mail, Phone, MapPin, Globe } from "lucide-react"

interface InviteMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemberInvited: (member: any) => void
}

export function InviteMemberModal({ open, onOpenChange, onMemberInvited }: InviteMemberModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    organizationType: "",
    location: "",
    website: "",
    aum: "",
    specializations: [] as string[],
    membershipTier: "standard",
    inviteMessage: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const organizationTypes = [
    "Public Pension",
    "Private Pension",
    "Insurance Company",
    "Private Equity",
    "Hedge Fund",
    "Asset Manager",
    "Investment Consultant",
    "Family Office",
    "Endowment",
    "Foundation",
    "Sovereign Wealth Fund",
  ]

  const specializationOptions = [
    "Public Equity",
    "Private Equity",
    "Fixed Income",
    "Real Estate",
    "Infrastructure",
    "Hedge Funds",
    "Private Credit",
    "Commodities",
    "ESG/Sustainable Investing",
    "Alternatives",
    "Multi-Asset",
    "Risk Management",
  ]

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, specialization],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        specializations: prev.specializations.filter((s) => s !== specialization),
      }))
    }
  }

  const handleSubmit = async () => {
    if (!formData.organizationName || !formData.contactName || !formData.contactEmail || !formData.organizationType) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newMember = {
      id: Date.now().toString(),
      name: formData.organizationName,
      type: formData.organizationType,
      contactPerson: formData.contactName,
      email: formData.contactEmail,
      phone: formData.contactPhone,
      location: formData.location,
      website: formData.website,
      aum: formData.aum,
      specializations: formData.specializations,
      memberSince: new Date().getFullYear().toString(),
      status: "pending",
      membershipTier: formData.membershipTier,
    }

    onMemberInvited(newMember)

    toast({
      title: "Invitation Sent Successfully",
      description: `Invitation sent to ${formData.contactName} at ${formData.organizationName}`,
    })

    setIsLoading(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      organizationName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      organizationType: "",
      location: "",
      website: "",
      aum: "",
      specializations: [],
      membershipTier: "standard",
      inviteMessage: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New Member Organization
          </DialogTitle>
          <DialogDescription>Send an invitation to a new organization to join your industry group</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Organization Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  placeholder="Enter organization name"
                  value={formData.organizationName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, organizationName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgType">Organization Type *</Label>
                <Select
                  value={formData.organizationType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, organizationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="website"
                    placeholder="www.organization.com"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aum">Assets Under Management</Label>
                <Input
                  id="aum"
                  placeholder="e.g., $500M, $2.5B"
                  value={formData.aum}
                  onChange={(e) => setFormData((prev) => ({ ...prev, aum: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="membershipTier">Membership Tier</Label>
                <Select
                  value={formData.membershipTier}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, membershipTier: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Member</SelectItem>
                    <SelectItem value="premium">Premium Member</SelectItem>
                    <SelectItem value="platinum">Platinum Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Primary Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  placeholder="Primary contact person"
                  value={formData.contactName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@organization.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="contactPhone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Investment Specializations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {specializationOptions.map((specialization) => (
                <div key={specialization} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialization}
                    checked={formData.specializations.includes(specialization)}
                    onCheckedChange={(checked) => handleSpecializationChange(specialization, checked as boolean)}
                  />
                  <label htmlFor={specialization} className="text-sm cursor-pointer">
                    {specialization}
                  </label>
                </div>
              ))}
            </div>
            {formData.specializations.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Invitation Message */}
          <div className="space-y-2">
            <Label htmlFor="inviteMessage">Personal Invitation Message</Label>
            <Textarea
              id="inviteMessage"
              placeholder="Add a personal message to the invitation..."
              value={formData.inviteMessage}
              onChange={(e) => setFormData((prev) => ({ ...prev, inviteMessage: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Invitation Preview</h4>
            <div className="text-sm space-y-1">
              <div>
                <strong>To:</strong> {formData.contactName || "Contact Name"} at{" "}
                {formData.organizationName || "Organization"}
              </div>
              <div>
                <strong>Email:</strong> {formData.contactEmail || "contact@organization.com"}
              </div>
              <div>
                <strong>Membership Tier:</strong> {formData.membershipTier}
              </div>
              <div>
                <strong>Specializations:</strong> {formData.specializations.length} selected
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
