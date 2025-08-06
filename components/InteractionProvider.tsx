"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface InteractionState {
  // Loading states
  globalLoading: boolean
  loadingStates: Record<string, boolean>

  // Focus management
  focusedElement: string | null

  // Hover states
  hoveredElements: Set<string>

  // Animation preferences
  reduceMotion: boolean

  // Touch/click feedback
  activeElements: Set<string>
}

interface InteractionContextType extends InteractionState {
  // Loading management
  setGlobalLoading: (loading: boolean) => void
  setElementLoading: (elementId: string, loading: boolean) => void
  isElementLoading: (elementId: string) => boolean

  // Focus management
  setFocusedElement: (elementId: string | null) => void
  isFocused: (elementId: string) => boolean

  // Hover management
  setElementHovered: (elementId: string, hovered: boolean) => void
  isElementHovered: (elementId: string) => boolean

  // Active state management
  setElementActive: (elementId: string, active: boolean) => void
  isElementActive: (elementId: string) => boolean

  // Animation preferences
  setReduceMotion: (reduce: boolean) => void

  // Utility functions
  resetAllStates: () => void
  getTransitionClass: (elementId?: string) => string
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined)

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InteractionState>({
    globalLoading: false,
    loadingStates: {},
    focusedElement: null,
    hoveredElements: new Set(),
    reduceMotion: false,
    activeElements: new Set(),
  })

  // Loading management
  const setGlobalLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, globalLoading: loading }))
  }, [])

  const setElementLoading = useCallback((elementId: string, loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loadingStates: {
        ...prev.loadingStates,
        [elementId]: loading,
      },
    }))
  }, [])

  const isElementLoading = useCallback(
    (elementId: string) => {
      return state.loadingStates[elementId] || false
    },
    [state.loadingStates],
  )

  // Focus management
  const setFocusedElement = useCallback((elementId: string | null) => {
    setState((prev) => ({ ...prev, focusedElement: elementId }))
  }, [])

  const isFocused = useCallback(
    (elementId: string) => {
      return state.focusedElement === elementId
    },
    [state.focusedElement],
  )

  // Hover management
  const setElementHovered = useCallback((elementId: string, hovered: boolean) => {
    setState((prev) => {
      const newHoveredElements = new Set(prev.hoveredElements)
      if (hovered) {
        newHoveredElements.add(elementId)
      } else {
        newHoveredElements.delete(elementId)
      }
      return { ...prev, hoveredElements: newHoveredElements }
    })
  }, [])

  const isElementHovered = useCallback(
    (elementId: string) => {
      return state.hoveredElements.has(elementId)
    },
    [state.hoveredElements],
  )

  // Active state management
  const setElementActive = useCallback((elementId: string, active: boolean) => {
    setState((prev) => {
      const newActiveElements = new Set(prev.activeElements)
      if (active) {
        newActiveElements.add(elementId)
      } else {
        newActiveElements.delete(elementId)
      }
      return { ...prev, activeElements: newActiveElements }
    })
  }, [])

  const isElementActive = useCallback(
    (elementId: string) => {
      return state.activeElements.has(elementId)
    },
    [state.activeElements],
  )

  // Animation preferences
  const setReduceMotion = useCallback((reduce: boolean) => {
    setState((prev) => ({ ...prev, reduceMotion: reduce }))
  }, [])

  // Utility functions
  const resetAllStates = useCallback(() => {
    setState({
      globalLoading: false,
      loadingStates: {},
      focusedElement: null,
      hoveredElements: new Set(),
      reduceMotion: state.reduceMotion, // Preserve user preference
      activeElements: new Set(),
    })
  }, [state.reduceMotion])

  const getTransitionClass = useCallback(
    (elementId?: string) => {
      const baseClass = "transition-all duration-200"
      if (state.reduceMotion) {
        return "transition-none"
      }
      return baseClass
    },
    [state.reduceMotion],
  )

  const contextValue: InteractionContextType = {
    ...state,
    setGlobalLoading,
    setElementLoading,
    isElementLoading,
    setFocusedElement,
    isFocused,
    setElementHovered,
    isElementHovered,
    setElementActive,
    isElementActive,
    setReduceMotion,
    resetAllStates,
    getTransitionClass,
  }

  return <InteractionContext.Provider value={contextValue}>{children}</InteractionContext.Provider>
}

export function useInteraction() {
  const context = useContext(InteractionContext)
  if (!context) {
    // Return a fallback context instead of throwing
    console.warn("useInteraction called outside of InteractionProvider, returning fallback")
    return {
      globalLoading: false,
      loadingStates: {},
      focusedElement: null,
      hoveredElements: new Set(),
      reduceMotion: false,
      activeElements: new Set(),
      setGlobalLoading: () => console.warn("setGlobalLoading called outside of InteractionProvider"),
      setElementLoading: () => console.warn("setElementLoading called outside of InteractionProvider"),
      isElementLoading: () => false,
      setFocusedElement: () => console.warn("setFocusedElement called outside of InteractionProvider"),
      isFocused: () => false,
      setElementHovered: () => console.warn("setElementHovered called outside of InteractionProvider"),
      isElementHovered: () => false,
      setElementActive: () => console.warn("setElementActive called outside of InteractionProvider"),
      isElementActive: () => false,
      setReduceMotion: () => console.warn("setReduceMotion called outside of InteractionProvider"),
      resetAllStates: () => console.warn("resetAllStates called outside of InteractionProvider"),
      getTransitionClass: () => "transition-all duration-200",
    }
  }
  return context
}

// Hook for managing element interactions
export function useElementInteraction(elementId: string) {
  const interaction = useInteraction()

  return {
    isLoading: interaction.isElementLoading(elementId),
    setLoading: (loading: boolean) => interaction.setElementLoading(elementId, loading),
    isFocused: interaction.isFocused(elementId),
    setFocused: (focused: boolean) => interaction.setFocusedElement(focused ? elementId : null),
    isHovered: interaction.isElementHovered(elementId),
    setHovered: (hovered: boolean) => interaction.setElementHovered(elementId, hovered),
    isActive: interaction.isElementActive(elementId),
    setActive: (active: boolean) => interaction.setElementActive(elementId, active),
    transitionClass: interaction.getTransitionClass(elementId),
  }
}
