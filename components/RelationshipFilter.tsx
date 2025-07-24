"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FilterOption {
  value: string
  label: string
}

interface RelationshipFilterProps {
  onFilterChange: (filter: string) => void
  initialFilter?: string
  userType: "allocator" | "manager"
  filterOptions?: FilterOption[]
}

export function RelationshipFilter({
  onFilterChange,
  initialFilter = "my",
  userType,
  filterOptions,
}: RelationshipFilterProps) {
  const defaultOptions: FilterOption[] = [
    { value: "my", label: userType === "allocator" ? "My Managers" : "My Clients" },
    { value: "following", label: userType === "allocator" ? "Managers I Follow" : "Allocators I Follow" },
    { value: "all", label: userType === "allocator" ? "All Managers" : "All Allocators" },
    { value: "previously", label: "Previously Followed" },
  ]

  const options = filterOptions || defaultOptions

  return (
    <Tabs defaultValue={initialFilter} onValueChange={onFilterChange} className="w-full">
      {/* ⇩ NEW: changed layout from tight grid to flex with gap */}
      <TabsList className="inline-flex h-12 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground gap-2">
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            /* ⇩ NEW: added a bit of horizontal padding for breathing room */
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-deepBrand data-[state=active]:text-white data-[state=active]:shadow-sm text-deepBrand hover:bg-background/80"
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
