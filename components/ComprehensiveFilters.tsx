"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter, X } from "lucide-react"

// Comprehensive taxonomy structure
const ASSET_CLASSES = {
  "Public Equities": [
    "Index/ETF Strategies",
    "Large Cap Equity",
    "Small/Mid Cap Equity",
    "Global/International Equity",
    "Emerging Markets Equity",
    "Sector-Specific Equity",
    "ESG/Sustainable Equity",
    "Long/Short Equity",
  ],
  "Public Fixed Income": [
    "Investment Grade Corporate Bonds",
    "High Yield Bonds",
    "Emerging Market Bonds",
    "Long Duration",
    "Short Duration",
    "Liability Driven Investing",
    "Core Fixed Income",
    "Core Insurance",
    "Structured Credit",
  ],
  "Private Fixed Income": [
    "Corporate Private Placements",
    "Infrastructure Debt",
    "Private Asset Based Finance",
    "Direct Lending",
  ],
  "Real Estate": ["Real Estate Debt", "Commercial Mortgage Loans", "Residential Mortgage Loans", "Real Estate Equity"],
  "Private Equity & Other Alternatives": [
    "Private Equity",
    "Buyouts",
    "Growth Equity",
    "Venture Capital",
    "Digital Assets",
  ],
} as const

const SECTORS = [
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
] as const

const ORGANIZATION_TYPES = {
  manager: ["Private Equity", "Hedge Fund", "Infrastructure", "Venture Capital", "Credit", "Real Estate"],
  allocator: ["Pension Fund", "Endowment", "Foundation", "Insurance Company", "Sovereign Wealth Fund", "Family Office"],
  consultant: ["Investment Consultant", "Advisory Firm", "Research Provider", "Risk Management", "Compliance Firm"],
} as const

const EXPERIENCE_LEVELS = ["0-5 years", "5-10 years", "10-15 years", "15-20 years", "20+ years"] as const

interface ComprehensiveFiltersProps {
  onFiltersChange: (filters: {
    assetClasses: string[]
    strategies: string[]
    sectors?: string[]
    organizationTypes?: string[]
    experience?: string[]
  }) => void
  initialFilters?: {
    assetClasses: string[]
    strategies: string[]
    sectors?: string[]
    organizationTypes?: string[]
    experience?: string[]
  }
  showSectors?: boolean
  showOrganizationTypes?: boolean
  showExperience?: boolean
  userType?: "manager" | "allocator" | "consultant"
}

