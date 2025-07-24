"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Eye, Building2, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for data rooms from other managers
const allDataRooms = [
  {
    id: "1",
    name: "Global Equity Strategy",
    managerName: "Blackstone Capital",
    location: "New York, NY",
    assetClass: "Equity",
    strategy: "Global Equity",
    strategyAUM: "$2.5B",
    totalAUM: "$15.2B",
    trackRecord: "12 years",
    documentCount: 24,
    lastUpdated: "2 days ago",
    isPublic: true,
    hasAccess: false,
    views: 156,
    description: "Comprehensive documentation for our global equity investment strategy",
  },
  {
    id: "2",
    name: "Fixed Income Portfolio",
    managerName: "Wellington Management",
    location: "Boston, MA",
    assetClass: "Fixed Income",
    strategy: "Core Fixed Income",
    strategyAUM: "$8.1B",
    totalAUM: "$45.7B",
    trackRecord: "25 years",
    documentCount: 18,
    lastUpdated: "1 day ago",
    isPublic: true,
    hasAccess: true,
    views: 89,
    description: "Fixed income investment strategies and portfolio documentation",
  },
  {
    id: "3",
    name: "Alternative Investments",
    managerName: "Apollo Global Management",
    location: "New York, NY",
    assetClass: "Alternatives",
    strategy: "Private Equity",
    strategyAUM: "$12.3B",
    totalAUM: "$78.9B",
    trackRecord: "18 years",
    documentCount: 32,
    lastUpdated: "3 days ago",
    isPublic: false,
    hasAccess: false,
    views: 234,
    description: "Private equity and alternative investment documentation",
  },
]

// Mock data for manager's own data rooms
const myDataRooms = [
  {
    id: "4",
    name: "Growth Equity Fund",
    managerName: "Your Firm",
    location: "San Francisco, CA",
    assetClass: "Equity",
    strategy: "Growth Equity",
    strategyAUM: "$1.8B",
    totalAUM: "$5.2B",
    trackRecord: "8 years",
    documentCount: 28,
    lastUpdated: "Yesterday",
    isPublic: true,
    hasAccess: true,
    views: 67,
    recentActivity: [
      { user: "Jane Smith - ABC Capital", action: "viewed", document: "Fund Overview", time: "2 hours ago" },
      {
        user: "Robert Johnson - XYZ Investments",
        action: "downloaded",
        document: "Performance Report",
        time: "5 hours ago",
      },
      { user: "Emily Davis - LMN Partners", action: "viewed", document: "Risk Analysis", time: "1 day ago" },
    ],
  },
]

// Mock data for invites and requests
const invites = [
  {
    id: "5",
    name: "Emerging Markets Fund",
    managerName: "Vanguard Group",
    location: "Valley Forge, PA",
    assetClass: "Equity",
    strategy: "Emerging Markets",
    invitedBy: "Sarah Wilson",
    invitedDate: "2 days ago",
    status: "pending",
  },
]

const requests = [
  {
    id: "6",
    requestedBy: "Michael Brown - DEF Capital",
    dataRoom: "Growth Equity Fund",
    requestDate: "1 day ago",
    status: "pending",
    message: "Would like access to review your growth equity strategy documentation.",
  },
]

