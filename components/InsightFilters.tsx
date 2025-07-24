"use client"
import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

import { AllFocusAreas, AssetClasses } from "@/lib/taxonomy"

interface InsightFiltersProps {
  onFiltersChange: (filters: { assetClasses: string[]; strategies: string[] }) => void
}

export function InsightFilters({ onFiltersChange }: InsightFiltersProps) {
  const [selectedAssetClasses, setSelectedAssetClasses] = useState<string[]>([])
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])

  const assetClasses = AssetClasses.map((assetClass) => ({ id: assetClass, name: assetClass }))

  const strategies = AllFocusAreas.map((strategy) => ({ id: strategy, name: strategy }))

  const handleAssetClassChange = (assetClassId: string) => {
    const newSelection = selectedAssetClasses.includes(assetClassId)
      ? selectedAssetClasses.filter((id) => id !== assetClassId)
      : [...selectedAssetClasses, assetClassId]

    setSelectedAssetClasses(newSelection)
    onFiltersChange({ assetClasses: newSelection, strategies: selectedStrategies })
  }

  const handleStrategyChange = (strategyId: string) => {
    const newSelection = selectedStrategies.includes(strategyId)
      ? selectedStrategies.filter((id) => id !== strategyId)
      : [...selectedStrategies, strategyId]

    setSelectedStrategies(newSelection)
    onFiltersChange({ assetClasses: selectedAssetClasses, strategies: newSelection })
  }

  const clearAllFilters = () => {
    setSelectedAssetClasses([])
    setSelectedStrategies([])
    onFiltersChange({ assetClasses: [], strategies: [] })
  }

  const removeAssetClass = (assetClassId: string) => {
    const newSelection = selectedAssetClasses.filter((id) => id !== assetClassId)
    setSelectedAssetClasses(newSelection)
    onFiltersChange({ assetClasses: newSelection, strategies: selectedStrategies })
  }

  const removeStrategy = (strategyId: string) => {
    const newSelection = selectedStrategies.filter((id) => id !== strategyId)
    setSelectedStrategies(newSelection)
    onFiltersChange({ assetClasses: selectedAssetClasses, strategies: newSelection })
  }

  const totalFilters = selectedAssetClasses.length + selectedStrategies.length

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter size={16} />
              Asset Classes
              {selectedAssetClasses.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {selectedAssetClasses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="p-2 space-y-2">
              {assetClasses.map((assetClass) => (
                <div key={assetClass.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`asset-${assetClass.id}`}
                    checked={selectedAssetClasses.includes(assetClass.id)}
                    onCheckedChange={() => handleAssetClassChange(assetClass.id)}
                  />
                  <label
                    htmlFor={`asset-${assetClass.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {assetClass.name}
                  </label>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter size={16} />
              Strategies
              {selectedStrategies.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {selectedStrategies.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="p-2 space-y-2">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`strategy-${strategy.id}`}
                    checked={selectedStrategies.includes(strategy.id)}
                    onCheckedChange={() => handleStrategyChange(strategy.id)}
                  />
                  <label
                    htmlFor={`strategy-${strategy.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {strategy.name}
                  </label>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {totalFilters > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
            Clear All ({totalFilters})
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {totalFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAssetClasses.map((assetClassId) => {
            const assetClass = assetClasses.find((ac) => ac.id === assetClassId)
            return (
              <Badge key={assetClassId} variant="secondary" className="flex items-center gap-1">
                {assetClass?.name}
                <button
                  onClick={() => removeAssetClass(assetClassId)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            )
          })}
          {selectedStrategies.map((strategyId) => {
            const strategy = strategies.find((s) => s.id === strategyId)
            return (
              <Badge key={strategyId} variant="outline" className="flex items-center gap-1">
                {strategy?.name}
                <button
                  onClick={() => removeStrategy(strategyId)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
