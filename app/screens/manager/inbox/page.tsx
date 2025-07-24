"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  Search,
  Star,
  Trash2,
  Archive,
  Mail,
  Plus,
  MoreHorizontal,
  Clock,
  Tag,
  Paperclip,
  Send,
  X,
  FileText,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useApp } from "@/context/AppContext"

// Custom Dropdown Component
function CustomDropdown({
  trigger,
  items,
  align = "end",
}: {
  trigger: React.ReactNode
  items: Array<{ label: string; onClick: () => void }>
  align?: "start" | "end"
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Sample data for inbox messages
const initialMessages = [
  {
    id: 1,
    sender: {
      name: "State Pension Fund",
      avatar: "/spf-sunscreen-bottle.png",
      role: "allocator",
      email: "investments@statepension.gov",
    },
    subject: "Due Diligence Request",
    preview: "We're conducting our annual review and would like to request updated due diligence materials...",
    content: `Dear Manager,

We're conducting our annual review and would like to request updated due diligence materials for our investment committee review. Please provide:

• Current firm AUM and strategy breakdown
• Updated team organization chart and biographies  
• Performance attribution for the past 3 years
• Current risk management procedures
• ESG integration methodology and examples
• Fee schedule and terms

Please provide these materials through our secure data portal by May 30th. If you need access to the portal or have any questions, please let me know.

Best regards,
State Pension Fund Investment Team`,
    date: "11:45 AM",
    read: false,
    starred: true,
    archived: false,
    deleted: false,
    labels: ["Due Diligence", "Important"],
    attachments: [{ name: "Due_Diligence_Questionnaire_2025.pdf", size: "1.2 MB", type: "pdf" }],
  },
  {
    id: 2,
    sender: {
      name: "University Endowment",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "allocator",
      email: "investments@university.edu",
    },
    subject: "ESG Reporting Requirements",
    preview: "As part of our commitment to sustainable investing, we're updating our ESG reporting requirements...",
    content: `Dear Investment Manager,

As part of our commitment to sustainable investing, we're updating our ESG reporting requirements for all our external managers. 

The new requirements include:
• Quarterly ESG metrics reporting
• Annual sustainability impact assessment
• Carbon footprint analysis
• Proxy voting records on ESG issues

We'll need your first report by the end of next quarter. Please let us know if you have any questions about these requirements.

Best regards,
University Endowment Team`,
    date: "Yesterday",
    read: true,
    starred: false,
    archived: false,
    deleted: false,
    labels: ["ESG", "Reporting"],
    attachments: [],
  },
  {
    id: 3,
    sender: {
      name: "Corporate Pension Plan",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "allocator",
      email: "pension@corporation.com",
    },
    subject: "Meeting Request: Strategy Discussion",
    preview: "Our investment committee would like to schedule a call to discuss your current strategy and outlook...",
    content: `Hello,

Our investment committee would like to schedule a call to discuss your current strategy and market outlook for the remainder of 2025.

Topics we'd like to cover:
• Current portfolio positioning
• Market outlook and key risks
• Any strategy modifications planned
• Performance expectations for 2025

Are you available for a 1-hour call next week? We're flexible on timing.

Best regards,
Corporate Pension Investment Committee`,
    date: "May 14",
    read: true,
    starred: true,
    archived: false,
    deleted: false,
    labels: ["Meeting"],
    attachments: [],
  },
  {
    id: 4,
    sender: {
      name: "Family Office",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "allocator",
      email: "investments@familyoffice.com",
    },
    subject: "Interest in New Fund",
    preview:
      "We've been following your recent performance and are interested in learning more about your upcoming fund...",
    content: `Dear Manager,

We've been following your recent performance and are interested in learning more about your upcoming fund launch.

Our family office has been particularly impressed with your risk-adjusted returns and would like to explore an investment opportunity.

Could you please provide:
• Fund terms and structure
• Minimum investment requirements
• Expected timeline for launch
• Strategy focus and differentiation

We typically invest $25-50M in new manager relationships and would appreciate the opportunity to discuss this further.

Best regards,
Family Office Investment Team`,
    date: "May 12",
    read: false,
    starred: false,
    archived: false,
    deleted: false,
    labels: ["Opportunity"],
    attachments: [],
  },
  {
    id: 5,
    sender: {
      name: "Foundation",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "allocator",
      email: "grants@foundation.org",
    },
    subject: "Impact Investing Opportunities",
    preview:
      "Our board is looking to increase our allocation to impact investments. Can you share details on your impact strategies?",
    content: `Dear Investment Team,

Our board is looking to increase our allocation to impact investments as part of our mission alignment initiative.

We're particularly interested in:
• Education and healthcare impact investments
• Environmental sustainability projects
• Social impact measurement and reporting
• Financial returns alongside social impact

Can you share details on your impact strategies and any relevant track record? We're looking to allocate $15-20M to impact investments this year.

Best regards,
Foundation Investment Committee`,
    date: "May 10",
    read: true,
    starred: true,
    archived: false,
    deleted: false,
    labels: ["Impact", "Opportunity"],
    attachments: [],
  },
]

interface Message {
  id: number
  sender: {
    name: string
    avatar: string
    role: string
    email: string
  }
  subject: string
  preview: string
  content: string
  date: string
  read: boolean
  starred: boolean
  archived: boolean
  deleted: boolean
  labels: string[]
  attachments: Array<{
    name: string
    size: string
    type: string
  }>
}

export default function ManagerInbox() {
  const [selectedTab, setSelectedTab] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<number | null>(1)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [blockedSenders, setBlockedSenders] = useState<string[]>([])
  const { toast } = useToast()
  const { updateUnreadMessageCount } = useApp()

  // Modal states
  const [composeOpen, setComposeOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [forwardOpen, setForwardOpen] = useState(false)

  // Compose form states
  const [composeTo, setComposeTo] = useState("")
  const [composeSubject, setComposeSubject] = useState("")
  const [composeMessage, setComposeMessage] = useState("")
  const [composeAttachments, setComposeAttachments] = useState<string[]>([])

  // Reply form states
  const [replyMessage, setReplyMessage] = useState("")
  const [replyAttachments, setReplyAttachments] = useState<string[]>([])

  // Forward form states
  const [forwardTo, setForwardTo] = useState("")
  const [forwardMessage, setForwardMessage] = useState("")

  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)

  // Update unread count in context whenever messages change
  useEffect(() => {
    const unreadCount = messages.filter((msg) => !msg.read && !msg.archived && !msg.deleted).length
    updateUnreadMessageCount("manager", unreadCount)
  }, [messages, updateUnreadMessageCount])

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      // Filter out blocked senders
      if (blockedSenders.includes(message.sender.email)) {
        return false
      }

      // Filter based on selected tab first
      if (selectedTab === "deleted" && !message.deleted) return false
      if (selectedTab !== "deleted" && message.deleted) return false
      if (selectedTab === "archived" && !message.archived) return false
      if (selectedTab !== "archived" && selectedTab !== "deleted" && message.archived) return false
      if (selectedTab === "starred" && !message.starred) return false
      if (selectedTab === "unread" && message.read) return false

      // Filter based on search query
      if (
        searchQuery &&
        !message.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !message.preview.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [messages, selectedTab, searchQuery, blockedSenders])

  const handleMessageClick = (id: number) => {
    setSelectedMessage(id)
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)))
  }

  const toggleStarred = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, starred: !msg.starred } : msg)))
  }

  const archiveMessage = (id: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, archived: true } : msg)))
    toast({
      title: "Message archived",
      description: "Message has been moved to archive",
    })
  }

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, deleted: true } : msg)))
    if (selectedMessage === id) {
      setSelectedMessage(null)
    }
    toast({
      title: "Message moved to deleted",
      description: "Message has been moved to deleted folder",
    })
  }

  const permanentDeleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
    if (selectedMessage === id) {
      setSelectedMessage(null)
    }
    toast({
      title: "Message permanently deleted",
      description: "Message has been permanently deleted",
    })
  }

  const restoreMessage = (id: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, deleted: false } : msg)))
    toast({
      title: "Message restored",
      description: "Message has been restored to inbox",
    })
  }

  const markAsUnread = (id: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, read: false } : msg)))
    toast({
      title: "Marked as unread",
      description: "Message marked as unread",
    })
  }

  const blockSender = (email: string) => {
    setBlockedSenders((prev) => [...prev, email])
    setMessages((prev) => prev.filter((msg) => msg.sender.email !== email))
    toast({
      title: "Sender blocked",
      description: "All messages from this sender have been removed",
    })
  }

  const handleCompose = () => {
    if (!composeTo || !composeSubject || !composeMessage) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
      })
      return
    }

    toast({
      title: "Message sent",
      description: `Message sent to ${composeTo}`,
    })

    setComposeTo("")
    setComposeSubject("")
    setComposeMessage("")
    setComposeAttachments([])
    setComposeOpen(false)
  }

  const handleReply = () => {
    if (!replyMessage) {
      toast({
        title: "Empty message",
        description: "Please enter a reply message",
      })
      return
    }

    const selectedMsg = messages.find((m) => m.id === selectedMessage)
    if (selectedMsg) {
      toast({
        title: "Reply sent",
        description: `Reply sent to ${selectedMsg.sender.name}`,
      })
    }

    setReplyMessage("")
    setReplyAttachments([])
    setReplyOpen(false)
  }

  const handleForward = () => {
    if (!forwardTo) {
      toast({
        title: "Missing recipient",
        description: "Please enter a recipient email",
      })
      return
    }

    toast({
      title: "Message forwarded",
      description: `Message forwarded to ${forwardTo}`,
    })

    setForwardTo("")
    setForwardMessage("")
    setForwardOpen(false)
  }

  const handlePrint = () => {
    try {
      window.print()
    } catch (error) {
      console.error("Error printing:", error)
      toast({
        title: "Print error",
        description: "There was a problem opening the print dialog. Please try again.",
      })
    }
  }

  const addAttachment = (type: "compose" | "reply") => {
    try {
      const input = document.createElement("input")
      input.type = "file"
      input.multiple = true
      input.onchange = (e) => {
        try {
          const files = (e.target as HTMLInputElement).files
          if (files && files.length > 0) {
            const fileNames = Array.from(files).map((file) => file.name)
            if (type === "compose") {
              setComposeAttachments((prev) => [...prev, ...fileNames])
            } else {
              setReplyAttachments((prev) => [...prev, ...fileNames])
            }
            toast({
              title: "Files attached",
              description: `${fileNames.length} file(s) attached`,
            })
          }
        } catch (error) {
          console.error("Error processing attachments:", error)
          toast({
            title: "Error attaching files",
            description: "There was a problem attaching your files. Please try again.",
          })
        }
      }
      input.click()
    } catch (error) {
      console.error("Error opening file picker:", error)
      toast({
        title: "Error attaching files",
        description: "There was a problem opening the file picker. Please try again.",
      })
    }
  }

  const selectedMessageData = messages.find((m) => m.id === selectedMessage)

  const handleRestore = (id: number) => {
    restoreMessage(id)
  }

  const handlePermanentDelete = (id: number) => {
    permanentDeleteMessage(id)
  }

  const handleStarToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleStarred(id, e)
  }

  const handleArchive = (id: number) => {
    archiveMessage(id)
  }

  const handleDelete = (id: number) => {
    deleteMessage(id)
  }

  const handleMarkUnread = (id: number) => {
    markAsUnread(id)
  }

  const handleSendForward = () => {
    handleForward()
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold mr-2">Inbox</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedMessage) {
                  if (selectedTab === "deleted") {
                    restoreMessage(selectedMessage)
                  } else {
                    archiveMessage(selectedMessage)
                  }
                } else {
                  toast({
                    title: "No message selected",
                    description: "Please select a message",
                  })
                }
              }}
            >
              {selectedTab === "deleted" ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedMessage) {
                  if (selectedTab === "deleted") {
                    permanentDeleteMessage(selectedMessage)
                  } else {
                    deleteMessage(selectedMessage)
                  }
                } else {
                  toast({
                    title: "No message selected",
                    description: "Please select a message",
                  })
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {selectedTab === "deleted" ? "Delete Forever" : "Delete"}
            </Button>
            <Button variant="default" size="sm" onClick={() => setComposeOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-3 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              Email notifications for new messages are{" "}
              <strong>{emailNotificationsEnabled ? "enabled" : "disabled"}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications-toggle"
                checked={emailNotificationsEnabled}
                onCheckedChange={setEmailNotificationsEnabled}
                size="sm"
              />
              <Label htmlFor="email-notifications-toggle" className="text-sm text-blue-800">
                {emailNotificationsEnabled ? "On" : "Off"}
              </Label>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs
              defaultValue="inbox"
              className="flex-1 flex flex-col"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <div className="px-4 pt-2">
                <div className="flex items-center gap-2">
                  {/* Primary tabs */}
                  <TabsList className="bg-canvas-bg border border-gray-200 flex-shrink-0">
                    <TabsTrigger
                      value="inbox"
                      className="data-[state=active]:bg-deep-brand data-[state=active]:text-white hover:bg-white hover:text-deep-brand text-base-gray border border-transparent data-[state=active]:border-deep-brand"
                    >
                      Inbox
                      <Badge className="ml-1 bg-electric-blue text-white text-xs">
                        {messages.filter((m) => !m.read && !m.archived && !m.deleted).length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="starred"
                      className="data-[state=active]:bg-deep-brand data-[state=active]:text-white hover:bg-white hover:text-deep-brand text-base-gray border border-transparent data-[state=active]:border-deep-brand"
                    >
                      Starred
                    </TabsTrigger>
                  </TabsList>

                  {/* Secondary tabs dropdown */}
                  <CustomDropdown
                    trigger={
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        {selectedTab === "unread" && "Unread"}
                        {selectedTab === "archived" && "Archived"}
                        {selectedTab === "deleted" && "Deleted"}
                        {!["unread", "archived", "deleted"].includes(selectedTab) && "More"}
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                    items={[
                      {
                        label: "Unread",
                        onClick: () => setSelectedTab("unread"),
                      },
                      {
                        label: "Archived",
                        onClick: () => setSelectedTab("archived"),
                      },
                      {
                        label: `Deleted (${messages.filter((m) => m.deleted).length})`,
                        onClick: () => setSelectedTab("deleted"),
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <TabsContent value={selectedTab} className="m-0 p-0 h-full">
                  {filteredMessages.length > 0 ? (
                    <div className="divide-y">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${
                            selectedMessage === message.id ? "bg-gray-50" : ""
                          } ${!message.read ? "font-medium" : ""}`}
                          onClick={() => handleMessageClick(message.id)}
                        >
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                              <img src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="font-medium truncate">{message.sender.name}</div>
                                <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {message.date}
                                </div>
                              </div>
                              <div className="text-sm font-medium truncate">{message.subject}</div>
                              <div className="text-sm text-muted-foreground truncate">{message.preview}</div>
                              <div className="flex mt-1 space-x-1">
                                {message.attachments.length > 0 && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Paperclip className="h-3 w-3 mr-1" />
                                    {message.attachments.length} attachment{message.attachments.length > 1 ? "s" : ""}
                                  </div>
                                )}
                              </div>
                            </div>
                            <CustomDropdown
                              trigger={
                                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              }
                              items={
                                selectedTab === "deleted"
                                  ? [
                                      {
                                        label: "Restore",
                                        onClick: () => restoreMessage(message.id),
                                      },
                                      {
                                        label: "Delete Forever",
                                        onClick: () => permanentDeleteMessage(message.id),
                                      },
                                    ]
                                  : [
                                      {
                                        label: message.starred ? "Unstar" : "Star",
                                        onClick: () => {
                                          toggleStarred(message.id, {} as React.MouseEvent)
                                        },
                                      },
                                      {
                                        label: "Archive",
                                        onClick: () => archiveMessage(message.id),
                                      },
                                      {
                                        label: "Delete",
                                        onClick: () => deleteMessage(message.id),
                                      },
                                      {
                                        label: "Mark as unread",
                                        onClick: () => markAsUnread(message.id),
                                      },
                                      {
                                        label: "Block sender",
                                        onClick: () => blockSender(message.sender.email),
                                      },
                                    ]
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No messages found</h3>
                      <p className="text-muted-foreground">
                        {selectedTab === "deleted"
                          ? "No deleted messages"
                          : selectedTab === "archived"
                            ? "No archived messages"
                            : "Try adjusting your search or filters"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Message detail view */}
          <div className="flex-1 flex flex-col">
            {selectedMessageData ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{selectedMessageData.subject}</h2>
                    <div className="flex space-x-2">
                      {selectedTab === "deleted" ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleRestore(selectedMessageData.id)}>
                            <RotateCcw className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePermanentDelete(selectedMessageData.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleStarToggle(selectedMessageData.id, e)}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                selectedMessageData.starred ? "fill-yellow-400 text-yellow-400" : ""
                              }`}
                            />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleArchive(selectedMessageData.id)}>
                            <Archive className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedMessageData.id)}>
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                      <CustomDropdown
                        trigger={
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        }
                        items={
                          selectedTab === "deleted"
                            ? [
                                {
                                  label: "Print",
                                  onClick: () => handlePrint(),
                                },
                              ]
                            : [
                                {
                                  label: "Mark as unread",
                                  onClick: () => handleMarkUnread(selectedMessageData.id),
                                },
                                {
                                  label: "Forward",
                                  onClick: () => setForwardOpen(true),
                                },
                                {
                                  label: "Print",
                                  onClick: () => handlePrint(),
                                },
                                {
                                  label: "Block sender",
                                  onClick: () => blockSender(selectedMessageData.sender.email),
                                },
                              ]
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-3">
                      <img
                        src={selectedMessageData.sender.avatar || "/placeholder.svg"}
                        alt={selectedMessageData.sender.name}
                      />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{selectedMessageData.sender.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedMessageData.sender.email}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {selectedMessageData.date}
                          </div>
                        </div>
                        {selectedTab !== "deleted" && (
                          <Button variant="outline" size="sm" onClick={() => setReplyOpen(true)}>
                            Reply
                          </Button>
                        )}
                      </div>

                      <div className="flex mt-1 space-x-1">
                        {selectedMessageData.labels.map((label) => (
                          <Badge key={label} variant="outline" className="text-xs py-0 h-5">
                            <Tag className="h-3 w-3 mr-1" />
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-auto">
                  <div className="prose max-w-none whitespace-pre-wrap">{selectedMessageData.content}</div>

                  {selectedMessageData.attachments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">Attachments ({selectedMessageData.attachments.length})</h3>
                      <div className="space-y-2">
                        {selectedMessageData.attachments.map((attachment, index) => (
                          <Card key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded mr-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{attachment.name}</div>
                                <div className="text-xs text-muted-foreground">{attachment.size}</div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Mail className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Select a message</h3>
                <p className="text-muted-foreground">Choose a message from the list to view its contents</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="compose-to">To</Label>
              <Input
                id="compose-to"
                placeholder="Enter recipient email"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="compose-subject">Subject</Label>
              <Input
                id="compose-subject"
                placeholder="Enter subject"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="compose-message">Message</Label>
              <Textarea
                id="compose-message"
                placeholder="Enter your message"
                rows={10}
                value={composeMessage}
                onChange={(e) => setComposeMessage(e.target.value)}
              />
            </div>
            {composeAttachments.length > 0 && (
              <div>
                <Label>Attachments</Label>
                <div className="space-y-1">
                  {composeAttachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{attachment}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setComposeAttachments((prev) => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => addAttachment("compose")}>
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </Button>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompose}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to: {selectedMessageData?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-muted-foreground">To: {selectedMessageData?.sender.email}</div>
              <div className="text-sm text-muted-foreground">Subject: Re: {selectedMessageData?.subject}</div>
            </div>
            <div>
              <Label htmlFor="reply-message">Your Reply</Label>
              <Textarea
                id="reply-message"
                placeholder="Enter your reply"
                rows={8}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
            {replyAttachments.length > 0 && (
              <div>
                <Label>Attachments</Label>
                <div className="space-y-1">
                  {replyAttachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{attachment}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyAttachments((prev) => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => addAttachment("reply")}>
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </Button>
            <Button variant="outline" onClick={() => setReplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReply}>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forward Dialog */}
      <Dialog open={forwardOpen} onOpenChange={setForwardOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Forward: {selectedMessageData?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="forward-to">To</Label>
              <Input
                id="forward-to"
                placeholder="Enter recipient email"
                value={forwardTo}
                onChange={(e) => setForwardTo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="forward-message">Additional Message (Optional)</Label>
              <Textarea
                id="forward-message"
                placeholder="Add a message to the forwarded email"
                rows={4}
                value={forwardMessage}
                onChange={(e) => setForwardMessage(e.target.value)}
              />
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium mb-2">Original Message:</div>
              <div className="text-sm text-muted-foreground">
                From: {selectedMessageData?.sender.name} ({selectedMessageData?.sender.email})
              </div>
              <div className="text-sm text-muted-foreground">Subject: {selectedMessageData?.subject}</div>
              <div className="text-sm text-muted-foreground">Date: {selectedMessageData?.date}</div>
              <div className="text-sm mt-2 whitespace-pre-wrap">{selectedMessageData?.content}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForwardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendForward}>
              <Send className="h-4 w-4 mr-2" />
              Forward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
