"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          return
        }

        // Check for stored user role
        const storedRole = localStorage.getItem("userRole")
        const currentUserRole = localStorage.getItem("currentUserRole")
        const roleToUse = currentUserRole || storedRole

        // Wait a bit to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 100))

        if (roleToUse && ["allocator", "manager", "consultant", "industry-group"].includes(roleToUse)) {
          router.push(`/screens/${roleToUse}/home`)
        } else {
          router.push("/login")
        }
      } catch (err) {
        console.error("Error initializing app:", err)
        setError(true)
        // Fallback to login page
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [router])

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-bg to-white">
        <div className="text-center">
          <div className="h-12 w-12 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-xl shadow-vestira mx-auto mb-4">
            !
          </div>
          <p className="text-base-gray mb-4">Something went wrong</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-deep-brand text-white px-4 py-2 rounded hover:bg-deep-brand/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Loading screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-bg to-white">
      <div className="text-center">
        <div className="h-12 w-12 rounded-xl bg-deep-brand flex items-center justify-center text-white font-bold text-xl shadow-vestira mx-auto mb-4 animate-pulse">
          V
        </div>
        <p className="text-base-gray">Loading Vestira...</p>
      </div>
    </div>
  )
}
