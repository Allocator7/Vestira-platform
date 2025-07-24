"use client"

import { useState, useEffect } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "warning"
  duration?: number
}

let toastCount = 0
const toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

function addToast(toast: Omit<Toast, "id">) {
  const id = (++toastCount).toString()
  const newToast: Toast = {
    id,
    duration: 4000,
    variant: "default",
    ...toast,
  }

  toasts.push(newToast)
  listeners.forEach((listener) => listener([...toasts]))

  // Auto remove toast after duration
  setTimeout(() => {
    removeToast(id)
  }, newToast.duration)

  return id
}

function removeToast(id: string) {
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts.splice(index, 1)
    listeners.forEach((listener) => listener([...toasts]))
  }
}

export const toast = {
  success: (description: string, title?: string) =>
    addToast({ title: title || "Success", description, variant: "success" }),
  error: (description: string, title?: string) =>
    addToast({ title: title || "Error", description, variant: "destructive" }),
  info: (description: string, title?: string) => addToast({ title: title || "Info", description, variant: "default" }),
  warning: (description: string, title?: string) =>
    addToast({ title: title || "Warning", description, variant: "warning" }),
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([...toasts])

  useEffect(() => {
    const listener = (updatedToasts: Toast[]) => {
      setCurrentToasts([...updatedToasts])
    }

    listeners.push(listener)

    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return {
    toast,
    toasts: currentToasts,
    dismiss: removeToast,
  }
}
