"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building, User, Bell, Shield, Users, Save, Upload, Trash2 } from "lucide-react"

export default function IndustryGroupAccountSettingsPage() {
  const [profileData, setProfileData] = useState({
    organizationName: "Investment Management Association",
    organizationType: "trade-association",
    description: "Leading trade association for investment management professionals",
    website: "www.ima-association.org",
    phone: "+1 (555) 123-4567",
    address: "123 Financial District, New York, NY 10004",
    establishedYear: "1995",
    memberCount: "2,500",
    regulatoryScope: ["SEC", "FINRA", "CFTC"],
    focusAreas: ["ESG", "Alternative Investments", "Regulatory Compliance"],
  })

  const [notificationSettings, setNotificationSettings] = useState({
    eventReminders: true,
    memberUpdates: true,
    regulatoryAlerts: true,
    marketInsights: false,
    systemUpdates: true,
    emailDigest: "weekly",
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your organization profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Profile</CardTitle>
              <CardDescription>Update your organization's public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                  IMA
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-gray-500">Recommended: 200x200px, PNG or JPG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={profileData.organizationName}
                    onChange={(e) => setProfileData({ ...profileData, organizationName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select
                    value={profileData.organizationType}
                    onValueChange={(value) => setProfileData({ ...profileData, organizationType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trade-association">Trade Association</SelectItem>
                      <SelectItem value="regulatory-body">Regulatory Body</SelectItem>
                      <SelectItem value="professional-organization">Professional Organization</SelectItem>
                      <SelectItem value="industry-council">Industry Council</SelectItem>
                      <SelectItem value="standards-organization">Standards Organization</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established">Established Year</Label>
                  <Input
                    id="established"
                    value={profileData.establishedYear}
                    onChange={(e) => setProfileData({ ...profileData, establishedYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberCount">Member Count</Label>
                  <Input
                    id="memberCount"
                    value={profileData.memberCount}
                    onChange={(e) => setProfileData({ ...profileData, memberCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={profileData.description}
                  onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Focus Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.focusAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {area}
                        <Trash2 className="h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      Add Focus Area
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Regulatory Scope</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.regulatoryScope.map((scope, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {scope}
                        <Trash2 className="h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      Add Regulatory Body
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage team members and their access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Team Members</h4>
                  <Button>
                    <User className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      name: "John Smith",
                      email: "john.smith@ima-association.org",
                      role: "Administrator",
                      status: "Active",
                    },
                    {
                      name: "Sarah Johnson",
                      email: "sarah.j@ima-association.org",
                      role: "Event Manager",
                      status: "Active",
                    },
                    {
                      name: "Michael Chen",
                      email: "m.chen@ima-association.org",
                      role: "Content Manager",
                      status: "Pending",
                    },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                        <span className="text-sm text-gray-600">{member.role}</span>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="eventReminders">Event Reminders</Label>
                    <p className="text-sm text-gray-600">Get notified about upcoming events</p>
                  </div>
                  <Switch
                    id="eventReminders"
                    checked={notificationSettings.eventReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, eventReminders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="memberUpdates">Member Updates</Label>
                    <p className="text-sm text-gray-600">Notifications about member activities</p>
                  </div>
                  <Switch
                    id="memberUpdates"
                    checked={notificationSettings.memberUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, memberUpdates: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="regulatoryAlerts">Regulatory Alerts</Label>
                    <p className="text-sm text-gray-600">Important regulatory updates</p>
                  </div>
                  <Switch
                    id="regulatoryAlerts"
                    checked={notificationSettings.regulatoryAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, regulatoryAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketInsights">Market Insights</Label>
                    <p className="text-sm text-gray-600">Weekly market analysis and trends</p>
                  </div>
                  <Switch
                    id="marketInsights"
                    checked={notificationSettings.marketInsights}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, marketInsights: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemUpdates">System Updates</Label>
                    <p className="text-sm text-gray-600">Platform updates and maintenance</p>
                  </div>
                  <Switch
                    id="systemUpdates"
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="emailDigest">Email Digest Frequency</Label>
                <Select
                  value={notificationSettings.emailDigest}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, emailDigest: value })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Password</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Add an extra layer of security to your account</p>
                      <p className="text-xs text-gray-500">Status: Not enabled</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Active Sessions</h4>
                  <div className="space-y-3">
                    {[
                      { device: "Chrome on Windows", location: "New York, NY", lastActive: "Current session" },
                      { device: "Safari on iPhone", location: "New York, NY", lastActive: "2 hours ago" },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-gray-600">
                            {session.location} • {session.lastActive}
                          </p>
                        </div>
                        {index !== 0 && (
                          <Button variant="outline" size="sm">
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
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
