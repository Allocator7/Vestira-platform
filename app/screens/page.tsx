"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ScreensPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has a stored role and redirect accordingly
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem("currentUserRole") || localStorage.getItem("userRole")
      if (userRole) {
        router.push(`/screens/${userRole}/home`)
      } else {
        // Fallback to login if no role is stored
        router.push("/login")
      }
    } else {
      // Fallback to login if localStorage is not available
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-deep-brand mb-4">Redirecting...</h1>
        <p className="text-base-gray">Taking you to your dashboard</p>
      </div>
    </div>
  )
}
