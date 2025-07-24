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
import { Plus, X, Upload, Save, User, Briefcase, Settings, ArrowLeft, Target, GraduationCap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Add import statement
import { AllFocusAreas } from "@/lib/taxonomy"

export default function AllocatorEditProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)

  // Allocator-specific profile state
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    title: "Investment Director",
    bio: "Experienced investment professional with 15+ years in pension fund management, specializing in alternative investments and ESG integration.",
    email: "sarah.j@stpension.gov",
    phone: "+1 (617) 555-0123",
    location: "Boston, MA",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    website: "",
    avatar: "/placeholder-user.jpg",
    organization: "State Teachers Pension",
    organizationType: "public-pension",
    aum: "$45B",
    yearsAtOrganization: 8,
    department: "Alternative Investments",
    investmentFocus: AllFocusAreas.slice(0, 3), // Use initial values from taxonomy
    allocationTargets: {
      privateEquity: 25,
      realEstate: 15,
      infrastructure: 10,
      publicEquity: 35,
      fixedIncome: 15,
    },
    riskTolerance: "moderate",
    investmentHorizon: "long-term",
    esgFocus: true,
    previousRoles: [
      {
        id: "1",
        title: "Senior Investment Analyst",
        organization: "State Teachers Pension",
        startDate: "2016",
        endDate: "2020",
        description: "Led due diligence on private equity and real estate investments.",
      },
    ],
    education: [
      {
        id: "1",
        degree: "MBA",
        school: "Harvard Business School",
        year: "2012",
        field: "Finance",
      },
    ],
    certifications: [{ id: "1", name: "CFA Charter", issuer: "CFA Institute", year: "2014" }],
    recentActivity: [
      {
        id: "1",
        activity: "Reviewed Q4 portfolio performance",
        date: "2024-01-15",
        type: "Analysis",
        description: "Comprehensive review of portfolio performance across all asset classes.",
      },
    ],
    privacy: {
      showEmail: true,
      showPhone: false,
      showLinkedIn: true,
      showInvestmentFocus: true,
      profileVisibility: "connections",
      showTrackRecord: true,
    },
    sectorFocus: ["Technology", "Healthcare", "Renewable Energy"],
    checkSize: "$25M - $100M",
    geographicFocus: ["North America", "Europe"],
    investmentStage: ["Early Stage", "Growth"],
    trackRecord: [
      { id: "1", metric: "IRR", value: "15%", period: "5 Years" },
      { id: "2", metric: "TVPI", value: "2.1x", period: "5 Years" },
    ],
  })

  const [showAddExperience, setShowAddExperience] = useState(false)
  const [showAddEducation, setShowAddEducation] = useState(false)
  const [showAddCertification, setShowAddCertification] = useState(false)
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

  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    year: "",
  })

  const [newActivity, setNewActivity] = useState({
    activity: "",
    date: "",
    type: "",
    description: "",
  })

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

  const addCertification = () => {
    if (!newCertification.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a certification name.",
        variant: "destructive",
      })
      return
    }

    if (!newCertification.issuer.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter an issuing organization.",
        variant: "destructive",
      })
      return
    }

    setProfile({
      ...profile,
      certifications: [...(profile.certifications || []), { ...newCertification, id: Date.now().toString() }],
    })
    setNewCertification({ name: "", issuer: "", year: "" })
    setShowAddCertification(false)

    toast({
      title: "Certification added",
      description: "Certification has been added to your profile.",
    })
  }

  const removeCertification = (id: string) => {
    if (window.confirm("Are you sure you want to remove this certification?")) {
      setProfile({
        ...profile,
        certifications: (profile.certifications || []).filter((cert) => cert.id !== id),
      })
      toast({
        title: "Certification removed",
        description: "Certification has been removed from your profile.",
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

  const handleSave = () => {
    setIsLoading(true)
    // Simulate save operation
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile Saved",
        description: "Your profile has been successfully saved.",
      })
    }, 2000)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) })
    }
  }

  const removeInvestmentFocus = (focus: string) => {
    setProfile({
      ...profile,
      investmentFocus: profile.investmentFocus.filter((f) => f !== focus),
    })
  }

  // Update the addInvestmentFocus function
  const addInvestmentFocus = (value: string) => {
    if (!profile.investmentFocus.includes(value) && AllFocusAreas.includes(value)) {
      setProfile({
        ...profile,
        investmentFocus: [...profile.investmentFocus, value],
      })
    }
  }

  const removeSectorFocus = (sector: string) => {
    setProfile({
      ...profile,
      sectorFocus: profile.sectorFocus.filter((s) => s !== sector),
    })
  }

  const addSectorFocus = (value: string) => {
    if (!profile.sectorFocus.includes(value) && AllFocusAreas.includes(value)) {
      setProfile({
        ...profile,
        sectorFocus: [...profile.sectorFocus, value],
      })
    }
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
              <h1 className="text-3xl font-semibold text-deepBrand">Edit Allocator Profile</h1>
              <p className="text-baseGray mt-1">Manage your investment professional profile</p>
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
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="investment" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Investment Focus
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
                    placeholder="Describe your investment experience and expertise..."
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>Details about your current organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization Name</Label>
                    <Input
                      id="organization"
                      value={profile.organization}
                      onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type</Label>
                    <Select
                      value={profile.organizationType}
                      onValueChange={(value) => setProfile({ ...profile, organizationType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public-pension">Public Pension</SelectItem>
                        <SelectItem value="corporate-pension">Corporate Pension</SelectItem>
                        <SelectItem value="endowment">Endowment</SelectItem>
                        <SelectItem value="foundation">Foundation</SelectItem>
                        <SelectItem value="family-office">Family Office</SelectItem>
                        <SelectItem value="insurance">Insurance Company</SelectItem>
                        <SelectItem value="sovereign-wealth">Sovereign Wealth Fund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aum">Assets Under Management</Label>
                    <Input
                      id="aum"
                      value={profile.aum}
                      onChange={(e) => setProfile({ ...profile, aum: e.target.value })}
                      placeholder="e.g., $45B"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsAtOrganization">Years at Organization</Label>
                    <Input
                      id="yearsAtOrganization"
                      type="number"
                      value={profile.yearsAtOrganization}
                      onChange={(e) => setProfile({ ...profile, yearsAtOrganization: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    />
                  </div>
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

          {/* Education & Certifications Tab */}
          <TabsContent value="education" className="space-y-6">
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
                        <Label htmlFor="certName">Certification Name *</Label>
                        <Input
                          id="certName"
                          value={newCertification.name}
                          onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                          placeholder="e.g., CFA Charter, CAIA"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certIssuer">Issuing Organization *</Label>
                        <Input
                          id="certIssuer"
                          value={newCertification.issuer}
                          onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                          placeholder="e.g., CFA Institute"
                          required
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
                  {(profile.certifications || []).map((cert) => (
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
                            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
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

          {/* Investment Focus Tab */}
          <TabsContent value="investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sector Focus</CardTitle>
                <CardDescription>Industry sectors you focus on for investments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.sectorFocus.map((sector) => (
                    <Badge key={sector} variant="secondary" className="flex items-center gap-1">
                      {sector}
                      <button onClick={() => removeSectorFocus(sector)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select onValueChange={addSectorFocus}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Add sector focus..." />
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
                <CardTitle>Investment Parameters</CardTitle>
                <CardDescription>Your investment criteria and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkSize">Typical Check Size</Label>
                    <Input
                      id="checkSize"
                      value={profile.checkSize}
                      onChange={(e) => setProfile({ ...profile, checkSize: e.target.value })}
                      placeholder="e.g., $25M - $100M"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Geographic Focus</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["North America", "Europe", "Asia", "Global"].map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={region}
                            checked={profile.geographicFocus.includes(region)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProfile({
                                  ...profile,
                                  geographicFocus: [...profile.geographicFocus, region],
                                })
                              } else {
                                setProfile({
                                  ...profile,
                                  geographicFocus: profile.geographicFocus.filter((item) => item !== region),
                                })
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={region} className="text-sm">
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Investment Stage</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Seed", "Early Stage", "Growth", "Buyout", "Distressed"].map((stage) => (
                      <div key={stage} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={stage}
                          checked={profile.investmentStage.includes(stage)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfile({
                                ...profile,
                                investmentStage: [...profile.investmentStage, stage],
                              })
                            } else {
                              setProfile({
                                ...profile,
                                investmentStage: profile.investmentStage.filter((item) => item !== stage),
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={stage} className="text-sm">
                          {stage}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Track Record Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Track Record</CardTitle>
                <CardDescription>Your investment performance metrics (optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {profile.trackRecord.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Metric</Label>
                          <Input
                            value={record.metric}
                            onChange={(e) => {
                              const updated = profile.trackRecord.map((r) =>
                                r.id === record.id ? { ...r, metric: e.target.value } : r,
                              )
                              setProfile({ ...profile, trackRecord: updated })
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Value</Label>
                          <Input
                            value={record.value}
                            onChange={(e) => {
                              const updated = profile.trackRecord.map((r) =>
                                r.id === record.id ? { ...r, value: e.target.value } : r,
                              )
                              setProfile({ ...profile, trackRecord: updated })
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Period</Label>
                          <Input
                            value={record.period}
                            onChange={(e) => {
                              const updated = profile.trackRecord.map((r) =>
                                r.id === record.id ? { ...r, period: e.target.value } : r,
                              )
                              setProfile({ ...profile, trackRecord: updated })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-baseGray">
                  Track record information is optional and will only be visible based on your privacy settings.
                </p>
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
                      <span>Investment Focus Areas</span>
                      <Switch
                        checked={profile.privacy.showInvestmentFocus}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            privacy: { ...profile.privacy, showInvestmentFocus: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Track Record</span>
                      <Switch
                        checked={profile.privacy.showTrackRecord}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            privacy: { ...profile.privacy, showTrackRecord: checked },
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
