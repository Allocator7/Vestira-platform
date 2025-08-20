"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Screen } from "@/components/Screen"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ComprehensiveFilters } from "@/components/ComprehensiveFilters"
import { SearchInput } from "@/components/SearchInput"
import { SortDropdown } from "@/components/SortDropdown"
import { ExportButton } from "@/components/ExportButton"
import { MapPin, TrendingUp, Users, MessageCircle, Calendar, Eye, Bookmark, Building2 } from "lucide-react"
import { SendMessageModal } from "@/components/profile-modals/SendMessageModal"
import { ScheduleMeetingModal } from "@/components/profile-modals/ScheduleMeetingModal"

const managers = [
  {
    id: 1,
    firmName: "Rodriguez Capital Partners",
    name: "David Rodriguez",
    shortName: "David Rodriguez",
    type: "Managing Partner",
    aum: "$2.5B",
    description:
      "Experienced investment manager with 18+ years in private equity and growth capital, focusing on technology and healthcare sectors",
    status: "Active Prospect",
    location: "San Francisco, CA",
    founded: "2005",
    experience: "18+ years",
    investmentHorizon: "Long-term",
    initials: "RCP",
    tags: ["Growth Capital", "Technology", "Healthcare"],
    interests: ["Growth Equity", "Technology", "Healthcare", "Private Equity", "Buyouts"],
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Growth Equity", "Buyouts"],
    sectors: ["Technology", "Healthcare"],
    isBookmarked: true,
    contacts: [
      { name: "David Rodriguez", title: "Managing Partner", strategy: "Growth Equity", email: "david@rodriguezcp.com" },
      { name: "Maria Santos", title: "Investment Director", strategy: "Buyouts", email: "maria@rodriguezcp.com" },
    ],
  },
  {
    id: 2,
    firmName: "Sustainable Growth Advisors",
    name: "Sarah Chen",
    shortName: "Sarah Chen",
    type: "Portfolio Manager",
    aum: "$1.2B",
    description: "ESG-focused portfolio manager specializing in sustainable equity strategies and impact investing",
    status: "Research Target",
    location: "New York, NY",
    founded: "2012",
    experience: "12+ years",
    investmentHorizon: "Long-term",
    initials: "SGA",
    tags: ["ESG Focus", "Sustainable", "Impact"],
    interests: ["ESG/Sustainable Equity", "Long/Short Equity", "Impact Investing", "Technology", "Consumer"],
    assetClasses: ["Public Equities"],
    strategies: ["ESG/Sustainable Equity", "Long/Short Equity"],
    sectors: ["Technology", "Consumer"],
    isBookmarked: false,
    contacts: [
      { name: "Sarah Chen", title: "Portfolio Manager", strategy: "ESG/Sustainable Equity", email: "sarah@sga.com" },
      { name: "James Liu", title: "Senior Analyst", strategy: "Long/Short Equity", email: "james@sga.com" },
    ],
  },
  {
    id: 3,
    firmName: "Global Infrastructure Partners",
    name: "Michael Thompson",
    shortName: "Michael Thompson",
    type: "Senior Managing Director",
    aum: "$3.8B",
    description:
      "Infrastructure investment specialist with extensive experience in debt and equity investments across global markets",
    status: "Cold Lead",
    location: "London, UK",
    founded: "2002",
    experience: "22+ years",
    investmentHorizon: "Strategic",
    initials: "GIP",
    tags: ["Infrastructure", "Global", "Debt"],
    interests: ["Infrastructure Debt", "Real Estate Debt", "Infrastructure", "Energy", "Global Markets"],
    assetClasses: ["Private Fixed Income", "Real Estate"],
    strategies: ["Infrastructure Debt", "Real Estate Debt"],
    sectors: ["Infrastructure", "Energy"],
    isBookmarked: true,
    contacts: [
      {
        name: "Michael Thompson",
        title: "Senior Managing Director",
        strategy: "Infrastructure Debt",
        email: "michael@gip.com",
      },
      { name: "Emma Wilson", title: "Director", strategy: "Real Estate Debt", email: "emma@gip.com" },
    ],
  },
  {
    id: 4,
    firmName: "Park Venture Capital",
    name: "Jennifer Park",
    shortName: "Jennifer Park",
    type: "Founding Partner",
    aum: "$800M",
    description: "Early-stage venture capital investor focused on technology startups and emerging growth companies",
    status: "Active Prospect",
    location: "Palo Alto, CA",
    founded: "2009",
    experience: "15+ years",
    investmentHorizon: "Long-term",
    initials: "PVC",
    tags: ["Venture Capital", "Early Stage", "Technology"],
    interests: ["Venture Capital", "Growth Equity", "Technology", "Healthcare", "Startups"],
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Venture Capital", "Growth Equity"],
    sectors: ["Technology", "Healthcare"],
    isBookmarked: false,
    contacts: [
      { name: "Jennifer Park", title: "Founding Partner", strategy: "Venture Capital", email: "jennifer@parkvc.com" },
      { name: "Alex Kim", title: "Principal", strategy: "Growth Equity", email: "alex@parkvc.com" },
    ],
  },
  {
    id: 5,
    firmName: "Williams Credit Management",
    name: "Robert Williams",
    shortName: "Robert Williams",
    type: "Chief Investment Officer",
    aum: "$4.2B",
    description: "Fixed income specialist with deep expertise in credit markets and alternative lending strategies",
    status: "Research Target",
    location: "Chicago, IL",
    founded: "1999",
    experience: "25+ years",
    investmentHorizon: "Medium-term",
    initials: "WCM",
    tags: ["Fixed Income", "Credit", "Lending"],
    interests: [
      "High Yield Bonds",
      "Corporate Private Placements",
      "Direct Lending",
      "Financial Services",
      "Industrial",
    ],
    assetClasses: ["Public Fixed Income", "Private Fixed Income"],
    strategies: ["High Yield Bonds", "Corporate Private Placements", "Direct Lending"],
    sectors: ["Financial Services", "Industrial"],
    isBookmarked: true,
    contacts: [
      {
        name: "Robert Williams",
        title: "Chief Investment Officer",
        strategy: "High Yield Bonds",
        email: "robert@wcm.com",
      },
      {
        name: "Lisa Chen",
        title: "Managing Director",
        strategy: "Corporate Private Placements",
        email: "lisa@wcm.com",
      },
      { name: "David Brown", title: "Senior Vice President", strategy: "Direct Lending", email: "david@wcm.com" },
    ],
  },
  {
    id: 6,
    firmName: "Anderson Real Estate Capital",
    name: "Lisa Anderson",
    shortName: "Lisa Anderson",
    type: "Managing Director",
    aum: "$1.9B",
    description: "Real estate investment professional specializing in commercial properties and mortgage lending",
    status: "Active Prospect",
    location: "Los Angeles, CA",
    founded: "2008",
    experience: "16+ years",
    investmentHorizon: "Long-term",
    initials: "AREC",
    tags: ["Real Estate", "Commercial", "Mortgage"],
    interests: ["Real Estate Equity", "Commercial Mortgage Loans", "Real Estate", "Commercial Properties"],
    assetClasses: ["Real Estate"],
    strategies: ["Real Estate Equity", "Commercial Mortgage Loans"],
    sectors: ["Real Estate"],
    isBookmarked: false,
    contacts: [
      { name: "Lisa Anderson", title: "Managing Director", strategy: "Real Estate Equity", email: "lisa@arec.com" },
      { name: "Tom Rodriguez", title: "Vice President", strategy: "Commercial Mortgage Loans", email: "tom@arec.com" },
    ],
  },
]

