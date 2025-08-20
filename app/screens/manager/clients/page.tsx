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

interface Contact {
  name: string
  title: string
  email: string
  strategies: string[]
  isMainContact: boolean
}

interface ClientFirm {
  id: string
  firmName: string
  organizationType: string
  location: string
  aum: string
  commitment: string
  assetClasses: string[]
  strategies: string[]
  logo: string
  lastContact: string
  relationship: string
  description: string
  contacts: Contact[]
}

const mockClientFirms: ClientFirm[] = [
  {
    id: "1",
    firmName: "State Teachers' Pension Fund",
    organizationType: "Pension Fund",
    location: "Austin, TX",
    aum: "$45B",
    commitment: "$250M",
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Private Equity", "Growth Equity"],
    logo: "/pension-fund-allocation.png",
    lastContact: "2024-01-10",
    relationship: "Active Client",
    description: "Long-term institutional investor focused on alternative investments and ESG strategies.",
    contacts: [
      {
        name: "Sarah Johnson",
        title: "Chief Investment Officer",
        email: "sarah.johnson@statepension.gov",
        strategies: ["Private Equity", "Growth Equity"],
        isMainContact: true,
      },
      {
        name: "Michael Chen",
        title: "Alternative Investments Director",
        email: "michael.chen@statepension.gov",
        strategies: ["Private Equity"],
        isMainContact: false,
      },
    ],
  },
  {
    id: "2",
    firmName: "University Endowment Foundation",
    organizationType: "Endowment",
    location: "Boston, MA",
    aum: "$12B",
    commitment: "$150M",
    assetClasses: ["Public Equities", "Private Equity & Other Alternatives"],
    strategies: ["Large Cap Equity", "Venture Capital"],
    logo: "/abstract-ej-typography.png",
    lastContact: "2024-01-08",
    relationship: "Active Client",
    description: "Endowment manager with focus on long-term growth and diversified portfolio strategies.",
    contacts: [
      {
        name: "Jennifer Rodriguez",
        title: "Portfolio Manager",
        email: "jennifer.rodriguez@universityendowment.edu",
        strategies: ["Large Cap Equity", "Venture Capital"],
        isMainContact: true,
      },
      {
        name: "David Park",
        title: "Investment Director",
        email: "david.park@universityendowment.edu",
        strategies: ["Venture Capital"],
        isMainContact: false,
      },
    ],
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
  const [filteredClientFirms, setFilteredClientFirms] = useState(mockClientFirms)
  const [showFilters, setShowFilters] = useState(false)

  const [selectedClient, setSelectedClient] = useState<ClientFirm | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)

  const handleViewProfile = (clientId: string) => {
    router.push(`/screens/general/allocator-profile?id=${clientId}`)
  }

  const handleSendMessage = (client: ClientFirm, contact?: Contact) => {
    setSelectedClient(client)
    setSelectedContact(contact || client.contacts[0])
    setIsMessageModalOpen(true)
  }

  const handleScheduleMeeting = (client: ClientFirm, contact?: Contact) => {
    setSelectedClient(client)
    setSelectedContact(contact || client.contacts[0])
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

    const filtered = mockClientFirms.filter((client) => {
      const matchesSearch =
        client.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contacts.some(contact => 
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.title.toLowerCase().includes(searchTerm.toLowerCase())
        )

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
      filtered.sort((a, b) => a.firmName.localeCompare(b.firmName))
    } else if (sortBy === "lastContact") {
      filtered.sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
    }

    setFilteredClientFirms(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    // Re-apply filters with new search term
    const currentFilters = {
      assetClasses: filters.assetClasses,
      strategies: filters.strategies,
      organizationTypes: filters.organizationTypes,
    }
    handleFiltersChange(currentFilters)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    // Re-apply filters with new sort
    const currentFilters = {
      assetClasses: filters.assetClasses,
      strategies: filters.strategies,
      organizationTypes: filters.organizationTypes,
    }
    handleFiltersChange(currentFilters)
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
            data={filteredClientFirms}
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
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      Filters
                    </Button>
                  </div>
                </div>

                {showFilters && (
                  <div className="mb-6">
                    <ComprehensiveFilters 
                      onFiltersChange={handleFiltersChange} 
                      initialFilters={filters} 
                      showSectors={false}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-baseGray">
              Showing {filteredClientFirms.length} of {mockClientFirms.length} firms
            </p>
            <div className="flex gap-4 text-sm text-baseGray">
              <span>Active: {filteredClientFirms.filter((c) => c.relationship === "Active Client").length}</span>
              <span>Prospects: {filteredClientFirms.filter((c) => c.relationship === "Prospect").length}</span>
              <span>
                Total Commitments: $
                {filteredClientFirms.reduce((sum, c) => sum + Number.parseFloat(c.commitment.replace(/[$M]/g, "")), 0)}M
              </span>
            </div>
          </div>

          {/* Client Firms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClientFirms.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Firm Header Section */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={client.logo || "/placeholder.svg"} alt={client.firmName} />
                      <AvatarFallback className="text-lg bg-electric-blue/10 text-electric-blue">
                        {client.firmName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-lg text-deepBrand mb-1">{client.firmName}</CardTitle>
                          <p className="text-sm text-baseGray mb-1">{client.organizationType}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getRelationshipColor(client.relationship)} variant="secondary">
                            {client.relationship}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-baseGray flex-shrink-0" />
                        <span className="text-sm text-baseGray truncate">{client.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mb-4">
                    <p className="text-sm text-baseGray line-clamp-2">{client.description}</p>
                  </div>

                  {/* Firm Info Grid Section */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
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
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray">{client.contacts.length} contacts</span>
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-1">
                      {client.assetClasses.map((assetClass) => (
                        <Badge key={assetClass} variant="secondary" className="text-xs">
                          {assetClass}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {client.strategies.map((strategy) => (
                        <Badge key={strategy} variant="outline" className="text-xs">
                          {strategy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Contacts Section */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-deepBrand mb-2">Contacts</h4>
                    <div className="space-y-2">
                      {client.contacts.map((contact, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{contact.name}</span>
                              {contact.isMainContact && (
                                <Badge variant="outline" className="text-xs">Primary</Badge>
                              )}
                            </div>
                            <p className="text-xs text-baseGray">{contact.title}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleSendMessage(client, contact)}
                            >
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleScheduleMeeting(client, contact)}
                            >
                              <Calendar className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="pt-4 border-t">
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
                          View Profile
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

          {filteredClientFirms.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-baseGray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-deepBrand mb-2">No client firms found</h3>
                <p className="text-baseGray">Try adjusting your search terms or filters to find relevant client firms.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {selectedClient && selectedContact && (
        <>
          <SendMessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipientName={selectedContact.name}
            recipientTitle={selectedContact.title}
            organizationName={selectedClient.firmName}
          />
          <ScheduleMeetingModal
            isOpen={isMeetingModalOpen}
            onClose={() => setIsMeetingModalOpen(false)}
            recipientName={selectedContact.name}
            recipientEmail={selectedContact.email}
            organizationName={selectedClient.firmName}
          />
        </>
      )}
    </Screen>
  )
}
