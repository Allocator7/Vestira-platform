"use client"

import type React from "react"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useElementInteraction } from "@/components/InteractionProvider"
import { cn } from "@/lib/utils"

interface InteractiveCardProps {
  id: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
  disabled?: boolean
  variant?: "default" | "elevated" | "bordered" | "ghost"
}

export function InteractiveCard({
  id,
  children,
  className,
  onClick,
  href,
  hoverable = true,
  clickable = true,
  loading = false,
  disabled = false,
  variant = "default",
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { isHovered, setHovered, isActive, setActive, transitionClass } = useElementInteraction(id)

  const handleMouseEnter = () => {
    if (!disabled && hoverable) {
      setHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setActive(false)
  }

  const handleMouseDown = () => {
    if (!disabled && clickable) {
      setActive(true)
    }
  }

  const handleMouseUp = () => {
    setActive(false)
  }

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "elevated":
        return "shadow-vestira-lg hover:shadow-vestira-xl border border-gray-200"
      case "bordered":
        return "border-2 border-gray-300 hover:border-electric-blue/50 shadow-vestira"
      case "ghost":
        return "border border-gray-200 shadow-sm hover:bg-gray-50"
      default:
        return "shadow-sm hover:shadow-md border border-gray-200"
    }
  }

  const cardClasses = cn(
    "relative overflow-hidden bg-white" /* Ensure white background */,
    transitionClass,
    getVariantClasses(),
    hoverable && !disabled && "hover:scale-[1.02]",
    clickable && !disabled && "cursor-pointer",
    isActive && "scale-[0.98]",
    disabled && "opacity-50 cursor-not-allowed",
    loading && "pointer-events-none",
    className,
  )

  const CardComponent = href ? "a" : "div"

  return (
    <CardComponent
      ref={cardRef}
      href={href}
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (clickable && !disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <Card className="border-0 shadow-none bg-transparent">
        {loading && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-electric-blue"></div>
          </div>
        )}
        {children}
      </Card>

      {/* Hover overlay with proper contrast */}
      {isHovered && hoverable && !disabled && <div className="absolute inset-0 bg-primary/5 pointer-events-none" />}
    </CardComponent>
  )
}

// Enhanced Card components with consistent interactions
export function InteractiveCardHeader({ children, className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return (
    <CardHeader className={cn("transition-colors duration-200", className)} {...props}>
      {children}
    </CardHeader>
  )
}

export function InteractiveCardContent({ children, className, ...props }: React.ComponentProps<typeof CardContent>) {
  return (
    <CardContent className={cn("transition-colors duration-200", className)} {...props}>
      {children}
    </CardContent>
  )
}

export function InteractiveCardTitle({ children, className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return (
    <CardTitle className={cn("transition-colors duration-200", className)} {...props}>
      {children}
    </CardTitle>
  )
}
