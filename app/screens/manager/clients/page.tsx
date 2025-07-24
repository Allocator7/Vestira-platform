"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ComprehensiveFilters } from "@/components/ComprehensiveFilters"
import { SearchInput } from "@/components/SearchInput"
import { SortDropdown } from "@/components/SortDropdown"
import { ExportButton } from "@/components/ExportButton"
import { MapPin, Building2, TrendingUp, Users, MessageCircle, Calendar, Eye, DollarSign } from "lucide-react"
import { SendMessageModal } from "@/components/profile-modals/SendMessageModal"
import { ScheduleMeetingModal } from "@/components/profile-modals/ScheduleMeetingModal"

interface Client {
  id: string
  name: string
  title: string
  organization: string
  organizationType: string
  location: string
  aum: string
  commitment: string
  assetClasses: string[]
  strategies: string[]
  avatar: string
  lastContact: string
  relationship: string
  status: string
  description: string
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Chief Investment Officer",
    organization: "State Teachers' Pension Fund",
    organizationType: "Pension Fund",
    location: "Austin, TX",
    aum: "$45B",
    commitment: "$250M",
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Private Equity", "Growth Equity"],
    avatar: "/placeholder-user.jpg",
    lastContact: "2024-01-10",
    relationship: "Active Client",
    status: "Committed",
    description: "Long-term institutional investor focused on alternative investments and ESG strategies.",
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Portfolio Manager",
    organization: "University Endowment Foundation",
    organizationType: "Endowment",
    location: "Boston, MA",
    aum: "$12B",
    commitment: "$150M",
    assetClasses: ["Public Equities", "Private Equity & Other Alternatives"],
    strategies: ["Large Cap Equity", "Venture Capital"],
    avatar: "/placeholder-user.jpg",
    lastContact: "2024-01-08",
    relationship: "Active Client",
    status: "Committed",
    description: "Endowment manager with focus on long-term growth and diversified portfolio strategies.",
  },
  {
    id: "3",
    name: "Jennifer Rodriguez",
    title: "Senior Investment Director",
    organization: "Global Insurance Group",
    organizationType: "Insurance Company",
    location: "New York, NY",
    aum: "$85B",
    commitment: "$400M",
    assetClasses: ["Public Fixed Income", "Private Fixed Income"],
    strategies: ["Investment Grade Corporate Bonds", "Direct Lending"],
    avatar: "/placeholder-user.jpg",
    lastContact: "2024-01-05",
    relationship: "Active Client",
    status: "Committed",
    description: "Insurance investment professional specializing in fixed income and credit strategies.",
  },
  {
    id: "4",
    name: "David Park",
    title: "Managing Director",
    organization: "Sovereign Wealth Fund",
    organizationType: "Sovereign Wealth Fund",
    location: "Singapore",
    aum: "$320B",
    commitment: "$800M",
    assetClasses: ["Real Estate", "Private Fixed Income"],
    strategies: ["Real Estate Equity", "Infrastructure Debt"],
    avatar: "/placeholder-user.jpg",
    lastContact: "2024-01-03",
    relationship: "Prospect",
    status: "In Discussion",
    description: "Sovereign wealth fund manager focused on infrastructure and real estate investments.",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    title: "Chief Investment Officer",
    organization: "Family Office Partners",
    organizationType: "Family Office",
    location: "San Francisco, CA",
    aum: "$8B",
    commitment: "$100M",
    assetClasses: ["Public Equities", "Private Equity & Other Alternatives"],
    strategies: ["ESG/Sustainable Equity", "Venture Capital"],
    avatar: "/placeholder-user.jpg",
    lastContact: "2023-12-28",
    relationship: "Prospect",
    status: "Evaluating",
    description: "Family office CIO with emphasis on sustainable investing and technology ventures.",
  },
  {
    id: "6",
    name: "Robert Williams",
    title: "Investment Committee Chair",
    organization: "Healthcare Foundation",
    organizationType: "Foundation",
    location: "Chicago, IL",
    aum: "$3.5B",
    commitment: "$75M",
    assetClasses: ["Public Fixed Income", "Public Equities"],
    strategies: ["Core Fixed Income", "Large Cap Equity"],
    avatar: "/placeholder-user.jpg",
    lastContact: "2023-12-20",
    relationship: "Past Client",
    status: "Completed",
    description: "Foundation investment leader focused on healthcare sector and conservative strategies.",
  },
]

