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
import { Textarea } from "@/components/ui/textarea"

// Sample team members data for industry group
const teamMembersData = [
  {
    id: "1",
    name: "Jennifer Walsh",
    email: "jennifer.walsh@industrygroup.com",
    role: "Admin",
    department: "Events",
    status: "active",
    avatar: "/abstract-profile.png",
    permissions: ["view", "edit", "delete", "invite"],
    lastActive: "Today at 2:15 PM",
    joinDate: "Jan 15, 2024",
  },
  {
    id: "2",
    name: "Robert Chen",
    email: "robert.chen@industrygroup.com",
    role: "Manager",
    department: "Marketing",
    status: "active",
    avatar: "/stylized-initials-sc.png",
    permissions: ["view", "edit"],
    lastActive: "Yesterday at 4:30 PM",
    joinDate: "Mar 20, 2024",
  },
  {
    id: "3",
    name: "Lisa Martinez",
    email: "lisa.martinez@industrygroup.com",
    role: "Contributor",
    department: "Operations",
    status: "active",
    avatar: "/abstract-dt.png",
    permissions: ["view"],
    lastActive: "Today at 10:45 AM",
    joinDate: "May 12, 2024",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@industrygroup.com",
    role: "Viewer",
    department: "Data",
    status: "inactive",
    avatar: "/abstract-ej-typography.png",
    permissions: ["view"],
    lastActive: "Apr 28, 2024",
    joinDate: "Feb 18, 2024",
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah.johnson@industrygroup.com",
    role: "Manager",
    department: "Marketing",
    status: "active",
    avatar: "/abstract-rk.png",
    permissions: ["view", "edit"],
    lastActive: "Today at 11:20 AM",
    joinDate: "Nov 25, 2023",
  },
]

// Sample departments for industry group
const departments = ["All", "Events", "Marketing", "Operations", "Data", "Member Relations", "Administration"]

// Sample roles
const roles = ["All", "Admin", "Manager", "Contributor", "Viewer"]

