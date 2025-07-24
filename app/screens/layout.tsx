"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppHeader } from "@/components/AppHeader"
import { VestiraSidebar } from "@/components/vestira-sidebar"
import { RoleDebugger } from "@/components/RoleDebugger"

export default function ScreensLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top when route changes
    const mainElement = document.querySelector("main")
    if (mainElement) {
      mainElement.scrollTop = 0
    }
    // Also scroll window to top as fallback
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <VestiraSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
      <RoleDebugger />
    </div>
  )
}