export default function AllocatorManagerSearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("aum")
  const [filters, setFilters] = useState({
    assetClasses: [] as string[],
    strategies: [] as string[],
    sectors: [] as string[],
  })
  const [filteredManagers, setFilteredManagers] = useState(managers)

  const [selectedManager, setSelectedManager] = useState<any>(null)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)

  const router = useRouter()

  const handleViewProfile = (manager: any) => {
    router.push(`/screens/general/manager-profile?id=${manager.id}`)
  }

  const handleSendMessage = (manager: any, strategy?: string) => {
    setSelectedManager(manager)
    // Find the most relevant contact based on strategy or use the first contact
    const contact = strategy
      ? manager.contacts.find((c: any) => c.strategy === strategy) || manager.contacts[0]
      : manager.contacts[0]
    setSelectedContact(contact)
    setIsMessageModalOpen(true)
  }

  const handleScheduleMeeting = (manager: any, strategy?: string) => {
    setSelectedManager(manager)
    // Find the most relevant contact based on strategy or use the first contact
    const contact = strategy
      ? manager.contacts.find((c: any) => c.strategy === strategy) || manager.contacts[0]
      : manager.contacts[0]
    setSelectedContact(contact)
    setIsMeetingModalOpen(true)
  }

  const handleFiltersChange = useCallback(
    (newFilters: { assetClasses: string[]; strategies: string[]; sectors?: string[] }) => {
      setFilters({
        assetClasses: newFilters.assetClasses,
        strategies: newFilters.strategies,
        sectors: newFilters.sectors || [],
      })

      const filtered = managers.filter((manager) => {
        const matchesSearch =
          manager.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manager.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manager.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manager.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manager.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesAssetClass =
          newFilters.assetClasses.length === 0 ||
          newFilters.assetClasses.some((ac) => manager.assetClasses.includes(ac))

        const matchesStrategy =
          newFilters.strategies.length === 0 || newFilters.strategies.some((s) => manager.strategies.includes(s))

        const matchesSector =
          !newFilters.sectors ||
          newFilters.sectors.length === 0 ||
          newFilters.sectors.some((s) => manager.sectors.includes(s))

        return matchesSearch && matchesAssetClass && matchesStrategy && matchesSector
      })

      // Apply sorting
      switch (sortBy) {
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
        case "name":
          filtered.sort((a, b) => a.firmName.localeCompare(b.firmName))
          break
        case "name-desc":
          filtered.sort((a, b) => b.firmName.localeCompare(a.firmName))
          break
        case "bookmarked":
          filtered.sort((a, b) => (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0))
          break
        case "bookmarked-desc":
          filtered.sort((a, b) => (a.isBookmarked ? 1 : 0) - (b.isBookmarked ? 1 : 0))
          break
        default:
          filtered.sort((a, b) => a.firmName.localeCompare(b.firmName))
      }

      setFilteredManagers(filtered)
    },
    [searchTerm, sortBy, filters],
  )

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    handleFiltersChange(filters)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    handleFiltersChange(filters)
  }

  const toggleBookmark = (managerId: number) => {
    setFilteredManagers((prev) =>
      prev.map((manager) => (manager.id === managerId ? { ...manager, isBookmarked: !manager.isBookmarked } : manager)),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active Prospect":
        return "bg-green-100 text-green-800"
      case "Research Target":
        return "bg-blue-100 text-blue-800"
      case "Cold Lead":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Screen>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#3B0A45" }}>
            Manager Search
          </h1>
          <p className="mt-2" style={{ color: "#6D6A75" }}>
            Find and evaluate investment managers for your portfolio
          </p>
        </div>

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
                      { value: "aum", label: "Largest AUM" },
                      { value: "aum-desc", label: "Smallest AUM" },
                      { value: "experience", label: "Most Experience" },
                      { value: "experience-desc", label: "Least Experience" },
                      { value: "name", label: "Firm Name A-Z" },
                      { value: "name-desc", label: "Firm Name Z-A" },
                      { value: "bookmarked", label: "Bookmarked First" },
                      { value: "bookmarked-desc", label: "Bookmarked Last" },
                    ]}
                  />
                  <ExportButton
                    data={filteredManagers}
                    filename="manager-search-results"
                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                  />
                </div>
              </div>

              <ComprehensiveFilters onFiltersChange={handleFiltersChange} initialFilters={filters} showSectors={true} />
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredManagers.length} of {managers.length} managers
          </div>
          <div className="flex items-center gap-2 text-sm text-baseGray">
            <Bookmark className="h-4 w-4" />
            <span>{filteredManagers.filter((m) => m.isBookmarked).length} bookmarked</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6">
          {filteredManagers.map((manager) => (
            <Card key={manager.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="font-semibold" style={{ backgroundColor: "#3B0A45", color: "white" }}>
                      {manager.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4" style={{ color: "#3B0A45" }} />
                          <h3 className="text-lg font-semibold" style={{ color: "#3B0A45" }}>
                            {manager.firmName}
                          </h3>
                        </div>
                        <p className="text-sm mb-2" style={{ color: "#6D6A75" }}>
                          {manager.aum} AUM • Founded {manager.founded}
                        </p>
                        <p className="text-sm leading-relaxed max-w-2xl mb-3" style={{ color: "#6D6A75" }}>
                          {manager.description}
                        </p>

                        {/* Contacts by Strategy */}
                        <div className="space-y-1">
                          {manager.contacts.map((contact: any, index: number) => (
                            <div key={index} className="text-sm" style={{ color: "#6D6A75" }}>
                              <span className="font-medium">{contact.strategy} Contact:</span> {contact.name} •{" "}
                              {contact.title}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => toggleBookmark(manager.id)}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${manager.isBookmarked ? "fill-blue-500 text-blue-500" : "text-baseGray"}`}
                          />
                        </Button>
                        <Badge className={getStatusColor(manager.status)}>{manager.status}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Grid Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" style={{ color: "#6D6A75" }} />
                    <span style={{ color: "#6D6A75" }}>{manager.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" style={{ color: "#6D6A75" }} />
                    <span style={{ color: "#6D6A75" }}>Founded {manager.founded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" style={{ color: "#6D6A75" }} />
                    <span style={{ color: "#6D6A75" }}>{manager.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: "#6D6A75" }} />
                    <span style={{ color: "#6D6A75" }}>{manager.investmentHorizon}</span>
                  </div>
                </div>

                {/* Badges Section */}
                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                    {manager.assetClasses.map((assetClass) => (
                      <Badge key={assetClass} variant="secondary" className="text-xs">
                        {assetClass}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                    {manager.strategies.map((strategy) => (
                      <Badge key={strategy} variant="outline" className="text-xs">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                    {manager.sectors.map((sector) => (
                      <Badge key={sector} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-end">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      onClick={() => handleViewProfile(manager)}
                    >
                      <Eye className="h-4 w-4" />
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 h-8 px-3 text-xs border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                      onClick={() => handleScheduleMeeting(manager)}
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Meeting
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-1 h-8 px-3 text-xs bg-electric-blue hover:bg-electric-blue/90 text-white"
                      onClick={() => handleSendMessage(manager)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {selectedManager && selectedContact && (
        <>
          <SendMessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipientName={selectedContact.name}
            recipientTitle={selectedContact.title}
            organizationName={selectedManager.firmName}
          />
          <ScheduleMeetingModal
            isOpen={isMeetingModalOpen}
            onClose={() => setIsMeetingModalOpen(false)}
            recipientName={selectedContact.name}
            recipientEmail={selectedContact.email}
            organizationName={selectedManager.firmName}
          />
        </>
      )}
    </Screen>
  )
}
