"use client"

import { useState } from "react"
import {
  Shield,
  Users,
  Eye,
  Edit,
  Settings,
  UserPlus,
  Trash,
  Search,
  Info,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// Define permission roles and their capabilities
const ROLES = {
  VIEWER: {
    name: "Viewer",
    description: "Read-only access to view and download content",
    icon: Eye,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CONTRIBUTOR: {
    name: "Contributor",
    description: "Can upload and edit documents, no admin controls",
    icon: Edit,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  MANAGER: {
    name: "Manager",
    description: "Full access to content and collaboration",
    icon: Settings,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  ADMIN: {
    name: "Admin",
    description: "Full administrative access including user management",
    icon: Shield,
    color: "bg-red-50 text-red-700 border-red-200",
  },
}

// User type definition
interface User {
  id: string
  name: string
  email: string
  organization: string
  role: keyof typeof ROLES
  addedBy?: string
  addedOn?: string
}

// Resource type definition
interface Resource {
  id: string
  name: string
  type: "data-room" | "document" | "ddq"
  ownerId: string
  ownerName: string
}

interface PermissionsManagerProps {
  resource: Resource
  users: User[]
  currentUserRole: keyof typeof ROLES
  currentUserId: string
  onAddUser?: (email: string, role: keyof typeof ROLES) => Promise<void>
  onRemoveUser?: (userId: string) => Promise<void>
  onUpdateUserRole?: (userId: string, role: keyof typeof ROLES) => Promise<void>
  onRefresh?: () => Promise<void>
  className?: string
}

export function PermissionsManager({
  resource,
  users,
  currentUserRole,
  currentUserId,
  onAddUser,
  onRemoveUser,
  onUpdateUserRole,
  onRefresh,
  className,
}: PermissionsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<keyof typeof ROLES>("VIEWER")
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditingPermission, setIsEditingPermission] = useState(false)
  const [isRemovingUser, setIsRemovingUser] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [isRemoveUserDialogOpen, setIsRemoveUserDialogOpen] = useState(false)

  const { toast } = useToast()

  // Check if current user can manage permissions
  const canManagePermissions = currentUserRole === "MANAGER" || currentUserRole === "ADMIN"

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle refreshing permissions
  const handleRefresh = async () => {
    if (!onRefresh) return

    try {
      setIsRefreshing(true)
      await onRefresh()
      toast({
        title: "Permissions refreshed",
        description: "User permissions have been updated",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to refresh permissions:", error)
      toast({
        title: "Failed to refresh",
        description: "There was an error refreshing the permissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Handle adding a user
  const handleAddUser = async () => {
    if (!newUserEmail || !newUserRole) {
      toast({
        title: "Missing information",
        description: "Please provide both email and role.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAddingUser(true)
      await onAddUser?.(newUserEmail, newUserRole)

      toast({
        title: "User added",
        description: `${newUserEmail} has been granted ${ROLES[newUserRole].name} access.`,
        variant: "success",
      })

      setNewUserEmail("")
      setNewUserRole("VIEWER")
      setIsAddUserDialogOpen(false)

      // Refresh the permissions list if possible
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error("Failed to add user:", error)
      toast({
        title: "Failed to add user",
        description: "There was an error adding the user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingUser(false)
    }
  }

  // Handle removing a user
  const handleRemoveUser = async () => {
    if (!selectedUser) return

    try {
      setIsRemovingUser(true)
      await onRemoveUser?.(selectedUser.id)

      toast({
        title: "User removed",
        description: `${selectedUser.name} has been removed from ${resource.name}.`,
        variant: "success",
      })

      setIsRemoveUserDialogOpen(false)
      setSelectedUser(null)

      // Refresh the permissions list if possible
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error("Failed to remove user:", error)
      toast({
        title: "Failed to remove user",
        description: "There was an error removing the user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRemovingUser(false)
    }
  }

  // Handle updating a user's role
  const handleUpdateRole = async () => {
    if (!selectedUser) return

    try {
      setIsEditingPermission(true)
      await onUpdateUserRole?.(selectedUser.id, selectedUser.role)

      toast({
        title: "Role updated",
        description: `${selectedUser.name}'s role has been changed to ${ROLES[selectedUser.role].name}.`,
        variant: "success",
      })

      setIsEditRoleDialogOpen(false)
      setSelectedUser(null)

      // Refresh the permissions list if possible
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error("Failed to update user role:", error)
      toast({
        title: "Failed to update role",
        description: "There was an error updating the user's role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEditingPermission(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Controls
          </CardTitle>
          <CardDescription>
            Manage who can access{" "}
            {resource.type === "data-room"
              ? "this data room"
              : resource.type === "document"
                ? "this document"
                : "this DDQ"}
          </CardDescription>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh permissions"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {/* Search and Add User Section */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-base-gray" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {canManagePermissions && (
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap bg-electric-blue text-white hover:bg-royal-blue">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add User Access</DialogTitle>
                  <DialogDescription>
                    Enter the email address of the user you want to grant access to.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      placeholder="user@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Permission Level</Label>
                    <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as keyof typeof ROLES)}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLES).map(([key, role]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <role.icon className="h-4 w-4" />
                              <span>{role.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="mt-2 text-sm text-base-gray">{newUserRole && ROLES[newUserRole].description}</div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)} disabled={isAddingUser}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-electric-blue text-white hover:bg-royal-blue"
                    onClick={handleAddUser}
                    disabled={!newUserEmail || isAddingUser}
                  >
                    {isAddingUser ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Role Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(ROLES).map(([key, role]) => (
            <TooltipProvider key={key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={role.color}>
                    <role.icon className="h-3 w-3 mr-1" />
                    {role.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{role.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Users Table */}
        <div className="border rounded-md border-base-gray">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Access Level</TableHead>
                {canManagePermissions && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-deep-brand">{user.name}</div>
                        <div className="text-sm text-base-gray">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.organization}</TableCell>
                    <TableCell>
                      {(() => {
                        const RoleIcon = ROLES[user.role].icon
                        return (
                          <Badge variant="outline" className={ROLES[user.role].color}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {ROLES[user.role].name}
                          </Badge>
                        )
                      })()}
                    </TableCell>
                    {canManagePermissions && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.id !== currentUserId && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsEditRoleDialogOpen(true)
                                }}
                                aria-label={`Edit ${user.name}'s permissions`}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsRemoveUserDialogOpen(true)
                                }}
                                aria-label={`Remove ${user.name}'s access`}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canManagePermissions ? 4 : 3} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-base-gray">
                      <Users className="h-8 w-8 mb-2" />
                      <p>No users found</p>
                      {searchQuery && <p className="text-sm">Try a different search term</p>}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 border-base-gray">
        <div className="flex items-center text-sm text-base-gray">
          <Info className="h-4 w-4 mr-1" />
          {users.length} {users.length === 1 ? "user" : "users"} with access
        </div>

        {!canManagePermissions && (
          <div className="text-sm text-base-gray">Contact the resource owner to request changes</div>
        )}
      </CardFooter>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Access</DialogTitle>
            <DialogDescription>Change access level for {selectedUser?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Permission Level</Label>
              <Select
                value={selectedUser?.role}
                onValueChange={(value) => {
                  if (selectedUser) {
                    setSelectedUser({ ...selectedUser, role: value as keyof typeof ROLES })
                  }
                }}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLES).map(([key, role]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <role.icon className="h-4 w-4" />
                        <span>{role.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-2 text-sm text-base-gray">
                {selectedUser?.role && ROLES[selectedUser.role].description}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)} disabled={isEditingPermission}>
              Cancel
            </Button>
            <Button
              className="bg-electric-blue text-white hover:bg-royal-blue"
              onClick={handleUpdateRole}
              disabled={isEditingPermission}
            >
              {isEditingPermission ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove User Dialog */}
      <Dialog open={isRemoveUserDialogOpen} onOpenChange={setIsRemoveUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove User Access</DialogTitle>
            <DialogDescription>Are you sure you want to remove access for {selectedUser?.name}?</DialogDescription>
          </DialogHeader>

          <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-md mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              This action cannot be undone. The user will lose all access to this resource.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveUserDialogOpen(false)} disabled={isRemovingUser}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveUser} disabled={isRemovingUser}>
              {isRemovingUser ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  Remove Access
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PermissionsManager
