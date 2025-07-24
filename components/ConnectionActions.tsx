"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Mail, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ConnectionActionsProps {
  connectionId: string | number
  connectionName?: string
  onViewProfile?: (id: string | number) => void
  onMessage?: (id: string | number) => Promise<void>
  onSchedule?: (id: string | number) => Promise<void>
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  showLabels?: boolean
}

export function ConnectionActions({
  connectionId,
  connectionName,
  onViewProfile,
  onMessage,
  onSchedule,
  className = "",
  size = "sm",
  variant = "outline",
  showLabels = true,
}: ConnectionActionsProps) {
  const [isMessaging, setIsMessaging] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const { toast } = useToast()

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(connectionId)
    }
  }

  const handleMessage = async () => {
    if (!onMessage) return

    try {
      setIsMessaging(true)
      await onMessage(connectionId)
      toast({
        title: "Message initiated",
        description: connectionName ? `Starting conversation with ${connectionName}` : "Starting a new conversation",
        variant: "success",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Failed to start conversation",
        description: "There was an error initiating the message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMessaging(false)
    }
  }

  const handleSchedule = async () => {
    if (!onSchedule) return

    try {
      setIsScheduling(true)
      await onSchedule(connectionId)
      toast({
        title: "Meeting scheduler opened",
        description: connectionName ? `Schedule a meeting with ${connectionName}` : "Schedule a new meeting",
        variant: "success",
      })
    } catch (error) {
      console.error("Error scheduling meeting:", error)
      toast({
        title: "Failed to open scheduler",
        description: "There was an error opening the meeting scheduler. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(false)
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        variant={variant}
        size={size}
        className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
        onClick={handleViewProfile}
        aria-label="View profile"
      >
        <ExternalLink className={`h-3 w-3 ${showLabels ? "mr-1" : ""}`} />
        {showLabels && "View Profile"}
      </Button>
      <Button
        variant={variant}
        size={size}
        className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
        onClick={handleMessage}
        disabled={isMessaging}
        aria-label="Send message"
      >
        {isMessaging ? (
          <Loader2 className={`h-3 w-3 animate-spin ${showLabels ? "mr-1" : ""}`} />
        ) : (
          <Mail className={`h-3 w-3 ${showLabels ? "mr-1" : ""}`} />
        )}
        {showLabels && (isMessaging ? "Sending..." : "Message")}
      </Button>
      <Button
        variant={variant}
        size={size}
        className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
        onClick={handleSchedule}
        disabled={isScheduling}
        aria-label="Schedule meeting"
      >
        {isScheduling ? (
          <Loader2 className={`h-3 w-3 animate-spin ${showLabels ? "mr-1" : ""}`} />
        ) : (
          <Calendar className={`h-3 w-3 ${showLabels ? "mr-1" : ""}`} />
        )}
        {showLabels && (isScheduling ? "Opening..." : "Schedule")}
      </Button>
    </div>
  )
}