export function ComprehensiveFilters({
  onFiltersChange,
  initialFilters = { assetClasses: [], strategies: [] },
  showSectors = false,
  showOrganizationTypes = false,
  showExperience = false,
  userType = "manager",
}: ComprehensiveFiltersProps) {
  const [selectedAssetClasses, setSelectedAssetClasses] = useState<string[]>(initialFilters.assetClasses || [])
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(initialFilters.strategies || [])
  const [selectedSectors, setSelectedSectors] = useState<string[]>(initialFilters.sectors || [])
  const [selectedOrgTypes, setSelectedOrgTypes] = useState<string[]>(initialFilters.organizationTypes || [])
  const [selectedExperience, setSelectedExperience] = useState<string[]>(initialFilters.experience || [])

  // Get all strategies from all asset classes
  const allStrategies = Object.values(ASSET_CLASSES).flat()
  const assetClassKeys = Object.keys(ASSET_CLASSES) as Array<keyof typeof ASSET_CLASSES>

  const updateFilters = () => {
    onFiltersChange({
      assetClasses: selectedAssetClasses,
      strategies: selectedStrategies,
      ...(showSectors && { sectors: selectedSectors }),
      ...(showOrganizationTypes && { organizationTypes: selectedOrgTypes }),
      ...(showExperience && { experience: selectedExperience }),
    })
  }

  useEffect(() => {
    updateFilters()
  }, [selectedAssetClasses, selectedStrategies, selectedSectors, selectedOrgTypes, selectedExperience])

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

  const handleOrgTypeChange = (orgType: string, checked: boolean) => {
    if (checked) {
      setSelectedOrgTypes([...selectedOrgTypes, orgType])
    } else {
      setSelectedOrgTypes(selectedOrgTypes.filter((ot) => ot !== orgType))
    }
  }

  const handleExperienceChange = (experience: string, checked: boolean) => {
    if (checked) {
      setSelectedExperience([...selectedExperience, experience])
    } else {
      setSelectedExperience(selectedExperience.filter((e) => e !== experience))
    }
  }

  const clearAllFilters = () => {
    setSelectedAssetClasses([])
    setSelectedStrategies([])
    setSelectedSectors([])
    setSelectedOrgTypes([])
    setSelectedExperience([])
  }

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "assetClass":
        handleAssetClassChange(value, false)
        break
      case "strategy":
        handleStrategyChange(value, false)
        break
      case "sector":
        handleSectorChange(value, false)
        break
      case "orgType":
        handleOrgTypeChange(value, false)
        break
      case "experience":
        handleExperienceChange(value, false)
        break
    }
  }

  const totalFilters =
    selectedAssetClasses.length +
    selectedStrategies.length +
    (showSectors ? selectedSectors.length : 0) +
    (showOrganizationTypes ? selectedOrgTypes.length : 0) +
    (showExperience ? selectedExperience.length : 0)

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Asset Classes & Strategies
              {selectedAssetClasses.length + selectedStrategies.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {selectedAssetClasses.length + selectedStrategies.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="font-medium">Asset Classes & Strategies</div>
              <ScrollArea className="h-60">
                <div className="space-y-4">
                  {assetClassKeys.map((assetClass) => (
                    <div key={assetClass}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={`asset-${assetClass}`}
                          checked={selectedAssetClasses.includes(assetClass)}
                          onCheckedChange={(checked) => handleAssetClassChange(assetClass, checked as boolean)}
                        />
                        <label
                          htmlFor={`asset-${assetClass}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {assetClass}
                        </label>
                      </div>
                      <div className="space-y-2 ml-6">
                        {ASSET_CLASSES[assetClass].map((strategy) => (
                          <div key={strategy} className="flex items-center space-x-2">
                            <Checkbox
                              id={`strategy-${strategy}`}
                              checked={selectedStrategies.includes(strategy)}
                              onCheckedChange={(checked) => handleStrategyChange(strategy, checked as boolean)}
                            />
                            <label
                              htmlFor={`strategy-${strategy}`}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-600"
                            >
                              {strategy}
                            </label>
                          </div>
                        ))}
                      </div>
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
                    {SECTORS.map((sector) => (
                      <div key={sector} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sector-${sector}`}
                          checked={selectedSectors.includes(sector)}
                          onCheckedChange={(checked) => handleSectorChange(sector, checked as boolean)}
                        />
                        <label
                          htmlFor={`sector-${sector}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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

        {showOrganizationTypes && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Organization Type
                {selectedOrgTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    {selectedOrgTypes.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="font-medium">Organization Types</div>
                <div className="space-y-2">
                  {ORGANIZATION_TYPES[userType].map((orgType) => (
                    <div key={orgType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`org-${orgType}`}
                        checked={selectedOrgTypes.includes(orgType)}
                        onCheckedChange={(checked) => handleOrgTypeChange(orgType, checked as boolean)}
                      />
                      <label
                        htmlFor={`org-${orgType}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {orgType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {showExperience && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Experience
                {selectedExperience.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    {selectedExperience.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60" align="start">
              <div className="space-y-4">
                <div className="font-medium">Experience Level</div>
                <div className="space-y-2">
                  {EXPERIENCE_LEVELS.map((experience) => (
                    <div key={experience} className="flex items-center space-x-2">
                      <Checkbox
                        id={`exp-${experience}`}
                        checked={selectedExperience.includes(experience)}
                        onCheckedChange={(checked) => handleExperienceChange(experience, checked as boolean)}
                      />
                      <label
                        htmlFor={`exp-${experience}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {experience}
                      </label>
                    </div>
                  ))}
                </div>
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
            {showSectors &&
              selectedSectors.map((sector) => (
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
            {showOrganizationTypes &&
              selectedOrgTypes.map((orgType) => (
                <Badge key={orgType} variant="secondary" className="text-xs">
                  {orgType}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => removeFilter("orgType", orgType)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            {showExperience &&
              selectedExperience.map((experience) => (
                <Badge key={experience} variant="secondary" className="text-xs">
                  {experience}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => removeFilter("experience", experience)}
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
