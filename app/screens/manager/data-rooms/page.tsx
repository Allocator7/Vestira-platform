"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Calendar,
  FileText,
  Download,
  Eye,
  Users,
  Clock,
  MoreHorizontal,
  Plus,
  Settings,
  FolderPlus,
  X,
  Folder,
} from "lucide-react"
import { AccessControlManager } from "@/components/AccessControlManager"

const initialDataRooms = [
  {
    id: 1,
    name: "Infrastructure Fund IV Due Diligence",
    strategy: "Infrastructure",
    status: "Active",
    dataRoomContacts: 12,
    documentsCount: 127,
    lastActivity: "2 hours ago",
    deadline: "Dec 15, 2024",
    description: "Comprehensive due diligence materials for our latest infrastructure fund",
    allocators: ["CalPERS", "OTPP", "State Pension Fund"],
    tags: ["Infrastructure", "ESG", "Global"],
    accessRequests: 3,
    folders: [],
    permissions: [],
  },
  {
    id: 2,
    name: "Growth Equity Fund III",
    strategy: "Growth Equity",
    status: "Draft",
    dataRoomContacts: 8,
    documentsCount: 89,
    lastActivity: "1 day ago",
    deadline: "Jan 30, 2025",
    description: "Growth equity investment opportunities in technology and healthcare",
    allocators: ["Harvard Endowment", "Yale Endowment"],
    tags: ["Growth Equity", "Technology", "Healthcare"],
    accessRequests: 1,
    folders: [],
    permissions: [],
  },
  {
    id: 3,
    name: "Private Credit Strategy 2024",
    strategy: "Private Credit",
    status: "Draft",
    dataRoomContacts: 5,
    documentsCount: 156,
    lastActivity: "3 days ago",
    deadline: "Nov 20, 2024",
    description: "Private credit opportunities in middle-market companies",
    allocators: ["Corporate Pension", "Insurance Fund"],
    tags: ["Private Credit", "Middle Market", "Fixed Income"],
    accessRequests: 0,
    folders: [],
    permissions: [],
  },
  {
    id: 4,
    name: "Real Estate Fund V",
    strategy: "Real Estate",
    status: "Completed",
    dataRoomContacts: 22,
    documentsCount: 203,
    lastActivity: "1 week ago",
    deadline: "Completed",
    description: "Commercial real estate investments across major metropolitan markets",
    allocators: ["Sovereign Wealth Fund", "Public Pension"],
    tags: ["Real Estate", "Commercial", "Core Plus"],
    accessRequests: 0,
    folders: [],
    permissions: [],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Draft":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
      return "bg-electric-blue/10 text-electric-blue"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Custom Dropdown Component
function CustomDropdown({ room, onEnterDataRoom, onEditDetails, onDuplicateRoom, onExportData, onArchiveRoom }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
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
              onClick={() => handleMenuItemClick(() => onEnterDataRoom(room))}
            >
              Enter Data Room
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onEditDetails(room))}
            >
              Edit Details
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onDuplicateRoom(room))}
            >
              Duplicate Room
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onExportData(room))}
            >
              Export Data
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onArchiveRoom(room))}
            >
              Archive Room
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ManagerDataRoomsPage() {
  const router = useRouter()
  const [dataRooms, setDataRooms] = useState(initialDataRooms)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [selectedStrategy, setSelectedStrategy] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showFolderDialog, setShowFolderDialog] = useState(false)
  const [showAccessDialog, setShowAccessDialog] = useState(false)
  const [selectedDataRoom, setSelectedDataRoom] = useState<any>(null)

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [dataRoomContactsFilter, setDataRoomContactsFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  // Form states
  const [newDataRoom, setNewDataRoom] = useState({
    name: "",
    description: "",
    strategy: "",
    deadline: "",
    template: "",
  })
  const [newFolder, setNewFolder] = useState({
    name: "",
    description: "",
    dataRoomId: "",
    permissions: "private" as "public" | "private" | "restricted",
  })

  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  const filteredDataRooms = dataRooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.strategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStrategy = selectedStrategy === "all" || room.strategy === selectedStrategy

    const matchesTab =
      (activeTab === "active" && room.status === "Active") ||
      (activeTab === "pending" && room.status === "Draft") ||
      (activeTab === "closed" && room.status === "Completed")

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(room.status)

    const matchesDataRoomContacts =
      !dataRoomContactsFilter ||
      (dataRoomContactsFilter === "small" && room.dataRoomContacts < 10) ||
      (dataRoomContactsFilter === "medium" && room.dataRoomContacts >= 10 && room.dataRoomContacts < 20) ||
      (dataRoomContactsFilter === "large" && room.dataRoomContacts >= 20)

    return matchesSearch && matchesStrategy && matchesTab && matchesStatus && matchesDataRoomContacts
  })

  const handleOpenCreateDialog = () => {
    console.log("Opening create data room dialog")
    setShowCreateDialog(true)
  }

  const handleOpenFolderDialog = () => {
    console.log("Opening create folder dialog")
    setShowFolderDialog(true)
  }

  const handleExportAnalytics = () => {
    const dataToExport = filteredDataRooms.map((room) => ({
      name: room.name,
      strategy: room.strategy,
      status: room.status,
      dataRoomContacts: room.dataRoomContacts,
      documents: room.documentsCount,
      lastActivity: room.lastActivity,
      deadline: room.deadline,
      allocators: room.allocators.join(", "),
      tags: room.tags.join(", "),
    }))

    // Create CSV content
    const headers = Object.keys(dataToExport[0] || {})
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `data-rooms-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert("Data rooms list exported successfully!")
  }

  const handleCreateDataRoom = async () => {
    console.log("Creating data room with data:", newDataRoom)

    if (!newDataRoom.name.trim()) {
      alert("Please enter a data room name")
      return
    }

    if (!newDataRoom.strategy) {
      alert("Please select a strategy")
      return
    }

    setIsCreating(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new data room object
      const newRoom = {
        id: Math.max(...dataRooms.map((r) => r.id), 0) + 1,
        name: newDataRoom.name.trim(),
        strategy: newDataRoom.strategy,
        status: "Draft" as const,
        dataRoomContacts: 0,
        documentsCount: 0,
        lastActivity: "Just created",
        deadline: newDataRoom.deadline || "TBD",
        description: newDataRoom.description.trim() || `${newDataRoom.strategy} investment opportunities`,
        allocators: [],
        tags: [newDataRoom.strategy],
        accessRequests: 0,
        folders: [],
        permissions: [],
      }

      // Add to dataRooms state
      setDataRooms((prevRooms) => [...prevRooms, newRoom])

      // Reset form
      setNewDataRoom({
        name: "",
        description: "",
        strategy: "",
        deadline: "",
        template: "",
      })

      setShowCreateDialog(false)
      alert(`Data room "${newRoom.name}" created successfully!`)

      console.log("Data room created successfully:", newRoom)
    } catch (error) {
      console.error("Failed to create data room:", error)
      alert("Failed to create data room. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateFolder = async () => {
    console.log("Creating folder with data:", newFolder)

    if (!newFolder.name.trim()) {
      alert("Please enter a folder name")
      return
    }

    if (!newFolder.dataRoomId) {
      alert("Please select a data room")
      return
    }

    setIsCreatingFolder(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find the selected data room
      const selectedDataRoom = dataRooms.find((room) => room.id.toString() === newFolder.dataRoomId)
      if (!selectedDataRoom) {
        throw new Error("Selected data room not found")
      }

      // Create folder object
      const folderData = {
        id: `folder_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: newFolder.name.trim(),
        description: newFolder.description.trim(),
        dataRoomId: Number.parseInt(newFolder.dataRoomId),
        dataRoomName: selectedDataRoom.name,
        createdAt: new Date().toISOString(),
        createdBy: "Current User",
        itemCount: 0,
        permissions: newFolder.permissions,
        lastModified: new Date().toISOString(),
      }

      // Update the data room to include this folder
      setDataRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id.toString() === newFolder.dataRoomId
            ? {
                ...room,
                folders: [...(room.folders || []), folderData],
                lastActivity: "Just now",
              }
            : room,
        ),
      )

      // Reset form
      setNewFolder({
        name: "",
        description: "",
        dataRoomId: "",
        permissions: "private",
      })

      setShowFolderDialog(false)
      alert(`Folder "${folderData.name}" created successfully in "${selectedDataRoom.name}"!`)

      console.log("Folder created successfully:", folderData)
    } catch (error) {
      console.error("Failed to create folder:", error)
      alert("Failed to create folder. Please try again.")
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleEnterDataRoom = (dataRoom: any) => {
    router.push(`/screens/general/data-room-profile?id=${dataRoom.id}&name=${encodeURIComponent(dataRoom.name)}`)
  }

  const handleManageAccess = (dataRoom: any) => {
    setSelectedDataRoom(dataRoom)
    setShowAccessDialog(true)
  }

  const handleViewAnalytics = (dataRoom: any) => {
    alert(
      `Viewing analytics for: ${dataRoom.name}\n\nTotal Views: 342\nUnique Visitors: 28\nDocuments Downloaded: 89\nAverage Time Spent: 24 minutes`,
    )
  }

  const handleManageFiles = (dataRoom: any) => {
    router.push(`/screens/manager/data-rooms/${dataRoom.id}/files?name=${encodeURIComponent(dataRoom.name)}`)
  }

  const clearFilters = () => {
    setStatusFilter([])
    setDataRoomContactsFilter("")
    setDateFilter("")
    setSearchQuery("")
    setSelectedStrategy("all")
  }

  const activeFiltersCount = statusFilter.length + (dataRoomContactsFilter ? 1 : 0) + (dateFilter ? 1 : 0)

  const handleEditDetails = (room: any) => {
    alert(`Opening edit dialog for: ${room.name}`)
  }

  const handleDuplicateRoom = (room: any) => {
    alert(`Duplicating data room: ${room.name}`)
  }

  const handleExportData = (room: any) => {
    const exportData = `Data Room Export: ${room.name}\nStrategy: ${room.strategy}\nData Room Contacts: ${room.dataRoomContacts}\nDocuments: ${room.documentsCount}\nStatus: ${room.status}`
    const blob = new Blob([exportData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${room.name.replace(/\s+/g, "_")}_Export.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert(`Data exported for ${room.name}`)
  }

  const handleArchiveRoom = (room: any) => {
    if (confirm(`Are you sure you want to archive "${room.name}"?`)) {
      alert(`Data room "${room.name}" has been archived`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deepBrand">Data Rooms</h1>
            <p className="text-deepBrand">Manage and share due diligence materials with allocators</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={handleExportAnalytics}
            >
              <Download className="h-4 w-4" />
              Export Analytics
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <div className="flex gap-2 border-l pl-3 ml-1">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                onClick={handleOpenFolderDialog}
              >
                <FolderPlus className="h-4 w-4" />
                Create Folder
              </Button>

              <Button
                className="flex items-center gap-2 bg-deepBrand hover:bg-deepBrand/90 text-white"
                onClick={handleOpenCreateDialog}
              >
                <Plus className="h-4 w-4" />
                Create Data Room
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Advanced Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Status</Label>
                  <div className="space-y-2">
                    {["Active", "Draft", "Completed"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={status}
                          checked={statusFilter.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setStatusFilter([...statusFilter, status])
                            } else {
                              setStatusFilter(statusFilter.filter((s) => s !== status))
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={status} className="text-sm">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Data Room Contacts</Label>
                  <Select value={dataRoomContactsFilter} onValueChange={setDataRoomContactsFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="small">Small (1-9)</SelectItem>
                      <SelectItem value="medium">Medium (10-19)</SelectItem>
                      <SelectItem value="large">Large (20+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Created Date</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search and Tabs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search data rooms by name or strategy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Strategies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Private Equity">Private Equity</SelectItem>
                  <SelectItem value="Private Credit">Private Credit</SelectItem>
                  <SelectItem value="Growth Equity">Growth Equity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-gray-100">
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Active Data Rooms ({dataRooms.filter((r) => r.status === "Active").length})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Pending Access ({dataRooms.filter((r) => r.status === "Draft").length})
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Closed Data Rooms ({dataRooms.filter((r) => r.status === "Completed").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="grid gap-6">
                  {filteredDataRooms.map((room) => (
                    <Card key={room.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4" onClick={() => handleEnterDataRoom(room)}>
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="font-semibold bg-deepBrand text-white">
                                {room.strategy.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold text-deepBrand mb-1 hover:underline">{room.name}</h3>
                              <p className="text-sm text-baseGray mb-1">{room.strategy} Strategy</p>
                              <p className="text-sm text-baseGray leading-relaxed max-w-2xl">{room.description}</p>
                              {room.accessRequests > 0 && (
                                <p className="text-sm text-orange-600 font-medium mt-1">
                                  {room.accessRequests} pending access request{room.accessRequests > 1 ? "s" : ""}
                                </p>
                              )}
                              {room.folders && room.folders.length > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Folder className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm text-blue-600">
                                    {room.folders.length} folder{room.folders.length > 1 ? "s" : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-baseGray" />
                            <span className="text-baseGray">{room.documentsCount} documents</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-baseGray" />
                            <span className="text-baseGray">{room.dataRoomContacts} data room contacts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-baseGray" />
                            <span className="text-baseGray">Active {room.lastActivity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-baseGray" />
                            <span className="text-baseGray">
                              Fundraising Period: {room.deadline === "TBD" || room.deadline === "Open Ended" ? "Open Ended" : `Ends ${room.deadline}`}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-baseGray mb-2">Connected Allocators:</p>
                          <div className="flex gap-2">
                            {room.allocators.map((allocator) => (
                              <Badge key={allocator} variant="outline" className="text-xs">
                                {allocator}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {room.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 bg-transparent"
                              onClick={() => handleManageAccess(room)}
                            >
                              <Settings className="h-4 w-4" />
                              Manage Access
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 bg-transparent"
                              onClick={() => handleManageFiles(room)}
                            >
                              <FileText className="h-4 w-4" />
                              Manage Files
                            </Button>
                            <Button
                              size="sm"
                              className="flex items-center gap-1 text-white hover:opacity-90"
                              style={{ backgroundColor: "#00B2FF" }}
                              onClick={() => handleEnterDataRoom(room)}
                            >
                              <Eye className="h-4 w-4" />
                              Enter Room
                            </Button>
                            <CustomDropdown
                              room={room}
                              onEnterDataRoom={handleEnterDataRoom}
                              onEditDetails={handleEditDetails}
                              onDuplicateRoom={handleDuplicateRoom}
                              onExportData={handleExportData}
                              onArchiveRoom={handleArchiveRoom}
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

      {/* Create Data Room Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Data Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Data Room Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Infrastructure Fund IV Due Diligence"
                value={newDataRoom.name}
                onChange={(e) => setNewDataRoom({ ...newDataRoom, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="strategy">Strategy *</Label>
              <Select
                value={newDataRoom.strategy}
                onValueChange={(value) => setNewDataRoom({ ...newDataRoom, strategy: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Private Equity">Private Equity</SelectItem>
                  <SelectItem value="Private Credit">Private Credit</SelectItem>
                  <SelectItem value="Growth Equity">Growth Equity</SelectItem>
                  <SelectItem value="Hedge Fund">Hedge Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the data room purpose and contents"
                value={newDataRoom.description}
                onChange={(e) => setNewDataRoom({ ...newDataRoom, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fundraisingPeriod">Fundraising Period</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="openEnded"
                    name="fundraisingType"
                    value="openEnded"
                    checked={newDataRoom.deadline === "Open Ended"}
                    onChange={() => setNewDataRoom({ ...newDataRoom, deadline: "Open Ended" })}
                    className="rounded"
                  />
                  <Label htmlFor="openEnded" className="text-sm">Open Ended</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="specificDate"
                    name="fundraisingType"
                    value="specificDate"
                    checked={newDataRoom.deadline !== "Open Ended" && newDataRoom.deadline !== ""}
                    onChange={() => setNewDataRoom({ ...newDataRoom, deadline: "" })}
                    className="rounded"
                  />
                  <Label htmlFor="specificDate" className="text-sm">Specific End Date</Label>
                </div>
                {newDataRoom.deadline !== "Open Ended" && (
                  <Input
                    id="deadline"
                    type="date"
                    value={newDataRoom.deadline === "Open Ended" ? "" : newDataRoom.deadline}
                    onChange={(e) => setNewDataRoom({ ...newDataRoom, deadline: e.target.value })}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="template">Template (Optional)</Label>
              <Select
                value={newDataRoom.template}
                onValueChange={(value) => setNewDataRoom({ ...newDataRoom, template: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Due Diligence</SelectItem>
                  <SelectItem value="esg">ESG Focused</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure Specific</SelectItem>
                  <SelectItem value="real-estate">Real Estate Specific</SelectItem>
                  <SelectItem value="blank">Blank Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreateDataRoom} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Data Room"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folderName">Folder Name *</Label>
              <Input
                id="folderName"
                placeholder="e.g., Financial Statements"
                value={newFolder.name}
                onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="folderDataRoom">Data Room *</Label>
              <Select
                value={newFolder.dataRoomId}
                onValueChange={(value) => setNewFolder({ ...newFolder, dataRoomId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data room" />
                </SelectTrigger>
                <SelectContent>
                  {dataRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="folderDescription">Description</Label>
              <Textarea
                id="folderDescription"
                placeholder="Brief description of folder contents"
                value={newFolder.description}
                onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="folderPermissions">Permissions</Label>
              <Select
                value={newFolder.permissions}
                onValueChange={(value: "public" | "private" | "restricted") =>
                  setNewFolder({ ...newFolder, permissions: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - All data room contacts can access</SelectItem>
                  <SelectItem value="private">Private - Only you can access</SelectItem>
                  <SelectItem value="restricted">Restricted - Selected contacts only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowFolderDialog(false)} disabled={isCreatingFolder}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={isCreatingFolder}>
              {isCreatingFolder ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Access Management Dialog */}
      {selectedDataRoom && (
        <AccessControlManager
          resourceId={selectedDataRoom.id.toString()}
          resourceName={selectedDataRoom.name}
          resourceType="dataRoom"
          currentUsers={selectedDataRoom.permissions || []}
          currentGroups={[]}
          isOpen={showAccessDialog}
          onClose={() => setShowAccessDialog(false)}
          onSaveAccess={(users, groups) => {
            // Update the data room with new permissions
            setDataRooms(prevRooms =>
              prevRooms.map(room =>
                room.id === selectedDataRoom.id
                  ? { ...room, permissions: users }
                  : room
              )
            )
            setShowAccessDialog(false)
          }}
        />
      )}
    </div>
  )
}
