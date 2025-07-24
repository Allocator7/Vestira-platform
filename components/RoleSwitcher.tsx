"use client"

import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export function RoleSwitcher() {
  const { userRole, setUserRole } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  const handleRoleSwitch = (newRole: "allocator" | "manager" | "consultant") => {
    if (newRole === userRole) return

    setUserRole(newRole)

    // Navigate to the equivalent page in the other role
    if (pathname?.includes("/screens/")) {
      const currentPath = pathname.split("/screens/")[1]
      const currentSection = currentPath.split("/")[1]

      // Map of equivalent pages between roles
      const equivalentPages: Record<string, string> = {
        home: "home",
        managers: "clients",
        clients: "managers",
        "manager-search": "allocator-search",
        "allocator-search": "manager-search",
        "due-diligence-hub": "due-diligence-hub",
        "data-rooms": "data-rooms",
        insights: "insights",
        inbox: "inbox",
        "account-settings": "account-settings",
        "help-support": "help-support",
      }

      const targetSection = equivalentPages[currentSection] || "home"
      router.push(`/screens/${newRole}/${targetSection}`)
    } else {
      router.push(`/screens/${newRole}/home`)
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "allocator":
        return "Allocator View"
      case "manager":
        return "Manager View"
      case "consultant":
        return "Consultant View"
      default:
        return "Select View"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hidden md:flex gap-1">
          <span>{getRoleLabel(userRole || "")}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleRoleSwitch("allocator")}
          className={userRole === "allocator" ? "bg-blue-50 text-blue-600" : ""}
        >
          Allocator View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRoleSwitch("manager")}
          className={userRole === "manager" ? "bg-blue-50 text-blue-600" : ""}
        >
          Manager View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRoleSwitch("consultant")}
          className={userRole === "consultant" ? "bg-blue-50 text-blue-600" : ""}
        >
          Consultant View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
