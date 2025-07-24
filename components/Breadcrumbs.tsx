"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  homeHref?: string
  className?: string
  separator?: React.ReactNode
  maxItems?: number
}

export function Breadcrumbs({
  items = [],
  homeHref = "/",
  className,
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
  maxItems = 4,
}: BreadcrumbsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // If no items, don't show breadcrumbs at all
  if (!items || items.length === 0) {
    return null
  }

  // Handle truncation if there are too many items
  const displayItems =
    items.length > maxItems
      ? [...items.slice(0, 1), { label: "...", href: "" }, ...items.slice(items.length - (maxItems - 2))]
      : items

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center space-x-2">
        {/* Home icon */}
        <li>
          <Link
            href={homeHref}
            className={cn("flex items-center transition-all duration-200 text-gray-500 hover:text-electric-blue")}
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {displayItems.map((item, index) => (
          <li key={`${item.href}-${index}`} className="flex items-center">
            <span className="mx-2 text-gray-400" aria-hidden="true">
              {separator}
            </span>

            {item.href && item.label !== "..." ? (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center transition-all duration-200",
                  index === displayItems.length - 1 ? "text-gray-700 font-medium" : "text-gray-500",
                  "hover:text-electric-blue hover:underline",
                )}
                aria-current={index === displayItems.length - 1 ? "page" : undefined}
              >
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
