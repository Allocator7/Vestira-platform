"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Screen } from "@/components/Screen"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Search,
  UserPlus,
  Users,
  Building,
  Calendar,
  BarChart4,
  Globe,
  MapPin,
  Mail,
  ExternalLink,
  Filter,
  Check,
  X,
  Clock,
  Briefcase,
  Award,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Send } from "lucide-react"

export default function ConnectionCenterPage() {
  // Sample connections data - UPDATED with personal contact information
  const connections = [
    {
      id: 1,
      name: "Sovereign Wealth Fund",
      contactPerson: "Sarah Chen", // Added personal contact
      contactPersonId: "sarah-chen", // Added for routing
      type: "allocator",
      logo: "/FI_logo.png",
      category: "Sovereign Wealth Fund",
      location: "Singapore",
      aum: "$320B+",
      focus: ["Alternative Assets", "Global Markets", "Long-term"],
      status: "connected",
      lastInteraction: "May 10, 2025",
    },
    {
      id: 2,
      name: "Global Pension Alliance",
      contactPerson: "Jennifer Park", // Added personal contact
      contactPersonId: "jennifer-park", // Added for routing
      type: "allocator",
      logo: "/trp-symbol.png",
      category: "Pension Fund",
      location: "Toronto, CA",
      aum: "$180B+",
      focus: ["Private Markets & Real Assets"],
      status: "connected",
      lastInteraction: "May 5, 2025",
    },
    {
      id: 3,
      name: "University Endowment Foundation",
      contactPerson: "Alex Kim", // Added personal contact
      contactPersonId: "alex-kim", // Added for routing
      type: "allocator",
      logo: "/trp-symbol.png",
      category: "Endowment",
      location: "Boston, MA",
      aum: "$45B+",
      focus: ["Alternative Investments"],
      status: "connected",
      lastInteraction: "May 3, 2025",
    },
    {
      id: 6,
      name: "Quantum Capital Partners",
      contactPerson: "James Wilson", // Added personal contact
      contactPersonId: "james-wilson", // Added for routing
      type: "manager",
      logo: "/stylized-wm.png",
      category: "Hedge Fund",
      location: "New York, NY",
      aum: "$2.5B+",
      focus: ["Global Macro", "Fixed Income", "Currencies"],
      status: "connected",
      lastInteraction: "May 8, 2025",
    },
    {
      id: 9,
      name: "Cambridge Associates",
      contactPerson: "David Kim", // Added personal contact
      contactPersonId: "david-kim", // Added for routing
      type: "consultant",
      logo: "/abstract-profile.png",
      category: "Investment Consultant",
      location: "Boston, MA",
      clientCount: "450+",
      yearsInBusiness: 50,
      services: ["Manager Selection", "Asset Allocation", "Portfolio Construction"],
      specializations: ["Endowments", "Foundations", "Pensions"],
      status: "connected",
      lastInteraction: "May 7, 2025",
    },
    {
      id: 14,
      name: "Healthcare Investment Group",
      contactPerson: "Lisa Rodriguez", // Added personal contact
      contactPersonId: "lisa-rodriguez", // Added for routing
      type: "manager",
      logo: "/medical-resonance-image.png",
      category: "Sector Specialist",
      location: "Boston, MA",
      aum: "$3.2B+",
      focus: ["Healthcare", "Biotechnology", "Medical Devices"],
      status: "pending",
      direction: "incoming",
      lastInteraction: "May 12, 2025",
    },
    {
      id: 15,
      name: "Strategic Advisory Partners",
      contactPerson: "Emily Zhang", // Added personal contact
      contactPersonId: "emily-zhang", // Added for routing
      type: "consultant",
      logo: "/abstract-profile.png",
      category: "Boutique Consultant",
      location: "Chicago, IL",
      clientCount: "150+",
      yearsInBusiness: 25,
      services: ["Due Diligence", "Manager Selection", "Risk Assessment"],
      specializations: ["Alternative Investments", "Private Markets", "ESG"],
      status: "pending",
      direction: "incoming",
      lastInteraction: "May 11, 2025",
    },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("date")
  const [pendingView, setPendingView] = useState<"received" | "sent">("received")
  const [connectionsState, setConnectionsState] = useState(connections)

  // New state variables
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [connectionRequestDialogOpen, setConnectionRequestDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [connectionMessage, setConnectionMessage] = useState("")

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // New filter state
  const [filters, setFilters] = useState({
    focusAreas: [] as string[],
    locations: [] as string[],
    companyTypes: [] as string[],
    sizes: [] as string[],
    statuses: [] as string[],
  })

  // Modal states for proper functionality like Manager Search
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<any>(null)
  const [selectedStrategy, setSelectedStrategy] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [meetingNotes, setMeetingNotes] = useState("")
  const [messageSuccess, setMessageSuccess] = useState(false)
  const [meetingSuccess, setMeetingSuccess] = useState(false)

  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const router = useRouter()

  // Add these handler functions after the existing state declarations
  const handleOpenMessageModal = (connection: any) => {
    setSelectedConnection(connection)
    setSelectedStrategy("")
    setMessageContent("")
    setMessageSuccess(false)
    setIsMessageModalOpen(true)
  }

  const handleOpenMeetingModal = (connection: any) => {
    setSelectedConnection(connection)
    setSelectedStrategy("")
    setMeetingDate("")
    setMeetingTime("")
    setMeetingNotes("")
    setMeetingSuccess(false)
    setIsMeetingModalOpen(true)
  }

  // Handle Accept/Decline connection requests
  const handleAcceptConnection = (connectionId: number) => {
    setConnectionsState(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: "connected", direction: undefined }
          : conn
      )
    )
  }

  const handleDeclineConnection = (connectionId: number) => {
    setConnectionsState(prev => 
      prev.filter(conn => conn.id !== connectionId)
    )
  }

  const handleCancelRequest = (connectionId: number) => {
    setConnectionsState(prev => 
      prev.filter(conn => conn.id !== connectionId)
    )
  }

  // Route to appropriate profile based on connection type
  const handleViewProfile = (connection: any) => {
    if (connection.type === 'allocator') {
      router.push(`/screens/general/allocator-profile?id=${connection.id}&firm=${encodeURIComponent(connection.name)}`)
    } else if (connection.type === 'manager') {
      router.push(`/screens/general/manager-profile?id=${connection.id}&firm=${encodeURIComponent(connection.name)}`)
    } else if (connection.type === 'consultant') {
      router.push(`/screens/general/consultant-profile?id=${connection.id}&firm=${encodeURIComponent(connection.name)}`)
    }
  }

  const handleSendMessage = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setMessageSuccess(true)

    // Close modal after showing success
    setTimeout(() => {
      setIsMessageModalOpen(false)
      setMessageSuccess(false)
    }, 1500)
  }

  const handleScheduleMeeting = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setMeetingSuccess(true)

    // Close modal after showing success
    setTimeout(() => {
      setIsMeetingModalOpen(false)
      setMeetingSuccess(false)
    }, 1500)
  }

  // Mock search results for Vestira users
  const mockSearchResults = [
    {
      id: "user-1",
      name: "Alexandra Thompson",
      title: "Senior Portfolio Manager",
      company: "Metropolitan Pension Fund",
      type: "allocator",
      avatar: "/placeholder-user.jpg",
      expertise: ["Private Equity", "Real Estate", "Infrastructure"],
      location: "Chicago, IL",
    },
    {
      id: "user-2",
      name: "Robert Chen",
      title: "Investment Director",
      company: "Apex Capital Management",
      type: "manager",
      avatar: "/placeholder-user.jpg",
      expertise: ["Hedge Funds", "Fixed Income", "Quantitative Strategies"],
      location: "New York, NY",
    },
    {
      id: "user-3",
      name: "Maria Rodriguez",
      title: "Principal Consultant",
      company: "Strategic Investment Advisors",
      type: "consultant",
      avatar: "/placeholder-user.jpg",
      expertise: ["Manager Selection", "Due Diligence", "ESG Investing"],
      location: "Boston, MA",
    },
    {
      id: "user-4",
      name: "James Wilson",
      title: "Chief Investment Officer",
      company: "University Endowment Fund",
      type: "allocator",
      avatar: "/placeholder-user.jpg",
      expertise: ["Endowment Management", "Alternative Investments", "Asset Allocation"],
      location: "San Francisco, CA",
    },
  ]

  // Filter options
  const focusAreaOptions = [
    "Private Equity",
    "Hedge Funds",
    "Real Estate",
    "Venture Capital",
    "Fixed Income",
    "Public Equities",
    "Alternatives",
    "Private Credit",
    "Infrastructure",
    "Healthcare",
    "Technology",
    "Impact Investing",
    "ESG",
    "Multi-Asset",
    "Global Macro",
    "Currencies",
    "Early Stage",
    "Buyouts",
    "Growth Equity",
    "Distressed",
  ]

  const locationOptions = [
    "New York, NY",
    "Boston, MA",
    "San Francisco, CA",
    "Chicago, IL",
    "London, UK",
    "Cambridge, MA",
    "Santa Monica, CA",
    "Singapore",
  ]

  const companyTypeOptions = [
    "Foundation",
    "Pension",
    "Endowment",
    "Family Office",
    "Asset Manager",
    "Hedge Fund",
    "Venture Capital",
    "Private Equity",
    "Sovereign Wealth",
    "Sector Specialist",
    "Investment Consultant",
    "Global Consultant",
    "Investment Advisory",
    "Boutique Consultant",
    "Insurance",
  ]

  const sizeOptions = ["Under $1B", "$1B - $5B", "$5B - $25B", "$25B - $100B", "Over $100B"]

  const categories = ["All", "Allocator", "Manager", "Consultant"]

  // Get unique values for filters
  const locations = Array.from(new Set(connectionsState.map((conn) => conn.location)))
  const companyTypes = Array.from(new Set(connectionsState.map((conn) => conn.category)))

  // Count active filters
  const activeFilterCount =
    filters.focusAreas.length +
    filters.locations.length +
    filters.companyTypes.length +
    filters.sizes.length +
    filters.statuses.length +
    (selectedCategory !== "All" ? 1 : 0)

  // Helper function to get AUM size category
  const getAumSizeCategory = (aum: string) => {
    const numericValue = Number.parseFloat(aum.replace(/[^0-9.]/g, ""))
    if (aum.includes("$") && aum.includes("B")) {
      if (numericValue < 1) return "Under $1B"
      if (numericValue <= 5) return "$1B - $5B"
      if (numericValue <= 25) return "$5B - $25B"
      if (numericValue <= 100) return "Over $100B"
      return "Under $1B"
    }
    return "Under $1B"
  }

  // Filter connections based on search query and selected filters
  const filteredConnections = connectionsState.filter((connection) => {
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const nameMatch = connection.name.toLowerCase().includes(searchLower)
      const contactMatch = connection.contactPerson.toLowerCase().includes(searchLower)
      const categoryMatch = connection.category.toLowerCase().includes(searchLower)
      const locationMatch = connection.location.toLowerCase().includes(searchLower)

      // Check focus areas for allocators and managers
      const focusMatch =
        connection.type !== "consultant" &&
        (connection as any).focus?.some((f: string) => f.toLowerCase().includes(searchLower))

      // Check specializations and services for consultants
      const specializationsMatch =
        connection.type === "consultant" &&
        (connection as any).specializations?.some((s: string) => s.toLowerCase().includes(searchLower))
      const servicesMatch =
        connection.type === "consultant" &&
        (connection as any).services?.some((s: string) => s.toLowerCase().includes(searchLower))

      if (
        !nameMatch &&
        !contactMatch &&
        !categoryMatch &&
        !locationMatch &&
        !focusMatch &&
        !specializationsMatch &&
        !servicesMatch
      ) {
        return false
      }
    }

    const matchesCategory = selectedCategory === "All" || connection.type === selectedCategory.toLowerCase()

    const matchesFocusArea =
      filters.focusAreas.length === 0 ||
      (connection.type !== "consultant" && filters.focusAreas.some((fa) => (connection as any).focus?.includes(fa)))

    const matchesLocation = filters.locations.length === 0 || filters.locations.includes(connection.location)

    const matchesCompanyType = filters.companyTypes.length === 0 || filters.companyTypes.includes(connection.category)

    const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(connection.status)

    // Size filter
    const matchesSize = (() => {
      if (filters.sizes.length === 0) return true
      if (connection.type === "consultant") return true
      const connectionSize = getAumSizeCategory((connection as any).aum || "")
      return filters.sizes.includes(connectionSize)
    })()

    return matchesCategory && matchesFocusArea && matchesLocation && matchesCompanyType && matchesStatus && matchesSize
  })

  // Sort connections
  const sortedConnections = [...filteredConnections].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "date":
        return new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime()
      case "type":
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory("All")
    setSortBy("date")
    setFilters({
      focusAreas: [],
      locations: [],
      companyTypes: [],
      sizes: [],
      statuses: [],
    })
  }

  // Remove a specific filter
  const removeFilter = (type: string, value: string) => {
    if (type === "category") {
      setSelectedCategory("All")
    } else if (type === "sortBy") {
      setSortBy("date")
    } else {
      setFilters((prev) => ({
        ...prev,
        [type]: prev[type as keyof typeof prev].filter((item: string) => item !== value),
      }))
    }
  }

  // Get active filters for display
  const getActiveFilters = () => {
    const active = []

    if (selectedCategory !== "All") {
      active.push({ type: "category", value: selectedCategory, label: `Type: ${selectedCategory}` })
    }

    if (sortBy !== "date") {
      active.push({
        type: "sortBy",
        value: sortBy,
        label: `Sort By: ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`,
      })
    }

    filters.focusAreas.forEach((fa) => active.push({ type: "focusAreas", value: fa, label: `Focus: ${fa}` }))

    filters.locations.forEach((location) =>
      active.push({ type: "locations", value: location, label: `Location: ${location}` }),
    )

    filters.companyTypes.forEach((type) => active.push({ type: "companyTypes", value: type, label: `Type: ${type}` }))

    filters.sizes.forEach((size) => active.push({ type: "sizes", value: size, label: `Size: ${size}` }))

    filters.statuses.forEach((status) => active.push({ type: "statuses", value: status, label: `Status: ${status}` }))

    return active
  }

  // Count connections by type
  const allocatorCount = connectionsState.filter((c) => c.type === "allocator").length
  const managerCount = connectionsState.filter((c) => c.type === "manager").length
  const consultantCount = connectionsState.filter((c) => c.type === "consultant").length

  const renderConnectionCard = (connection: any) => {
    const headerColor =
      connection.type === "allocator" ? "bg-blue-600" : connection.type === "manager" ? "bg-green-600" : "bg-purple-600"

    const typeBadgeClass =
      connection.type === "allocator"
        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
        : connection.type === "manager"
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : "bg-purple-100 text-purple-800 hover:bg-purple-100"

    const typeLabel = connection.type.charAt(0).toUpperCase() + connection.type.slice(1)

    return (
      <Card key={connection.id} className="overflow-hidden h-full flex flex-col">
        <div className={`h-2 ${headerColor}`} />
        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Header Section - Fixed Height */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={connection.logo || "/placeholder.svg"} alt={connection.name} />
                <AvatarFallback>{connection.name.split(" ").map((n) => n[0])}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-base leading-tight">{connection.name}</h3>
                <p className="text-sm text-gray-600">{connection.contactPerson}</p>
                <div className="flex items-center mt-2">
                  <Badge className={typeBadgeClass}>{typeLabel}</Badge>
                  <Badge
                    className={
                      connection.status === "connected"
                        ? "ml-2 bg-green-100 text-green-800 hover:bg-green-100"
                        : "ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100"
                    }
                  >
                    {connection.status === "connected" ? "Connected" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Section - Fixed Height */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <Building className="h-4 w-4 mr-2 text-baseGray flex-shrink-0" />
              <span className="truncate">{connection.category}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-baseGray flex-shrink-0" />
              <span className="truncate">{connection.location}</span>
            </div>

            {/* Standardized third row - always present */}
            <div className="flex items-center text-sm">
              {connection.type !== "consultant" ? (
                <>
                  <BarChart4 className="h-4 w-4 mr-2 text-baseGray flex-shrink-0" />
                  <span className="truncate">AUM: {connection.aum}</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2 text-baseGray flex-shrink-0" />
                  <span className="truncate">Clients: {connection.clientCount}</span>
                </>
              )}
            </div>

            {/* Standardized fourth row - always present */}
            <div className="flex items-center text-sm">
              {connection.type !== "consultant" ? (
                <>
                  <Globe className="h-4 w-4 mr-2 text-baseGray flex-shrink-0" />
                  <span className="truncate">
                    Focus: {connection.focus?.slice(0, 2).join(", ")}
                    {connection.focus?.length > 2 && ` +${connection.focus.length - 2} more`}
                  </span>
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2 text-baseGray flex-shrink-0" />
                  <span className="truncate">{connection.yearsInBusiness} Years in Business</span>
                </>
              )}
            </div>
          </div>

          {/* Specializations/Services Section - Fixed Height */}
          <div className="flex-1 mb-4">
            {connection.type !== "consultant" ? (
              <div className="flex items-start text-sm">
                <div className="w-full">
                  <span className="block text-xs text-baseGray mb-1">Focus Areas:</span>
                  <div className="flex flex-wrap gap-1">
                    {connection.focus?.slice(0, 3).map((focus: string) => (
                      <Badge key={focus} variant="outline" className="text-xs">
                        {focus}
                      </Badge>
                    ))}
                    {connection.focus?.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        +{connection.focus.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start text-sm">
                  <div className="w-full">
                    <span className="block text-xs text-baseGray mb-1">Services:</span>
                    <div className="flex flex-wrap gap-1">
                      {connection.services?.slice(0, 2).map((service: string) => (
                        <Badge key={service} variant="outline" className="text-xs bg-purple-50">
                          {service}
                        </Badge>
                      ))}
                      {connection.services?.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          +{connection.services.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start text-sm">
                  <div className="w-full">
                    <span className="block text-xs text-baseGray mb-1">Specializations:</span>
                    <div className="flex flex-wrap gap-1">
                      {connection.specializations?.slice(0, 2).map((spec: string) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {connection.specializations?.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          +{connection.specializations.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Section - Fixed Position */}
          <div className="mt-auto pt-4 border-t">
            <div className="text-xs text-baseGray mb-3">Last interaction: {connection.lastInteraction}</div>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                onClick={() => handleViewProfile(connection)}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                View Profile
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                  onClick={() => handleOpenMessageModal(connection)}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                  onClick={() => handleOpenMeetingModal(connection)}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSendConnectionRequest = () => {
    // Simulate sending connection request
    alert(`Connection request sent to ${selectedUser?.name} with message: ${connectionMessage}`)
    setConnectionRequestDialogOpen(false)
    setConnectionMessage("")
  }

  // State for the Add Connection dialog
  const [showAddConnectionDialog, setShowAddConnectionDialog] = useState(false)

  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Connection Center</h1>
              <p className="text-baseGray">Manage your network of allocators, managers, and consultants</p>
            </div>
            {/* Replace the existing Dialog implementation with this working version: */}
            <Button
              className="mt-4 md:mt-0 bg-electric-blue hover:bg-electric-blue/90 text-white"
              onClick={() => setShowAddConnectionDialog(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Connection
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Connection Overview</CardTitle>
              <CardDescription>Your network at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-deepBrand mr-2" />
                    <h3 className="font-medium">Total Connections</h3>
                  </div>
                  <p className="text-2xl font-bold">{connections.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 text-deepBrand mr-2" />
                    <h3 className="font-medium">Allocators</h3>
                  </div>
                  <p className="text-2xl font-bold">{allocatorCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BarChart4 className="h-5 w-5 text-deepBrand mr-2" />
                    <h3 className="font-medium">Managers</h3>
                  </div>
                  <p className="text-2xl font-bold">{managerCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Briefcase className="h-5 w-5 text-deepBrand mr-2" />
                    <h3 className="font-medium">Consultants</h3>
                  </div>
                  <p className="text-2xl font-bold">{consultantCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search connections..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Filters button */}
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Filters Panel */}
              {isFiltersOpen && (
                <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Advanced Filters</h4>
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Type Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type</Label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategory === category}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategory(category)
                                } else {
                                  setSelectedCategory("All")
                                }
                              }}
                            />
                            <Label htmlFor={`category-${category}`} className="text-sm">
                              {category === "All" ? "All Types" : category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Location</Label>
                      <div className="space-y-2 max-h-24 overflow-y-auto border rounded p-2 bg-white">
                        {locationOptions.map((location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location}`}
                              checked={filters.locations.includes(location)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({ ...prev, locations: [...prev.locations, location] }))
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    locations: prev.locations.filter((l) => l !== location),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={`location-${location}`} className="text-sm">
                              {location}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Company Type Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Company Type</Label>
                      <div className="space-y-2 max-h-24 overflow-y-auto border rounded p-2 bg-white">
                        {companyTypeOptions.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`companytype-${type}`}
                              checked={filters.companyTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({ ...prev, companyTypes: [...prev.companyTypes, type] }))
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    companyTypes: prev.companyTypes.filter((t) => t !== type),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={`companytype-${type}`} className="text-sm">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="status-connected"
                            checked={filters.statuses.includes("connected")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters((prev) => ({ ...prev, statuses: [...prev.statuses, "connected"] }))
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  statuses: prev.statuses.filter((s) => s !== "connected"),
                                }))
                              }
                            }}
                          />
                          <Label htmlFor="status-connected" className="text-sm">
                            Connected
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="status-pending"
                            checked={filters.statuses.includes("pending")}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters((prev) => ({ ...prev, statuses: [...prev.statuses, "pending"] }))
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  statuses: prev.statuses.filter((s) => s !== "pending"),
                                }))
                              }
                            }}
                          />
                          <Label htmlFor="status-pending" className="text-sm">
                            Pending
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="text-sm text-gray-600 mb-4">
                Showing {sortedConnections.length} of {connections.length} connections
                {searchQuery && ` for "${searchQuery}"`}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={tabParam || "all"}>
            <TabsList className="mb-6 bg-[#F1ECE7]">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#3B0A45] data-[state=active]:text-white hover:bg-white hover:text-[#3B0A45] text-[#6D6A75]"
              >
                All Connections
              </TabsTrigger>
              <TabsTrigger
                value="allocators"
                className="data-[state=active]:bg-[#3B0A45] data-[state=active]:text-white hover:bg-white hover:text-[#3B0A45] text-[#6D6A75]"
              >
                Allocators
              </TabsTrigger>
              <TabsTrigger
                value="managers"
                className="data-[state=active]:bg-[#3B0A45] data-[state=active]:text-white hover:bg-white hover:text-[#3B0A45] text-[#6D6A75]"
              >
                Managers
              </TabsTrigger>
              <TabsTrigger
                value="consultants"
                className="data-[state=active]:bg-[#3B0A45] data-[state=active]:text-white hover:bg-white hover:text-[#3B0A45] text-[#6D6A75]"
              >
                Consultants
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-[#3B0A45] data-[state=active]:text-white hover:bg-white hover:text-[#3B0A45] text-[#6D6A75]"
              >
                Pending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedConnections.map(renderConnectionCard)}
              </div>

              {sortedConnections.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-baseGray mb-4" />
                  <h3 className="text-lg font-medium mb-2">No connections found</h3>
                  <p className="text-baseGray mb-4">
                    {searchQuery
                      ? "No connections match your search criteria"
                      : "You haven't added any connections yet"}
                  </p>
                  <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Connection
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="allocators" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedConnections.filter((connection) => connection.type === "allocator").map(renderConnectionCard)}
              </div>
            </TabsContent>

            <TabsContent value="managers" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedConnections.filter((connection) => connection.type === "manager").map(renderConnectionCard)}
              </div>
            </TabsContent>

            <TabsContent value="consultants" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedConnections.filter((connection) => connection.type === "consultant").map(renderConnectionCard)}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <div className="space-y-6">
                {/* Toggle for Pending View */}
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-1 rounded-lg">
                    <div className="flex">
                      <Button
                        variant={pendingView === "received" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPendingView("received")}
                        className={
                          pendingView === "received"
                            ? "bg-electric-blue text-white hover:bg-electric-blue/90"
                            : "text-gray-600 hover:text-gray-900"
                        }
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Invitations Received (
                        {
                          sortedConnections.filter((c) => c.status === "pending" && (c as any).direction === "incoming")
                            .length
                        }
                        )
                      </Button>
                      <Button
                        variant={pendingView === "sent" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPendingView("sent")}
                        className={
                          pendingView === "sent"
                            ? "bg-electric-blue text-white hover:bg-electric-blue/90"
                            : "text-gray-600 hover:text-gray-900"
                        }
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Requests Sent (
                        {
                          sortedConnections.filter((c) => c.status === "pending" && (c as any).direction === "outgoing")
                            .length
                        }
                        )
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Invitations Received View */}
                {pendingView === "received" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedConnections
                        .filter(
                          (connection) =>
                            connection.status === "pending" && (connection as any).direction === "incoming",
                        )
                        .map((connection) => (
                          <Card key={connection.id} className="overflow-hidden">
                            <div
                              className={`h-2 ${connection.type === "allocator" ? "bg-blue-600" : connection.type === "manager" ? "bg-green-600" : "bg-purple-600"}`}
                            />
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                  <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src={connection.logo || "/placeholder.svg"} alt={connection.name} />
                                    <AvatarFallback>{connection.name.split(" ").map((n) => n[0])}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">{connection.name}</h3>
                                    <p className="text-sm text-gray-600">{connection.contactPerson}</p>
                                    <div className="flex items-center mt-1">
                                      <Badge
                                        className={
                                          connection.type === "allocator"
                                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                            : connection.type === "manager"
                                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                                              : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                        }
                                      >
                                        {connection.type.charAt(0).toUpperCase() + connection.type.slice(1)}
                                      </Badge>
                                      <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                        Invitation
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm">
                                  <Building className="h-4 w-4 mr-2 text-baseGray" />
                                  <span>{connection.category}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 text-baseGray" />
                                  <span>{connection.location}</span>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <div className="text-xs text-baseGray">
                                  Invitation received: {connection.lastInteraction}
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                    onClick={() => handleDeclineConnection(connection.id)}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Decline
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                                    onClick={() => handleAcceptConnection(connection.id)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Accept
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {/* Requests Sent View */}
                {pendingView === "sent" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedConnections
                        .filter(
                          (connection) =>
                            connection.status === "pending" && (connection as any).direction === "outgoing",
                        )
                        .map((connection) => (
                          <Card key={connection.id} className="overflow-hidden">
                            <div
                              className={`h-2 ${connection.type === "allocator" ? "bg-blue-600" : connection.type === "manager" ? "bg-green-600" : "bg-purple-600"}`}
                            />
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                  <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src={connection.logo || "/placeholder.svg"} alt={connection.name} />
                                    <AvatarFallback>{connection.name.split(" ").map((n) => n[0])}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">{connection.name}</h3>
                                    <p className="text-sm text-gray-600">{connection.contactPerson}</p>
                                    <div className="flex items-center mt-1">
                                      <Badge
                                        className={
                                          connection.type === "allocator"
                                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                            : connection.type === "manager"
                                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                                              : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                        }
                                      >
                                        {connection.type.charAt(0).toUpperCase() + connection.type.slice(1)}
                                      </Badge>
                                      <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                                        Pending
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm">
                                  <Building className="h-4 w-4 mr-2 text-baseGray" />
                                  <span>{connection.category}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 text-baseGray" />
                                  <span>{connection.location}</span>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <div className="text-xs text-baseGray">Request sent: {connection.lastInteraction}</div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                    onClick={() => handleCancelRequest(connection.id)}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                  <Button size="sm" className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                                    <Mail className="h-3 w-3 mr-1" />
                                    Remind
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Connection Request Dialog */}
          <Dialog open={connectionRequestDialogOpen} onOpenChange={setConnectionRequestDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Connection Request</DialogTitle>
                <DialogDescription>Send a personalized connection request to {selectedUser?.name}</DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name.split(" ").map((n) => n[0])}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedUser.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.title}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.company}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Personal Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Add a personal note to your connection request..."
                      value={connectionMessage}
                      onChange={(e) => setConnectionMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setConnectionRequestDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendConnectionRequest}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Add this dialog at the end of the component, before the closing Screen tag: */}
      {showAddConnectionDialog && (
        <Dialog open={showAddConnectionDialog} onOpenChange={setShowAddConnectionDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Connection</DialogTitle>
              <DialogDescription>Search for Vestira users or invite someone via email</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Search Section */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, company, or expertise..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                {userSearchQuery && (
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                    <h4 className="font-medium text-sm text-muted-foreground px-2">Vestira Users</h4>
                    {mockSearchResults
                      .filter(
                        (user) =>
                          user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          user.company.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          user.expertise.some((exp) => exp.toLowerCase().includes(userSearchQuery.toLowerCase())),
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.title}</p>
                              <p className="text-sm text-muted-foreground">{user.company}</p>
                              <div className="flex gap-1 mt-1">
                                {user.expertise.slice(0, 2).map((exp) => (
                                  <Badge key={exp} variant="outline" className="text-xs">
                                    {exp}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setConnectionRequestDialogOpen(true)
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Connect
                          </Button>
                        </div>
                      ))}
                    {mockSearchResults.filter(
                      (user) =>
                        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        user.company.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        user.expertise.some((exp) => exp.toLowerCase().includes(userSearchQuery.toLowerCase())),
                    ).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No users found matching your search
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Email Invitation Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Invite via Email</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address..."
                    type="email"
                    className="flex-1"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (inviteEmail) {
                        alert(`Invitation sent to ${inviteEmail}`)
                        setInviteEmail("")
                      }
                    }}
                    disabled={!inviteEmail}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Invite
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Send an invitation to join Vestira and connect with you</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Message
            </DialogTitle>
            <DialogDescription>
              Send a message to {selectedConnection?.contactPerson} at {selectedConnection?.name}
            </DialogDescription>
          </DialogHeader>

          {messageSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">Your message has been sent to {selectedConnection?.contactPerson}.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategy">Purpose of Meeting (Optional)</Label>
                <Input
                  id="strategy"
                  placeholder="e.g., Global Equity Fund, Fixed Income Strategy"
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageContent">Message</Label>
                <Textarea
                  id="messageContent"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Meeting Modal */}
      <Dialog open={isMeetingModalOpen} onOpenChange={setIsMeetingModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Meeting
            </DialogTitle>
            <DialogDescription>
              Schedule a meeting with {selectedConnection?.contactPerson} at {selectedConnection?.name}
            </DialogDescription>
          </DialogHeader>

          {meetingSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Meeting Scheduled!</h3>
              <p className="text-gray-600">
                Your meeting with {selectedConnection?.contactPerson} has been scheduled for {meetingDate} at{" "}
                {meetingTime}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meetingStrategy">Purpose of Meeting (Optional)</Label>
                <Input
                  id="meetingStrategy"
                  placeholder="e.g., Global Equity Fund, Fixed Income Strategy"
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meetingDate">Date</Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingTime">Time</Label>
                  <Input
                    id="meetingTime"
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingNotes">Additional Information (Optional)</Label>
                <Textarea
                  id="meetingNotes"
                  placeholder="Add any notes or agenda items for the meeting..."
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsMeetingModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScheduleMeeting} disabled={!meetingDate || !meetingTime}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Screen>
  )
}
