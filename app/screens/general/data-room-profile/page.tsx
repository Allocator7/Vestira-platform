"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Search,
  Download,
  Eye,
  FileText,
  Users,
  Calendar,
  Shield,
  Clock,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowLeft,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
} from "lucide-react"
import { SendMessageModal } from "@/components/profile-modals/SendMessageModal"
import { useToast } from "@/hooks/use-toast"

// Mock data for the data room
const dataRoomData = {
  id: "1",
  name: "BlackRock Infrastructure Fund IV",
  manager: "BlackRock",
  allocator: "CalPERS",
  type: "Infrastructure",
  status: "Active",
  accessLevel: "Full Access",
  description:
    "Comprehensive due diligence materials for BlackRock's latest infrastructure fund focusing on sustainable infrastructure investments across North America and Europe.",
  avatar: "/abstract-geometric-br.png",
  lastUpdated: "2 hours ago",
  deadline: "Dec 15, 2024",
  participants: 8,
  totalDocuments: 127,
  completionRate: 78,
  owner: {
    name: "Sarah Johnson",
    title: "Managing Director",
    email: "sarah.johnson@blackrock.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  security: {
    encryption: "AES-256",
    compliance: ["SOC 2", "ISO 27001", "GDPR"],
    lastAudit: "Oct 2024",
    accessLog: "Real-time monitoring",
  },
}

// Mock documents data
const documentsData = [
  {
    id: 1,
    name: "Fund Overview Presentation",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "2 hours ago",
    category: "Overview",
    status: "Updated",
    downloadCount: 12,
    views: 45,
  },
  {
    id: 2,
    name: "Investment Strategy Document",
    type: "PDF",
    size: "1.8 MB",
    lastModified: "1 day ago",
    category: "Strategy",
    status: "New",
    downloadCount: 8,
    views: 23,
  },
  {
    id: 3,
    name: "Financial Projections",
    type: "Excel",
    size: "856 KB",
    lastModified: "3 days ago",
    category: "Financials",
    status: "Reviewed",
    downloadCount: 15,
    views: 67,
  },
  {
    id: 4,
    name: "ESG Impact Report",
    type: "PDF",
    size: "3.2 MB",
    lastModified: "1 week ago",
    category: "ESG",
    status: "Final",
    downloadCount: 22,
    views: 89,
  },
  {
    id: 5,
    name: "Legal Documentation",
    type: "PDF",
    size: "4.1 MB",
    lastModified: "2 weeks ago",
    category: "Legal",
    status: "Under Review",
    downloadCount: 5,
    views: 12,
  },
]

// Mock activity data
const activityData = [
  {
    id: 1,
    type: "document_update",
    title: "Document Updated",
    description: "Fund Overview Presentation was updated by Sarah Johnson",
    timestamp: "2 hours ago",
    user: "Sarah Johnson",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "user_joined",
    title: "New Participant",
    description: "Michael Chen joined the data room",
    timestamp: "1 day ago",
    user: "Michael Chen",
    icon: Users,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "document_download",
    title: "Document Downloaded",
    description: "ESG Impact Report was downloaded by Jennifer Liu",
    timestamp: "2 days ago",
    user: "Jennifer Liu",
    icon: Download,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "comment_added",
    title: "Comment Added",
    description: "New comment on Financial Projections",
    timestamp: "3 days ago",
    user: "David Wilson",
    icon: MessageSquare,
    color: "text-orange-600",
  },
]

