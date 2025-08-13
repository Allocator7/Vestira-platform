"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Users,
  FileText,
  MessageSquare,
  Search,
  BarChart3,
  FolderOpen,
  BookOpen,
  LogOut,
  HelpCircle,
  UserCheck,
  Network,
  ClipboardCheck,
  Settings,
  Shield,
  Calendar,
  Building,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type UserRole = "manager" | "allocator" | "consultant" | "industry-group"

interface VestiraSidebarProps {
  userRole?: UserRole
  userName?: string
  userInitials?: string
  userTitle?: string
  className?: string
}

export function VestiraSidebar({
  userRole: propUserRole,
  userName = "John Doe",
  userInitials = "JD",
  userTitle,
  className,
}: VestiraSidebarProps) {
  const { userRole: contextUserRole, setUserRole, refreshRoleFromStorage, isNavOpen, unreadMessageCounts } = useApp()
  const userRole = propUserRole || contextUserRole || null

  // Refresh role from storage when component mounts
  useEffect(() => {
    if (!userRole && typeof window !== 'undefined') {
      refreshRoleFromStorage()
    }
  }, [userRole, refreshRoleFromStorage])

  const title =
    userTitle ||
    (userRole === "manager"
      ? "Asset Manager"
      : userRole === "consultant"
        ? "Consultant"
        : userRole === "industry-group"
          ? "Industry Group Admin"
          : "Allocator")

  const router = useRouter()
  const pathname = usePathname()

  // Current unread count for this user role
  const currentUnreadCount = unreadMessageCounts[userRole as keyof typeof unreadMessageCounts] || 0

  /* ---------- Navigation definitions ---------- */

  const managerNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/screens/manager/home" },
    { id: "clients", label: "My Clients", icon: Users, route: "/screens/manager/clients" },
    { id: "allocator-search", label: "Allocator Search", icon: Search, route: "/screens/manager/allocator-search" },
    { id: "data-rooms", label: "Data Rooms", icon: FolderOpen, route: "/screens/manager/data-rooms" },
    {
      id: "document-management",
      label: "Document Management",
      icon: FileText,
      route: "/screens/general/document-management",
    },
    {
      id: "due-diligence",
      label: "Due Diligence Hub",
      icon: ClipboardCheck,
      route: "/screens/manager/due-diligence-hub",
    },
    { id: "insights", label: "Market Insights", icon: BookOpen, route: "/screens/manager/insights" },
    { id: "events", label: "Events Center", icon: Calendar, route: "/screens/manager/events" },
    { id: "connections", label: "Connection Center", icon: Network, route: "/screens/general/connection-center" },
    {
      id: "inbox",
      label: "Inbox",
      icon: MessageSquare,
      badge: currentUnreadCount > 0 ? currentUnreadCount.toString() : undefined,
      route: "/screens/manager/inbox",
    },
    { id: "audit", label: "Activity Log", icon: BarChart3, route: "/screens/manager/activity-log" },
    { id: "team", label: "Team Management", icon: Users, route: "/screens/manager/team-management" },
  ]

  const allocatorNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/screens/allocator/home" },
    { id: "managers", label: "My Managers", icon: Users, route: "/screens/allocator/managers" },
    { id: "manager-search", label: "Manager Search", icon: Search, route: "/screens/allocator/manager-search" },
    { id: "data-rooms", label: "Data Rooms", icon: FolderOpen, route: "/screens/allocator/data-rooms" },
    {
      id: "document-management",
      label: "Document Management",
      icon: FileText,
      route: "/screens/general/document-management",
    },
    {
      id: "due-diligence",
      label: "Due Diligence Hub",
      icon: ClipboardCheck,
      route: "/screens/allocator/due-diligence-hub",
    },
    { id: "insights", label: "Market Insights", icon: BookOpen, route: "/screens/allocator/insights" },
    { id: "events", label: "Events Center", icon: Calendar, route: "/screens/allocator/events" },
    { id: "connections", label: "Connection Center", icon: Network, route: "/screens/general/connection-center" },
    {
      id: "inbox",
      label: "Inbox",
      icon: MessageSquare,
      badge: currentUnreadCount > 0 ? currentUnreadCount.toString() : undefined,
      route: "/screens/allocator/inbox",
    },
    { id: "activity-log", label: "Activity Log", icon: BarChart3, route: "/screens/allocator/activity-log" },
    { id: "team-management", label: "Team Management", icon: Users, route: "/screens/allocator/team-management" },
  ]

  /* --- Consultant nav (Research Hub removed) --- */
  const consultantNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/screens/consultant/home" },
    { id: "clients", label: "My Clients", icon: Users, route: "/screens/consultant/clients" },
    { id: "client-search", label: "Client Search", icon: Search, route: "/screens/consultant/client-search" },
    { id: "data-rooms", label: "Data Rooms", icon: FolderOpen, route: "/screens/consultant/data-rooms" },
    {
      id: "document-management",
      label: "Document Management",
      icon: FileText,
      route: "/screens/general/document-management",
    },
    {
      id: "due-diligence",
      label: "Due Diligence Hub",
      icon: ClipboardCheck,
      route: "/screens/consultant/due-diligence-hub",
    },
    { id: "insights", label: "Market Insights", icon: BookOpen, route: "/screens/consultant/market-insights" },
    {
      id: "research-hub-legacy-removed", // placeholder id to maintain unique keys if needed
      label: "",
      icon: () => null,
      route: "",
    }, // *** intentionally empty—keeps array alignment if other parts rely on length
    { id: "events", label: "Events Center", icon: Calendar, route: "/screens/consultant/events" },
    { id: "connections", label: "Connection Center", icon: Network, route: "/screens/general/connection-center" },
    {
      id: "inbox",
      label: "Inbox",
      icon: MessageSquare,
      badge: currentUnreadCount > 0 ? currentUnreadCount.toString() : undefined,
      route: "/screens/consultant/inbox",
    },
    { id: "activity-log", label: "Activity Log", icon: BarChart3, route: "/screens/consultant/activity-log" },
    { id: "team-management", label: "Team Management", icon: Users, route: "/screens/consultant/team-management" },
    { id: "advisory", label: "Advisory Services", icon: UserCheck, route: "/screens/consultant/advisory" },
    { id: "manager-approval", label: "Manager Approval", icon: Shield, route: "/screens/consultant/manager-approval" },
  ].filter((item) => item.label) // Remove the empty placeholder from rendering

  const industryGroupNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/screens/industry-group/home" },
    { id: "events", label: "Event Management", icon: Calendar, route: "/screens/industry-group/events" },
    {
      id: "attendee-management",
      label: "Attendee Management",
      icon: Users,
      route: "/screens/industry-group/attendee-management",
    },
    {
      id: "member-directory",
      label: "Member Directory",
      icon: Building,
      route: "/screens/industry-group/member-directory",
    },
    { id: "communications", label: "Communications", icon: Mail, route: "/screens/industry-group/communications" },
    { id: "team-management", label: "Team Management", icon: Users, route: "/screens/industry-group/team-management" },
    {
      id: "connection-center",
      label: "Connection Center",
      icon: Network,
      route: "/screens/industry-group/connection-center",
    },
    { id: "market-insights", label: "Market Insights", icon: BookOpen, route: "/screens/industry-group/market-insights" },
    {
      id: "inbox",
      label: "Inbox",
      icon: MessageSquare,
      badge: currentUnreadCount > 0 ? currentUnreadCount.toString() : undefined,
      route: "/screens/industry-group/inbox",
    },
    {
      id: "activity-log",
      label: "Activity Log",
      icon: BarChart3,
      route: "/screens/industry-group/activity-log",
    },
  ]

  const supportNavItems = [
    { id: "help-support", label: "Help & Support", icon: HelpCircle, route: `/screens/general/help-support` },
    { id: "security-settings", label: "Security Settings", icon: Shield, route: "/screens/general/security-settings" },
  ]

  const getNavItems = () => {
    switch (userRole) {
      case "manager":
        return managerNavItems
      case "consultant":
        return consultantNavItems
      case "industry-group":
        return industryGroupNavItems
      case "allocator":
        return allocatorNavItems
      default:
        // If no role is set, return empty array to prevent rendering
        return []
    }
  }

  const navItems = getNavItems()

  /* ---------- Active item helpers ---------- */

  const getActiveItem = () => {
    if (!pathname) return ""

    const mainItem = navItems.find(
      (item) =>
        pathname === item.route ||
        pathname.startsWith(item.route + "/") ||
        (item.id === "dashboard" && pathname === `/screens/${userRole}`),
    )
    if (mainItem) return mainItem.id

    const supportItem = supportNavItems.find((item) => pathname === item.route || pathname.startsWith(item.route + "/"))
    if (supportItem) return supportItem.id

    return ""
  }

  const [activeItem, setActiveItem] = useState(getActiveItem())

  useEffect(() => {
    setActiveItem(getActiveItem())
  }, [pathname, userRole])

  /* ---------- Navigation handlers ---------- */

  const handleNavigation = (route: string, id: string) => {
    setActiveItem(id)
    router.push(route)
  }

  const handleLogout = () => router.push("/login")
  const handleAccountSettings = () => router.push(`/screens/${userRole}/account-settings`)
  const handleProfileClick = () => router.push(`/screens/${userRole}/account-settings`)

  /* ---------- Rendering ---------- */

  if (!isNavOpen) {
    return (
      <div className="hidden md:flex flex-col w-16 h-screen bg-white border-r border-gray-200 py-4">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-deep-brand flex items-center justify-center">
              <span className="text-electric-blue font-bold text-lg">V</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <nav className="flex flex-col items-center gap-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className={cn(
                  "relative",
                  activeItem === item.id ? "bg-primary/10 text-primary" : "text-gray-500 hover:text-gray-900",
                )}
                onClick={() => handleNavigation(item.route, item.id)}
              >
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    variant="default"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>
        <div className="mt-auto flex flex-col items-center gap-2">
          {supportNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                "text-gray-500 hover:text-gray-700",
                activeItem === item.id ? "bg-primary/10 text-primary" : "",
              )}
              onClick={() => handleNavigation(item.route, item.id)}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          ))}
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "hidden md:flex flex-col w-64 h-screen bg-white border-r-2 border-gray-200 shadow-vestira",
        className,
      )}
    >
      <div className="p-6 border-b-2 border-gray-200">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-deep-brand flex items-center justify-center shadow-vestira">
            <span className="text-electric-blue font-bold text-xl">V</span>
          </div>
          <span className="text-2xl font-bold text-deep-brand">vestira</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 mx-2 whitespace-nowrap",
                activeItem === item.id
                  ? "bg-electric-blue/10 text-electric-blue border-2 border-electric-blue/20 shadow-vestira"
                  : "text-base-gray hover:bg-canvas-bg hover:text-deep-brand border-2 border-transparent hover:border-gray-200",
              )}
              onClick={() => {
                setActiveItem(item.id)
                window.scrollTo(0, 0)
              }}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">{item.label}</span>
              {item.badge && (
                <Badge className="ml-auto" variant="default">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <Separator className="my-6 mx-2" />

        <nav className="space-y-1">
          {supportNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 mx-2 whitespace-nowrap",
                activeItem === item.id
                  ? "bg-electric-blue/10 text-electric-blue border-2 border-electric-blue/20 shadow-vestira"
                  : "text-base-gray hover:bg-canvas-bg hover:text-deep-brand border-2 border-transparent hover:border-gray-200",
              )}
              onClick={() => {
                setActiveItem(item.id)
                window.scrollTo(0, 0)
              }}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div
          className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
          onClick={handleProfileClick}
        >
          <div className="h-10 w-10 rounded-full bg-deepBrand/10 flex items-center justify-center text-deepBrand font-medium">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{title}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            onClick={handleAccountSettings}
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
