"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter, X } from "lucide-react"

interface UniversalSearchFiltersProps {
  onFiltersChange: (filters: {
    assetClasses: string[]
    strategies: string[]
    sectors: string[]
  }) => void
  initialFilters?: {
    assetClasses: string[]
    strategies: string[]
    sectors: string[]
  }
  showSectors?: boolean
}

const assetClassOptions = [
  "Public Equities",
  "Public Fixed Income",
  "Private Fixed Income",
  "Real Estate",
  "Private Equity & Other Alternatives",
]

const strategyOptions = [
  // Public Equities strategies
  "Index/ETF Strategies",
  "Large Cap Equity",
  "Small/Mid Cap Equity",
  "Global/International Equity",
  "Emerging Markets Equity",
  "Sector-Specific Equity",
  "ESG/Sustainable Equity",
  "Long/Short Equity",

  // Public Fixed Income strategies
  "Investment Grade Corporate Bonds",
  "High Yield Bonds",
  "Emerging Market Bonds",
  "Long Duration",
  "Short Duration",
  "Liability Driven Investing",
  "Core Fixed Income",
  "Core Insurance",
  "Structured Credit",

  // Private Fixed Income strategies
  "Corporate Private Placements",
  "Infrastructure Debt",
  "Private Asset Based Finance",
  "Direct Lending",

  // Real Estate strategies
  "Real Estate Debt",
  "Commercial Mortgage Loans",
  "Residential Mortgage Loans",
  "Real Estate Equity",

  // Private Equity & Other Alternatives strategies
  "Private Equity",
  "Buyouts",
  "Growth Equity",
  "Venture Capital",
  "Digital Assets",
]

const sectorOptions = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer",
  "Industrial",
  "Energy",
  "Infrastructure",
  "Real Estate",
  "Materials",
  "Telecommunications",
  "Utilities",
  "Transportation",
]

export function UniversalSearchFilters({
  onFiltersChange,
  initialFilters = { assetClasses: [], strategies: [], sectors: [] },
  showSectors = false,
}: UniversalSearchFiltersProps) {
  const [selectedAssetClasses, setSelectedAssetClasses] = useState<string[]>(initialFilters.assetClasses)
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(initialFilters.strategies)
  const [selectedSectors, setSelectedSectors] = useState<string[]>(initialFilters.sectors)

  // Inform parent of initial filters once on mount
  useEffect(() => {
    onFiltersChange(initialFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAssetClassChange = (assetClass: string, checked: boolean) => {
    if (checked) {
      setSelectedAssetClasses([...selectedAssetClasses, assetClass])
    } else {
      setSelectedAssetClasses(selectedAssetClasses.filter((ac) => ac !== assetClass))
    }
  }

  const handleStrategyChange = (strategy: string, checked: boolean) => {
    if (checked) {
      setSelectedStrategies([...selectedStrategies, strategy])
    } else {
      setSelectedStrategies(selectedStrategies.filter((s) => s !== strategy))
    }
  }

  const handleSectorChange = (sector: string, checked: boolean) => {
    if (checked) {
      setSelectedSectors([...selectedSectors, sector])
    } else {
      setSelectedSectors(selectedSectors.filter((s) => s !== sector))
    }
  }

  const clearAllFilters = () => {
    setSelectedAssetClasses([])
    setSelectedStrategies([])
    setSelectedSectors([])
  }

  const totalFilters = selectedAssetClasses.length + selectedStrategies.length + selectedSectors.length

  const removeFilter = (type: "assetClass" | "strategy" | "sector", value: string) => {
    if (type === "assetClass") {
      setSelectedAssetClasses(selectedAssetClasses.filter((ac) => ac !== value))
    } else if (type === "strategy") {
      setSelectedStrategies(selectedStrategies.filter((s) => s !== value))
    } else if (type === "sector") {
      setSelectedSectors(selectedSectors.filter((s) => s !== value))
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Asset Classes
              {selectedAssetClasses.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {selectedAssetClasses.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="font-medium">Asset Classes</div>
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {assetClassOptions.map((assetClass) => (
                    <div key={assetClass} className="flex items-center space-x-2">
                      <Checkbox
                        id={`asset-${assetClass}`}
                        checked={selectedAssetClasses.includes(assetClass)}
                        onCheckedChange={(checked) => handleAssetClassChange(assetClass, checked as boolean)}
                      />
                      <label
                        htmlFor={`asset-${assetClass}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {assetClass}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Strategies
              {selectedStrategies.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {selectedStrategies.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="font-medium">Strategies</div>
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {strategyOptions.map((strategy) => (
                    <div key={strategy} className="flex items-center space-x-2">
                      <Checkbox
                        id={`strategy-${strategy}`}
                        checked={selectedStrategies.includes(strategy)}
                        onCheckedChange={(checked) => handleStrategyChange(strategy, checked as boolean)}
                      />
                      <label
                        htmlFor={`strategy-${strategy}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {strategy}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        {showSectors && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Sectors
                {selectedSectors.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    {selectedSectors.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="font-medium">Sectors</div>
                <ScrollArea className="h-60">
                  <div className="space-y-2">
                    {sectorOptions.map((sector) => (
                      <div key={sector} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sector-${sector}`}
                          checked={selectedSectors.includes(sector)}
                          onCheckedChange={(checked) => handleSectorChange(sector, checked as boolean)}
                        />
                        <label
                          htmlFor={`sector-${sector}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {sector}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {totalFilters > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} className="h-9 text-baseGray">
            Clear All ({totalFilters})
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {totalFilters > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-baseGray">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {selectedAssetClasses.map((assetClass) => (
              <Badge key={assetClass} variant="secondary" className="text-xs">
                {assetClass}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => removeFilter("assetClass", assetClass)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {selectedStrategies.map((strategy) => (
              <Badge key={strategy} variant="outline" className="text-xs">
                {strategy}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => removeFilter("strategy", strategy)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {selectedSectors.map((sector) => (
              <Badge key={sector} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                {sector}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => removeFilter("sector", sector)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
