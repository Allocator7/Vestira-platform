"use client"

import type React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface NotificationBellProps {
  unreadCount: number
}

const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount }) => {
  const router = useRouter()

  const handleNotificationClick = () => {
    // Toggle notification panel or navigate to notification center
    router.push("/screens/general/notification-center")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-canvas-bg transition-colors duration-300 rounded-lg"
      onClick={handleNotificationClick}
    >
      <Bell className="h-5 w-5 text-deep-brand" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  )
}

export default NotificationBell
