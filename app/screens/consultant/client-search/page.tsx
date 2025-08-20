"use client"

import { useState, useCallback } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ComprehensiveFilters } from "@/components/ComprehensiveFilters"
import { SearchInput } from "@/components/SearchInput"
import { SortDropdown } from "@/components/SortDropdown"
import { ExportButton } from "@/components/ExportButton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, TrendingUp, Users, MessageCircle, Calendar, Eye, Bookmark, Building2 } from "lucide-react"
import { SendMessageModal } from "@/components/profile-modals/SendMessageModal"
import { ScheduleMeetingModal } from "@/components/profile-modals/ScheduleMeetingModal"
import { useRouter } from "next/navigation"

const allocators = [
  {
    id: 1,
    name: "California Public Employees' Retirement System",
    shortName: "CalPERS",
    type: "Public Pension",
    aum: "$469B",
    aua: "$125M", // Assets Under Advisory with consultant
    tenureAsClient: 36, // months as client
    tenureDisplay: "3 years",
    description:
      "The largest public pension fund in the United States, serving over 2 million members with a focus on long-term sustainable investing",
    status: "Active Client",
    location: "Sacramento, CA",
    founded: "1932",
    experience: "90+ years",
    investmentHorizon: "Long-term",
    initials: "CP",
    tags: ["ESG Focus", "Infrastructure", "Private Equity"],
    interests: ["ESG Investing", "Infrastructure", "Private Equity", "Real Estate", "Sustainable Investing"],
    assetClasses: ["Private Equity & Other Alternatives", "Real Estate"],
    strategies: ["ESG/Sustainable Equity", "Infrastructure Debt", "Private Equity"],
    sectors: ["Infrastructure", "Real Estate"],
    isBookmarked: true,
    consultingFocus: ["Investment Strategy", "ESG Implementation", "Risk Management"],
  },
  {
    id: 2,
    name: "Harvard Management Company",
    shortName: "HMC",
    type: "Endowment",
    aum: "$53.2B",
    aua: "$0M", // Prospect - no advisory relationship yet
    tenureAsClient: 0,
    tenureDisplay: "Prospect",
    description:
      "Investment management company that manages Harvard University's endowment with innovative portfolio approach",
    status: "Prospect",
    location: "Boston, MA",
    founded: "1974",
    experience: "50+ years",
    investmentHorizon: "Long-term",
    initials: "HM",
    tags: ["Alternative Investments", "Long-term Focus", "Academic"],
    interests: ["Alternative Investments", "Long-term Focus", "Academic", "Technology", "Healthcare"],
    assetClasses: ["Private Equity & Other Alternatives", "Public Equities"],
    strategies: ["Growth Equity", "Venture Capital", "Large Cap Equity"],
    sectors: ["Technology", "Healthcare"],
    isBookmarked: false,
    consultingFocus: ["Portfolio Optimization", "Alternative Investments", "Performance Analysis"],
  },
  {
    id: 3,
    name: "Government Pension Investment Fund",
    shortName: "GPIF",
    type: "Sovereign Wealth Fund",
    aum: "$1.7T",
    aua: "$85M",
    tenureAsClient: 18,
    tenureDisplay: "1.5 years",
    description: "World's largest pension fund managing retirement benefits for Japanese public sector employees",
    status: "Research Target",
    location: "Tokyo, Japan",
    founded: "2006",
    experience: "18+ years",
    investmentHorizon: "Strategic",
    initials: "GP",
    tags: ["ESG Pioneer", "Global", "Passive"],
    interests: ["ESG Pioneer", "Global", "Passive", "Index Strategies", "Fixed Income"],
    assetClasses: ["Public Equities", "Public Fixed Income"],
    strategies: ["Index/ETF Strategies", "Core Fixed Income", "ESG/Sustainable Equity"],
    sectors: ["Global Markets"],
    isBookmarked: true,
    consultingFocus: ["ESG Strategy", "Passive Management", "Global Allocation"],
  },
  {
    id: 4,
    name: "Yale Investments Office",
    shortName: "Yale",
    type: "Endowment",
    aum: "$41.4B",
    aua: "$200M",
    tenureAsClient: 48,
    tenureDisplay: "4 years",
    description:
      "Pioneering endowment model with significant allocation to alternative investments and active management",
    status: "Active Client",
    location: "New Haven, CT",
    founded: "1985",
    experience: "39+ years",
    investmentHorizon: "Long-term",
    initials: "YI",
    tags: ["Endowment Model", "Alternatives", "Active"],
    interests: ["Endowment Model", "Alternatives", "Active", "Private Equity", "Hedge Funds"],
    assetClasses: ["Private Equity & Other Alternatives", "Public Equities"],
    strategies: ["Private Equity", "Long/Short Equity", "Venture Capital"],
    sectors: ["Technology", "Healthcare"],
    isBookmarked: false,
    consultingFocus: ["Endowment Model", "Alternative Investments", "Manager Selection"],
  },
  {
    id: 5,
    name: "Ontario Teachers' Pension Plan",
    shortName: "OTPP",
    type: "Public Pension",
    aum: "$247.2B",
    aua: "$0M",
    tenureAsClient: 0,
    tenureDisplay: "Prospect",
    description: "Canadian pension plan known for innovative investment strategies and direct investing capabilities",
    status: "Prospect",
    location: "Toronto, Canada",
    founded: "1990",
    experience: "34+ years",
    investmentHorizon: "Long-term",
    initials: "OT",
    tags: ["Direct Investing", "Innovation", "Infrastructure"],
    interests: ["Direct Investing", "Innovation", "Infrastructure", "Real Estate", "Private Equity"],
    assetClasses: ["Private Equity & Other Alternatives", "Real Estate", "Private Fixed Income"],
    strategies: ["Private Equity", "Real Estate Equity", "Infrastructure Debt"],
    sectors: ["Infrastructure", "Real Estate", "Technology"],
    isBookmarked: true,
    consultingFocus: ["Direct Investing", "Infrastructure Strategy", "Innovation"],
  },
  {
    id: 6,
    name: "Allianz Global Investors",
    shortName: "AGI",
    type: "Insurance Company",
    aum: "$638B",
    aua: "$45M",
    tenureAsClient: 24,
    tenureDisplay: "2 years",
    description:
      "Global asset manager serving institutional and retail clients with expertise in fixed income and alternatives",
    status: "Past Client",
    location: "Munich, Germany",
    founded: "1890",
    experience: "134+ years",
    investmentHorizon: "Medium-term",
    initials: "AG",
    tags: ["Fixed Income", "Global", "Insurance"],
    interests: ["Fixed Income", "Global", "Insurance", "Corporate Bonds", "Infrastructure"],
    assetClasses: ["Public Fixed Income", "Private Fixed Income"],
    strategies: ["Investment Grade Corporate Bonds", "Infrastructure Debt", "Core Fixed Income"],
    sectors: ["Financial Services", "Infrastructure"],
    isBookmarked: false,
    consultingFocus: ["Fixed Income Strategy", "Risk Management", "Regulatory Compliance"],
  },
]

