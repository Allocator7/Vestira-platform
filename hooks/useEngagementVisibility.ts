"use client"

import { useApp } from "@/context/AppContext"

export function useEngagementVisibility() {
  const { userRole } = useApp()

  // Only managers can see engagement metrics
  const canViewEngagementMetrics = userRole === "manager"

  return {
    canViewEngagementMetrics,
  }
}
