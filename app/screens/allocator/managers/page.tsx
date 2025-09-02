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
import { MapPin, Building2, TrendingUp, Users, MessageCircle, Calendar, Eye } from "lucide-react"
import { SendMessageModal } from "@/components/profile-modals/SendMessageModal"
import { ScheduleMeetingModal } from "@/components/profile-modals/ScheduleMeetingModal"
import { useRouter } from "next/navigation"

interface Contact {
  name: string
  title: string
  role: string
  email: string
}

interface Manager {
  id: string
  name: string
  title: string
  firm: string
  firmType: string
  location: string
  aum: string
  experience: string
  assetClasses: string[]
  strategies: string[]
  avatar: string
  connections: number
  lastActive: string
  trackRecord: {
    irr: string
    multiple: string
  }
  description: string
  contactPerson: string
  contactTitle: string
  contacts: Contact[]
}

const mockManagers: Manager[] = [
  {
    id: "1",
    name: "Growth Capital Partners",
    title: "Managing Partner",
    firm: "Growth Capital Partners",
    firmType: "Private Equity",
    location: "San Francisco, CA",
    aum: "$2.5B",
    experience: "18 years",
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Growth Equity", "Buyouts"],
    avatar: "/managers/david-rodriguez.jpg",
    connections: 156,
    lastActive: "2024-01-15",
    trackRecord: {
      irr: "22.5%",
      multiple: "2.8x",
    },
    description:
      "Experienced investment manager with 18+ years in private equity and growth capital, focusing on technology and healthcare sectors.",
    contactPerson: "David Rodriguez",
    contactTitle: "Managing Partner",
    contacts: [
      {
        name: "David Rodriguez",
        title: "Managing Partner",
        role: "Primary Contact",
        email: "david.rodriguez@growthcapital.com",
      },
      {
        name: "Sarah Johnson",
        title: "Senior Vice President",
        role: "Investment Contact",
        email: "sarah.johnson@growthcapital.com",
      },
      {
        name: "Michael Chen",
        title: "Director of Investor Relations",
        role: "IR Contact",
        email: "michael.chen@growthcapital.com",
      },
    ],
  },
  {
    id: "2",
    name: "Sustainable Equity Fund",
    title: "Portfolio Manager",
    firm: "Sustainable Equity Fund",
    firmType: "Hedge Fund",
    location: "New York, NY",
    aum: "$1.2B",
    experience: "12 years",
    assetClasses: ["Public Equities"],
    strategies: ["ESG/Sustainable Equity", "Long/Short Equity"],
    avatar: "/managers/sarah-chen.jpg",
    connections: 203,
    lastActive: "2024-01-14",
    trackRecord: {
      irr: "15.3%",
      multiple: "1.9x",
    },
    description: "ESG-focused portfolio manager specializing in sustainable equity strategies and impact investing.",
    contactPerson: "Sarah Chen",
    contactTitle: "Portfolio Manager",
    contacts: [
      {
        name: "Sarah Chen",
        title: "Portfolio Manager",
        role: "Primary Contact",
        email: "sarah.chen@sustainableequity.com",
      },
      {
        name: "Lisa Thompson",
        title: "ESG Director",
        role: "ESG Contact",
        email: "lisa.thompson@sustainableequity.com",
      },
    ],
  },
  {
    id: "3",
    name: "Infrastructure Capital",
    title: "Senior Managing Director",
    firm: "Infrastructure Capital",
    firmType: "Infrastructure",
    location: "London, UK",
    aum: "$3.8B",
    experience: "22 years",
    assetClasses: ["Private Fixed Income", "Real Estate"],
    strategies: ["Infrastructure Debt", "Real Estate Debt"],
    avatar: "/managers/michael-thompson.jpg",
    connections: 287,
    lastActive: "2024-01-13",
    trackRecord: {
      irr: "12.8%",
      multiple: "1.7x",
    },
    description:
      "Infrastructure investment specialist with extensive experience in debt and equity investments across global markets.",
    contactPerson: "Michael Thompson",
    contactTitle: "Senior Managing Director",
    contacts: [
      {
        name: "Michael Thompson",
        title: "Senior Managing Director",
        role: "Primary Contact",
        email: "michael.thompson@infrastructurecapital.com",
      },
      {
        name: "Emma Wilson",
        title: "Head of Infrastructure",
        role: "Infrastructure Contact",
        email: "emma.wilson@infrastructurecapital.com",
      },
      {
        name: "James Anderson",
        title: "Director of Real Estate",
        role: "Real Estate Contact",
        email: "james.anderson@infrastructurecapital.com",
      },
      {
        name: "Rachel Green",
        title: "Investor Relations Manager",
        role: "IR Contact",
        email: "rachel.green@infrastructurecapital.com",
      },
    ],
  },
  {
    id: "4",
    name: "Venture Dynamics",
    title: "Founding Partner",
    firm: "Venture Dynamics",
    firmType: "Venture Capital",
    location: "Palo Alto, CA",
    aum: "$800M",
    experience: "15 years",
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Venture Capital", "Growth Equity"],
    avatar: "/managers/jennifer-park.jpg",
    connections: 342,
    lastActive: "2024-01-12",
    trackRecord: {
      irr: "28.4%",
      multiple: "3.2x",
    },
    description: "Early-stage venture capital investor focused on technology startups and emerging growth companies.",
    contactPerson: "Jennifer Park",
    contactTitle: "Founding Partner",
    contacts: [
      {
        name: "Jennifer Park",
        title: "Founding Partner",
        role: "Primary Contact",
        email: "jennifer.park@venturedynamics.com",
      },
      {
        name: "Alex Rodriguez",
        title: "Partner",
        role: "Investment Contact",
        email: "alex.rodriguez@venturedynamics.com",
      },
    ],
  },
  {
    id: "5",
    name: "Fixed Income Strategies",
    title: "Chief Investment Officer",
    firm: "Fixed Income Strategies",
    firmType: "Credit",
    location: "Chicago, IL",
    aum: "$4.2B",
    experience: "25 years",
    assetClasses: ["Public Fixed Income", "Private Fixed Income"],
    strategies: ["High Yield Bonds", "Corporate Private Placements", "Direct Lending"],
    avatar: "/managers/robert-williams.jpg",
    connections: 198,
    lastActive: "2024-01-11",
    trackRecord: {
      irr: "9.8%",
      multiple: "1.4x",
    },
    description: "Fixed income specialist with deep expertise in credit markets and alternative lending strategies.",
    contactPerson: "Robert Williams",
    contactTitle: "Chief Investment Officer",
    contacts: [
      {
        name: "Robert Williams",
        title: "Chief Investment Officer",
        role: "Primary Contact",
        email: "robert.williams@fixedincomestrategies.com",
      },
      {
        name: "Maria Garcia",
        title: "Head of Credit",
        role: "Credit Contact",
        email: "maria.garcia@fixedincomestrategies.com",
      },
      {
        name: "David Lee",
        title: "Director of Private Placements",
        role: "Private Placements Contact",
        email: "david.lee@fixedincomestrategies.com",
      },
    ],
  },
  {
    id: "6",
    name: "Real Estate Ventures",
    title: "Managing Director",
    firm: "Real Estate Ventures",
    firmType: "Real Estate",
    location: "Los Angeles, CA",
    aum: "$1.9B",
    experience: "16 years",
    assetClasses: ["Real Estate"],
    strategies: ["Real Estate Equity", "Commercial Mortgage Loans"],
    avatar: "/managers/lisa-anderson.jpg",
    connections: 167,
    lastActive: "2024-01-10",
    trackRecord: {
      irr: "14.2%",
      multiple: "2.1x",
    },
    description: "Real estate investment professional specializing in commercial properties and mortgage lending.",
    contactPerson: "Lisa Anderson",
    contactTitle: "Managing Director",
    contacts: [
      {
        name: "Lisa Anderson",
        title: "Managing Director",
        role: "Primary Contact",
        email: "lisa.anderson@realestateventures.com",
      },
      {
        name: "Tom Martinez",
        title: "Head of Acquisitions",
        role: "Acquisitions Contact",
        email: "tom.martinez@realestateventures.com",
      },
    ],
  },
]