const managers = [
  {
    id: 1,
    name: "David Rodriguez",
    shortName: "David Rodriguez",
    type: "Managing Partner",
    aum: "$2.5B",
    aua: "$75M",
    tenureAsClient: 30,
    tenureDisplay: "2.5 years",
    description:
      "Experienced investment manager with 18+ years in private equity and growth capital, focusing on technology and healthcare sectors",
    status: "Active Client",
    location: "San Francisco, CA",
    founded: "2005",
    experience: "18+ years",
    investmentHorizon: "Long-term",
    initials: "DR",
    tags: ["Growth Capital", "Technology", "Healthcare"],
    interests: ["Growth Equity", "Technology", "Healthcare", "Private Equity", "Buyouts"],
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Growth Equity", "Buyouts"],
    sectors: ["Technology", "Healthcare"],
    isBookmarked: true,
    consultingFocus: ["Growth Strategy", "Technology Due Diligence", "Portfolio Optimization"],
  },
  {
    id: 2,
    name: "Sarah Chen",
    shortName: "Sarah Chen",
    type: "Portfolio Manager",
    aum: "$1.2B",
    aua: "$0M",
    tenureAsClient: 0,
    tenureDisplay: "Prospect",
    description: "ESG-focused portfolio manager specializing in sustainable equity strategies and impact investing",
    status: "Prospect",
    location: "New York, NY",
    founded: "2012",
    experience: "12+ years",
    investmentHorizon: "Long-term",
    initials: "SC",
    tags: ["ESG Focus", "Sustainable", "Impact"],
    interests: ["ESG/Sustainable Equity", "Long/Short Equity", "Impact Investing", "Technology", "Consumer"],
    assetClasses: ["Public Equities"],
    strategies: ["ESG/Sustainable Equity", "Long/Short Equity"],
    sectors: ["Technology", "Consumer"],
    isBookmarked: false,
    consultingFocus: ["ESG Strategy", "Impact Measurement", "Sustainable Investing"],
  },
  {
    id: 3,
    name: "Michael Thompson",
    shortName: "Michael Thompson",
    type: "Senior Managing Director",
    aum: "$3.8B",
    aua: "$150M",
    tenureAsClient: 42,
    tenureDisplay: "3.5 years",
    description:
      "Infrastructure investment specialist with extensive experience in debt and equity investments across global markets",
    status: "Research Target",
    location: "London, UK",
    founded: "2002",
    experience: "22+ years",
    investmentHorizon: "Strategic",
    initials: "MT",
    tags: ["Infrastructure", "Global", "Debt"],
    interests: ["Infrastructure Debt", "Real Estate Debt", "Infrastructure", "Energy", "Global Markets"],
    assetClasses: ["Private Fixed Income", "Real Estate"],
    strategies: ["Infrastructure Debt", "Real Estate Debt"],
    sectors: ["Infrastructure", "Energy"],
    isBookmarked: true,
    consultingFocus: ["Infrastructure Strategy", "Global Markets", "Debt Structuring"],
  },
  {
    id: 4,
    name: "Jennifer Park",
    shortName: "Jennifer Park",
    type: "Founding Partner",
    aum: "$800M",
    aua: "$25M",
    tenureAsClient: 12,
    tenureDisplay: "1 year",
    description: "Early-stage venture capital investor focused on technology startups and emerging growth companies",
    status: "Active Client",
    location: "Palo Alto, CA",
    founded: "2009",
    experience: "15+ years",
    investmentHorizon: "Long-term",
    initials: "JP",
    tags: ["Venture Capital", "Early Stage", "Technology"],
    interests: ["Venture Capital", "Growth Equity", "Technology", "Healthcare", "Startups"],
    assetClasses: ["Private Equity & Other Alternatives"],
    strategies: ["Venture Capital", "Growth Equity"],
    sectors: ["Technology", "Healthcare"],
    isBookmarked: false,
    consultingFocus: ["Venture Strategy", "Technology Assessment", "Growth Planning"],
  },
  {
    id: 5,
    name: "Robert Williams",
    shortName: "Robert Williams",
    type: "Chief Investment Officer",
    aum: "$4.2B",
    aua: "$95M",
    tenureAsClient: 60,
    tenureDisplay: "5 years",
    description: "Fixed income specialist with deep expertise in credit markets and alternative lending strategies",
    status: "Past Client",
    location: "Chicago, IL",
    founded: "1999",
    experience: "25+ years",
    investmentHorizon: "Medium-term",
    initials: "RW",
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
    consultingFocus: ["Credit Strategy", "Risk Assessment", "Fixed Income Optimization"],
  },
  {
    id: 6,
    name: "Lisa Anderson",
    shortName: "Lisa Anderson",
    type: "Managing Director",
    aum: "$1.9B",
    aua: "$0M",
    tenureAsClient: 0,
    tenureDisplay: "Prospect",
    description: "Real estate investment professional specializing in commercial properties and mortgage lending",
    status: "Prospect",
    location: "Los Angeles, CA",
    founded: "2008",
    experience: "16+ years",
    investmentHorizon: "Long-term",
    initials: "LA",
    tags: ["Real Estate", "Commercial", "Mortgage"],
    interests: ["Real Estate Equity", "Commercial Mortgage Loans", "Real Estate", "Commercial Properties"],
    assetClasses: ["Real Estate"],
    strategies: ["Real Estate Equity", "Commercial Mortgage Loans"],
    sectors: ["Real Estate"],
    isBookmarked: false,
    consultingFocus: ["Real Estate Strategy", "Commercial Analysis", "Market Research"],
  },
]

