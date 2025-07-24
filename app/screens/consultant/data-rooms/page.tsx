"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Calendar, FileText, MessageSquare, MoreHorizontal } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// ---------------------------------------------
// Mock data – participants property REMOVED
// ---------------------------------------------
const dataRooms = [
  {
    id: "1",
    name: "Meridian Capital Growth Fund III",
    manager: "Meridian Capital Partners",
    strategy: "Private Equity",
    status: "active",
    stage: "Due Diligence",
    deadline: "June 30, 2025",
    progress: 75,
    documentsCount: 156,
    lastActivity: "2 hours ago",
    description: "Growth-focused private equity fund targeting mid-market companies in North America",
    fundSize: "$850M",
    vintage: "2025",
    geography: "North America",
    sector: "Technology, Healthcare",
    tab: "active",
    avatar: "/abstract-geometric-br.png",
    tags: ["Private Equity", "Growth", "Technology"],
    allocators: ["CalPERS", "OTPP", "State Pension Fund"],
  },
  {
    id: "2",
    name: "Atlas Real Estate Fund IV",
    manager: "Atlas Property Group",
    strategy: "Real Estate",
    status: "pending",
    stage: "Initial Review",
    deadline: "July 15, 2025",
    progress: 35,
    documentsCount: 89,
    lastActivity: "1 day ago",
    description: "Opportunistic real estate fund focusing on commercial properties in major metropolitan areas",
    fundSize: "$1.2B",
    vintage: "2025",
    geography: "US Major Markets",
    sector: "Commercial Real Estate",
    tab: "active",
    avatar: "/roman-numeral-vi.png",
    tags: ["Real Estate", "Commercial", "Opportunistic"],
    allocators: ["Harvard Endowment", "Yale Endowment"],
  },
  {
    id: "3",
    name: "Quantum Infrastructure Partners II",
    manager: "Quantum Infrastructure",
    strategy: "Infrastructure",
    status: "closed",
    stage: "Completed",
    deadline: "May 20, 2025",
    progress: 100,
    documentsCount: 234,
    lastActivity: "1 week ago",
    description: "Infrastructure fund investing in essential services and digital infrastructure",
    fundSize: "$2.1B",
    vintage: "2024",
    geography: "Global",
    sector: "Digital Infrastructure",
    tab: "closed",
    avatar: "/stylized-wm.png",
    tags: ["Infrastructure", "Digital", "Global"],
    allocators: ["Sovereign Wealth Fund", "Public Pension"],
  },
  {
    id: "4",
    name: "Pinnacle Credit Opportunities V",
    manager: "Pinnacle Credit Management",
    strategy: "Private Credit",
    status: "active",
    stage: "Documentation Review",
    deadline: "August 10, 2025",
    progress: 60,
    documentsCount: 178,
    lastActivity: "4 hours ago",
    description: "Direct lending fund providing flexible capital solutions to middle-market companies",
    fundSize: "$650M",
    vintage: "2025",
    geography: "North America",
    sector: "Direct Lending",
    tab: "active",
    avatar: "/FI_logo.png",
    tags: ["Private Credit", "Direct Lending", "Middle Market"],
    allocators: ["Corporate Pension", "Insurance Fund"],
  },
  {
    id: "5",
    name: "Horizon Energy Transition Fund",
    manager: "Horizon Energy Partners",
    strategy: "Energy Transition",
    status: "pending",
    stage: "Preliminary Assessment",
    deadline: "September 5, 2025",
    progress: 20,
    documentsCount: 67,
    lastActivity: "3 days ago",
    description: "Specialized fund investing in renewable energy and clean technology infrastructure",
    fundSize: "$900M",
    vintage: "2025",
    geography: "Europe & North America",
    sector: "Renewable Energy",
    tab: "pending",
    avatar: "/abstract-geometric-ts.png",
    tags: ["Energy Transition", "Renewable", "Clean Tech"],
    allocators: ["Green Investment Fund"],
  },
  {
    id: "6",
    name: "Sterling Healthcare Growth II",
    manager: "Sterling Healthcare Partners",
    strategy: "Healthcare",
    status: "closed",
    stage: "Investment Decision Made",
    deadline: "April 15, 2025",
    progress: 100,
    documentsCount: 198,
    lastActivity: "2 weeks ago",
    description: "Healthcare-focused growth equity fund targeting innovative medical technology companies",
    fundSize: "$750M",
    vintage: "2024",
    geography: "North America",
    sector: "Medical Technology",
    tab: "closed",
    avatar: "/abstract-profile.png",
    tags: ["Healthcare", "Growth Equity", "Medical Tech"],
    allocators: ["Healthcare Fund", "Medical Endowment"],
  },
]

