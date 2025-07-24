"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Search, X, ArrowLeft, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { VestiraSidebar } from "@/components/vestira-sidebar"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/AppContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import type { BreadcrumbItem } from "@/components/Breadcrumbs"

export function AppHeader() {
  const appContext = useApp()
  const { isNavOpen, setIsNavOpen, userRole, setUserRole } = appContext || {}
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Mock notification count
  const notificationCount = 3

  // Search suggestions based on user role
  const getSearchSuggestions = () => {
    const baseSuggestions = [
      "BlackRock",
      "Vanguard",
      "Wellington Management",
      "State Street",
      "Fidelity",
      "PIMCO",
      "T. Rowe Price",
    ]

    const roleSuggestions = {
      allocator: [
        "Private Equity Managers",
        "Hedge Fund Strategies",
        "Real Estate Funds",
        "Infrastructure Investments",
        "ESG Funds",
      ],
      manager: ["Pension Funds", "Insurance Companies", "Endowments", "Family Offices", "Sovereign Wealth Funds"],
      consultant: [
        "Investment Committees",
        "Due Diligence Reports",
        "Manager Research",
        "Asset Allocation",
        "Risk Management",
      ],
      "industry-group": [
        "Member Organizations",
        "Event Attendees",
        "Conference Speakers",
        "Industry Reports",
        "Regulatory Updates",
      ],
    }

    return [...baseSuggestions, ...(roleSuggestions[userRole as keyof typeof roleSuggestions] || [])]
  }

  const filteredSuggestions = getSearchSuggestions()
    .filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5)

  // Close mobile search when route changes
  useEffect(() => {
    setIsSearchOpen(false)
    setIsMobileMenuOpen(false)
    setShowSearchSuggestions(false)
  }, [pathname])

  // Handle escape key for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false)
        setSearchQuery("")
        setShowSearchSuggestions(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isSearchOpen])

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    try {
      localStorage.setItem("lastSearchQuery", query)

      const searchPath =
        userRole === "allocator"
          ? "/screens/allocator/manager-search"
          : userRole === "manager"
            ? "/screens/manager/allocator-search"
            : userRole === "industry-group"
              ? "/screens/industry-group/member-directory"
              : "/screens/consultant/connections"

      const searchUrl = `${searchPath}?q=${encodeURIComponent(query)}`
      await router.push(searchUrl)
      setSearchQuery("")
      setIsSearchOpen(false)
      setShowSearchSuggestions(false)
      console.log("Search executed:", query)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value)
    setShowSearchSuggestions(value.length > 0)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSearchSuggestions(false)
    handleSearch(suggestion)
  }

  const handleRoleSwitch = async (newRole: "allocator" | "manager" | "consultant" | "industry-group") => {
    if (!setUserRole || newRole === userRole) return

    try {
      console.log(`AppHeader: Switching role from ${userRole} to ${newRole}`)

      setUserRole(newRole)

      // Update localStorage
      localStorage.setItem("userRole", newRole)
      localStorage.setItem("currentUserRole", newRole)
      localStorage.setItem("preferredRole", newRole)

      // Navigate to the new role's home page
      const targetPath = `/screens/${newRole}/home`
      console.log(`AppHeader: Navigating to ${targetPath}`)
      await router.push(targetPath)

      console.log(`AppHeader: Role switched to ${newRole}`)
    } catch (error) {
      console.error("Failed to switch role:", error)
    }
  }

  const handleNotificationClick = () => {
    router.push("/screens/general/notification-center")
  }

  const handleHelpSupportClick = () => {
    router.push(`/screens/${userRole || "general"}/help-support`)
  }

  const handleAccountSettingsClick = () => {
    router.push(`/screens/${userRole || "general"}/account-settings`)
  }

  const handleLogoutClick = () => {
    // Clear any stored user data
    localStorage.removeItem("userRole")
    localStorage.removeItem("currentUserRole")
    localStorage.removeItem("preferredRole")
    router.push("/login")
  }

  const getPageTitle = () => {
    if (!pathname) return "Dashboard"

    const segments = pathname.split("/")
    const lastSegment = segments[segments.length - 1]

    const pageTitles: Record<string, string> = {
      home: "Dashboard",
      managers: "My Managers",
      clients: "My Clients",
      "manager-search": "Manager Search",
      "allocator-search": "Allocator Search",
      "due-diligence-hub": "Due Diligence Hub",
      "data-rooms": "Data Rooms",
      insights: "Insights",
      inbox: "Inbox",
      "account-settings": "Account Settings",
      "help-support": "Help & Support",
      "activity-log": "Activity Log",
      "team-management": "Team Management",
      "manager-profile": "Manager Profile",
      "allocator-profile": "Allocator Profile",
      "connection-center": "Connection Center",
      "notification-center": "Notification Center",
      "document-sample": "Document Sample",
      "data-room-profile": "Data Room Profile",
      "document-upload": "Document Upload",
      "document-management": "Document Management",
      "legal-compliance": "Legal & Compliance",
      connections: "Connections",
      search: "Search & Match",
      meetings: "Meetings",
      advisory: "Advisory Services",
      "market-research": "Market Research",
      "market-insights": "Market Insights",
      events: "Events",
      "attendee-management": "Attendee Management",
      "member-directory": "Member Directory",
      communications: "Communications",
      "person-profile": "Personal Profile",
      "edit-profile": "Edit Profile",
    }

    return pageTitles[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ")
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "allocator":
        return "Allocator View"
      case "manager":
        return "Manager View"
      case "consultant":
        return "Consultant View"
      case "industry-group":
        return "Industry Group View"
      default:
        return "Select View"
    }
  }

  const getUserInfo = () => {
    switch (userRole) {
      case "manager":
        return { name: "Jane Manager", role: "Asset Manager", initial: "M" }
      case "allocator":
        return { name: "John Allocator", role: "Allocator", initial: "A" }
      case "consultant":
        return { name: "Alex Consultant", role: "Investment Consultant", initial: "C" }
      case "industry-group":
        return { name: "Sarah Admin", role: "Industry Group Admin", initial: "I" }
      default:
        return { name: "User", role: "User", initial: "U" }
    }
  }

  const userInfo = getUserInfo()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname || !userRole) return []

    const segments = pathname.split("/").filter(Boolean)

    // Only show breadcrumbs for screens routes
    if (!segments.includes("screens") || segments.length <= 2) return []

    const breadcrumbs: BreadcrumbItem[] = []

    // Find the screens index
    const screensIndex = segments.indexOf("screens")
    const roleSegment = segments[screensIndex + 1]
    const pageSegment = segments[screensIndex + 2]

    // Only add breadcrumbs if we have a role and page
    if (!roleSegment || !pageSegment) return []

    // Use the actual current role instead of the URL role
    const currentRole = userRole || roleSegment

    // Add role breadcrumb (links to role home)
    const roleLabel = getRoleLabel(currentRole).replace(" View", "")
    breadcrumbs.push({
      label: roleLabel,
      href: `/screens/${currentRole}/home`,
    })

    // Add current page breadcrumb (only if not home)
    if (pageSegment !== "home") {
      const labelMap: Record<string, string> = {
        "manager-search": "Manager Search",
        "allocator-search": "Allocator Search",
        "due-diligence-hub": "Due Diligence Hub",
        "data-rooms": "Data Rooms",
        "account-settings": "Account Settings",
        "help-support": "Help & Support",
        "activity-log": "Activity Log",
        "team-management": "Team Management",
        "manager-profile": "Manager Profile",
        "allocator-profile": "Allocator Profile",
        "connection-center": "Connection Center",
        "notification-center": "Notification Center",
        "document-sample": "Document Sample",
        "data-room-profile": "Data Room Profile",
        "document-upload": "Document Upload",
        "document-management": "Document Management",
        "legal-compliance": "Legal & Compliance",
        connections: "Connections",
        search: "Search & Match",
        meetings: "Meetings",
        advisory: "Advisory Services",
        managers: "My Managers",
        clients: "My Clients",
        insights: "Insights",
        inbox: "Inbox",
        "market-research": "Market Research",
        "market-insights": "Market Insights",
        events: "Events",
        "attendee-management": "Attendee Management",
        "member-directory": "Member Directory",
        communications: "Communications",
        "person-profile": "Personal Profile",
        "edit-profile": "Edit Profile",
      }

      const pageLabel =
        labelMap[pageSegment] ||
        pageSegment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

      breadcrumbs.push({
        label: pageLabel,
        href: pathname,
      })
    }

    return breadcrumbs
  }

  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-vestira">
      <header className="flex h-20 items-center px-6 md:px-8">
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-white md:hidden">
            <div className="flex items-center gap-4 p-4 border-b border-gray-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="flex-shrink-0 hover:bg-canvas-bg transition-colors duration-300 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-base-gray" />
              </Button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                <Input
                  type="search"
                  placeholder="Search across Vestira..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleSearch(searchQuery)
                    }
                  }}
                  className="pl-10 border-0 bg-canvas-bg focus:bg-white vestira-input"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-base-gray">Start typing to search...</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-canvas-bg transition-colors duration-300 rounded-xl border border-transparent hover:border-gray-200"
              >
                <Menu className="h-6 w-6 text-deep-brand" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-deep-brand flex items-center justify-center">
                    <span className="text-electric-blue font-bold text-lg">V</span>
                  </div>
                  <span className="text-xl font-semibold text-deep-brand">vestira</span>
                </div>
              </div>
              <VestiraSidebar />
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex hover:bg-canvas-bg transition-colors duration-300 rounded-lg"
            onClick={() => setIsNavOpen && setIsNavOpen(!isNavOpen)}
          >
            <Menu className="h-5 w-5 text-deep-brand" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="hidden lg:block ml-4">
            <h1 className="text-xl font-semibold text-deep-brand">{getPageTitle()}</h1>
          </div>
        </div>

        <div className="hidden md:flex mx-6 flex-1 max-w-lg relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-gray" />
          <Input
            type="search"
            placeholder="Search across Vestira..."
            value={searchQuery}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                handleSearch(searchQuery)
              }
            }}
            onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
            className="pl-12 w-full bg-canvas-bg border-2 border-gray-200 focus:bg-white focus:border-electric-blue transition-all duration-300 vestira-input rounded-xl h-12"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setShowSearchSuggestions(false)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-canvas-bg transition-colors duration-300 rounded-lg"
            >
              <X className="h-3 w-3 text-base-gray" />
            </Button>
          )}

          {/* Search Suggestions Dropdown */}
          {showSearchSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-vestira-lg z-50">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-canvas-bg transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-base-gray" />
                    <span className="text-deep-brand">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-canvas-bg transition-colors duration-300 rounded-lg"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-deep-brand" />
            <span className="sr-only">Search</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-canvas-bg transition-colors duration-300 rounded-lg"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5 text-deep-brand" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-canvas-bg transition-colors duration-300"
              onClick={() => handleAccountSettingsClick()}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-deep-brand/10 text-deep-brand font-medium">
                  {userInfo.initial}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-8 py-4 border-t-2 border-gray-100 bg-canvas-bg/30">
        <Breadcrumbs items={generateBreadcrumbs()} homeHref={userRole ? `/screens/${userRole}/home` : "/screens"} />
      </div>
    </div>
  )
}
