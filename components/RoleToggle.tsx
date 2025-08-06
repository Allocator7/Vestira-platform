"use client"

import { useSession } from "../context/SessionContext"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Users } from "lucide-react"

export function RoleToggle() {
  const { userRole, userRoles, switchRole } = useSession()

  // Only show if user has multiple roles
  if (userRoles.length <= 1) {
    return null
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
      <Users className="h-4 w-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">Role:</span>
      <div className="flex gap-1">
        {userRoles.map((role) => (
          <Button
            key={role}
            variant={userRole === role ? "default" : "outline"}
            size="sm"
            onClick={() => switchRole(role)}
            className="text-xs"
          >
            {role === "allocator" && "Allocator"}
            {role === "manager" && "Manager"}
            {role === "consultant" && "Consultant"}
            {role === "industry-group" && "Industry Group"}
          </Button>
        ))}
      </div>
    </div>
  )
}