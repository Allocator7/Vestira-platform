"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AccessibilityContextType {
  isHighContrast: boolean
  isReducedMotion: boolean
  fontSize: "normal" | "large" | "larger"
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  setFontSize: (size: "normal" | "large" | "larger") => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal")

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Check for user preferences
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      setIsReducedMotion(prefersReducedMotion)

      // Load saved preferences
      const savedHighContrast = localStorage.getItem("accessibility-high-contrast") === "true"
      const savedFontSize = (localStorage.getItem("accessibility-font-size") as "normal" | "large" | "larger") || "normal"

      setIsHighContrast(savedHighContrast)
      setFontSize(savedFontSize)
    } catch (error) {
      console.warn("Error initializing accessibility preferences:", error)
    }
  }, [])

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    try {
      // Apply accessibility classes to document
      const root = document.documentElement

      if (isHighContrast) {
        root.classList.add("high-contrast")
      } else {
        root.classList.remove("high-contrast")
      }

      if (isReducedMotion) {
        root.classList.add("reduce-motion")
      } else {
        root.classList.remove("reduce-motion")
      }

      root.classList.remove("font-normal", "font-large", "font-larger")
      root.classList.add(`font-${fontSize}`)

      // Save preferences
      localStorage.setItem("accessibility-high-contrast", isHighContrast.toString())
      localStorage.setItem("accessibility-font-size", fontSize)
    } catch (error) {
      console.warn("Error applying accessibility preferences:", error)
    }
  }, [isHighContrast, isReducedMotion, fontSize])

  const toggleHighContrast = () => setIsHighContrast(!isHighContrast)
  const toggleReducedMotion = () => setIsReducedMotion(!isReducedMotion)

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        isReducedMotion,
        fontSize,
        toggleHighContrast,
        toggleReducedMotion,
        setFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    // Return a fallback context instead of throwing
    console.warn("useAccessibility called outside of AccessibilityProvider, returning fallback")
    return {
      isHighContrast: false,
      isReducedMotion: false,
      fontSize: "normal" as const,
      toggleHighContrast: () => console.warn("toggleHighContrast called outside of AccessibilityProvider"),
      toggleReducedMotion: () => console.warn("toggleReducedMotion called outside of AccessibilityProvider"),
      setFontSize: () => console.warn("setFontSize called outside of AccessibilityProvider"),
    }
  }
  return context
}
