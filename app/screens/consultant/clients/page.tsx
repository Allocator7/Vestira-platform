"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ComprehensiveFilters } from "@/components/ComprehensiveFilters"
import { SearchInput } from "@/components/SearchInput"
import { SortDropdown } from "@/components/SortDropdown"
import { ExportButton } from "@/components/ExportButton"
import {
  MapPin,
  Building2,
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Eye,
  DollarSign,
  FileText,
  User,
} from "lucide-react"
import { SendMessageModal } from "@/components/profile-modals/SendMessageModal"
import { ScheduleMeetingModal } from "@/components/profile-modals/ScheduleMeetingModal"
import { useRouter } from "next/navigation"

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
  contractValue: string
  assetClasses: string[]
  strategies: string[]
  logo: string
  lastContact: string
  relationship: string
  status: string
  description: string
  consultingServices: string[]
  projectCount: number
  contacts: Contact[]
}

const mockClientFirms: ClientFirm[] = [
  {
    id: "1",
    firmName: "Sovereign Wealth Fund",
    organizationType: "Pension Fund",
    location: "Austin, TX",
    contractValue: "$2.5M",
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Private Equity", "Growth Equity"],
    logo: "/pension-fund-allocation.png",
    lastContact: "2024-01-10",
    relationship: "Active Client",
    status: "Active Client",
    description: "Long-term institutional investor focused on alternative investments and ESG strategies.",
    consultingServices: ["Investment Strategy", "ESG Implementation", "Risk Management"],
    projectCount: 3,
    contacts: [
      {
        name: "Sarah Chen",
        title: "Chief Investment Officer",
        email: "sarah@swf.gov.sg",
        strategies: ["Private Equity", "Growth Equity"],
        isMainContact: true,
      },
      {
        name: "Michael Torres",
        title: "Managing Director",
        email: "michael@swf.gov.sg",
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
    contractValue: "$1.8M",
    assetClasses: ["Public Equities", "Private Equity & Other Alternatives"],
    strategies: ["Large Cap Equity", "Venture Capital"],
    logo: "/abstract-ej-typography.png",
    lastContact: "2024-01-08",
    relationship: "Active Client",
    status: "Active Client",
    description: "Endowment manager with focus on long-term growth and diversified portfolio strategies.",
    consultingServices: ["Portfolio Optimization", "Alternative Investments", "Performance Analysis"],
    projectCount: 2,
    contacts: [
      {
        name: "Jennifer Rodriguez",
        title: "Portfolio Manager",
        email: "jennifer.rodriguez@university.edu",
        strategies: ["Large Cap Equity", "Venture Capital"],
        isMainContact: true,
      },
      {
        name: "David Park",
        title: "Venture Capital Specialist",
        email: "david.park@university.edu",
        strategies: ["Venture Capital"],
        isMainContact: false,
      },
    ],
  },
  {
    id: "2",
    firmName: "Global Pension Alliance",
    organizationType: "Insurance Company",
    location: "New York, NY",
    contractValue: "$3.2M",
    assetClasses: ["Public Fixed Income", "Private Fixed Income"],
    strategies: ["Investment Grade Corporate Bonds", "Direct Lending"],
    logo: "/abstract-vg.png",
    lastContact: "2024-01-05",
    relationship: "Active Client",
    status: "Active Client",
    description: "Insurance investment professional specializing in fixed income and credit strategies.",
    consultingServices: ["Fixed Income Strategy", "Risk Management", "Regulatory Compliance"],
    projectCount: 4,
    contacts: [
      {
        name: "Lisa Thompson",
        title: "Senior Investment Director",
        email: "lisa.thompson@globalinsurance.com",
        strategies: ["Investment Grade Corporate Bonds", "Direct Lending"],
        isMainContact: true,
      },
      {
        name: "Robert Williams",
        title: "Credit Portfolio Manager",
        email: "robert.williams@globalinsurance.com",
        strategies: ["Direct Lending"],
        isMainContact: false,
      },
    ],
  },
  {
    id: "1",
    firmName: "Sovereign Wealth Fund",
    organizationType: "Sovereign Wealth Fund",
    location: "Singapore",
    contractValue: "$5.0M",
    assetClasses: ["Real Estate", "Private Fixed Income"],
    strategies: ["Real Estate Equity", "Infrastructure Debt"],
    logo: "/abstract-rk.png",
    lastContact: "2024-01-03",
    relationship: "Prospect",
    status: "Prospect",
    description: "Sovereign wealth fund manager focused on infrastructure and real estate investments.",
    consultingServices: ["Infrastructure Strategy", "Direct Investing", "Global Allocation"],
    projectCount: 0,
    contacts: [
      {
        name: "Sarah Chen",
        title: "Chief Investment Officer",
        email: "sarah@swf.gov.sg",
        strategies: ["Real Estate Equity", "Infrastructure Debt"],
        isMainContact: true,
      },
      {
        name: "David Kim",
        title: "Senior Vice President",
        email: "david@swf.gov.sg",
        strategies: ["Real Estate Equity"],
        isMainContact: false,
      },
    ],
  },
  {
    id: "5",
    firmName: "Family Office Partners",
    organizationType: "Family Office",
    location: "San Francisco, CA",
    contractValue: "$800K",
    assetClasses: ["Public Equities", "Private Equity & Other Alternatives"],
    strategies: ["ESG/Sustainable Equity", "Venture Capital"],
    logo: "/sustainability-investing.png",
    lastContact: "2023-12-28",
    relationship: "Past Client",
    status: "Active Client",
    description: "Family office CIO with emphasis on sustainable investing and technology ventures.",
    consultingServices: ["ESG Strategy", "Manager Selection", "Investment Committee Support"],
    projectCount: 1,
    contacts: [
      {
        name: "Maria Garcia",
        title: "Chief Investment Officer",
        email: "maria.garcia@familyoffice.com",
        strategies: ["ESG/Sustainable Equity", "Venture Capital"],
        isMainContact: true,
      },
    ],
  },
  {
    id: "6",
    firmName: "Healthcare Foundation",
    organizationType: "Foundation",
    location: "Chicago, IL",
    contractValue: "$1.2M",
    assetClasses: ["Public Fixed Income", "Public Equities"],
    strategies: ["Core Fixed Income", "Large Cap Equity"],
    logo: "/medical-resonance-image.png",
    lastContact: "2023-12-20",
    relationship: "Past Client",
    status: "Active Client",
    description: "Foundation investment leader focused on healthcare sector and conservative strategies.",
    consultingServices: ["Investment Policy", "Asset Allocation", "Governance"],
    projectCount: 2,
    contacts: [
      {
        name: "Thomas Anderson",
        title: "Investment Committee Chair",
        email: "thomas.anderson@healthcarefoundation.org",
        strategies: ["Core Fixed Income", "Large Cap Equity"],
        isMainContact: true,
      },
      {
        name: "Emily Davis",
        title: "Portfolio Analyst",
        email: "emily.davis@healthcarefoundation.org",
        strategies: ["Core Fixed Income"],
        isMainContact: false,
      },
    ],
  },
]

export default function ConsultantClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("contractValue")
  const [filters, setFilters] = useState({
    assetClasses: [] as string[],
    strategies: [] as string[],
    organizationTypes: [] as string[],
  })
  // Computed filtered clients based on current filters and search
  const filteredClients = mockClientFirms.filter((firm) => {
    const matchesSearch =
      firm.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firm.consultingServices.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      firm.contacts.some(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )

    const matchesAssetClass =
      filters.assetClasses.length === 0 || filters.assetClasses.some((ac) => firm.assetClasses.includes(ac))

    const matchesStrategy =
      filters.strategies.length === 0 || filters.strategies.some((s) => firm.strategies.includes(s))

    const matchesOrgType =
      !filters.organizationTypes ||
      filters.organizationTypes.length === 0 ||
      filters.organizationTypes.includes(firm.organizationType)

    return matchesSearch && matchesAssetClass && matchesStrategy && matchesOrgType
  }).sort((a, b) => {
    // Apply sorting
    if (sortBy === "contractValue") {
      const valueA =
        Number.parseFloat(a.contractValue.replace(/[$MK]/g, "")) * (a.contractValue.includes("M") ? 1000 : 1)
      const valueB =
        Number.parseFloat(b.contractValue.replace(/[$MK]/g, "")) * (b.contractValue.includes("M") ? 1000 : 1)
      return valueB - valueA
    } else if (sortBy === "firmName") {
      return a.firmName.localeCompare(b.firmName)
    } else if (sortBy === "lastContact") {
      return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
    } else if (sortBy === "projectCount") {
      return b.projectCount - a.projectCount
    }
    return 0
  })

  const [selectedFirm, setSelectedFirm] = useState<ClientFirm | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedStrategy, setSelectedStrategy] = useState<string>("")
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [showContactSelector, setShowContactSelector] = useState(false)
  const [selectedAction, setSelectedAction] = useState<"message" | "schedule" | null>(null)

  const router = useRouter()

  const handleViewProfile = (firmId: string) => {
    // Route to the correct client profile page with contact consistency
    const firm = mockClientFirms.find(f => f.id === firmId)
    if (firm) {
      // Pass the firm data to ensure contact consistency
      router.push(`/screens/general/allocator-profile?id=${firmId}&name=${encodeURIComponent(firm.firmName)}&contacts=${encodeURIComponent(JSON.stringify(firm.contacts))}`)
    }
  }

  const getRelevantContact = (firm: ClientFirm, strategy?: string): Contact => {
    if (strategy) {
      const strategyContact = firm.contacts.find((contact) => contact.strategies.includes(strategy))
      if (strategyContact) return strategyContact
    }

    return firm.contacts.find((contact) => contact.isMainContact) || firm.contacts[0]
  }

  const handleSendMessage = (firm: ClientFirm, strategy?: string) => {
    if (firm.contacts.length === 1) {
      // If only one contact, use it directly
      const contact = firm.contacts[0]
      setSelectedFirm(firm)
      setSelectedContact(contact)
      setSelectedStrategy(strategy || "")
      setIsMessageModalOpen(true)
    } else {
      // If multiple contacts, show contact selector
      setSelectedFirm(firm)
      setSelectedStrategy(strategy || "")
      setSelectedAction("message")
      setShowContactSelector(true)
    }
  }

  const handleScheduleMeeting = (firm: ClientFirm, strategy?: string) => {
    if (firm.contacts.length === 1) {
      // If only one contact, use it directly
      const contact = firm.contacts[0]
      setSelectedFirm(firm)
      setSelectedContact(contact)
      setSelectedStrategy(strategy || "")
      setIsMeetingModalOpen(true)
    } else {
      // If multiple contacts, show contact selector
      setSelectedFirm(firm)
      setSelectedStrategy(strategy || "")
      setSelectedAction("schedule")
      setShowContactSelector(true)
    }
  }

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
    setShowContactSelector(false)
    
    if (selectedAction === "message") {
      setIsMessageModalOpen(true)
    } else if (selectedAction === "schedule") {
      setIsMeetingModalOpen(true)
    }
    
    setSelectedAction(null)
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
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active Client":
        return "bg-green-100 text-green-800"
      case "Prospect":
        return "bg-blue-100 text-blue-800"
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
            <p className="text-baseGray mt-1">Manage relationships with your consulting client firms</p>
          </div>
          <ExportButton
            data={filteredClients}
            filename="consulting-client-firms"
            formats={["csv"]}
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
                      placeholder="Search client firms by name, contacts, or consulting services..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <SortDropdown
                      value={sortBy}
                      onChange={handleSortChange}
                      options={[
                        { value: "contractValue", label: "Contract Value" },
                        { value: "projectCount", label: "Most Active Projects" },
                        { value: "firmName", label: "Firm Name A-Z" },
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
              Showing {filteredClients.length} of {mockClientFirms.length} client firms
            </p>
            <div className="flex gap-4 text-sm text-baseGray">
              <span>Active: {filteredClients.filter((c) => c.relationship === "Active Client").length}</span>
              <span>Prospects: {filteredClients.filter((c) => c.relationship === "Prospect").length}</span>
            </div>
          </div>

          {/* Client Firms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClients.map((firm) => (
              <Card key={firm.id} className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Header Section - Firm Focus */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={firm.logo || "/placeholder.svg"} alt={firm.firmName} />
                      <AvatarFallback className="text-lg bg-electric-blue/10 text-electric-blue">
                        {firm.firmName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-lg text-deepBrand mb-1">{firm.firmName}</CardTitle>
                          <p className="text-sm text-baseGray mb-1">{firm.organizationType}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getRelationshipColor(firm.relationship)} variant="secondary">
                            {firm.relationship}
                          </Badge>
                          <Badge className={getStatusColor(firm.status)} variant="outline">
                            {firm.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-baseGray flex-shrink-0" />
                        <span className="text-sm text-baseGray truncate">{firm.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contacts Section - Strategy-based */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-baseGray mb-2">Key Contacts:</div>
                    <div className="space-y-1">
                      {firm.contacts.map((contact, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <User className="h-3 w-3 text-baseGray flex-shrink-0" />
                          <span className="font-medium text-deepBrand">
                            {contact.isMainContact ? "Main Contact: " : ""}
                            {contact.name}
                          </span>
                          <span className="text-baseGray">• {contact.title}</span>
                          {contact.strategies.length > 0 && (
                            <span className="text-baseGray">({contact.strategies.join(", ")})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mb-4 h-10">
                    <p className="text-sm text-baseGray line-clamp-2">{firm.description}</p>
                  </div>

                  {/* Info Grid Section */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4 h-16">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray truncate">{firm.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray">{firm.projectCount} active searches</span>
                    </div>
                  </div>

                  {/* Consulting Services Section */}
                  <div className="mb-4 h-12">
                    <div className="text-xs font-medium text-baseGray mb-1">Consulting Services Provided:</div>
                    <div className="flex flex-wrap gap-1">
                      {firm.consultingServices.map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div className="space-y-2 mb-4 h-16">
                    <div className="flex flex-wrap gap-1 h-6">
                      {firm.assetClasses.map((assetClass) => (
                        <Badge key={assetClass} variant="secondary" className="text-xs h-5">
                          {assetClass}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 h-6">
                      {firm.strategies.map((strategy) => (
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
                        <span>Last Contact: {new Date(firm.lastContact).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          onClick={() => handleViewProfile(firm.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                          onClick={() => handleScheduleMeeting(firm)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs bg-electric-blue hover:bg-electric-blue/90 text-white"
                          onClick={() => handleSendMessage(firm)}
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
                <h3 className="text-lg font-medium text-deepBrand mb-2">No client firms found</h3>
                <p className="text-baseGray">
                  Try adjusting your search terms or filters to find relevant client firms.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {selectedFirm && selectedContact && (
        <>
          <SendMessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipientName={selectedContact.name}
            recipientTitle={selectedContact.title}
            organizationName={selectedFirm.firmName}
          />
          <ScheduleMeetingModal
            isOpen={isMeetingModalOpen}
            onClose={() => setIsMeetingModalOpen(false)}
            recipientName={selectedContact.name}
            recipientEmail={selectedContact.email}
          />
        </>
      )}

      {/* Contact Selector Modal */}
      {selectedFirm && showContactSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Select Contact for {selectedAction === "message" ? "Message" : "Meeting"}
            </h3>
            <div className="space-y-3">
              {selectedFirm.contacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contact.name}</span>
                      {contact.isMainContact && (
                        <Badge variant="secondary" className="text-xs">Primary</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{contact.title}</p>
                    {contact.strategies.length > 0 && (
                      <p className="text-xs text-gray-500">Strategies: {contact.strategies.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowContactSelector(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}
