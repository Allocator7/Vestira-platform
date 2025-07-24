"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export interface FilterOption {
  label: string
  value: string
}

interface FiltersButtonProps {
  options: FilterOption[]
  initialSelected?: string[]
  onChange?: (selected: string[]) => void
  className?: string
  buttonLabel?: string
}

export default function FiltersButton({
  options,
  initialSelected = [],
  onChange,
  className,
  buttonLabel = "Filters",
}: FiltersButtonProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected)

  function toggle(value: string) {
    const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    setSelected(next)
    onChange?.(next)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className ? className : "gap-2"}>
          <Filter className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="font-semibold">{buttonLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            checked={selected.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            className="capitalize"
          >
            {opt.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
