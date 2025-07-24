"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Smartphone,
  Monitor,
  Key,
  AlertTriangle,
  Check,
  X,
  Settings,
  Clock,
  MapPin,
  Trash2,
  Plus,
} from "lucide-react"
import { useApp } from "@/context/AppContext"
import { MFASetup } from "@/components/security/MFASetup"
import { Screen } from "@/components/Screen"

interface TrustedDevice {
  id: string
  name: string
  type: "desktop" | "mobile" | "tablet"
  location: string
  lastUsed: Date
  current: boolean
}

interface SecurityEvent {
  id: string
  type: "login" | "mfa_setup" | "password_change" | "device_added" | "suspicious_activity"
  description: string
  timestamp: Date
  location: string
  success: boolean
}

export default function SecuritySettingsPage() {
  const [showMFASetup, setShowMFASetup] = useState(false)
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [settings, setSettings] = useState({
    sessionTimeout: 30,
    requireMFAForSensitive: true,
    emailNotifications: true,
    loginAlerts: true,
    deviceTrustDuration: 30,
  })

  const { currentPersonProfile, addNotification } = useApp()

  useEffect(() => {
    // Load security data
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    // Simulate loading security data
    setTrustedDevices([
      {
        id: "device1",
        name: "MacBook Pro",
        type: "desktop",
        location: "New York, NY",
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
        current: true,
      },
      {
        id: "device2",
        name: "iPhone 15",
        type: "mobile",
        location: "New York, NY",
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
        current: false,
      },
    ])

    setSecurityEvents([
      {
        id: "event1",
        type: "login",
        description: "Successful login",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        location: "New York, NY",
        success: true,
      },
      {
        id: "event2",
        type: "device_added",
        description: "New device trusted",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        location: "New York, NY",
        success: true,
      },
    ])
  }

  const handleMFASetupComplete = () => {
    setMfaEnabled(true)
    setShowMFASetup(false)
    addNotification({
      title: "MFA Enabled",
      message: "Two-factor authentication has been successfully enabled",
      type: "success",
    })
  }

  const handleDisableMFA = async () => {
    // In production, require password confirmation
    setMfaEnabled(false)
    addNotification({
      title: "MFA Disabled",
      message: "Two-factor authentication has been disabled",
      type: "warning",
    })
  }

  const handleRemoveDevice = async (deviceId: string) => {
    setTrustedDevices((devices) => devices.filter((d) => d.id !== deviceId))
    addNotification({
      title: "Device Removed",
      message: "Trusted device has been removed",
      type: "success",
    })
  }

  const getEventIcon = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "login":
        return <Shield className="h-4 w-4" />
      case "mfa_setup":
        return <Key className="h-4 w-4" />
      case "password_change":
        return <Settings className="h-4 w-4" />
      case "device_added":
        return <Monitor className="h-4 w-4" />
      case "suspicious_activity":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getDeviceIcon = (type: TrustedDevice["type"]) => {
    switch (type) {
      case "desktop":
        return <Monitor className="h-5 w-5" />
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Monitor className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  if (showMFASetup) {
    return (
      <Screen title="Security Settings">
        <div className="max-w-4xl mx-auto p-6">
          <MFASetup onComplete={handleMFASetupComplete} onCancel={() => setShowMFASetup(false)} />
        </div>
      </Screen>
    )
  }

  return (
    <Screen title="Security Settings">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-deep-brand">Security Settings</h1>
          <p className="text-base-gray mt-2">Manage your account security and privacy settings</p>
        </div>

        <Tabs defaultValue="authentication" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="devices">Trusted Devices</TabsTrigger>
            <TabsTrigger value="activity">Security Activity</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="authentication" className="space-y-6">
            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-electric-blue" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${mfaEnabled ? "bg-green-500" : "bg-gray-300"}`} />
                    <div>
                      <p className="font-medium">
                        {mfaEnabled ? "Two-factor authentication is enabled" : "Two-factor authentication is disabled"}
                      </p>
                      <p className="text-sm text-base-gray">
                        {mfaEnabled ? "Your account is protected with 2FA" : "Enable 2FA to secure your account"}
                      </p>
                    </div>
                  </div>
                  {mfaEnabled ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      <X className="h-3 w-3 mr-1" />
                      Disabled
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  {!mfaEnabled ? (
                    <Button onClick={() => setShowMFASetup(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Enable Two-Factor Authentication
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setShowMFASetup(true)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Methods
                      </Button>
                      <Button variant="outline" onClick={handleDisableMFA}>
                        <X className="h-4 w-4 mr-2" />
                        Disable MFA
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Password Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-electric-blue" />
                  Password Security
                </CardTitle>
                <CardDescription>Manage your password and recovery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-base-gray">Last changed 30 days ago</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/screens/allocator/account-settings?tab=security")}
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Recovery Email</p>
                      <p className="text-sm text-base-gray">{currentPersonProfile?.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/screens/allocator/account-settings?tab=security")}
                    >
                      Update Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-electric-blue" />
                  Trusted Devices
                </CardTitle>
                <CardDescription>Manage devices that can access your account without MFA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trustedDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{device.name}</p>
                            {device.current && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Current Device
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-base-gray">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {device.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last used {device.lastUsed.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!device.current && (
                        <Button variant="outline" size="sm" onClick={() => handleRemoveDevice(device.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-electric-blue" />
                  Recent Security Activity
                </CardTitle>
                <CardDescription>Monitor recent security events on your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-full ${event.success ? "bg-green-100" : "bg-red-100"}`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-base-gray mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.timestamp.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <Badge variant={event.success ? "secondary" : "destructive"}>
                        {event.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-electric-blue" />
                  Security Preferences
                </CardTitle>
                <CardDescription>Configure your security and notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mfa-sensitive">Require MFA for sensitive actions</Label>
                      <p className="text-sm text-base-gray">
                        Require two-factor authentication for document downloads and data room access
                      </p>
                    </div>
                    <Switch
                      id="mfa-sensitive"
                      checked={settings.requireMFAForSensitive}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, requireMFAForSensitive: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email security notifications</Label>
                      <p className="text-sm text-base-gray">Receive email alerts for security events</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="login-alerts">Login alerts</Label>
                      <p className="text-sm text-base-gray">Get notified of new device logins</p>
                    </div>
                    <Switch
                      id="login-alerts"
                      checked={settings.loginAlerts}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, loginAlerts: checked }))}
                    />
                  </div>
                </div>

                <Button className="w-full">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  )
}
