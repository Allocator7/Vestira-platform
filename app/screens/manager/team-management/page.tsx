"use client"

import { useState, useCallback, useMemo } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Users,
  UserPlus,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  UserCog,
  History,
  Building,
  MoreHorizontal,
  Edit,
  Mail,
  X,
  Check,
  Trash,
  Filter,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "pending" | "inactive"
  lastActive: string
  avatar?: string
  permissions: string[]
  dateAdded: string
  addedBy: string
  twoFactorEnabled: boolean
  accessLevel: "admin" | "editor" | "viewer"
}

type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
  memberCount: number
  createdAt: string
  lastUpdated: string
  isCustom: boolean
}

type Department = {
  id: string
  name: string
  description: string
  memberCount: number
  head: string
  createdAt: string
}

type ActivityLog = {
  id: string
  user: string
  action: string
  resource: string
  timestamp: string
  details: string
  ipAddress: string
  status: "success" | "warning" | "error"
}

type InvitationStatus = {
  id: string
  email: string
  role: string
  department: string
  invitedBy: string
  invitedAt: string
  status: "pending" | "accepted" | "expired"
  expiresAt: string
}

export default function TeamManagementPage() {
  const { toast } = useToast()

  // Initial data
  const initialTeamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@vestira.com",
      role: "Investment Director",
      department: "Investment Team",
      status: "active",
      lastActive: "Just now",
      avatar: "/placeholder.svg?height=40&width=40",
      permissions: ["view_all", "edit_documents", "manage_datarooms", "invite_users"],
      dateAdded: "2023-01-15",
      addedBy: "Admin",
      twoFactorEnabled: true,
      accessLevel: "admin",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@vestira.com",
      role: "Portfolio Manager",
      department: "Investment Team",
      status: "active",
      lastActive: "5 minutes ago",
      avatar: "/placeholder.svg?height=40&width=40",
      permissions: ["view_all", "edit_documents", "manage_datarooms"],
      dateAdded: "2023-02-10",
      addedBy: "Sarah Johnson",
      twoFactorEnabled: true,
      accessLevel: "editor",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@vestira.com",
      role: "Compliance Officer",
      department: "Legal & Compliance",
      status: "active",
      lastActive: "1 hour ago",
      avatar: "/placeholder.svg?height=40&width=40",
      permissions: ["view_all", "compliance_review", "audit_logs"],
      dateAdded: "2023-03-05",
      addedBy: "Admin",
      twoFactorEnabled: true,
      accessLevel: "editor",
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.kim@vestira.com",
      role: "Analyst",
      department: "Investment Team",
      status: "active",
      lastActive: "3 hours ago",
      avatar: "/placeholder.svg?height=40&width=40",
      permissions: ["view_documents", "comment"],
      dateAdded: "2023-04-20",
      addedBy: "Sarah Johnson",
      twoFactorEnabled: false,
      accessLevel: "viewer",
    },
  ]

  const initialRoles: Role[] = [
    {
      id: "1",
      name: "Administrator",
      description: "Full system access with user management capabilities",
      permissions: ["view_all", "edit_all", "admin", "user_management", "security_settings"],
      memberCount: 2,
      createdAt: "2023-01-01",
      lastUpdated: "2023-05-15",
      isCustom: false,
    },
    {
      id: "2",
      name: "Investment Team",
      description: "Access to investment data and document management",
      permissions: ["view_all", "edit_documents", "manage_datarooms", "comment"],
      memberCount: 3,
      createdAt: "2023-01-01",
      lastUpdated: "2023-04-10",
      isCustom: false,
    },
  ]

  const initialDepartments: Department[] = [
    {
      id: "1",
      name: "Investment Team",
      description: "Manages investment strategy and portfolio management",
      memberCount: 3,
      head: "Sarah Johnson",
      createdAt: "2023-01-01",
    },
    {
      id: "2",
      name: "Legal & Compliance",
      description: "Handles regulatory compliance and legal matters",
      memberCount: 2,
      head: "Emily Rodriguez",
      createdAt: "2023-01-01",
    },
  ]

  const initialActivityLogs: ActivityLog[] = [
    {
      id: "1",
      user: "Sarah Johnson",
      action: "Invited user",
      resource: "Sophia Martinez",
      timestamp: "2023-06-01 09:15:22",
      details: "Invited new team member with Legal Counsel role",
      ipAddress: "192.168.1.105",
      status: "success",
    },
    {
      id: "2",
      user: "Michael Chen",
      action: "Modified document permissions",
      resource: "Q1 2023 Performance Report",
      timestamp: "2023-06-01 10:30:45",
      details: "Changed access from restricted to team-wide",
      ipAddress: "192.168.1.107",
      status: "success",
    },
  ]

  // State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs)
  const [pendingInvitations, setPendingInvitations] = useState<InvitationStatus[]>([])

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [accessLevelFilter, setAccessLevelFilter] = useState("all")

  // Modals
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false)
  const [editUserModalOpen, setEditUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null)

  // Form state
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [newUserDepartment, setNewUserDepartment] = useState("")
  const [newUserAccessLevel, setNewUserAccessLevel] = useState("viewer")

  // Filter state
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [filterRole, setFilterRole] = useState("All")

  // Filtered team members
  const filteredTeamMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "all" || member.role === roleFilter
      const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
      const matchesStatus = statusFilter === "all" || member.status === statusFilter
      const matchesAccessLevel = accessLevelFilter === "all" || member.accessLevel === accessLevelFilter

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus && matchesAccessLevel
    })
  }, [teamMembers, searchQuery, roleFilter, departmentFilter, statusFilter, accessLevelFilter])

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const departmentMatch = filterDepartment === "All" || member.department === filterDepartment
      const roleMatch = filterRole === "All" || member.role === filterRole
      return departmentMatch && roleMatch
    })
  }, [teamMembers, filterDepartment, filterRole])

  // Handlers
  const handleInviteUser = useCallback(async () => {
    if (!newUserEmail || !newUserRole || !newUserDepartment) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newUser: TeamMember = {
      id: `user-${Date.now()}`,
      name: newUserEmail.split("@")[0],
      email: newUserEmail,
      role: newUserRole,
      department: newUserDepartment,
      status: "pending",
      lastActive: "Never",
      permissions: [],
      dateAdded: new Date().toISOString().split("T")[0],
      addedBy: "Current User",
      twoFactorEnabled: false,
      accessLevel: newUserAccessLevel as "admin" | "editor" | "viewer",
    }

    setTeamMembers((prev) => [...prev, newUser])

    // Reset form
    setNewUserEmail("")
    setNewUserRole("")
    setNewUserDepartment("")
    setNewUserAccessLevel("viewer")
    setInviteUserModalOpen(false)

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newUserEmail}.`,
    })
  }, [newUserEmail, newUserRole, newUserDepartment, newUserAccessLevel, toast])

  const handleEditUser = useCallback((user: TeamMember) => {
    setSelectedUser(user)
    setEditUserModalOpen(true)
  }, [])

  const handleSaveUserEdits = useCallback(async () => {
    if (!selectedUser) return

    setTeamMembers((prev) => prev.map((member) => (member.id === selectedUser.id ? selectedUser : member)))

    setSelectedUser(null)
    setEditUserModalOpen(false)

    toast({
      title: "User updated",
      description: "The user information has been updated successfully.",
    })
  }, [selectedUser, toast])

  // Utility functions
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccessLevelBadgeColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const openEditDialog = (member: TeamMember) => {
    setSelectedUser(member)
    setEditUserModalOpen(true)
  }

  const handleToggleStatus = (memberId: string) => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, status: member.status === "active" ? "inactive" : "active" } : member,
      ),
    )
  }

  const handleDeleteMember = (memberId: string) => {
    setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId))
  }

  return (
    <Screen title="Team Management" description="Manage your team members and their permissions">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep-brand mb-2">Team Management</h1>
          <p className="text-base-gray">Manage your team members and their permissions</p>
        </div>
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                onClick={() => {
                  setNewUserEmail("")
                  setNewUserRole("")
                  setNewUserDepartment("")
                  setNewUserAccessLevel("viewer")
                  setInviteUserModalOpen(true)
                }}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Invite User
              </Button>
            </div>

            {/* Filters */}

            {/* Team Members Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr className="text-left text-sm text-gray-900 border-b">
                        <th className="p-4 font-medium">User</th>
                        <th className="p-4 font-medium">Role & Department</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Access Level</th>
                        <th className="p-4 font-medium">Security</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-600">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={member.role === "Admin" ? "default" : "outline"}>{member.role}</Badge>
                          </td>
                          <td className="hidden px-4 py-3 text-gray-900 md:table-cell">{member.department}</td>
                          <td className="hidden px-4 py-3 text-sm text-gray-600 md:table-cell">{member.lastActive}</td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            <Badge variant={member.status === "active" ? "success" : "secondary"}>
                              {member.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(member)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
                                  {member.status === "active" ? (
                                    <>
                                      <X className="mr-2 h-4 w-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Check className="mr-2 h-4 w-4" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteMember(member.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Roles & Permissions</h3>
                <p className="text-sm text-gray-600">Manage role-based access control for your team</p>
              </div>
              <Button>
                <Shield className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className={role.isCustom ? "border-l-4 border-l-purple-500" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      {role.isCustom && <Badge className="bg-purple-100 text-purple-800">Custom</Badge>}
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      {role.memberCount} members • {role.permissions.length} permissions
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Departments</h3>
                <p className="text-sm text-gray-600">Manage organizational structure and department heads</p>
              </div>
              <Button>
                <Building className="h-4 w-4 mr-2" />
                Create Department
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((department) => (
                <Card key={department.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <CardDescription>{department.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Members:</span>
                      <span className="font-medium">{department.memberCount}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Department Head:</span>
                      <span className="font-medium">{department.head}</span>
                    </div>

                    <div className="text-xs text-gray-500">Created: {department.createdAt}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Activity Log</h3>
                <p className="text-sm text-gray-600">Track user activity and security events</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Log
                </Button>
              </div>
            </div>

            {/* Activity Log Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr className="text-left text-sm text-gray-900 border-b">
                        <th className="p-4 font-medium">Timestamp</th>
                        <th className="p-4 font-medium">User</th>
                        <th className="p-4 font-medium">Action</th>
                        <th className="p-4 font-medium">Resource</th>
                        <th className="p-4 font-medium">Details</th>
                        <th className="p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-sm">
                            <div className="font-mono">{log.timestamp}</div>
                            <div className="text-xs text-gray-500">{log.ipAddress}</div>
                          </td>
                          <td className="p-4 text-sm font-medium">{log.user}</td>
                          <td className="p-4 text-sm">{log.action}</td>
                          <td className="p-4 text-sm">{log.resource}</td>
                          <td className="p-4 text-sm">{log.details}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              {getActivityStatusIcon(log.status)}
                              <span className={`text-sm ${getActivityStatusColor(log.status)}`}>{log.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite User Modal */}
      <Dialog open={inviteUserModalOpen} onOpenChange={setInviteUserModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(teamMembers.map((member) => member.role))).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={newUserDepartment} onValueChange={setNewUserDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-level">Access Level</Label>
              <Select value={newUserAccessLevel} onValueChange={setNewUserAccessLevel}>
                <SelectTrigger id="access-level">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                  <SelectItem value="editor">Editor - Can edit and create</SelectItem>
                  <SelectItem value="admin">Admin - Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteUserModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteUser} disabled={!newUserEmail || !newUserRole || !newUserDepartment}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editUserModalOpen} onOpenChange={setEditUserModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update user profile and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(teamMembers.map((member) => member.role))).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-access-level">Access Level</Label>
                <Select
                  value={selectedUser.accessLevel}
                  onValueChange={(value) =>
                    setSelectedUser({ ...selectedUser, accessLevel: value as "admin" | "editor" | "viewer" })
                  }
                >
                  <SelectTrigger id="edit-access-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                    <SelectItem value="editor">Editor - Can edit and create</SelectItem>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-mfa"
                  checked={selectedUser.twoFactorEnabled}
                  onCheckedChange={(checked) => setSelectedUser({ ...selectedUser, twoFactorEnabled: checked })}
                />
                <Label htmlFor="edit-mfa" className="text-sm">
                  Two-factor authentication enabled
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUserEdits}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Screen>
  )
}
