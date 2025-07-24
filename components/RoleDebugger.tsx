"use client"

import { useApp } from "@/context/AppContext"
import { useSession } from "@/context/SessionContext"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function RoleDebugger() {
  const { userRole: appRole } = useApp()
  const { user: sessionUser } = useSession()
  const pathname = usePathname()
  const [localStorageRole, setLocalStorageRole] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalStorageRole(localStorage.getItem("userRole"))
      setCurrentUserRole(localStorage.getItem("currentUserRole"))
    }
  }, [])

  // Only show in development or when there's a role mismatch
  const shouldShow =
    process.env.NODE_ENV === "development" || (appRole !== "consultant" && pathname?.includes("/consultant/"))

  if (!shouldShow) return null

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-4 text-sm max-w-sm z-50">
      <h4 className="font-bold text-red-800 mb-2">Role Debug Info</h4>
      <div className="space-y-1 text-red-700">
        <div>
          <strong>Current Path:</strong> {pathname}
        </div>
        <div>
          <strong>App Context Role:</strong> {appRole || "null"}
        </div>
        <div>
          <strong>Session User:</strong> {sessionUser?.role || "null"}
        </div>
        <div>
          <strong>localStorage.userRole:</strong> {localStorageRole || "null"}
        </div>
        <div>
          <strong>localStorage.currentUserRole:</strong> {currentUserRole || "null"}
        </div>
        <div className="mt-2 text-xs">
          {pathname?.includes("/consultant/") && appRole !== "consultant" && (
            <span className="text-red-600 font-bold">⚠️ MISMATCH: On consultant path but role is {appRole}</span>
          )}
        </div>
      </div>
    </div>
  )
}
