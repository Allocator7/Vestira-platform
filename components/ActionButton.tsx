"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ActionButtonProps {
  children: React.ReactNode
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void
  loadingText?: string
  successText?: string
  errorText?: string
  successToast?: {
    title: string
    description?: string
  }
  errorToast?: {
    title: string
    description?: string
  }
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
  autoReset?: boolean
  resetDelay?: number
  icon?: React.ReactNode
  loadingIcon?: React.ReactNode
  successIcon?: React.ReactNode
  errorIcon?: React.ReactNode
  [key: string]: any
}

export function ActionButton({
  children,
  onClick,
  loadingText = "Loading...",
  successText,
  errorText,
  successToast,
  errorToast,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  autoReset = true,
  resetDelay = 2000,
  icon,
  loadingIcon = <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
  successIcon,
  errorIcon,
  ...props
}: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick || disabled || isLoading) return

    try {
      setIsLoading(true)
      setStatus("loading")
      await onClick(event) // Pass the event to the onClick handler
      setStatus("success")

      if (successToast) {
        toast({
          title: successToast.title,
          description: successToast.description,
          variant: "success",
        })
      }

      if (autoReset) {
        setTimeout(() => {
          setStatus("idle")
        }, resetDelay)
      }
    } catch (error) {
      console.error("Action button error:", error)
      setStatus("error")

      if (errorToast) {
        toast({
          title: errorToast.title,
          description: errorToast.description || "Please try again.",
          variant: "destructive",
        })
      }

      if (autoReset) {
        setTimeout(() => {
          setStatus("idle")
        }, resetDelay)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            {loadingIcon}
            {loadingText}
          </>
        )
      case "success":
        return (
          <>
            {successIcon}
            {successText || children}
          </>
        )
      case "error":
        return (
          <>
            {errorIcon}
            {errorText || children}
          </>
        )
      default:
        return (
          <>
            {icon}
            {children}
          </>
        )
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {getContent()}
    </Button>
  )
}
