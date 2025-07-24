"use client"

import { useAppContext } from "@/components/layouts/AppLayout"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bell, Check, Info, AlertTriangle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NotificationCenterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationCenter({ open, onOpenChange }: NotificationCenterProps) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="text-xs">
            Mark all as read
          </Button>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
              <p className="text-sm text-gray-500 mt-1">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  notification.read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-100",
                )}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-xs text-primary font-medium mt-2 inline-block"
                        onClick={() => {
                          markNotificationAsRead(notification.id)
                          onOpenChange(false)
                        }}
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
