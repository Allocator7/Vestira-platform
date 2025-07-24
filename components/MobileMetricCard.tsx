"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MobileMetricCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function MobileMetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
}: MobileMetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600 bg-green-50"
      case "negative":
        return "text-red-600 bg-red-50"
      default:
        return "text-base-gray bg-gray-50"
    }
  }

  return (
    <Card
      className={cn(
        "bg-white border border-gray-200 shadow-vestira transition-all duration-300 hover:shadow-vestira-lg",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-base-gray truncate mb-1">{title}</p>
            <p className="text-2xl font-bold text-deep-brand truncate">{value}</p>
            {change && (
              <Badge className={cn("mt-2 text-xs font-medium rounded-lg", getChangeColor())} variant="secondary">
                {change}
              </Badge>
            )}
          </div>
          {Icon && (
            <div className="ml-3 flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-electric-blue/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-electric-blue" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