export default function DataRoomProfilePage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [showContactModal, setShowContactModal] = useState(false)
  const [messageSubject, setMessageSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const { toast } = useToast()

  const [isDownloading, setIsDownloading] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<any>(null)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)

  const handleDownloadAll = async () => {
    setIsDownloading(true)

    // Simulate downloading all documents
    for (let i = 0; i < filteredDocuments.length; i++) {
      const doc = filteredDocuments[i]

      // Create a blob with document content
      const content = `Document: ${doc.name}\nType: ${doc.type}\nSize: ${doc.size}\nCategory: ${doc.category}\nStatus: ${doc.status}`
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement("a")
      link.href = url
      link.download = `${doc.name.replace(/\s+/g, "_")}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Add delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsDownloading(false)
    alert(`Successfully downloaded ${filteredDocuments.length} documents`)
  }

  const handleViewDocument = (document: any) => {
    setViewingDocument(document)
    setShowDocumentViewer(true)
  }

  const handleCloseDocumentViewer = () => {
    setShowDocumentViewer(false)
    setViewingDocument(null)
  }

  const handleDownloadDocument = async (doc: any) => {
    // Simulate downloading individual document
    const content = `Document: ${doc.name}\nType: ${doc.type}\nSize: ${doc.size}\nCategory: ${doc.category}\nStatus: ${doc.status}\nLast Modified: ${doc.lastModified}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create download link
    const link = window.document.createElement("a")
    link.href = url
    link.download = `${doc.name.replace(/\s+/g, "_")}.txt`
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert(`Downloaded ${doc.name}`)
  }

  const handleSendMessage = (participant: any) => {
    setSelectedParticipant(participant)
    setShowMessageModal(true)
  }

  const handleMessageSent = async (messageData: any) => {
    try {
      // Store message in localStorage for persistence
      const message = {
        id: `msg-${Date.now()}`,
        from: "Current User",
        to: selectedParticipant?.name || "Unknown",
        subject: messageData.subject || "Data Room Inquiry",
        content: messageData.content,
        timestamp: new Date().toISOString(),
        dataRoomId: dataRoomId,
        dataRoomName: dataRoomName,
        status: "sent"
      }
      
      // Get existing messages
      const existingMessages = JSON.parse(localStorage.getItem('data-room-messages') || '[]')
      existingMessages.push(message)
      localStorage.setItem('data-room-messages', JSON.stringify(existingMessages))
      
      // Simulate sending message
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedParticipant?.name}`,
      })

      setShowMessageModal(false)
      setSelectedParticipant(null)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const dataRoomName = searchParams.get("name") || dataRoomData.name
  const dataRoomId = searchParams.get("id") || dataRoomData.id

  const filteredDocuments = documentsData.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(documentsData.map((doc) => doc.category)))]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Updated":
      case "New":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Under Review":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Data Rooms
          </Button>
          <div className="text-sm text-gray-500">Data Rooms / {dataRoomName}</div>
        </div>

        {/* Clean, Balanced Header Section */}
        <Card className="border-l-4 border-l-electric-blue">
          <CardContent className="p-6">
            {/* Main Header Info */}
            <div className="flex items-start gap-6 mb-6">
              <Avatar className="h-16 w-16">
                <img src={dataRoomData.avatar || "/placeholder.svg"} alt={dataRoomData.manager} />
                <AvatarFallback>{dataRoomData.manager.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-deepBrand mb-2">{dataRoomName}</h1>
                <p className="text-baseGray mb-3 max-w-3xl">{dataRoomData.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800">{dataRoomData.status}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">{dataRoomData.accessLevel}</Badge>
                  <Badge variant="outline">{dataRoomData.type}</Badge>
                </div>
              </div>
            </div>

            {/* Owner & Contact and Security - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Owner & Contact */}
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <img src={dataRoomData.owner.avatar || "/placeholder.svg"} alt={dataRoomData.owner.name} />
                    <AvatarFallback>
                      {dataRoomData.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{dataRoomData.owner.name}</p>
                    <p className="text-xs text-baseGray">{dataRoomData.owner.title}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() =>
                    handleSendMessage({
                      name: dataRoomData.owner.name,
                      title: dataRoomData.owner.title,
                      company: "BlackRock",
                      email: dataRoomData.owner.email,
                    })
                  }
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contact Owner
                </Button>
              </Card>

              {/* Security & Compliance */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Security Status</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Encryption:</span>
                    <span className="font-medium text-green-600">{dataRoomData.security.encryption}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dataRoomData.security.compliance.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Key Stats Row - Clean and Balanced */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Documents</span>
                </div>
                <p className="text-xl font-bold text-deepBrand">{dataRoomData.totalDocuments}</p>
                <p className="text-xs text-gray-500">Total available</p>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Last Updated</span>
                </div>
                <p className="text-xl font-bold text-deepBrand">{dataRoomData.lastUpdated}</p>
                <p className="text-xs text-gray-500">Recent activity</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Deadline</span>
                </div>
                <p className="text-xl font-bold text-deepBrand">{dataRoomData.deadline}</p>
                <p className="text-xs text-gray-500">Due date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-deepBrand">
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:text-deepBrand">
              Documents
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:text-deepBrand">
              Activity
            </TabsTrigger>

            <TabsTrigger
              value="participants"
              className="data-[state=active]:bg-white data-[state=active]:text-deepBrand"
            >
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Fund Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Fund Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Fund Description</h3>
                      <p className="text-baseGray leading-relaxed">
                        BlackRock Infrastructure Fund IV is a diversified infrastructure investment vehicle targeting
                        essential infrastructure assets across North America and Europe. The fund focuses on sustainable
                        infrastructure investments that provide stable, long-term returns while contributing to the
                        energy transition and digital transformation. With a strong emphasis on ESG principles, the fund
                        seeks to invest in assets that generate predictable cash flows and offer inflation protection
                        through regulated or contracted revenue streams.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Fund Attributes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">Target Fund Size:</span>
                              <span className="text-baseGray ml-2">$8.5 billion</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">Investment Types:</span>
                              <span className="text-baseGray ml-2">
                                Energy Infrastructure, Transportation, Digital Infrastructure, Utilities
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">Launch Date:</span>
                              <span className="text-baseGray ml-2">Q2 2024</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">Investment Period:</span>
                              <span className="text-baseGray ml-2">5 years</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">Geographic Focus:</span>
                              <span className="text-baseGray ml-2">North America (60%), Europe (40%)</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">Target Returns:</span>
                              <span className="text-baseGray ml-2">12-15% IRR</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">Fund Term:</span>
                              <span className="text-baseGray ml-2">12 years (with extensions)</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <span className="font-medium">Minimum Investment:</span>
                              <span className="text-baseGray ml-2">$50 million</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6">
                {/* Recent Activity Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activityData.slice(0, 4).map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <activity.icon className={`h-4 w-4 mt-0.5 ${activity.color}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Manage Files
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadAll} disabled={isDownloading}>
                      <Download className="h-4 w-4 mr-1" />
                      {isDownloading ? "Downloading..." : "Download All"}
                    </Button>
                  </div>
                </div>

                {/* Enhanced Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-3 py-2 border rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-deepBrand">{doc.name}</h4>
                            {getStatusIcon(doc.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-baseGray">
                            <span>
                              {doc.type} • {doc.size}
                            </span>
                            <span>Modified {doc.lastModified}</span>
                            <Badge variant="outline" className="text-xs">
                              {doc.category}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                doc.status === "New"
                                  ? "bg-green-100 text-green-800"
                                  : doc.status === "Updated"
                                    ? "bg-blue-100 text-blue-800"
                                    : doc.status === "Under Review"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {doc.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.title}</p>
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-baseGray mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="participants">
            <div className="space-y-6">
              {/* Connected Allocators */}
              <Card>
                <CardHeader>
                  <CardTitle>Connected Allocators (5)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <img src="/placeholder.svg?height=40&width=40" alt="State Teachers Pension" />
                          <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">State Teachers Pension</p>
                          <p className="text-sm text-baseGray">Pension Fund • $45B AUM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <img src="/placeholder.svg?height=40&width=40" alt="University Endowment" />
                          <AvatarFallback>UE</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">University Endowment Foundation</p>
                          <p className="text-sm text-baseGray">Endowment • $12B AUM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Reviewing</Badge>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <img src="/placeholder.svg?height=40&width=40" alt="Healthcare Foundation" />
                          <AvatarFallback>HF</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Healthcare Foundation</p>
                          <p className="text-sm text-baseGray">Foundation • $3.5B AUM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Firm Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle>Firm Contacts (3)</CardTitle>
                </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <img src="/placeholder.svg?height=40&width=40" alt="Sarah Johnson" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-baseGray">Managing Director • BlackRock</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Owner</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleSendMessage({
                            name: "Sarah Johnson",
                            title: "Managing Director",
                            company: "BlackRock",
                            email: "sarah.johnson@blackrock.com",
                          })
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <img src="/placeholder.svg?height=40&width=40" alt="David Rodriguez" />
                        <AvatarFallback>DR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">David Rodriguez</p>
                        <p className="text-sm text-baseGray">Senior Director • BlackRock</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Manager</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleSendMessage({
                            name: "David Rodriguez",
                            title: "Senior Director",
                            company: "BlackRock",
                            email: "david.rodriguez@blackrock.com",
                          })
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <img src="/placeholder.svg?height=40&width=40" alt="Lisa Thompson" />
                        <AvatarFallback>LT</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Lisa Thompson</p>
                        <p className="text-sm text-baseGray">Investment Manager • BlackRock</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Manager</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleSendMessage({
                            name: "Lisa Thompson",
                            title: "Investment Manager",
                            company: "BlackRock",
                            email: "lisa.thompson@blackrock.com",
                          })
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Contact Owner Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact {dataRoomData.owner.name}</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <img src={dataRoomData.owner.avatar || "/placeholder.svg"} alt={dataRoomData.owner.name} />
                  <AvatarFallback>
                    {dataRoomData.owner.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{dataRoomData.owner.name}</p>
                  <p className="text-xs text-gray-600">{dataRoomData.owner.title}</p>
                  <p className="text-xs text-gray-500">{dataRoomData.owner.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Enter message subject"
                  className="bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue bg-white"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowContactModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!messageSubject.trim() || !messageContent.trim()) {
                      alert("Please fill in both subject and message")
                      return
                    }

                    setIsSendingMessage(true)

                    // Simulate sending message
                    await new Promise((resolve) => setTimeout(resolve, 1000))

                    alert(`Message sent to ${dataRoomData.owner.name}!`)
                    setShowContactModal(false)
                    setMessageSubject("")
                    setMessageContent("")
                    setIsSendingMessage(false)
                  }}
                  disabled={isSendingMessage}
                  className="flex-1 bg-electric-blue hover:bg-electric-blue/90"
                >
                  {isSendingMessage ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Document Viewer Modal */}
      {showDocumentViewer && viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Viewing: {viewingDocument.name}</h3>
              <button onClick={handleCloseDocumentViewer} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {viewingDocument.type}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {viewingDocument.size}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {viewingDocument.category}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {viewingDocument.status}
                </div>
                <div>
                  <span className="font-medium">Last Modified:</span> {viewingDocument.lastModified}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
                <div className="text-center text-gray-500 mt-20">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Document Preview</p>
                  <p className="text-sm">Preview for {viewingDocument.name}</p>
                  <p className="text-xs mt-2">
                    This is a simulated document viewer. In a real application, this would show the actual document
                    content.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCloseDocumentViewer} variant="outline" className="flex-1 bg-transparent">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Simulate download
                    const content = `Document: ${viewingDocument.name}\nType: ${viewingDocument.type}\nSize: ${viewingDocument.size}`
                    const blob = new Blob([content], { type: "text/plain" })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `${viewingDocument.name.replace(/\s+/g, "_")}.txt`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                    alert(`Downloaded ${viewingDocument.name}`)
                  }}
                  className="flex-1 bg-electric-blue hover:bg-electric-blue/90"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Send Message Modal */}
      {showMessageModal && selectedParticipant && (
        <SendMessageModal
          isOpen={showMessageModal}
          onClose={() => {
            setShowMessageModal(false)
            setSelectedParticipant(null)
          }}
          recipientName={selectedParticipant?.name ?? ""}
          recipientTitle={selectedParticipant?.title}
          organizationName={selectedParticipant?.company ?? ""}
        />
      )}
    </div>
  )
}
