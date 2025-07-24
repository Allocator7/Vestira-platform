"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  debounceMs?: number
  className?: string
  showClearButton?: boolean
  showKeyboardShortcut?: boolean
  autoFocus?: boolean
}

export function SearchInput({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  debounceMs = 300,
  className,
  showClearButton = true,
  showKeyboardShortcut = true,
  autoFocus = false,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch && searchValue !== value) {
        onSearch(searchValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchValue, debounceMs, onSearch, value])

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (newValue: string) => {
    setSearchValue(newValue)
    onChange?.(newValue)
  }

  const handleClear = () => {
    setSearchValue("")
    onChange?.("")
    onSearch?.("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClear()
    }
  }

  return (
    <div className={cn("relative group", className)}>
      <Search
        className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200",
          isFocused ? "text-primary" : "text-gray-400",
        )}
      />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className={cn(
          "pl-10 transition-all duration-200",
          showClearButton && searchValue && "pr-20",
          !showClearButton && showKeyboardShortcut && "pr-16",
          isFocused && "ring-2 ring-primary/20 border-primary/50",
          "focus-visible:ring-2 focus-visible:ring-primary/20",
        )}
      />

      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        {showClearButton && searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}

        {showKeyboardShortcut && !searchValue && !isFocused && (
          <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        )}
      </div>
    </div>
  )
}
