"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Award,
  Users,
  TrendingUp,
  FileText,
  MessageSquare,
  UserCheck,
  UserX,
  Edit,
} from "lucide-react"

interface Member {
  id: string
  name: string
  type: string
  contactPerson: string
  email: string
  phone: string
  location: string
  website: string
  aum: string
  specializations: string[]
  memberSince: string
  status: string
  membershipTier: string
}

interface MemberProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
  onMemberUpdate: (member: Member) => void
}

export function MemberProfileModal({ open, onOpenChange, member, onMemberUpdate }: MemberProfileModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  if (!member) return null

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedMember = { ...member, status: newStatus }
    onMemberUpdate(updatedMember)

    toast({
      title: "Status Updated",
      description: `Member status changed to ${newStatus}`,
    })

    setIsLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "platinum":
        return <Badge className="bg-purple-100 text-purple-800">Platinum</Badge>
      case "premium":
        return <Badge className="bg-blue-100 text-blue-800">Premium</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Standard</Badge>
    }
  }

  // Mock engagement data
  const engagementData = {
    eventsAttended: 12,
    lastActivity: "2 days ago",
    totalConnections: 45,
    documentsShared: 8,
    forumPosts: 23,
    certificatesEarned: 5,
  }

  const recentActivity = [
    { date: "2024-01-15", activity: "Attended 'Alternative Investment Strategies' webinar", type: "event" },
    { date: "2024-01-12", activity: "Downloaded Q4 Market Report", type: "document" },
    { date: "2024-01-10", activity: "Connected with 3 new members", type: "connection" },
    { date: "2024-01-08", activity: "Posted in ESG Investment Forum", type: "forum" },
    { date: "2024-01-05", activity: "Earned CPE Certificate for Risk Management", type: "certificate" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{member.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4" />
                {member.type} • Member since {member.memberSince}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(member.status)}
              {getTierBadge(member.membershipTier)}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Primary Contact:</span>
                    <span>{member.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Location:</span>
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Website:</span>
                    <a
                      href={`https://${member.website}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {member.website}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Organization Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">AUM:</span>
                    <span>{member.aum}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Member Since:</span>
                    <span>{member.memberSince}</span>
                  </div>
                  <div>
                    <span className="font-medium">Specializations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Events Attended</p>
                      <p className="text-2xl font-bold">{engagementData.eventsAttended}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Connections</p>
                      <p className="text-2xl font-bold">{engagementData.totalConnections}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Documents Shared</p>
                      <p className="text-2xl font-bold">{engagementData.documentsShared}</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Forum Posts</p>
                      <p className="text-2xl font-bold">{engagementData.forumPosts}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Last Activity</p>
                      <p className="text-lg font-bold">{engagementData.lastActivity}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest member activities and engagements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.activity}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Member Status</CardTitle>
                  <CardDescription>Update member status and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={member.status === "active" ? "default" : "outline"}
                      onClick={() => handleStatusChange("active")}
                      disabled={isLoading}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                    <Button
                      size="sm"
                      variant={member.status === "suspended" ? "destructive" : "outline"}
                      onClick={() => handleStatusChange("suspended")}
                      disabled={isLoading}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common member management actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Open default email client
                        const emailSubject = encodeURIComponent(`Message for ${member.name}`)
                        const emailBody = encodeURIComponent(`Dear ${member.contactPerson},\n\n`)
                        window.open(`mailto:${member.email}?subject=${emailSubject}&body=${emailBody}`)
                        toast({
                          title: "Email Client Opened",
                          description: `Email client opened for ${member.contactPerson}`,
                        })
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Edit Profile",
                          description: `Opening edit profile for ${member.name} in new window`,
                        })
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "View Documents",
                          description: `Opening document viewer for ${member.name} in new window`,
                        })
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
