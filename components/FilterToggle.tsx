"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, Loader2 } from "lucide-react"

interface FilterOption {
  value: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface FilterToggleProps {
  options: FilterOption[]
  selectedValue: string
  onChange: (value: string) => void
  size?: "sm" | "md" | "lg"
  variant?: "default" | "pills" | "buttons"
  className?: string
  showCheckmark?: boolean
  allowDeselect?: boolean
  isLoading?: boolean
}

export function FilterToggle({
  options,
  selectedValue,
  onChange,
  size = "md",
  variant = "default",
  className,
  showCheckmark = true,
  allowDeselect = false,
  isLoading = false,
}: FilterToggleProps) {
  const [isApplying, setIsApplying] = useState(false)
  const [hoveredValue, setHoveredValue] = useState<string | null>(null)
  const [focusedValue, setFocusedValue] = useState<string | null>(null)

  const handleSelect = async (value: string) => {
    if (isApplying || isLoading) return

    // If clicking the already selected value and deselect is allowed
    if (value === selectedValue && allowDeselect) {
      setIsApplying(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      onChange("")
      setIsApplying(false)
      return
    }

    // If selecting a new value
    if (value !== selectedValue) {
      setIsApplying(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      onChange(value)
      setIsApplying(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs py-1 px-2"
      case "lg":
        return "text-base py-2 px-4"
      default:
        return "text-sm py-1.5 px-3"
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "pills":
        return "rounded-full"
      case "buttons":
        return "rounded-md border"
      default:
        return "rounded-md"
    }
  }

  if (variant === "buttons") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {options.map((option) => {
          const isSelected = option.value === selectedValue
          const isHovered = option.value === hoveredValue
          const isFocused = option.value === focusedValue

          return (
            <Button
              key={option.value}
              variant={isSelected ? "default" : "outline"}
              size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
              className={cn(
                "transition-all duration-200",
                isHovered && !isSelected && "border-electric-blue text-electric-blue",
                isFocused && "ring-2 ring-electric-blue ring-opacity-50",
                isApplying && isSelected && "opacity-80",
              )}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHoveredValue(option.value)}
              onMouseLeave={() => setHoveredValue(null)}
              onFocus={() => setFocusedValue(option.value)}
              onBlur={() => setFocusedValue(null)}
              disabled={isLoading || isApplying}
            >
              {isApplying && isSelected ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                option.icon && <span className="mr-1.5">{option.icon}</span>
              )}
              {option.label}
              {option.count !== undefined && (
                <span className="ml-1.5 text-xs bg-gray-200 text-gray-700 rounded-full px-1.5 py-0.5">
                  {option.count}
                </span>
              )}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue
        const isHovered = option.value === hoveredValue
        const isFocused = option.value === focusedValue

        return (
          <button
            key={option.value}
            type="button"
            className={cn(
              "relative transition-all duration-200",
              getSizeClasses(),
              getVariantClasses(),
              isSelected ? "bg-electric-blue text-white font-medium" : "bg-white text-gray-700 hover:bg-gray-100",
              isHovered && !isSelected && "bg-gray-100 text-electric-blue",
              isFocused && "ring-2 ring-electric-blue ring-opacity-50 outline-none",
              isApplying && isSelected && "opacity-80",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            onClick={() => handleSelect(option.value)}
            onMouseEnter={() => setHoveredValue(option.value)}
            onMouseLeave={() => setHoveredValue(null)}
            onFocus={() => setFocusedValue(option.value)}
            onBlur={() => setFocusedValue(null)}
            disabled={isLoading || isApplying}
            aria-pressed={isSelected}
          >
            <div className="flex items-center">
              {isApplying && isSelected ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : (
                option.icon && <span className="mr-1.5">{option.icon}</span>
              )}
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span className="ml-1.5 text-xs bg-gray-200 text-gray-700 rounded-full px-1.5 py-0.5">
                  {option.count}
                </span>
              )}
              {showCheckmark && isSelected && !isApplying && <Check className="h-3 w-3 ml-1.5" />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
