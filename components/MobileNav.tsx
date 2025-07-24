"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, Users, FileText, Settings, HelpCircle, Mail, FolderOpen } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"

interface MobileNavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  badge?: number
  onClick?: () => void
}

const MobileNavItem = ({ href, icon, label, isActive, badge, onClick }: MobileNavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100",
      )}
      onClick={onClick}
    >
      <span className={cn(isActive ? "text-white" : "text-gray-500")}>{icon}</span>
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-electric-blue text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  )
}

export function MobileNav() {
  const { userRole } = useApp()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname?.startsWith(href))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-deep-brand flex items-center justify-center">
                <span className="text-electric-blue font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-semibold text-deep-brand">vestira</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {userRole === "allocator" && (
              <>
                <MobileNavItem
                  href="/screens/allocator/home"
                  icon={<Home className="h-5 w-5" />}
                  label="Dashboard"
                  isActive={isActive("/screens/allocator/home")}
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/screens/allocator/managers"
                  icon={<Users className="h-5 w-5" />}
                  label="Managers"
                  isActive={isActive("/screens/allocator/managers")}
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/screens/allocator/data-rooms"
                  icon={<FolderOpen className="h-5 w-5" />}
                  label="Data Rooms"
                  isActive={isActive("/screens/allocator/data-rooms")}
                  badge={3}
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/screens/allocator/due-diligence-hub"
                  icon={<FileText className="h-5 w-5" />}
                  label="Due Diligence"
                  isActive={isActive("/screens/allocator/due-diligence-hub")}
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/screens/allocator/inbox"
                  icon={<Mail className="h-5 w-5" />}
                  label="Inbox"
                  isActive={isActive("/screens/allocator/inbox")}
                  badge={5}
                  onClick={() => setOpen(false)}
                />
              </>
            )}

            {userRole === "manager" && (
              <>
                <MobileNavItem
                  href="/screens/manager/home"
                  icon={<Home className="h-5 w-5" />}
                  label="Dashboard"
                  isActive={isActive("/screens/manager/home")}
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/screens/manager/clients"
                  icon={<Users className="h-5 w-5" />}
                  label="Clients"
                  isActive={isActive("/screens/manager/clients")}
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/screens/manager/data-rooms"
                  icon={<FolderOpen className="h-5 w-5" />}
                  label="Data Rooms"
                  isActive={isActive("/screens/manager/data-rooms")}
                  badge={2}
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/screens/manager/due-diligence-hub"
                  icon={<FileText className="h-5 w-5" />}
                  label="Due Diligence"
                  isActive={isActive("/screens/manager/due-diligence-hub")}
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/screens/manager/inbox"
                  icon={<Mail className="h-5 w-5" />}
                  label="Inbox"
                  isActive={isActive("/screens/manager/inbox")}
                  badge={3}
                  onClick={() => setOpen(false)}
                />
              </>
            )}

            <MobileNavItem
              href={`/screens/${userRole}/account-settings`}
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              isActive={isActive(`/screens/${userRole}/account-settings`)}
              onClick={() => setOpen(false)}
            />
            <MobileNavItem
              href={`/screens/${userRole}/help-support`}
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help & Support"
              isActive={isActive(`/screens/${userRole}/help-support`)}
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
