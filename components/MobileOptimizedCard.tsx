"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useElementInteraction } from "@/components/InteractionProvider"

interface MobileOptimizedCardProps {
  id: string
  title?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  interactive?: boolean
}

export function MobileOptimizedCard({
  id,
  title,
  children,
  className,
  onClick,
  interactive = false,
}: MobileOptimizedCardProps) {
  const { isHovered, setHovered, transitionClass } = useElementInteraction(id)

  return (
    <Card
      className={cn(
        "bg-white border border-gray-200 shadow-vestira transition-all duration-300",
        transitionClass,
        interactive && "hover:shadow-vestira-lg hover:border-electric-blue/30 active:scale-[0.98]",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-deep-brand">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(title ? "pt-0" : "pt-6")}>{children}</CardContent>
    </Card>
  )
}
