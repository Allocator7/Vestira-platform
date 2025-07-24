"use client"

import { useState, useEffect } from "react"

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop")

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const mobile = width < 768
      const tablet = width >= 768 && width < 1024

      setIsMobile(mobile)
      setIsTablet(tablet)

      if (mobile) {
        setScreenSize("mobile")
      } else if (tablet) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }

    // Check on mount
    checkDevice()

    // Add event listener
    window.addEventListener("resize", checkDevice)

    // Cleanup
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenSize,
  }
}