export default function IndustryGroupTeamManagementPage() {
  const { toast } = useToast()
  const [teamMembers, setTeamMembers] = useState(teamMembersData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [filterRole, setFilterRole] = useState("All")
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<(typeof teamMembersData)[0] | null>(null)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  })

  // New state for Send Email modal
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false)
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
  })
  const [selectedMemberForEmail, setSelectedMemberForEmail] = useState<(typeof teamMembersData)[0] | null>(null)

  // New state for Permissions modal
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)
  const [selectedMemberForPermissions, setSelectedMemberForPermissions] = useState<(typeof teamMembersData)[0] | null>(null)
  const [permissionsForm, setPermissionsForm] = useState({
    view: false,
    edit: false,
    delete: false,
    invite: false,
  })

  // Filter members based on search and filters
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = filterDepartment === "All" || member.department === filterDepartment
    const matchesRole = filterRole === "All" || member.role === filterRole
    return matchesSearch && matchesDepartment && matchesRole
  })

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role || !newMember.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newMemberData = {
      id: (teamMembers.length + 1).toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      department: newMember.department,
      status: "active" as const,
      avatar: "/placeholder.svg",
      permissions: newMember.role === "Admin" ? ["view", "edit", "delete", "invite"] : 
                   newMember.role === "Manager" ? ["view", "edit"] : 
                   newMember.role === "Contributor" ? ["view", "edit"] : ["view"],
      lastActive: "Just now",
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }

    setTeamMembers([...teamMembers, newMemberData])
    setNewMember({ name: "", email: "", role: "", department: "" })
    setIsAddMemberOpen(false)
    toast({
      title: "Member Added",
      description: `${newMember.name} has been added to the team.`,
    })
  }

  const handleEditMember = () => {
    if (!currentMember) return

    const updatedMembers = teamMembers.map((member) =>
      member.id === currentMember.id ? { ...currentMember } : member,
    )
    setTeamMembers(updatedMembers)
    setIsEditMemberOpen(false)
    setCurrentMember(null)
    toast({
      title: "Member Updated",
      description: `${currentMember.name}'s information has been updated.`,
    })
  }

  const handleDeleteMember = (id: string) => {
    const member = teamMembers.find((m) => m.id === id)
    if (member && confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id))
      toast({
        title: "Member Removed",
        description: `${member.name} has been removed from the team.`,
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

  const handleSendEmail = (member: (typeof teamMembersData)[0]) => {
    setSelectedMemberForEmail(member)
    setEmailForm({ subject: "", message: "" })
    setIsSendEmailOpen(true)
  }

  const handleSendEmailSubmit = () => {
    if (!selectedMemberForEmail) return
    
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message.",
        variant: "destructive",
      })
      return
    }

    // Simulate sending email
    toast({
      title: "Email Sent",
      description: `Email sent to ${selectedMemberForEmail.name} at ${selectedMemberForEmail.email}.`,
    })
    
    setIsSendEmailOpen(false)
    setSelectedMemberForEmail(null)
    setEmailForm({ subject: "", message: "" })
  }

  const handleManagePermissions = (member: (typeof teamMembersData)[0]) => {
    setSelectedMemberForPermissions(member)
    setPermissionsForm({
      view: member.permissions.includes("view"),
      edit: member.permissions.includes("edit"),
      delete: member.permissions.includes("delete"),
      invite: member.permissions.includes("invite"),
    })
    setIsPermissionsOpen(true)
  }

  const handlePermissionsSubmit = () => {
    if (!selectedMemberForPermissions) return

    const newPermissions = []
    if (permissionsForm.view) newPermissions.push("view")
    if (permissionsForm.edit) newPermissions.push("edit")
    if (permissionsForm.delete) newPermissions.push("delete")
    if (permissionsForm.invite) newPermissions.push("invite")

    // Update member permissions
    const updatedMembers = teamMembers.map((member) =>
      member.id === selectedMemberForPermissions.id 
        ? { ...member, permissions: newPermissions }
        : member
    )
    setTeamMembers(updatedMembers)

    // Log the update for debugging
    console.log(`Updated permissions for ${selectedMemberForPermissions.name}:`, newPermissions)

    toast({
      title: "Permissions Updated Successfully",
      description: `${selectedMemberForPermissions.name}'s permissions have been updated and saved.`,
    })
    
    setIsPermissionsOpen(false)
    setSelectedMemberForPermissions(null)
    setPermissionsForm({ view: false, edit: false, delete: false, invite: false })
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
            <h1 className="text-3xl font-bold tracking-tight text-deep-brand">Team Management</h1>
            <p className="text-base-gray">Manage your team members and their permissions</p>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-deep-brand hover:bg-deep-brand/90 text-white"
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
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their access permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
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
                  <SelectTrigger className="w-[140px]">
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

            <Tabs defaultValue="all" className="mt-6">
              <TabsList>
                <TabsTrigger value="all">All Members ({filteredMembers.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({filteredMembers.filter((m) => m.status === "active").length})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({filteredMembers.filter((m) => m.status === "inactive").length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No team members found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Member</th>
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
                              <Badge variant={member.role === "Admin" ? "default" : "outline"}>{member.role}</Badge>
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

      {/* Send Email Modal */}
      <Dialog open={isSendEmailOpen} onOpenChange={setIsSendEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email to {selectedMemberForEmail?.name}</DialogTitle>
            <DialogDescription>
              Send a direct email to {selectedMemberForEmail?.email}
            </DialogDescription>
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
              <Textarea
                id="email-message"
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmailSubmit}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Modal */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions for {selectedMemberForPermissions?.name}</DialogTitle>
            <DialogDescription>
              Configure access permissions for {selectedMemberForPermissions?.role} role
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>View Content</Label>
                  <p className="text-sm text-gray-500">Can view team content and member information</p>
                </div>
                <Switch
                  checked={permissionsForm.view}
                  onCheckedChange={(checked) => setPermissionsForm({ ...permissionsForm, view: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Edit Content</Label>
                  <p className="text-sm text-gray-500">Can edit team content and member information</p>
                </div>
                <Switch
                  checked={permissionsForm.edit}
                  onCheckedChange={(checked) => setPermissionsForm({ ...permissionsForm, edit: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Delete Content</Label>
                  <p className="text-sm text-gray-500">Can delete team content and remove members</p>
                </div>
                <Switch
                  checked={permissionsForm.delete}
                  onCheckedChange={(checked) => setPermissionsForm({ ...permissionsForm, delete: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Invite Members</Label>
                  <p className="text-sm text-gray-500">Can invite new members to the team</p>
                </div>
                <Switch
                  checked={permissionsForm.invite}
                  onCheckedChange={(checked) => setPermissionsForm({ ...permissionsForm, invite: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePermissionsSubmit}>
              <Shield className="mr-2 h-4 w-4" />
              Update Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Modal */}
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update member information and role</DialogDescription>
          </DialogHeader>
          {currentMember && (
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
                      <SelectValue />
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
                      <SelectValue />
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Update Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
