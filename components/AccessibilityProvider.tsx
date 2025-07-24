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
    // Check for user preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setIsReducedMotion(prefersReducedMotion)

    // Load saved preferences
    const savedHighContrast = localStorage.getItem("accessibility-high-contrast") === "true"
    const savedFontSize = (localStorage.getItem("accessibility-font-size") as "normal" | "large" | "larger") || "normal"

    setIsHighContrast(savedHighContrast)
    setFontSize(savedFontSize)
  }, [])

  useEffect(() => {
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
    throw new Error("useAccessibility must be used within AccessibilityProvider")
  }
  return context
}
