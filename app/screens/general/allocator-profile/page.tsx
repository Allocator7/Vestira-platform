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
      firmName: "State Teachers Pension",
      organizationType: "Public Pension",
      location: "Boston, MA",
      website: "https://stateteacherspension.gov",
      aum: "$45B",
      founded: "1965",
      yearsInBusiness: 59,
      focus: ["Private Equity", "Growth Equity", "Real Estate Equity", "ESG"],
      about:
        "State Teachers Pension is a leading public pension fund with over 59 years of experience managing retirement assets for educators. The fund specializes in alternative investments and ESG integration, overseeing a diverse portfolio of private equity and real estate investments with a focus on long-term value creation.",
      keyMetrics: {
        totalAllocations: "$45B",
        activeManagers: 67,
        portfolioCompanies: 234,
        geographicFocus: ["North America", "Europe"],
      },
      allocationTargets: {
        alternatives: "25%",
        fixedIncome: "35%",
        publicEquity: "30%",
        realEstate: "10%",
      },
      // Individual Contacts (Secondary)
      contacts: [
        {
          id: "1",
          name: "Sarah Johnson",
          title: "Investment Director",
          email: "s.johnson@stpension.gov",
          phone: "+1 (617) 555-0123",
          avatar: "/placeholder-user.jpg",
          experience: "15 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Michael Thompson",
          title: "Senior Portfolio Manager",
          email: "m.thompson@stpension.gov",
          phone: "+1 (617) 555-0124",
          avatar: "/placeholder-user.jpg",
          experience: "12 years",
          isPrimary: false,
        },
        {
          id: "3",
          name: "Jennifer Lee",
          title: "Alternative Investments Analyst",
          email: "j.lee@stpension.gov",
          phone: "+1 (617) 555-0125",
          avatar: "/placeholder-user.jpg",
          experience: "8 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-15",
          activity: "Committed $100M to Infrastructure Fund V",
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
    2: {
      firmName: "University Endowment Foundation",
      organizationType: "Endowment",
      location: "New Haven, CT",
      website: "https://endowment.university.edu",
      aum: "$12B",
      founded: "1890",
      yearsInBusiness: 134,
      focus: ["Venture Capital", "Growth Equity", "ESG/Sustainable Equity", "Hedge Funds"],
      about:
        "University Endowment Foundation is one of the oldest and most prestigious university endowments in the United States. With over 134 years of investment experience, the fund focuses on long-term value creation through diversified alternative investment strategies and innovative approaches to portfolio management.",
      keyMetrics: {
        totalAllocations: "$12B",
        activeManagers: 45,
        portfolioCompanies: 156,
        geographicFocus: ["Global"],
      },
      allocationTargets: {
        alternatives: "40%",
        fixedIncome: "20%",
        publicEquity: "25%",
        realEstate: "15%",
      },
      contacts: [
        {
          id: "1",
          name: "Michael Chen",
          title: "Portfolio Manager",
          email: "r.chen@university.edu",
          phone: "+1 (203) 555-0456",
          avatar: "/placeholder-user.jpg",
          experience: "20 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Amanda Foster",
          title: "Director of Alternative Investments",
          email: "a.foster@university.edu",
          phone: "+1 (203) 555-0457",
          avatar: "/placeholder-user.jpg",
          experience: "16 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-14",
          activity: "Allocated $50M to venture capital fund",
          type: "Investment",
        },
        {
          date: "2024-01-07",
          activity: "Published annual endowment report",
          type: "Report",
        },
      ],
      investments: [
        {
          manager: "Venture Dynamics",
          strategy: "Early Stage VC",
          commitment: "$30M",
          vintage: "2023",
          status: "Active",
        },
        {
          manager: "Sustainable Equity Fund",
          strategy: "ESG Equity",
          commitment: "$25M",
          vintage: "2022",
          status: "Active",
        },
      ],
      documents: [
        {
          id: "doc3",
          name: "Endowment Annual Report 2023",
          type: "Report",
          category: "Performance Reports",
          size: "8.7 MB",
          lastModified: "2024-01-14",
          status: "Published",
        },
      ],
    },
    3: {
      firmName: "Global Insurance Group",
      organizationType: "Insurance Company",
      location: "New York, NY",
      website: "https://globalinsurance.com",
      aum: "$85B",
      founded: "1952",
      yearsInBusiness: 72,
      focus: ["Investment Grade Corporate Bonds", "Direct Lending", "Private Fixed Income", "Real Estate Debt"],
      about:
        "Global Insurance Group is a leading insurance company with a sophisticated investment management division. With over 72 years of experience, the company specializes in liability-driven investing and fixed income strategies, managing one of the largest insurance investment portfolios globally.",
      keyMetrics: {
        totalAllocations: "$85B",
        activeManagers: 89,
        portfolioCompanies: 312,
        geographicFocus: ["North America", "Europe"],
      },
      allocationTargets: {
        alternatives: "20%",
        fixedIncome: "60%",
        publicEquity: "15%",
        realEstate: "5%",
      },
      contacts: [
        {
          id: "1",
          name: "Jennifer Rodriguez",
          title: "Senior Investment Director",
          email: "j.rodriguez@globalinsurance.com",
          phone: "+1 (212) 555-0789",
          avatar: "/placeholder-user.jpg",
          experience: "18 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Thomas Wilson",
          title: "Fixed Income Portfolio Manager",
          email: "t.wilson@globalinsurance.com",
          phone: "+1 (212) 555-0790",
          avatar: "/placeholder-user.jpg",
          experience: "14 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-12",
          activity: "Increased allocation to direct lending strategies",
          type: "Investment",
        },
        {
          date: "2024-01-05",
          activity: "Completed quarterly portfolio rebalancing",
          type: "Rebalancing",
        },
      ],
      investments: [
        {
          manager: "Fixed Income Strategies",
          strategy: "Investment Grade Bonds",
          commitment: "$200M",
          vintage: "2023",
          status: "Active",
        },
        {
          manager: "Direct Lending Partners",
          strategy: "Direct Lending",
          commitment: "$150M",
          vintage: "2023",
          status: "Active",
        },
      ],
      documents: [],
    },
    4: {
      firmName: "Sovereign Wealth Fund",
      organizationType: "Sovereign Wealth Fund",
      location: "Singapore",
      website: "https://swf.gov.sg",
      aum: "$320B",
      founded: "1974",
      yearsInBusiness: 50,
      focus: ["Real Estate Equity", "Infrastructure Debt", "Private Equity", "Commodities"],
      about:
        "Sovereign Wealth Fund is one of the world's largest sovereign wealth funds, established to manage Singapore's foreign reserves. With 50 years of investment experience, the fund focuses on long-term value creation through diversified global investments in real estate, infrastructure, and alternative assets.",
      keyMetrics: {
        totalAllocations: "$320B",
        activeManagers: 156,
        portfolioCompanies: 445,
        geographicFocus: ["Global", "Asia-Pacific", "North America", "Europe"],
      },
      allocationTargets: {
        alternatives: "35%",
        fixedIncome: "25%",
        publicEquity: "30%",
        realEstate: "10%",
      },
      contacts: [
        {
          id: "1",
          name: "David Park",
          title: "Managing Director",
          email: "d.park@swf.gov.sg",
          phone: "+65 6555-0123",
          avatar: "/placeholder-user.jpg",
          experience: "22 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Li Wei Chen",
          title: "Head of Real Estate Investments",
          email: "lw.chen@swf.gov.sg",
          phone: "+65 6555-0124",
          avatar: "/placeholder-user.jpg",
          experience: "19 years",
          isPrimary: false,
        },
        {
          id: "3",
          name: "Priya Sharma",
          title: "Infrastructure Investment Director",
          email: "p.sharma@swf.gov.sg",
          phone: "+65 6555-0125",
          avatar: "/placeholder-user.jpg",
          experience: "15 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-10",
          activity: "Committed $500M to Asian infrastructure fund",
          type: "Investment",
        },
        {
          date: "2024-01-03",
          activity: "Completed acquisition of European real estate portfolio",
          type: "Investment",
        },
      ],
      investments: [
        {
          manager: "Asia Infrastructure Partners",
          strategy: "Infrastructure Debt",
          commitment: "$300M",
          vintage: "2023",
          status: "Active",
        },
        {
          manager: "Global Real Estate Ventures",
          strategy: "Real Estate Equity",
          commitment: "$250M",
          vintage: "2023",
          status: "Active",
        },
      ],
      documents: [],
    },
    5: {
      firmName: "Family Office Partners",
      organizationType: "Family Office",
      location: "San Francisco, CA",
      website: "https://familyofficepartners.com",
      aum: "$8B",
      founded: "1995",
      yearsInBusiness: 29,
      focus: ["ESG/Sustainable Equity", "Venture Capital", "Growth Equity", "Impact Investing"],
      about:
        "Family Office Partners is a leading multi-family office serving ultra-high-net-worth families globally. With nearly 30 years of experience, the firm specializes in sustainable investing, venture capital, and innovative investment strategies that align with family values and long-term wealth preservation goals.",
      keyMetrics: {
        totalAllocations: "$8B",
        activeManagers: 34,
        portfolioCompanies: 89,
        geographicFocus: ["North America", "Europe"],
      },
      allocationTargets: {
        alternatives: "35%",
        fixedIncome: "25%",
        publicEquity: "30%",
        realEstate: "10%",
      },
      contacts: [
        {
          id: "1",
          name: "Lisa Thompson",
          title: "Chief Investment Officer",
          email: "l.thompson@familyofficepartners.com",
          phone: "+1 (415) 555-0987",
          avatar: "/placeholder-user.jpg",
          experience: "17 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "James Mitchell",
          title: "Director of Sustainable Investing",
          email: "j.mitchell@familyofficepartners.com",
          phone: "+1 (415) 555-0988",
          avatar: "/placeholder-user.jpg",
          experience: "13 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-08",
          activity: "Launched new impact investing initiative",
          type: "Investment",
        },
        {
          date: "2023-12-28",
          activity: "Committed to cleantech venture fund",
          type: "Investment",
        },
      ],
      investments: [
        {
          manager: "Sustainable Ventures",
          strategy: "ESG Equity",
          commitment: "$50M",
          vintage: "2023",
          status: "Active",
        },
        {
          manager: "Impact Capital Partners",
          strategy: "Impact Investing",
          commitment: "$40M",
          vintage: "2023",
          status: "Active",
        },
      ],
      documents: [],
    },
    6: {
      firmName: "Healthcare Foundation",
      organizationType: "Foundation",
      location: "Chicago, IL",
      website: "https://healthcarefoundation.org",
      aum: "$3.5B",
      founded: "1978",
      yearsInBusiness: 46,
      focus: ["Core Fixed Income", "Large Cap Equity", "Healthcare Sector", "Conservative Strategies"],
      about:
        "Healthcare Foundation is a leading philanthropic organization dedicated to improving healthcare outcomes through strategic investments and grants. With over 46 years of experience, the foundation maintains a conservative investment approach focused on capital preservation and steady returns to support its healthcare mission.",
      keyMetrics: {
        totalAllocations: "$3.5B",
        activeManagers: 28,
        portfolioCompanies: 67,
        geographicFocus: ["North America"],
      },
      allocationTargets: {
        alternatives: "15%",
        fixedIncome: "50%",
        publicEquity: "25%",
        realEstate: "10%",
      },
      contacts: [
        {
          id: "1",
          name: "Robert Williams",
          title: "Investment Committee Chair",
          email: "r.williams@healthcarefoundation.org",
          phone: "+1 (312) 555-0654",
          avatar: "/placeholder-user.jpg",
          experience: "20 years",
          isPrimary: true,
        },
        {
          id: "2",
          name: "Dr. Sarah Martinez",
          title: "Chief Financial Officer",
          email: "s.martinez@healthcarefoundation.org",
          phone: "+1 (312) 555-0655",
          avatar: "/placeholder-user.jpg",
          experience: "16 years",
          isPrimary: false,
        },
      ],
      recentActivity: [
        {
          date: "2023-12-20",
          activity: "Approved healthcare innovation grant program",
          type: "Grant",
        },
        {
          date: "2023-12-15",
          activity: "Rebalanced fixed income portfolio",
          type: "Rebalancing",
        },
      ],
      investments: [
        {
          manager: "Fixed Income Strategies",
          strategy: "Core Fixed Income",
          commitment: "$100M",
          vintage: "2023",
          status: "Active",
        },
        {
          manager: "Healthcare Equity Fund",
          strategy: "Healthcare Sector",
          commitment: "$75M",
          vintage: "2022",
          status: "Active",
        },
      ],
      documents: [],
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
                      onClick={() => setShowMessageModal(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                      onClick={() => setShowScheduleModal(true)}
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

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.aum}</p>
                    <p className="text-sm text-base-gray">Assets Under Management</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.keyMetrics.activeManagers}</p>
                    <p className="text-sm text-base-gray">Active Managers</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.allocationTargets.alternatives}</p>
                    <p className="text-sm text-base-gray">Alternative Allocation</p>
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
            <TabsTrigger value="allocations">Allocations</TabsTrigger>
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
                    <BarChart3 className="h-5 w-5" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-base-gray">Total AUM:</span>
                      <span className="font-medium">{allocator.keyMetrics.totalAllocations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Active Managers:</span>
                      <span className="font-medium">{allocator.keyMetrics.activeManagers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Portfolio Companies:</span>
                      <span className="font-medium">{allocator.keyMetrics.portfolioCompanies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Founded:</span>
                      <span className="font-medium">{allocator.founded}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Allocation Targets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-base-gray">Alternatives:</span>
                      <span className="font-medium">{allocator.allocationTargets.alternatives}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Fixed Income:</span>
                      <span className="font-medium">{allocator.allocationTargets.fixedIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Public Equity:</span>
                      <span className="font-medium">{allocator.allocationTargets.publicEquity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Real Estate:</span>
                      <span className="font-medium">{allocator.allocationTargets.realEstate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="allocations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Allocations</CardTitle>
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
                Send a message to {primaryContact.name} at {allocator.firmName}
              </DialogDescription>
            </DialogHeader>

            {messageSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Message sent successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  Your message has been sent to {primaryContact.name}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" value={`${primaryContact.name} <${primaryContact.email}>`} disabled />
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
              <DialogDescription>Schedule a meeting with {primaryContact.name}</DialogDescription>
            </DialogHeader>

            {scheduleSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Meeting scheduled!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  Your meeting with {primaryContact.name} has been scheduled for {meetingDate} at {meetingTime}.
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
      </div>
    </Screen>
  )
}
