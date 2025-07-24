"use client"

import { User, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AccountSettingsPage() {
  return (
    <div>
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
      {/* Rest of the account settings page content goes here */}
    </div>
  )
}
