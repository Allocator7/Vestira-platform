"use client"

import { useApp } from "@/context/AppContext"
import { Badge } from "@/components/ui/badge"

export function RoleIndicator() {
  const { userRole } = useApp()

  if (!userRole) return null

  const roleColors = {
    allocator: "bg-blue-100 text-blue-800",
    manager: "bg-green-100 text-green-800",
    consultant: "bg-purple-100 text-purple-800",
  }

  return (
    <Badge className={`${roleColors[userRole]} border-0`}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</Badge>
  )
}
