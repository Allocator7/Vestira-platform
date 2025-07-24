"use client"

import { useState, useCallback } from "react"
import { NotificationToast, type ToastProps } from "@/components/NotificationToast"
import { createPortal } from "react-dom"
import { useEffect } from "react"

interface NotificationContextType {
  addNotification: (notification: Omit<ToastProps, "id" | "onClose">) => void
}

export function NotificationContainer() {
  const [notifications, setNotifications] = useState<ToastProps[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addNotification = useCallback((notification: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(2)
    const newNotification: ToastProps = {
      ...notification,
      id,
      onClose: removeNotification,
    }
    setNotifications((prev) => [...prev, newNotification])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  // Expose addNotification globally
  useEffect(() => {
    ;(window as any).addNotification = addNotification
  }, [addNotification])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} {...notification} />
      ))}
    </div>,
    document.body,
  )
}
