"use client"

import { useState } from "react"
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SortOption {
  value: string
  label: string
  direction?: "asc" | "desc"
}

interface SortDropdownProps {
  options: SortOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showDirection?: boolean
  onDirectionChange?: (direction: "asc" | "desc") => void
  currentDirection?: "asc" | "desc"
  className?: string
  disabled?: boolean
}

export function SortDropdown({
  options,
  value,
  onChange,
  placeholder = "Sort by...",
  showDirection = true,
  onDirectionChange,
  currentDirection = "asc",
  className,
  disabled = false,
}: SortDropdownProps) {
  const [isApplying, setIsApplying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const selectedOption = options.find((option) => option.value === value)

  const handleSortChange = async (newValue: string) => {
    if (newValue === value || disabled) return

    setIsApplying(true)

    // Simulate async sorting
    await new Promise((resolve) => setTimeout(resolve, 300))

    onChange(newValue)

    // Show notification
    const option = options.find((opt) => opt.value === newValue)
    if ((window as any).addNotification) {
      ;(window as any).addNotification({
        title: "Sort Applied",
        message: `Results sorted by ${option?.label || newValue}.`,
        type: "success",
      })
    }

    setIsApplying(false)
  }

  const handleDirectionChange = async () => {
    if (!onDirectionChange || disabled || isApplying) return

    setIsApplying(true)

    // Simulate async sorting
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newDirection = currentDirection === "asc" ? "desc" : "asc"
    onDirectionChange(newDirection)

    // Show notification
    if ((window as any).addNotification) {
      ;(window as any).addNotification({
        title: "Sort Direction Changed",
        message: `Sort order changed to ${newDirection === "asc" ? "ascending" : "descending"}.`,
        type: "success",
      })
    }

    setIsApplying(false)
  }

  const getSortIcon = () => {
    if (isApplying) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }

    if (!showDirection) {
      return <ChevronDown className="h-4 w-4" />
    }

    switch (currentDirection) {
      case "asc":
        return <ArrowUp className="h-4 w-4" />
      case "desc":
        return <ArrowDown className="h-4 w-4" />
      default:
        return <ArrowUpDown className="h-4 w-4" />
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "gap-2 text-deepBrand border-gray-300",
              isHovered && !disabled && "border-electric-blue text-electric-blue",
              isFocused && "ring-2 ring-electric-blue ring-opacity-50",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            disabled={disabled || isApplying}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <span>{selectedOption?.label || placeholder}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {options.map((option) => {
            const isSelected = value === option.value
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={cn(
                  "cursor-pointer flex items-center justify-between",
                  isSelected ? "bg-gray-100 font-medium text-deepBrand" : "text-deepBrand",
                )}
                disabled={disabled || isApplying}
              >
                <span>{option.label}</span>
                {isSelected && <div className="h-2 w-2 bg-primary rounded-full" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {showDirection && onDirectionChange && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleDirectionChange}
          disabled={disabled || isApplying}
          className={cn(
            "h-10 w-10",
            isHovered && !disabled && "border-electric-blue text-electric-blue",
            isFocused && "ring-2 ring-electric-blue ring-opacity-50",
          )}
          title={`Sort ${currentDirection === "asc" ? "descending" : "ascending"}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {getSortIcon()}
        </Button>
      )}
    </div>
  )
}
