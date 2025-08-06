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
    // Return a fallback context instead of throwing
    console.warn("useSession called outside of SessionProvider, returning fallback")
    return {
      userRole: null,
      userRoles: [],
      isLoading: false,
      login: () => console.warn("Login called outside of SessionProvider"),
      switchRole: () => console.warn("SwitchRole called outside of SessionProvider"),
      logout: () => console.warn("Logout called outside of SessionProvider"),
      isAuthenticated: false,
      user: null,
    }
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

    // Set up multi-role users for demo
    let roles: UserRole[] = [role]
    
    // Demo multi-role users
    if (role === "allocator") {
      // Some allocators might also be managers
      if (Math.random() > 0.7) { // 30% chance
        roles = ["allocator", "manager"]
      }
    } else if (role === "manager") {
      // Some managers might also be consultants
      if (Math.random() > 0.8) { // 20% chance
        roles = ["manager", "consultant"]
      }
    } else if (role === "consultant") {
      // Some consultants might also be industry group members
      if (Math.random() > 0.9) { // 10% chance
        roles = ["consultant", "industry-group"]
      }
    }
    
    setUserRoles(roles)

    // Store in localStorage for persistence
    try {
      localStorage.setItem("userRole", role)
      localStorage.setItem("userRoles", JSON.stringify(roles))
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
