"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Archive,
  Trash2,
  Edit,
  Star,
  Paperclip,
  MoreHorizontal,
  ChevronDown,
  Reply,
  Forward,
  ArchiveX,
  UserX,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const messages = [
  {
    id: 1,
    sender: "State Pension Fund",
    senderEmail: "investments@statepension.gov",
    subject: "Consultant RFP - Alternative Investments",
    preview:
      "We're issuing an RFP for alternative investment consulting services and would like to invite your firm to participate in our selection process.",
    time: "9:15 AM",
    isRead: false,
    isStarred: false,
    hasAttachment: true,
    labels: ["RFP", "Important"],
    avatar: "/pension-fund-allocation.png",
    fullContent: `Dear Consultant,

We're issuing an RFP for alternative investment consulting services and would like to invite your firm to participate in our selection process.

The scope includes:
• Manager research and due diligence
• Portfolio construction and asset allocation
• Performance monitoring and reporting

Please let us know if you're interested in participating.

Best regards,
State Pension Fund Investment Team`,
  },
  {
    id: 2,
    sender: "University Endowment",
    senderEmail: "endowment@university.edu",
    subject: "Quarterly Review Meeting",
    preview:
      "We'd like to schedule our quarterly portfolio review meeting to discuss recent performance and upcoming opportunities.",
    time: "Yesterday",
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    labels: ["Meeting"],
    avatar: "/abstract-ej-typography.png",
    fullContent: `Hello,

We'd like to schedule our quarterly portfolio review meeting to discuss recent performance and upcoming opportunities.

Proposed agenda:
• Q3 performance review
• Market outlook discussion
• New investment opportunities
• Portfolio rebalancing recommendations

Please let me know your availability for the next two weeks.

Best,
University Endowment Team`,
  },
  {
    id: 3,
    sender: "Corporate Pension Plan",
    senderEmail: "pension@corporate.com",
    subject: "Manager Search Update Request",
    preview: "Can you provide an update on the private equity manager search we initiated last quarter?",
    time: "May 14",
    isRead: true,
    isStarred: true,
    hasAttachment: true,
    labels: ["Manager Search"],
    avatar: "/abstract-vg.png",
    fullContent: `Hi there,

Can you provide an update on the private equity manager search we initiated last quarter?

We're particularly interested in:
• Current pipeline status
• Due diligence progress
• Timeline for final recommendations
• Any emerging opportunities

Looking forward to your update.

Regards,
Corporate Pension Plan`,
  },
  {
    id: 4,
    sender: "Family Office",
    senderEmail: "investments@familyoffice.com",
    subject: "ESG Integration Consulting",
    preview:
      "We're looking to enhance our ESG integration across our alternative investment portfolio and would like to discuss potential consulting engagement.",
    time: "May 12",
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    labels: ["ESG", "Consulting"],
    avatar: "/sustainability-investing.png",
    fullContent: `Dear Team,

We're looking to enhance our ESG integration across our alternative investment portfolio and would like to discuss potential consulting engagement.

Areas of focus:
• ESG due diligence frameworks
• Impact measurement and reporting
• Manager engagement strategies
• Portfolio ESG scoring

Would you be available for an initial discussion next week?

Best regards,
Family Office Investment Committee`,
  },
]

