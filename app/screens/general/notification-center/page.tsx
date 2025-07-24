"use client"

import { useState } from "react"
import { Bell, Check, Trash2, MailOpen, Info, AlertTriangle, AlertCircle } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function NotificationCenterPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications } = useApp()
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    if (activeTab === "read") return notification.read
    if (activeTab === "info") return notification.type === "info"
    if (activeTab === "warning") return notification.type === "warning"
    if (activeTab === "success") return notification.type === "success"
    if (activeTab === "error") return notification.type === "error"
    return true
  })

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">View and manage all your notifications</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            disabled={!notifications.some((n) => !n.read)}
          >
            <MailOpen className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" onClick={clearNotifications} disabled={notifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>You have {notifications.filter((n) => !n.read).length} unread notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="warning">Warnings</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-gray-500">
                    {activeTab === "all"
                      ? "You don't have any notifications yet"
                      : activeTab === "unread"
                        ? "You don't have any unread notifications"
                        : activeTab === "read"
                          ? "You don't have any read notifications"
                          : `You don't have any ${activeTab} notifications`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn("rounded-lg border p-4 transition-colors", !notification.read && "bg-blue-50")}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                            <p className="mt-1 text-xs text-gray-400">{new Date(notification.date).toLocaleString()}</p>
                            {notification.link && (
                              <Link
                                href={notification.link}
                                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                              >
                                View details
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markNotificationAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
