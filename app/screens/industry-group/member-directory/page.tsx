"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { InviteMemberModal } from "@/components/industry-group/InviteMemberModal"
import { MemberProfileModal } from "@/components/industry-group/MemberProfileModal"
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building,
  Users,
  UserPlus,
  MapPin,
  Calendar,
  Globe,
  Award,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  FileText,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Member {
  id: string
  name: string
  type: string
  contactPerson: string
  email: string
  phone: string
  location: string
  memberSince: string
  aum: string
  status: string
  website: string
  specializations: string[]
  membershipTier: string
  organization?: string
}

const initialMembers: Member[] = [
  {
    id: "1",
    name: "California Public Employees' Retirement System",
    type: "Public Pension",
    contactPerson: "Sarah Johnson",
    email: "sarah.johnson@calpers.ca.gov",
    phone: "+1 (916) 795-3000",
    location: "Sacramento, CA",
    memberSince: "2018",
    aum: "$469B",
    status: "active",
    website: "www.calpers.ca.gov",
    specializations: ["Public Equity", "Private Equity", "Real Estate"],
    membershipTier: "premium",
    organization: "CalPERS",
  },
  {
    id: "2",
    name: "Teachers Insurance and Annuity Association",
    type: "Insurance",
    contactPerson: "Michael Chen",
    email: "m.chen@tiaa.org",
    phone: "+1 (212) 490-9000",
    location: "New York, NY",
    memberSince: "2019",
    aum: "$1.2T",
    status: "active",
    website: "www.tiaa.org",
    specializations: ["Fixed Income", "Alternatives", "ESG"],
    membershipTier: "platinum",
    organization: "TIAA",
  },
  {
    id: "3",
    name: "Blackstone Inc.",
    type: "Private Equity",
    contactPerson: "Emily Rodriguez",
    email: "emily.rodriguez@blackstone.com",
    phone: "+1 (212) 583-5000",
    location: "New York, NY",
    memberSince: "2020",
    aum: "$991B",
    status: "active",
    website: "www.blackstone.com",
    specializations: ["Private Equity", "Real Estate", "Credit"],
    membershipTier: "premium",
    organization: "Blackstone",
  },
  {
    id: "4",
    name: "Ontario Teachers' Pension Plan",
    type: "Public Pension",
    contactPerson: "David Kim",
    email: "d.kim@otpp.com",
    phone: "+1 (416) 228-5900",
    location: "Toronto, ON",
    memberSince: "2021",
    aum: "$247B",
    status: "pending",
    website: "www.otpp.com",
    specializations: ["Infrastructure", "Private Equity", "Public Equity"],
    membershipTier: "standard",
    organization: "OTPP",
  },
]

export default function MemberDirectoryPage() {
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [inMailModalOpen, setInMailModalOpen] = useState(false)
  const [selectedMemberForInMail, setSelectedMemberForInMail] = useState<any>(null)
  const [inMailSubject, setInMailSubject] = useState("")
  const [inMailMessage, setInMailMessage] = useState("")

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

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || member.type === typeFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    const matchesTier = tierFilter === "all" || member.membershipTier === tierFilter
    return matchesSearch && matchesType && matchesStatus && matchesTier
  })

  const handleMemberInvited = (newMember: Member) => {
    setMembers((prev) => [...prev, newMember])
  }

  const handleMemberUpdate = (updatedMember: Member) => {
    setMembers((prev) => prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)))
  }

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberId])
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== memberId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map((member) => member.id))
    } else {
      setSelectedMembers([])
    }
  }

  const handleBulkEmail = async () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "No Members Selected",
        description: "Please select members to send emails to.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Emails Sent",
      description: `Sent emails to ${selectedMembers.length} selected members.`,
    })

    setIsLoading(false)
    setSelectedMembers([])
  }

  const handleBulkExport = async () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "No Members Selected",
        description: "Please select members to export.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Export Complete",
      description: `Exported ${selectedMembers.length} member records.`,
    })

    setIsLoading(false)
  }

  const handleDeleteMember = async (memberId: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setMembers((prev) => prev.filter((member) => member.id !== memberId))

    toast({
      title: "Member Removed",
      description: "Member has been removed from the directory.",
    })

    setIsLoading(false)
  }

  const handleViewProfile = (member: Member) => {
    setSelectedMember(member)
    setProfileModalOpen(true)
  }

  const handleSendInMail = async () => {
    if (!inMailSubject.trim() || !inMailMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "VeMail Sent",
      description: `Your message has been sent to ${selectedMemberForInMail?.name}.`,
    })

    setIsLoading(false)
    setInMailModalOpen(false)
    setInMailSubject("")
    setInMailMessage("")
  }

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    newThisMonth: members.filter((m) => Number.parseInt(m.memberSince) === 2024).length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Member Directory</h1>
          <p className="text-gray-600 mt-1">Manage organization members and their profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkExport} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export Directory
          </Button>
          <Button onClick={() => setInviteModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Year</p>
                <p className="text-2xl font-bold">{stats.newThisMonth}</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members by name, contact, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Public Pension">Public Pension</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Private Equity">Private Equity</SelectItem>
                <SelectItem value="Hedge Fund">Hedge Fund</SelectItem>
                <SelectItem value="Asset Manager">Asset Manager</SelectItem>
                <SelectItem value="Consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              toast({
                title: "More Filters",
                description: "Advanced filtering options will be available here.",
              })
            }}>
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedMembers.length === filteredMembers.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="font-medium">{selectedMembers.length} members selected</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkEmail} disabled={isLoading}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkExport} disabled={isLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedMembers([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Member Organizations</CardTitle>
          <CardDescription>{filteredMembers.length} members found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => handleSelectMember(member.id, checked as boolean)}
                  />
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      {getStatusBadge(member.status)}
                      {getTierBadge(member.membershipTier)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{member.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{member.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {member.memberSince}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>AUM: {member.aum}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a href={`https://${member.website}`} className="text-blue-600 hover:underline">
                          {member.website}
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {member.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedMemberForInMail(member)
                      setInMailModalOpen(true)
                    }}
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    VeMail
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(`tel:${member.phone}`)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" onClick={() => handleViewProfile(member)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Member
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        View Documents
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <InviteMemberModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onMemberInvited={handleMemberInvited}
      />

      <MemberProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        member={selectedMember}
        onMemberUpdate={handleMemberUpdate}
      />

      {/* InMail Modal */}
      <Dialog open={inMailModalOpen} onOpenChange={setInMailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send VeMail to {selectedMemberForInMail?.name}
            </DialogTitle>
            <DialogDescription>
              Send a direct message to {selectedMemberForInMail?.name} at {selectedMemberForInMail?.organization}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inmail-subject">Subject</Label>
              <Input
                id="inmail-subject"
                placeholder="Enter message subject..."
                value={inMailSubject}
                onChange={(e) => setInMailSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inmail-message">Message</Label>
              <Textarea
                id="inmail-message"
                placeholder="Type your message here..."
                value={inMailMessage}
                onChange={(e) => setInMailMessage(e.target.value)}
                rows={6}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>VeMail:</strong> This message will be delivered directly to {selectedMemberForInMail?.name}
                even if you're not connected. VeMail messages have higher visibility and response rates.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setInMailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInMail} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send VeMail"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
