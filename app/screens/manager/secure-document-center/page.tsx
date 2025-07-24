"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Upload,
  Eye,
  Download,
  Calendar,
  User,
  Building,
  Clock,
  FileText,
  Users,
  Lock,
  Shield,
} from "lucide-react"

interface Document {
  id: string
  title: string
  description: string
  author: string
  authorAvatar: string
  organization: string
  uploadDate: string
  lastAccessed: string
  size: string
  classification: "Restricted Documents" | "Client-Specific Documents" | "Internal Documents"
  type: string
  clientAccess: string[]
  teamAccess: string[]
  isInternal?: boolean
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Fund Performance Report Q4 2024",
    description: "Quarterly performance analysis for institutional investors.",
    author: "Sarah Johnson",
    authorAvatar: "/placeholder-user.jpg",
    organization: "Investment Firm",
    uploadDate: "1/15/2024",
    lastAccessed: "1/19/2024",
    size: "2.8 MB",
    classification: "Client-Specific Documents",
    type: "Quarterly Report",
    clientAccess: ["CalPERS", "State Teachers Pension"],
    teamAccess: ["Investment Team", "Client Relations"],
  },
  {
    id: "2",
    title: "Marketing Presentation - Private Equity",
    description: "Marketing materials for private equity fund presentation.",
    author: "Michael Chen",
    authorAvatar: "/placeholder-user.jpg",
    organization: "Investment Firm",
    uploadDate: "1/12/2024",
    lastAccessed: "1/18/2024",
    size: "4.2 MB",
    classification: "Internal Documents",
    type: "Marketing Materials",
    clientAccess: [],
    teamAccess: ["Marketing Team", "Investment Team"],
    isInternal: true,
  },
  {
    id: "3",
    title: "Investment Committee Minutes",
    description: "Confidential investment committee meeting minutes.",
    author: "Amanda Foster",
    authorAvatar: "/placeholder-user.jpg",
    organization: "Investment Firm",
    uploadDate: "1/10/2024",
    lastAccessed: "1/17/2024",
    size: "1.1 MB",
    classification: "Restricted Documents",
    type: "Committee Minutes",
    clientAccess: [],
    teamAccess: ["Senior Management", "Investment Committee"],
  },
  {
    id: "4",
    title: "Due Diligence Response Template",
    description: "Standardized template for due diligence questionnaire responses.",
    author: "David Rodriguez",
    authorAvatar: "/placeholder-user.jpg",
    organization: "Investment Firm",
    uploadDate: "1/08/2024",
    lastAccessed: "1/16/2024",
    size: "0.9 MB",
    classification: "Internal Documents",
    type: "Template",
    clientAccess: [],
    teamAccess: ["Investment Team", "Operations"],
  },
]

export default function ManagerSecureDocumentCenter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("Date")
  const [activeTab, setActiveTab] = useState("all")

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Restricted Documents":
        return "bg-red-100 text-red-800 border-red-200"
      case "Client-Specific Documents":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Internal Documents":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "Restricted Documents":
        return <Lock className="h-3 w-3" />
      case "Client-Specific Documents":
        return <Shield className="h-3 w-3" />
      case "Internal Documents":
        return <Users className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" || doc.classification === activeTab

    return matchesSearch && matchesTab
  })

  const classificationCounts = {
    all: mockDocuments.length,
    "Restricted Documents": mockDocuments.filter((d) => d.classification === "Restricted Documents").length,
    "Client-Specific Documents": mockDocuments.filter((d) => d.classification === "Client-Specific Documents").length,
    "Internal Documents": mockDocuments.filter((d) => d.classification === "Internal Documents").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-deepBrand">Secure Document Center</h1>
              <p className="text-baseGray mt-1">Manage and share your documents by type</p>
            </div>
            <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* Document Type Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-red-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Restricted Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{classificationCounts["Restricted Documents"]}</div>
                <p className="text-xs text-red-600 mt-1">Confidential, not shareable</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Client-Specific Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">
                  {classificationCounts["Client-Specific Documents"]}
                </div>
                <p className="text-xs text-orange-600 mt-1">Quarterly reports and client materials</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  <Users className="h-4 w-4 inline mr-2" />
                  Internal Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{classificationCounts["Internal Documents"]}</div>
                <p className="text-xs text-blue-600 mt-1">Marketing materials, templates</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-baseGray h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Date">Sort by Date</SelectItem>
                    <SelectItem value="Title">Sort by Title</SelectItem>
                    <SelectItem value="Author">Sort by Author</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Documents ({classificationCounts.all})</TabsTrigger>
              <TabsTrigger value="Restricted Documents">
                Restricted ({classificationCounts["Restricted Documents"]})
              </TabsTrigger>
              <TabsTrigger value="Client-Specific Documents">
                Client-Specific ({classificationCounts["Client-Specific Documents"]})
              </TabsTrigger>
              <TabsTrigger value="Internal Documents">
                Internal ({classificationCounts["Internal Documents"]})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <FileText className="h-6 w-6 text-baseGray" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-deepBrand truncate">{document.title}</h3>
                            {document.isInternal && (
                              <Badge variant="outline" className="text-xs">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-baseGray mb-3 line-clamp-2">{document.description}</p>
                          <div className="flex items-center gap-4 text-xs text-baseGray">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{document.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              <span>{document.organization}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{document.uploadDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{document.size}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Badge className={`${getClassificationColor(document.classification)} flex items-center gap-1`}>
                          {getClassificationIcon(document.classification)}
                          {document.classification}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-xs text-baseGray">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Client Access: {document.clientAccess.join(", ") || "None"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last accessed: {document.lastAccessed}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
