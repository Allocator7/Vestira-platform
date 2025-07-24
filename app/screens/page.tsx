"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ScreensPage() {
  const router = useRouter()

  useEffect(() => {
    // Default redirect to allocator for now, but this shouldn't be hit
    // if users are clicking the specific role buttons
    router.push("/screens/allocator/home")
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
