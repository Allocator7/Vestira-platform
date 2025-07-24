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

const allocators = [
  {
    id: 1,
    firmName: "Sovereign Wealth Fund",
    name: "Sovereign Wealth Fund",
    shortName: "Sovereign Wealth Fund",
    type: "Sovereign Wealth Fund",
    aum: "$320B",
    description:
      "Leading sovereign wealth fund focused on long-term value creation and sustainable investment strategies across global markets",
    status: "Active Prospect",
    location: "Singapore",
    founded: "1974",
    experience: "50+ years",
    investmentHorizon: "Long-term",
    initials: "SWF",
    tags: ["Alternative Assets", "Global Markets", "Long-term"],
    interests: ["Private Equity", "Real Estate", "Infrastructure", "Hedge Funds", "Technology"],
    assetClasses: ["Alternative Assets & Public Markets"],
    strategies: ["Private Equity", "Real Estate", "Infrastructure", "Hedge Funds"],
    sectors: ["Technology", "Healthcare", "Energy", "Financial Services"],
    isBookmarked: true,
    contacts: [
      {
        name: "Sarah Chen",
        title: "Chief Investment Officer",
        strategy: "Investment Contact",
        email: "sarah@swf.gov.sg",
      },
      {
        name: "Michael Torres",
        title: "Managing Director",
        strategy: "Alternative Assets Contact",
        email: "michael@swf.gov.sg",
      },
      {
        name: "David Kim",
        title: "Senior Vice President",
        strategy: "Private Markets Contact",
        email: "david@swf.gov.sg",
      },
    ],
  },
  {
    id: 2,
    firmName: "Global Pension Alliance",
    name: "Global Pension Alliance",
    shortName: "Global Pension Alliance",
    type: "Pension Fund",
    aum: "$180B",
    description:
      "Multi-employer pension plan serving public sector employees with focus on liability-driven investment and risk management",
    status: "Research Target",
    location: "Toronto, CA",
    founded: "1965",
    experience: "58+ years",
    investmentHorizon: "Long-term",
    initials: "GPA",
    tags: ["Pension Fund", "Public Sector", "Risk Management"],
    interests: ["Private Equity", "Infrastructure", "Real Estate", "Utilities", "Transportation"],
    assetClasses: ["Private Markets & Real Assets"],
    strategies: ["Private Equity", "Infrastructure", "Real Estate"],
    sectors: ["Infrastructure", "Real Estate", "Utilities"],
    isBookmarked: false,
    contacts: [
      { name: "Jennifer Park", title: "Head of Alternatives", strategy: "Pension Contact", email: "jennifer@gpa.ca" },
      { name: "Lisa Wang", title: "Portfolio Manager", strategy: "Real Assets Contact", email: "lisa@gpa.ca" },
      { name: "Robert Chen", title: "Investment Director", strategy: "Infrastructure Contact", email: "robert@gpa.ca" },
    ],
  },
  {
    id: 3,
    firmName: "University Endowment Foundation",
    name: "University Endowment Foundation",
    shortName: "University Endowment Foundation",
    type: "Endowment",
    aum: "$45B",
    description:
      "Prestigious university endowment with innovative investment approach and strong focus on venture capital and emerging managers",
    status: "Active Prospect",
    location: "Boston, MA",
    founded: "1636",
    experience: "387+ years",
    investmentHorizon: "Long-term",
    initials: "UEF",
    tags: ["Endowment", "Innovation", "Emerging Managers"],
    interests: ["Venture Capital", "Private Equity", "Hedge Funds", "Technology", "Healthcare"],
    assetClasses: ["Alternative Investments"],
    strategies: ["Venture Capital", "Private Equity", "Hedge Funds"],
    sectors: ["Technology", "Healthcare", "Education"],
    isBookmarked: true,
    contacts: [
      { name: "Alex Kim", title: "Chief Investment Officer", strategy: "Endowment Contact", email: "alex@uef.edu" },
      { name: "Maria Rodriguez", title: "Principal", strategy: "Venture Contact", email: "maria@uef.edu" },
      {
        name: "Thomas Mueller",
        title: "Managing Director",
        strategy: "Growth Equity Contact",
        email: "thomas@uef.edu",
      },
    ],
  },
  {
    id: 4,
    firmName: "Insurance Capital Partners",
    name: "Insurance Capital Partners",
    shortName: "Insurance Capital Partners",
    type: "Insurance Company",
    aum: "$95B",
    description:
      "Global insurance company with diversified investment portfolio focused on matching assets to long-term liabilities",
    status: "Research Target",
    location: "London, UK",
    founded: "1889",
    experience: "134+ years",
    investmentHorizon: "Long-term",
    initials: "ICP",
    tags: ["Insurance", "Liability Matching", "Global"],
    interests: ["Private Credit", "Real Estate", "Infrastructure", "Financial Services"],
    assetClasses: ["Fixed Income & Alternatives"],
    strategies: ["Private Credit", "Real Estate", "Infrastructure"],
    sectors: ["Financial Services", "Real Estate", "Infrastructure"],
    isBookmarked: false,
    contacts: [
      {
        name: "Sophie Laurent",
        title: "Head of Investments",
        strategy: "Insurance Contact",
        email: "sophie@icp.co.uk",
      },
      { name: "Amanda Foster", title: "Senior Director", strategy: "Credit Contact", email: "amanda@icp.co.uk" },
      { name: "James Wilson", title: "Investment Manager", strategy: "Real Estate Contact", email: "james@icp.co.uk" },
    ],
  },
  {
    id: 5,
    firmName: "Family Office Consortium",
    name: "Family Office Consortium",
    shortName: "Family Office Consortium",
    type: "Family Office",
    aum: "$12B",
    description:
      "Multi-family office serving ultra-high-net-worth families with focus on wealth preservation and alternative investments",
    status: "Active Prospect",
    location: "Zurich, CH",
    founded: "1995",
    experience: "28+ years",
    investmentHorizon: "Long-term",
    initials: "FOC",
    tags: ["Family Office", "Wealth Preservation", "UHNW"],
    interests: ["Private Equity", "Hedge Funds", "Real Estate", "Technology", "Healthcare"],
    assetClasses: ["Private Markets & Alternatives"],
    strategies: ["Private Equity", "Hedge Funds", "Real Estate"],
    sectors: ["Technology", "Healthcare", "Consumer"],
    isBookmarked: true,
    contacts: [
      { name: "David Brown", title: "Managing Partner", strategy: "Family Office Contact", email: "david@foc.ch" },
      { name: "Lisa Chen", title: "Investment Director", strategy: "Private Markets Contact", email: "lisa@foc.ch" },
      { name: "Michael Park", title: "Senior Analyst", strategy: "Hedge Fund Contact", email: "michael@foc.ch" },
    ],
  },
  {
    id: 6,
    firmName: "Corporate Treasury Solutions",
    name: "Corporate Treasury Solutions",
    shortName: "Corporate Treasury Solutions",
    type: "Corporate",
    aum: "$28B",
    description:
      "Fortune 500 corporate treasury managing excess cash with focus on capital preservation and liquidity management",
    status: "Research Target",
    location: "New York, NY",
    founded: "1952",
    experience: "71+ years",
    investmentHorizon: "Medium-term",
    initials: "CTS",
    tags: ["Corporate Treasury", "Cash Management", "Fortune 500"],
    interests: ["Money Market", "Fixed Income", "Private Credit", "Financial Services", "Technology"],
    assetClasses: ["Fixed Income & Cash Management"],
    strategies: ["Money Market", "Fixed Income", "Private Credit"],
    sectors: ["Financial Services", "Technology"],
    isBookmarked: false,
    contacts: [
      { name: "Robert Kim", title: "Treasurer", strategy: "Treasury Contact", email: "robert@cts.com" },
      { name: "Sarah Wilson", title: "Investment Manager", strategy: "Investment Contact", email: "sarah@cts.com" },
      { name: "Jennifer Torres", title: "Senior Analyst", strategy: "Fixed Income Contact", email: "jennifer@cts.com" },
    ],
  },
]

