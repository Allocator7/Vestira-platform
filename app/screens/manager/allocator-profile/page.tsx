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
  Star,
  MessageSquare,
  CalendarDays,
  Download,
  Filter,
  FileText,
  Users,
  CheckCircle2,
  Copy,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AllocatorProfilePage() {
  const searchParams = useSearchParams()
  const allocatorId = searchParams.get("id")
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Modal states
  const [showShareModal, setShowShareModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showDocumentFilters, setShowDocumentFilters] = useState(false)

  // Share modal states
  const [shareEmail, setShareEmail] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  const [shareSuccess, setShareSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  // Contact modal states
  const [contactType, setContactType] = useState("general")
  const [contactSubject, setContactSubject] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [contactSuccess, setContactSuccess] = useState(false)

  // Team message/schedule states
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [teamMessageSubject, setTeamMessageSubject] = useState("")
  const [teamMessageContent, setTeamMessageContent] = useState("")
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [meetingDuration, setMeetingDuration] = useState("60")
  const [meetingType, setMeetingType] = useState("video")
  const [meetingAgenda, setMeetingAgenda] = useState("")
  const [teamActionSuccess, setTeamActionSuccess] = useState(false)

  // Document filter states
  const [documentFilters, setDocumentFilters] = useState({
    type: "all",
    dateRange: "all",
    status: "all",
    category: "all",
  })
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  // Sample allocator profiles data
  const allocatorProfiles = {
    1: {
      name: "California Public Employees' Retirement System",
      shortName: "CalPERS",
      type: "Public Pension",
      location: "Sacramento, CA",
      website: "https://calpers.ca.gov",
      email: "investments@calpers.ca.gov",
      phone: "+1 (916) 795-3000",
      avatar: "/placeholder-logo.png",
      aum: "$469B",
      founded: "1932",
      yearsInBusiness: 92,
      investmentHorizon: "Long-term",
      focus: ["Private Equity", "Infrastructure", "ESG", "Real Estate"],
      about:
        "CalPERS is the largest public pension fund in the US, focused on long-term sustainable investing across all asset classes. We serve over 2 million members and manage retirement benefits for California public employees.",
      keyMetrics: {
        totalCommitments: "$500B",
        activeInvestments: 245,
        portfolioCompanies: 189,
        geographicFocus: ["North America", "Europe", "Asia-Pacific"],
      },
      recentActivity: [
        {
          date: "2024-01-15",
          activity: "Committed $250M to Global Infrastructure Fund IV",
          type: "Investment",
        },
        {
          date: "2024-01-08",
          activity: "Completed due diligence on Healthcare Growth Partners",
          type: "Due Diligence",
        },
        {
          date: "2024-01-02",
          activity: "Published Q4 2023 Portfolio Review",
          type: "Report",
        },
      ],
      teamMembers: [
        {
          id: "tm1",
          name: "Sarah Chen",
          title: "Chief Investment Officer",
          department: "Investment Management",
          avatar: "/placeholder-user.jpg",
          initials: "SC",
          email: "s.chen@calpers.ca.gov",
          phone: "+1 (916) 795-3001",
          yearsAtCompany: 8,
          specialties: ["Private Equity", "ESG Investing"],
          lastActive: "2 hours ago",
          bio: "Sarah leads CalPERS' investment strategy with over 15 years of experience in institutional investing.",
        },
        {
          id: "tm2",
          name: "Michael Rodriguez",
          title: "Senior Portfolio Manager",
          department: "Alternative Investments",
          avatar: "/placeholder-user.jpg",
          initials: "MR",
          email: "m.rodriguez@calpers.ca.gov",
          phone: "+1 (916) 795-3002",
          yearsAtCompany: 12,
          specialties: ["Infrastructure", "Real Estate"],
          lastActive: "1 day ago",
          bio: "Michael manages CalPERS' alternative investment portfolio with focus on infrastructure and real estate.",
        },
        {
          id: "tm3",
          name: "Jennifer Park",
          title: "Director of Due Diligence",
          department: "Investment Research",
          avatar: "/placeholder-user.jpg",
          initials: "JP",
          email: "j.park@calpers.ca.gov",
          phone: "+1 (916) 795-3003",
          yearsAtCompany: 6,
          specialties: ["Due Diligence", "Risk Management"],
          lastActive: "3 hours ago",
          bio: "Jennifer oversees due diligence processes and risk assessment for all investment opportunities.",
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
          description: "Comprehensive investment policy outlining strategic asset allocation and risk parameters.",
        },
        {
          id: "doc2",
          name: "Q4 2023 Portfolio Review",
          type: "Report",
          category: "Performance Reports",
          size: "8.7 MB",
          lastModified: "2024-01-02",
          status: "Published",
          description: "Quarterly performance review covering all asset classes and investment strategies.",
        },
        {
          id: "doc3",
          name: "ESG Integration Framework",
          type: "Framework",
          category: "ESG Documentation",
          size: "1.8 MB",
          lastModified: "2023-12-20",
          status: "Active",
          description:
            "Framework for integrating environmental, social, and governance factors into investment decisions.",
        },
        {
          id: "doc4",
          name: "Private Equity Due Diligence Checklist",
          type: "Checklist",
          category: "Due Diligence",
          size: "956 KB",
          lastModified: "2023-12-15",
          status: "Active",
          description: "Comprehensive checklist for evaluating private equity investment opportunities.",
        },
        {
          id: "doc5",
          name: "Infrastructure Investment Guidelines",
          type: "Guidelines",
          category: "Investment Guidelines",
          size: "3.2 MB",
          lastModified: "2023-11-30",
          status: "Active",
          description: "Detailed guidelines for infrastructure investment evaluation and management.",
        },
      ],
    },
    2: {
      name: "Teacher Retirement System of Texas",
      shortName: "TRS Texas",
      type: "Public Pension",
      location: "Austin, TX",
      website: "https://trs.texas.gov",
      email: "investments@trs.texas.gov",
      phone: "+1 (512) 542-6400",
      avatar: "/placeholder-logo.png",
      aum: "$201B",
      founded: "1937",
      yearsInBusiness: 87,
      investmentHorizon: "Long-term",
      focus: ["Fixed Income", "Public Equities", "Alternatives", "Real Estate"],
      about:
        "TRS Texas serves over 1.6 million active and retired educators in Texas. Our investment strategy focuses on diversified asset allocation with emphasis on long-term value creation.",
      keyMetrics: {
        totalCommitments: "$225B",
        activeInvestments: 189,
        portfolioCompanies: 134,
        geographicFocus: ["North America", "Global"],
      },
      recentActivity: [
        {
          date: "2024-01-12",
          activity: "Allocated $300M to Education Technology Fund",
          type: "Investment",
        },
        {
          date: "2024-01-05",
          activity: "Board approved new Alternative Investment Policy",
          type: "Policy",
        },
      ],
      teamMembers: [
        {
          id: "tm4",
          name: "Lisa Johnson",
          title: "Deputy CIO",
          department: "Investment Office",
          avatar: "/placeholder-user.jpg",
          initials: "LJ",
          email: "l.johnson@trs.texas.gov",
          phone: "+1 (512) 542-6401",
          yearsAtCompany: 15,
          specialties: ["Fixed Income", "Asset Allocation"],
          lastActive: "1 hour ago",
          bio: "Lisa oversees TRS Texas' fixed income and asset allocation strategies.",
        },
      ],
      documents: [
        {
          id: "doc6",
          name: "Annual Investment Report 2023",
          type: "Report",
          category: "Performance Reports",
          size: "12.3 MB",
          lastModified: "2024-01-10",
          status: "Published",
          description: "Comprehensive annual report on investment performance and strategy.",
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
        setShareMessage(`I wanted to share ${profile.name}'s profile with you.`)
      }
    }
  }, [allocatorId])

  // Share functionality
  const handleCopyLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/screens/manager/allocator-profile?id=${allocatorId}`
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
      setShareMessage(`I wanted to share ${allocator?.name}'s profile with you.`)
    }, 1500)
  }

  // Contact functionality
  const handleContact = async () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setContactSuccess(true)

    setTimeout(() => {
      setShowContactModal(false)
      setContactSuccess(false)
      setContactType("general")
      setContactSubject("")
      setContactMessage("")
    }, 1500)
  }

  // Team messaging functionality
  const handleTeamMessage = async () => {
    if (selectedTeamMembers.length === 0) {
      toast({
        title: "No Recipients Selected",
        description: "Please select at least one team member to message.",
        variant: "destructive",
      })
      return
    }

    if (!teamMessageSubject.trim() || !teamMessageContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setTeamActionSuccess(true)

    setTimeout(() => {
      setShowMessageModal(false)
      setTeamActionSuccess(false)
      setSelectedTeamMembers([])
      setTeamMessageSubject("")
      setTeamMessageContent("")
    }, 1500)
  }

  // Team scheduling functionality
  const handleTeamSchedule = async () => {
    if (selectedTeamMembers.length === 0) {
      toast({
        title: "No Attendees Selected",
        description: "Please select at least one team member for the meeting.",
        variant: "destructive",
      })
      return
    }

    if (!meetingTitle.trim() || !meetingDate || !meetingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in meeting title, date, and time.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setTeamActionSuccess(true)

    setTimeout(() => {
      setShowScheduleModal(false)
      setTeamActionSuccess(false)
      setSelectedTeamMembers([])
      setMeetingTitle("")
      setMeetingDate("")
      setMeetingTime("")
      setMeetingDuration("60")
      setMeetingType("video")
      setMeetingAgenda("")
    }, 1500)
  }

  // Document functionality
  const handleDownloadAll = async () => {
    const filteredDocs = getFilteredDocuments()

    if (!filteredDocs || filteredDocs.length === 0) {
      toast({
        title: "No Documents",
        description: "There are no documents available to download.",
        variant: "destructive",
      })
      return
    }

    // Show initial toast
    toast({
      title: "Download Started",
      description: `Preparing ${filteredDocs.length} documents for download...`,
    })

    try {
      // Create a zip-like download simulation
      for (let i = 0; i < filteredDocs.length; i++) {
        const doc = filteredDocs[i]

        // Simulate file content based on document type
        let content = ""
        let mimeType = "text/plain"
        let extension = ".txt"

        switch (doc.type.toLowerCase()) {
          case "report":
            content = `${doc.name}\n\n${doc.description}\n\nThis is a sample ${doc.type.toLowerCase()} document from ${allocator.name}.\n\nDocument Details:\n- Category: ${doc.category}\n- Status: ${doc.status}\n- Last Modified: ${doc.lastModified}\n- Size: ${doc.size}\n\nContent would normally contain the full ${doc.type.toLowerCase()} data.`
            mimeType = "application/pdf"
            extension = ".pdf"
            break
          case "policy":
            content = `POLICY DOCUMENT\n\n${doc.name}\n\n${doc.description}\n\nEffective Date: ${doc.lastModified}\nStatus: ${doc.status}\n\nThis policy document outlines the guidelines and procedures for ${doc.category.toLowerCase()}.\n\n1. Overview\n2. Scope\n3. Responsibilities\n4. Procedures\n5. Compliance\n\nFor full policy details, please refer to the complete document.`
            mimeType = "application/pdf"
            extension = ".pdf"
            break
          case "framework":
            content = `FRAMEWORK DOCUMENT\n\n${doc.name}\n\n${doc.description}\n\nFramework Version: 1.0\nLast Updated: ${doc.lastModified}\n\nThis framework provides structured guidance for ${doc.category.toLowerCase()}.\n\nKey Components:\n- Principles\n- Methodology\n- Implementation Guidelines\n- Monitoring & Evaluation\n\nDetailed framework content would be included in the full document.`
            mimeType = "application/pdf"
            extension = ".pdf"
            break
          default:
            content = `${doc.name}\n\n${doc.description}\n\nDocument Type: ${doc.type}\nCategory: ${doc.category}\nStatus: ${doc.status}\nLast Modified: ${doc.lastModified}\nSize: ${doc.size}\n\nThis document contains important information related to ${doc.category.toLowerCase()}.`
        }

        // Create blob and download
        const blob = new Blob([content], { type: mimeType })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${doc.name.replace(/[^a-z0-9]/gi, "_")}${extension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        // Add small delay between downloads to prevent browser blocking
        if (i < filteredDocs.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      // Show success toast
      toast({
        title: "Download Complete",
        description: `Successfully downloaded ${filteredDocs.length} documents.`,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading the documents. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSingleDocumentDownload = async (document: any) => {
    try {
      // Simulate file content based on document type
      let content = ""
      let mimeType = "text/plain"
      let extension = ".txt"

      switch (document.type.toLowerCase()) {
        case "report":
          content = `${document.name}\n\n${document.description}\n\nThis is a sample ${document.type.toLowerCase()} document from ${allocator.name}.\n\nDocument Details:\n- Category: ${document.category}\n- Status: ${document.status}\n- Last Modified: ${document.lastModified}\n- Size: ${document.size}\n\nContent would normally contain the full ${document.type.toLowerCase()} data.`
          mimeType = "application/pdf"
          extension = ".pdf"
          break
        case "policy":
          content = `POLICY DOCUMENT\n\n${document.name}\n\n${document.description}\n\nEffective Date: ${document.lastModified}\nStatus: ${document.status}\n\nThis policy document outlines the guidelines and procedures for ${document.category.toLowerCase()}.\n\n1. Overview\n2. Scope\n3. Responsibilities\n4. Procedures\n5. Compliance\n\nFor full policy details, please refer to the complete document.`
          mimeType = "application/pdf"
          extension = ".pdf"
          break
        case "framework":
          content = `FRAMEWORK DOCUMENT\n\n${document.name}\n\n${document.description}\n\nFramework Version: 1.0\nLast Updated: ${document.lastModified}\n\nThis framework provides structured guidance for ${document.category.toLowerCase()}.\n\nKey Components:\n- Principles\n- Methodology\n- Implementation Guidelines\n- Monitoring & Evaluation\n\nDetailed framework content would be included in the full document.`
          mimeType = "application/pdf"
          extension = ".pdf"
          break
        default:
          content = `${document.name}\n\n${document.description}\n\nDocument Type: ${document.type}\nCategory: ${document.category}\nStatus: ${document.status}\nLast Modified: ${document.lastModified}\nSize: ${document.size}\n\nThis document contains important information related to ${document.category.toLowerCase()}.`
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${document.name.replace(/[^a-z0-9]/gi, "_")}${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download Started",
        description: `Downloading ${document.name}...`,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: `Failed to download ${document.name}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleDocumentFilterChange = (filterType: string, value: string) => {
    setDocumentFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleTeamMemberToggle = (memberId: string) => {
    setSelectedTeamMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    )
  }

  const handleDocumentToggle = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const getFilteredDocuments = () => {
    if (!allocator?.documents) return []

    return allocator.documents.filter((doc) => {
      if (documentFilters.type !== "all" && doc.type !== documentFilters.type) return false
      if (documentFilters.status !== "all" && doc.status !== documentFilters.status) return false
      if (documentFilters.category !== "all" && doc.category !== documentFilters.category) return false
      return true
    })
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

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/screens/manager/allocator-profile?id=${allocatorId}`

  return (
    <Screen>
      <div className="container py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={allocator.avatar || "/placeholder.svg"} alt={allocator.name} />
                  <AvatarFallback className="text-2xl">
                    {allocator.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-deep-brand mb-2">{allocator.name}</h1>
                    <p className="text-lg text-base-gray mb-1">{allocator.type}</p>
                    <p className="text-base text-base-gray mb-4">{allocator.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setShowShareModal(true)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                      onClick={() => setShowContactModal(true)}
                    >
                      Contact
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
                  <div className="flex items-center gap-2 text-base-gray">
                    <Mail className="h-4 w-4" />
                    <span>{allocator.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Phone className="h-4 w-4" />
                    <span>{allocator.phone}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.aum}</p>
                    <p className="text-sm text-base-gray">Assets Under Management</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.yearsInBusiness}</p>
                    <p className="text-sm text-base-gray">Years in Business</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{allocator.keyMetrics.activeInvestments}</p>
                    <p className="text-sm text-base-gray">Active Investments</p>
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
            <TabsTrigger value="team">Team</TabsTrigger>
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
                    {allocator.focus.map((area, index) => (
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
                      <span className="text-base-gray">Total Commitments:</span>
                      <span className="font-medium">{allocator.keyMetrics.totalCommitments}</span>
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
                    <Globe className="h-5 w-5" />
                    Geographic Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allocator.keyMetrics.geographicFocus.map((region, index) => (
                      <Badge key={index} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Members
                    </CardTitle>
                    <CardDescription>Key team members at {allocator.shortName}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowMessageModal(true)}
                      disabled={selectedTeamMembers.length === 0}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message ({selectedTeamMembers.length})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowScheduleModal(true)}
                      disabled={selectedTeamMembers.length === 0}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Schedule ({selectedTeamMembers.length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocator.teamMembers?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={selectedTeamMembers.includes(member.id)}
                        onCheckedChange={() => handleTeamMemberToggle(member.id)}
                      />
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-deep-brand text-white">{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-deep-brand">{member.name}</h4>
                        <p className="text-sm text-base-gray">{member.title}</p>
                        <p className="text-sm text-base-gray">{member.department}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-base-gray mt-2">{member.bio}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-base-gray">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-base-gray">
                        <p>{member.yearsAtCompany} years</p>
                        <p>Active {member.lastActive}</p>
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
                  {allocator.recentActivity.map((activity, index) => (
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
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowDocumentFilters(!showDocumentFilters)}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" onClick={handleDownloadAll}>
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showDocumentFilters && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <Select
                          value={documentFilters.type}
                          onValueChange={(value) => handleDocumentFilterChange("type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Report">Report</SelectItem>
                            <SelectItem value="Policy">Policy</SelectItem>
                            <SelectItem value="Framework">Framework</SelectItem>
                            <SelectItem value="Guidelines">Guidelines</SelectItem>
                            <SelectItem value="Checklist">Checklist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <Select
                          value={documentFilters.category}
                          onValueChange={(value) => handleDocumentFilterChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Investment Guidelines">Investment Guidelines</SelectItem>
                            <SelectItem value="Performance Reports">Performance Reports</SelectItem>
                            <SelectItem value="ESG Documentation">ESG Documentation</SelectItem>
                            <SelectItem value="Due Diligence">Due Diligence</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Select
                          value={documentFilters.status}
                          onValueChange={(value) => handleDocumentFilterChange("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Published">Published</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Date Range</Label>
                        <Select
                          value={documentFilters.dateRange}
                          onValueChange={(value) => handleDocumentFilterChange("dateRange", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="last30">Last 30 Days</SelectItem>
                            <SelectItem value="last90">Last 90 Days</SelectItem>
                            <SelectItem value="lastyear">Last Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {getFilteredDocuments().map((document) => (
                    <div
                      key={document.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={selectedDocuments.includes(document.id)}
                        onCheckedChange={() => handleDocumentToggle(document.id)}
                      />
                      <FileText className="h-8 w-8 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-deep-brand">{document.name}</h4>
                        <p className="text-sm text-base-gray mt-1">{document.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {document.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {document.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              document.status === "Active"
                                ? "bg-green-50 text-green-700"
                                : document.status === "Published"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {document.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-base-gray">
                          <span>{document.size}</span>
                          <span>Modified {document.lastModified}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleSingleDocumentDownload(document)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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
              <DialogDescription>Share {allocator.name}'s profile with others</DialogDescription>
            </DialogHeader>

            {shareSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Profile shared successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  {allocator.name}'s profile has been shared with {shareEmail}.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Copy Link Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Profile Link</Label>
                  <div className="flex gap-2">
                    <Input value={profileUrl} readOnly className="flex-1" />
                    <Button variant="outline" onClick={handleCopyLink} className="shrink-0">
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

        {/* Contact Modal */}
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Contact {allocator.name}</DialogTitle>
              <DialogDescription>Send a message to {allocator.name}</DialogDescription>
            </DialogHeader>

            {contactSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Message sent successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  Your message has been sent to {allocator.name}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-type">Contact Type</Label>
                  <Select value={contactType} onValueChange={setContactType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="investment">Investment Opportunity</SelectItem>
                      <SelectItem value="partnership">Partnership Discussion</SelectItem>
                      <SelectItem value="meeting">Meeting Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter message subject..."
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Type your message here..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowContactModal(false)}>
                Cancel
              </Button>
              {!contactSuccess && (
                <Button onClick={handleContact}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Team Message Modal */}
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Message Team Members</DialogTitle>
              <DialogDescription>
                Send a message to {selectedTeamMembers.length} selected team member
                {selectedTeamMembers.length > 1 ? "s" : ""}
              </DialogDescription>
            </DialogHeader>

            {teamActionSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Messages sent successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  Your message has been sent to {selectedTeamMembers.length} team member
                  {selectedTeamMembers.length > 1 ? "s" : ""}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selected Recipients</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {selectedTeamMembers.map((memberId) => {
                      const member = allocator.teamMembers?.find((m) => m.id === memberId)
                      return member ? (
                        <div key={memberId} className="flex items-center gap-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-deep-brand text-white">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {member.name} - {member.title}
                          </span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-subject">Subject</Label>
                  <Input
                    id="team-subject"
                    placeholder="Enter message subject..."
                    value={teamMessageSubject}
                    onChange={(e) => setTeamMessageSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-message">Message</Label>
                  <Textarea
                    id="team-message"
                    placeholder="Type your message here..."
                    value={teamMessageContent}
                    onChange={(e) => setTeamMessageContent(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Cancel
              </Button>
              {!teamActionSuccess && (
                <Button onClick={handleTeamMessage}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Messages
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Team Schedule Modal */}
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule Meeting</DialogTitle>
              <DialogDescription>
                Schedule a meeting with {selectedTeamMembers.length} selected team member
                {selectedTeamMembers.length > 1 ? "s" : ""}
              </DialogDescription>
            </DialogHeader>

            {teamActionSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Meeting scheduled successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">
                  Meeting invitations have been sent to {selectedTeamMembers.length} team member
                  {selectedTeamMembers.length > 1 ? "s" : ""}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selected Attendees</Label>
                  <div className="p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                    {selectedTeamMembers.map((memberId) => {
                      const member = allocator.teamMembers?.find((m) => m.id === memberId)
                      return member ? (
                        <div key={memberId} className="flex items-center gap-2 text-sm mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-deep-brand text-white">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {member.name} - {member.title}
                          </span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input
                    id="meeting-title"
                    placeholder="e.g., Investment Discussion"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-date">Date</Label>
                    <Input
                      id="meeting-date"
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time">Time</Label>
                    <Input
                      id="meeting-time"
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-duration">Duration</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="meeting-type">Meeting Type</Label>
                  <Select value={meetingType} onValueChange={setMeetingType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-agenda">Agenda (Optional)</Label>
                  <Textarea
                    id="meeting-agenda"
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
              {!teamActionSuccess && (
                <Button onClick={handleTeamSchedule}>
                  <CalendarDays className="h-4 w-4 mr-2" />
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
