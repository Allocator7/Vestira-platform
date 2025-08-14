"use client"

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic'

import { Screen } from "../../../../components/Screen"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import {
  ArrowUpRight,
  Calendar,
  Download,
  FileText,
  FolderOpen,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  Star,
  Users,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { SendMessageModal } from "../../../../components/profile-modals/SendMessageModal"
import { ScheduleMeetingModal } from "../../../../components/profile-modals/ScheduleMeetingModal"
import { ShareProfileModal } from "../../../../components/profile-modals/ShareProfileModal"
import { useToast } from "../../../../hooks/use-toast"

export default function ManagerProfilePage() {
  const [activeAssetClassFilter, setActiveAssetClassFilter] = useState("all")
  const [activeYearFilter, setActiveYearFilter] = useState("all")
  const [activeVehicleFilter, setActiveVehicleFilter] = useState("all")
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isStarred, setIsStarred] = useState(false)
  const [connectingUsers, setConnectingUsers] = useState<string[]>([])
  const [selectedMessageContact, setSelectedMessageContact] = useState<string>("")
  const [selectedScheduleContact, setSelectedScheduleContact] = useState<string>("")
  const { toast } = useToast()

  // Mock contacts data for BlackRock
  const managerContacts = [
    {
      id: "1",
      name: "Robert Williams",
      title: "Chief Investment Officer",
      email: "robert.williams@blackrock.com",
      role: "Primary Contact"
    },
    {
      id: "2", 
      name: "James Thompson",
      title: "Client Relationship Manager",
      email: "james.thompson@blackrock.com",
      role: "Client Relations"
    },
    {
      id: "3",
      name: "Lisa Parker", 
      title: "Investment Specialist",
      email: "lisa.parker@blackrock.com",
      role: "Investment Team"
    }
  ]

  const managerInfo = {
    name: "BlackRock",
    primaryContact: "Robert Williams",
    email: "contact@blackrock.com",
    profileUrl: "https://vestira.com/manager/blackrock",
  }

  const handleStarToggle = () => {
    setIsStarred(!isStarred)
    toast({
      title: isStarred ? "Removed from favorites" : "Added to favorites",
      description: `${managerInfo.name} has been ${isStarred ? "removed from" : "added to"} your favorites.`,
    })
  }

  const handleConnect = async (personName: string) => {
    setConnectingUsers((prev) => [...prev, personName])

    // Simulate API call
    setTimeout(() => {
      setConnectingUsers((prev) => prev.filter((name) => name !== personName))
      toast({
        title: "Connection Request Sent",
        description: `Your connection request has been sent to ${personName}.`,
      })
    }, 1000)
  }

  const handleSendMessage = () => {
    setSelectedMessageContact(managerContacts[0].id)
    setIsMessageModalOpen(true)
  }

  const handleScheduleMeeting = () => {
    setSelectedScheduleContact(managerContacts[0].id)
    setIsMeetingModalOpen(true)
  }

  const handleDownloadDocument = (documentName: string) => {
    // Create document content based on the document name
    let documentContent = ""
    const timestamp = new Date().toISOString()
    
    switch (documentName) {
      case "2023 Firm Overview":
        documentContent = `BLACKROCK - 2023 FIRM OVERVIEW

Company: BlackRock, Inc.
Document Type: Firm Overview
Generated: ${timestamp}

EXECUTIVE SUMMARY
BlackRock is the world's largest asset manager with $9.5 trillion in assets under management as of 2023. Founded in 1988, the firm serves institutional and retail investors worldwide through a comprehensive range of investment solutions.

KEY HIGHLIGHTS
• Total AUM: $9.5 Trillion
• Founded: 1988
• Headquarters: New York, NY
• Employees: 18,000+
• Global Presence: 30+ countries

INVESTMENT CAPABILITIES
• Public Equity
• Fixed Income
• Private Equity
• Real Estate
• Infrastructure
• Private Credit
• Multi-Asset Solutions

PERFORMANCE HIGHLIGHTS
• Consistent track record of delivering strong risk-adjusted returns
• Industry-leading technology platform (Aladdin)
• Comprehensive ESG integration across all strategies
• Global scale and local expertise

This document contains confidential information and is intended for authorized recipients only.`
        break
      case "ESG Policy Statement":
        documentContent = `BLACKROCK - ESG POLICY STATEMENT

Company: BlackRock, Inc.
Document Type: ESG Policy Statement
Generated: ${timestamp}

ENVIRONMENTAL, SOCIAL, AND GOVERNANCE (ESG) POLICY

MISSION STATEMENT
BlackRock is committed to integrating ESG considerations into our investment processes and engaging with companies to promote sustainable business practices.

ENVIRONMENTAL FOCUS
• Climate risk assessment and management
• Carbon footprint reduction initiatives
• Renewable energy investment strategies
• Sustainable infrastructure development

SOCIAL RESPONSIBILITY
• Diversity, equity, and inclusion programs
• Community investment and philanthropy
• Human rights and labor standards
• Stakeholder engagement practices

GOVERNANCE EXCELLENCE
• Board diversity and independence
• Executive compensation alignment
• Risk management frameworks
• Transparency and disclosure standards

IMPLEMENTATION
• ESG integration across all investment strategies
• Active ownership and proxy voting
• Regular ESG reporting and disclosure
• Continuous improvement and innovation

This policy statement reflects our commitment to sustainable investing and responsible stewardship of client assets.`
        break
      case "Corporate Responsibility Report":
        documentContent = `BLACKROCK - CORPORATE RESPONSIBILITY REPORT

Company: BlackRock, Inc.
Document Type: Corporate Responsibility Report
Generated: ${timestamp}

CORPORATE RESPONSIBILITY HIGHLIGHTS 2023

OUR COMMITMENT
BlackRock's purpose is to help more and more people experience financial well-being. We believe this starts with being a responsible corporate citizen and contributing to the communities where we live and work.

ENVIRONMENTAL INITIATIVES
• Carbon Neutral Operations: Achieved carbon neutrality for our operations
• Renewable Energy: 100% renewable electricity for our global offices
• Sustainable Finance: $500+ billion in sustainable investment solutions
• Climate Risk: Comprehensive climate risk assessment framework

SOCIAL IMPACT
• Community Investment: $50+ million in philanthropic giving
• Employee Development: 2.5 million training hours completed
• Diversity & Inclusion: 40% women in senior leadership roles
• Financial Education: Reached 1+ million people through financial literacy programs

GOVERNANCE EXCELLENCE
• Board Diversity: 50% independent directors
• Ethics & Compliance: Zero material compliance violations
• Transparency: Comprehensive ESG disclosure and reporting
• Stakeholder Engagement: Regular dialogue with investors, clients, and communities

PERFORMANCE METRICS
• Employee Satisfaction: 85% engagement score
• Client Retention: 95% client retention rate
• Innovation: $1.2 billion invested in technology and innovation
• Sustainability: 25% reduction in operational carbon footprint

This report demonstrates our ongoing commitment to responsible business practices and sustainable value creation.`
        break
      case "Annual Report 2022":
        documentContent = `BLACKROCK - ANNUAL REPORT 2022

Company: BlackRock, Inc.
Document Type: Annual Report
Generated: ${timestamp}

2022 ANNUAL REPORT

LETTER TO SHAREHOLDERS
Dear Shareholders,

2022 was a year of significant challenges and opportunities for BlackRock and the global financial markets. Despite market volatility and economic uncertainty, we remained focused on our mission to help more and more people experience financial well-being.

FINANCIAL HIGHLIGHTS
• Revenue: $17.9 billion (8% increase from 2021)
• Net Income: $5.2 billion
• Diluted EPS: $34.85
• AUM Growth: $9.5 trillion (from $10.0 trillion in 2021)
• Operating Margin: 42.5%

STRATEGIC ACHIEVEMENTS
• Technology Leadership: Continued investment in Aladdin platform
• ESG Integration: Expanded sustainable investment offerings
• Global Expansion: Strengthened presence in key international markets
• Innovation: Launched new investment solutions and services

INVESTMENT PERFORMANCE
• 85% of assets outperformed benchmarks over 3 years
• Strong performance across fixed income and alternatives
• Continued leadership in ETF and index investing
• Robust risk management and compliance framework

OUTLOOK
We remain optimistic about BlackRock's long-term prospects and our ability to deliver value for shareholders while serving our clients' evolving needs.

Larry Fink
Chairman and Chief Executive Officer

This annual report provides a comprehensive overview of our 2022 performance and strategic direction.`
        break
      default:
        documentContent = `DOCUMENT: ${documentName}

Company: BlackRock, Inc.
Document Type: General Document
Generated: ${timestamp}

This is a sample document for ${documentName}. Please contact BlackRock for the complete and official version of this document.

For more information, please visit: www.blackrock.com
Contact: contact@blackrock.com`
    }

    try {
      // Create a blob with the document content
      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      
      // Create a temporary download link
      const link = document.createElement('a')
      link.href = url
      link.download = `${documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      link.style.display = 'none'
      
      // Add to document, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Download Complete",
        description: `${documentName} has been downloaded successfully.`,
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading the document. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Screen>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Manager Profile Card */}
          <div className="w-full md:w-1/3">
            <Card className="vestira-card-minimal">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image src="/abstract-geometric-br.png" alt="BlackRock Logo" fill className="object-cover" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">BlackRock</CardTitle>
                      <CardDescription className="text-lg">Asset Management</CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">Parent Company: BlackRock, Inc.</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStarToggle}
                    className={isStarred ? "text-yellow-500 border-yellow-500" : ""}
                  >
                    <Star className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>contact@blackrock.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+1 (212) 810-5300</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      <a
                        href="https://www.blackrock.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        www.blackrock.com
                      </a>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Key Metrics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground"># of Clients</p>
                      <p className="text-sm font-medium">2,500+</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Funds</p>
                      <p className="text-sm font-medium">150+</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Minimum SMA Size</p>
                      <p className="text-sm font-medium">$50M</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Founded</p>
                      <p className="text-sm font-medium">1988</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Asset Classes</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Public Equity</Badge>
                    <Badge variant="secondary">Fixed Income</Badge>
                    <Badge variant="secondary">Private Equity</Badge>
                    <Badge variant="secondary">Real Estate</Badge>
                    <Badge variant="secondary">Infrastructure</Badge>
                    <Badge variant="secondary">Private Credit</Badge>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button className="w-full" onClick={handleSendMessage}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleScheduleMeeting}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsShareModalOpen(true)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Manager Details */}
          <div className="w-full md:w-2/3 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 pt-4">
                <Card className="vestira-card-minimal">
                  <CardHeader>
                    <CardTitle>About BlackRock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      BlackRock, Inc. is an American multinational investment management corporation based in New York
                      City. Founded in 1988, initially as a risk management and fixed income institutional asset
                      manager, BlackRock is the world's largest asset manager, with US$9.5 trillion in assets under
                      management as of 2023.
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      BlackRock provides investment and technology services to institutional and retail clients
                      worldwide. The firm offers various investment strategies across equity, fixed income,
                      alternatives, and cash management, as well as the investment platform, Aladdin.
                    </p>
                  </CardContent>
                </Card>

                <Card className="vestira-card-minimal">
                  <CardHeader>
                    <CardTitle>Investment Philosophy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      BlackRock's investment philosophy centers on a risk-aware approach that combines fundamental,
                      quantitative, and systematic strategies. The firm emphasizes long-term thinking, diversification,
                      and a focus on risk management across all investment decisions.
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">The firm's approach is guided by:</p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                      <li>Disciplined risk management</li>
                      <li>Integration of sustainability considerations</li>
                      <li>Leveraging technology and data analytics</li>
                      <li>Global perspective with local expertise</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="vestira-card-minimal">
                  <CardHeader>
                    <CardTitle>Asset Allocation Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Asset Classes</h4>
                          <ul className="space-y-1 text-sm">
                            <li className="flex justify-between">
                              <span>Equities</span>
                              <span>42%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Fixed Income</span>
                              <span>35%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Alternatives</span>
                              <span>15%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Cash & Equivalents</span>
                              <span>8%</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Geographic Exposure</h4>
                          <ul className="space-y-1 text-sm">
                            <li className="flex justify-between">
                              <span>North America</span>
                              <span>55%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Europe</span>
                              <span>25%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Asia Pacific</span>
                              <span>15%</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Emerging Markets</span>
                              <span>5%</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">
                          Note: For detailed performance reporting and strategy-specific allocation, please visit the
                          Strategy Data Rooms.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="vestira-card-minimal">
                  <CardHeader>
                    <CardTitle>Recent News</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-2 border-blue-500 pl-4">
                        <p className="text-xs text-muted-foreground">April 15, 2023</p>
                        <h4 className="text-sm font-medium">BlackRock Reports Strong Q1 2023 Results</h4>
                        <p className="text-sm text-muted-foreground">
                          BlackRock reported a 20% increase in assets under management, driven by strong inflows into
                          its ETF products and active equity strategies.
                        </p>
                      </div>
                      <div className="border-l-2 border-blue-500 pl-4">
                        <p className="text-xs text-muted-foreground">March 8, 2023</p>
                        <h4 className="text-sm font-medium">BlackRock Expands Sustainable Investing Platform</h4>
                        <p className="text-sm text-muted-foreground">
                          The firm announced the launch of new climate-focused investment strategies and enhanced ESG
                          data capabilities on its Aladdin platform.
                        </p>
                      </div>
                      <div className="border-l-2 border-blue-500 pl-4">
                        <p className="text-xs text-muted-foreground">February 22, 2023</p>
                        <h4 className="text-sm font-medium">BlackRock Acquires Artificial Intelligence Startup</h4>
                        <p className="text-sm text-muted-foreground">
                          BlackRock announced the acquisition of a fintech startup specializing in AI-driven investment
                          analysis to enhance its technology offerings.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="pt-4">
                <Card className="vestira-card-minimal">
                  <CardHeader>
                    <CardTitle>Leadership Team</CardTitle>
                    <CardDescription>Key executives and investment professionals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Larry Fink</p>
                          <p className="text-xs text-muted-foreground">Chairman and CEO</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Robert Kapito</p>
                          <p className="text-xs text-muted-foreground">President</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Gary Shedlin</p>
                          <p className="text-xs text-muted-foreground">Chief Financial Officer</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mark Wiedman</p>
                          <p className="text-xs text-muted-foreground">Head of International and Corporate Strategy</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="vestira-card-minimal mt-4">
                  <CardHeader>
                    <CardTitle>Investment Decision Makers</CardTitle>
                    <CardDescription>Key professionals involved in investment decisions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sarah Johnson</p>
                          <p className="text-xs text-muted-foreground">Head of Equities</p>
                          <p className="text-xs text-primary mt-1">Investment Committee Member</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Michael Chen</p>
                          <p className="text-xs text-muted-foreground">Fixed Income Specialist</p>
                          <p className="text-xs text-primary mt-1">Investment Committee Member</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">David Wilson</p>
                          <p className="text-xs text-muted-foreground">Alternative Investments Lead</p>
                          <p className="text-xs text-primary mt-1">Investment Committee Member</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Emily Rodriguez</p>
                          <p className="text-xs text-muted-foreground">ESG Strategy Director</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="vestira-card-minimal mt-4">
                  <CardHeader>
                    <CardTitle>Key Contacts</CardTitle>
                    <CardDescription>Primary investment team members at BlackRock</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold">Robert Williams</p>
                              <Badge variant="secondary">Primary</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Chief Investment Officer</p>
                            <p className="text-xs text-muted-foreground">Fixed Income Strategies</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setIsMessageModalOpen(true)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setIsMeetingModalOpen(true)}>
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">James Thompson</p>
                              <p className="text-xs text-muted-foreground">Client Relationship Manager</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConnect("James Thompson")}
                            disabled={connectingUsers.includes("James Thompson")}
                          >
                            {connectingUsers.includes("James Thompson") ? "Connecting..." : "Connect"}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Lisa Parker</p>
                              <p className="text-xs text-muted-foreground">Investment Specialist</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConnect("Lisa Parker")}
                            disabled={connectingUsers.includes("Lisa Parker")}
                          >
                            {connectingUsers.includes("Lisa Parker") ? "Connecting..." : "Connect"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="pt-4">
                <Card className="vestira-card-minimal">
                  <CardHeader>
                    <CardTitle>Organization-Level Documents</CardTitle>
                    <CardDescription>Important files and resources about the firm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">2023 Firm Overview</p>
                            <p className="text-xs text-muted-foreground">PDF • 2.4 MB • Updated 3 months ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument("2023 Firm Overview")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">ESG Policy Statement</p>
                            <p className="text-xs text-muted-foreground">PDF • 1.8 MB • Updated 5 months ago</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadDocument("ESG Policy Statement")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Corporate Responsibility Report</p>
                            <p className="text-xs text-muted-foreground">PDF • 3.2 MB • Updated 1 month ago</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadDocument("Corporate Responsibility Report")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Annual Report 2022</p>
                            <p className="text-xs text-muted-foreground">PDF • 5.7 MB • Updated 6 months ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument("Annual Report 2022")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button asChild>
                        <Link href="/screens/allocator/strategy-data-rooms">
                          <FolderOpen className="mr-2 h-4 w-4" />
                          View Strategy-Specific Documents
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="pt-4">
                <Card className="vestira-card-minimal">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest document and data room activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Document Viewed</p>
                          <p className="text-xs text-muted-foreground">
                            "Global Equity Fund - Q2 2023 Performance Report"
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Data Room Accessed</p>
                          <p className="text-xs text-muted-foreground">"Global Equity Fund" data room</p>
                          <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Document Downloaded</p>
                          <p className="text-xs text-muted-foreground">
                            "ESG Integration: Best Practices for Institutional Investors"
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Data Room Accessed</p>
                          <p className="text-xs text-muted-foreground">"Sustainable Fixed Income" data room</p>
                          <p className="text-xs text-muted-foreground mt-1">1 month ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientName={managerContacts.find(c => c.id === selectedMessageContact)?.name || managerInfo.primaryContact}
        recipientEmail={managerContacts.find(c => c.id === selectedMessageContact)?.email || managerInfo.email}
        organizationName={managerInfo.name}
        contactSelector={
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Contact</label>
            <Select value={selectedMessageContact} onValueChange={setSelectedMessageContact}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a contact" />
              </SelectTrigger>
              <SelectContent>
                {managerContacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-xs text-gray-500">{contact.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <ScheduleMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        recipientName={managerContacts.find(c => c.id === selectedScheduleContact)?.name || managerInfo.primaryContact}
        recipientEmail={managerContacts.find(c => c.id === selectedScheduleContact)?.email || managerInfo.email}
        organizationName={managerInfo.name}
        contactSelector={
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Contact</label>
            <Select value={selectedScheduleContact} onValueChange={setSelectedScheduleContact}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a contact" />
              </SelectTrigger>
              <SelectContent>
                {managerContacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-xs text-gray-500">{contact.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profileName={managerInfo.name}
        profileUrl={managerInfo.profileUrl}
      />
    </Screen>
  )
}
