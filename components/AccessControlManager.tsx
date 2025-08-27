"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, X, Search, Plus, UserPlus, Mail, Download, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import React from "react"

// Define types for access roles
export type AccessRole = "viewer" | "contributor" | "manager" | "admin"
export type AllocatorDataRoomPermission = "view-only" | "view-download"

export interface AccessUser {
  id: string
  name: string
  email: string
  organization: string
  role: AccessRole
  avatar?: string
  // New field for allocator-specific data room permissions
  dataRoomPermission?: AllocatorDataRoomPermission
  userType?: "allocator" | "manager" | "consultant" | "admin"
}

export interface AccessGroup {
  id: string
  name: string
  memberCount: number
  role: AccessRole
}

interface AccessControlManagerProps {
  resourceId: string
  resourceName: string
  resourceType: "dataRoom" | "document" | "ddq" | "folder"
  currentUsers?: AccessUser[]
  currentGroups?: AccessGroup[]
  onSaveAccess?: (users: AccessUser[], groups: AccessGroup[]) => void
  isOpen?: boolean
  onClose?: () => void
}

export function AccessControlManager({
  resourceId,
  resourceName,
  resourceType,
  currentUsers = [],
  currentGroups = [],
  onSaveAccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: AccessControlManagerProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalOnClose ? externalOnClose : setInternalIsOpen
  const [users, setUsers] = useState<AccessUser[]>(currentUsers)
  const [groups, setGroups] = useState<AccessGroup[]>(currentGroups)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users")
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<AccessRole>("viewer")
  const [newUserType, setNewUserType] = useState<"allocator" | "manager" | "consultant">("allocator")
  const [newUserDataRoomPermission, setNewUserDataRoomPermission] = useState<AllocatorDataRoomPermission>("view-only")
  const [notifyUsers, setNotifyUsers] = useState(true)
  const [expirationEnabled, setExpirationEnabled] = useState(false)
  const [expirationDate, setExpirationDate] = useState("")
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupRole, setNewGroupRole] = useState<AccessRole>("viewer")

  const { toast } = useToast()

  // Mock data for user search - enhanced with user types and data room permissions
  const availableUsers: AccessUser[] = [
    {
      id: "user1",
      name: "Sarah Johnson",
      email: "sjohnson@acmecapital.com",
      organization: "Acme Capital",
      role: "viewer",
      userType: "allocator",
      dataRoomPermission: "view-only",
      avatar: "/placeholder.svg?key=aobgn",
    },
    {
      id: "user2",
      name: "Michael Chen",
      email: "mchen@acmecapital.com",
      organization: "Acme Capital",
      role: "viewer",
      userType: "allocator",
      dataRoomPermission: "view-download",
      avatar: "/placeholder.svg?key=70d48",
    },
    {
      id: "user3",
      name: "David Wilson",
      email: "dwilson@globalinv.com",
      organization: "Global Investments",
      role: "manager",
      userType: "manager",
      avatar: "/placeholder.svg?key=pbvnx",
    },
    {
      id: "user4",
      name: "Emily Rodriguez",
      email: "erodriguez@pensionfund.org",
      organization: "State Pension Fund",
      role: "viewer",
      userType: "allocator",
      dataRoomPermission: "view-only",
      avatar: "/placeholder.svg?key=d614w",
    },
    {
      id: "user5",
      name: "James Taylor",
      email: "jtaylor@endowment.edu",
      organization: "University Endowment",
      role: "contributor",
      userType: "consultant",
      avatar: "/placeholder.svg?key=rbj6x",
    },
  ]

  // Mock data for group search
  const availableGroups: AccessGroup[] = [
    { id: "group1", name: "Pension Funds", memberCount: 12, role: "viewer" },
    { id: "group2", name: "Endowments", memberCount: 8, role: "viewer" },
    { id: "group3", name: "Family Offices", memberCount: 15, role: "viewer" },
    { id: "group4", name: "Insurance Companies", memberCount: 6, role: "viewer" },
    { id: "group5", name: "Consultants", memberCount: 9, role: "viewer" },
  ]

  // Filter available users based on search term and exclude already added users
  const filteredUsers = availableUsers.filter(
    (user) =>
      !users.some((u) => u.id === user.id) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organization.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Filter available groups based on search term and exclude already added groups
  const filteredGroups = availableGroups.filter(
    (group) => !groups.some((g) => g.id === group.id) && group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add a user to the access list
  const addUser = async (user: AccessUser) => {
    // Check if user already exists
    if (users.some((u) => u.id === user.id)) {
      toast({
        title: "User already has access",
        description: `${user.name} already has access to this resource.`,
        variant: "destructive",
      })
      return
    }

    // Show loading state
    const loadingToast = toast({
      title: "Adding user access...",
      description: "Please wait while we grant access to the user.",
    })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Add user to the access list
      setUsers([...users, user])

      // Log the activity
      const activityLog = {
        id: `log-${Date.now()}`,
        action: "add_user_access",
        resource: resourceName,
        resourceType,
        resourceId,
        timestamp: new Date().toISOString(),
        user: "Current User",
        details: `Granted ${user.role} access to ${user.name} (${user.email})${
          user.userType === "allocator" &&
          (resourceType === "dataRoom" || resourceType === "document" || resourceType === "folder")
            ? ` with ${user.dataRoomPermission} permissions`
            : ""
        }`,
      }

      const existingLogs = JSON.parse(localStorage.getItem("vestira_access_activity_logs") || "[]")
      localStorage.setItem("vestira_access_activity_logs", JSON.stringify([activityLog, ...existingLogs]))

      // Show success message
      toast.dismiss(loadingToast)
      toast({
        title: "User access granted",
        description: `${user.name} has been granted ${user.role} access.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error adding user access:", error)
      toast.dismiss(loadingToast)
      toast({
        title: "Failed to add user",
        description: "There was an error granting access to the user. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Remove a user from the access list
  const removeUser = async (userId: string) => {
    // Find the user to be removed
    const userToRemove = users.find((user) => user.id === userId)
    if (!userToRemove) return

    // Show loading state
    const loadingToast = toast({
      title: "Removing user access...",
      description: "Please wait while we revoke user access.",
    })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Remove user from the access list
      setUsers(users.filter((user) => user.id !== userId))

      // Log the activity
      const activityLog = {
        id: `log-${Date.now()}`,
        action: "remove_user_access",
        resource: resourceName,
        resourceType,
        resourceId,
        timestamp: new Date().toISOString(),
        user: "Current User",
        details: `Revoked access from ${userToRemove.name} (${userToRemove.email})`,
      }

      const existingLogs = JSON.parse(localStorage.getItem("vestira_access_activity_logs") || "[]")
      localStorage.setItem("vestira_access_activity_logs", JSON.stringify([activityLog, ...existingLogs]))

      // Show success message
      toast.dismiss(loadingToast)
      toast({
        title: "User access revoked",
        description: `Access for ${userToRemove.name} has been revoked.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error removing user access:", error)
      toast.dismiss(loadingToast)
      toast({
        title: "Failed to remove user",
        description: "There was an error revoking user access. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add a group to the access list
  const addGroup = (group: AccessGroup) => {
    setGroups([...groups, group])
  }

  // Remove a group from the access list
  const removeGroup = (groupId: string) => {
    setGroups(groups.filter((group) => group.id !== groupId))
  }

  // Update a user's role
  const updateUserRole = async (userId: string, role: AccessRole) => {
    // Find the user to update
    const userToUpdate = users.find((user) => user.id === userId)
    if (!userToUpdate) return

    // If role is the same, do nothing
    if (userToUpdate.role === role) return

    // Show loading state
    const loadingToast = toast({
      title: "Updating user role...",
      description: "Please wait while we update the user's role.",
    })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update user's role
      setUsers(users.map((user) => (user.id === userId ? { ...user, role } : user)))

      // Log the activity
      const activityLog = {
        id: `log-${Date.now()}`,
        action: "update_user_role",
        resource: resourceName,
        resourceType,
        resourceId,
        timestamp: new Date().toISOString(),
        user: "Current User",
        details: `Changed ${userToUpdate.name}'s role from ${userToUpdate.role} to ${role}`,
      }

      const existingLogs = JSON.parse(localStorage.getItem("vestira_access_activity_logs") || "[]")
      localStorage.setItem("vestira_access_activity_logs", JSON.stringify([activityLog, ...existingLogs]))

      // Show success message
      toast.dismiss(loadingToast)
      toast({
        title: "User role updated",
        description: `${userToUpdate.name}'s role has been changed to ${role}.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.dismiss(loadingToast)
      toast({
        title: "Failed to update role",
        description: "There was an error updating the user's role. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update allocator's data room permission
  const updateAllocatorDataRoomPermission = async (userId: string, permission: AllocatorDataRoomPermission) => {
    const userToUpdate = users.find((user) => user.id === userId)
    if (!userToUpdate || userToUpdate.userType !== "allocator") return

    if (userToUpdate.dataRoomPermission === permission) return

    const loadingToast = toast({
      title: "Updating permissions...",
      description: "Please wait while we update the user's data room permissions.",
    })

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      setUsers(users.map((user) => (user.id === userId ? { ...user, dataRoomPermission: permission } : user)))

      const activityLog = {
        id: `log-${Date.now()}`,
        action: "update_dataroom_permission",
        resource: resourceName,
        resourceType,
        resourceId,
        timestamp: new Date().toISOString(),
        user: "Current User",
        details: `Changed ${userToUpdate.name}'s data room permission from ${userToUpdate.dataRoomPermission} to ${permission}`,
      }

      const existingLogs = JSON.parse(localStorage.getItem("vestira_access_activity_logs") || "[]")
      localStorage.setItem("vestira_access_activity_logs", JSON.stringify([activityLog, ...existingLogs]))

      toast.dismiss(loadingToast)
      toast({
        title: "Permissions updated",
        description: `${userToUpdate.name}'s data room permissions have been updated.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating data room permission:", error)
      toast.dismiss(loadingToast)
      toast({
        title: "Failed to update permissions",
        description: "There was an error updating the user's permissions. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update a group's role
  const updateGroupRole = (groupId: string, role: AccessRole) => {
    setGroups(groups.map((group) => (group.id === groupId ? { ...group, role } : group)))
  }

  // Handle inviting a new user
  const handleInviteUser = () => {
    if (newUserEmail) {
      const newUser: AccessUser = {
        id: `new-${Date.now()}`,
        name: newUserEmail.split("@")[0], // Simple name extraction from email
        email: newUserEmail,
        organization: newUserEmail.split("@")[1].split(".")[0], // Simple org extraction from email domain
        role: newUserRole,
        userType: newUserType,
        dataRoomPermission: newUserType === "allocator" ? newUserDataRoomPermission : undefined,
      }
      setUsers([...users, newUser])
      setNewUserEmail("")
      setShowInviteForm(false)
    }
  }

  // Handle creating a new group
  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: AccessGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName.trim(),
        memberCount: 0,
        role: newGroupRole,
      }
      setGroups([...groups, newGroup])
      setNewGroupName("")
      setNewGroupRole("viewer")
      setShowCreateGroupForm(false)
      
      toast({
        title: "Group created",
        description: `Group "${newGroupName}" has been created successfully.`,
        variant: "success",
      })
    }
  }

  // Handle saving access settings
  const handleSave = async () => {
    console.log("Save Access Settings button clicked")
    
    // Show loading state
    const loadingToast = toast({
      title: "Saving access settings...",
      description: "Please wait while we update access permissions.",
    })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Save access settings to localStorage for persistence
      localStorage.setItem(`vestira_access_users_${resourceId}`, JSON.stringify(users))
      localStorage.setItem(`vestira_access_groups_${resourceId}`, JSON.stringify(groups))

      // Log the activity
      const activityLog = {
        id: `log-${Date.now()}`,
        action: "update_access",
        resource: resourceName,
        resourceType,
        resourceId,
        timestamp: new Date().toISOString(),
        user: "Current User",
        details: `Updated access settings for ${resourceType} "${resourceName}"`,
      }

      const existingLogs = JSON.parse(localStorage.getItem("vestira_access_activity_logs") || "[]")
      localStorage.setItem("vestira_access_activity_logs", JSON.stringify([activityLog, ...existingLogs]))

      // Call the onSaveAccess callback if provided
      if (onSaveAccess) {
        onSaveAccess(users, groups)
      }

      // Close the dialog
      setIsOpen(false)

      // Show success message
      toast.dismiss(loadingToast)
      toast({
        title: "Access settings saved successfully!",
        description: `Access permissions for "${resourceName}" have been updated and saved.`,
        variant: "success",
      })
      
      console.log("Access settings saved successfully:", { users, groups })
    } catch (error) {
      console.error("Error saving access settings:", error)
      toast.dismiss(loadingToast)
      toast({
        title: "Failed to save access settings",
        description: "There was an error updating access permissions. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get the appropriate button text based on resource type
  const getButtonText = () => {
    switch (resourceType) {
      case "dataRoom":
        return "Manage Data Room Access"
      case "document":
        return "Manage Document Access"
      case "ddq":
        return "Manage DDQ Access"
      case "folder":
        return "Manage Folder Access"
      default:
        return "Manage Access"
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role: AccessRole) => {
    switch (role) {
      case "viewer":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "contributor":
        return "bg-green-50 text-green-700 border-green-200"
      case "manager":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "admin":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Get data room permission badge color
  const getDataRoomPermissionBadgeColor = (permission: AllocatorDataRoomPermission) => {
    switch (permission) {
      case "view-only":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "view-download":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Get role description
  const getRoleDescription = (role: AccessRole) => {
    switch (role) {
      case "viewer":
        return "Read-only access to view and download content"
      case "contributor":
        return "Can upload and edit documents, no admin controls"
      case "manager":
        return "Full access to content and collaboration"
      case "admin":
        return "Full administrative access including user management"
      default:
        return ""
    }
  }

  // Get data room permission description
  const getDataRoomPermissionDescription = (permission: AllocatorDataRoomPermission) => {
    switch (permission) {
      case "view-only":
        return "Can view documents but cannot download them"
      case "view-download":
        return "Can view and download documents"
      default:
        return ""
    }
  }

  React.useEffect(() => {
    // Load saved users and groups for this resource
    const savedUsers = localStorage.getItem(`vestira_access_users_${resourceId}`)
    const savedGroups = localStorage.getItem(`vestira_access_groups_${resourceId}`)

    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers))
      } catch (error) {
        console.error("Error parsing saved users:", error)
      }
    }

    if (savedGroups) {
      try {
        setGroups(JSON.parse(savedGroups))
      } catch (error) {
        console.error("Error parsing saved groups:", error)
      }
    }
  }, [resourceId])

  const isDataRoomResource = resourceType === "dataRoom" || resourceType === "document" || resourceType === "folder"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
          <Users className="h-4 w-4" />
          <span>{getButtonText()}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-deep-brand">Manage Access</DialogTitle>
          <DialogDescription className="text-base-gray">
            Control who can access "{resourceName}" and what permissions they have.
            {isDataRoomResource && (
              <span className="block mt-1 text-sm text-blue-600">
                Allocator permissions control document viewing and downloading capabilities.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="users"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "users" | "groups")}
        >
          <TabsList className="mb-4">
            <TabsTrigger className="text-deep-brand" value="users">
              Users
            </TabsTrigger>
            <TabsTrigger className="text-deep-brand" value="groups">
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Search and add users */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or organization..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Search results */}
            {searchTerm && filteredUsers.length > 0 && (
              <div className="border rounded-md max-h-40 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => addUser(user)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-deep-brand">{user.name}</p>
                        <p className="text-xs text-base-gray">{user.email}</p>
                        <p className="text-xs text-blue-600 capitalize">{user.userType}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="text-xs">
                        {user.organization}
                      </Badge>
                      {user.userType === "allocator" && isDataRoomResource && user.dataRoomPermission && (
                        <Badge className={`text-xs ${getDataRoomPermissionBadgeColor(user.dataRoomPermission)}`}>
                          {user.dataRoomPermission === "view-only" ? "View Only" : "View + Download"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results message */}
            {searchTerm && filteredUsers.length === 0 && (
              <div className="text-center p-2 text-sm text-base-gray">
                No users found. Try a different search or invite a new user.
              </div>
            )}

            {/* Invite new user button */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-transparent"
                onClick={() => setShowInviteForm(!showInviteForm)}
              >
                <UserPlus className="h-4 w-4" />
                <span>Invite New User</span>
              </Button>
              <p className="text-xs text-base-gray">{users.length} users with access</p>
            </div>

            {/* Invite form */}
            {showInviteForm && (
              <div className="border rounded-md p-3 space-y-3">
                <h4 className="text-sm font-medium text-deep-brand">Invite User by Email</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="email@organization.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">User Type</Label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                      value={newUserType}
                      onChange={(e) => setNewUserType(e.target.value as "allocator" | "manager" | "consultant")}
                    >
                      <option value="allocator">Allocator</option>
                      <option value="manager">Manager</option>
                      <option value="consultant">Consultant</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Role</Label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as AccessRole)}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="contributor">Contributor</option>
                      <option value="manager">Manager</option>
                      {resourceType === "dataRoom" && <option value="admin">Admin</option>}
                    </select>
                  </div>
                  {newUserType === "allocator" && isDataRoomResource && (
                    <div>
                      <Label className="text-xs">Data Room Permission</Label>
                      <select
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                        value={newUserDataRoomPermission}
                        onChange={(e) => setNewUserDataRoomPermission(e.target.value as AllocatorDataRoomPermission)}
                      >
                        <option value="view-only">View Only</option>
                        <option value="view-download">View + Download</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowInviteForm(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleInviteUser}
                    disabled={!newUserEmail}
                    className="bg-electric-blue text-white hover:bg-electric-blue/80"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Send Invite
                  </Button>
                </div>
              </div>
            )}

            {/* Current users with access */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-deep-brand">People with access</h4>
              {users.length === 0 ? (
                <p className="text-sm text-base-gray p-2">No users have been granted access yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-deep-brand">{user.name}</p>
                          <p className="text-xs text-base-gray">{user.email}</p>
                          <p className="text-xs text-blue-600 capitalize">{user.userType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <select
                            className="text-xs border rounded p-1"
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as AccessRole)}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="contributor">Contributor</option>
                            <option value="manager">Manager</option>
                            {resourceType === "dataRoom" && <option value="admin">Admin</option>}
                          </select>
                          {user.userType === "allocator" && isDataRoomResource && (
                            <select
                              className="text-xs border rounded p-1"
                              value={user.dataRoomPermission || "view-only"}
                              onChange={(e) =>
                                updateAllocatorDataRoomPermission(
                                  user.id,
                                  e.target.value as AllocatorDataRoomPermission,
                                )
                              }
                            >
                              <option value="view-only">View Only</option>
                              <option value="view-download">View + Download</option>
                            </select>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeUser(user.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            {/* Search and add groups */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search groups..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateGroupForm(true)}
                className="bg-electric-blue text-white hover:bg-electric-blue/80 border-electric-blue"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Group
              </Button>
            </div>

            {/* Search results */}
            {searchTerm && filteredGroups.length > 0 && (
              <div className="border rounded-md max-h-40 overflow-y-auto">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => addGroup(group)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-deep-brand">{group.name}</p>
                        <p className="text-xs text-base-gray">{group.memberCount} members</p>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}

            {/* No results message */}
            {searchTerm && filteredGroups.length === 0 && (
              <div className="text-center p-2 text-sm text-base-gray">No groups found. Try a different search.</div>
            )}

            {/* Create Group Form */}
            {showCreateGroupForm && (
              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-deep-brand mb-3">Create New Group</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Group Name</Label>
                    <Input
                      placeholder="Enter group name..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Default Role</Label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm mt-1"
                      value={newGroupRole}
                      onChange={(e) => setNewGroupRole(e.target.value as AccessRole)}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="contributor">Contributor</option>
                      <option value="manager">Manager</option>
                      {resourceType === "dataRoom" && <option value="admin">Admin</option>}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowCreateGroupForm(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateGroup}
                      disabled={!newGroupName.trim()}
                      className="bg-electric-blue text-white hover:bg-electric-blue/80"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Group
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Current groups with access */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-deep-brand">Groups with access</h4>
              {groups.length === 0 ? (
                <p className="text-sm text-base-gray p-2">No groups have been granted access yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-deep-brand">{group.name}</p>
                          <p className="text-xs text-base-gray">{group.memberCount} members</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="text-xs border rounded p-1"
                          value={group.role}
                          onChange={(e) => updateGroupRole(group.id, e.target.value as AccessRole)}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="contributor">Contributor</option>
                          <option value="manager">Manager</option>
                          {resourceType === "dataRoom" && <option value="admin">Admin</option>}
                        </select>
                        <Button variant="ghost" size="icon" onClick={() => removeGroup(group.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Access settings */}
        <div className="space-y-4 border-t pt-4 mt-4">
          <h4 className="text-sm font-medium text-deep-brand">Access Settings</h4>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-users"
                checked={notifyUsers}
                onCheckedChange={(checked) => setNotifyUsers(!!checked)}
              />
              <Label htmlFor="notify-users" className="text-sm text-deep-brand">
                Notify users about access changes
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="expiration"
                checked={expirationEnabled}
                onCheckedChange={(checked) => setExpirationEnabled(!!checked)}
              />
              <Label htmlFor="expiration" className="text-sm text-deep-brand">
                Set access expiration date
              </Label>
            </div>

            {expirationEnabled && (
              <div className="ml-6 mt-2">
                <Input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-deep-brand">Permission Levels</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-deep-brand text-sm">Viewer</span>
                    <p className="text-xs text-base-gray mt-0.5">{getRoleDescription("viewer")}</p>
                  </div>
                </div>
                <Badge className={`${getRoleBadgeColor("viewer")} text-xs`}>Read Only</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md bg-green-50/30">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-deep-brand text-sm">Contributor</span>
                    <p className="text-xs text-base-gray mt-0.5">{getRoleDescription("contributor")}</p>
                  </div>
                </div>
                <Badge className={`${getRoleBadgeColor("contributor")} text-xs`}>Edit Access</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md bg-purple-50/30">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-deep-brand text-sm">Manager</span>
                    <p className="text-xs text-base-gray mt-0.5">{getRoleDescription("manager")}</p>
                  </div>
                </div>
                <Badge className={`${getRoleBadgeColor("manager")} text-xs`}>Full Access</Badge>
              </div>

              {resourceType === "dataRoom" && (
                <div className="flex items-center justify-between p-3 border rounded-md bg-red-50/30">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-deep-brand text-sm">Admin</span>
                      <p className="text-xs text-base-gray mt-0.5">{getRoleDescription("admin")}</p>
                    </div>
                  </div>
                  <Badge className={`${getRoleBadgeColor("admin")} text-xs`}>Admin Access</Badge>
                </div>
              )}
            </div>

            {isDataRoomResource && (
              <div className="space-y-3 pt-3 border-t">
                <h5 className="text-sm font-medium text-deep-brand">Allocator Data Room Permissions</h5>

                <div className="flex items-center justify-between p-3 border rounded-md bg-orange-50/30">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-deep-brand text-sm">View Only</span>
                      <p className="text-xs text-base-gray mt-0.5">{getDataRoomPermissionDescription("view-only")}</p>
                    </div>
                  </div>
                  <Badge className={`${getDataRoomPermissionBadgeColor("view-only")} text-xs`}>View Only</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md bg-green-50/30">
                  <div className="flex items-center gap-3">
                    <Download className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-deep-brand text-sm">View + Download</span>
                      <p className="text-xs text-base-gray mt-0.5">
                        {getDataRoomPermissionDescription("view-download")}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getDataRoomPermissionBadgeColor("view-download")} text-xs`}>
                    View + Download
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-electric-blue text-white hover:bg-electric-blue/80">
            Save Access Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
