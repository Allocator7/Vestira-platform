"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Bell, Search, Home, Users, FileText, MessageSquare, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface MobileNavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  route: string
  badge?: string
  isActive: boolean
  onClick?: () => void
}

function MobileNavItem({ icon: Icon, label, route, badge, isActive, onClick }: MobileNavItemProps) {
  return (
    <Link
      href={route}
      onClick={() => {
        onClick?.()
        // Scroll main content to top
        setTimeout(() => {
          const mainElement = document.querySelector("main")
          if (mainElement) {
            mainElement.scrollTop = 0
          }
          window.scrollTo(0, 0)
        }, 0)
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
        isActive
          ? "bg-electric-blue/10 text-electric-blue shadow-vestira"
          : "text-base-gray hover:bg-gray-100 hover:text-deep-brand active:bg-electric-blue/5",
      )}
    >
      <Icon className={cn("h-5 w-5", isActive && "text-electric-blue")} />
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge
          className={cn(
            "transition-all duration-300 rounded-lg text-xs",
            isActive ? "bg-electric-blue text-white" : "bg-gray-100 text-base-gray",
          )}
          variant={isActive ? "default" : "secondary"}
        >
          {badge}
        </Badge>
      )}
    </Link>
  )
}

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { userRole, unreadCount } = useApp()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Scroll to top when route changes
  useEffect(() => {
    const mainElement = document.querySelector("main")
    if (mainElement) {
      mainElement.scrollTop = 0
    }
    window.scrollTo(0, 0)
  }, [pathname])

  // Mobile navigation items based on user role
  const getMobileNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Dashboard", route: `/screens/${userRole}/home` },
      {
        icon: Users,
        label: userRole === "manager" ? "Clients" : "Managers",
        route: `/screens/${userRole}/${userRole === "manager" ? "clients" : "managers"}`,
      },
      { icon: FileText, label: "Due Diligence", route: `/screens/${userRole}/due-diligence-hub` },
      {
        icon: MessageSquare,
        label: "Inbox",
        route: `/screens/${userRole}/inbox`,
        badge: unreadCount > 0 ? unreadCount.toString() : undefined,
      },
      { icon: BarChart3, label: "Analytics", route: "/screens/general/analytics-dashboard" },
      { icon: Settings, label: "Settings", route: `/screens/${userRole}/account-settings` },
    ]
    return baseItems
  }

  const navItems = getMobileNavItems()

  const getActiveItem = () => {
    return (
      navItems.find(
        (item) =>
          pathname === item.route ||
          pathname?.startsWith(item.route + "/") ||
          (item.label === "Dashboard" && pathname === `/screens/${userRole}`),
      )?.route || ""
    )
  }

  const activeRoute = getActiveItem()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Get page title based on current route
  const getPageTitle = () => {
    const activeItem = navItems.find((item) => item.route === activeRoute)
    if (activeItem) return activeItem.label

    if (pathname?.includes("data-rooms")) return "Data Rooms"
    if (pathname?.includes("team-management")) return "Team"
    if (pathname?.includes("help-support")) return "Support"
    if (pathname?.includes("market-insights")) return "Insights"

    return "Vestira"
  }

  return (
    <div className="flex flex-col h-screen bg-canvas-bg md:hidden">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-vestira">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-deep-brand hover:bg-gray-100 transition-all duration-300 hover:scale-105 rounded-lg"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-white">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-deep-brand flex items-center justify-center">
                          <span className="text-electric-blue font-bold text-lg">V</span>
                        </div>
                        <span className="text-xl font-bold text-deep-brand">vestira</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-base-gray hover:text-deep-brand hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Search */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white border-gray-200 focus:border-electric-blue focus:ring-electric-blue/20"
                      />
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                      <MobileNavItem
                        key={item.route}
                        {...item}
                        isActive={activeRoute === item.route}
                        onClick={() => setIsMenuOpen(false)}
                      />
                    ))}
                  </nav>

                  {/* Mobile User Profile */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-deep-brand/10 flex items-center justify-center text-deep-brand font-medium">
                        {userRole?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-deep-brand truncate">
                          {userRole === "manager"
                            ? "Jane Manager"
                            : userRole === "consultant"
                              ? "Alex Consultant"
                              : "John Allocator"}
                        </p>
                        <p className="text-xs text-base-gray truncate">
                          {userRole === "manager"
                            ? "Asset Manager"
                            : userRole === "consultant"
                              ? "Investment Consultant"
                              : "Allocator"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold text-deep-brand truncate">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-base-gray hover:text-deep-brand hover:bg-gray-100 transition-all duration-300 hover:scale-105 rounded-lg"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-electric-blue text-white text-xs rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-base-gray hover:text-deep-brand hover:bg-gray-100 transition-all duration-300 hover:scale-105 rounded-lg"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Content */}
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-2 py-2 shadow-vestira">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = activeRoute === item.route

            return (
              <Link
                key={item.route}
                href={item.route}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 min-w-0",
                  isActive ? "text-electric-blue" : "text-base-gray hover:text-deep-brand active:text-electric-blue",
                )}
                onClick={() => {
                  setTimeout(() => {
                    const mainElement = document.querySelector("main")
                    if (mainElement) {
                      mainElement.scrollTop = 0
                    }
                    window.scrollTo(0, 0)
                  }, 0)
                }}
              >
                <div className="relative">
                  <Icon className={cn("h-5 w-5", isActive && "text-electric-blue")} />
                  {item.badge && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-electric-blue text-white text-xs rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className={cn("text-xs font-medium truncate max-w-full", isActive && "text-electric-blue")}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
