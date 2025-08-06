"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

type UserRole = "allocator" | "manager" | "consultant" | "industry-group" | "admin" | null

type FirmType = "manager" | "allocator" | "consultant" | "industry-group"
type ManagerSubType =
  | "private-equity"
  | "venture-capital"
  | "hedge-fund"
  | "traditional-asset-management"
  | "hybrid-other"
type AllocatorSubType =
  | "insurance"
  | "corporation"
  | "corporate-pension"
  | "public-pension"
  | "family-office-hnw"
  | "other"
type ConsultantSubType = "consultant" | "gatekeeper" | "ocio" | "other"
type IndustryGroupSubType =
  | "trade-association"
  | "regulatory-body"
  | "professional-organization"
  | "industry-council"
  | "standards-organization"
  | "other"

interface FirmProfile {
  id: string
  name: string
  type: FirmType
  subType: ManagerSubType | AllocatorSubType | ConsultantSubType | IndustryGroupSubType
  aum?: string
  location: string
  founded: string
  website: string
  description: string
  logo: string
  logoColor: string
  verified: boolean
  adminApproved: boolean
}

interface PersonProfile {
  id: string
  firmId: string
  firstName: string
  lastName: string
  email: string
  title: string
  role: UserRole
  avatar?: string
  verified: boolean
  adminApproved: boolean
  lastActive: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  date: Date
  link?: string
}

interface UnreadCounts {
  allocator: number
  manager: number
  consultant: number
  "industry-group": number // NEW
}

interface AppContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  currentPersonProfile: PersonProfile | null
  setCurrentPersonProfile: (profile: PersonProfile | null) => void
  currentFirmProfile: FirmProfile | null
  setCurrentFirmProfile: (profile: FirmProfile | null) => void
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  clearNotifications: () => void
  unreadCount: number
  unreadMessageCounts: UnreadCounts
  updateUnreadMessageCount: (role: UserRole, count: number) => void
  isNavOpen: boolean
  setIsNavOpen: (isOpen: boolean) => void
  currentDataRoom: string | null
  setCurrentDataRoom: (dataRoom: string | null) => void
  recentlyViewed: string[]
  addToRecentlyViewed: (item: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
}

// Create a default context value to avoid undefined errors
const defaultContextValue: AppContextType = {
  userRole: null,
  setUserRole: () => {},
  currentPersonProfile: null,
  setCurrentPersonProfile: () => {},
  currentFirmProfile: null,
  setCurrentFirmProfile: () => {},
  notifications: [],
  addNotification: () => {},
  markNotificationAsRead: () => {},
  markAllNotificationsAsRead: () => {},
  clearNotifications: () => {},
  unreadCount: 0,
  unreadMessageCounts: { allocator: 0, manager: 0, consultant: 0, "industry-group": 0 },
  updateUnreadMessageCount: () => {},
  isNavOpen: true,
  setIsNavOpen: () => {},
  currentDataRoom: null,
  setCurrentDataRoom: () => {},
  recentlyViewed: [],
  addToRecentlyViewed: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
  clearError: () => {},
}

