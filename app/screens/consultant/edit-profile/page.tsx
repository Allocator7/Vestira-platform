"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, X, Upload, Save, User, Briefcase, Settings, ArrowLeft, Target, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Add import statement
import { AllFocusAreas } from "@/lib/taxonomy"

export default function ConsultantEditProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)

  // Add these state variables:
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [showAddEducation, setShowAddEducation] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)

  // Add these form state variables:
  const [newExperience, setNewExperience] = useState({
    title: "",
    organization: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const [newEducation, setNewEducation] = useState({
    degree: "",
    school: "",
    year: "",
    field: "",
  })

  const [newActivity, setNewActivity] = useState({
    activity: "",
    date: "",
    type: "",
    description: "",
  })

  // Consultant-specific profile state
  const [profile, setProfile] = useState({
    firstName: "Michael",
    lastName: "Chen",
    title: "Senior Investment Consultant",
    bio: "Investment consultant with 12+ years of experience advising institutional investors on alternative investment strategies and manager selection.",
    email: "m.chen@advisorycorp.com",
    phone: "+1 (212) 555-0156",
    location: "New York, NY",
    linkedin: "https://linkedin.com/in/michaelchen",
    website: "https://advisorycorp.com/team/michael-chen",
    avatar: "/placeholder-user.jpg",
    firm: "Advisory Corp",
    firmType: "investment-consultant",
    yearsAtFirm: 5,
    totalExperience: 12,
    clientTypes: ["Public Pension", "Corporate Pension", "Endowment", "Foundation"],
    // Update the specializations state
    specializations: AllFocusAreas.slice(0, 3), // Use initial values from taxonomy
    certifications: [
      { id: "1", name: "CFA Charter", issuer: "CFA Institute", year: "2015" },
      { id: "2", name: "CAIA", issuer: "CAIA Association", year: "2017" },
    ],
    serviceAreas: ["Investment Strategy", "Manager Research", "Portfolio Analytics", "Risk Management"],
    clientAUM: "$25B+",
    // Add these missing arrays:
    previousRoles: [
      {
        id: "1",
        title: "Investment Consultant",
        organization: "Advisory Corp",
        startDate: "2019",
        endDate: "Present",
        description: "Advise institutional clients on investment strategy and manager selection.",
      },
    ],
    education: [
      {
        id: "1",
        degree: "MBA",
        school: "Wharton School",
        year: "2012",
        field: "Finance",
      },
    ],
    recentActivity: [
      {
        id: "1",
        activity: "Completed manager research on emerging markets",
        date: "2024-01-20",
        type: "Research",
        description: "Comprehensive analysis of emerging market equity managers.",
      },
    ],
    privacy: {
      showEmail: true,
      showPhone: false,
      showLinkedIn: true,
      showClientTypes: true,
      showSpecializations: true,
      profileVisibility: "connections",
    },
  })

  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    year: "",
  })
  const [showAddCertification, setShowAddCertification] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Validation
      if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.email.trim()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profile.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your consultant profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Simulate upload
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfile({ ...profile, avatar: e.target?.result as string })
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated.",
      })
    }
    reader.readAsDataURL(file)
  }

  // Update the addSpecialization function
  const addSpecialization = (spec: string) => {
    if (spec.trim() && !profile.specializations.includes(spec.trim()) && AllFocusAreas.includes(spec.trim())) {
      setProfile({
        ...profile,
        specializations: [...profile.specializations, spec.trim()],
      })
    }
  }

  const removeSpecialization = (spec: string) => {
    setProfile({
      ...profile,
      specializations: profile.specializations.filter((item) => item !== spec),
    })
  }

  const addServiceArea = (area: string) => {
    if (area.trim() && !profile.serviceAreas.includes(area.trim())) {
      setProfile({
        ...profile,
        serviceAreas: [...profile.serviceAreas, area.trim()],
      })
    }
  }

  const removeServiceArea = (area: string) => {
    setProfile({
      ...profile,
      serviceAreas: profile.serviceAreas.filter((item) => item !== area),
    })
  }

  const addCertification = () => {
    if (!newCertification.name.trim() || !newCertification.issuer.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter certification name and issuer.",
        variant: "destructive",
      })
      return
    }

    setProfile({
      ...profile,
      certifications: [...profile.certifications, { ...newCertification, id: Date.now().toString() }],
    })
    setNewCertification({ name: "", issuer: "", year: "" })
    setShowAddCertification(false)

    toast({
      title: "Certification added",
      description: "Professional certification has been added to your profile.",
    })
  }

  const removeCertification = (id: string) => {
    if (window.confirm("Are you sure you want to remove this certification?")) {
      setProfile({
        ...profile,
        certifications: profile.certifications.filter((cert) => cert.id !== id),
      })
      toast({
        title: "Certification removed",
        description: "Professional certification has been removed from your profile.",
      })
    }
  }

  const addExperience = () => {
    if (!newExperience.title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a job title.",
        variant: "destructive",
      })
      return
    }

    if (!newExperience.organization.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter an organization name.",
        variant: "destructive",
      })
      return
    }

    setProfile({
      ...profile,
      previousRoles: [...(profile.previousRoles || []), { ...newExperience, id: Date.now().toString() }],
    })
    setNewExperience({ title: "", organization: "", startDate: "", endDate: "", description: "" })
    setShowAddExperience(false)

    toast({
      title: "Experience added",
      description: "Professional experience has been added to your profile.",
    })
  }

  const removeExperience = (id: string) => {
    if (window.confirm("Are you sure you want to remove this experience?")) {
      setProfile({
        ...profile,
        previousRoles: (profile.previousRoles || []).filter((role) => role.id !== id),
      })
      toast({
        title: "Experience removed",
        description: "Professional experience has been removed from your profile.",
      })
    }
  }

  const addEducation = () => {
    if (!newEducation.degree.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a degree.",
        variant: "destructive",
      })
      return
    }

    if (!newEducation.school.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a school/university.",
        variant: "destructive",
      })
      return
    }

    setProfile({
      ...profile,
      education: [...(profile.education || []), { ...newEducation, id: Date.now().toString() }],
    })
    setNewEducation({ degree: "", school: "", year: "", field: "" })
    setShowAddEducation(false)

    toast({
      title: "Education added",
      description: "Education has been added to your profile.",
    })
  }

  const removeEducation = (id: string) => {
    if (window.confirm("Are you sure you want to remove this education?")) {
      setProfile({
        ...profile,
        education: (profile.education || []).filter((edu) => edu.id !== id),
      })
      toast({
        title: "Education removed",
        description: "Education has been removed from your profile.",
      })
    }
  }

  const addActivity = () => {
    if (!newActivity.activity.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter an activity description.",
        variant: "destructive",
      })
      return
    }

    if (!newActivity.date.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a date.",
        variant: "destructive",
      })
      return
    }

    setProfile({
      ...profile,
      recentActivity: [...(profile.recentActivity || []), { ...newActivity, id: Date.now().toString() }],
    })
    setNewActivity({ activity: "", date: "", type: "", description: "" })
    setShowAddActivity(false)

    toast({
      title: "Activity added",
      description: "Recent activity has been added to your profile.",
    })
  }

  const removeActivity = (id: string) => {
    setProfile({
      ...profile,
      recentActivity: (profile.recentActivity || []).filter((activity) => activity.id !== id),
    })
  }

  return (
    <Screen>
      <div className="container py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-deepBrand">Edit Consultant Profile</h1>
              <p className="text-baseGray mt-1">Manage your investment consulting profile</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isLoading} className="bg-electric-blue hover:bg-electric-blue/90">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="expertise" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Expertise
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Client Focus
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profile.avatar || "/placeholder.svg"}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback className="text-xl">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button variant="outline" className="mb-2 bg-transparent" asChild>
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </label>
                    </Button>
                    <p className="text-sm text-baseGray">JPG, PNG or GIF. Max size 5MB.</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Describe your consulting experience and expertise..."
                  />
                  <p className="text-sm text-baseGray">{profile.bio.length}/500 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="City, State/Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Professional Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://yourfirm.com/team/yourname"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Firm Information</CardTitle>
                <CardDescription>Details about your consulting firm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firm">Firm Name</Label>
                    <Input
                      id="firm"
                      value={profile.firm}
                      onChange={(e) => setProfile({ ...profile, firm: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firmType">Firm Type</Label>
                    <Select
                      value={profile.firmType}
                      onValueChange={(value) => setProfile({ ...profile, firmType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investment-consultant">Investment Consultant</SelectItem>
                        <SelectItem value="ocio">OCIO Provider</SelectItem>
                        <SelectItem value="advisory-firm">Advisory Firm</SelectItem>
                        <SelectItem value="wealth-management">Wealth Management</SelectItem>
                        <SelectItem value="independent">Independent Consultant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsAtFirm">Years at Current Firm</Label>
                    <Input
                      id="yearsAtFirm"
                      type="number"
                      value={profile.yearsAtFirm}
                      onChange={(e) => setProfile({ ...profile, yearsAtFirm: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalExperience">Total Experience (Years)</Label>
                    <Input
                      id="totalExperience"
                      type="number"
                      value={profile.totalExperience}
                      onChange={(e) => setProfile({ ...profile, totalExperience: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientAUM">Client AUM</Label>
                    <Input
                      id="clientAUM"
                      value={profile.clientAUM}
                      onChange={(e) => setProfile({ ...profile, clientAUM: e.target.value })}
                      placeholder="e.g., $25B+"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Professional certifications and licenses</CardDescription>
                </div>
                <Dialog open={showAddCertification} onOpenChange={setShowAddCertification}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Certification</DialogTitle>
                      <DialogDescription>Add a professional certification or license</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="certName">Certification Name</Label>
                        <Input
                          id="certName"
                          value={newCertification.name}
                          onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                          placeholder="e.g., CFA Charter, CAIA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certIssuer">Issuing Organization</Label>
                        <Input
                          id="certIssuer"
                          value={newCertification.issuer}
                          onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                          placeholder="e.g., CFA Institute"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certYear">Year Obtained</Label>
                        <Input
                          id="certYear"
                          value={newCertification.year}
                          onChange={(e) => setNewCertification({ ...newCertification, year: e.target.value })}
                          placeholder="YYYY"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddCertification(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addCertification}>Add Certification</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-deepBrand">{cert.name}</h4>
                          <p className="text-baseGray">{cert.issuer}</p>
                          <p className="text-sm text-baseGray">{cert.year}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Previous Experience</CardTitle>
                  <CardDescription>Your professional work history</CardDescription>
                </div>
                <Dialog open={showAddExperience} onOpenChange={setShowAddExperience}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Professional Experience</DialogTitle>
                      <DialogDescription>Add a previous role to your professional history</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="expTitle">Job Title *</Label>
                        <Input
                          id="expTitle"
                          value={newExperience.title}
                          onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expOrganization">Organization *</Label>
                        <Input
                          id="expOrganization"
                          value={newExperience.organization}
                          onChange={(e) => setNewExperience({ ...newExperience, organization: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expStartDate">Start Date</Label>
                          <Input
                            id="expStartDate"
                            value={newExperience.startDate}
                            onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                            placeholder="YYYY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expEndDate">End Date</Label>
                          <Input
                            id="expEndDate"
                            value={newExperience.endDate}
                            onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                            placeholder="YYYY or 'Present'"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expDescription">Description</Label>
                        <Textarea
                          id="expDescription"
                          value={newExperience.description}
                          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddExperience(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addExperience}>Add Experience</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(profile.previousRoles || []).map((role) => (
                    <div key={role.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-deepBrand">{role.title}</h4>
                          <p className="text-baseGray">{role.organization}</p>
                          <p className="text-sm text-baseGray">
                            {role.startDate} - {role.endDate}
                          </p>
                          {role.description && <p className="text-sm mt-2">{role.description}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(role.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
                <CardDescription>Your areas of consulting expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                      {spec}
                      <button onClick={() => removeSpecialization(spec)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select onValueChange={addSpecialization}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Add specialization..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AllFocusAreas.map((focus) => (
                        <SelectItem key={focus} value={focus}>
                          {focus}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Areas</CardTitle>
                <CardDescription>Services you provide to clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.serviceAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="flex items-center gap-1">
                      {area}
                      <button onClick={() => removeServiceArea(area)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select onValueChange={addServiceArea}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Add service area..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Investment Strategy">Investment Strategy</SelectItem>
                      <SelectItem value="Manager Research">Manager Research</SelectItem>
                      <SelectItem value="Portfolio Analytics">Portfolio Analytics</SelectItem>
                      <SelectItem value="Risk Management">Risk Management</SelectItem>
                      <SelectItem value="Performance Reporting">Performance Reporting</SelectItem>
                      <SelectItem value="Governance Advisory">Governance Advisory</SelectItem>
                      <SelectItem value="OCIO Services">OCIO Services</SelectItem>
                      <SelectItem value="Training & Education">Training & Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your educational background</CardDescription>
                </div>
                <Dialog open={showAddEducation} onOpenChange={setShowAddEducation}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Education</DialogTitle>
                      <DialogDescription>Add your educational background</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree *</Label>
                        <Input
                          id="degree"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                          placeholder="e.g., MBA, Bachelor of Science"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school">School/University *</Label>
                        <Input
                          id="school"
                          value={newEducation.school}
                          onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="field">Field of Study</Label>
                          <Input
                            id="field"
                            value={newEducation.field}
                            onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                            placeholder="e.g., Finance, Economics"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">Graduation Year</Label>
                          <Input
                            id="year"
                            value={newEducation.year}
                            onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                            placeholder="YYYY"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddEducation(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addEducation}>Add Education</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(profile.education || []).map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-deepBrand">{edu.degree}</h4>
                          <p className="text-baseGray">{edu.school}</p>
                          <p className="text-sm text-baseGray">
                            {edu.field} • {edu.year}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Share your recent professional activities and achievements</CardDescription>
                </div>
                <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Recent Activity</DialogTitle>
                      <DialogDescription>Share a recent professional activity or achievement</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="activityTitle">Activity *</Label>
                        <Input
                          id="activityTitle"
                          value={newActivity.activity}
                          onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
                          placeholder="e.g., Published research report on ESG investing"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="activityDate">Date *</Label>
                          <Input
                            id="activityDate"
                            type="date"
                            value={newActivity.date}
                            onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="activityType">Type</Label>
                          <Select
                            value={newActivity.type}
                            onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Analysis">Analysis</SelectItem>
                              <SelectItem value="Meeting">Meeting</SelectItem>
                              <SelectItem value="Research">Research</SelectItem>
                              <SelectItem value="Investment">Investment</SelectItem>
                              <SelectItem value="Speaking">Speaking</SelectItem>
                              <SelectItem value="Publication">Publication</SelectItem>
                              <SelectItem value="Award">Award</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activityDescription">Description (Optional)</Label>
                        <Textarea
                          id="activityDescription"
                          value={newActivity.description}
                          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                          placeholder="Provide additional details about this activity..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddActivity(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addActivity}>Add Activity</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(profile.recentActivity || []).map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-deepBrand">{activity.activity}</h4>
                          <div className="flex items-center gap-2 text-sm text-baseGray mt-1">
                            <span>{activity.date}</span>
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                          {activity.description && <p className="text-sm mt-2">{activity.description}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActivity(activity.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Focus Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Types</CardTitle>
                <CardDescription>Types of institutional clients you serve</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Public Pension",
                    "Corporate Pension",
                    "Endowment",
                    "Foundation",
                    "Family Office",
                    "Insurance Company",
                    "Sovereign Wealth Fund",
                    "Healthcare System",
                    "Labor Union",
                  ].map((clientType) => (
                    <div key={clientType} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={clientType}
                        checked={profile.clientTypes.includes(clientType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProfile({
                              ...profile,
                              clientTypes: [...profile.clientTypes, clientType],
                            })
                          } else {
                            setProfile({
                              ...profile,
                              clientTypes: profile.clientTypes.filter((item) => item !== clientType),
                            })
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={clientType} className="text-sm">
                        {clientType}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Visibility</CardTitle>
                <CardDescription>Control who can see your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={profile.privacy.profileVisibility}
                    onValueChange={(value) =>
                      setProfile({
                        ...profile,
                        privacy: { ...profile.privacy, profileVisibility: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can view</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Private - Only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Information Visibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email Address</span>
                      <Switch
                        checked={profile.privacy.showEmail}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            privacy: { ...profile.privacy, showEmail: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Phone Number</span>
                      <Switch
                        checked={profile.privacy.showPhone}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            privacy: { ...profile.privacy, showPhone: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>LinkedIn Profile</span>
                      <Switch
                        checked={profile.privacy.showLinkedIn}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            privacy: { ...profile.privacy, showLinkedIn: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Client Types</span>
                      <Switch
                        checked={profile.privacy.showClientTypes}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            privacy: { ...profile.privacy, showClientTypes: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Specializations</span>
                      <Switch
                        checked={profile.privacy.showSpecializations}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            privacy: { ...profile.privacy, showSpecializations: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  )
}
