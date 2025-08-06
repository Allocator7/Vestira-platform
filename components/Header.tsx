"use client"

import { useSession } from "../context/SessionContext"
import { RoleToggle } from "./RoleToggle"
import { Button } from "./ui/button"
import { LogOut, User } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { userRole, logout } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-deep-brand flex items-center justify-center text-white font-bold text-lg shadow-vestira">
              V
            </div>
            <span className="text-xl font-bold text-deep-brand">Vestira</span>
          </Link>
        </div>

        {/* Role Toggle for Multi-Role Users */}
        <div className="flex items-center gap-4">
          <RoleToggle />
          
          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">
                {userRole === "allocator" && "Allocator"}
                {userRole === "manager" && "Manager"}
                {userRole === "consultant" && "Consultant"}
                {userRole === "industry-group" && "Industry Group"}
              </span>
            </Button>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}