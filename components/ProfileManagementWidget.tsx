"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Edit, Eye, Settings } from "lucide-react"

interface ProfileManagementWidgetProps {
  userType: "allocator" | "manager" | "consultant"
  compact?: boolean
}

export function ProfileManagementWidget({ userType, compact = false }: ProfileManagementWidgetProps) {
  // Mock current user data - in real app this would come from auth context
  const currentUser = {
    firstName: "Sarah",
    lastName: "Johnson",
    title: "Investment Director",
    organization: "State Teachers Pension",
    avatar: "/placeholder-user.jpg",
    profileCompleteness: 85,
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "allocator":
        return "bg-blue-100 text-blue-800"
      case "manager":
        return "bg-green-100 text-green-800"
      case "consultant":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "allocator":
        return "Allocator"
      case "manager":
        return "Manager"
      case "consultant":
        return "Consultant"
      default:
        return "Professional"
    }
  }

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg"}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
              />
              <AvatarFallback>
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-deepBrand truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-sm text-baseGray truncate">{currentUser.title}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => (window.location.href = "/screens/general/edit-profile")}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Your Profile
        </CardTitle>
        <CardDescription>Manage your professional profile and visibility</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={currentUser.avatar || "/placeholder.svg"}
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
            />
            <AvatarFallback className="text-lg">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-deepBrand">
                {currentUser.firstName} {currentUser.lastName}
              </h3>
              <Badge className={getTypeColor(userType)}>{getTypeLabel(userType)}</Badge>
            </div>
            <p className="text-baseGray text-sm">{currentUser.title}</p>
            <p className="text-baseGray text-sm">{currentUser.organization}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-baseGray">Profile Completeness</span>
            <span className="font-medium">{currentUser.profileCompleteness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-electric-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentUser.profileCompleteness}%` }}
            />
          </div>
          <p className="text-xs text-baseGray">Complete your profile to improve visibility and connections</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => (window.location.href = "/screens/general/edit-profile")}
            className="bg-electric-blue hover:bg-electric-blue/90 text-white flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/screens/general/person-profile?id=current-user")}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = `/screens/${userType}/account-settings`)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
