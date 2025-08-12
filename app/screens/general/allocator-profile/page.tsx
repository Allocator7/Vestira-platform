"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building,
  MapPin,
  Globe,
  TrendingUp,
  Mail,
  Phone,
  Share2,
  BarChart3,
  MessageSquare,
  CalendarDays,
  Download,
  FileText,
  CheckCircle2,
  Copy,
  Send,
  Calendar,
  Video,
  Clock,
  DollarSign,
  Users,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AllocatorProfilePage() {
  const searchParams = useSearchParams()
  const allocatorId = searchParams.get("id")
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Modal states
  const [showShareModal, setShowShareModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [showContactSelector, setShowContactSelector] = useState(false)
  const [selectedAction, setSelectedAction] = useState<'message' | 'schedule' | null>(null)

  // Share modal states
  const [shareEmail, setShareEmail] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  const [shareSuccess, setShareSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  // Message modal states
  const [messageSubject, setMessageSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messagePriority, setMessagePriority] = useState("normal")
  const [messageSuccess, setMessageSuccess] = useState(false)

  // Schedule modal states
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [meetingDuration, setMeetingDuration] = useState("60")
  const [meetingType, setMeetingType] = useState("video")
  const [meetingLocation, setMeetingLocation] = useState("")
  const [meetingAgenda, setMeetingAgenda] = useState("")
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  // Sample allocator profiles data - restructured to emphasize firm with contacts
  const allocatorProfiles = {
    1: {
      // Firm Information (Primary)
      firmName: "Sovereign Wealth Fund",
      organizationType: "Sovereign Wealth Fund",
      location: "Singapore",
      website: "https://swf.gov.sg",
      aum: "$320B",
      founded: "1974",
      yearsInBusiness: 50,
      focus: ["Alternative Assets", "Global Markets", "Long-term"],
      about:
        "Leading sovereign wealth fund focused on long-term value creation and sustainable investment strategies across global markets. With over 50 years of experience, we manage diverse portfolios across private equity, real estate, infrastructure, and hedge funds.",
      keyMetrics: {
        totalAllocations: "$320B",
        activeManagers: 150,
        portfolioCompanies: 500,
        geographicFocus: ["Global", "Asia-Pacific", "North America"],
      },
      allocationTargets: {
        alternatives: "40%",
        fixedIncome: "25%",
        publicEquity: "25%",
        realEstate: "10%",
      },
      // Individual Contacts (Secondary)
      contacts: [
        {
          id: "1",
          name: "Sarah Chen",
          title: "Chief Investment Officer",
          email: "sarah@swf.gov.sg",
          phone: "+65 6123 4567",
          avatar: "/placeholder-user.jpg",
          experience: "20 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Michael Torres",
          title: "Managing Director",
          email: "michael@swf.gov.sg",
          phone: "+65 6123 4568",
          avatar: "/placeholder-user.jpg",
          experience: "15 years",
          isPrimary: false,
        },
        {
          id: "3",
          name: "David Kim",
          title: "Senior Vice President",
          email: "david@swf.gov.sg",
          phone: "+65 6123 4569",
          avatar: "/placeholder-user.jpg",
          experience: "12 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-15",
          activity: "Committed $500M to Global Infrastructure Fund",
          type: "Investment",
        },
        {
          date: "2024-01-08",
          activity: "Completed ESG integration assessment",
          type: "Review",
        },
        {
          date: "2024-01-02",
          activity: "Board approved new alternative investment policy",
          type: "Policy",
        },
      ],
      investments: [
        {
          manager: "Global Infrastructure Partners",
          strategy: "Infrastructure Equity",
          commitment: "$500M",
          vintage: "2023",
          status: "Active",
        },
        {
          manager: "Real Estate Ventures",
          strategy: "Core Real Estate",
          commitment: "$300M",
          vintage: "2023",
          status: "Active",
        },
      ],
      documents: [
        {
          id: "doc1",
          name: "Investment Policy Statement",
          type: "Policy",
          category: "Investment Policy",
          size: "2.1 MB",
          lastModified: "2024-01-15",
          status: "Active",
        },
        {
          id: "doc2",
          name: "ESG Integration Report",
          type: "Report",
          category: "ESG",
          size: "1.8 MB",
          lastModified: "2024-01-10",
          status: "Active",
        },
      ],
    },
    2: {
      // Firm Information (Primary)
      firmName: "Global Pension Alliance",
      organizationType: "Pension Fund",
      location: "Toronto, CA",
      website: "https://gpa.ca",
      aum: "$180B",
      founded: "1965",
      yearsInBusiness: 58,
      focus: ["Private Markets & Real Assets"],
      about:
        "Multi-employer pension plan serving public sector employees with focus on liability-driven investment and risk management. We specialize in private equity, infrastructure, and real estate investments.",
      keyMetrics: {
        totalAllocations: "$180B",
        activeManagers: 85,
        portfolioCompanies: 300,
        geographicFocus: ["North America", "Europe"],
      },
      allocationTargets: {
        alternatives: "30%",
        fixedIncome: "40%",
        publicEquity: "20%",
        realEstate: "10%",
      },
      // Individual Contacts (Secondary)
      contacts: [
        {
          id: "1",
          name: "Jennifer Park",
          title: "Head of Alternatives",
          email: "jennifer@gpa.ca",
          phone: "+1 (416) 555-0123",
          avatar: "/placeholder-user.jpg",
          experience: "18 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Lisa Wang",
          title: "Portfolio Manager",
          email: "lisa@gpa.ca",
          phone: "+1 (416) 555-0124",
          avatar: "/placeholder-user.jpg",
          experience: "14 years",
          isPrimary: false,
        },
        {
          id: "3",
          name: "Robert Chen",
          title: "Investment Director",
          email: "robert@gpa.ca",
          phone: "+1 (416) 555-0125",
          avatar: "/placeholder-user.jpg",
          experience: "16 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-15",
          activity: "Committed $200M to Infrastructure Fund",
          type: "Investment",
        },
        {
          date: "2024-01-08",
          activity: "Completed risk assessment review",
          type: "Review",
        },
        {
          date: "2024-01-02",
          activity: "Board approved new real estate strategy",
          type: "Policy",
        },
      ],
      investments: [
        {
          manager: "Infrastructure Capital",
          strategy: "Infrastructure Debt",
          commitment: "$200M",
          vintage: "2023",
          status: "Active",
        },
        {
          manager: "Real Estate Partners",
          strategy: "Real Estate Equity",
          commitment: "$150M",
          vintage: "2023",
          status: "Active",
        },
      ],
      documents: [
        {
          id: "doc1",
          name: "Pension Fund Policy",
          type: "Policy",
          category: "Investment Policy",
          size: "1.9 MB",
          lastModified: "2024-01-15",
          status: "Active",
        },
        {
          id: "doc2",
          name: "Risk Assessment Report",
          type: "Report",
          category: "Risk Management",
          size: "2.3 MB",
          lastModified: "2024-01-10",
          status: "Active",
        },
      ],
    },
    3: {
      // Firm Information (Primary)
      firmName: "University Endowment Foundation",
      organizationType: "Endowment",
      location: "Boston, MA",
      website: "https://uef.edu",
      aum: "$45B",
      founded: "1636",
      yearsInBusiness: 387,
      focus: ["Alternative Investments"],
      about:
        "Prestigious university endowment with innovative investment approach and strong focus on venture capital and emerging managers. We have a long history of pioneering investment strategies.",
      keyMetrics: {
        totalAllocations: "$45B",
        activeManagers: 120,
        portfolioCompanies: 400,
        geographicFocus: ["Global", "North America"],
      },
      allocationTargets: {
        alternatives: "50%",
        fixedIncome: "15%",
        publicEquity: "25%",
        realEstate: "10%",
      },
      // Individual Contacts (Secondary)
      contacts: [
        {
          id: "1",
          name: "Alex Kim",
          title: "Chief Investment Officer",
          email: "alex@uef.edu",
          phone: "+1 (617) 555-0123",
          avatar: "/placeholder-user.jpg",
          experience: "22 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Maria Rodriguez",
          title: "Principal",
          email: "maria@uef.edu",
          phone: "+1 (617) 555-0124",
          avatar: "/placeholder-user.jpg",
          experience: "18 years",
          isPrimary: false,
        },
        {
          id: "3",
          name: "Thomas Mueller",
          title: "Senior Investment Manager",
          email: "thomas@uef.edu",
          phone: "+1 (617) 555-0125",
          avatar: "/placeholder-user.jpg",
          experience: "15 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-15",
          activity: "Committed $50M to Venture Capital Fund",
          type: "Investment",
        },
        {
          date: "2024-01-08",
          activity: "Completed emerging manager review",
          type: "Review",
        },
        {
          date: "2024-01-02",
          activity: "Board approved new technology strategy",
          type: "Policy",
        },
      ],
      investments: [
        {
          manager: "Growth Capital Partners",
          strategy: "Growth Equity",
          commitment: "$50M",
          vintage: "2023",
          status: "Active",
        },
        {
          manager: "Infrastructure Capital",
          strategy: "Infrastructure Debt",
          commitment: "$75M",
          vintage: "2022",
          status: "Active",
        },
        {
          manager: "Real Estate Ventures",
          strategy: "Core Real Estate",
          commitment: "$40M",
          vintage: "2023",
          status: "Active",
        },
      ],
      documents: [
        {
          id: "doc1",
          name: "Investment Policy Statement 2024",
          type: "Policy",
          category: "Investment Guidelines",
          size: "2.4 MB",
          lastModified: "2024-01-15",
          status: "Active",
        },
        {
          id: "doc2",
          name: "Alternative Investment Strategy",
          type: "Strategy",
          category: "Investment Strategy",
          size: "1.8 MB",
          lastModified: "2024-01-10",
          status: "Active",
        },
      ],
    },
  }

  const [allocator, setAllocator] = useState<any>(null)

  useEffect(() => {
    if (allocatorId) {
      const profile = allocatorProfiles[Number(allocatorId) as keyof typeof allocatorProfiles]
      if (profile) {
        setAllocator(profile)
        setShareMessage(`I wanted to share ${profile.firmName}'s profile with you.`)
      }
    }
  }, [allocatorId])

  // Share functionality
  const handleCopyLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/screens/general/allocator-profile?id=${allocatorId}`
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast({
        title: "Link Copied",
        description: "Profile link has been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = async () => {
    if (!shareEmail.trim()) {
      toast({
        title: "Missing Email",
        description: "Please enter an email address.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setShareSuccess(true)

    setTimeout(() => {
      setShowShareModal(false)
      setShareSuccess(false)
      setShareEmail("")
      setShareMessage(`I wanted to share ${allocator?.firmName}'s profile with you.`)
    }, 1500)
  }

  // Message functionality
  const handleSendMessage = async () => {
    if (!messageSubject.trim() || !messageContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setMessageSuccess(true)

    setTimeout(() => {
      setShowMessageModal(false)
      setMessageSuccess(false)
      setMessageSubject("")
      setMessageContent("")
      setMessagePriority("normal")
    }, 1500)
  }

  // Schedule functionality
  const handleScheduleMeeting = async () => {
    if (!meetingTitle.trim() || !meetingDate || !meetingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in meeting title, date, and time.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setScheduleSuccess(true)

    setTimeout(() => {
      setShowScheduleModal(false)
      setScheduleSuccess(false)
      setMeetingTitle("")
      setMeetingDate("")
      setMeetingTime("")
      setMeetingDuration("60")
      setMeetingType("video")
      setMeetingLocation("")
      setMeetingAgenda("")
    }, 1500)
  }

  const handleSendMessageWithContact = (allocator: any) => {
    setSelectedAction('message')
    setShowContactSelector(true)
  }

  const handleScheduleMeetingWithContact = (allocator: any) => {
    setSelectedAction('schedule')
    setShowContactSelector(true)
  }

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact)
    setShowContactSelector(false)
    
    if (selectedAction === 'message') {
      setShowMessageModal(true)
    } else if (selectedAction === 'schedule') {
      setShowScheduleModal(true)
    }
  }

  if (!allocator) {
    return (
      <Screen>
        <div className="container py-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Allocator Profile Not Found</h1>
            <p className="text-gray-600">The requested allocator profile could not be found.</p>
          </div>
        </div>
      </Screen>
    )
  }

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/screens/general/allocator-profile?id=${allocatorId}`
  const primaryContact = allocator.contacts.find((contact: any) => contact.isPrimary) || allocator.contacts[0]

  return (
    <Screen>
      <div className="container py-8 max-w-6xl">
        {/* Firm Header - Emphasized */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <div className="h-32 w-32 mb-4 bg-electric-blue/10 rounded-lg flex items-center justify-center">
                  <Building className="h-16 w-16 text-electric-blue" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-deep-brand mb-2">{allocator.firmName}</h1>
                    <p className="text-xl text-base-gray mb-1">{allocator.organizationType}</p>
                    <p className="text-base text-base-gray mb-4">
                      Founded {allocator.founded} • {allocator.yearsInBusiness} Years in Business
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setShowShareModal(true)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                      onClick={() => handleSendMessageWithContact(allocator)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                      onClick={() => handleScheduleMeetingWithContact(allocator)}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-base-gray">
                    <MapPin className="h-4 w-4" />
                    <span>{allocator.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Globe className="h-4 w-4" />
                    <a href={allocator.website} className="text-electric-blue hover:underline">
                      {allocator.website}
                    </a>
                  </div>
                </div>

                {/* Top Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.aum}</p>
                    <p className="text-sm text-base-gray">Total Assets</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.keyMetrics.totalAllocations}</p>
                    <p className="text-sm text-base-gray">Investment Portfolio</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.keyMetrics.activeManagers}</p>
                    <p className="text-sm text-base-gray">External Managers</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Section - Listed Below Firm */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Key Contacts
            </CardTitle>
            <CardDescription>Investment team members at {allocator.firmName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allocator.contacts.map((contact: any) => (
                <div
                  key={contact.id}
                  className={`p-4 border rounded-lg ${contact.isPrimary ? "border-electric-blue bg-electric-blue/5" : "border-gray-200"}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-deep-brand">{contact.name}</h4>
                        {contact.isPrimary && (
                          <Badge variant="secondary" className="text-xs bg-electric-blue text-white">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-base-gray mb-1">{contact.title}</p>
                      <p className="text-xs text-base-gray mb-2">{contact.experience} experience</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-base-gray">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-base-gray">
                          <Phone className="h-3 w-3" />
                          <span>{contact.phone}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            setSelectedContact(contact)
                            setShowMessageModal(true)
                          }}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            setSelectedContact(contact)
                            setShowScheduleModal(true)
                          }}
                        >
                          <CalendarDays className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocations">Current Investments</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    About {allocator.firmName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base-gray leading-relaxed">{allocator.about}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investment Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allocator.focus.map((area: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>



              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Allocation Target Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-base-gray">Public Fixed Income:</span>
                      <span className="font-medium">{allocator.allocationTargets.fixedIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Private Fixed Income:</span>
                      <span className="font-medium">{allocator.allocationTargets.alternatives}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Public Equity:</span>
                      <span className="font-medium">{allocator.allocationTargets.publicEquity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Real Estate Debt:</span>
                      <span className="font-medium">{allocator.allocationTargets.realEstate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Real Estate Equity:</span>
                      <span className="font-medium">{allocator.allocationTargets.realEstate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Alternatives:</span>
                      <span className="font-medium">{allocator.allocationTargets.alternatives}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="allocations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Investments</CardTitle>
                <CardDescription>Active manager relationships and commitments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocator.investments?.map((investment: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{investment.manager}</h4>
                        <Badge className="bg-blue-100 text-blue-800">{investment.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-base-gray">
                        <span>Strategy: {investment.strategy}</span>
                        <span>Vintage: {investment.vintage}</span>
                        <span>Commitment: {investment.commitment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest investment activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocator.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-2 h-2 bg-electric-blue rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-deep-brand">{activity.activity}</p>
                        <div className="flex items-center gap-2 text-sm text-base-gray mt-1">
                          <span>{activity.date}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documents
                    </CardTitle>
                    <CardDescription>Shared documents and resources</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocator.documents?.length > 0 ? (
                    allocator.documents.map((document: any) => (
                      <div
                        key={document.id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <FileText className="h-8 w-8 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-deep-brand">{document.name}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {document.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {document.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              {document.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-base-gray">
                            <span>{document.size}</span>
                            <span>Modified {document.lastModified}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-base-gray">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No documents available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Share Modal */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share Profile
              </DialogTitle>
              <DialogDescription>Share {allocator.firmName}'s profile with others</DialogDescription>
            </DialogHeader>

            {shareSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Profile shared successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  {allocator.firmName}'s profile has been shared with {shareEmail}.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Copy Link Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Profile Link</Label>
                  <div className="flex gap-2">
                    <Input value={profileUrl} readOnly className="flex-1" />
                    <Button variant="outline" onClick={handleCopyLink} className="shrink-0 bg-transparent">
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Email Share Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Share via Email</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address..."
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a personal message..."
                        value={shareMessage}
                        onChange={(e) => setShareMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareModal(false)}>
                Cancel
              </Button>
              {!shareSuccess && (
                <Button onClick={handleEmailShare}>
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Message Modal */}
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Message
              </DialogTitle>
              <DialogDescription>
                Send a message to {selectedContact?.name || primaryContact.name} at {allocator.firmName}
              </DialogDescription>
            </DialogHeader>

            {messageSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Message sent successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  Your message has been sent to {selectedContact?.name || primaryContact.name}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" value={`${selectedContact?.name || primaryContact.name} <${selectedContact?.email || primaryContact.email}>`} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={messagePriority} onValueChange={setMessagePriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter message subject..."
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Cancel
              </Button>
              {!messageSuccess && (
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Meeting Modal */}
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Meeting
              </DialogTitle>
              <DialogDescription>Schedule a meeting with {selectedContact?.name || primaryContact.name}</DialogDescription>
            </DialogHeader>

            {scheduleSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Meeting scheduled!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  Your meeting with {selectedContact?.name || primaryContact.name} has been scheduled for {meetingDate} at {meetingTime}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Investment Discussion"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Select value={meetingDuration} onValueChange={setMeetingDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meetingType">Meeting Type</Label>
                    <Select value={meetingType} onValueChange={setMeetingType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video Call
                          </div>
                        </SelectItem>
                        <SelectItem value="phone">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Phone Call
                          </div>
                        </SelectItem>
                        <SelectItem value="in-person">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            In Person
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(meetingType === "in-person" || meetingType === "video") && (
                    <div className="space-y-2">
                      <Label htmlFor="location">{meetingType === "video" ? "Meeting Link" : "Location"}</Label>
                      <Input
                        id="location"
                        placeholder={meetingType === "video" ? "Paste Zoom/Teams link here" : "Enter location"}
                        value={meetingLocation}
                        onChange={(e) => setMeetingLocation(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agenda">Agenda (Optional)</Label>
                  <Textarea
                    id="agenda"
                    placeholder="Meeting agenda or topics to discuss..."
                    value={meetingAgenda}
                    onChange={(e) => setMeetingAgenda(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              {!scheduleSuccess && (
                <Button onClick={handleScheduleMeeting}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Contact Selector Modal */}
        {showContactSelector && (
          <Dialog open={showContactSelector} onOpenChange={setShowContactSelector}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Select Contact</DialogTitle>
                <DialogDescription>
                  Choose a contact at {allocator.firmName} to {selectedAction === 'message' ? 'message' : 'schedule a meeting with'}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {allocator.contacts.map((contact: any) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.title}</p>
                      {contact.isPrimary && (
                        <Badge variant="outline" className="text-xs mt-1">Primary</Badge>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      {selectedAction === 'message' ? 'Message' : 'Schedule'}
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Screen>
  )
}