export default function AllocatorManagersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filters, setFilters] = useState({
    assetClasses: [] as string[],
    strategies: [] as string[],
    organizationTypes: [] as string[],
    experience: [] as string[],
  })
  const [filteredManagers, setFilteredManagers] = useState(mockManagers)

  const [selectedManager, setSelectedManager] = useState<Manager | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)

  const router = useRouter()

  const handleViewProfile = (managerId: string) => {
    // Use Next.js router for faster navigation
    router.push(`/screens/general/manager-profile?id=${managerId}`)
  }

  const handleSendMessage = (manager: Manager) => {
    setSelectedManager(manager)
    setIsMessageModalOpen(true)
  }

  const handleScheduleMeeting = (manager: Manager) => {
    setSelectedManager(manager)
    setIsMeetingModalOpen(true)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    filterManagers(value, sortBy, filters)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    filterManagers(searchTerm, value, filters)
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    filterManagers(searchTerm, sortBy, newFilters)
  }

  const filterManagers = (search: string, sort: string, filterOptions: any) => {
    let filtered = [...mockManagers]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (manager) =>
          manager.firm.toLowerCase().includes(searchLower) ||
          manager.contactPerson.toLowerCase().includes(searchLower) ||
          manager.description.toLowerCase().includes(searchLower) ||
          manager.assetClasses.some((ac) => ac.toLowerCase().includes(searchLower)) ||
          manager.strategies.some((s) => s.toLowerCase().includes(searchLower))
      )
    }

    // Asset class filter
    if (filterOptions.assetClasses.length > 0) {
      filtered = filtered.filter((manager) =>
        filterOptions.assetClasses.some((ac: string) => manager.assetClasses.includes(ac))
      )
    }

    // Strategy filter
    if (filterOptions.strategies.length > 0) {
      filtered = filtered.filter((manager) =>
        filterOptions.strategies.some((s: string) => manager.strategies.includes(s))
      )
    }

    // Organization type filter
    if (filterOptions.organizationTypes.length > 0) {
      filtered = filtered.filter((manager) => filterOptions.organizationTypes.includes(manager.firmType))
    }

    // Experience filter
    if (filterOptions.experience.length > 0) {
      filtered = filtered.filter((manager) => filterOptions.experience.includes(manager.experience))
    }

    // Sort
    switch (sort) {
      case "name":
        filtered.sort((a, b) => a.firm.localeCompare(b.firm))
        break
      case "name-desc":
        filtered.sort((a, b) => b.firm.localeCompare(a.firm))
        break
      case "aum":
        filtered.sort((a, b) => {
          const aumA = parseFloat(a.aum.replace(/[^0-9.]/g, ""))
          const aumB = parseFloat(b.aum.replace(/[^0-9.]/g, ""))
          return aumB - aumA
        })
        break
      case "aum-desc":
        filtered.sort((a, b) => {
          const aumA = parseFloat(a.aum.replace(/[^0-9.]/g, ""))
          const aumB = parseFloat(b.aum.replace(/[^0-9.]/g, ""))
          return aumA - aumB
        })
        break
      case "experience":
        filtered.sort((a, b) => {
          const expA = parseInt(a.experience.replace(/[^0-9]/g, ""))
          const expB = parseInt(b.experience.replace(/[^0-9]/g, ""))
          return expB - expA
        })
        break
      case "experience-desc":
        filtered.sort((a, b) => {
          const expA = parseInt(a.experience.replace(/[^0-9]/g, ""))
          const expB = parseInt(b.experience.replace(/[^0-9]/g, ""))
          return expA - expB
        })
        break
      case "connections":
        filtered.sort((a, b) => b.connections - a.connections)
        break
      case "connections-desc":
        filtered.sort((a, b) => a.connections - b.connections)
        break
      default:
        filtered.sort((a, b) => a.firm.localeCompare(b.firm))
    }

    setFilteredManagers(filtered)
  }

  return (
    <Screen>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-deepBrand">My Managers</h1>
            <p className="text-baseGray">Manage your investment manager relationships</p>
          </div>
          <ExportButton
            formats={["csv", "xlsx"]}
            data={filteredManagers}
            filename="investment-managers"
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
                      placeholder="Search managers by name, firm, or expertise..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <SortDropdown
                      value={sortBy}
                      onChange={handleSortChange}
                      options={[
                        { value: "name", label: "Name A-Z" },
                        { value: "name-desc", label: "Name Z-A" },
                        { value: "aum", label: "Largest AUM" },
                        { value: "aum-desc", label: "Smallest AUM" },
                        { value: "experience", label: "Most Experience" },
                        { value: "experience-desc", label: "Least Experience" },
                        { value: "connections", label: "Most Connections" },
                        { value: "connections-desc", label: "Least Connections" },
                      ]}
                    />
                  </div>
                </div>

                <ComprehensiveFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters}
                  showOrganizationTypes={true}
                  showExperience={true}
                  userType="manager"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-baseGray">
              Showing {filteredManagers.length} of {mockManagers.length} managers
            </p>
          </div>

          {/* Managers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredManagers.map((manager) => (
              <Card key={manager.id} className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Header Section - Fixed Height */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={manager.avatar || "/placeholder.svg"} alt={manager.name} />
                      <AvatarFallback className="text-lg bg-electric-blue/10 text-electric-blue">
                        {manager.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl text-deepBrand mb-2 font-semibold">{manager.firm}</CardTitle>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{manager.contacts[0].name}</p>
                        <p className="text-xs text-baseGray">{manager.contacts[0].title}</p>
                        {manager.contacts.length > 1 && (
                          <p className="text-xs text-electric-blue font-medium">
                            + {manager.contacts.length - 1} other contact{manager.contacts.length > 2 ? 's' : ''} at this firm
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3 text-baseGray flex-shrink-0" />
                        <span className="text-sm text-baseGray truncate">{manager.firmType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Section - Fixed Height */}
                  <div className="mb-4 h-10">
                    <p className="text-sm text-baseGray line-clamp-2">{manager.description}</p>
                  </div>

                  {/* Info Grid Section - Fixed Height */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4 h-12">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray truncate">{manager.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray">AUM: {manager.aum}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray">{manager.connections} connections</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-baseGray flex-shrink-0" />
                      <span className="text-baseGray">{manager.experience} exp.</span>
                    </div>
                  </div>

                  {/* Badges Section - Fixed Height */}
                  <div className="space-y-2 mb-4 h-16">
                    <div className="flex flex-wrap gap-1 h-6">
                      {manager.assetClasses.map((assetClass) => (
                        <Badge key={assetClass} variant="secondary" className="text-xs h-5">
                          {assetClass}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 h-6">
                      {manager.strategies.map((strategy) => (
                        <Badge key={strategy} variant="outline" className="text-xs h-5">
                          {strategy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section - Fixed Position */}
                  <div className="mt-auto pt-4 border-t">
                    <div className="flex items-center justify-end">
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          onClick={() => handleViewProfile(manager.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                          onClick={() => handleScheduleMeeting(manager)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule Meeting
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs bg-electric-blue hover:bg-electric-blue/90 text-white"
                          onClick={() => handleSendMessage(manager)}
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

          {filteredManagers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-baseGray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-deepBrand mb-2">No managers found</h3>
                <p className="text-baseGray">
                  Try adjusting your search terms or filters to find relevant investment managers.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {selectedManager && (
        <>
          <SendMessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipientName={selectedManager.contacts[0].name}
            recipientTitle={selectedManager.contacts[0].title}
            organizationName={selectedManager.firm}
          />
          <ScheduleMeetingModal
            isOpen={isMeetingModalOpen}
            onClose={() => setIsMeetingModalOpen(false)}
            recipientName={selectedManager.contacts[0].name}
            recipientEmail={selectedManager.contacts[0].email}
            organizationName={selectedManager.firm}
          />
        </>
      )}
    </Screen>
  )
}
