"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppHeader } from "@/components/AppHeader"
import { VestiraSidebar } from "@/components/vestira-sidebar"
import { MobileNav } from "@/components/MobileNav"
import { useApp } from "@/context/AppContext"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isNavOpen } = useApp()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Scroll to top when route changes
    const mainElement = document.querySelector("main")
    if (mainElement) {
      mainElement.scrollTop = 0
    }
    // Also scroll window to top as fallback
    window.scrollTo(0, 0)
  }, [pathname])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-canvas-bg">
      {/* Sidebar for desktop */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          isNavOpen ? "w-64" : "w-16"
        } border-r border-gray-200 bg-white`}
      >
        <VestiraSidebar />
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-canvas-bg">{children}</main>
      </div>
    </div>
  )
}