// ---------------------------------------------
// Helper utilities
// ---------------------------------------------
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "closed":
      return "bg-electric-blue/10 text-electric-blue"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// ---------------------------------------------
// Schedule Check-in Modal
// ---------------------------------------------
function ScheduleCheckinModal({
  isOpen,
  onClose,
  roomName,
}: {
  isOpen: boolean
  onClose: () => void
  roomName: string
}) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "30",
    agenda: "",
    participants: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Check-in Scheduled",
      description: `Check-in meeting scheduled for ${roomName} on ${formData.date} at ${formData.time}`,
    })
    onClose()
    setFormData({
      date: "",
      time: "",
      duration: "30",
      agenda: "",
      participants: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Check-in</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger>
                <SelectValue placeholder="30" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="participants">Participants (emails)</Label>
            <Input
              id="participants"
              placeholder="email1@example.com, email2@example.com"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="agenda">Agenda</Label>
            <Textarea
              id="agenda"
              placeholder="Meeting agenda and topics to discuss..."
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Schedule Meeting
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------
// Send Message Modal
// ---------------------------------------------
function SendMessageModal({
  isOpen,
  onClose,
  roomName,
}: {
  isOpen: boolean
  onClose: () => void
  roomName: string
}) {
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
    priority: "normal",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message Sent",
      description: `Message sent regarding ${roomName}`,
    })
    onClose()
    setFormData({
      recipient: "",
      subject: "",
      message: "",
      priority: "normal",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient</Label>
            <Select
              value={formData.recipient}
              onValueChange={(value) => setFormData({ ...formData, recipient: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fund-manager">Fund Manager</SelectItem>
                <SelectItem value="allocator">Allocator</SelectItem>
                <SelectItem value="team-member">Team Member</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder={`Regarding ${roomName}`}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------
// Filters Modal
// ---------------------------------------------
function FiltersModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: {
  isOpen: boolean
  onClose: () => void
  filters: any
  onFiltersChange: (filters: any) => void
}) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApply = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      status: "all",
      strategy: "all",
      geography: "all",
      vintage: "all",
      fundSizeMin: "",
      fundSizeMax: "",
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Data Rooms</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => setLocalFilters({ ...localFilters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Strategy */}
          <div>
            <Label>Strategy</Label>
            <Select
              value={localFilters.strategy}
              onValueChange={(value) => setLocalFilters({ ...localFilters, strategy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Strategies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strategies</SelectItem>
                <SelectItem value="Private Equity">Private Equity</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Private Credit">Private Credit</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Energy Transition">Energy Transition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Geography */}
          <div>
            <Label>Geography</Label>
            <Select
              value={localFilters.geography}
              onValueChange={(value) => setLocalFilters({ ...localFilters, geography: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Geographies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Geographies</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="Global">Global</SelectItem>
                <SelectItem value="US Major Markets">US Major Markets</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Vintage */}
          <div>
            <Label>Vintage Year</Label>
            <Select
              value={localFilters.vintage}
              onValueChange={(value) => setLocalFilters({ ...localFilters, vintage: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------
// Custom dropdown – updated for consultant permissions
// ---------------------------------------------
function CustomDropdown({ room, onScheduleCheckin, onSendMessage, onUpdateStatus }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMenuItemClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onScheduleCheckin(room.name))}
            >
              Schedule Check-in
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onSendMessage(room.name))}
            >
              Send Message
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onUpdateStatus(room.name))}
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------
// Page component
// ---------------------------------------------
export default function ConsultantDataRoomsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStrategy, setSelectedStrategy] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedRoomForSchedule, setSelectedRoomForSchedule] = useState<string>("")
  const [selectedRoomForMessage, setSelectedRoomForMessage] = useState<string>("")
  const [filters, setFilters] = useState({
    status: "all",
    strategy: "all",
    geography: "all",
    vintage: "all",
    fundSizeMin: "",
    fundSizeMax: "",
  })

  // -----------------------
  // Derived & handlers
  // -----------------------
  const filteredDataRooms = dataRooms.filter((room) => {
    const matchesTab = room.tab === activeTab
    const matchesSearch =
      searchQuery === "" ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.strategy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStrategy = selectedStrategy === "all" || room.strategy === selectedStrategy
    const matchesStatus = filters.status === "all" || room.status === filters.status
    const matchesFilterStrategy = filters.strategy === "all" || room.strategy === filters.strategy
    const matchesGeography = filters.geography === "all" || room.geography === filters.geography
    const matchesVintage = filters.vintage === "all" || room.vintage === filters.vintage

    return (
      matchesTab &&
      matchesSearch &&
      matchesStrategy &&
      matchesStatus &&
      matchesFilterStrategy &&
      matchesGeography &&
      matchesVintage
    )
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)

  const handleScheduleCheckin = (roomName: string) => {
    setSelectedRoomForSchedule(roomName)
    setShowScheduleModal(true)
  }

  const handleSendMessage = (roomName: string) => {
    setSelectedRoomForMessage(roomName)
    setShowMessageModal(true)
  }

  const handleUpdateStatus = (roomName: string) => {
    toast({
      title: "Status Updated",
      description: `Status updated for ${roomName}`,
    })
  }

  const handleExportList = () => {
    if (filteredDataRooms.length === 0) return

    const dataToExport = filteredDataRooms.map((room) => ({
      name: room.name,
      manager: room.manager,
      strategy: room.strategy,
      status: room.status,
      stage: room.stage,
      fundSize: room.fundSize,
      vintage: room.vintage,
      geography: room.geography,
      documents: room.documentsCount,
      lastActivity: room.lastActivity,
      deadline: room.deadline,
      tags: room.tags.join(", "),
      allocators: room.allocators.join(", "),
    }))

    const headers = Object.keys(dataToExport[0])
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        headers
          .map((h) => {
            const v = row[h as keyof typeof row]
            return typeof v === "string" && v.includes(",") ? `"${v}"` : v
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `consultant-data-rooms-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Data rooms list exported successfully!",
    })
  }

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deepBrand">Data Rooms</h1>
            <p className="text-deepBrand">Access and manage due diligence data rooms</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={handleExportList}>
              <FileText className="h-4 w-4" />
              Export List
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search + Tabs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search data rooms by name, manager, or strategy..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-9"
                />
              </div>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Strategies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="Private Equity">Private Equity</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Private Credit">Private Credit</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Energy Transition">Energy Transition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-gray-100">
                {(["active", "pending", "closed"] as const).map((key) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                  >
                    {key === "closed" ? "Closed" : key[0].toUpperCase() + key.slice(1)} (
                    {dataRooms.filter((r) => r.tab === key).length})
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="grid gap-6">
                  {filteredDataRooms.map((room) => (
                    <Card key={room.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        {/* Top section */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <img src={room.avatar || "/placeholder.svg"} alt={room.manager} />
                              <AvatarFallback className="font-semibold bg-deepBrand text-white">
                                {room.strategy.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold text-deepBrand mb-1">{room.name}</h3>
                              <p className="text-sm text-baseGray mb-1">
                                {room.manager} • {room.strategy} • {room.fundSize}
                              </p>
                              <p className="text-sm text-baseGray leading-relaxed max-w-2xl">{room.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(room.status)}>
                              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-baseGray" />
                            <span className="text-baseGray">{room.documentsCount} documents</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-baseGray" />
                            <span className="text-baseGray">Due: {room.deadline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-baseGray" />
                            <span className="text-baseGray">Updated {room.lastActivity}</span>
                          </div>
                        </div>

                        {/* Connected allocators */}
                        <div className="mb-4">
                          <p className="text-sm text-baseGray mb-2">Connected Allocators:</p>
                          <div className="flex gap-2 flex-wrap">
                            {room.allocators.map((a) => (
                              <Badge key={a} variant="outline" className="text-xs">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Footer actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 flex-wrap">
                            {room.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => router.push(`/screens/general/data-room-profile?room=${room.id}`)}
                            >
                              <FileText className="h-4 w-4" />
                              Enter Data Room
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 bg-transparent"
                              onClick={() => handleScheduleCheckin(room.name)}
                            >
                              <Calendar className="h-4 w-4" />
                              Schedule Check-in
                            </Button>
                            <Button
                              size="sm"
                              className="flex items-center gap-1 text-white hover:opacity-90"
                              style={{ backgroundColor: "#00B2FF" }}
                              onClick={() => handleSendMessage(room.name)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              Message
                            </Button>
                            <CustomDropdown
                              room={room}
                              onScheduleCheckin={handleScheduleCheckin}
                              onSendMessage={handleSendMessage}
                              onUpdateStatus={handleUpdateStatus}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ScheduleCheckinModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        roomName={selectedRoomForSchedule}
      />
      <SendMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        roomName={selectedRoomForMessage}
      />
      <FiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  )
}
