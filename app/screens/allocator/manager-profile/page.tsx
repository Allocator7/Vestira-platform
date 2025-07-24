"use client"

import { Screen } from "../../../../components/Screen"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
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
  const { toast } = useToast()

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

  const handleDownloadDocument = (documentName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${documentName}...`,
    })
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
                  <h3 className="text-sm font-medium">Key Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">AUM</p>
                      <p className="text-sm font-medium">$9.5 Trillion</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Founded</p>
                      <p className="text-sm font-medium">1988</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Headquarters</p>
                      <p className="text-sm font-medium">New York, NY</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Employees</p>
                      <p className="text-sm font-medium">18,000+</p>
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
                  <Button className="w-full" onClick={() => setIsMessageModalOpen(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setIsMeetingModalOpen(true)}
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
        recipientName={managerInfo.primaryContact}
        recipientEmail={managerInfo.email}
      />

      <ScheduleMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        recipientName={managerInfo.primaryContact}
        recipientEmail={managerInfo.email}
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
