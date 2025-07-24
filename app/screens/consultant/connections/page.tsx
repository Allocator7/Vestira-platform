"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  ChevronDown,
  Check,
  X,
  Clock,
  Briefcase,
  BookOpen,
  Award,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ConsultantConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [pendingView, setPendingView] = useState<"received" | "sent">("received")

  // Sample connections data
  const connections = [
    {
      id: 1,
      name: "Foundation Investments",
      type: "allocator",
      logo: "/FI_logo.png",
      category: "Foundation",
      location: "New York, NY",
      aum: "$15B+",
      focus: ["Private Equity", "Hedge Funds", "Real Estate"],
      status: "connected",
      lastInteraction: "May 10, 2025",
    },
    {
      id: 2,
      name: "State Pension Fund",
      type: "allocator",
      logo: "/trp-symbol.png",
      category: "Pension",
      location: "Boston, MA",
      aum: "$75B+",
      focus: ["Fixed Income", "Public Equities", "Alternatives"],
      status: "connected",
      lastInteraction: "May 5, 2025",
    },
    {
      id: 3,
      name: "University Endowment",
      type: "allocator",
      logo: "/roman-numeral-vi.png",
      category: "Endowment",
      location: "Cambridge, MA",
      aum: "$40B+",
      focus: ["Venture Capital", "Hedge Funds", "Private Credit"],
      status: "connected",
      lastInteraction: "April 28, 2025",
    },
    {
      id: 4,
      name: "Family Office X",
      type: "allocator",
      logo: "/equity-firm-logo.png",
      category: "Family Office",
      location: "San Francisco, CA",
      aum: "$5B+",
      focus: ["Impact Investing", "Technology", "Healthcare"],
      status: "connected",
      lastInteraction: "April 20, 2025",
    },
    {
      id: 5,
      name: "Global Asset Management",
      type: "allocator",
      logo: "/abstract-geometric-br.png",
      category: "Asset Manager",
      location: "London, UK",
      aum: "$120B+",
      focus: ["Multi-Asset", "Alternatives", "ESG"],
      status: "pending",
      direction: "outgoing",
      lastInteraction: "May 12, 2025",
    },
    {
      id: 6,
      name: "Quantum Capital Partners",
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
      id: 7,
      name: "Venture Partners",
      type: "manager",
      logo: "/spf-sunscreen-bottle.png",
      category: "Venture Capital",
      location: "San Francisco, CA",
      aum: "$1.8B+",
      focus: ["Early Stage", "Technology", "Healthcare"],
      status: "pending",
      direction: "outgoing",
      lastInteraction: "May 11, 2025",
    },
    {
      id: 8,
      name: "Private Equity Group",
      type: "manager",
      logo: "/project-management-overview.png",
      category: "Private Equity",
      location: "Chicago, IL",
      aum: "$5B+",
      focus: ["Buyouts", "Growth Equity", "Distressed"],
      status: "connected",
      lastInteraction: "April 25, 2025",
    },
    {
      id: 9,
      name: "Cambridge Associates",
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
      id: 10,
      name: "Mercer Investments",
      type: "consultant",
      logo: "/abstract-geometric-ts.png",
      category: "Global Consultant",
      location: "New York, NY",
      clientCount: "1200+",
      yearsInBusiness: 75,
      services: ["Manager Research", "OCIO Services", "Risk Management"],
      specializations: ["Corporate Pensions", "Insurance", "Sovereign Wealth"],
      status: "connected",
      lastInteraction: "May 3, 2025",
    },
    {
      id: 11,
      name: "Wilshire Advisors",
      type: "consultant",
      logo: "/abstract-vg.png",
      category: "Investment Advisory",
      location: "Santa Monica, CA",
      clientCount: "600+",
      yearsInBusiness: 40,
      services: ["Asset Allocation", "Manager Selection", "Investment Technology"],
      specializations: ["Public Funds", "Taft-Hartley Plans", "Healthcare Organizations"],
      status: "pending",
      direction: "outgoing",
      lastInteraction: "May 9, 2025",
    },
    {
      id: 12,
      name: "Aon Hewitt Investment",
      type: "consultant",
      logo: "/abstract-ba.png",
      category: "Global Consultant",
      location: "Chicago, IL",
      clientCount: "800+",
      yearsInBusiness: 45,
      services: ["Fiduciary Management", "Manager Research", "Portfolio Implementation"],
      specializations: ["Defined Benefit", "Defined Contribution", "Endowments"],
      status: "connected",
      lastInteraction: "April 30, 2025",
    },
    {
      id: 13,
      name: "Sovereign Wealth Partners",
      type: "allocator",
      logo: "/abstract-geometric-br.png",
      category: "Sovereign Wealth",
      location: "Singapore",
      aum: "$200B+",
      focus: ["Infrastructure", "Real Estate", "Private Equity"],
      status: "pending",
      direction: "incoming",
      lastInteraction: "May 13, 2025",
    },
    {
      id: 14,
      name: "Healthcare Investment Group",
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

  // Filter connections based on search query and selected filters
  const filteredConnections = connections.filter((connection) => {
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const nameMatch = connection.name.toLowerCase().includes(searchLower)
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

      if (!nameMatch && !categoryMatch && !locationMatch && !focusMatch && !specializationsMatch && !servicesMatch) {
        return false
      }
    }

    // Filter by selected filters
    if (selectedFilters.length > 0) {
      if (
        (selectedFilters.includes("allocator") && connection.type !== "allocator") ||
        (selectedFilters.includes("manager") && connection.type !== "manager") ||
        (selectedFilters.includes("consultant") && connection.type !== "consultant") ||
        (selectedFilters.includes("connected") && connection.status !== "connected") ||
        (selectedFilters.includes("pending") && connection.status !== "pending")
      ) {
        return false
      }
    }

    return true
  })

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter))
    } else {
      setSelectedFilters([...selectedFilters, filter])
    }
  }

  // Count connections by type
  const allocatorCount = connections.filter((c) => c.type === "allocator").length
  const managerCount = connections.filter((c) => c.type === "manager").length
  const consultantCount = connections.filter((c) => c.type === "consultant").length

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
      <Card key={connection.id} className="overflow-hidden">
        <div className={`h-2 ${headerColor}`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={connection.logo || "/placeholder.svg"} alt={connection.name} />
                <AvatarFallback>
                  {connection.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{connection.name}</h3>
                <div className="flex items-center mt-1">
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

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm">
              <Building className="h-4 w-4 mr-2 text-base-gray" />
              <span>{connection.category}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-base-gray" />
              <span>{connection.location}</span>
            </div>

            {connection.type !== "consultant" ? (
              <>
                <div className="flex items-center text-sm">
                  <BarChart4 className="h-4 w-4 mr-2 text-base-gray" />
                  <span>AUM: {connection.aum}</span>
                </div>
                <div className="flex items-start text-sm">
                  <Globe className="h-4 w-4 mr-2 mt-0.5 text-base-gray" />
                  <div>
                    <span className="block">Focus Areas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {connection.focus.map((focus: string) => (
                        <Badge key={focus} variant="outline" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-base-gray" />
                  <span>Clients: {connection.clientCount}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 mr-2 text-base-gray" />
                  <span>{connection.yearsInBusiness} Years in Business</span>
                </div>
                <div className="flex items-start text-sm">
                  <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-base-gray" />
                  <div>
                    <span className="block">Services:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {connection.services.map((service: string) => (
                        <Badge key={service} variant="outline" className="text-xs bg-purple-50">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start text-sm">
                  <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-base-gray" />
                  <div>
                    <span className="block">Specializations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {connection.specializations.map((spec: string) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-base-gray mb-3">Last interaction: {connection.lastInteraction}</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
              >
                <Mail className="h-3 w-3 mr-1" />
                Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Connection Center</h1>
              <p className="text-base-gray">Manage your network of allocators, managers, and consultants</p>
            </div>
            <Button
              className="mt-4 md:mt-0 bg-electric-blue hover:bg-electric-blue/90 text-white"
              onClick={() => {
                alert("Add Connection feature coming soon! This will open a form to add new connections.")
              }}
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
                    <Users className="h-5 w-5 text-deep-brand mr-2" />
                    <h3 className="font-medium">Total Connections</h3>
                  </div>
                  <p className="text-2xl font-bold">{connections.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 text-deep-brand mr-2" />
                    <h3 className="font-medium">Allocators</h3>
                  </div>
                  <p className="text-2xl font-bold">{allocatorCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BarChart4 className="h-5 w-5 text-deep-brand mr-2" />
                    <h3 className="font-medium">Managers</h3>
                  </div>
                  <p className="text-2xl font-bold">{managerCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Briefcase className="h-5 w-5 text-deep-brand mr-2" />
                    <h3 className="font-medium">Consultants</h3>
                  </div>
                  <p className="text-2xl font-bold">{consultantCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-base-gray" />
              <Input
                placeholder="Search connections..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem onClick={() => toggleFilter("allocator")}>
                  {selectedFilters.includes("allocator") && <Check className="mr-2 h-4 w-4" />}
                  Allocators
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleFilter("manager")}>
                  {selectedFilters.includes("manager") && <Check className="mr-2 h-4 w-4" />}
                  Managers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleFilter("consultant")}>
                  {selectedFilters.includes("consultant") && <Check className="mr-2 h-4 w-4" />}
                  Consultants
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleFilter("connected")}>
                  {selectedFilters.includes("connected") && <Check className="mr-2 h-4 w-4" />}
                  Connected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleFilter("pending")}>
                  {selectedFilters.includes("pending") && <Check className="mr-2 h-4 w-4" />}
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(filter)} />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setSelectedFilters([])}>
                Clear All
              </Button>
            </div>
          )}

          <Tabs defaultValue="all">
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
                {filteredConnections.map(renderConnectionCard)}
              </div>

              {filteredConnections.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-base-gray mb-4" />
                  <h3 className="text-lg font-medium mb-2">No connections found</h3>
                  <p className="text-base-gray mb-4">
                    {searchQuery
                      ? "No connections match your search criteria"
                      : "You haven't added any connections yet"}
                  </p>
                  <Button
                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                    onClick={() => {
                      alert("Add Connection feature coming soon! This will open a form to add new connections.")
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Connection
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="allocators" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConnections.filter((connection) => connection.type === "allocator").map(renderConnectionCard)}
              </div>

              {filteredConnections.filter((connection) => connection.type === "allocator").length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Building className="h-12 w-12 mx-auto text-base-gray mb-4" />
                  <h3 className="text-lg font-medium mb-2">No allocators found</h3>
                  <p className="text-base-gray mb-4">
                    {searchQuery ? "No allocators match your search criteria" : "You haven't added any allocators yet"}
                  </p>
                  <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Allocator
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="managers" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConnections.filter((connection) => connection.type === "manager").map(renderConnectionCard)}
              </div>

              {filteredConnections.filter((connection) => connection.type === "manager").length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BarChart4 className="h-12 w-12 mx-auto text-base-gray mb-4" />
                  <h3 className="text-lg font-medium mb-2">No managers found</h3>
                  <p className="text-base-gray mb-4">
                    {searchQuery ? "No managers match your search criteria" : "You haven't added any managers yet"}
                  </p>
                  <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Manager
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="consultants" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConnections.filter((connection) => connection.type === "consultant").map(renderConnectionCard)}
              </div>

              {filteredConnections.filter((connection) => connection.type === "consultant").length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Briefcase className="h-12 w-12 mx-auto text-base-gray mb-4" />
                  <h3 className="text-lg font-medium mb-2">No consultants found</h3>
                  <p className="text-base-gray mb-4">
                    {searchQuery
                      ? "No consultants match your search criteria"
                      : "You haven't added any consultants yet"}
                  </p>
                  <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Consultant
                  </Button>
                </div>
              )}
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
                          filteredConnections.filter(
                            (c) => c.status === "pending" && (c as any).direction === "incoming",
                          ).length
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
                          filteredConnections.filter(
                            (c) => c.status === "pending" && (c as any).direction === "outgoing",
                          ).length
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
                      {filteredConnections
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
                                    <AvatarFallback>
                                      {connection.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">{connection.name}</h3>
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
                                  <Building className="h-4 w-4 mr-2 text-base-gray" />
                                  <span>{connection.category}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 text-base-gray" />
                                  <span>{connection.location}</span>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <div className="text-xs text-base-gray">
                                  Invitation received: {connection.lastInteraction}
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Decline
                                  </Button>
                                  <Button size="sm" className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                                    <Check className="h-3 w-3 mr-1" />
                                    Accept
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>

                    {filteredConnections.filter(
                      (connection) => connection.status === "pending" && (connection as any).direction === "incoming",
                    ).length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Mail className="h-12 w-12 mx-auto text-base-gray mb-4" />
                        <h3 className="text-lg font-medium mb-2">No invitations received</h3>
                        <p className="text-base-gray mb-4">
                          {searchQuery
                            ? "No invitations match your search criteria"
                            : "You don't have any pending invitations to connect"}
                        </p>
                        <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Find Connections
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Requests Sent View */}
                {pendingView === "sent" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredConnections
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
                                    <AvatarFallback>
                                      {connection.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">{connection.name}</h3>
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
                                  <Building className="h-4 w-4 mr-2 text-base-gray" />
                                  <span>{connection.category}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2 text-base-gray" />
                                  <span>{connection.location}</span>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <div className="text-xs text-base-gray">Request sent: {connection.lastInteraction}</div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
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

                    {filteredConnections.filter(
                      (connection) => connection.status === "pending" && (connection as any).direction === "outgoing",
                    ).length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Clock className="h-12 w-12 mx-auto text-base-gray mb-4" />
                        <h3 className="text-lg font-medium mb-2">No requests sent</h3>
                        <p className="text-base-gray mb-4">
                          {searchQuery
                            ? "No sent requests match your search criteria"
                            : "You haven't sent any connection requests yet"}
                        </p>
                        <Button
                          className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                          onClick={() => {
                            alert("Add Connection feature coming soon! This will open a form to add new connections.")
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Connection
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Screen>
  )
}
