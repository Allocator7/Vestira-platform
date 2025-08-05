"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar"
import { Input } from "../../../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Search, Filter, Calendar, FileText, Download, Eye, Clock, Star, MoreHorizontal, X } from "lucide-react"
import { Progress } from "../../../../components/ui/progress"

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic'

const dataRooms = [
  {
    id: 1,
    name: "BlackRock Infrastructure Fund IV",
    manager: "BlackRock",
    type: "Infrastructure",
    status: "Active",
    accessLevel: "Full Access",
    lastUpdated: "2 hours ago",
    documentsCount: 127,
    deadline: "Dec 15, 2024",
    description: "Comprehensive due diligence materials for BlackRock's latest infrastructure fund",
    avatar: "/abstract-geometric-br.png",
    tags: ["Infrastructure", "ESG", "Global"],
  },
  {
    id: 2,
    name: "Vanguard Real Estate Partners",
    manager: "Vanguard",
    type: "Real Estate",
    status: "Pending Access",
    accessLevel: "Requested",
    lastUpdated: "1 day ago",
    documentsCount: 89,
    deadline: "Jan 30, 2025",
    description: "Real estate investment opportunities across major metropolitan markets",
    avatar: "/roman-numeral-vi.png",
    tags: ["Real Estate", "Commercial", "Residential"],
  },
  {
    id: 3,
    name: "Wellington Growth Equity Fund",
    manager: "Wellington Management",
    type: "Growth Equity",
    status: "Active",
    accessLevel: "Limited Access",
    lastUpdated: "3 days ago",
    documentsCount: 156,
    deadline: "Nov 20, 2024",
    description: "Growth equity investments in technology and healthcare companies",
    avatar: "/stylized-wm.png",
    tags: ["Growth Equity", "Technology", "Healthcare"],
  },
  {
    id: 4,
    name: "Fidelity Private Credit Strategy",
    manager: "Fidelity",
    type: "Private Credit",
    status: "Completed",
    accessLevel: "Full Access",
    lastUpdated: "1 week ago",
    documentsCount: 203,
    deadline: "Completed",
    description: "Private credit opportunities in middle-market companies",
    avatar: "/FI_logo.png",
    tags: ["Private Credit", "Middle Market", "Fixed Income"],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Pending Access":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
      return "bg-electric-blue/10 text-electric-blue"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getAccessColor = (access: string) => {
  switch (access) {
    case "Full Access":
      return "bg-green-100 text-green-800"
    case "Limited Access":
      return "bg-yellow-100 text-yellow-800"
    case "Requested":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Custom Dropdown Component
function CustomDropdown({ room, onViewDetails, onContactManager, onRequestAccess, onExportDocuments }: any) {
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
              onClick={() => handleMenuItemClick(() => onViewDetails(room))}
            >
              View Details
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onContactManager(room))}
            >
              Contact Manager
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onRequestAccess(room))}
            >
              Request Additional Access
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleMenuItemClick(() => onExportDocuments(room))}
            >
              Export Available Documents
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Add helper functions
const getCurrentUser = () => {
  // This would typically come from your auth context or session
  return {
    id: "current-user-id",
    userType: "allocator",
    dataRoomPermission: "view-only", // or "view-download"
  }
}

const getUserDataRoomPermission = (dataRoomId: any, userId: any) => {
  // This would typically fetch from your backend or local storage
  const savedUsers = localStorage.getItem(`vestira_access_users_${dataRoomId}`)
  if (savedUsers) {
    try {
      const users = JSON.parse(savedUsers)
      const user = users.find((u: any) => u.id === userId)
      return user?.dataRoomPermission || "view-only"
    } catch (error) {
      console.error("Error parsing saved users:", error)
    }
  }
  return "view-only"
}

