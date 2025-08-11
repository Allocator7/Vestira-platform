"use client"

import type React from "react"
import { useState, useMemo, useEffect, useCallback, useRef } from "react"
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
  FileText,
  X,
  RotateCcw,
} from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Avatar } from "../../../../components/ui/avatar"
import { Badge } from "../../../../components/ui/badge"
import { Card } from "../../../../components/ui/card"
import { Switch } from "../../../../components/ui/switch"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { useApp } from "../../../../context/AppContext"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
      name: "BlackRock Capital",
      avatar: "/abstract-geometric-br.png",
      role: "manager",
      email: "contact@blackrock.com",
    },
    subject: "Updated Due Diligence Materials",
    preview: "We've updated our quarterly performance report and ESG metrics as requested...",
    content: `Dear Allocator Team,

We've updated our quarterly performance report and ESG metrics as requested during our last review meeting. The attached documents include:

• Q1 2025 Performance Attribution Report
• Updated ESG Integration Methodology
• Risk Management Framework Updates
• Team Changes and New Hires

Please review these materials at your convenience. We're available for a follow-up call to discuss any questions you may have.

Best regards,
BlackRock Capital Team`,
    date: "10:23 AM",
    read: false,
    starred: true,
    archived: false,
    deleted: false,
    labels: ["Due Diligence", "Important"],
    attachments: [
      { name: "Q1_Performance_Report.pdf", size: "2.3 MB", type: "pdf" },
      { name: "ESG_Methodology.docx", size: "1.1 MB", type: "doc" },
    ],
  },
  {
    id: 2,
    sender: {
      name: "Vanguard Investments",
      avatar: "/roman-numeral-vi.png",
      role: "manager",
      email: "institutional@vanguard.com",
    },
    subject: "Meeting Request: Portfolio Review",
    preview: "Would you be available next Tuesday at 2pm ET to discuss our latest portfolio performance?",
    content: `Hello,

Would you be available next Tuesday at 2pm ET to discuss our latest portfolio performance? We'd like to review:

• Recent performance metrics
• Market outlook for Q2
• Potential strategy adjustments
• Fee structure updates

Please let me know if this time works for your team.

Best regards,
Vanguard Institutional Team`,
    date: "Yesterday",
    read: true,
    starred: false,
    archived: false,
    deleted: false,
    labels: ["Meeting"],
    attachments: [],
  },
  {
    id: 3,
    sender: {
      name: "Wellington Management",
      avatar: "/stylized-wm.png",
      role: "manager",
      email: "client.service@wellington.com",
    },
    subject: "New Investment Opportunity",
    preview: "We're launching a sustainable infrastructure fund that aligns with your ESG criteria...",
    content: `Dear Investment Committee,

We're launching a new sustainable infrastructure fund that aligns with your ESG criteria. This fund focuses on:

• Renewable energy projects
• Sustainable transportation infrastructure
• Water and waste management systems
• Digital infrastructure with ESG focus

The fund has a target size of $500M with a minimum investment of $10M. We'd be happy to present this opportunity to your team.

Best regards,
Wellington Management`,
    date: "May 14",
    read: true,
    starred: true,
    archived: false,
    deleted: false,
    labels: ["Opportunity"],
    attachments: [{ name: "Infrastructure_Fund_Overview.pdf", size: "3.2 MB", type: "pdf" }],
  },
  {
    id: 4,
    sender: {
      name: "Fidelity Investments",
      avatar: "/FI_logo.png",
      role: "manager",
      email: "institutional@fidelity.com",
    },
    subject: "Quarterly Performance Report",
    preview: "Attached is our Q1 2025 performance report for your review. Our emerging markets strategy...",
    content: `Dear Valued Client,

Attached is our Q1 2025 performance report for your review. Our emerging markets strategy has shown strong performance this quarter with:

• 12.3% return vs 8.7% benchmark
• Reduced volatility through diversification
• Strong ESG scores across portfolio
• Successful risk management during market volatility

We look forward to discussing these results with you.

Best regards,
Fidelity Institutional Team`,
    date: "May 12",
    read: true,
    starred: false,
    archived: false,
    deleted: false,
    labels: ["Report"],
    attachments: [{ name: "Q1_2025_Performance.pdf", size: "4.1 MB", type: "pdf" }],
  },
  {
    id: 5,
    sender: {
      name: "T. Rowe Price",
      avatar: "/trp-symbol.png",
      role: "manager",
      email: "institutional@troweprice.com",
    },
    subject: "Updated Sustainability Metrics",
    preview: "As requested, we've compiled our latest sustainability metrics and carbon footprint analysis...",
    content: `Dear Sustainability Committee,

As requested, we've compiled our latest sustainability metrics and carbon footprint analysis. Key highlights include:

• 40% reduction in portfolio carbon intensity
• 95% of holdings have ESG ratings
• Increased allocation to green bonds
• Enhanced proxy voting on climate issues

The detailed report is attached for your review.

Best regards,
T. Rowe Price ESG Team`,
    date: "May 10",
    read: false,
    starred: false,
    archived: false,
    deleted: false,
    labels: ["ESG", "Report"],
    attachments: [{ name: "Sustainability_Metrics_2025.pdf", size: "2.8 MB", type: "pdf" }],
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

// Custom Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

// Simple toast implementation
function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([])

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  return { toasts, showToast }
}

