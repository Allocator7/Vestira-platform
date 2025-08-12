"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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

export default function ManagerProfilePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const managerId = searchParams.get("id")
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

  // Sample manager profiles data
  const managerProfiles = {
    1: {
      name: "David Rodriguez",
      title: "Managing Partner",
      firm: "Growth Capital Partners",
      firmType: "Private Equity",
      location: "San Francisco, CA",
      website: "https://growthcapitalpartners.com",
      email: "d.rodriguez@growthcp.com",
      phone: "+1 (415) 555-0123",
      avatar: "/placeholder-user.jpg",
      aum: "$2.5B",
      founded: "2008",
      yearsInBusiness: 16,
      experience: "18 years",
      focus: ["Growth Equity", "Technology", "Healthcare", "Buyouts"],
      about:
        "David Rodriguez is the Managing Partner of Growth Capital Partners, a leading private equity firm focused on growth-stage technology and healthcare companies. With over 18 years of investment experience, David has led numerous successful investments and exits.",
      keyMetrics: {
        totalFunds: 4,
        activeInvestments: 23,
        portfolioCompanies: 45,
        geographicFocus: ["North America", "Europe"],
      },
      trackRecord: {
        irr: "22.5%",
        multiple: "2.8x",
        totalReturns: "$1.2B",
      },
      recentActivity: [
        {
          date: "2024-01-15",
          activity: "Closed $500M Fund IV with oversubscription",
          type: "Fundraising",
        },
        {
          date: "2024-01-08",
          activity: "Completed exit of TechCorp for 3.2x return",
          type: "Exit",
        },
        {
          date: "2024-01-02",
          activity: "Led $50M Series B in HealthTech startup",
          type: "Investment",
        },
      ],
      investments: [
        {
          company: "TechCorp",
          sector: "Technology",
          stage: "Growth",
          investment: "$25M",
          status: "Exited",
          multiple: "3.2x",
        },
        {
          company: "HealthTech Solutions",
          sector: "Healthcare",
          stage: "Series B",
          investment: "$50M",
          status: "Active",
          multiple: "2.1x",
        },
        {
          company: "DataAnalytics Inc",
          sector: "Technology",
          stage: "Series A",
          investment: "$15M",
          status: "Active",
          multiple: "1.8x",
        },
      ],
      documents: [
        {
          id: "doc1",
          name: "Fund IV Marketing Presentation",
          type: "Presentation",
          category: "Fund Materials",
          size: "12.4 MB",
          lastModified: "2024-01-15",
          status: "Active",
        },
        {
          id: "doc2",
          name: "Investment Strategy Overview",
          type: "Document",
          category: "Strategy",
          size: "3.2 MB",
          lastModified: "2024-01-10",
          status: "Active",
        },
      ],
    },
    2: {
      name: "Sarah Chen",
      title: "Portfolio Manager",
      firm: "Sustainable Equity Fund",
      firmType: "Hedge Fund",
      location: "New York, NY",
      website: "https://sustainableequity.com",
      email: "s.chen@sustainableequity.com",
      phone: "+1 (212) 555-0456",
      avatar: "/placeholder-user.jpg",
      aum: "$1.2B",
      founded: "2015",
      yearsInBusiness: 9,
      experience: "12 years",
      focus: ["ESG/Sustainable Equity", "Long/Short Equity", "Impact Investing"],
      about:
        "Sarah Chen is a Portfolio Manager at Sustainable Equity Fund, specializing in ESG-focused investment strategies. She has 12 years of experience in sustainable investing and impact measurement.",
      keyMetrics: {
        totalFunds: 2,
        activeInvestments: 45,
        portfolioCompanies: 67,
        geographicFocus: ["Global"],
      },
      trackRecord: {
        irr: "15.3%",
        multiple: "1.9x",
        totalReturns: "$450M",
      },
      recentActivity: [
        {
          date: "2024-01-14",
          activity: "Published ESG Impact Report 2023",
          type: "Report",
        },
        {
          date: "2024-01-07",
          activity: "Increased position in renewable energy sector",
          type: "Investment",
        },
      ],
      investments: [
        {
          company: "CleanTech Corp",
          sector: "Clean Energy",
          stage: "Public",
          investment: "$30M",
          status: "Active",
          multiple: "2.3x",
        },
        {
          company: "Sustainable Materials",
          sector: "Materials",
          stage: "Public",
          investment: "$20M",
          status: "Active",
          multiple: "1.7x",
        },
      ],
      documents: [
        {
          id: "doc3",
          name: "ESG Integration Framework",
          type: "Framework",
          category: "ESG",
          size: "5.1 MB",
          lastModified: "2024-01-14",
          status: "Active",
        },
      ],
    },
    3: {
      name: "Michael Thompson",
      title: "Senior Managing Director",
      firm: "Infrastructure Capital",
      firmType: "Infrastructure",
      location: "London, UK",
      website: "https://infrastructurecapital.com",
      email: "m.thompson@infracap.com",
      phone: "+44 20 7555 0789",
      avatar: "/placeholder-user.jpg",
      aum: "$3.8B",
      founded: "2005",
      yearsInBusiness: 19,
      experience: "22 years",
      focus: ["Infrastructure Debt", "Real Estate Debt", "Project Finance"],
      about:
        "Michael Thompson is a Senior Managing Director at Infrastructure Capital, with over 22 years of experience in infrastructure and real estate debt investments across global markets.",
      keyMetrics: {
        totalFunds: 5,
        activeInvestments: 34,
        portfolioCompanies: 78,
        geographicFocus: ["Europe", "North America", "Asia-Pacific"],
      },
      trackRecord: {
        irr: "12.8%",
        multiple: "1.7x",
        totalReturns: "$890M",
      },
      recentActivity: [
        {
          date: "2024-01-13",
          activity: "Closed £200M infrastructure debt facility",
          type: "Investment",
        },
      ],
      investments: [
        {
          company: "European Wind Farm",
          sector: "Infrastructure",
          stage: "Debt",
          investment: "£150M",
          status: "Active",
          multiple: "1.4x",
        },
      ],
      documents: [],
    },
    4: {
      name: "Jennifer Park",
      title: "Founding Partner",
      firm: "Venture Dynamics",
      firmType: "Venture Capital",
      location: "Palo Alto, CA",
      website: "https://venturedynamics.com",
      email: "j.park@venturedynamics.com",
      phone: "+1 (650) 555-0321",
      avatar: "/placeholder-user.jpg",
      aum: "$800M",
      founded: "2012",
      yearsInBusiness: 12,
      experience: "15 years",
      focus: ["Venture Capital", "Early Stage", "Technology", "SaaS"],
      about:
        "Jennifer Park is the Founding Partner of Venture Dynamics, focusing on early-stage technology investments. She has 15 years of experience in venture capital and startup ecosystems.",
      keyMetrics: {
        totalFunds: 3,
        activeInvestments: 67,
        portfolioCompanies: 89,
        geographicFocus: ["North America"],
      },
      trackRecord: {
        irr: "28.4%",
        multiple: "3.2x",
        totalReturns: "$320M",
      },
      recentActivity: [
        {
          date: "2024-01-12",
          activity: "Led $10M Series A in AI startup",
          type: "Investment",
        },
      ],
      investments: [
        {
          company: "AI Solutions",
          sector: "Technology",
          stage: "Series A",
          investment: "$10M",
          status: "Active",
          multiple: "4.1x",
        },
      ],
      documents: [],
    },
    5: {
      name: "Robert Williams",
      title: "Chief Investment Officer",
      firm: "Fixed Income Strategies",
      firmType: "Credit",
      location: "Chicago, IL",
      website: "https://fixedincomestrategies.com",
      email: "r.williams@fixedincome.com",
      phone: "+1 (312) 555-0654",
      avatar: "/placeholder-user.jpg",
      aum: "$4.2B",
      founded: "2001",
      yearsInBusiness: 23,
      experience: "25 years",
      focus: ["High Yield Bonds", "Corporate Private Placements", "Direct Lending"],
      about:
        "Robert Williams is the Chief Investment Officer at Fixed Income Strategies, with 25 years of experience in credit markets and alternative lending strategies.",
      keyMetrics: {
        totalFunds: 6,
        activeInvestments: 156,
        portfolioCompanies: 234,
        geographicFocus: ["North America", "Europe"],
      },
      trackRecord: {
        irr: "9.8%",
        multiple: "1.4x",
        totalReturns: "$1.8B",
      },
      recentActivity: [
        {
          date: "2024-01-11",
          activity: "Completed $100M direct lending facility",
          type: "Investment",
        },
      ],
      investments: [
        {
          company: "Manufacturing Corp",
          sector: "Industrial",
          stage: "Credit",
          investment: "$75M",
          status: "Active",
          multiple: "1.3x",
        },
      ],
      documents: [],
    },
    6: {
      name: "James Wilson",
      title: "Managing Partner",
      firm: "Quantum Capital Partners",
      firmType: "Hedge Fund",
      location: "New York, NY",
      website: "https://quantumcapitalpartners.com",
      email: "j.wilson@quantumcp.com",
      phone: "+1 (212) 555-0123",
      avatar: "/placeholder-user.jpg",
      aum: "$2.5B",
      founded: "2012",
      yearsInBusiness: 12,
      experience: "15 years",
      focus: ["Global Macro", "Fixed Income", "Currencies"],
      about:
        "James Wilson is the Managing Partner of Quantum Capital Partners, a leading hedge fund specializing in global macro strategies and fixed income investments. With over 15 years of experience, James has built a reputation for delivering consistent returns across market cycles.",
      keyMetrics: {
        totalFunds: 3,
        activeInvestments: 45,
        portfolioCompanies: 120,
        geographicFocus: ["Global"],
      },
      trackRecord: {
        irr: "12.8%",
        multiple: "1.9x",
        totalReturns: "$450M",
      },
      recentActivity: [
        {
          date: "2024-01-15",
          activity: "Launched new global macro strategy",
          type: "Strategy",
        },
        {
          date: "2024-01-08",
          activity: "Completed currency position review",
          type: "Review",
        },
      ],
      investments: [
        {
          company: "Global Macro Strategy Fund",
          sector: "Hedge Fund",
          stage: "Active",
          investment: "$500M",
          status: "Active",
          multiple: "1.8x",
        },
        {
          company: "Fixed Income Portfolio",
          sector: "Fixed Income",
          stage: "Active",
          investment: "$300M",
          status: "Active",
          multiple: "1.6x",
        },
      ],
      documents: [
        {
          id: "doc1",
          name: "Investment Strategy Overview",
          type: "Strategy",
          category: "Investment Strategy",
          size: "1.2 MB",
          lastModified: "2024-01-15",
          status: "Active",
        },
        {
          id: "doc2",
          name: "Risk Management Framework",
          type: "Policy",
          category: "Risk Management",
          size: "0.8 MB",
          lastModified: "2024-01-10",
          status: "Active",
        },
      ],
    },
    14: {
      name: "Lisa Rodriguez",
      title: "Managing Director",
      firm: "Healthcare Investment Group",
      firmType: "Sector Specialist",
      location: "Boston, MA",
      website: "https://healthcareinvestmentgroup.com",
      email: "l.rodriguez@healthcareig.com",
      phone: "+1 (617) 555-0456",
      avatar: "/placeholder-user.jpg",
      aum: "$3.2B",
      founded: "2015",
      yearsInBusiness: 9,
      experience: "12 years",
      focus: ["Healthcare", "Biotechnology", "Medical Devices"],
      about:
        "Lisa Rodriguez is the Managing Director of Healthcare Investment Group, a specialized investment firm focused on healthcare and biotechnology opportunities. With over 12 years of experience in healthcare investing, Lisa has led numerous successful investments in innovative medical technologies and biotech companies.",
      keyMetrics: {
        totalFunds: 2,
        activeInvestments: 18,
        portfolioCompanies: 35,
        geographicFocus: ["North America", "Europe"],
      },
      trackRecord: {
        irr: "16.5%",
        multiple: "2.3x",
        totalReturns: "$420M",
      },
      recentActivity: [
        {
          date: "2024-01-15",
          activity: "Invested in breakthrough cancer therapy startup",
          type: "Investment",
        },
        {
          date: "2024-01-08",
          activity: "Completed due diligence on medical device company",
          type: "Review",
        },
      ],
      investments: [
        {
          company: "OncoTech Therapeutics",
          sector: "Biotechnology",
          stage: "Series B",
          investment: "$75M",
          status: "Active",
          multiple: "2.1x",
        },
        {
          company: "MedDevice Innovations",
          sector: "Medical Devices",
          stage: "Growth",
          investment: "$45M",
          status: "Active",
          multiple: "1.8x",
        },
      ],
      documents: [
        {
          id: "doc1",
          name: "Healthcare Investment Strategy",
          type: "Strategy",
          category: "Investment Strategy",
          size: "1.5 MB",
          lastModified: "2024-01-15",
          status: "Active",
        },
        {
          id: "doc2",
          name: "Biotech Market Analysis",
          type: "Research",
          category: "Market Research",
          size: "2.1 MB",
          lastModified: "2024-01-10",
          status: "Active",
        },
      ],
    },
  }

  const [manager, setManager] = useState<any>(null)

  useEffect(() => {
    if (managerId) {
      try {
        const profile = managerProfiles[Number(managerId) as keyof typeof managerProfiles]
        if (profile) {
          setManager(profile)
          setShareMessage(`I wanted to share ${profile.name}'s profile with you.`)
        } else {
          console.error('Profile not found for ID:', managerId)
          // Redirect to connection center if profile not found
          router.push('/screens/general/connection-center')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        // Redirect to connection center if error occurs
        router.push('/screens/general/connection-center')
      }
    }
  }, [managerId, router])

  // Share functionality
  const handleCopyLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/screens/general/manager-profile?id=${managerId}`
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
      setShareMessage(`I wanted to share ${manager?.name}'s profile with you.`)
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

  if (!manager) {
    return (
      <Screen>
        <div className="container py-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Manager Profile Not Found</h1>
            <p className="text-gray-600">The requested manager profile could not be found.</p>
          </div>
        </div>
      </Screen>
    )
  }

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/screens/general/manager-profile?id=${managerId}`

  return (
    <Screen>
      <div className="container py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={manager.avatar || "/placeholder.svg"} alt={manager.name} />
                  <AvatarFallback className="text-2xl">
                    {manager.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    {/* Firm name now prominently displayed first */}
                    <h1 className="text-3xl font-bold text-deep-brand mb-2">{manager.firm}</h1>
                    <p className="text-lg text-base-gray mb-1">{manager.firmType}</p>

                    {/* Individual contact section */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h2 className="text-xl font-semibold text-deep-brand mb-1">{manager.name}</h2>
                      <p className="text-base text-base-gray mb-4">{manager.title}</p>
                    </div>
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
                    <span>{manager.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Globe className="h-4 w-4" />
                    <a href={manager.website} className="text-electric-blue hover:underline">
                      {manager.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Mail className="h-4 w-4" />
                    <span>{manager.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Phone className="h-4 w-4" />
                    <span>{manager.phone}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{manager.aum}</p>
                    <p className="text-sm text-base-gray">Assets Under Management</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{manager.trackRecord.irr}</p>
                    <p className="text-sm text-base-gray">Net IRR</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{manager.trackRecord.multiple}</p>
                    <p className="text-sm text-base-gray">Net Multiple</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base-gray leading-relaxed">{manager.about}</p>
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
                    {manager.focus.map((area, index) => (
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
                      <span className="text-base-gray">Total Funds:</span>
                      <span className="font-medium">{manager.keyMetrics.totalFunds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Active Investments:</span>
                      <span className="font-medium">{manager.keyMetrics.activeInvestments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Portfolio Companies:</span>
                      <span className="font-medium">{manager.keyMetrics.portfolioCompanies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Founded:</span>
                      <span className="font-medium">{manager.founded}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Geographic Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {manager.keyMetrics.geographicFocus.map((region, index) => (
                      <Badge key={index} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Track Record</CardTitle>
                  <CardDescription>Historical performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base-gray">Net IRR:</span>
                      <span className="text-2xl font-bold text-green-600">{manager.trackRecord.irr}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-gray">Net Multiple:</span>
                      <span className="text-2xl font-bold text-blue-600">{manager.trackRecord.multiple}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-gray">Total Returns:</span>
                      <span className="text-xl font-semibold">{manager.trackRecord.totalReturns}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Investments</CardTitle>
                  <CardDescription>Notable portfolio companies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {manager.investments?.map((investment, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{investment.company}</h4>
                          <Badge
                            className={
                              investment.status === "Exited"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {investment.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-base-gray">
                          <span>Sector: {investment.sector}</span>
                          <span>Stage: {investment.stage}</span>
                          <span>Investment: {investment.investment}</span>
                          <span>Multiple: {investment.multiple}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest investment activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {manager.recentActivity.map((activity, index) => (
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
                  {manager.documents?.length > 0 ? (
                    manager.documents.map((document) => (
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
              <DialogDescription>Share {manager.name}'s profile with others</DialogDescription>
            </DialogHeader>

            {shareSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Profile shared successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  {manager.name}'s profile has been shared with {shareEmail}.
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
                Send a message to {manager.name} at {manager.firm}
              </DialogDescription>
            </DialogHeader>

            {messageSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Message sent successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">Your message has been sent to {manager.name}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" value={`${manager.name} <${manager.email}>`} disabled />
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
              <DialogDescription>Schedule a meeting with {manager.name}</DialogDescription>
            </DialogHeader>

            {scheduleSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Meeting scheduled!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  Your meeting with {manager.name} has been scheduled for {meetingDate} at {meetingTime}.
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
                        placeholder={meetingType === "video" ? "Zoom/Teams link will be generated" : "Enter location"}
                        value={meetingLocation}
                        onChange={(e) => setMeetingLocation(e.target.value)}
                        disabled={meetingType === "video"}
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