export default function ConsultantAllocatorManagerSearchPage() {
  const [activeTab, setActiveTab] = useState("allocators")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("aum")
  const [filters, setFilters] = useState({
    assetClasses: [] as string[],
    strategies: [] as string[],
    organizationTypes: [] as string[],
    sectors: [] as string[],
  })

  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)

  const currentData = activeTab === "allocators" ? allocators : managers
  const [filteredData, setFilteredData] = useState(currentData)

  const router = useRouter()

  const handleViewProfile = (contact: any) => {
    const profileType = activeTab === "allocators" ? "allocator-profile" : "manager-profile"
    router.push(`/screens/general/${profileType}?id=${contact.id}`)
  }

  const handleSendMessage = (contact: any) => {
    setSelectedContact(contact)
    setIsMessageModalOpen(true)
  }

  const handleScheduleMeeting = (contact: any) => {
    setSelectedContact(contact)
    setIsMeetingModalOpen(true)
  }

  const handleFiltersChange = useCallback(
    (newFilters: {
      assetClasses: string[]
      strategies: string[]
      organizationTypes?: string[]
      sectors?: string[]
    }) => {
      setFilters({
        assetClasses: newFilters.assetClasses,
        strategies: newFilters.strategies,
        organizationTypes: newFilters.organizationTypes || [],
        sectors: newFilters.sectors || [],
      })

      const filtered = currentData.filter((contact) => {
        const matchesSearch =
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          contact.consultingFocus.some((focus) => focus.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesAssetClass =
          newFilters.assetClasses.length === 0 ||
          newFilters.assetClasses.some((ac) => contact.assetClasses.includes(ac))

        const matchesStrategy =
          newFilters.strategies.length === 0 || newFilters.strategies.some((s) => contact.strategies.includes(s))

        const matchesOrgType =
          !newFilters.organizationTypes ||
          newFilters.organizationTypes.length === 0 ||
          newFilters.organizationTypes.includes(contact.type)

        const matchesSector =
          !newFilters.sectors ||
          newFilters.sectors.length === 0 ||
          (contact.sectors && newFilters.sectors.some((s) => contact.sectors.includes(s)))

        return matchesSearch && matchesAssetClass && matchesStrategy && matchesOrgType && matchesSector
      })

      // Apply sorting
      if (sortBy === "aum") {
        filtered.sort((a, b) => {
          const aumA = Number.parseFloat(a.aum.replace(/[^0-9.]/g, ""))
          const aumB = Number.parseFloat(b.aum.replace(/[^0-9.]/g, ""))
          return aumB - aumA
        })
      } else if (sortBy === "aua") {
        filtered.sort((a, b) => {
          const auaA = Number.parseFloat(a.aua.replace(/[^0-9.]/g, ""))
          const auaB = Number.parseFloat(b.aua.replace(/[^0-9.]/g, ""))
          return auaB - auaA
        })
      } else if (sortBy === "tenure") {
        filtered.sort((a, b) => b.tenureAsClient - a.tenureAsClient)
      } else if (sortBy === "experience") {
        filtered.sort((a, b) => Number.parseInt(b.experience) - Number.parseInt(a.experience))
      } else if (sortBy === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy === "bookmarked") {
        filtered.sort((a, b) => (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0))
      }

      setFilteredData(filtered)
    },
    [searchTerm, sortBy, currentData],
  )

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    handleFiltersChange(filters)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    handleFiltersChange(filters)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchTerm("")
    setFilters({
      assetClasses: [],
      strategies: [],
      organizationTypes: [],
      sectors: [],
    })
    const newData = value === "allocators" ? allocators : managers
    setFilteredData(newData)
  }

  const toggleBookmark = (contactId: number) => {
    setFilteredData((prev) =>
      prev.map((contact) => (contact.id === contactId ? { ...contact, isBookmarked: !contact.isBookmarked } : contact)),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active Client":
        return "bg-green-100 text-green-800"
      case "Prospect":
        return "bg-blue-100 text-blue-800"
      case "Research Target":
        return "bg-yellow-100 text-yellow-800"
      case "Past Client":
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
            Allocator & Manager Search
          </h1>
          <p className="mt-2" style={{ color: "#6D6A75" }}>
            Find and connect with institutional allocators and investment managers for consulting opportunities
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="allocators">Allocators</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <SearchInput
                        placeholder={`Search ${activeTab} by name, type, or consulting focus...`}
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div className="flex gap-2">
                      <SortDropdown
                        value={sortBy}
                        onChange={handleSortChange}
                        options={[
                          { value: "aua", label: "Highest AUA" },
                          { value: "tenure", label: "Longest Tenure" },
                          { value: "name", label: "Name (A–Z)" },
                          { value: "aum", label: "Largest Total Assets" },
                          { value: "experience", label: "Most Experience" },
                          { value: "bookmarked", label: "Bookmarked First" },
                        ]}
                      />
                      <ExportButton
                        data={filteredData}
                        filename={`${activeTab}-search-results`}
                        className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                      />
                    </div>
                  </div>

                  <ComprehensiveFilters
                    onFiltersChange={handleFiltersChange}
                    initialFilters={filters}
                    showOrganizationTypes={true}
                    showSectors={activeTab === "managers"}
                    userType={activeTab === "allocators" ? "allocator" : "manager"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredData.length} of {currentData.length} {activeTab}
              </div>
              <div className="flex items-center gap-4 text-sm text-baseGray">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>{filteredData.filter((c) => c.isBookmarked).length} bookmarked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{filteredData.filter((c) => c.status === "Active Client").length} active clients</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid gap-6">
              {filteredData.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Header Section */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarFallback
                          className="font-semibold"
                          style={{ backgroundColor: "#3B0A45", color: "white" }}
                        >
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold mb-1" style={{ color: "#3B0A45" }}>
                              {contact.shortName}
                            </h3>
                            <div className="flex items-center gap-2 mb-1">
                              <Building2 className="h-4 w-4" style={{ color: "#6D6A75" }} />
                              <span className="text-sm" style={{ color: "#6D6A75" }}>
                                {contact.type} • {contact.aum} Total Assets
                                {contact.aua !== "$0M" && ` • ${contact.aua} AUA`}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#6D6A75" }}>
                              {contact.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 flex-shrink-0"
                              onClick={() => toggleBookmark(contact.id)}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${contact.isBookmarked ? "fill-blue-500 text-blue-500" : "text-baseGray"}`}
                              />
                            </Button>
                            <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: "#6D6A75" }} />
                        <span style={{ color: "#6D6A75" }}>{contact.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" style={{ color: "#6D6A75" }} />
                        <span style={{ color: "#6D6A75" }}>Founded {contact.founded}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" style={{ color: "#6D6A75" }} />
                        <span style={{ color: "#6D6A75" }}>{contact.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" style={{ color: "#6D6A75" }} />
                        <span style={{ color: "#6D6A75" }}>Client: {contact.tenureDisplay}</span>
                      </div>
                    </div>

                    {/* Consulting Focus Section */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-baseGray mb-2">Consulting Opportunities:</div>
                      <div className="flex flex-wrap gap-1">
                        {contact.consultingFocus.map((focus) => (
                          <Badge key={focus} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Badges Section */}
                    <div className="space-y-2 mb-4">
                      <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                        {contact.assetClasses.map((assetClass) => (
                          <Badge key={assetClass} variant="secondary" className="text-xs">
                            {assetClass}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                        {contact.strategies.map((strategy) => (
                          <Badge key={strategy} variant="outline" className="text-xs">
                            {strategy}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                        {contact.sectors &&
                          contact.sectors.map((sector) => (
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
                          onClick={() => handleViewProfile(contact)}
                        >
                          <Eye className="h-4 w-4" />
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 h-8 px-3 text-xs border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent"
                          onClick={() => handleScheduleMeeting(contact)}
                        >
                          <Calendar className="h-4 w-4" />
                          Schedule Meeting
                        </Button>
                        <Button
                          size="sm"
                          className="flex items-center gap-1 h-8 px-3 text-xs bg-electric-blue hover:bg-electric-blue/90 text-white"
                          onClick={() => handleSendMessage(contact)}
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
          </TabsContent>
        </Tabs>
      </div>
      {selectedContact && (
        <>
          <SendMessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipientName={selectedContact.name}
            recipientEmail={`contact@${selectedContact.shortName.toLowerCase().replace(/\s+/g, "")}.com`}
          />
          <ScheduleMeetingModal
            isOpen={isMeetingModalOpen}
            onClose={() => setIsMeetingModalOpen(false)}
            recipientName={selectedContact.name}
            recipientEmail={`contact@${selectedContact.shortName.toLowerCase().replace(/\s+/g, "")}.com`}
          />
        </>
      )}
    </Screen>
  )
}
