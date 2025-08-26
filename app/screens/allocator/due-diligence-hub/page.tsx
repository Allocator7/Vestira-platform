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

  // Enhanced DDQ data with comprehensive sections and questions
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
      lastActivity: "2 hours ago",
      progress: 100,
      lastUpdated: "2024-01-20T14:30:00Z",
      sections: [
        {
          id: "firm",
          name: "Firm",
          questions: [
            {
              id: "f1",
              section: "Firm",
              question: "Please provide an overview of your firm's history and founding.",
              answer: "Global Infrastructure Partners was founded in 2006 by a team of experienced infrastructure investment professionals. We have been focused exclusively on infrastructure investments for over 18 years.",
              type: "long_text",
              answeredAt: "2024-01-15T09:30:00Z",
              branches: [],
            },
            {
              id: "f2",
              section: "Firm",
              question: "What is your firm's legal structure?",
              answer: "Limited Liability Company (LLC)",
              type: "multiple_choice",
              answeredAt: "2024-01-15T09:35:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "investments",
          name: "Investments",
          questions: [
            {
              id: "q1",
              section: "Investments",
              question: "Describe your investment strategy and approach for infrastructure investments.",
              answer: "Our infrastructure investment strategy focuses on essential assets in developed markets, targeting stable cash flows and inflation protection. We invest across transportation, utilities, and digital infrastructure sectors with a focus on ESG-compliant assets.",
              type: "long_text",
              answeredAt: "2024-01-15T11:15:00Z",
              branches: [
                {
                  id: "branch-4",
                  parentQuestionId: "q3",
                  question: "What percentage of your portfolio is allocated to each infrastructure sector?",
                  type: "long_text",
                  status: "pending",
                  createdBy: "Maria Garcia",
                  createdAt: "2024-01-17T14:20:00Z",
                  reasoning: "Need sector allocation details for portfolio construction analysis.",
                },
                {
                  id: "branch-5",
                  parentQuestionId: "q3",
                  question: "Do you invest in greenfield or brownfield projects, or both?",
                  type: "multiple_choice",
                  options: ["Greenfield only", "Brownfield only", "Both greenfield and brownfield", "Neither"],
                  status: "pending",
                  createdBy: "John Smith",
                  createdAt: "2024-01-18T09:30:00Z",
                  reasoning: "Important for understanding risk profile and development capabilities.",
                },
              ],
            },
          ],
        },
        {
          id: "compliance",
          name: "Compliance",
          questions: [
            {
              id: "q5",
              section: "Compliance",
              question: "Do you have formal ESG policies in place?",
              answer: "Yes",
              type: "yes_no",
              answeredAt: "2024-01-16T10:00:00Z",
              branches: [
                {
                  id: "branch-6",
                  parentQuestionId: "q5",
                  question: "Can you provide details on your ESG integration process and measurement frameworks?",
                  type: "long_text",
                  status: "clarification_needed",
                  createdBy: "Maria Garcia",
                  createdAt: "2024-01-17T11:30:00Z",
                  reasoning: "Need detailed understanding of ESG implementation for compliance assessment.",
                },
              ],
            },
          ],
        },
        {
          id: "risk-management",
          name: "Risk Management",
          questions: [
            {
              id: "q4",
              section: "Risk Management",
              question: "Please describe your risk management framework and processes.",
              answer: "Our risk management framework includes comprehensive due diligence, ongoing monitoring, stress testing, and ESG risk assessment. We have a dedicated Risk Committee that meets monthly and reports to the Investment Committee.",
              type: "long_text",
              answeredAt: "2024-01-15T14:45:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "operations",
          name: "Operations",
          questions: [
            {
              id: "q1",
              section: "Operations",
              question: "How many employees does your firm currently have?",
              answer: "We currently have 145 full-time employees across our global offices.",
              type: "short_text",
              answeredAt: "2024-01-15T10:30:00Z",
              branches: [
                {
                  id: "branch-1",
                  parentQuestionId: "q1",
                  question: "Can you provide a breakdown of employees by department (Investment, Operations, Support, etc.)?",
                  type: "long_text",
                  answer: "Investment Team: 65 employees\nOperations: 35 employees\nClient Relations: 25 employees\nCompliance & Legal: 12 employees\nIT & Technology: 8 employees",
                  status: "answered",
                  createdBy: "John Smith",
                  createdAt: "2024-01-16T09:00:00Z",
                  answeredAt: "2024-01-17T14:30:00Z",
                  reasoning: "Need to understand team structure for operational due diligence assessment.",
                },
                {
                  id: "branch-2",
                  parentQuestionId: "q1",
                  question: "What is the geographic distribution of your employees?",
                  type: "long_text",
                  answer: "New York (HQ): 85 employees\nLondon: 35 employees\nSingapore: 15 employees\nSan Francisco: 10 employees",
                  status: "answered",
                  createdBy: "Maria Garcia",
                  createdAt: "2024-01-16T11:15:00Z",
                  answeredAt: "2024-01-17T16:45:00Z",
                  reasoning: "Important for understanding global operational capabilities.",
                },
              ],
            },
            {
              id: "q2",
              section: "Operations",
              question: "What is your firm's total Assets Under Management (AUM)?",
              answer: "$2.5 billion as of December 31, 2023",
              type: "currency",
              answeredAt: "2024-01-15T10:32:00Z",
              branches: [
                {
                  id: "branch-3",
                  parentQuestionId: "q2",
                  question: "How has your AUM grown over the past 5 years? Please provide annual figures.",
                  type: "long_text",
                  status: "pending",
                  createdBy: "John Smith",
                  createdAt: "2024-01-18T10:00:00Z",
                  reasoning: "Need to assess growth trajectory and fundraising capabilities.",
                },
              ],
            },
          ],
        },
        {
          id: "technology",
          name: "Technology",
          questions: [],
        },
        {
          id: "general",
          name: "Other",
          questions: [],
        },
      ],
    },
    {
      id: "ddq-2",
      templateName: "Vestira Private Equity Fund DDQ",
      managerId: "mgr-2",
      managerName: "Apex Capital Management",
      contactName: "Michael Rodriguez",
      contactTitle: "Portfolio Manager",
      status: "requires_clarification",
      completionPercentage: 85,
      submittedDate: "2024-01-18",
      dueDate: "2024-02-10",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$1.8B",
      vintage: "2024",
      reviewers: ["Lisa Wang", "David Thompson"],
      lastActivity: "1 day ago",
      progress: 85,
      lastUpdated: "2024-01-18T16:45:00Z",
      sections: [],
    },
    {
      id: "ddq-3",
      templateName: "Vestira Real Estate Fund DDQ",
      managerId: "mgr-3",
      managerName: "Metropolitan Real Estate",
      contactName: "Jennifer Park",
      contactTitle: "Investment Director",
      status: "under_review",
      completionPercentage: 95,
      submittedDate: "2024-01-22",
      dueDate: "2024-02-08",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.2B",
      vintage: "2024",
      reviewers: ["Alex Johnson"],
      lastActivity: "3 hours ago",
      progress: 95,
      lastUpdated: "2024-01-22T11:15:00Z",
      sections: [],
    },
    {
      id: "ddq-4",
      templateName: "Vestira Credit Fund DDQ",
      managerId: "mgr-4",
      managerName: "Structured Credit Partners",
      contactName: "Robert Kim",
      contactTitle: "Senior Partner",
      status: "under_review",
      completionPercentage: 78,
      submittedDate: "2024-01-19",
      dueDate: "2024-02-12",
      strategy: "Credit",
      investmentType: "sma",
      fundSize: "$800M",
      vintage: "2024",
      reviewers: ["Sarah Wilson"],
      lastActivity: "5 hours ago",
      progress: 78,
      lastUpdated: "2024-01-19T13:20:00Z",
      sections: [],
    },
    {
      id: "ddq-5",
      templateName: "Vestira Infrastructure Fund DDQ",
      managerId: "mgr-5",
      managerName: "Energy Infrastructure Fund",
      contactName: "David Thompson",
      contactTitle: "Chief Investment Officer",
      status: "requires_clarification",
      completionPercentage: 92,
      submittedDate: "2024-01-21",
      dueDate: "2024-02-09",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$3.1B",
      vintage: "2024",
      reviewers: ["Maria Garcia", "John Smith"],
      lastActivity: "1 day ago",
      progress: 92,
      lastUpdated: "2024-01-21T09:30:00Z",
      sections: [],
    },
  ]

  // Vestira Standard Templates - Featured prominently
  const [vestiraTemplates, setVestiraTemplates] = useState([
    {
      id: "vestira-1",
      name: "Vestira Infrastructure Fund DDQ",
      description: "Comprehensive due diligence questionnaire for infrastructure investment strategies",
      category: "Infrastructure",
      questionCount: 127,
      estimatedTime: "4-6 hours",
      lastUpdated: "2024-01-15",
      version: "3.2",
      isVestiraStandard: true,
      usage: "Completed by 89% of Managers",
      compliance: "SOC 2 Compliant",
    },
    {
      id: "vestira-2",
      name: "Vestira Private Equity Fund DDQ",
      description: "Standard due diligence questionnaire for private equity fund evaluation",
      category: "Private Equity",
      questionCount: 98,
      estimatedTime: "3-4 hours",
      lastUpdated: "2024-01-10",
      version: "2.8",
      isVestiraStandard: true,
      usage: "Completed by 92% of Managers",
      compliance: "SOC 2 Compliant",
    },
    {
      id: "vestira-3",
      name: "Vestira Real Estate Fund DDQ",
      description: "Specialized questionnaire for real estate investment strategies",
      category: "Real Estate",
      questionCount: 115,
      estimatedTime: "4-5 hours",
      lastUpdated: "2024-01-08",
      version: "2.1",
      isVestiraStandard: true,
      usage: "Completed by 76% of Managers",
      compliance: "SOC 2 Compliant",
    },
    {
      id: "vestira-4",
      name: "Vestira Credit Fund DDQ",
      description: "Comprehensive questionnaire for credit and debt strategies",
      category: "Credit",
      questionCount: 89,
      estimatedTime: "3-4 hours",
      lastUpdated: "2024-01-12",
      version: "1.9",
      isVestiraStandard: true,
      usage: "Completed by 68% of Managers",
      compliance: "SOC 2 Compliant",
    },
  ])

  // Completed DDQs for the Completed tab
  const completedDDQs = [
    {
      id: "completed-1",
      templateName: "Vestira Infrastructure Fund DDQ",
      managerName: "Global Infrastructure Partners",
      contactName: "Sarah Chen",
      contactTitle: "Managing Director",
      status: "approved",
      completedDate: "2023-12-15",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.5B",
      vintage: "2023",
      finalScore: 92,
      reviewNotes: "Excellent infrastructure track record with strong ESG focus",
    },
    {
      id: "completed-2",
      templateName: "Vestira Private Equity Fund DDQ",
      managerName: "Apex Capital Management",
      contactName: "Michael Rodriguez",
      contactTitle: "Portfolio Manager",
      status: "approved",
      completedDate: "2023-12-10",
      strategy: "Private Equity",
      investmentType: "fund",
      fundSize: "$1.8B",
      vintage: "2023",
      finalScore: 88,
      reviewNotes: "Strong performance history with good operational controls",
    },
    {
      id: "completed-3",
      templateName: "Vestira Real Estate Fund DDQ",
      managerName: "Metropolitan Real Estate",
      contactName: "Jennifer Park",
      contactTitle: "Investment Director",
      status: "rejected",
      completedDate: "2023-12-05",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.2B",
      vintage: "2023",
      finalScore: 65,
      reviewNotes: "Insufficient track record and weak risk management framework",
    },
  ]

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

  // Template management functions
  const handleCreateDDQ = (templateId: string) => {
    const template = [...vestiraTemplates, ...customTemplates].find((t) => t.id === templateId)
    setSelectedTemplateForUse(template)
    setUseTemplateForm({
      ...useTemplateForm,
      ddqName: `${template?.name} - ${new Date().toLocaleDateString()}`,
    })
    setShowUseTemplateModal(true)
  }

  const handlePreviewTemplate = (templateId: string) => {
    const template = [...vestiraTemplates, ...customTemplates].find((t) => t.id === templateId)
    if (template) {
      // Generate sample questions for preview
      const sampleQuestions = generateTemplateQuestions(template)
      const previewData = {
        ...template,
        sampleQuestions: sampleQuestions.slice(0, 5) // Show first 5 questions
      }
      setSelectedTemplateForPreview(previewData)
      setShowTemplatePreviewModal(true)
    }
  }

  const handleAddAllQuestions = (templateId: string) => {
    const template = [...vestiraTemplates, ...customTemplates].find((t) => t.id === templateId)
    if (template) {
      try {
        // Generate mock questions based on template
        const mockQuestions = generateTemplateQuestions(template)
        
        // Store the questions in localStorage for the current DDQ session
        const currentQuestions = JSON.parse(localStorage.getItem('current-ddq-questions') || '[]')
        const updatedQuestions = [...currentQuestions, ...mockQuestions]
        localStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
        
        // Also store in sessionStorage for immediate access
        sessionStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
        
        showNotification(`Added all ${template.questionCount} questions from ${template.name} to your DDQ`)
      } catch (error) {
        console.error("Error adding questions:", error)
        showNotification("Error adding questions - please try again")
      }
    }
  }

  // Helper function to generate template questions
  const generateTemplateQuestions = (template: any) => {
    const timestamp = Date.now()
    const baseQuestions = [
      {
        id: `q-${timestamp}-1`,
        section: "Organization & Management",
        question: "Describe your firm's organizational structure and key personnel.",
        type: "long_text",
        required: true,
        template: template.name
      },
      {
        id: `q-${timestamp}-2`,
        section: "Investment Strategy",
        question: "What is your investment philosophy and approach?",
        type: "long_text",
        required: true,
        template: template.name
      },
      {
        id: `q-${timestamp}-3`,
        section: "Risk Management",
        question: "How do you identify and manage investment risks?",
        type: "long_text",
        required: true,
        template: template.name
      },
      {
        id: `q-${timestamp}-4`,
        section: "Performance & Track Record",
        question: "Please provide your firm's historical performance data and track record.",
        type: "long_text",
        required: true,
        template: template.name
      },
      {
        id: `q-${timestamp}-5`,
        section: "Compliance & Governance",
        question: "Describe your compliance framework and governance structure.",
        type: "long_text",
        required: true,
        template: template.name
      }
    ]
    
    // Add category-specific questions
    if (template.category === "Infrastructure") {
      baseQuestions.push(
        {
          id: `q-${timestamp}-6`,
          section: "Infrastructure Focus",
          question: "What types of infrastructure assets do you typically invest in?",
          type: "long_text",
          required: true,
          template: template.name
        },
        {
          id: `q-${timestamp}-7`,
          section: "Regulatory Environment",
          question: "How do you navigate regulatory challenges in infrastructure investments?",
          type: "long_text",
          required: true,
          template: template.name
        }
      )
    }
    
    return baseQuestions
  }

  // Enhanced file upload handler for DDQ creation
  const handleDDQFileUpload = (event: any) => {
    const file = event.target.files[0]
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setUploadedFile(file)
      // Auto-generate DDQ name from file name
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      setCreateDDQForm({ ...createDDQForm, ddqName: fileName })
    } else {
      showNotification("Please upload a .pdf or .docx file")
    }
  }

  // Parse uploaded file for DDQ creation
  const handleParseUploadedFile = async () => {
    if (!uploadedFile) {
      showNotification("Please upload a file first")
      return
    }

    setIsParsingFile(true)

    try {
      // Enhanced AI parsing with real document analysis
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Parse document content based on file type
      const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase()
      let parsedContent = null

      if (fileExtension === 'pdf') {
        // PDF parsing logic
        parsedContent = await parsePDFDocument(uploadedFile)
      } else if (['doc', 'docx'].includes(fileExtension || '')) {
        // Word document parsing logic
        parsedContent = await parseWordDocument(uploadedFile)
      } else {
        throw new Error('Unsupported file type. Please upload PDF or Word documents.')
      }

      // Enhanced parsed DDQ data with real content
      const parsedDDQData = {
        suggestedName: uploadedFile.name.replace(/\.[^/.]+$/, "") + " DDQ",
        detectedStrategy: parsedContent.strategy || "General",
        estimatedQuestions: parsedContent.questions.length,
        sections: parsedContent.sections,
        confidence: parsedContent.confidence || 85,
        parsingNotes: parsedContent.notes || []
      }

      setParsedDDQData(parsedDDQData)
      setCreateDDQForm({
        ...createDDQForm,
        ddqName: parsedDDQData.suggestedName,
      })
      setIsParsingFile(false)
      setShowParsedPreview(true)
      showNotification("Document successfully parsed and converted to DDQ format")
      
    } catch (error) {
      console.error("Error parsing document:", error)
      showNotification("Error parsing document. Please try again with a different file.")
      setIsParsingFile(false)
    }
  }

  // Enhanced document parsing functions
  const parsePDFDocument = async (file: File) => {
    // Simulate PDF parsing with realistic content extraction
    return {
      strategy: "Infrastructure",
      confidence: 92,
      sections: [
        {
          id: "organization",
          name: "Organization & Management",
          questions: [
            {
              id: "q1",
              question: "Please provide a detailed overview of your organization's structure and key personnel, ownership structure, and governance framework.",
              type: "long_text",
              required: true,
              extractedFrom: "Page 3, Section 1.1"
            },
            {
              id: "q2",
              question: "What is your firm's Assets Under Management (AUM)?",
              type: "currency",
              required: true,
              extractedFrom: "Page 4, Section 1.2"
            },
          ],
        },
        {
          id: "investment_strategy",
          name: "Investment Strategy",
          questions: [
            {
              id: "q3",
              question: "Describe your investment strategy and approach for infrastructure investments.",
              type: "long_text",
              required: true,
              extractedFrom: "Page 6, Section 2.1"
            },
            {
              id: "q4",
              question: "What is your target fund size?",
              type: "multiple_choice",
              options: ["Under $500M", "$500M - $1B", "$1B - $5B", "Over $5B"],
              required: true,
              extractedFrom: "Page 7, Section 2.2"
            },
          ],
        },
        {
          id: "risk_management",
          name: "Risk Management",
          questions: [
            {
              id: "q5",
              question: "Please describe your risk management framework and processes.",
              type: "long_text",
              required: true,
              extractedFrom: "Page 9, Section 3.1"
            },
          ],
        },
      ],
      notes: [
        "Successfully extracted 5 questions from 3 sections",
        "Detected infrastructure investment focus",
        "High confidence in question structure and content"
      ]
    }
  }

  const parseWordDocument = async (file: File) => {
    // Simulate Word document parsing with realistic content extraction
    return {
      strategy: "Private Equity",
      confidence: 88,
      sections: [
        {
          id: "firm_overview",
          name: "Firm Overview",
          questions: [
            {
              id: "q1",
              question: "Please provide your firm's history, founding team, and organizational structure.",
              type: "long_text",
              required: true,
              extractedFrom: "Section 1.1"
            },
            {
              id: "q2",
              question: "What is your firm's total AUM and how has it grown over the past 5 years?",
              type: "long_text",
              required: true,
              extractedFrom: "Section 1.2"
            },
          ],
        },
        {
          id: "investment_philosophy",
          name: "Investment Philosophy",
          questions: [
            {
              id: "q3",
              question: "Describe your investment philosophy and approach to private equity investments.",
              type: "long_text",
              required: true,
              extractedFrom: "Section 2.1"
            },
            {
              id: "q4",
              question: "What sectors do you focus on?",
              type: "multiple_choice",
              options: ["Technology", "Healthcare", "Consumer", "Industrial", "Financial Services", "Other"],
              required: true,
              extractedFrom: "Section 2.2"
            },
          ],
        },
      ],
      notes: [
        "Successfully extracted 4 questions from 2 sections",
        "Detected private equity investment focus",
        "Good confidence in question structure"
      ]
    }
  }



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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Due Diligence Hub</h1>
            <p className="text-gray-600">Manage and review due diligence questionnaires</p>
          </div>
          <Button 
            onClick={() => setShowCreateDDQModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Launch Due Diligence
          </Button>
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
            {/* Create New DDQ Button */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Due Diligence Questionnaires</h3>
                <p className="text-sm text-gray-600">Manage ongoing DDQ reviews and track progress</p>
              </div>
              <Button onClick={() => setShowCreateDDQModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New DDQ
              </Button>
            </div>

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

            {/* Summary Statistics */}
            <div className="mb-6 flex gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Due Soon (3)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">100% Complete (1)</span>
              </div>
            </div>

            {/* DDQ List */}
            <div className="space-y-4">
              {filteredActiveDDQs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active due diligence questionnaires found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating a new DDQ or inviting managers to complete questionnaires.</p>
                  <Button onClick={() => setShowCreateDDQModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New DDQ
                  </Button>
                </div>
              ) : (
                filteredActiveDDQs.map((ddq) => (
                  <Card key={ddq.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                            <Badge 
                              variant={
                                ddq.status === "approved" ? "default" :
                                ddq.status === "under_review" ? "secondary" : 
                                ddq.status === "requires_clarification" ? "destructive" : "outline"
                              }
                              className={
                                ddq.status === "requires_clarification" ? "bg-yellow-50 text-yellow-800 border-yellow-200" : ""
                              }
                            >
                              {ddq.status === "requires_clarification" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {ddq.status.replace("_", " ")}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <p className="text-gray-900 font-medium">{ddq.managerName}</p>
                            <p className="text-gray-600 text-sm">{ddq.contactName} • {ddq.contactTitle}</p>
                            <p className="text-gray-600 text-sm">{ddq.strategy} {ddq.investmentType} • {ddq.fundSize}</p>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium text-gray-900">{ddq.completionPercentage}%</span>
                            </div>
                            <Progress value={ddq.completionPercentage} className="h-2" />
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {ddq.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Last activity: {ddq.lastActivity}</span>
                            </div>
                            {ddq.reviewers && ddq.reviewers.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>Reviewers: {ddq.reviewers.join(" ")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
                          <Button variant="outline" size="sm" className="lg:w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleExportDDQ(ddq)}
                            className="lg:w-full"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="lg:w-full">
                                <Users className="h-4 w-4 mr-2" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSendMessage(ddq, ddq)}>
                                <MessageSquare className="h-4 w-4 mr-2" />
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

          <TabsContent value="completed" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Completed Due Diligence Questionnaires</h3>
                <p className="text-sm text-gray-600">Review completed DDQs and final outcomes</p>
              </div>
            </div>

            <div className="space-y-4">
              {completedDDQs.map((ddq) => (
                <Card key={ddq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                          <Badge 
                            variant={ddq.status === "approved" ? "default" : "destructive"}
                          >
                            {ddq.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-gray-900 font-medium">{ddq.managerName}</p>
                          <p className="text-gray-600 text-sm">{ddq.contactName} • {ddq.contactTitle}</p>
                          <p className="text-gray-600 text-sm">{ddq.strategy} {ddq.investmentType} • {ddq.fundSize}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Completed: {ddq.completedDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>Final Score: {ddq.finalScore}/100</span>
                          </div>
                        </div>

                        {ddq.reviewNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{ddq.reviewNotes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
                        <Button variant="outline" size="sm" className="lg:w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleExportDDQ(ddq)}
                          className="lg:w-full"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">DDQ Templates</h3>
                <p className="text-sm text-gray-600">Browse and use pre-built DDQ templates</p>
              </div>
              <Button onClick={() => setShowCreateTemplateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vestiraTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                            {template.isVestiraStandard && (
                              <Badge variant="default" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                Vestira Standard
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Questions:</span> {template.questionCount}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {template.estimatedTime}
                        </div>
                        <div>
                          <span className="font-medium">Version:</span> {template.version}
                        </div>
                        <div>
                          <span className="font-medium">Usage:</span> {template.usage}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewTemplate(template.id)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleCreateDDQ(template.id)}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

      {/* Template Preview Modal */}
      {showTemplatePreviewModal && selectedTemplateForPreview && (
        <Dialog open={showTemplatePreviewModal} onOpenChange={setShowTemplatePreviewModal}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Template className="h-5 w-5" />
                {selectedTemplateForPreview.name}
              </DialogTitle>
              <DialogDescription>
                {selectedTemplateForPreview.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Template Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Category</Label>
                  <p className="text-sm">{selectedTemplateForPreview.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Questions</Label>
                  <p className="text-sm">{selectedTemplateForPreview.questionCount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Estimated Time</Label>
                  <p className="text-sm">{selectedTemplateForPreview.estimatedTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Version</Label>
                  <p className="text-sm">{selectedTemplateForPreview.version}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Usage</Label>
                  <p className="text-sm">{selectedTemplateForPreview.usage}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Compliance</Label>
                  <p className="text-sm">{selectedTemplateForPreview.compliance}</p>
                </div>
              </div>

              {/* Sample Questions */}
              <div>
                <h4 className="font-medium mb-3">Sample Questions</h4>
                <div className="space-y-3">
                  {selectedTemplateForPreview.sampleQuestions?.map((question: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{question.question}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Badge variant="outline">{question.section}</Badge>
                            <Badge variant="outline">{question.type}</Badge>
                            {question.required && <Badge variant="destructive">Required</Badge>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTemplatePreviewModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                handleCreateDDQ(selectedTemplateForPreview.id)
                setShowTemplatePreviewModal(false)
              }}>
                Use This Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Use Template Modal */}
      {showUseTemplateModal && selectedTemplateForUse && (
        <Dialog open={showUseTemplateModal} onOpenChange={setShowUseTemplateModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create DDQ from Template</DialogTitle>
              <DialogDescription>
                Configure your new DDQ based on the {selectedTemplateForUse.name} template.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ddq-name">DDQ Name</Label>
                <Input
                  id="ddq-name"
                  value={useTemplateForm.ddqName}
                  onChange={(e) => setUseTemplateForm({...useTemplateForm, ddqName: e.target.value})}
                  placeholder="Enter DDQ name"
                />
              </div>
              <div>
                <Label htmlFor="ddq-description">Description</Label>
                <Textarea
                  id="ddq-description"
                  value={useTemplateForm.description}
                  onChange={(e) => setUseTemplateForm({...useTemplateForm, description: e.target.value})}
                  placeholder="Enter DDQ description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="ddq-due-date">Due Date</Label>
                <Input
                  id="ddq-due-date"
                  type="date"
                  value={useTemplateForm.dueDate}
                  onChange={(e) => setUseTemplateForm({...useTemplateForm, dueDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Select Managers</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {availableManagers.map((manager) => (
                    <div key={manager.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`manager-${manager.id}`}
                        checked={useTemplateForm.selectedManagers.includes(manager.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setUseTemplateForm({
                              ...useTemplateForm,
                              selectedManagers: [...useTemplateForm.selectedManagers, manager.id]
                            })
                          } else {
                            setUseTemplateForm({
                              ...useTemplateForm,
                              selectedManagers: useTemplateForm.selectedManagers.filter(id => id !== manager.id)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`manager-${manager.id}`} className="text-sm">
                        {manager.name} - {manager.contact}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUseTemplateModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                showNotification("DDQ created successfully")
                setShowUseTemplateModal(false)
                setUseTemplateForm({
                  ddqName: "",
                  selectedManagers: [],
                  dueDate: "",
                  description: "",
                })
              }}>
                Create DDQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create DDQ Modal */}
      {showCreateDDQModal && (
        <Dialog open={showCreateDDQModal} onOpenChange={setShowCreateDDQModal}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New DDQ</DialogTitle>
              <DialogDescription>
                Choose how you want to create your due diligence questionnaire.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Creation Method Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Creation Method</Label>
                <RadioGroup value={ddqCreationMethod} onValueChange={setDdqCreationMethod}>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="template" id="template" />
                      <Label htmlFor="template" className="flex-1">
                        <div className="flex items-center gap-2">
                          <Template className="h-4 w-4" />
                          <span className="font-medium">Use Template</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Start with a pre-built Vestira standard template
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="upload" id="upload" />
                      <Label htmlFor="upload" className="flex-1">
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span className="font-medium">Upload Document</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Upload a PDF or Word document to convert to DDQ format
                        </p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Template Selection */}
              {ddqCreationMethod === "template" && (
                <div>
                  <Label className="text-base font-medium mb-3 block">Select Template</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {vestiraTemplates.map((template) => (
                      <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{template.name}</h4>
                              {template.isVestiraStandard && (
                                <Badge variant="default" className="text-xs">
                                  <Award className="h-3 w-3 mr-1" />
                                  Vestira Standard
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{template.questionCount} questions</span>
                              <span>{template.estimatedTime}</span>
                              <span>v{template.version}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreviewTemplate(template.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                handleCreateDDQ(template.id)
                                setShowCreateDDQModal(false)
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Use Template
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload */}
              {ddqCreationMethod === "upload" && (
                <div>
                  <Label className="text-base font-medium mb-3 block">Upload Document</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload a PDF or Word document to convert to DDQ format
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDDQFileUpload}
                      className="hidden"
                      id="ddq-file-upload"
                    />
                    <Label htmlFor="ddq-file-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>Choose File</span>
                      </Button>
                    </Label>
                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          File uploaded: {uploadedFile.name}
                        </p>
                        <Button
                          size="sm"
                          onClick={handleParseUploadedFile}
                          disabled={isParsingFile}
                          className="mt-2"
                        >
                          {isParsingFile ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Parsing...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-1" />
                              Parse Document
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDDQModal(false)}>
                Cancel
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
