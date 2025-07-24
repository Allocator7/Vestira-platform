"use client"

import { useState } from "react"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FilterOption {
  id: string
  label: string
  group: string
}

interface FilterControlsProps {
  options: FilterOption[]
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
  enableSavedFilters?: boolean
  storageKey?: string
  clearFilters?: () => void
}

export function FilterControls({
  options,
  selectedFilters,
  onFilterChange,
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  enableSavedFilters = false,
  storageKey = "filters",
  clearFilters,
}: FilterControlsProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((f) => f !== filterId)
      : [...selectedFilters, filterId]
    onFilterChange(newFilters)
  }

  const handleClearAll = () => {
    onFilterChange([])
    onSearchChange("")
    if (clearFilters) {
      clearFilters()
    }
  }

  // Group options by group
  const groupedOptions = options.reduce(
    (acc, option) => {
      if (!acc[option.group]) {
        acc[option.group] = []
      }
      acc[option.group].push(option)
      return acc
    },
    {} as Record<string, FilterOption[]>,
  )

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative">
          <DropdownMenu open={showFilterDropdown} onOpenChange={setShowFilterDropdown}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {selectedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {selectedFilters.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-64 overflow-y-auto">
              {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group} className="p-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">{group}</div>
                  {groupOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        handleFilterToggle(option.id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(option.id)}
                        onChange={() => handleFilterToggle(option.id)}
                        className="rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm">{option.label}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {(selectedFilters.length > 0 || searchQuery) && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        )}

        {/* Active Filters */}
        {selectedFilters.map((filterId) => {
          const option = options.find((opt) => opt.id === filterId)
          return option ? (
            <Badge key={filterId} variant="secondary" className="gap-1">
              {option.label}
              <button onClick={() => handleFilterToggle(filterId)} className="ml-1 hover:bg-gray-300 rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null
        })}
      </div>
    </div>
  )
}