export default function AllocatorDataRoomsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [bookmarkedRooms, setBookmarkedRooms] = useState<number[]>([])
  const [downloadingRoom, setDownloadingRoom] = useState<number | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [showModal, setShowModal] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [contactMessage, setContactMessage] = useState("")
  const [accessRequestReason, setAccessRequestReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const closeModal = () => {
    setShowModal(null)
    setSelectedRoom(null)
    setContactMessage("")
    setAccessRequestReason("")
    setIsSubmitting(false)
  }

  const filteredDataRooms = dataRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleBookmark = (roomId: number) => {
    if (bookmarkedRooms.includes(roomId)) {
      setBookmarkedRooms(bookmarkedRooms.filter((id) => id !== roomId))
      showNotification("Bookmark removed")
    } else {
      setBookmarkedRooms([...bookmarkedRooms, roomId])
      showNotification("Data room bookmarked")
    }
  }

  const handleDownload = (room: any) => {
    // Check if user has download permission
    const currentUser = getCurrentUser() // This would be implemented to get current user info
    const userPermission = getUserDataRoomPermission(room.id, currentUser?.id)

    if (userPermission === "view-only") {
      showNotification("Download not permitted - you have view-only access to this data room", "error")
      return
    }

    setSelectedRoom(room)
    setDownloadingRoom(room.id)
    setDownloadProgress(0)
    setShowModal("download")

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setDownloadingRoom(null)
            closeModal()
            showNotification(`${room.name} documents downloaded successfully`)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleEnterRoom = (room: any) => {
    if (room.accessLevel === "Requested") {
      showNotification("Access request is still pending approval", "error")
      return
    }

    showNotification(`Loading ${room.name}...`)
    setTimeout(() => {
      router.push(`/screens/general/data-room-profile?id=${room.id}&name=${encodeURIComponent(room.name)}`)
    }, 500)
  }

  const handleViewDetails = (room: any) => {
    setSelectedRoom(room)
    setShowModal("details")
  }

  const handleContactManager = (room: any) => {
    setSelectedRoom(room)
    setContactMessage("")
    setShowModal("contact")
  }

  const handleRequestAccess = (room: any) => {
    setSelectedRoom(room)
    setAccessRequestReason("")
    setShowModal("access")
  }

  const handleExportDocuments = (room: any) => {
    showNotification("Export started - preparing documents...")
    setTimeout(() => {
      showNotification(`${room.documentsCount} documents from ${room.name} exported successfully`)
    }, 2000)
  }

  const handleSubmitContact = () => {
    if (!contactMessage.trim()) {
      showNotification("Please enter a message", "error")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      closeModal()
      showNotification(`Message sent to ${selectedRoom?.manager}`)
    }, 1000)
  }

  const handleSubmitAccessRequest = () => {
    if (!accessRequestReason.trim()) {
      showNotification("Please provide a reason for the request", "error")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      closeModal()
      showNotification(`Access request submitted for ${selectedRoom?.name}`)
    }, 1000)
  }

  const handleExportList = () => {
    const dataToExport = filteredDataRooms.map((room) => ({
      name: room.name,
      manager: room.manager,
      type: room.type,
      status: room.status,
      accessLevel: room.accessLevel,
      documents: room.documentsCount,
      lastUpdated: room.lastUpdated,
      deadline: room.deadline,
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
    link.download = `allocator-data-rooms-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showNotification("Data rooms list exported successfully!")
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Simple Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Download Modal */}
            {showModal === "download" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Downloading Data Room</h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">
                  Downloading {selectedRoom?.documentsCount} documents from {selectedRoom?.name}
                </p>
                <Progress value={downloadProgress} className="h-2" />
                <p className="text-sm text-gray-500 mt-2 text-center">{downloadProgress}% complete</p>
              </div>
            )}

            {/* Details Modal */}
            {showModal === "details" && selectedRoom && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{selectedRoom.name}</h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <img src={selectedRoom.avatar || "/placeholder.svg"} alt={selectedRoom.manager} />
                      <AvatarFallback>{selectedRoom.manager.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedRoom.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedRoom.manager} • {selectedRoom.type}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Status</p>
                      <Badge className={getStatusColor(selectedRoom.status)}>{selectedRoom.status}</Badge>
                    </div>
                    <div>
                      <p className="font-medium">Access Level</p>
                      <Badge className={getAccessColor(selectedRoom.accessLevel)}>{selectedRoom.accessLevel}</Badge>
                    </div>
                    <div>
                      <p className="font-medium">Documents</p>
                      <p>{selectedRoom.documentsCount} documents</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p>{selectedRoom.lastUpdated}</p>
                    </div>
                    <div>
                      <p className="font-medium">Due Date</p>
                      <p>{selectedRoom.deadline}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-sm">{selectedRoom.description}</p>
                  </div>

                  <div>
                    <p className="font-medium">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedRoom.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button onClick={closeModal}>Close</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      closeModal()
                      handleEnterRoom(selectedRoom)
                    }}
                  >
                    Enter Data Room
                  </Button>
                </div>
              </div>
            )}

            {/* Contact Modal */}
            {showModal === "contact" && selectedRoom && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Contact {selectedRoom.manager}</h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <Input placeholder="Regarding data room access" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      className="w-full min-h-[120px] p-3 border rounded-md"
                      placeholder="Type your message here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitContact} disabled={!contactMessage.trim() || isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </div>
            )}

            {/* Access Request Modal */}
            {showModal === "access" && selectedRoom && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Request Additional Access</h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Access Type Needed</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="full">Full Access</option>
                      <option value="download">Download Access</option>
                      <option value="extended">Extended Time Access</option>
                      <option value="team">Team Access</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reason for Request</label>
                    <textarea
                      className="w-full min-h-[120px] p-3 border rounded-md"
                      placeholder="Please explain why you need additional access..."
                      value={accessRequestReason}
                      onChange={(e) => setAccessRequestReason(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitAccessRequest} disabled={!accessRequestReason.trim() || isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deepBrand">Data Rooms</h1>
            <p className="text-deepBrand">Access and manage due diligence materials from investment managers</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={handleExportList}>
              <Download className="h-4 w-4" />
              Export List
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search and Tabs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search data rooms by name, manager, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select className="vestira-input w-full md:w-48">
                <option value="all">All Types</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="real-estate">Real Estate</option>
                <option value="private-equity">Private Equity</option>
                <option value="private-credit">Private Credit</option>
              </select>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="all">All Types</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="private-equity">Private Equity</option>
                    <option value="private-credit">Private Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending Access</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Access Level</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="all">All Access Levels</option>
                    <option value="full">Full Access</option>
                    <option value="limited">Limited Access</option>
                    <option value="requested">Requested</option>
                  </select>
                </div>
              </div>
            )}

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
                  Pending Access ({dataRooms.filter((r) => r.status === "Pending Access").length})
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
                  {filteredDataRooms.map((room) => {
                    const matchesTab =
                      (activeTab === "active" && room.status === "Active") ||
                      (activeTab === "pending" && room.status === "Pending Access") ||
                      (activeTab === "closed" && room.status === "Completed")

                    if (!matchesTab) {
                      return null
                    }

                    return (
                      <Card key={room.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12">
                                <img src={room.avatar || "/placeholder.svg"} alt={room.manager} />
                                <AvatarFallback>{room.manager.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-lg font-semibold text-deepBrand mb-1">{room.name}</h3>
                                <p className="text-sm text-baseGray mb-1">
                                  {room.manager} • {room.type}
                                </p>
                                <p className="text-sm text-baseGray leading-relaxed max-w-2xl">{room.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                              <Badge className={getAccessColor(room.accessLevel)}>{room.accessLevel}</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-baseGray" />
                              <span className="text-baseGray">{room.documentsCount} documents</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-baseGray" />
                              <span className="text-baseGray">Updated {room.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-baseGray" />
                              <span className="text-baseGray">Due: {room.deadline}</span>
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
                                variant={bookmarkedRooms.includes(room.id) ? "default" : "outline"}
                                className={`flex items-center gap-1 ${bookmarkedRooms.includes(room.id) ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                                onClick={() => handleBookmark(room.id)}
                              >
                                <Star
                                  className="h-4 w-4"
                                  fill={bookmarkedRooms.includes(room.id) ? "currentColor" : "none"}
                                />
                                {bookmarkedRooms.includes(room.id) ? "Bookmarked" : "Bookmark"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`flex items-center gap-1 bg-transparent ${
                                  getUserDataRoomPermission(room.id, getCurrentUser()?.id) === "view-only"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() => handleDownload(room)}
                                disabled={
                                  downloadingRoom === room.id ||
                                  getUserDataRoomPermission(room.id, getCurrentUser()?.id) === "view-only"
                                }
                              >
                                {downloadingRoom === room.id ? (
                                  <>
                                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-4 w-4" />
                                    {getUserDataRoomPermission(room.id, getCurrentUser()?.id) === "view-only"
                                      ? "View Only"
                                      : "Download"}
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                className="flex items-center gap-1 text-white hover:opacity-90"
                                style={{ backgroundColor: "#00B2FF" }}
                                onClick={() => handleEnterRoom(room)}
                              >
                                <Eye className="h-4 w-4" />
                                {room.accessLevel === "Requested" ? "Request Access" : "Enter Room"}
                              </Button>
                              <CustomDropdown
                                room={room}
                                onViewDetails={handleViewDetails}
                                onContactManager={handleContactManager}
                                onRequestAccess={handleRequestAccess}
                                onExportDocuments={handleExportDocuments}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
