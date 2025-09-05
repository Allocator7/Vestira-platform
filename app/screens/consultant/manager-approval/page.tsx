"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, 
  Plus, 
  Filter, 
  Star, 
  Users, 
  Building, 
  TrendingUp, 
  Eye,
  MessageSquare,
  Calendar,
  Bookmark,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for managers in network
const networkManagers = [
  {
    id: "1",
    name: "Blackstone Group",
    managerName: "Stephen Schwarzman",
    aum: "$975B",
    strategy: "Private Equity",
    assetClasses: ["Private Equity", "Real Estate", "Credit"],
    strategies: ["Buyout", "Growth Equity", "Real Estate", "Private Credit"],
    status: "pending",
    approvalDate: null,
    watchlist: false,
    description: "Leading global investment firm with expertise across private markets",
    location: "New York, NY",
    founded: "1985",
    contactEmail: "contact@blackstone.com",
    website: "www.blackstone.com",
    performance: "Top Quartile",
    riskProfile: "Moderate",
    minimumInvestment: "$25M",
  },
  {
    id: "2",
    name: "KKR & Co.",
    managerName: "Henry Kravis",
    aum: "$553B",
    strategy: "Private Equity",
    assetClasses: ["Private Equity", "Real Estate", "Infrastructure"],
    strategies: ["Buyout", "Growth Equity", "Infrastructure", "Real Estate"],
    status: "approved",
    approvalDate: "2024-03-15",
    watchlist: true,
    description: "Global investment firm with deep expertise in private markets",
    location: "New York, NY",
    founded: "1976",
    contactEmail: "investor.relations@kkr.com",
    website: "www.kkr.com",
    performance: "Top Quartile",
    riskProfile: "Moderate-High",
    minimumInvestment: "$50M",
  },
  {
    id: "3",
    name: "Apollo Global Management",
    managerName: "Marc Rowan",
    aum: "$631B",
    strategy: "Private Credit",
    assetClasses: ["Private Credit", "Private Equity", "Real Estate"],
    strategies: ["Direct Lending", "Opportunistic Credit", "Buyout"],
    status: "rejected",
    approvalDate: null,
    watchlist: false,
    description: "Alternative investment manager with focus on credit strategies",
    location: "New York, NY",
    founded: "1990",
    contactEmail: "ir@apollo.com",
    website: "www.apollo.com",
    performance: "Top Quartile",
    riskProfile: "High",
    minimumInvestment: "$100M",
  },
  {
    id: "4",
    name: "Brookfield Asset Management",
    managerName: "Bruce Flatt",
    aum: "$850B",
    strategy: "Infrastructure",
    assetClasses: ["Infrastructure", "Real Estate", "Renewable Power"],
    strategies: ["Core Infrastructure", "Real Estate", "Renewable Energy"],
    status: "approved",
    approvalDate: "2024-02-20",
    watchlist: true,
    description: "Global alternative asset manager with focus on real assets",
    location: "Toronto, Canada",
    founded: "1899",
    contactEmail: "investor.relations@brookfield.com",
    website: "www.brookfield.com",
    performance: "Top Quartile",
    riskProfile: "Moderate",
    minimumInvestment: "$75M",
  },
  {
    id: "5",
    name: "Carlyle Group",
    managerName: "Harvey Schwartz",
    aum: "$426B",
    strategy: "Private Equity",
    assetClasses: ["Private Equity", "Real Estate", "Credit"],
    strategies: ["Buyout", "Growth Equity", "Real Estate", "Private Credit"],
    status: "pending",
    approvalDate: null,
    watchlist: false,
    description: "Global investment firm with diversified alternative asset platform",
    location: "Washington, DC",
    founded: "1987",
    contactEmail: "investor.relations@carlyle.com",
    website: "www.carlyle.com",
    performance: "Top Quartile",
    riskProfile: "Moderate",
    minimumInvestment: "$30M",
  },
]

// Asset classes and strategies for tagging
const assetClasses = [
  "Private Equity",
  "Private Credit", 
  "Real Estate",
  "Infrastructure",
  "Hedge Funds",
  "Venture Capital",
  "Commodities",
  "Fixed Income"
]

const strategies = [
  "Buyout",
  "Growth Equity",
  "Direct Lending",
  "Opportunistic Credit",
  "Core Real Estate",
  "Value-Add Real Estate",
  "Core Infrastructure",
  "Renewable Energy",
  "Distressed",
  "Special Situations"
]

export default function ConsultantManagerApprovalPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssetClasses, setSelectedAssetClasses] = useState<string[]>([])
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [showAddManagerModal, setShowAddManagerModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedManager, setSelectedManager] = useState<any>(null)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  })
  const [newManager, setNewManager] = useState({
    name: "",
    managerName: "",
    strategy: "",
    description: "",
    contactEmail: "",
    website: "",
  })
  const [watchlist, setWatchlist] = useState<string[]>([])

  const { toast } = useToast()

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('consultant-watchlist')
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('consultant-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  // Filter managers based on active tab and search
  const filteredManagers = networkManagers.filter((manager) => {
    const matchesTab = activeTab === "watchlist" ? watchlist.includes(manager.id) : manager.status === activeTab
    const matchesSearch = 
      manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.strategy.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesAssetClass = selectedAssetClasses.length === 0 || 
      selectedAssetClasses.some(ac => manager.assetClasses.includes(ac))
    
    const matchesStrategy = selectedStrategies.length === 0 || 
      selectedStrategies.some(s => manager.strategies.includes(s))

    return matchesTab && matchesSearch && matchesAssetClass && matchesStrategy
  })

  const handleAddManager = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const newManagerData = {
      id,
      ...newManager,
      aum: "$0B",
      assetClasses: [newManager.strategy],
      strategies: [newManager.strategy],
      status: "pending",
      approvalDate: null,
      watchlist: false,
      location: "",
      founded: "",
      performance: "N/A",
      riskProfile: "N/A",
      minimumInvestment: "N/A",
    }

    networkManagers.push(newManagerData)
    setNewManager({
      name: "",
      managerName: "",
      strategy: "",
      description: "",
      contactEmail: "",
      website: "",
    })
    setShowAddManagerModal(false)

    toast({
      title: "Manager Added",
      description: `${newManagerData.name} has been added to your network for approval.`,
    })
  }

  const handleApproval = (approved: boolean) => {
    if (!selectedManager) return

    const updatedManager = {
      ...selectedManager,
      status: approved ? "approved" : "rejected",
      approvalDate: approved ? new Date().toISOString().split('T')[0] : null,
    }

    const index = networkManagers.findIndex(m => m.id === selectedManager.id)
    if (index !== -1) {
      networkManagers[index] = updatedManager
    }

    setShowApprovalModal(false)
    setSelectedManager(null)
    setApprovalNotes("")

    toast({
      title: approved ? "Manager Approved" : "Manager Rejected",
      description: `${selectedManager.name} has been ${approved ? 'approved' : 'rejected'}.`,
    })
  }

  const toggleWatchlist = (managerId: string) => {
    const manager = networkManagers.find(m => m.id === managerId)
    if (manager) {
      const isInWatchlist = watchlist.includes(managerId)
      if (isInWatchlist) {
        setWatchlist(prev => prev.filter(id => id !== managerId))
        manager.watchlist = false
        toast({
          title: "Removed from Watchlist",
          description: `${manager.name} has been removed from your watchlist.`,
        })
      } else {
        setWatchlist(prev => [...prev, managerId])
        manager.watchlist = true
        toast({
          title: "Added to Watchlist",
          description: `${manager.name} has been added to your watchlist.`,
        })
      }
    }
  }

  const handleViewProfile = (manager: any) => {
    // Navigate to manager profile page with firm view
    const profileUrl = `/screens/general/manager-profile?id=${manager.id}&name=${encodeURIComponent(manager.name)}&view=firm`
    router.push(profileUrl)
  }

  const handleContact = (manager: any) => {
    setSelectedManager(manager)
    setContactForm({
      subject: `Inquiry from Vestira Platform - ${manager.name}`,
      message: "",
    })
    setShowContactModal(true)
  }

  const handleContactSubmit = () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedManager?.name} at ${selectedManager?.contactEmail}`,
    })
    
    setShowContactModal(false)
    setContactForm({ subject: "", message: "" })
    setSelectedManager(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 md:px-8 lg:px-10 max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-deep-brand">Manager Approval</h1>
          <p className="text-base text-base-gray">Review and approve manager profiles from your network</p>
        </div>
        <Button
          onClick={() => setShowAddManagerModal(true)}
          className="bg-electric-blue hover:bg-electric-blue/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Manager
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search managers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Asset Classes
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Strategies
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manager Approval Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Review ({networkManagers.filter(m => m.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved ({networkManagers.filter(m => m.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected ({networkManagers.filter(m => m.status === "rejected").length})
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Watchlist ({watchlist.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid gap-6">
            {filteredManagers.map((manager) => (
              <Card key={manager.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="font-semibold bg-deep-brand text-white">
                          {manager.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-deep-brand">{manager.name}</h3>
                          {watchlist.includes(manager.id) && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          {getStatusBadge(manager.status)}
                        </div>
                        <p className="text-sm text-base-gray mb-1">
                          {manager.managerName} • {manager.strategy} • {manager.aum}
                        </p>
                        <p className="text-sm text-base-gray leading-relaxed max-w-2xl">
                          {manager.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Asset Classes and Strategies */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-sm font-medium text-deep-brand">Asset Classes:</span>
                      {manager.assetClasses.map((ac) => (
                        <Badge key={ac} variant="outline" className="text-xs">
                          {ac}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-deep-brand">Strategies:</span>
                      {manager.strategies.map((strategy) => (
                        <Badge key={strategy} variant="secondary" className="text-xs">
                          {strategy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Manager Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-base-gray">Location:</span>
                      <p className="font-medium">{manager.location}</p>
                    </div>
                    <div>
                      <span className="text-base-gray">Founded:</span>
                      <p className="font-medium">{manager.founded}</p>
                    </div>
                    <div>
                      <span className="text-base-gray">Performance:</span>
                      <p className="font-medium">{manager.performance}</p>
                    </div>
                    <div>
                      <span className="text-base-gray">Min Investment:</span>
                      <p className="font-medium">{manager.minimumInvestment}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWatchlist(manager.id)}
                        className={`flex items-center gap-1 ${watchlist.includes(manager.id) ? 'text-blue-600 border-blue-600' : ''}`}
                      >
                        <Bookmark className={`h-4 w-4 ${watchlist.includes(manager.id) ? 'fill-current' : ''}`} />
                        {watchlist.includes(manager.id) ? 'Watching' : 'Add to Watchlist'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleViewProfile(manager)}
                      >
                        <Eye className="h-4 w-4" />
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleContact(manager)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Contact
                      </Button>
                    </div>

                    {manager.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedManager(manager)
                            setShowApprovalModal(true)
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedManager(manager)
                            setShowApprovalModal(true)
                          }}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Manager Modal */}
      <Dialog open={showAddManagerModal} onOpenChange={setShowAddManagerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Manager from Network</DialogTitle>
            <DialogDescription>
              Add a new manager to your network for approval consideration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="managerName">Manager Name</Label>
              <Input
                id="managerName"
                value={newManager.name}
                onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                placeholder="e.g., Blackstone Group"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Person</Label>
              <Input
                id="contactName"
                value={newManager.managerName}
                onChange={(e) => setNewManager({ ...newManager, managerName: e.target.value })}
                placeholder="e.g., Stephen Schwarzman"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Primary Strategy</Label>
              <Input
                id="strategy"
                value={newManager.strategy}
                onChange={(e) => setNewManager({ ...newManager, strategy: e.target.value })}
                placeholder="e.g., Private Equity"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newManager.description}
                onChange={(e) => setNewManager({ ...newManager, description: e.target.value })}
                placeholder="Brief description of the manager..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={newManager.contactEmail}
                onChange={(e) => setNewManager({ ...newManager, contactEmail: e.target.value })}
                placeholder="contact@manager.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={newManager.website}
                onChange={(e) => setNewManager({ ...newManager, website: e.target.value })}
                placeholder="www.manager.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddManagerModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddManager}>
              Add Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manager Approval</DialogTitle>
            <DialogDescription>
              {selectedManager && `Review ${selectedManager.name} for approval`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approvalNotes">Approval Notes (Optional)</Label>
              <Textarea
                id="approvalNotes"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes about this approval decision..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleApproval(false)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Reject
            </Button>
            <Button 
              onClick={() => handleApproval(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedManager?.name}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedManager?.managerName} at {selectedManager?.contactEmail}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input
                id="contact-subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Enter message subject"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleContactSubmit} className="bg-electric-blue hover:bg-electric-blue/90 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
