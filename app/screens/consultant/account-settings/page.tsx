"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { User, Edit, Settings, Shield, Bell } from "lucide-react"

export default function AccountSettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-4">Account Settings</h1>
      <p className="text-sm text-baseGray">Manage your account settings and preferences</p>
      <Separator className="my-4" />

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Management
            </CardTitle>
            <CardDescription>Manage your professional profile information and visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => (window.location.href = "/screens/general/edit-profile")}
                className="bg-electric-blue hover:bg-electric-blue/90 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/screens/general/person-profile?id=current-user")}
              >
                <User className="h-4 w-4 mr-2" />
                View My Profile
              </Button>
            </div>
            <p className="text-sm text-baseGray mt-3">
              Update your bio, experience, education, focus areas, and privacy settings
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Manage your general account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value="John Doe" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value="john.doe@example.com" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="language">Language</Label>
                <Select>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="password">Password</Label>
                <Button variant="outline" className="col-span-2 justify-start">
                  Change Password
                </Button>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <Switch id="two-factor" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="email">
                <AccordionTrigger>Email Notifications</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-messages">New Messages</Label>
                      <Switch id="new-messages" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-followers">New Followers</Label>
                      <Switch id="new-followers" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="push">
                <AccordionTrigger>Push Notifications</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-messages-push">New Messages</Label>
                      <Switch id="new-messages-push" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-followers-push">New Followers</Label>
                      <Switch id="new-followers-push" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
