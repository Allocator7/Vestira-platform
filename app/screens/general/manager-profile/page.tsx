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
  Users,
  UserPlus,
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

interface Contact {
  name: string
  title: string
  role: string
  email: string
  phone: string
  isConnected: boolean
}

export default function ManagerProfilePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const managerId = searchParams.get("id")
  const viewType = searchParams.get("view")
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Modal states
  const [showShareModal, setShowShareModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedMessageContact, setSelectedMessageContact] = useState<Contact | null>(null)
  const [selectedScheduleContact, setSelectedScheduleContact] = useState<Contact | null>(null)

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

  // Connection modal states
  const [connectionMessage, setConnectionMessage] = useState("")
  const [connectionSuccess, setConnectionSuccess] = useState(false)

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
      contacts: [
        {
          name: "David Rodriguez",
          title: "Managing Partner",
          role: "Primary Contact",
          email: "david.rodriguez@growthcapital.com",
          phone: "+1 (415) 555-0123",
          isConnected: true,
        },
        {
          name: "Sarah Johnson",
          title: "Senior Vice President",
          role: "Investment Contact",
          email: "sarah.johnson@growthcapital.com",
          phone: "+1 (415) 555-0124",
          isConnected: false,
        },
        {
          name: "Michael Chen",
          title: "Director of Investor Relations",
          role: "IR Contact",
          email: "michael.chen@growthcapital.com",
          phone: "+1 (415) 555-0125",
          isConnected: false,
        },
      ],
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
      contacts: [
        {
          name: "Sarah Chen",
          title: "Portfolio Manager",
          role: "Primary Contact",
          email: "sarah.chen@sustainableequity.com",
          phone: "+1 (212) 555-0456",
          isConnected: true,
        },
        {
          name: "Lisa Thompson",
          title: "ESG Director",
          role: "ESG Contact",
          email: "lisa.thompson@sustainableequity.com",
          phone: "+1 (212) 555-0457",
          isConnected: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-14",
          activity: "Published Q4 ESG Impact Report",
          type: "Reporting",
        },
        {
          date: "2024-01-10",
          activity: "Launched new sustainable bond fund",
          type: "Fund Launch",
        },
        {
          date: "2024-01-05",
          activity: "Achieved carbon neutrality across portfolio",
          type: "ESG Milestone",
        },
      ],
      investments: [
        {
          company: "GreenTech Solutions",
          sector: "Clean Technology",
          stage: "Public",
          investment: "$75M",
          status: "Active",
          multiple: "1.6x",
        },
        {
          company: "Solar Energy Corp",
          sector: "Renewable Energy",
          stage: "Public",
          investment: "$120M",
          status: "Active",
          multiple: "2.3x",
        },
      ],
      documents: [
        {
          id: "doc3",
          name: "ESG Investment Policy",
          type: "Document",
          category: "Policy",
          size: "2.1 MB",
          lastModified: "2024-01-12",
          status: "Active",
        },
        {
          id: "doc4",
          name: "Q4 Impact Report",
          type: "Report",
          category: "Reporting",
          size: "8.7 MB",
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
      email: "m.thompson@infrastructurecapital.com",
      phone: "+44 20 7123 4567",
      avatar: "/placeholder-user.jpg",
      aum: "$3.8B",
      founded: "2002",
      yearsInBusiness: 22,
      experience: "22 years",
      focus: ["Infrastructure Debt", "Real Estate Debt", "Transportation", "Utilities"],
      about:
        "Michael Thompson is a Senior Managing Director at Infrastructure Capital, with over 22 years of experience in infrastructure investment and debt financing across global markets.",
      keyMetrics: {
        totalFunds: 6,
        activeInvestments: 78,
        portfolioCompanies: 156,
        geographicFocus: ["Europe", "North America", "Asia Pacific"],
      },
      trackRecord: {
        irr: "12.8%",
        multiple: "1.7x",
        totalReturns: "$2.1B",
      },
      contacts: [
        {
          name: "Michael Thompson",
          title: "Senior Managing Director",
          role: "Primary Contact",
          email: "michael.thompson@infrastructurecapital.com",
          phone: "+44 20 7123 4567",
          isConnected: true,
        },
        {
          name: "Emma Wilson",
          title: "Head of Infrastructure",
          role: "Infrastructure Contact",
          email: "emma.wilson@infrastructurecapital.com",
          phone: "+44 20 7123 4568",
          isConnected: false,
        },
        {
          name: "James Anderson",
          title: "Director of Real Estate",
          role: "Real Estate Contact",
          email: "james.anderson@infrastructurecapital.com",
          phone: "+44 20 7123 4569",
          isConnected: false,
        },
        {
          name: "Rachel Green",
          title: "Investor Relations Manager",
          role: "IR Contact",
          email: "rachel.green@infrastructurecapital.com",
          phone: "+44 20 7123 4570",
          isConnected: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-13",
          activity: "Closed €800M infrastructure debt fund",
          type: "Fundraising",
        },
        {
          date: "2024-01-08",
          activity: "Acquired major toll road concession",
          type: "Investment",
        },
        {
          date: "2024-01-03",
          activity: "Refinanced renewable energy portfolio",
          type: "Refinancing",
        },
      ],
      investments: [
        {
          company: "European Toll Roads",
          sector: "Transportation",
          stage: "Infrastructure",
          investment: "€200M",
          status: "Active",
          multiple: "1.4x",
        },
        {
          company: "Solar Farm Network",
          sector: "Renewable Energy",
          stage: "Infrastructure",
          investment: "€150M",
          status: "Active",
          multiple: "1.8x",
        },
      ],
      documents: [
        {
          id: "doc5",
          name: "Infrastructure Fund V PPM",
          type: "Document",
          category: "Fund Materials",
          size: "15.2 MB",
          lastModified: "2024-01-13",
          status: "Active",
        },
        {
          id: "doc6",
          name: "Geographic Investment Strategy",
          type: "Document",
          category: "Strategy",
          size: "4.8 MB",
          lastModified: "2024-01-09",
          status: "Active",
        },
      ],
    },
    4: {
      name: "Jennifer Park",
      title: "Founding Partner",
      firm: "Venture Dynamics",
      firmType: "Venture Capital",
      location: "Palo Alto, CA",
      website: "https://venturedynamics.com",
      email: "j.park@venturedynamics.com",
      phone: "+1 (650) 555-0789",
      avatar: "/placeholder-user.jpg",
      aum: "$800M",
      founded: "2009",
      yearsInBusiness: 15,
      experience: "15 years",
      focus: ["Venture Capital", "Growth Equity", "Technology", "AI/ML"],
      about:
        "Jennifer Park is a Founding Partner at Venture Dynamics, focusing on early-stage technology investments with particular expertise in artificial intelligence and machine learning startups.",
      keyMetrics: {
        totalFunds: 3,
        activeInvestments: 67,
        portfolioCompanies: 89,
        geographicFocus: ["Silicon Valley", "Global"],
      },
      trackRecord: {
        irr: "28.4%",
        multiple: "3.2x",
        totalReturns: "$750M",
      },
      contacts: [
        {
          name: "Jennifer Park",
          title: "Founding Partner",
          role: "Primary Contact",
          email: "jennifer.park@venturedynamics.com",
          phone: "+1 (650) 555-0789",
          isConnected: true,
        },
        {
          name: "Alex Rodriguez",
          title: "Partner",
          role: "Investment Contact",
          email: "alex.rodriguez@venturedynamics.com",
          phone: "+1 (650) 555-0790",
          isConnected: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-12",
          activity: "Led $25M Series A in AI startup",
          type: "Investment",
        },
        {
          date: "2024-01-07",
          activity: "Exited cybersecurity company for 5.2x return",
          type: "Exit",
        },
        {
          date: "2024-01-02",
          activity: "Launched Fund III with $300M target",
          type: "Fundraising",
        },
      ],
      investments: [
        {
          company: "AI Solutions Inc",
          sector: "Artificial Intelligence",
          stage: "Series A",
          investment: "$25M",
          status: "Active",
          multiple: "2.8x",
        },
        {
          company: "CyberSecure",
          sector: "Cybersecurity",
          stage: "Series B",
          investment: "$40M",
          status: "Exited",
          multiple: "5.2x",
        },
      ],
      documents: [
        {
          id: "doc7",
          name: "Fund III Investment Thesis",
          type: "Document",
          category: "Strategy",
          size: "6.3 MB",
          lastModified: "2024-01-12",
          status: "Active",
        },
        {
          id: "doc8",
          name: "AI Investment Landscape Report",
          type: "Report",
          category: "Research",
          size: "9.1 MB",
          lastModified: "2024-01-10",
          status: "Active",
        },
      ],
    },
    5: {
      name: "Robert Williams",
      title: "Chief Investment Officer",
      firm: "Fixed Income Strategies",
      firmType: "Credit",
      location: "Chicago, IL",
      website: "https://fixedincomestrategies.com",
      email: "r.williams@fixedincomestrategies.com",
      phone: "+1 (312) 555-0234",
      avatar: "/placeholder-user.jpg",
      aum: "$4.2B",
      founded: "1999",
      yearsInBusiness: 25,
      experience: "25 years",
      focus: ["High Yield Bonds", "Corporate Private Placements", "Direct Lending"],
      about:
        "Robert Williams serves as Chief Investment Officer at Fixed Income Strategies, with 25 years of experience in credit markets and alternative lending strategies.",
      keyMetrics: {
        totalFunds: 8,
        activeInvestments: 234,
        portfolioCompanies: 456,
        geographicFocus: ["North America", "Europe"],
      },
      trackRecord: {
        irr: "9.8%",
        multiple: "1.4x",
        totalReturns: "$1.8B",
      },
      contacts: [
        {
          name: "Robert Williams",
          title: "Chief Investment Officer",
          role: "Primary Contact",
          email: "robert.williams@fixedincomestrategies.com",
          phone: "+1 (312) 555-0234",
          isConnected: true,
        },
        {
          name: "Maria Garcia",
          title: "Head of Credit",
          role: "Credit Contact",
          email: "maria.garcia@fixedincomestrategies.com",
          phone: "+1 (312) 555-0235",
          isConnected: false,
        },
        {
          name: "David Lee",
          title: "Director of Private Placements",
          role: "Private Placements Contact",
          email: "david.lee@fixedincomestrategies.com",
          phone: "+1 (312) 555-0236",
          isConnected: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-11",
          activity: "Closed $500M direct lending fund",
          type: "Fundraising",
        },
        {
          date: "2024-01-06",
          activity: "Originated $75M private placement",
          type: "Investment",
        },
        {
          date: "2024-01-01",
          activity: "Refinanced high-yield bond portfolio",
          type: "Refinancing",
        },
      ],
      investments: [
        {
          company: "Manufacturing Corp",
          sector: "Industrial",
          stage: "Private Placement",
          investment: "$75M",
          status: "Active",
          multiple: "1.2x",
        },
        {
          company: "Healthcare Services",
          sector: "Healthcare",
          stage: "Direct Lending",
          investment: "$50M",
          status: "Active",
          multiple: "1.3x",
        },
      ],
      documents: [
        {
          id: "doc9",
          name: "Direct Lending Fund PPM",
          type: "Document",
          category: "Fund Materials",
          size: "18.7 MB",
          lastModified: "2024-01-11",
          status: "Active",
        },
        {
          id: "doc10",
          name: "Credit Risk Management Policy",
          type: "Document",
          category: "Policy",
          size: "3.9 MB",
          lastModified: "2024-01-08",
          status: "Active",
        },
      ],
    },
    6: {
      name: "Lisa Anderson",
      title: "Managing Director",
      firm: "Real Estate Ventures",
      firmType: "Real Estate",
      location: "Los Angeles, CA",
      website: "https://realestateventures.com",
      email: "l.anderson@realestateventures.com",
      phone: "+1 (310) 555-0567",
      avatar: "/placeholder-user.jpg",
      aum: "$1.9B",
      founded: "2008",
      yearsInBusiness: 16,
      experience: "16 years",
      focus: ["Real Estate Equity", "Commercial Mortgage Loans", "Multifamily", "Office"],
      about:
        "Lisa Anderson is Managing Director at Real Estate Ventures, specializing in commercial real estate investments and mortgage lending across major metropolitan markets.",
      keyMetrics: {
        totalFunds: 5,
        activeInvestments: 89,
        portfolioCompanies: 167,
        geographicFocus: ["United States", "Canada"],
      },
      trackRecord: {
        irr: "14.2%",
        multiple: "2.1x",
        totalReturns: "$850M",
      },
      contacts: [
        {
          name: "Lisa Anderson",
          title: "Managing Director",
          role: "Primary Contact",
          email: "lisa.anderson@realestateventures.com",
          phone: "+1 (310) 555-0567",
          isConnected: true,
        },
        {
          name: "Tom Martinez",
          title: "Head of Acquisitions",
          role: "Acquisitions Contact",
          email: "tom.martinez@realestateventures.com",
          phone: "+1 (310) 555-0568",
          isConnected: false,
        },
      ],
      recentActivity: [
        {
          date: "2024-01-10",
          activity: "Acquired $200M office portfolio",
          type: "Investment",
        },
        {
          date: "2024-01-05",
          activity: "Refinanced multifamily portfolio",
          type: "Refinancing",
        },
        {
          date: "2024-01-01",
          activity: "Launched new real estate fund",
          type: "Fund Launch",
        },
      ],
      investments: [
        {
          company: "Downtown Office Tower",
          sector: "Commercial Real Estate",
          stage: "Acquisition",
          investment: "$200M",
          status: "Active",
          multiple: "1.9x",
        },
        {
          company: "Multifamily Complex",
          sector: "Residential Real Estate",
          stage: "Development",
          investment: "$150M",
          status: "Active",
          multiple: "2.3x",
        },
      ],
      documents: [
        {
          id: "doc11",
          name: "Real Estate Fund IV PPM",
          type: "Document",
          category: "Fund Materials",
          size: "22.1 MB",
          lastModified: "2024-01-10",
          status: "Active",
        },
        {
          id: "doc12",
          name: "Market Analysis Report",
          type: "Report",
          category: "Research",
          size: "7.4 MB",
          lastModified: "2024-01-07",
          status: "Active",
        },
      ],
    },
  }

  // Firm profiles data for when view=firm
  const firmProfiles = {
    1: {
      name: "Growth Capital Partners",
      description: "Leading private equity firm focused on growth-stage technology and healthcare companies",
      firmType: "Private Equity",
      location: "San Francisco, CA",
      website: "https://growthcapitalpartners.com",
      email: "contact@growthcapital.com",
      phone: "+1 (415) 555-0123",
      avatar: "/placeholder-user.jpg",
      aum: "$2.5B",
      founded: "2008",
      yearsInBusiness: 16,
      focus: ["Growth Equity", "Technology", "Healthcare", "Buyouts"],
      about: "Growth Capital Partners is a leading private equity firm with over 16 years of experience in growth-stage technology and healthcare investments. We focus on partnering with exceptional entrepreneurs to build category-defining companies.",
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
      contacts: [
        {
          name: "David Rodriguez",
          title: "Managing Partner",
          role: "Primary Contact",
          email: "david.rodriguez@growthcapital.com",
          phone: "+1 (415) 555-0123",
          isConnected: true,
        },
        {
          name: "Sarah Johnson",
          title: "Senior Vice President",
          role: "Investment Contact",
          email: "sarah.johnson@growthcapital.com",
          phone: "+1 (415) 555-0124",
          isConnected: false,
        },
        {
          name: "Michael Chen",
          title: "Director of Investor Relations",
          role: "IR Contact",
          email: "michael.chen@growthcapital.com",
          phone: "+1 (415) 555-0125",
          isConnected: false,
        },
      ],
    },
    2: {
      name: "Sustainable Equity Fund",
      description: "ESG-focused portfolio manager specializing in sustainable equity strategies and impact investing",
      firmType: "Hedge Fund",
      location: "New York, NY",
      website: "https://sustainableequity.com",
      email: "contact@sustainableequity.com",
      phone: "+1 (212) 555-0123",
      avatar: "/placeholder-user.jpg",
      aum: "$1.2B",
      founded: "2015",
      yearsInBusiness: 9,
      focus: ["ESG/Sustainable Equity", "Long/Short Equity", "Impact Investing"],
      about: "Sustainable Equity Fund is dedicated to generating superior returns while making a positive impact on society and the environment through responsible investment strategies.",
      keyMetrics: {
        totalFunds: 2,
        activeInvestments: 45,
        portfolioCompanies: 78,
        geographicFocus: ["North America", "Europe"],
      },
      trackRecord: {
        irr: "18.2%",
        multiple: "2.1x",
        totalReturns: "$450M",
      },
      contacts: [
        {
          name: "Sarah Chen",
          title: "Portfolio Manager",
          role: "Primary Contact",
          email: "sarah@sustainableequity.com",
          phone: "+1 (212) 555-0123",
          isConnected: true,
        },
        {
          name: "Lisa Thompson",
          title: "ESG Director",
          role: "ESG Contact",
          email: "lisa.thompson@sustainableequity.com",
          phone: "+1 (212) 555-0124",
          isConnected: false,
        },
      ],
    },
    3: {
      name: "Infrastructure Capital",
      description: "Infrastructure investment specialist with extensive experience in debt and equity investments across global markets",
      firmType: "Infrastructure",
      location: "London, UK",
      website: "https://infrastructurecapital.com",
      email: "contact@infrastructurecapital.com",
      phone: "+44 20 7123 4567",
      avatar: "/placeholder-user.jpg",
      aum: "$3.8B",
      founded: "2002",
      yearsInBusiness: 22,
      focus: ["Infrastructure Debt", "Real Estate Debt", "Transportation", "Utilities"],
      about: "Infrastructure Capital is a global infrastructure investment firm with over 22 years of experience in infrastructure debt and equity investments across transportation, utilities, and real estate sectors.",
      keyMetrics: {
        totalFunds: 6,
        activeInvestments: 78,
        portfolioCompanies: 156,
        geographicFocus: ["Europe", "North America", "Asia Pacific"],
      },
      trackRecord: {
        irr: "12.8%",
        multiple: "1.7x",
        totalReturns: "$2.1B",
      },
      contacts: [
        {
          name: "Michael Thompson",
          title: "Senior Managing Director",
          role: "Primary Contact",
          email: "michael.thompson@infrastructurecapital.com",
          phone: "+44 20 7123 4567",
          isConnected: true,
        },
        {
          name: "Emma Wilson",
          title: "Head of Infrastructure",
          role: "Infrastructure Contact",
          email: "emma.wilson@infrastructurecapital.com",
          phone: "+44 20 7123 4568",
          isConnected: false,
        },
      ],
    },
  }

  // Determine which profile to show based on view parameter
  const currentProfile = viewType === "firm" ? firmProfiles[managerId as keyof typeof firmProfiles] : managerProfiles[managerId as keyof typeof managerProfiles]
  const isFirmView = viewType === "firm"

  const [manager, setManager] = useState<any>(null)

  useEffect(() => {
    if (managerId) {
      if (viewType === "firm") {
        // For firm view, use firmProfiles if available, otherwise fall back to managerProfiles
        const firmProfile = firmProfiles[managerId as keyof typeof firmProfiles]
        if (firmProfile) {
          setManager(firmProfile)
        } else {
          // Fall back to manager profile if firm profile doesn't exist
          const managerProfile = managerProfiles[managerId as keyof typeof managerProfiles]
          if (managerProfile) {
            setManager(managerProfile)
          }
        }
      } else {
        // For personal view, use managerProfiles
        const managerProfile = managerProfiles[managerId as keyof typeof managerProfiles]
        if (managerProfile) {
          setManager(managerProfile)
        }
      }
    }
  }, [managerId, viewType])

  const handleSendMessage = () => {
    setSelectedMessageContact(manager.contacts[0])
    setShowMessageModal(true)
  }

  const handleScheduleMeeting = () => {
    setSelectedScheduleContact(manager.contacts[0])
    setShowScheduleModal(true)
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleRequestConnection = (contact: Contact) => {
    setSelectedContact(contact)
    setShowConnectionModal(true)
  }

  const handleConnectionSubmit = () => {
    if (selectedContact) {
      setConnectionSuccess(true)
      setTimeout(() => {
        setShowConnectionModal(false)
        setConnectionSuccess(false)
        setConnectionMessage("")
        setSelectedContact(null)
        toast({
          title: "Connection Request Sent",
          description: `Your connection request to ${selectedContact.name} has been sent successfully.`,
        })
      }, 2000)
    }
  }

  const handleMessageSubmit = () => {
    setMessageSuccess(true)
    setTimeout(() => {
      setShowMessageModal(false)
      setMessageSuccess(false)
      setMessageSubject("")
      setMessageContent("")
      setMessagePriority("normal")
      setSelectedMessageContact(null)
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedMessageContact?.name || manager.name}.`,
      })
    }, 2000)
  }

  const handleScheduleSubmit = () => {
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
      setSelectedScheduleContact(null)
      toast({
        title: "Meeting Scheduled",
        description: `Your meeting with ${selectedScheduleContact?.name || manager.name} has been scheduled successfully.`,
      })
    }, 2000)
  }

  const handleShareSubmit = () => {
    setShareSuccess(true)
    setTimeout(() => {
      setShowShareModal(false)
      setShareSuccess(false)
      setShareEmail("")
      setShareMessage("")
      toast({
        title: "Profile Shared",
        description: "The profile has been shared successfully.",
      })
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!manager) {
    return (
      <Screen>
        <div className="container py-8 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-deepBrand mb-4">Manager Not Found</h1>
            <p className="text-base-gray">The requested manager profile could not be found.</p>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={manager.avatar} alt={manager.name} />
              <AvatarFallback className="text-2xl bg-electric-blue/10 text-electric-blue">
                {manager.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-deepBrand mb-2">
                    {isFirmView ? manager.name : manager.name}
                  </h1>
                  <p className="text-xl text-base-gray mb-1">
                    {isFirmView ? manager.description : manager.title}
                  </p>
                  {!isFirmView && (
                    <p className="text-lg font-semibold text-deepBrand mb-3">{manager.firm}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-base-gray">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{manager.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{manager.firmType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>AUM: {manager.aum}</span>
                    </div>
                    {isFirmView && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Founded: {manager.founded}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={handleScheduleMeeting}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
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
                  <p className="text-base-gray leading-relaxed">
                    {isFirmView ? manager.about : manager.about}
                  </p>
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
                    {manager.focus.map((area: string, index: number) => (
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
                      <span className="text-base-gray"># of Clients:</span>
                      <span className="font-medium">{manager.keyMetrics.totalFunds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Active Funds:</span>
                      <span className="font-medium">{manager.keyMetrics.activeInvestments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-gray">Minimum SMA Size:</span>
                      <span className="font-medium">$5M</span>
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
                    {manager.keyMetrics.geographicFocus.map((region: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contacts
                  </CardTitle>
                  <CardDescription>Team members and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {manager.contacts.map((contact: Contact, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-electric-blue/10 text-electric-blue">
                              {contact.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-deepBrand">{contact.name}</h4>
                            <p className="text-sm text-base-gray">{contact.title}</p>
                            <p className="text-xs text-electric-blue font-medium">{contact.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.isConnected ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestConnection(contact)}
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Connect
                            </Button>
                          )}
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
                    <Input value={`${typeof window !== "undefined" ? window.location.origin : ""}/screens/general/manager-profile?id=${managerId}`} readOnly className="flex-1" />
                    <Button variant="outline" onClick={copyToClipboard} className="shrink-0 bg-transparent">
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
                <Button onClick={handleShareSubmit}>
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
                Send a message to a contact at {manager.firm}
              </DialogDescription>
            </DialogHeader>

            {messageSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Message sent successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">Your message has been sent to {selectedMessageContact?.name || manager.name}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact</Label>
                    <Select value={selectedMessageContact?.name || ""} onValueChange={(value) => {
                      const contact = manager.contacts.find(c => c.name === value)
                      setSelectedMessageContact(contact || null)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {manager.contacts.map((contact, index) => (
                          <SelectItem key={index} value={contact.name}>
                            <div className="flex flex-col">
                              <span className="font-medium">{contact.name}</span>
                              <span className="text-xs text-gray-500">{contact.title} • {contact.role}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                {selectedMessageContact && (
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" value={`${selectedMessageContact.name} <${selectedMessageContact.email}>`} disabled />
                  </div>
                )}

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
                <Button onClick={handleMessageSubmit} disabled={!selectedMessageContact}>
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
              <DialogDescription>Schedule a meeting with a contact at {manager.firm}</DialogDescription>
            </DialogHeader>

            {scheduleSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-center">Meeting scheduled successfully!</p>
                <p className="text-sm text-center mt-1 text-base-gray">Your meeting with {selectedScheduleContact?.name || manager.name} has been scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Select value={selectedScheduleContact?.name || ""} onValueChange={(value) => {
                    const contact = manager.contacts.find(c => c.name === value)
                    setSelectedScheduleContact(contact || null)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {manager.contacts.map((contact, index) => (
                        <SelectItem key={index} value={contact.name}>
                          <div className="flex flex-col">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-xs text-gray-500">{contact.title} • {contact.role}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter meeting title..."
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="type">Meeting Type</Label>
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
                <Button onClick={handleScheduleSubmit} disabled={!selectedScheduleContact}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Connection Request Modal */}
        <Dialog open={showConnectionModal} onOpenChange={setShowConnectionModal}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Request Connection
              </DialogTitle>
              <DialogDescription>
                Send a connection request to {selectedContact?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="connectionMessage">Message (Optional)</Label>
                <Textarea
                  id="connectionMessage"
                  placeholder="Add a personal message..."
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConnectionModal(false)}>
                Cancel
              </Button>
              {!connectionSuccess && (
                <Button onClick={handleConnectionSubmit}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Screen>
  )
}
