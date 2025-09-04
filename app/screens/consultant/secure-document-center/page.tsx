"use client"

import { useState } from "react"
import { Search, Upload, Download, Eye, Shield, Clock, User, MapPin, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export default function ConsultantSecureDocumentCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSecurity, setSelectedSecurity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Download functionality
  const handleDownload = (document: any) => {
    try {
      // Create a mock download
      const link = document.createElement('a')
      link.href = `#` // In a real app, this would be the actual file URL
      link.download = document.name
      link.click()
      
      // Show success message
      console.log(`Downloaded: ${document.name}`)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  // Sample data for consultant context
  const securityOverview = {
    restricted: 8,
    confidential: 22,
    internal: 35,
  }

  const recentActivity = [
    {
      id: 1,
      action: "Advisory Report Shared",
      document: "Market Analysis Q4 2024",
      user: "Alex Consultant",
      timestamp: "2024-01-15 16:20:15",
      ip: "192.168.1.120",
      location: "Boston, MA",
    },
    {
      id: 2,
      action: "Document Downloaded",
      document: "Investment Recommendation",
      user: "David Kim (Client)",
      timestamp: "2024-01-15 13:45:22",
      ip: "10.0.0.67",
      location: "Seattle, WA",
    },
    {
      id: 3,
      action: "Research Report Uploaded",
      document: "ESG Investment Trends 2024",
      user: "Alex Consultant",
      timestamp: "2024-01-15 10:30:08",
      ip: "192.168.1.120",
      location: "Boston, MA",
    },
  ]

  const documents = [
    {
      id: 1,
      name: "ESG Investment Strategy Report",
      client: "University Endowment",
      clientType: "client",
      category: "Advisory Reports",
      securityLevel: "confidential",
      status: "active",
      version: "2.0",
      uploadDate: "2024-01-12",
      expiryDate: "2024-07-12",
      size: "3.1 MB",
      downloads: 6,
    },
    {
      id: 2,
      name: "Market Research Analysis",
      client: "Corporate Pension Plan",
      clientType: "prospect",
      category: "Research",
      securityLevel: "internal",
      status: "active",
      version: "1.5",
      uploadDate: "2024-01-10",
      expiryDate: "2024-04-10",
      size: "2.7 MB",
      downloads: 12,
    },
    {
      id: 3,
      name: "Investment Recommendation Deck",
      client: "Family Office Delta",
      clientType: "client",
      category: "Presentations",
      securityLevel: "restricted",
      status: "active",
      version: "1.0",
      uploadDate: "2024-01-08",
      expiryDate: "2024-03-08",
      size: "4.5 MB",
      downloads: 4,
    },
  ]

  const getSecurityBadge = (level: string) => {
    switch (level) {
      case "restricted":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Restricted</Badge>
      case "confidential":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Confidential</Badge>
      case "internal":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Internal</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getClientTypeBadge = (type: string) => {
    return type === "client" ? (
      <Badge className="bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/10">Client</Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Prospect</Badge>
    )
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClient = selectedClient === "all" || doc.client === selectedClient
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesSecurity = selectedSecurity === "all" || doc.securityLevel === selectedSecurity
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus

    return matchesSearch && matchesClient && matchesCategory && matchesSecurity && matchesStatus
  })

  return (
    <div className="flex-1 space-y-6 p-6 bg-canvas-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-brand">Secure Document Center</h1>
          <p className="text-base-gray mt-1">Manage advisory materials and client documents securely</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white shadow-vestira">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Secure Document</DialogTitle>
              <DialogDescription>
                Upload a new advisory document with security classification and client assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Document File</Label>
                <Input id="file" type="file" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="client-select">Client/Prospect</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select client or prospect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university-endowment">University Endowment</SelectItem>
                    <SelectItem value="corporate-pension">Corporate Pension Plan</SelectItem>
                    <SelectItem value="family-office">Family Office Delta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category-select">Category</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advisory">Advisory Reports</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="presentations">Presentations</SelectItem>
                    <SelectItem value="analysis">Market Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="security-select">Security Level</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="confidential">Confidential</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Document description..." className="mt-1" />
              </div>
              <Button className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white">Upload Document</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-200 shadow-vestira">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Restricted Documents</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{securityOverview.restricted}</div>
            <p className="text-xs text-red-600">Highest security level</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 shadow-vestira">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Confidential Documents</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{securityOverview.confidential}</div>
            <p className="text-xs text-orange-600">Sensitive materials</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 shadow-vestira">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Internal Documents</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{securityOverview.internal}</div>
            <p className="text-xs text-blue-600">Standard access</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Document Library</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <Card className="shadow-vestira">
            <CardHeader>
              <CardTitle className="text-lg text-deep-brand">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-gray h-4 w-4" />
                    <Input
                      placeholder="Search documents and clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      <SelectItem value="University Endowment">University Endowment</SelectItem>
                      <SelectItem value="Corporate Pension Plan">Corporate Pension Plan</SelectItem>
                      <SelectItem value="Family Office Delta">Family Office Delta</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Advisory Reports">Advisory Reports</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Presentations">Presentations</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedSecurity} onValueChange={setSelectedSecurity}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Security" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card className="shadow-vestira">
            <CardHeader>
              <CardTitle className="text-lg text-deep-brand">Documents ({filteredDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-deep-brand">{doc.name}</h3>
                          {getSecurityBadge(doc.securityLevel)}
                          {getStatusBadge(doc.status)}
                          {getClientTypeBadge(doc.clientType)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-base-gray">
                          <span>{doc.client}</span>
                          <span>•</span>
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>v{doc.version}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.downloads} downloads</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-base-gray mt-1">
                          <span>Uploaded: {doc.uploadDate}</span>
                          <span>•</span>
                          <span>Expires: {doc.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-base-gray hover:text-deep-brand">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-base-gray hover:text-deep-brand"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-base-gray hover:text-deep-brand">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Version History</DropdownMenuItem>
                          <DropdownMenuItem>Manage Access</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="shadow-vestira">
            <CardHeader>
              <CardTitle className="text-lg text-deep-brand">Recent Activity</CardTitle>
              <CardDescription>Complete audit trail of document access and modifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-deep-brand/10 text-deep-brand text-xs">
                        {activity.user.split(" ")[0][0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-deep-brand">{activity.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.document}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-base-gray">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{activity.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{activity.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                      <div className="text-xs text-base-gray">IP: {activity.ip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
