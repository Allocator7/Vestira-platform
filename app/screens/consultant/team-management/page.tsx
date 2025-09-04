"use client"

import { useState } from "react"
import { Check, Edit, Mail, MoreHorizontal, Plus, Search, Trash, UserPlus, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Sample team members data for consultant with enhanced roles and permissions
const teamMembersData = [
  {
    id: "1",
    name: "Jennifer Walsh",
    email: "jennifer.walsh@consultant.com",
    role: "Admin",
    department: "Advisory Services",
    status: "active",
    avatar: "/abstract-profile.png",
    permissions: ["view", "edit", "delete", "invite", "manage_team", "manage_clients", "manage_data_rooms"],
    lastActive: "Today at 2:15 PM",
    joinDate: "Jan 15, 2023",
  },
  {
    id: "2",
    name: "Robert Chen",
    email: "robert.chen@consultant.com",
    role: "Manager",
    department: "Market Research",
    status: "active",
    avatar: "/stylized-initials-sc.png",
    permissions: ["view", "edit", "manage_clients", "manage_data_rooms"],
    lastActive: "Yesterday at 4:30 PM",
    joinDate: "Mar 20, 2023",
  },
  {
    id: "3",
    name: "Lisa Martinez",
    email: "lisa.martinez@consultant.com",
    role: "Contributor",
    department: "Client Relations",
    status: "active",
    avatar: "/abstract-dt.png",
    permissions: ["view", "edit"],
    lastActive: "Today at 10:45 AM",
    joinDate: "May 12, 2023",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@consultant.com",
    role: "Viewer",
    department: "Research",
    status: "inactive",
    avatar: "/abstract-ej-typography.png",
    permissions: ["view"],
    lastActive: "Apr 28, 2023",
    joinDate: "Feb 18, 2023",
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah.johnson@consultant.com",
    role: "Manager",
    department: "Advisory Services",
    status: "active",
    avatar: "/abstract-rk.png",
    permissions: ["view", "edit", "manage_clients"],
    lastActive: "Today at 11:20 AM",
    joinDate: "Nov 25, 2022",
  },
]

// Sample departments for consultant
const departments = [
  "All",
  "Advisory Services",
  "Market Research",
  "Client Relations",
  "Research",
  "Operations",
  "Business Development",
  "Due Diligence",
  "Portfolio Management",
]

// Sample roles with permissions mapping
const roles = ["All", "Admin", "Manager", "Contributor", "Viewer"]

// Role permissions mapping
const rolePermissions = {
  Admin: ["view", "edit", "delete", "invite", "manage_team", "manage_clients", "manage_data_rooms", "manage_insights"],
  Manager: ["view", "edit", "manage_clients", "manage_data_rooms", "manage_insights"],
  Contributor: ["view", "edit"],
  Viewer: ["view"],
}



export default function ConsultantTeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState(teamMembersData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [filterRole, setFilterRole] = useState("All")
  const [showInactive, setShowInactive] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<(typeof teamMembersData)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Viewer",
    department: "Research",
  })
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
  })
  const [permissionsForm, setPermissionsForm] = useState<string[]>([])

  const { toast } = useToast()

  // Filter team members based on search query, filters, and active tab
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = filterDepartment === "All" || member.department === filterDepartment
    const matchesRole = filterRole === "All" || member.role === filterRole
    const matchesStatus = showInactive ? true : member.status === "active"

    if (activeTab === "active") return member.status === "active" && matchesSearch && matchesDepartment && matchesRole
    if (activeTab === "inactive")
      return member.status === "inactive" && matchesSearch && matchesDepartment && matchesRole
    if (activeTab === "admin") return member.role === "Manager" && matchesSearch && matchesDepartment && matchesStatus

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus
  })

  const handleAddMember = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const newTeamMember = {
      id,
      ...newMember,
      status: "active",
      avatar: "",
      permissions: ["view"],
      lastActive: "Just now",
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }

    setTeamMembers([...teamMembers, newTeamMember])
    setNewMember({
      name: "",
      email: "",
      role: "Associate",
      department: "Research",
    })
    setIsAddMemberOpen(false)

    toast({
      title: "Team member added",
      description: `${newTeamMember.name} has been added to your team.`,
    })
  }

  const handleEditMember = () => {
    if (!currentMember) return

    setTeamMembers(teamMembers.map((member) => (member.id === currentMember.id ? currentMember : member)))
    setIsEditMemberOpen(false)
    setCurrentMember(null)

    toast({
      title: "Team member updated",
      description: `${currentMember.name}'s information has been updated.`,
    })
  }

  const handleDeleteMember = (id: string) => {
    const memberToDelete = teamMembers.find((member) => member.id === id)
    setTeamMembers(teamMembers.filter((member) => member.id !== id))

    if (memberToDelete) {
      toast({
        title: "Team member removed",
        description: `${memberToDelete.name} has been removed from your team.`,
      })
    }
  }

    const handleToggleStatus = (id: string) => {          
    setTeamMembers(                 
      teamMembers.map((member) =>   
        member.id === id ? { ...member, status: member.status === "active" ? "inactive" : "active" } : member,      
      ),
    )
  }

  const handleSendEmail = (member: any) => {
    setCurrentMember(member)
    setEmailForm({
      subject: "",
      message: "",
    })
    setIsEmailModalOpen(true)
  }

  const handleManagePermissions = (member: any) => {
    setCurrentMember(member)
    setPermissionsForm([...member.permissions])
    setIsPermissionsModalOpen(true)
  }

  const handleSendEmailSubmit = () => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Email sent",
      description: `Email sent to ${currentMember?.name} at ${currentMember?.email}`,
    })
    
    setIsEmailModalOpen(false)
    setEmailForm({ subject: "", message: "" })
    setCurrentMember(null)
  }

  const handlePermissionsSubmit = () => {
    if (!currentMember) return

    setTeamMembers(teamMembers.map((member) => 
      member.id === currentMember.id 
        ? { ...member, permissions: permissionsForm }
        : member
    ))

    toast({
      title: "Permissions updated",
      description: `Permissions updated for ${currentMember.name}`,
    })
    
    setIsPermissionsModalOpen(false)
    setPermissionsForm([])
    setCurrentMember(null)
  }

  const togglePermission = (permission: string) => {
    setPermissionsForm(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const openEditDialog = (member: (typeof teamMembersData)[0]) => {
    setCurrentMember(member)
    setIsEditMemberOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deepBrand">Team Management</h1>
            <p className="text-deepBrand">Manage your team members and their permissions</p>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-deepBrand hover:bg-deepBrand/90 text-white"
                onClick={() => setIsAddMemberOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>Invite a new member to join your team</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles
                          .filter((role) => role !== "All")
                          .map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newMember.department}
                      onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments
                          .filter((dept) => dept !== "All")
                          .map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={!newMember.name || !newMember.email}
                  className="bg-deepBrand hover:bg-deepBrand/90 text-white disabled:bg-gray-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Member Dialog */}
          {currentMember && (
            <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Team Member</DialogTitle>
                  <DialogDescription>Update team member information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={currentMember.name}
                      onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={currentMember.email}
                      onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-role">Role</Label>
                      <Select
                        value={currentMember.role}
                        onValueChange={(value) => setCurrentMember({ ...currentMember, role: value })}
                      >
                        <SelectTrigger id="edit-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles
                            .filter((role) => role !== "All")
                            .map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-department">Department</Label>
                      <Select
                        value={currentMember.department}
                        onValueChange={(value) => setCurrentMember({ ...currentMember, department: value })}
                      >
                        <SelectTrigger id="edit-department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments
                            .filter((dept) => dept !== "All")
                            .map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-status"
                        checked={currentMember.status === "active"}
                        onCheckedChange={(checked) =>
                          setCurrentMember({ ...currentMember, status: checked ? "active" : "inactive" })
                        }
                      />
                      <Label htmlFor="edit-status" className="cursor-pointer">
                        {currentMember.status === "active" ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditMemberOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditMember} className="bg-deepBrand hover:bg-deepBrand/90 text-white">
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Send Email Modal */}
          <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Email to {currentMember?.name}</DialogTitle>
                <DialogDescription>Send an email message to {currentMember?.email}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    placeholder="Enter email subject"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-message">Message</Label>
                  <textarea
                    id="email-message"
                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                    placeholder="Enter your message"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendEmailSubmit} className="bg-deepBrand hover:bg-deepBrand/90 text-white">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Manage Permissions Modal */}
          <Dialog open={isPermissionsModalOpen} onOpenChange={setIsPermissionsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Permissions for {currentMember?.name}</DialogTitle>
                <DialogDescription>Update access permissions for {currentMember?.name}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Available Permissions</Label>
                  <div className="space-y-2">
                    {[
                      { key: "view", label: "View Content", description: "Can view documents and data" },
                      { key: "edit", label: "Edit Content", description: "Can edit documents and data" },
                      { key: "delete", label: "Delete Content", description: "Can delete documents and data" },
                      { key: "invite", label: "Invite Users", description: "Can invite new team members" },
                      { key: "manage_team", label: "Manage Team", description: "Can manage team members" },
                      { key: "manage_clients", label: "Manage Clients", description: "Can manage client relationships" },
                      { key: "manage_data_rooms", label: "Manage Data Rooms", description: "Can manage data room access" },
                      { key: "manage_insights", label: "Manage Insights", description: "Can manage insights and reports" },
                    ].map((permission) => (
                      <div key={permission.key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={permission.key}
                          checked={permissionsForm.includes(permission.key)}
                          onChange={() => togglePermission(permission.key)}
                          className="h-4 w-4 rounded border-gray-300 text-deepBrand focus:ring-deepBrand"
                        />
                        <div className="flex-1">
                          <Label htmlFor={permission.key} className="text-sm font-medium cursor-pointer">
                            {permission.label}
                          </Label>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPermissionsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePermissionsSubmit} className="bg-deepBrand hover:bg-deepBrand/90 text-white">
                  <Shield className="mr-2 h-4 w-4" />
                  Update Permissions
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-deepBrand">Team Members</CardTitle>
            <CardDescription className="text-deepBrand">
              Manage your team members and their access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search team members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6 flex items-center">
              <Switch id="show-inactive" checked={showInactive} onCheckedChange={setShowInactive} />
              <Label htmlFor="show-inactive" className="ml-2">
                Show inactive members
              </Label>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 bg-gray-100">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  All Members
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="inactive"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Inactive
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Managers
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {filteredMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <UserPlus className="mb-4 h-12 w-12 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-900">No team members found</h3>
                    <p className="text-sm text-gray-700">Try adjusting your filters or add new team members</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Role</th>
                          <th className="hidden px-4 py-3 text-left text-sm font-medium text-gray-900 md:table-cell">
                            Department
                          </th>
                          <th className="hidden px-4 py-3 text-left text-sm font-medium text-gray-900 md:table-cell">
                            Last Active
                          </th>
                          <th className="hidden px-4 py-3 text-left text-sm font-medium text-gray-900 md:table-cell">
                            Status
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar>
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
                            <td className="px-4 py-3">
                              <Badge variant={member.role === "Manager" ? "default" : "outline"}>{member.role}</Badge>
                            </td>
                            <td className="hidden px-4 py-3 text-gray-900 md:table-cell">{member.department}</td>
                            <td className="hidden px-4 py-3 text-sm text-gray-600 md:table-cell">
                              {member.lastActive}
                            </td>
                            <td className="hidden px-4 py-3 md:table-cell">
                              <Badge variant={member.status === "active" ? "default" : "outline"}>
                                {member.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
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
                                  <DropdownMenuItem onClick={() => handleSendEmail(member)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleManagePermissions(member)}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Permissions
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
                                    <span className="flex items-center">
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
                                    </span>
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
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
