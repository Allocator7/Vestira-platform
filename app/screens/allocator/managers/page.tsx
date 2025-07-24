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
  contactPerson: string // Added contact person
  contactTitle: string // Added contact title
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
    avatar: "/placeholder-user.jpg",
    connections: 156,
    lastActive: "2024-01-15",
    trackRecord: {
      irr: "22.5%",
      multiple: "2.8x",
    },
    description:
      "Experienced investment manager with 18+ years in private equity and growth capital, focusing on technology and healthcare sectors.",
    contactPerson: "David Rodriguez", // Added contact person
    contactTitle: "Managing Partner", // Added contact title
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
    avatar: "/placeholder-user.jpg",
    connections: 203,
    lastActive: "2024-01-14",
    trackRecord: {
      irr: "15.3%",
      multiple: "1.9x",
    },
    description: "ESG-focused portfolio manager specializing in sustainable equity strategies and impact investing.",
    contactPerson: "Sarah Chen", // Added contact person
    contactTitle: "Portfolio Manager", // Added contact title
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
    avatar: "/placeholder-user.jpg",
    connections: 287,
    lastActive: "2024-01-13",
    trackRecord: {
      irr: "12.8%",
      multiple: "1.7x",
    },
    description:
      "Infrastructure investment specialist with extensive experience in debt and equity investments across global markets.",
    contactPerson: "Michael Thompson", // Added contact person
    contactTitle: "Senior Managing Director", // Added contact title
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
    avatar: "/placeholder-user.jpg",
    connections: 342,
    lastActive: "2024-01-12",
    trackRecord: {
      irr: "28.4%",
      multiple: "3.2x",
    },
    description: "Early-stage venture capital investor focused on technology startups and emerging growth companies.",
    contactPerson: "Jennifer Park", // Added contact person
    contactTitle: "Founding Partner", // Added contact title
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
    avatar: "/placeholder-user.jpg",
    connections: 198,
    lastActive: "2024-01-11",
    trackRecord: {
      irr: "9.8%",
      multiple: "1.4x",
    },
    description: "Fixed income specialist with deep expertise in credit markets and alternative lending strategies.",
    contactPerson: "Robert Williams", // Added contact person
    contactTitle: "Chief Investment Officer", // Added contact title
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
    avatar: "/placeholder-user.jpg",
    connections: 167,
    lastActive: "2024-01-10",
    trackRecord: {
      irr: "14.2%",
      multiple: "2.1x",
    },
    description: "Real estate investment professional specializing in commercial properties and mortgage lending.",
    contactPerson: "Lisa Anderson", // Added contact person
    contactTitle: "Managing Director", // Added contact title
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

  const handleFiltersChange = (newFilters: {
    assetClasses: string[]
    strategies: string[]
    organizationTypes?: string[]
    experience?: string[]
  }) => {
    setFilters({
      assetClasses: newFilters.assetClasses,
      strategies: newFilters.strategies,
      organizationTypes: newFilters.organizationTypes || [],
      experience: newFilters.experience || [],
    })

    const filtered = mockManagers.filter((manager) => {
      const matchesSearch =
        manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAssetClass =
        newFilters.assetClasses.length === 0 || newFilters.assetClasses.some((ac) => manager.assetClasses.includes(ac))

      const matchesStrategy =
        newFilters.strategies.length === 0 || newFilters.strategies.some((s) => manager.strategies.includes(s))

      const matchesOrgType =
        !newFilters.organizationTypes ||
        newFilters.organizationTypes.length === 0 ||
        newFilters.organizationTypes.includes(manager.firmType)

      const matchesExperience =
        !newFilters.experience ||
        newFilters.experience.length === 0 ||
        newFilters.experience.some((exp) => {
          const years = Number.parseInt(manager.experience)
          switch (exp) {
            case "0-5 years":
              return years <= 5
            case "5-10 years":
              return years > 5 && years <= 10
            case "10-15 years":
              return years > 10 && years <= 15
            case "15-20 years":
              return years > 15 && years <= 20
            case "20+ years":
              return years > 20
            default:
              return false
          }
        })

      return matchesSearch && matchesAssetClass && matchesStrategy && matchesOrgType && matchesExperience
    })

    // Apply sorting
    if (sortBy === "aum") {
      filtered.sort((a, b) => {
        const aumA = Number.parseFloat(a.aum.replace(/[$B]/g, ""))
        const aumB = Number.parseFloat(b.aum.replace(/[$B]/g, ""))
        return aumB - aumA
      })
    } else if (sortBy === "experience") {
      filtered.sort((a, b) => Number.parseInt(b.experience) - Number.parseInt(a.experience))
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "connections") {
      filtered.sort((a, b) => b.connections - a.connections)
    }

    setFilteredManagers(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    handleFiltersChange(filters)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    handleFiltersChange(filters)
  }

  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-deepBrand">Investment Managers</h1>
            <p className="text-baseGray mt-1">Discover and connect with investment managers</p>
          </div>
          <ExportButton
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
                        { value: "aum", label: "Largest AUM" },
                        { value: "experience", label: "Most Experience" },
                        { value: "connections", label: "Most Connections" },
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
                        <p className="text-sm font-medium text-gray-900">{manager.contactPerson}</p>
                        <p className="text-xs text-baseGray">{manager.contactTitle}</p>
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
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-xs text-baseGray">
                        <span>IRR: {manager.trackRecord.irr}</span>
                        <span>Multiple: {manager.trackRecord.multiple}</span>
                      </div>
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
                          Schedule
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
            recipientName={selectedManager.contactPerson}
            recipientTitle={selectedManager.contactTitle}
            organizationName={selectedManager.firm}
          />
          <ScheduleMeetingModal
            isOpen={isMeetingModalOpen}
            onClose={() => setIsMeetingModalOpen(false)}
            recipientName={selectedManager.contactPerson}
            recipientEmail={`${selectedManager.contactPerson
              .toLowerCase()
              .replace(/\s+/g, ".")}@${selectedManager.firm.toLowerCase().replace(/\s+/g, "")}.com`}
            organizationName={selectedManager.firm}
          />
        </>
      )}
    </Screen>
  )
}