export default function ConsultantInboxPage() {
  const [selectedMessage, setSelectedMessage] = useState(messages[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("inbox")
  const [emailNotifications, setEmailNotifications] = useState(true)

  const handleStarMessage = (messageId: number) => {
    // Handle starring logic
    console.log("Star message:", messageId)
    // In a real app, this would update the message state
  }

  const handleArchiveMessage = (messageId: number) => {
    // Handle archive logic
    console.log("Archive message:", messageId)
    // In a real app, this would move the message to archive
  }

  const handleDeleteMessage = (messageId: number) => {
    // Handle delete logic
    console.log("Delete message:", messageId)
    // In a real app, this would move the message to trash
  }

  const handleCompose = () => {
    // Handle compose logic
    console.log("Compose new message")
    // In a real app, this would open a compose modal
  }

  const handleMarkUnread = (messageId: number) => {
    // Handle mark unread logic
    console.log("Mark unread:", messageId)
  }

  const handleBlockSender = (messageId: number) => {
    // Handle block sender logic
    console.log("Block sender:", messageId)
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-deepBrand">Inbox</h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleArchiveMessage(selectedMessage?.id || 0)}
            >
              <Archive className="h-4 w-4" />
              Archive
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleDeleteMessage(selectedMessage?.id || 0)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button 
              className="flex items-center gap-2 bg-deepBrand hover:bg-deepBrand/90 text-white"
              onClick={handleCompose}
            >
              <Edit className="h-4 w-4" />
              Compose
            </Button>
          </div>
        </div>

        {/* Email Notifications Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-800 text-sm">
              📧 Email notifications for new messages are <strong>enabled</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-700">On</span>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailNotifications ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Message List */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                {/* Search */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="px-4 pt-4">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                      <TabsTrigger
                        value="inbox"
                        className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                      >
                        Inbox
                        <Badge variant="secondary" className="ml-2">
                          2
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="starred"
                        className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                      >
                        Starred
                      </TabsTrigger>
                      <TabsTrigger
                        value="more"
                        className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                      >
                        More
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="inbox" className="mt-0">
                    <div className="divide-y">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedMessage.id === message.id ? "bg-blue-50 border-r-2 border-r-blue-500" : ""
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <img src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                              <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-sm font-medium truncate ${!message.isRead ? "font-semibold" : ""}`}>
                                  {message.sender}
                                </p>
                                <div className="flex items-center gap-1">
                                  {message.hasAttachment && <Paperclip className="h-3 w-3 text-gray-400" />}
                                  <span className="text-xs text-gray-500">{message.time}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleStarMessage(message.id)}>
                                        <Star className="h-4 w-4 mr-2" />
                                        {message.isStarred ? "Unstar" : "Star"}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleArchiveMessage(message.id)}>
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleMarkUnread(message.id)}>
                                        <ArchiveX className="h-4 w-4 mr-2" />
                                        Mark Unread
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleBlockSender(message.id)}>
                                        <UserX className="h-4 w-4 mr-2" />
                                        Block Sender
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <p
                                className={`text-sm mb-1 truncate ${!message.isRead ? "font-medium" : "text-gray-600"}`}
                              >
                                {message.subject}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-2">{message.preview}</p>
                              {message.labels.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {message.labels.map((label) => (
                                    <Badge key={label} variant="secondary" className="text-xs">
                                      {label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="starred" className="mt-0">
                    <div className="p-4 text-center text-gray-500">
                      <Star className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No starred messages</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="more" className="mt-0">
                    <div className="divide-y">
                      <div className="p-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Unread</span>
                          <Badge variant="secondary">0</Badge>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Archived</span>
                          <Badge variant="secondary">0</Badge>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Deleted</span>
                          <Badge variant="secondary">0</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Message Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {/* Message Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold text-deepBrand">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStarMessage(selectedMessage.id)}
                        className={selectedMessage.isStarred ? "text-amber-500" : "text-gray-400"}
                      >
                        <Star className={`h-4 w-4 ${selectedMessage.isStarred ? "fill-current" : ""}`} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArchiveX className="h-4 w-4 mr-2" />
                            Mark Unread
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserX className="h-4 w-4 mr-2" />
                            Block Sender
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Sender Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <img src={selectedMessage.avatar || "/placeholder.svg"} alt={selectedMessage.sender} />
                      <AvatarFallback>{selectedMessage.sender.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-deepBrand">{selectedMessage.sender}</p>
                      <p className="text-sm text-baseGray">{selectedMessage.senderEmail}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm text-baseGray">📅 {selectedMessage.time}</p>
                    </div>
                  </div>

                  {/* Labels */}
                  {selectedMessage.labels.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {selectedMessage.labels.map((label) => (
                        <Badge key={label} variant="secondary">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-baseGray leading-relaxed">
                      {selectedMessage.fullContent}
                    </div>
                  </div>

                  {selectedMessage.hasAttachment && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">1 attachment</span>
                      </div>
                    </div>
                  )}

                  {/* Reply Button */}
                  <div className="mt-6 pt-6 border-t">
                    <Button className="bg-deepBrand hover:bg-deepBrand/90 text-white">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