const AppContext = createContext<AppContextType>(defaultContextValue)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRoleState] = useState<UserRole>(null)
  const [currentPersonProfile, setCurrentPersonProfile] = useState<PersonProfile | null>(null)
  const [currentFirmProfile, setCurrentFirmProfile] = useState<FirmProfile | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadMessageCounts, setUnreadMessageCounts] = useState<UnreadCounts>({
    allocator: 2,
    manager: 2,
    consultant: 1,
    "industry-group": 1, // NEW
  })
  const [isNavOpen, setIsNavOpen] = useState(true)
  const [currentDataRoom, setCurrentDataRoom] = useState<string | null>(null)
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Handle mounting and localStorage access safely
  useEffect(() => {
    setMounted(true)

    // Initialize from localStorage after mounting
    if (typeof window !== "undefined") {
      try {
        const storedRole = localStorage.getItem("userRole")
        const currentUserRole = localStorage.getItem("currentUserRole")

        // Prioritize currentUserRole (set by demo login) over userRole
        const roleToUse = currentUserRole || storedRole

        if (roleToUse && ["allocator", "manager", "consultant", "industry-group"].includes(roleToUse)) {
          setUserRoleState(roleToUse as UserRole)
        }
        // Remove the else clause that was defaulting to "allocator"
      } catch (e) {
        console.error("Failed to access localStorage:", e)
        // Don't default to allocator here either
      }
    }
  }, [])

  // Enhanced setUserRole function
  const setUserRole = (role: UserRole) => {
    console.log(`AppContext: Setting user role to ${role}`)
    setUserRoleState(role)

    if (mounted && typeof window !== "undefined" && role) {
      try {
        localStorage.setItem("userRole", role as string)
        localStorage.setItem("currentUserRole", role as string)
        console.log(`AppContext: Saved role ${role} to localStorage`)
      } catch (e) {
        console.error("Failed to save to localStorage:", e)
      }
    }
  }

  // Update unread message count for a specific role
  const updateUnreadMessageCount = useCallback((role: UserRole, count: number) => {
    if (!role || !["allocator", "manager", "consultant", "industry-group"].includes(role)) return

    setUnreadMessageCounts((prev) => {
      // Only update if the count has actually changed to prevent unnecessary re-renders
      if (prev[role] === count) return prev

      return {
        ...prev,
        [role]: count,
      }
    })
  }, [])

  // Initialize data after mount
  useEffect(() => {
    if (!mounted) return

    // Initialize notifications
    if (notifications.length === 0) {
      setNotifications([
        {
          id: "1",
          title: "New document shared",
          message: "BlackRock has shared a new document with you",
          type: "info",
          read: false,
          date: new Date(Date.now() - 1000 * 60 * 30),
          link: "/screens/allocator/shared-library",
        },
        {
          id: "2",
          title: "Due diligence request",
          message: "Vanguard has requested additional due diligence information",
          type: "warning",
          read: false,
          date: new Date(Date.now() - 1000 * 60 * 60 * 2),
          link: "/screens/allocator/due-diligence-hub",
        },
        {
          id: "3",
          title: "Meeting scheduled",
          message: "Meeting with Wellington Management confirmed for tomorrow at 2pm",
          type: "success",
          read: true,
          date: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
      ])
    }

    // Initialize profiles
    if (!currentPersonProfile) {
      setCurrentPersonProfile({
        id: "person-1",
        firmId: "firm-1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        title: "Investment Director",
        role: userRole || "allocator",
        verified: true,
        adminApproved: true,
        lastActive: new Date().toISOString(),
      })
    }

    if (!currentFirmProfile) {
      setCurrentFirmProfile({
        id: "firm-1",
        name: "Capital Investments LLC",
        type: "allocator",
        subType: "corporate-pension",
        aum: "$2.5B",
        location: "New York, NY",
        founded: "2005",
        website: "https://capitalinvestments.com",
        description: "Leading institutional investor focused on alternative investments",
        logo: "/generic-company-logo.png",
        logoColor: "#3B0A45",
        verified: true,
        adminApproved: true,
      })
    }
  }, [mounted])

  const addNotification = (notification: Omit<Notification, "id" | "date" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const addToRecentlyViewed = (item: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => i !== item)
      return [item, ...filtered].slice(0, 5)
    })
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentPersonProfile,
        setCurrentPersonProfile,
        currentFirmProfile,
        setCurrentFirmProfile,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        unreadCount,
        unreadMessageCounts,
        updateUnreadMessageCount,
        isNavOpen,
        setIsNavOpen,
        currentDataRoom,
        setCurrentDataRoom,
        recentlyViewed,
        addToRecentlyViewed,
        isLoading,
        setIsLoading,
        error,
        setError,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    // Return a fallback context instead of throwing
    console.warn("useApp called outside of AppProvider, returning fallback")
    return {
      userRole: null,
      setUserRole: () => console.warn("setUserRole called outside of AppProvider"),
      currentPersonProfile: null,
      setCurrentPersonProfile: () => console.warn("setCurrentPersonProfile called outside of AppProvider"),
      currentFirmProfile: null,
      setCurrentFirmProfile: () => console.warn("setCurrentFirmProfile called outside of AppProvider"),
      notifications: [],
      addNotification: () => console.warn("addNotification called outside of AppProvider"),
      markNotificationAsRead: () => console.warn("markNotificationAsRead called outside of AppProvider"),
      markAllNotificationsAsRead: () => console.warn("markAllNotificationsAsRead called outside of AppProvider"),
      clearNotifications: () => console.warn("clearNotifications called outside of AppProvider"),
      unreadCount: 0,
      unreadMessageCounts: { allocator: 0, manager: 0, consultant: 0, "industry-group": 0 },
      updateUnreadMessageCount: () => console.warn("updateUnreadMessageCount called outside of AppProvider"),
      isNavOpen: false,
      setIsNavOpen: () => console.warn("setIsNavOpen called outside of AppProvider"),
      currentDataRoom: null,
      setCurrentDataRoom: () => console.warn("setCurrentDataRoom called outside of AppProvider"),
      recentlyViewed: [],
      addToRecentlyViewed: () => console.warn("addToRecentlyViewed called outside of AppProvider"),
      isLoading: false,
      setIsLoading: () => console.warn("setIsLoading called outside of AppProvider"),
      error: null,
      setError: () => console.warn("setError called outside of AppProvider"),
      clearError: () => console.warn("clearError called outside of AppProvider"),
    }
  }
  return context
}

// Export types for use in other components
export type {
  UserRole,
  FirmType,
  ManagerSubType,
  AllocatorSubType,
  ConsultantSubType,
  IndustryGroupSubType,
  FirmProfile,
  PersonProfile,
}
