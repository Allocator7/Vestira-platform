"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Building, Briefcase, Globe } from "lucide-react"
import { useSession } from "@/context/SessionContext"

interface RoleToggleProps {
  className?: string
}

export function RoleToggle({ className = "" }: RoleToggleProps) {
  const { userRole, userRoles, switchRole } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  // Only show if user has multiple roles
  if (!userRoles || userRoles.length <= 1) {
    return null
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "allocator":
        return <Building className="h-4 w-4" />
      case "manager":
        return <Users className="h-4 w-4" />
      case "consultant":
        return <Briefcase className="h-4 w-4" />
      case "industry-group":
        return <Globe className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "allocator":
        return "Allocator"
      case "manager":
        return "Manager"
      case "consultant":
        return "Consultant"
      case "industry-group":
        return "Industry Group"
      default:
        return role
    }
  }

  const handleRoleSwitch = (newRole: string) => {
    switchRole(newRole as any)
    setIsOpen(false)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">View as:</span>
      <Select value={userRole || ""} onValueChange={handleRoleSwitch}>
        <SelectTrigger className="w-48">
          <SelectValue>
            <div className="flex items-center gap-2">
              {getRoleIcon(userRole || "")}
              <span>{getRoleLabel(userRole || "")}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {userRoles.map((role) => (
            <SelectItem key={role} value={role}>
              <div className="flex items-center gap-2">
                {getRoleIcon(role)}
                <span>{getRoleLabel(role)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}