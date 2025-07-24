"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Search, FileText, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data for strategy data rooms
const strategies = [
  {
    id: "1",
    name: "Global Equity Fund",
    description: "Long-only global equity strategy focused on large-cap companies",
    assetClass: "Equity",
    vehicleType: "Fund",
    yearLaunched: 2015,
    documentCount: 24,
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    name: "US Fixed Income",
    description: "Core fixed income strategy investing in US government and corporate bonds",
    assetClass: "Fixed Income",
    vehicleType: "SMA",
    yearLaunched: 2010,
    documentCount: 18,
    lastUpdated: "1 week ago",
  },
  {
    id: "3",
    name: "Emerging Markets Debt",
    description: "Active strategy investing in sovereign and corporate debt in emerging markets",
    assetClass: "Fixed Income",
    vehicleType: "Fund",
    yearLaunched: 2018,
    documentCount: 15,
    lastUpdated: "3 days ago",
  },
  {
    id: "4",
    name: "Global Real Estate",
    description: "Strategy investing in REITs and direct real estate globally",
    assetClass: "Alternatives",
    vehicleType: "Fund",
    yearLaunched: 2016,
    documentCount: 20,
    lastUpdated: "5 days ago",
  },
  {
    id: "5",
    name: "Sustainable Multi-Asset",
    description: "Multi-asset strategy with ESG integration across all holdings",
    assetClass: "Multi-Asset",
    vehicleType: "SMA",
    yearLaunched: 2020,
    documentCount: 12,
    lastUpdated: "Yesterday",
  },
]

export default function StrategyDataRoomsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [assetClassFilter, setAssetClassFilter] = useState("all")
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  // Filter strategies based on filters
  const filteredStrategies = strategies.filter((strategy) => {
    // Filter by search query
    const matchesSearch =
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by asset class
    const matchesAssetClass = assetClassFilter === "all" || strategy.assetClass === assetClassFilter

    // Filter by vehicle type
    const matchesVehicleType = vehicleTypeFilter === "all" || strategy.vehicleType === vehicleTypeFilter

    // Filter by year launched
    const matchesYear =
      yearFilter === "all" ||
      (yearFilter === "2020+" && strategy.yearLaunched >= 2020) ||
      (yearFilter === "2015-2019" && strategy.yearLaunched >= 2015 && strategy.yearLaunched < 2020) ||
      (yearFilter === "pre-2015" && strategy.yearLaunched < 2015)

    return matchesSearch && matchesAssetClass && matchesVehicleType && matchesYear
  })

  return (
    <Screen>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">BlackRock: Strategy Data Rooms</h1>
            <p className="text-gray-500">Access strategy-specific documents and performance data</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/screens/allocator/manager-profile">Back to Manager Profile</Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search strategies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={assetClassFilter} onValueChange={setAssetClassFilter} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all">All Asset Classes</TabsTrigger>
              <TabsTrigger value="Equity">Equity</TabsTrigger>
              <TabsTrigger value="Fixed Income">Fixed Income</TabsTrigger>
              <TabsTrigger value="Alternatives">Alternatives</TabsTrigger>
              <TabsTrigger value="Multi-Asset">Multi-Asset</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="Fund">Fund</TabsTrigger>
              <TabsTrigger value="SMA">SMA</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={yearFilter} onValueChange={setYearFilter} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all">All Years</TabsTrigger>
              <TabsTrigger value="2020+">2020+</TabsTrigger>
              <TabsTrigger value="2015-2019">2015-2019</TabsTrigger>
              <TabsTrigger value="pre-2015">Pre-2015</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Strategy list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.length > 0 ? (
            filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    </div>
                    <Badge variant="outline">{strategy.assetClass}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{strategy.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Vehicle Type</p>
                      <p className="font-medium">{strategy.vehicleType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Year Launched</p>
                      <p className="font-medium">{strategy.yearLaunched}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <FileText className="h-4 w-4" />
                      <span>{strategy.documentCount} documents</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {strategy.lastUpdated}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" asChild>
                    <Link href={`/screens/allocator/data-rooms?id=${strategy.id}`}>Open Data Room</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No strategies found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? `No results for "${searchQuery}"` : "No strategies match your selected filters"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setAssetClassFilter("all")
                      setVehicleTypeFilter("all")
                      setYearFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Screen>
  )
}
