"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Screen } from "../../../../components/Screen"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "../../../../components/ui/select"
import { Checkbox } from "../../../../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  Star,
  Upload,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  X,
  Calendar,
  Users,
  FileUp,
  Plus,
  LayoutTemplateIcon as Template,
  MessageSquare,
  Clock,
  Download,
  Edit,
  Trash2,
  Copy,
  Share,
  Filter,
  Search,
  Settings,
  BarChart3,
  TrendingUp,
  Award,
  Shield,
  Globe,
  Building,
  DollarSign,
  PieChart,
  Target,
  Zap,
  BookOpen,
  FileCheck,
  UserCheck,
  AlertCircle,
  Info,
  HelpCircle,
} from "lucide-react"
import { useApp } from "../../../../context/AppContext"
import { useRouter, useSearchParams } from "next/navigation"
import { BranchingQuestionManager } from "../../../../components/BranchingQuestionManager"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { Progress } from "../../../../components/ui/progress"
import { Separator } from "../../../../components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip"
import { Alert, AlertDescription } from "../../../../components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar"

export default function AllocatorDueDiligenceHubPage() {
  console.log('AllocatorDueDiligenceHubPage: Component starting to render')
  
  // Get context with safe fallback
  let userRole = "allocator"
  let currentPersonProfile = { name: "Current User" }
  
  try {
    const appContext = useApp()
    if (appContext) {
      userRole = appContext.userRole || "allocator"
      currentPersonProfile = appContext.currentPersonProfile ? 
        { name: appContext.currentPersonProfile.firstName + " " + appContext.currentPersonProfile.lastName } : 
        { name: "Current User" }
    }
  } catch (error) {
    console.error('Error accessing AppContext:', error)
    // Keep safe defaults
  }
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Basic state
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStrategy, setSelectedStrategy] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [notification, setNotification] = useState("")
  
  // Modal states
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedManager, setSelectedManager] = useState<any>(null)
  const [selectedDDQ, setSelectedDDQ] = useState<any>(null)
  const [messageContent, setMessageContent] = useState("")
  const [messageTopic, setMessageTopic] = useState("")
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [meetingDetails, setMeetingDetails] = useState({
    topic: "",
    purpose: "",
    date: "",
    time: "",
    duration: "60",
    type: "video",
  })

  // Enhanced DDQ Creation Modal States
  const [showCreateDDQModal, setShowCreateDDQModal] = useState(false)
  const [ddqCreationMethod, setDdqCreationMethod] = useState("template") // "template" or "upload"
  const [createDDQForm, setCreateDDQForm] = useState({
    ddqName: "",
    selectedTemplate: "",
    selectedManagers: [],
    dueDate: "",
    description: "",
    strategies: [],
    fundTypes: {
      fund: false,
      sma: false,
      other: false,
    },
    fundSize: "",
    visibility: "private",
  })

  // File upload states for DDQ creation
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isParsingFile, setIsParsingFile] = useState(false)
  const [parsedDDQData, setParsedDDQData] = useState(null)
  const [showParsedPreview, setShowParsedPreview] = useState(false)
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false)
  const [showQuestionSelector, setShowQuestionSelector] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "General",
    questions: []
  })
  const [currentDDQQuestions, setCurrentDDQQuestions] = useState([])
  const [isQuestionSelectorForDDQ, setIsQuestionSelectorForDDQ] = useState(false)
  const [selectedQuestionsInSelector, setSelectedQuestionsInSelector] = useState([])
  
  // Template management state
  const [customTemplates, setCustomTemplates] = useState<any[]>([])
  
  // DDQ Editing State
  const [showEditDDQModal, setShowEditDDQModal] = useState(false)
  const [editingDDQ, setEditingDDQ] = useState(null)
  const [editDDQForm, setEditDDQForm] = useState({
    ddqName: "",
    description: "",
    dueDate: "",
    selectedManagers: [],
    strategies: [],
    fundTypes: {
      fund: false,
      sma: false,
      other: false,
    },
    fundSize: "",
    visibility: "private",
  })

  const [showTemplatePreviewModal, setShowTemplatePreviewModal] = useState(false)
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState(null)
  const [showUseTemplateModal, setShowUseTemplateModal] = useState(false)
  const [selectedTemplateForUse, setSelectedTemplateForUse] = useState(null)
  const [useTemplateForm, setUseTemplateForm] = useState({
    ddqName: "",
    selectedManagers: [],
    dueDate: "",
    description: "",
  })

  // Add Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedDDQForReview, setSelectedDDQForReview] = useState(null)

  // New state for question-by-question view
  const [viewMode, setViewMode] = useState<"overview" | "question-by-question">("overview")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

  // New state for sectioned organization
  const [activeSection, setActiveSection] = useState("firm")

  // Standard DDQ sections
  const ddqSections = [
    { id: "firm", name: "Firm", icon: "🏢" },
    { id: "investments", name: "Investments", icon: "📈" },
    { id: "compliance", name: "Compliance", icon: "⚖️" },
    { id: "risk-management", name: "Risk Management", icon: "🛡️" },
    { id: "operations", name: "Operations", icon: "⚙️" },
    { id: "technology", name: "Technology", icon: "💻" },
    { id: "general", name: "Other", icon: "📋" },
  ]
  
  console.log('AllocatorDueDiligenceHubPage: Hooks initialized successfully')
  
  // Check for tab parameter on mount
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "active") {
      setActiveTab("active")
    }
  }, [searchParams])

  // Load custom templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('custom-ddq-templates')
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates)
        // Update the customTemplates array with saved templates
        setCustomTemplates(prev => [...prev, ...parsedTemplates])
      } catch (error) {
        console.error("Error loading custom templates:", error)
      }
    }
  }, [])

  // Load current DDQ questions from localStorage on mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem('current-ddq-questions')
    if (savedQuestions) {
      try {
        const parsedQuestions = JSON.parse(savedQuestions)
        setCurrentDDQQuestions(parsedQuestions)
      } catch (error) {
        console.error("Error loading current DDQ questions:", error)
      }
    }
  }, [])

  // Real manager data from the system
  const availableManagers = [
    { 
      id: "1", 
      name: "Growth Capital Partners", 
      contact: "David Rodriguez", 
      title: "Managing Partner",
      firm: "Growth Capital Partners",
      firmType: "Private Equity",
      location: "San Francisco, CA",
      aum: "$2.5B",
      email: "david.rodriguez@growthcapital.com"
    },
    { 
      id: "2", 
      name: "Sustainable Equity Fund", 
      contact: "Sarah Chen", 
      title: "Portfolio Manager",
      firm: "Sustainable Equity Fund",
      firmType: "Hedge Fund",
      location: "New York, NY",
      aum: "$1.2B",
      email: "sarah.chen@sustainableequity.com"
    },
    { 
      id: "3", 
      name: "Infrastructure Capital", 
      contact: "Michael Thompson", 
      title: "Senior Managing Director",
      firm: "Infrastructure Capital",
      firmType: "Infrastructure",
      location: "London, UK",
      aum: "$3.8B",
      email: "michael.thompson@infrastructurecapital.com"
    },
    { 
      id: "4", 
      name: "Venture Dynamics", 
      contact: "Jennifer Park", 
      title: "Founding Partner",
      firm: "Venture Dynamics",
      firmType: "Venture Capital",
      location: "Palo Alto, CA",
      aum: "$800M",
      email: "jennifer.park@venturedynamics.com"
    },
    { 
      id: "5", 
      name: "Fixed Income Strategies", 
      contact: "Robert Wilson", 
      title: "Chief Investment Officer",
      firm: "Fixed Income Strategies",
      firmType: "Credit",
      location: "Chicago, IL",
      aum: "$4.2B",
      email: "robert.wilson@fixedincome.com"
    }
  ]



  // Helper function to safely access localStorage and sessionStorage
  const safeStorage = {
    localStorage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem(key)
        }
        return null
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value)
        }
      }
    },
    sessionStorage: {
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(key, value)
        }
      }
    }
  }
  
  // Simple error boundary
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We encountered an unexpected error. Please try again or contact support if the problem persists.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleExportDDQ = (ddq: any) => {
    try {
      // Create a CSV-like structure for the DDQ data
      const csvData = [
        ["DDQ Template", ddq.templateName],
        ["Manager", ddq.managerName],
        ["Contact", `${ddq.contactName} (${ddq.contactTitle})`],
        ["Status", ddq.status],
        ["Strategy", ddq.strategy],
        ["Fund Size", ddq.fundSize],
        ["Vintage", ddq.vintage],
        ["Due Date", ddq.dueDate],
        ["Completion", `${ddq.completionPercentage}%`],
        ["", ""], // Empty row
        ["Questions and Answers:", ""],
        ["Question", "Answer", "Status"]
      ]

      // Add sample questions (in a real app, this would come from the actual DDQ data)
      const sampleQuestions = [
        ["What is your investment strategy?", "Infrastructure focus with 8-12% target returns", "Completed"],
        ["What is your fund size?", "$2.5 billion", "Completed"],
        ["What is your track record?", "15+ years in infrastructure investing", "Completed"]
      ]

      csvData.push(...sampleQuestions)

      // Convert to CSV string
      const csvContent = csvData.map(row => row.join(",")).join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${ddq.templateName.replace(/\s+/g, "_")}_export.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      showNotification("DDQ exported successfully")
    } catch (error) {
      console.error("Export error:", error)
      showNotification("Failed to export DDQ")
    }
  }

  const handleSendMessage = (manager: any, ddq: any) => {
    setSelectedManager(manager)
    setSelectedDDQ(ddq)
    setShowMessageModal(true)
  }

  const handleScheduleMeeting = (manager: any, ddq: any) => {
    setSelectedManager(manager)
    setSelectedDDQ(ddq)
    setShowMeetingModal(true)
  }

  // Mock data for testing
  const activeDDQs = [
    {
      id: "ddq-1",
      templateName: "Vestira Infrastructure Fund DDQ",
      managerId: "mgr-1",
      managerName: "Global Infrastructure Partners",
      contactName: "Sarah Chen",
      contactTitle: "Managing Director",
      status: "under_review",
      completionPercentage: 100,
      submittedDate: "2024-01-20",
      dueDate: "2024-02-15",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.5B",
      vintage: "2024",
      reviewers: ["John Smith", "Maria Garcia"],
      lastActivity: "2024-01-25",
      progress: 85,
      lastUpdated: "2024-01-25T10:30:00Z",
      sections: []
    },
    {
      id: "ddq-2",
      templateName: "Vestira Private Equity DDQ",
      managerId: "mgr-2",
      managerName: "Growth Capital Partners",
      contactName: "David Rodriguez",
      contactTitle: "Managing Partner",
      status: "approved",
      completionPercentage: 100,
      submittedDate: "2024-01-15",
      dueDate: "2024-02-01",
      strategy: "Private Equity",
      investmentType: "fund",
      fundSize: "$1.8B",
      vintage: "2024",
      reviewers: ["John Smith"],
      lastActivity: "2024-01-28",
      progress: 100,
      lastUpdated: "2024-01-28T16:45:00Z",
      sections: []
    },
    {
      id: "ddq-3",
      templateName: "Vestira Real Estate DDQ",
      managerId: "mgr-3",
      managerName: "Urban Development Capital",
      contactName: "Emily Watson",
      contactTitle: "Senior Director",
      status: "pending",
      completionPercentage: 75,
      submittedDate: "2024-01-28",
      dueDate: "2024-02-20",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.2B",
      vintage: "2024",
      reviewers: ["Alex Thompson", "Rachel Green"],
      lastActivity: "2024-01-29",
      progress: 75,
      lastUpdated: "2024-01-29T14:20:00Z",
      sections: []
    }
  ]

  // Filter active DDQs based on search, strategy, and status
  const filteredActiveDDQs = activeDDQs.filter((ddq) => {
    const matchesSearch = searchQuery === "" || 
      ddq.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ddq.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ddq.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStrategy = selectedStrategy === "All" || ddq.strategy === selectedStrategy
    const matchesStatus = selectedStatus === "All" || ddq.status === selectedStatus
    
    return matchesSearch && matchesStrategy && matchesStatus
  })

  const availableStrategies = [
    "Infrastructure",
    "Private Equity", 
    "Real Estate",
    "Credit",
    "Hedge Funds",
    "Venture Capital",
    "Distressed Debt",
    "Growth Equity",
  ]

  const availableStatuses = [
    "pending",
    "under_review", 
    "approved",
    "rejected",
    "completed"
  ]

  console.log('AllocatorDueDiligenceHubPage: About to render JSX')

  return (
    <Screen>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Due Diligence Hub</h1>
          <p className="text-gray-600">Manage and review due diligence questionnaires</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{notification}</p>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active DDQs</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search DDQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Strategies</SelectItem>
                  {availableStrategies.map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="requires_clarification">Requires Clarification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* DDQ List */}
            <div className="space-y-4">
              {filteredActiveDDQs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active due diligence questionnaires found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating a new DDQ or inviting managers to complete questionnaires.</p>
                  <Button onClick={() => showNotification("Create DDQ functionality coming soon")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New DDQ
                  </Button>
                </div>
              ) : (
                filteredActiveDDQs.map((ddq) => (
                  <Card key={ddq.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                            <Badge 
                              variant={
                                ddq.status === "approved" ? "default" :
                                ddq.status === "under_review" ? "secondary" : "destructive"
                              }
                            >
                              {ddq.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{ddq.managerName}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                            <span>Contact: {ddq.contactName}</span>
                            <span>•</span>
                            <span>Strategy: {ddq.strategy}</span>
                            <span>•</span>
                            <span>Due: {ddq.dueDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleExportDDQ(ddq)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Users className="h-4 w-4 mr-2" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSendMessage(ddq, ddq)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleMeeting(ddq, ddq)}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Meeting
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Completed DDQs</h3>
              <p className="text-gray-500">View completed due diligence questionnaires here.</p>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="text-center py-12">
              <Template className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">DDQ Templates</h3>
              <p className="text-gray-500">Manage and create DDQ templates here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedManager && selectedDDQ && (
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Send Message to {selectedManager.contactName}</DialogTitle>
              <DialogDescription>
                Send a message regarding the {selectedDDQ.templateName} DDQ.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={messageTopic}
                  onChange={(e) => setMessageTopic(e.target.value)}
                  placeholder="Enter message topic"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Enter your message..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                showNotification("Message sent successfully")
                setShowMessageModal(false)
                setMessageTopic("")
                setMessageContent("")
              }}>
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Meeting Modal */}
      {showMeetingModal && selectedManager && selectedDDQ && (
        <Dialog open={showMeetingModal} onOpenChange={setShowMeetingModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule Meeting with {selectedManager.contactName}</DialogTitle>
              <DialogDescription>
                Schedule a meeting to discuss the {selectedDDQ.templateName} DDQ.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meeting-topic">Meeting Topic</Label>
                <Input
                  id="meeting-topic"
                  value={meetingDetails.topic}
                  onChange={(e) => setMeetingDetails({...meetingDetails, topic: e.target.value})}
                  placeholder="Enter meeting topic"
                />
              </div>
              <div>
                <Label htmlFor="meeting-purpose">Purpose</Label>
                <Textarea
                  id="meeting-purpose"
                  value={meetingDetails.purpose}
                  onChange={(e) => setMeetingDetails({...meetingDetails, purpose: e.target.value})}
                  placeholder="Describe the meeting purpose..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meeting-date">Date</Label>
                  <Input
                    id="meeting-date"
                    type="date"
                    value={meetingDetails.date}
                    onChange={(e) => setMeetingDetails({...meetingDetails, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="meeting-time">Time</Label>
                  <Input
                    id="meeting-time"
                    type="time"
                    value={meetingDetails.time}
                    onChange={(e) => setMeetingDetails({...meetingDetails, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meeting-duration">Duration (minutes)</Label>
                  <Select value={meetingDetails.duration} onValueChange={(value) => setMeetingDetails({...meetingDetails, duration: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="meeting-type">Meeting Type</Label>
                  <Select value={meetingDetails.type} onValueChange={(value) => setMeetingDetails({...meetingDetails, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMeetingModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                showNotification("Meeting scheduled successfully")
                setShowMeetingModal(false)
                setMeetingDetails({
                  topic: "",
                  purpose: "",
                  date: "",
                  time: "",
                  duration: "60",
                  type: "video",
                })
              }}>
                Schedule Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Screen>
  )
}