// Toast display component
function ToastContainer({ toasts }: { toasts: Array<{ id: number; message: string; type: string }> }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3 rounded-md shadow-md ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default function AllocatorInbox() {
  const [selectedTab, setSelectedTab] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<number | null>(1)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const { updateUnreadMessageCount } = useApp()
  const [forwardOpen, setForwardOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [composeAttachments, setComposeAttachments] = useState<string[]>([])
  const [replyAttachments, setReplyAttachments] = useState<string[]>([])

  // Custom toast
  const { toasts, showToast } = useToast()

  // Form states
  const [composeTo, setComposeTo] = useState("")
  const [composeCc, setComposeCc] = useState("")
  const [composeBcc, setComposeBcc] = useState("")
  const [composeSubject, setComposeSubject] = useState("")
  const [composeMessage, setComposeMessage] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [forwardTo, setForwardTo] = useState("")
  const [forwardMessage, setForwardMessage] = useState("")

  // Update unread count in context whenever messages change
  const updateUnreadCount = useCallback(() => {
    const unreadCount = messages.filter((msg) => !msg.read && !msg.archived && !msg.deleted).length
    updateUnreadMessageCount("allocator", unreadCount)
  }, [messages, updateUnreadMessageCount])

  useEffect(() => {
    updateUnreadCount()
  }, [updateUnreadCount])

  // Memoize filtered messages to prevent recalculation on every render
  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      // Filter based on selected tab first
      if (selectedTab === "deleted" && !message.deleted) return false
      if (selectedTab !== "deleted" && message.deleted) return false
      if (selectedTab === "archived" && !message.archived) return false
      if (selectedTab !== "archived" && selectedTab !== "deleted" && message.archived) return false
      if (selectedTab === "starred" && !message.starred) return false
      if (selectedTab === "unread" && message.read) return false

      // Filter based on search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !message.subject.toLowerCase().includes(query) &&
          !message.sender.name.toLowerCase().includes(query) &&
          !message.preview.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      return true
    })
  }, [messages, selectedTab, searchQuery])

  // Simple event handlers
  function handleMessageClick(id: number) {
    setSelectedMessage(id)
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)))
  }

  function handleStarToggle(id: number, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, starred: !msg.starred } : msg)))
  }

  function handleArchive(id: number) {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, archived: true } : msg)))
    showToast("Message archived")
  }

  function handleDelete(id: number) {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, deleted: true } : msg)))
    if (selectedMessage === id) {
      setSelectedMessage(null)
    }
    showToast("Message moved to deleted")
  }

  function handlePermanentDelete(id: number) {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
    if (selectedMessage === id) {
      setSelectedMessage(null)
    }
    showToast("Message permanently deleted")
  }

  function handleRestore(id: number) {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, deleted: false } : msg)))
    showToast("Message restored")
  }

  function handleMarkUnread(id: number) {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, read: false } : msg)))
    showToast("Marked as unread")
  }

  // Modal handlers
  const [showCompose, setShowCompose] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [showForward, setShowForward] = useState(false)

  function openCompose() {
    setShowCompose(true)
  }

  function closeCompose() {
    setShowCompose(false)
    setComposeTo("")
    setComposeCc("")
    setComposeBcc("")
    setComposeSubject("")
    setComposeMessage("")
    setComposeAttachments([])
  }

  function openReply() {
    setShowReply(true)
  }

  function closeReply() {
    setShowReply(false)
    setReplyMessage("")
    setReplyAttachments([])
  }

  function openForward() {
    setShowForward(true)
  }

  function closeForward() {
    setShowForward(false)
    setForwardTo("")
    setForwardMessage("")
  }

  function handleSendCompose() {
    if (!composeTo.trim() || !composeSubject.trim() || !composeMessage.trim()) {
      showToast("Please fill in all required fields", "error")
      return
    }
    const recipients = [composeTo]
    if (composeCc.trim()) recipients.push(`CC: ${composeCc}`)
    if (composeBcc.trim()) recipients.push(`BCC: ${composeBcc}`)
    showToast(`Message sent to ${recipients.join(", ")}`)
    closeCompose()
  }

  function handleSendReply() {
    if (!replyMessage.trim()) {
      showToast("Please enter a reply message", "error")
    }
    const selectedMsg = messages.find((m) => m.id === selectedMessage)
    if (selectedMsg) {
      showToast(`Reply sent to ${selectedMsg.sender.name}`)
    }
    closeReply()
  }

  function handleSendForward() {
    if (!forwardTo.trim()) {
      showToast("Please enter a recipient email", "error")
      return
    }
    showToast(`Message forwarded to ${forwardTo}`)
    closeForward()
  }

  const selectedMessageData = messages.find((m) => m.id === selectedMessage)

  // Message list actions
  const toggleStarred = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, starred: !msg.starred } : msg)))
  }

  const archiveMessage = (id: number) => {
    console.log('Archive message called for ID:', id)
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, archived: true } : msg)))
    showToast("Message archived")
  }

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, deleted: true } : msg)))
    if (selectedMessage === id) {
      setSelectedMessage(null)
    }
    showToast("Message moved to deleted")
  }

  const permanentDeleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
    if (selectedMessage === id) {
      setSelectedMessage(null)
    }
    showToast("Message permanently deleted")
  }

  const restoreMessage = (id: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, deleted: false } : msg)))
    showToast("Message restored")
  }

  const markAsUnread = (id: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, read: false } : msg)))
    showToast("Marked as unread")
  }

  const handlePrint = () => {
    window.print()
  }

  const blockSender = (email: string) => {
    console.log(`Blocked sender: ${email}`)
    showToast(`Sender ${email} blocked`)
  }

  const addAttachment = (type: "compose" | "reply") => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.multiple = true
    fileInput.onchange = (e) => {
      const files = e.target.files
      if (files) {
        const fileNames = Array.from(files).map((file) => file.name)
        if (type === "compose") {
          setComposeAttachments((prev) => [...prev, ...fileNames])
        } else if (type === "reply") {
          setReplyAttachments((prev) => [...prev, ...fileNames])
        }
      }
    }
    fileInput.click()
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-semibold text-[#3B0A45]">Inbox</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedMessage) {
                  if (selectedTab === "deleted") {
                    handleRestore(selectedMessage)
                  } else {
                    handleArchive(selectedMessage)
                  }
                } else {
                  showToast("Please select a message", "error")
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
                    handlePermanentDelete(selectedMessage)
                  } else {
                    handleDelete(selectedMessage)
                  }
                } else {
                  showToast("Please select a message", "error")
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
                                  onClick: () => markAsUnread(selectedMessageData.id),
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
              <Label htmlFor="compose-cc">CC</Label>
              <Input
                id="compose-cc"
                placeholder="Enter CC recipients (optional)"
                value={composeCc}
                onChange={(e) => setComposeCc(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="compose-bcc">BCC</Label>
              <Input
                id="compose-bcc"
                placeholder="Enter BCC recipients (optional)"
                value={composeBcc}
                onChange={(e) => setComposeBcc(e.target.value)}
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
            <Button onClick={handleSendCompose}>
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
            <Button onClick={handleSendReply}>
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

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