export default function ManagerDataRoomSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [assetClassFilter, setAssetClassFilter] = useState("all")
  const [strategyFilter, setStrategyFilter] = useState("all")
  const [aumRangeFilter, setAumRangeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [trackRecordFilter, setTrackRecordFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Smart AUM logic
  const getDisplayAUM = (room: any) => {
    if (assetClassFilter !== "all" || strategyFilter !== "all") {
      return room.strategyAUM
    }
    return room.totalAUM
  }

  // Filter data rooms based on search and filters
  const filterDataRooms = (rooms: any[]) => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesAssetClass = assetClassFilter === "all" || room.assetClass === assetClassFilter
      const matchesStrategy = strategyFilter === "all" || room.strategy === strategyFilter
      const matchesLocation = locationFilter === "all" || room.location.includes(locationFilter)

      return matchesSearch && matchesAssetClass && matchesStrategy && matchesLocation
    })
  }

  const getDataRoomsForTab = () => {
    switch (activeTab) {
      case "my":
        return filterDataRooms(myDataRooms)
      case "invites":
        return invites
      case "requests":
        return requests
      default:
        return filterDataRooms(allDataRooms)
    }
  }

  const dataRooms = getDataRoomsForTab()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Room Search</h1>
          <p className="text-gray-500">Discover and access investment documentation from other managers</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Data Rooms</TabsTrigger>
          <TabsTrigger value="my">My Data Rooms</TabsTrigger>
          <TabsTrigger value="invites">
            Invites
            {invites.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {invites.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {requests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4 space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Filters</h3>

                <div>
                  <label className="text-sm font-medium mb-2 block">Asset Class</label>
                  <Select value={assetClassFilter} onValueChange={setAssetClassFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Asset Classes</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                      <SelectItem value="Alternatives">Alternatives</SelectItem>
                      <SelectItem value="Multi-Asset">Multi-Asset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Strategy</label>
                  <Select value={strategyFilter} onValueChange={setStrategyFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Strategies</SelectItem>
                      <SelectItem value="Global Equity">Global Equity</SelectItem>
                      <SelectItem value="Growth Equity">Growth Equity</SelectItem>
                      <SelectItem value="Core Fixed Income">Core Fixed Income</SelectItem>
                      <SelectItem value="Private Equity">Private Equity</SelectItem>
                      <SelectItem value="Emerging Markets">Emerging Markets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Strategy AUM Range</label>
                  <Select value={aumRangeFilter} onValueChange={setAumRangeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ranges</SelectItem>
                      <SelectItem value="0-1B">$0 - $1B</SelectItem>
                      <SelectItem value="1-5B">$1B - $5B</SelectItem>
                      <SelectItem value="5-10B">$5B - $10B</SelectItem>
                      <SelectItem value="10B+">$10B+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="Boston">Boston</SelectItem>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="London">London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Length of Track Record</label>
                  <Select value={trackRecordFilter} onValueChange={setTrackRecordFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Track Records</SelectItem>
                      <SelectItem value="0-5">0-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10-20">10-20 years</SelectItem>
                      <SelectItem value="20+">20+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search data rooms, managers, strategies..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button variant="outline" className="md:w-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Sort by AUM
                </Button>
              </div>

              <div className="space-y-4">
                {dataRooms.length > 0 ? (
                  dataRooms.map((room) => (
                    <Card key={room.id} className="hover:border-blue-300 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{room.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {room.managerName}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {room.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{getDisplayAUM(room)}</div>
                            <div className="text-sm text-gray-500">
                              {assetClassFilter !== "all" || strategyFilter !== "all" ? "Strategy AUM" : "Total AUM"}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-gray-600 text-sm mb-3">{room.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline">{room.assetClass}</Badge>
                          <Badge variant="outline">{room.strategy}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {room.trackRecord} track record
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {room.views} views
                            </div>
                            <span>{room.documentCount} documents</span>
                            <span>Updated {room.lastUpdated}</span>
                          </div>

                          <div className="flex gap-2">
                            {room.hasAccess ? (
                              <Button size="sm">View Data Room</Button>
                            ) : room.isPublic ? (
                              <Button size="sm" variant="outline">
                                Request Access
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                Private
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="py-8">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                      <Search className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No data rooms found</h3>
                      <p className="text-gray-500">
                        {searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your filters"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 space-y-4">
              {myDataRooms.map((room) => (
                <Card key={room.id} className="hover:border-blue-300 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {room.managerName}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {room.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{getDisplayAUM(room)}</div>
                        <div className="text-sm text-gray-500">Strategy AUM</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{room.assetClass}</Badge>
                      <Badge variant="outline">{room.strategy}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {room.views} views
                        </div>
                        <span>{room.documentCount} documents</span>
                      </div>

                      <Button size="sm">Manage Data Room</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myDataRooms[0]?.recentActivity?.map((activity, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{activity.user}</div>
                        <div className="text-gray-600">
                          {activity.action} {activity.document}
                        </div>
                        <div className="text-gray-400 text-xs">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          {invites.map((invite) => (
            <Card key={invite.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{invite.name}</h3>
                    <p className="text-sm text-gray-600">{invite.managerName}</p>
                    <p className="text-sm text-gray-500">
                      Invited by {invite.invitedBy} • {invite.invitedDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.requestedBy}</h3>
                    <p className="text-sm text-gray-600">Requesting access to: {request.dataRoom}</p>
                    <p className="text-sm text-gray-500 mt-2">{request.message}</p>
                    <p className="text-sm text-gray-400 mt-1">{request.requestDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Deny
                    </Button>
                    <Button size="sm">Grant Access</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
