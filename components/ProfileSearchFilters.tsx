"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Filter, X } from "lucide-react"

interface ProfileSearchFiltersProps {
  onFiltersChange: (filters: {
    assetClasses: string[]
    strategies: string[]
    organizationTypes: string[]
    experience: string[]
  }) => void
  userType: "manager" | "allocator" | "consultant"
}

const assetClasses = [
  "Public Equities",
  "Public Fixed Income",
  "Private Fixed Income",
  "Real Estate",
  "Private Equity & Other Alternatives",
]

const managerStrategies = [
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

const allocatorStrategies = [
  "Asset Allocation",
  "Portfolio Construction",
  "Risk Management",
  "Due Diligence",
  "Manager Selection",
  "Performance Monitoring",
]

const consultantStrategies = [
  "Investment Advisory",
  "Portfolio Analysis",
  "Risk Assessment",
  "Market Research",
  "Strategic Planning",
  "Regulatory Compliance",
]

const organizationTypes = {
  manager: ["Private Equity", "Hedge Fund", "Infrastructure", "Venture Capital", "Credit", "Real Estate"],
  allocator: ["Pension Fund", "Endowment", "Foundation", "Insurance Company", "Sovereign Wealth Fund", "Family Office"],
  consultant: ["Investment Consultant", "Advisory Firm", "Research Provider", "Risk Management", "Compliance Firm"],
}

const experienceLevels = ["0-5 years", "5-10 years", "10-15 years", "15-20 years", "20+ years"]

export function ProfileSearchFilters({ onFiltersChange, userType }: ProfileSearchFiltersProps) {
  const [selectedAssetClasses, setSelectedAssetClasses] = useState<string[]>([])
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [selectedOrgTypes, setSelectedOrgTypes] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])

  const strategies =
    userType === "manager" ? managerStrategies : userType === "allocator" ? allocatorStrategies : consultantStrategies

  const updateFilters = (assetClasses: string[], strategies: string[], orgTypes: string[], experience: string[]) => {
    onFiltersChange({
      assetClasses,
      strategies,
      organizationTypes: orgTypes,
      experience,
    })
  }

  const handleAssetClassChange = (assetClass: string, checked: boolean) => {
    const updated = checked
      ? [...selectedAssetClasses, assetClass]
      : selectedAssetClasses.filter((ac) => ac !== assetClass)
    setSelectedAssetClasses(updated)
    updateFilters(updated, selectedStrategies, selectedOrgTypes, selectedExperience)
  }

  const handleStrategyChange = (strategy: string, checked: boolean) => {
    const updated = checked ? [...selectedStrategies, strategy] : selectedStrategies.filter((s) => s !== strategy)
    setSelectedStrategies(updated)
    updateFilters(selectedAssetClasses, updated, selectedOrgTypes, selectedExperience)
  }

  const handleOrgTypeChange = (orgType: string, checked: boolean) => {
    const updated = checked ? [...selectedOrgTypes, orgType] : selectedOrgTypes.filter((ot) => ot !== orgType)
    setSelectedOrgTypes(updated)
    updateFilters(selectedAssetClasses, selectedStrategies, updated, selectedExperience)
  }

  const handleExperienceChange = (experience: string, checked: boolean) => {
    const updated = checked ? [...selectedExperience, experience] : selectedExperience.filter((e) => e !== experience)
    setSelectedExperience(updated)
    updateFilters(selectedAssetClasses, selectedStrategies, selectedOrgTypes, updated)
  }

  const clearAllFilters = () => {
    setSelectedAssetClasses([])
    setSelectedStrategies([])
    setSelectedOrgTypes([])
    setSelectedExperience([])
    updateFilters([], [], [], [])
  }

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "assetClass":
        handleAssetClassChange(value, false)
        break
      case "strategy":
        handleStrategyChange(value, false)
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
    selectedAssetClasses.length + selectedStrategies.length + selectedOrgTypes.length + selectedExperience.length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Asset Classes
              {selectedAssetClasses.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {selectedAssetClasses.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Asset Classes</h4>
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {assetClasses.map((assetClass) => (
                    <div key={assetClass} className="flex items-center space-x-2">
                      <Checkbox
                        id={assetClass}
                        checked={selectedAssetClasses.includes(assetClass)}
                        onCheckedChange={(checked) => handleAssetClassChange(assetClass, checked as boolean)}
                      />
                      <label htmlFor={assetClass} className="text-sm cursor-pointer">
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
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Strategies
              {selectedStrategies.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {selectedStrategies.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Strategies</h4>
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {strategies.map((strategy) => (
                    <div key={strategy} className="flex items-center space-x-2">
                      <Checkbox
                        id={strategy}
                        checked={selectedStrategies.includes(strategy)}
                        onCheckedChange={(checked) => handleStrategyChange(strategy, checked as boolean)}
                      />
                      <label htmlFor={strategy} className="text-sm cursor-pointer">
                        {strategy}
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
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Organization Type
              {selectedOrgTypes.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {selectedOrgTypes.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Organization Types</h4>
              <div className="space-y-2">
                {organizationTypes[userType].map((orgType) => (
                  <div key={orgType} className="flex items-center space-x-2">
                    <Checkbox
                      id={orgType}
                      checked={selectedOrgTypes.includes(orgType)}
                      onCheckedChange={(checked) => handleOrgTypeChange(orgType, checked as boolean)}
                    />
                    <label htmlFor={orgType} className="text-sm cursor-pointer">
                      {orgType}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Experience
              {selectedExperience.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {selectedExperience.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="start">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Experience Level</h4>
              <div className="space-y-2">
                {experienceLevels.map((experience) => (
                  <div key={experience} className="flex items-center space-x-2">
                    <Checkbox
                      id={experience}
                      checked={selectedExperience.includes(experience)}
                      onCheckedChange={(checked) => handleExperienceChange(experience, checked as boolean)}
                    />
                    <label htmlFor={experience} className="text-sm cursor-pointer">
                      {experience}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {totalFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9 text-red-600 hover:text-red-700">
            Clear All ({totalFilters})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {totalFilters > 0 && (
        <div className="space-y-2">
          <Separator />
          <div className="flex flex-wrap gap-1">
            {selectedAssetClasses.map((assetClass) => (
              <Badge key={assetClass} variant="secondary" className="text-xs">
                {assetClass}
                <button
                  onClick={() => removeFilter("assetClass", assetClass)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
            {selectedStrategies.map((strategy) => (
              <Badge key={strategy} variant="secondary" className="text-xs">
                {strategy}
                <button
                  onClick={() => removeFilter("strategy", strategy)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
            {selectedOrgTypes.map((orgType) => (
              <Badge key={orgType} variant="secondary" className="text-xs">
                {orgType}
                <button
                  onClick={() => removeFilter("orgType", orgType)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
            {selectedExperience.map((experience) => (
              <Badge key={experience} variant="secondary" className="text-xs">
                {experience}
                <button
                  onClick={() => removeFilter("experience", experience)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