export default function ManagerAllocatorSearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("aum")
  const [filters, setFilters] = useState({
    assetClasses: [] as string[],
    strategies: [] as string[],
    sectors: [] as string[],
  })
  const [filteredAllocators, setFilteredAllocators] = useState(allocators)

  const [selectedAllocator, setSelectedAllocator] = useState<any>(null)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)

  const router = useRouter()

  const handleViewProfile = (allocator: any) => {
    router.push(`/screens/general/allocator-profile?id=${allocator.id}`)
  }

  const handleSendMessage = (allocator: any, strategy?: string) => {
    setSelectedAllocator(allocator)
    // Find the most relevant contact based on strategy or use the first contact
    const contact = strategy
      ? allocator.contacts.find((c: any) => c.strategy === strategy) || allocator.contacts[0]
      : allocator.contacts[0]
    setSelectedContact(contact)
    setIsMessageModalOpen(true)
  }

  const handleScheduleMeeting = (allocator: any, strategy?: string) => {
    setSelectedAllocator(allocator)
    // Find the most relevant contact based on strategy or use the first contact
    const contact = strategy
      ? allocator.contacts.find((c: any) => c.strategy === strategy) || allocator.contacts[0]
      : allocator.contacts[0]
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

      const filtered = allocators.filter((allocator) => {
        const matchesSearch =
          allocator.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          allocator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          allocator.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          allocator.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          allocator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          allocator.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesAssetClass =
          newFilters.assetClasses.length === 0 ||
          newFilters.assetClasses.some((ac) => allocator.assetClasses.includes(ac))

        const matchesStrategy =
          newFilters.strategies.length === 0 || newFilters.strategies.some((s) => allocator.strategies.includes(s))

        const matchesSector =
          !newFilters.sectors ||
          newFilters.sectors.length === 0 ||
          newFilters.sectors.some((s) => allocator.sectors.includes(s))

        return matchesSearch && matchesAssetClass && matchesStrategy && matchesSector
      })

      // Apply sorting
      if (sortBy === "aum") {
        filtered.sort((a, b) => {
          const aumA = Number.parseInt(a.aum.replace(/[^0-9]/g, ""))
          const aumB = Number.parseInt(b.aum.replace(/[^0-9]/g, ""))
          return aumB - aumA
        })
      } else if (sortBy === "experience") {
        filtered.sort((a, b) => Number.parseInt(b.experience) - Number.parseInt(a.experience))
      } else if (sortBy === "name") {
        filtered.sort((a, b) => a.firmName.localeCompare(b.firmName))
      } else if (sortBy === "bookmarked") {
        filtered.sort((a, b) => (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0))
      }

      setFilteredAllocators(filtered)
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

  const toggleBookmark = (allocatorId: number) => {
    setFilteredAllocators((prev) =>
      prev.map((allocator) =>
        allocator.id === allocatorId ? { ...allocator, isBookmarked: !allocator.isBookmarked } : allocator,
      ),
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
            Allocator Search
          </h1>
          <p className="mt-2" style={{ color: "#6D6A75" }}>
            Find and evaluate institutional allocators for your strategies
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search allocators by name, firm, or expertise..."
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
                      { value: "experience", label: "Most Experience" },
                      { value: "name", label: "Firm Name A-Z" },
                      { value: "bookmarked", label: "Bookmarked First" },
                    ]}
                  />
                  <ExportButton
                    data={filteredAllocators}
                    filename="allocator-search-results"
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
            Showing {filteredAllocators.length} of {allocators.length} allocators
          </div>
          <div className="flex items-center gap-2 text-sm text-baseGray">
            <Bookmark className="h-4 w-4" />
            <span>{filteredAllocators.filter((a) => a.isBookmarked).length} bookmarked</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6">
          {filteredAllocators.map((allocator) => (
            <Card key={allocator.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="font-semibold" style={{ backgroundColor: "#3B0A45", color: "white" }}>
                      {allocator.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4" style={{ color: "#3B0A45" }} />
                          <h3 className="text-lg font-semibold" style={{ color: "#3B0A45" }}>
                            {allocator.firmName}
                          </h3>
                        </div>
                        <p className="text-sm mb-2" style={{ color: "#6D6A75" }}>
                          {allocator.aum} AUM • Founded {allocator.founded}
                        </p>
                        <p className="text-sm leading-relaxed max-w-2xl mb-3" style={{ color: "#6D6A75" }}>
                          {allocator.description}
                        </p>

                        {/* Contacts by Strategy */}
                        <div className="space-y-1">
                          {allocator.contacts.map((contact: any, index: number) => (
                            <div key={index} className="text-sm" style={{ color: "#6D6A75" }}>
                              <span className="font-medium">{contact.strategy}:</span> {contact.name} • {contact.title}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => toggleBookmark(allocator.id)}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${allocator.isBookmarked ? "fill-blue-500 text-blue-500" : "text-baseGray"}`}
                          />
                        </Button>
                        <Badge className={getStatusColor(allocator.status)}>{allocator.status}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Grid Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" style={{ color: "#6D6A75" }} />
                    <span style={{ color: "#6D6A75" }}>{allocator.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" style={{ color: "#6D6A75" }} />
                    <span style={{ color: "#6D6A75" }}>Founded {allocator.founded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" style={{ color: "#6D6A75" }} />
                    <span style={{ color: "#6D6A75" }}>{allocator.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: "#6D6A75" }} />
                    <span style={{ color: "#6D6A75" }}>{allocator.investmentHorizon}</span>
                  </div>
                </div>

                {/* Badges Section */}
                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                    {allocator.assetClasses.map((assetClass) => (
                      <Badge key={assetClass} variant="secondary" className="text-xs">
                        {assetClass}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                    {allocator.strategies.map((strategy) => (
                      <Badge key={strategy} variant="outline" className="text-xs">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                    {allocator.sectors.map((sector) => (
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
                      onClick={() => handleViewProfile(allocator)}
                    >
                      <Eye className="h-4 w-4" />
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 h-8 px-3 text-xs border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                      onClick={() => handleScheduleMeeting(allocator)}
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Meeting
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-1 h-8 px-3 text-xs bg-electric-blue hover:bg-electric-blue/90 text-white"
                      onClick={() => handleSendMessage(allocator)}
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
      {selectedAllocator && selectedContact && (
        <>
          <SendMessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipientName={selectedContact.name}
            recipientTitle={selectedContact.title}
            organizationName={selectedAllocator.firmName}
          />
          <ScheduleMeetingModal
            isOpen={isMeetingModalOpen}
            onClose={() => setIsMeetingModalOpen(false)}
            recipientName={selectedContact.name}
            recipientEmail={selectedContact.email}
            organizationName={selectedAllocator.firmName}
          />
        </>
      )}
    </Screen>
  )
}