export default function ManagerClientsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("commitment")
  const [filters, setFilters] = useState({
    assetClasses: [] as string[],
    strategies: [] as string[],
    organizationTypes: [] as string[],
  })
  const [filteredClients, setFilteredClients] = useState(mockClients)

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)

  const handleViewProfile = (clientId: string) => {
    router.push(`/screens/general/allocator-profile?id=${clientId}`)
  }

  const handleSendMessage = (client: Client) => {
    setSelectedClient(client)
    setIsMessageModalOpen(true)
  }

  const handleScheduleMeeting = (client: Client) => {
    setSelectedClient(client)
    setIsMeetingModalOpen(true)
  }

  const handleFiltersChange = (newFilters: {
    assetClasses: string[]
    strategies: string[]
    organizationTypes?: string[]
  }) => {
    setFilters({
      assetClasses: newFilters.assetClasses,
      strategies: newFilters.strategies,
      organizationTypes: newFilters.organizationTypes || [],
    })

    const filtered = mockClients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAssetClass =
        newFilters.assetClasses.length === 0 || newFilters.assetClasses.some((ac) => client.assetClasses.includes(ac))

      const matchesStrategy =
        newFilters.strategies.length === 0 || newFilters.strategies.some((s) => client.strategies.includes(s))

      const matchesOrgType =
        !newFilters.organizationTypes ||
        newFilters.organizationTypes.length === 0 ||
        newFilters.organizationTypes.includes(client.organizationType)

      return matchesSearch && matchesAssetClass && matchesStrategy && matchesOrgType
    })

    // Apply sorting
    if (sortBy === "commitment") {
      filtered.sort((a, b) => {
        const commitmentA = Number.parseFloat(a.commitment.replace(/[$M]/g, ""))
        const commitmentB = Number.parseFloat(b.commitment.replace(/[$M]/g, ""))
        return commitmentB - commitmentA
      })
    } else if (sortBy === "aum") {
      filtered.sort((a, b) => {
        const aumA = Number.parseFloat(a.aum.replace(/[$B]/g, ""))
        const aumB = Number.parseFloat(b.aum.replace(/[$B]/g, ""))
        return aumB - aumA
      })
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "lastContact") {
      filtered.sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
    }

    setFilteredClients(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    handleFiltersChange(filters)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    handleFiltersChange(filters)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Committed":
        return "bg-green-100 text-green-800"
      case "In Discussion":
        return "bg-blue-100 text-blue-800"
      case "Evaluating":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case "Active Client":
        return "bg-green-100 text-green-800"
      case "Prospect":
        return "bg-blue-100 text-blue-800"
      case "Past Client":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-deepBrand">Client Portfolio</h1>
            <p className="text-baseGray mt-1">Manage relationships with your institutional clients</p>
          </div>
          <ExportButton
            data={filteredClients}
            filename="client-portfolio"
            className="bg-electric-blue hover:bg-electric-blue/90 text-white"
          />
        </div>

        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchInput
                      placeholder="Search clients by name, organization, or focus..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <SortDropdown
                      value={sortBy}
                      onChange={handleSortChange}
                      options={[
                        { value: "commitment", label: "Largest Commitment" },
                        { value: "aum", label: "Largest AUM" },
                        { value: "name", label: "Name A-Z" },
                        { value: "lastContact", label: "Recent Contact" },
                      ]}
                    />
                  </div>
                </div>

                <ComprehensiveFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters}
                  showOrganizationTypes={true}
                  userType="allocator"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-baseGray">
              Showing {filteredClients.length} of {mockClients.length} clients
            </p>
            <div className="flex gap-4 text-sm text-baseGray">
              <span>Active: {filteredClients.filter((c) => c.relationship === "Active Client").length}</span>
              <span>Prospects: {filteredClients.filter((c) => c.relationship === "Prospect").length}</span>
              <span>
                Total Commitments: $
                {filteredClients.reduce((sum, c) => sum + Number.parseFloat(c.commitment.replace(/[$M]/g, "")), 0)}M
              </span>
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Header Section */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
                      <AvatarFallback className="text-lg bg-electric-blue/10 text-electric-blue">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-lg text-deepBrand mb-1">{client.name}</CardTitle>
                          <p className="text-sm text-baseGray mb-1">{client.title}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getRelationshipColor(client.relationship)} variant="secondary">
                            {client.relationship}
                          </Badge>
                          <Badge className={getStatusColor(client.status)} variant="outline">
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-baseGray flex-shrink-0" />
                        <span className="text-sm text-baseGray truncate">{client.organization}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mb-4 h-10">
                    <p className="text-sm text-baseGray line-clamp-2">{client.description}</p>
                  </div>

                  {/* Info Grid Section */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4 h-16">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray truncate">{client.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray">AUM: {client.aum}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray">Commitment: {client.commitment}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray">Last: {new Date(client.lastContact).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div className="space-y-2 mb-4 h-16">
                    <div className="flex flex-wrap gap-1 h-6">
                      {client.assetClasses.map((assetClass) => (
                        <Badge key={assetClass} variant="secondary" className="text-xs h-5">
                          {assetClass}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 h-6">
                      {client.strategies.map((strategy) => (
                        <Badge key={strategy} variant="outline" className="text-xs h-5">
                          {strategy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="mt-auto pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-baseGray">
                        <span>{client.organizationType}</span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          onClick={() => handleViewProfile(client.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                          onClick={() => handleScheduleMeeting(client)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs bg-electric-blue hover:bg-electric-blue/90 text-white"
                          onClick={() => handleSendMessage(client)}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-baseGray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-deepBrand mb-2">No clients found</h3>
                <p className="text-baseGray">Try adjusting your search terms or filters to find relevant clients.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {selectedClient && (
        <>
          <SendMessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipientName={selectedClient.name}
            organizationName={selectedClient.organization}
          />
          <ScheduleMeetingModal
            isOpen={isMeetingModalOpen}
            onClose={() => setIsMeetingModalOpen(false)}
            recipientName={selectedClient.name}
            recipientEmail={`${selectedClient.name.toLowerCase().replace(" ", ".")}@${selectedClient.organization.toLowerCase().replace(/\s+/g, "")}.com`}
          />
        </>
      )}
    </Screen>
  )
}
