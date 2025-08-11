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
import { useToast } from "@/components/ui/use-toast"

// Sample team members data for allocator
const teamMembersData = [
  {
    id: "1",
    name: "Michael Thompson",
    email: "michael.thompson@allocator.com",
    role: "Admin",
    department: "Investment Committee",
    status: "active",
    avatar: "/abstract-profile.png",
    permissions: ["view", "edit", "delete", "invite"],
    lastActive: "Today at 11:15 AM",
    joinDate: "Jan 10, 2023",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@allocator.com",
    role: "Manager",
    department: "Due Diligence",
    status: "active",
    avatar: "/stylized-initials-sc.png",
    permissions: ["view", "edit"],
    lastActive: "Yesterday at 3:20 PM",
    joinDate: "Mar 15, 2023",
  },
  {
    id: "3",
    name: "David Rodriguez",
    email: "david.rodriguez@allocator.com",
    role: "Contributor",
    department: "Research",
    status: "active",
    avatar: "/abstract-dt.png",
    permissions: ["view"],
    lastActive: "Today at 9:30 AM",
    joinDate: "May 8, 2023",
  },
  {
    id: "4",
    name: "Jennifer Kim",
    email: "jennifer.kim@allocator.com",
    role: "Viewer",
    department: "Operations",
    status: "inactive",
    avatar: "/abstract-ej-typography.png",
    permissions: ["view"],
    lastActive: "Apr 25, 2023",
    joinDate: "Feb 12, 2023",
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.wilson@allocator.com",
    role: "Manager",
    department: "Portfolio Management",
    status: "active",
    avatar: "/abstract-rk.png",
    permissions: ["view", "edit"],
    lastActive: "Today at 10:45 AM",
    joinDate: "Nov 20, 2022",
  },
]

// Sample departments for allocator
const departments = [
  "All",
  "Investment Committee",
  "Due Diligence",
  "Research",
  "Operations",
  "Portfolio Management",
  "Legal",
]

// Sample roles
const roles = ["All", "Admin", "Manager", "Contributor", "Viewer"]

export default function AllocatorTeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState(teamMembersData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [filterRole, setFilterRole] = useState("All")
  const [showInactive, setShowInactive] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<(typeof teamMembersData)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Viewer",
    department: "Research",
  })
  // Mock current user - in real app this would come from auth context
  const currentUser = { role: "Admin" }

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
    if (activeTab === "admin") return member.role === "Admin" && matchesSearch && matchesDepartment && matchesStatus

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
      role: "Viewer",
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

  const openEditDialog = (member: (typeof teamMembersData)[0]) => {
    setCurrentMember(member)
    setIsEditMemberOpen(true)
  }

  const handleSendEmail = (member: (typeof teamMembersData)[0]) => {
    // In a real app, this would open an email client or send an email
    toast({
      title: "Email sent",
      description: `Email sent to ${member.name} (${member.email})`,
    })
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
              <div className="flex gap-2 items-center flex-wrap">{/* Filters can be added here */}</div>
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
                  Admins
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
                                  {/* Admin-only actions */}
                                  {currentUser.role === "Admin" && (
                                    <>
                                      <DropdownMenuItem>
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
                                    </>
                                  )}
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
