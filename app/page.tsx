"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simple redirect to login page
    router.push("/login")
    setIsLoading(false)
  }, [router])



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
