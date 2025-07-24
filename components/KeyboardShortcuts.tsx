"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

export function KeyboardShortcuts() {
  const router = useRouter()
  const { userRole, setIsNavOpen, isNavOpen } = useApp()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Cmd/Ctrl + K for search
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Cmd/Ctrl + B to toggle sidebar
      if ((event.metaKey || event.ctrlKey) && event.key === "b") {
        event.preventDefault()
        setIsNavOpen(!isNavOpen)
      }

      // Number keys for quick navigation
      if (event.key >= "1" && event.key <= "9" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        const navItems =
          userRole === "manager"
            ? [
                "/screens/manager/home",
                "/screens/manager/clients",
                "/screens/manager/allocator-search",
                "/screens/manager/due-diligence-hub",
                "/screens/manager/data-rooms",
                "/screens/manager/insights",
                "/screens/manager/inbox",
                "/screens/manager/team-management",
                "/screens/manager/activity-log",
              ]
            : [
                "/screens/allocator/home",
                "/screens/allocator/managers",
                "/screens/allocator/manager-search",
                "/screens/allocator/due-diligence-hub",
                "/screens/allocator/data-rooms",
                "/screens/allocator/insights",
                "/screens/allocator/inbox",
                "/screens/general/connection-center",
              ]

        const index = Number.parseInt(event.key) - 1
        if (navItems[index]) {
          router.push(navItems[index])
        }
      }

      // Escape to close modals/dropdowns
      if (event.key === "Escape") {
        const openDropdowns = document.querySelectorAll('[data-state="open"]')
        openDropdowns.forEach((dropdown) => {
          const closeButton = dropdown.querySelector('[aria-label="Close"]')
          if (closeButton instanceof HTMLElement) {
            closeButton.click()
          }
        })
      }

      // G + H for home
      if (event.key === "g" && !event.metaKey && !event.ctrlKey) {
        const nextKey = new Promise<string>((resolve) => {
          const handler = (e: KeyboardEvent) => {
            document.removeEventListener("keydown", handler)
            resolve(e.key)
          }
          document.addEventListener("keydown", handler)
          setTimeout(() => {
            document.removeEventListener("keydown", handler)
            resolve("")
          }, 1000)
        })

        nextKey.then((key) => {
          if (key === "h") {
            router.push(`/screens/${userRole}/home`)
          } else if (key === "i") {
            router.push(`/screens/${userRole}/inbox`)
          } else if (key === "s") {
            router.push(`/screens/${userRole}/account-settings`)
          }
        })
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [router, userRole, setIsNavOpen, isNavOpen])

  return null
}
