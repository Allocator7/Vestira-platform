"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title: string
  message?: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-600",
    progress: "bg-green-600",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-600",
    progress: "bg-red-600",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "text-yellow-600",
    progress: "bg-yellow-600",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-600",
    progress: "bg-blue-600",
  },
}

export function NotificationToast({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose,
  action,
  persistent = false,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  const Icon = toastIcons[type]
  const styles = toastStyles[type]

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (duration > 0 && !persistent) {
      // Progress bar animation
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100)
          if (newProgress <= 0) {
            clearInterval(progressTimer)
            handleClose()
            return 0
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(progressTimer)
    }
  }, [duration, persistent])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const handleMouseEnter = () => {
    if (!persistent) {
      setProgress(100) // Pause progress on hover
    }
  }

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 transform max-w-sm",
        styles.container,
        isVisible && !isExiting ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95",
      )}
      onMouseEnter={handleMouseEnter}
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {/* Progress bar */}
      {!persistent && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
          <div
            className={cn("h-full transition-all duration-100 ease-linear", styles.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", styles.icon)} />

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{title}</h4>
        {message && <p className="text-sm mt-1 opacity-90">{message}</p>}

        {action && (
          <Button
            variant="ghost"
            size="sm"
            onClick={action.onClick}
            className="mt-2 h-auto p-0 text-xs hover:bg-black/10 font-medium"
          >
            {action.label}
          </Button>
        )}
      </div>

      <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-black/10 flex-shrink-0">
        <X className="h-4 w-4" />
        <span className="sr-only">Close notification</span>
      </Button>
    </div>
  )
}
