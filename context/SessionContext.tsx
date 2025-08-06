"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type UserRole = "allocator" | "manager" | "consultant" | "industry-group" | null

interface SessionContextType {
  userRole: UserRole
  userRoles: UserRole[] // Multiple roles for users who have dual roles
  isLoading: boolean
  login: (role: "allocator" | "manager" | "consultant" | "industry-group") => void
  switchRole: (role: UserRole) => void
  logout: () => void
  isAuthenticated: boolean
  user: any
}

// Create context with default values
const SessionContext = createContext<SessionContextType | undefined>(undefined)

// Export the hook for using the context
export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

// Export the provider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Login function
  const login = (role: "allocator" | "manager" | "consultant" | "industry-group") => {
    console.log(`SessionContext: Setting session for role: ${role}`)
    setUserRole(role)

    // Store in localStorage for persistence
    try {
      localStorage.setItem("userRole", role)
      localStorage.setItem("isAuthenticated", "true")
    } catch (e) {
      console.warn("Could not save to localStorage:", e)
    }
  }

  // Switch role function for multi-role users
  const switchRole = (role: UserRole) => {
    if (role && userRoles.includes(role)) {
      setUserRole(role)
      localStorage.setItem("userRole", role)
    }
  }

  // Logout function
  const logout = () => {
    console.log("SessionContext: Logging out")
    setUserRole(null)
    try {
      localStorage.removeItem("userRole")
      localStorage.removeItem("isAuthenticated")
    } catch (e) {
      console.warn("Could not clear localStorage:", e)
    }
  }

  // Provide context value - always authenticated for demo
  const value = {
    userRole,
    userRoles,
    isLoading,
    login,
    switchRole,
    logout,
    isAuthenticated: true, // Always authenticated for demo
    user: { name: "Demo User" },
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
