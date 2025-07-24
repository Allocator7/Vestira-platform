"use client"

import { useState } from "react"
import { Bell, Filter, Archive, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useApp } from "@/context/AppContext"

interface NotificationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  priority: "low" | "medium" | "high" | "critical"
  channels: ("email" | "sms" | "push" | "in-app")[]
  conditions: string[]
}

interface NotificationPreferences {
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  emailDigest: {
    enabled: boolean
    frequency: "immediate" | "hourly" | "daily" | "weekly"
  }
  mobileNotifications: boolean
  desktopNotifications: boolean
}

export function NotificationManager() {
  const { userRole, notifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications } = useApp()
  const [activeTab, setActiveTab] = useState("notifications")
  const [filterType, setFilterType] = useState("all")
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    quietHours: { enabled: false, start: "22:00", end: "08:00" },
    emailDigest: { enabled: true, frequency: "daily" },
    mobileNotifications: true,
    desktopNotifications: true,
  })

  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    {
      id: "ddq-requests",
      name: "Due Diligence Requests",
      description: "New DDQ requests and responses",
      enabled: true,
      priority: "high",
      channels: ["email", "in-app", "push"],
      conditions: ["New DDQ received", "DDQ response submitted", "DDQ deadline approaching"],
    },
    {
      id: "document-sharing",
      name: "Document Sharing",
      description: "Document uploads and access requests",
      enabled: true,
      priority: "medium",
      channels: ["in-app", "email"],
      conditions: ["New document shared", "Document access requested", "Document updated"],
    },
    {
      id: "market-alerts",
      name: "Market Alerts",
      description: "Critical market events and updates",
      enabled: true,
      priority: "critical",
      channels: ["email", "sms", "push", "in-app"],
      conditions: ["Market volatility spike", "Economic indicator release", "Fed announcement"],
    },
    {
      id: "team-activity",
      name: "Team Activity",
      description: "Team member actions and updates",
      enabled: false,
      priority: "low",
      channels: ["in-app"],
      conditions: ["Team member added", "Role changed", "Project assigned"],
    },
    {
      id: "compliance-alerts",
      name: "Compliance Alerts",
      description: "Regulatory and compliance notifications",
      enabled: true,
      priority: "critical",
      channels: ["email", "sms", "in-app"],
      conditions: ["Compliance deadline", "Audit requirement", "Regulatory update"],
    },
  ])

  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "all") return true
    if (filterType === "unread") return !notification.read
    if (filterType === "read") return notification.read
    return notification.type === filterType
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const toggleRule = (ruleId: string) => {
    setNotificationRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)),
    )
  }

  const updatePreferences = (key: keyof NotificationPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">Manage your notifications and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllNotificationsAsRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearNotifications}>
            <Archive className="mr-2 h-4 w-4" />
            Archive all
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">
            Notifications
            {notifications.filter((n) => !n.read).length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules">Rules & Alerts</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline">{filteredNotifications.length} notifications</Badge>
          </div>

          <Card>
            <CardContent className="p-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-gray-500">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={cn("p-4 transition-colors", !notification.read && "bg-blue-50")}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(notification.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          {notification.link && (
                            <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-2">
                              View details →
                            </Button>
                          )}
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="flex-shrink-0"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Rules</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationRules.map((rule) => (
                <div key={rule.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge className={getPriorityColor(rule.priority)}>{rule.priority}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rule.channels.map((channel) => (
                      <Badge key={channel} variant="outline">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">Triggers: {rule.conditions.join(", ")}</div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quiet Hours</CardTitle>
                <CardDescription>Set times when notifications should be paused</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="quiet-hours"
                    checked={preferences.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      updatePreferences("quietHours", { ...preferences.quietHours, enabled: checked })
                    }
                  />
                  <Label htmlFor="quiet-hours">Enable quiet hours</Label>
                </div>
                {preferences.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Start time</Label>
                      <Select
                        value={preferences.quietHours.start}
                        onValueChange={(value) =>
                          updatePreferences("quietHours", { ...preferences.quietHours, start: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                          <SelectItem value="23:00">11:00 PM</SelectItem>
                          <SelectItem value="00:00">12:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="end-time">End time</Label>
                      <Select
                        value={preferences.quietHours.end}
                        onValueChange={(value) =>
                          updatePreferences("quietHours", { ...preferences.quietHours, end: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Digest</CardTitle>
                <CardDescription>Configure email notification frequency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-digest"
                    checked={preferences.emailDigest.enabled}
                    onCheckedChange={(checked) =>
                      updatePreferences("emailDigest", { ...preferences.emailDigest, enabled: checked })
                    }
                  />
                  <Label htmlFor="email-digest">Enable email digest</Label>
                </div>
                {preferences.emailDigest.enabled && (
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={preferences.emailDigest.frequency}
                      onValueChange={(value) =>
                        updatePreferences("emailDigest", { ...preferences.emailDigest, frequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Notifications</CardTitle>
                <CardDescription>Control notifications on different devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mobile-notifications">Mobile notifications</Label>
                  <Switch
                    id="mobile-notifications"
                    checked={preferences.mobileNotifications}
                    onCheckedChange={(checked) => updatePreferences("mobileNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="desktop-notifications">Desktop notifications</Label>
                  <Switch
                    id="desktop-notifications"
                    checked={preferences.desktopNotifications}
                    onCheckedChange={(checked) => updatePreferences("desktopNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role-Based Settings</CardTitle>
                <CardDescription>Notifications specific to your role as {userRole}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {userRole === "allocator" && (
                    <>
                      <div>• DDQ requests and responses</div>
                      <div>• Manager performance updates</div>
                      <div>• Due diligence deadlines</div>
                    </>
                  )}
                  {userRole === "manager" && (
                    <>
                      <div>• New allocator inquiries</div>
                      <div>• Fund performance milestones</div>
                      <div>• Compliance requirements</div>
                    </>
                  )}
                  {userRole === "consultant" && (
                    <>
                      <div>• Client project updates</div>
                      <div>• Market research alerts</div>
                      <div>• Advisory deadlines</div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Notification Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">This month</p>
                <div className="text-xs text-green-600 mt-1">↓ 12% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Notifications acted upon</p>
                <div className="text-xs text-green-600 mt-1">↑ 3% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">Time to action</p>
                <div className="text-xs text-green-600 mt-1">↓ 0.3h from last month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notification Breakdown</CardTitle>
              <CardDescription>Distribution by type and priority</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Due Diligence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <span className="text-sm text-gray-600">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Document Sharing</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                    <span className="text-sm text-gray-600">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Market Alerts</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <span className="text-sm text-gray-600">10%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Team Activity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                    <span className="text-sm text-gray-600">5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
