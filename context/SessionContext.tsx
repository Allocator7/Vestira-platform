"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type UserRole = "allocator" | "manager" | "consultant" | "industry-group" | null

interface SessionContextType {
  userRole: UserRole
  isLoading: boolean
  login: (role: "allocator" | "manager" | "consultant" | "industry-group") => void
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
  const [isLoading, setIsLoading] = useState(false)

  // Login function
  const login = (role: "allocator" | "manager" | "consultant" | "industry-group") => {
    console.log(`SessionContext: Setting session for role: ${role}`)
    setUserRole(role)

    // Store in localStorage for persistence
    localStorage.setItem("userRole", role)
    localStorage.setItem("isAuthenticated", "true")
  }

  // Logout function
  const logout = () => {
    console.log("SessionContext: Logging out")
    setUserRole(null)
    localStorage.removeItem("userRole")
    localStorage.removeItem("isAuthenticated")
  }

  // Provide context value - always authenticated for demo
  const value = {
    userRole,
    isLoading,
    login,
    logout,
    isAuthenticated: true, // Always authenticated for demo
    user: { name: "Demo User" },
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
