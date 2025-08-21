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
} from "lucide-react"
import { useApp } from "../../../../context/AppContext"
import { useRouter, useSearchParams } from "next/navigation"
import { BranchingQuestionManager } from "../../../../components/BranchingQuestionManager"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align === "end" ? "end" : "start"} className="w-48">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              item.onClick()
            }}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AllocatorDueDiligenceHubPage() {
  const [error, setError] = useState<string | null>(null)
  
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
  
  // All state hooks must be at the top level
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStrategy, setSelectedStrategy] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [notification, setNotification] = useState("")
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedManager, setSelectedManager] = useState(null)
  const [selectedDDQ, setSelectedDDQ] = useState(null)
  const [messageContent, setMessageContent] = useState("")
  const [messageTopic, setMessageTopic] = useState("")
  const [selectedManagersForMessage, setSelectedManagersForMessage] = useState<string[]>([])
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [selectedManagersForMeeting, setSelectedManagersForMeeting] = useState<string[]>([])
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

  // Check for tab parameter on mount
  useEffect(() => {
    try {
      if (searchParams) {
        const tab = searchParams.get("tab")
        if (tab === "active") {
          setActiveTab("active")
        }
      }
    } catch (error) {
      console.error("Error accessing search params:", error)
    }
  }, [searchParams])

  // Load custom templates from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTemplates = localStorage.getItem('custom-ddq-templates')
        if (savedTemplates) {
          const parsedTemplates = JSON.parse(savedTemplates)
          // Update the customTemplates array with saved templates
          setCustomTemplates(prev => [...prev, ...parsedTemplates])
        }
      } catch (error) {
        console.error("Error loading custom templates:", error)
      }
    }
  }, [])

  // Load current DDQ questions from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedQuestions = localStorage.getItem('current-ddq-questions')
        if (savedQuestions) {
          const parsedQuestions = JSON.parse(savedQuestions)
          setCurrentDDQQuestions(parsedQuestions)
        }
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
      name: "Global Infrastructure Partners", 
      contact: "Michael Thompson", 
      title: "Investment Director",
      firm: "Global Infrastructure Partners",
      firmType: "Infrastructure",
      location: "London, UK",
      aum: "$4.8B",
      email: "michael.thompson@globalinfra.com"
    },
    { 
      id: "4", 
      name: "Emerging Markets Capital", 
      contact: "Lisa Park", 
      title: "Senior Portfolio Manager",
      firm: "Emerging Markets Capital",
      firmType: "Emerging Markets",
      location: "Singapore",
      aum: "$3.1B",
      email: "lisa.park@emcapital.com"
    },
    { 
      id: "5", 
      name: "Real Estate Investment Trust", 
      contact: "James Wilson", 
      title: "Chief Investment Officer",
      firm: "Real Estate Investment Trust",
      firmType: "Real Estate",
      location: "Chicago, IL",
      aum: "$6.2B",
      email: "james.wilson@reit.com"
    }
  ]

  // Vestira standard templates
  const vestiraTemplates = [
    {
      id: "vestira-standard",
      name: "Vestira Standard DDQ",
      description: "Comprehensive due diligence questionnaire covering all major areas",
      category: "General",
      questionCount: 120,
      estimatedTime: "3-4 hours",
      lastUpdated: "2024-01-15",
      version: "2.1",
      isVestiraStandard: true,
      usage: "Completed by 85% of Allocators",
      compliance: "SOC 2 Compliant",
      questions: []
    },
    {
      id: "vestira-esg",
      name: "Vestira ESG DDQ",
      description: "Environmental, social, and governance focused questionnaire",
      category: "ESG",
      questionCount: 75,
      estimatedTime: "2-3 hours",
      lastUpdated: "2024-01-10",
      version: "1.8",
      isVestiraStandard: true,
      usage: "Completed by 45% of Allocators",
      compliance: "SOC 2 Compliant",
      questions: []
    },
    {
      id: "vestira-infrastructure",
      name: "Vestira Infrastructure DDQ",
      description: "Specialized questionnaire for infrastructure investments",
      category: "Infrastructure",
      questionCount: 90,
      estimatedTime: "2.5-3.5 hours",
      lastUpdated: "2024-01-12",
      version: "1.5",
      isVestiraStandard: true,
      usage: "Completed by 68% of Managers",
      compliance: "SOC 2 Compliant",
      questions: []
    },
  ]

  // Custom templates
  const [customTemplates, setCustomTemplates] = useState([
    {
      id: "custom-1",
      name: "ESG Assessment Questionnaire",
      description: "Environmental, social, and governance evaluation template",
      category: "ESG",
      questionCount: 65,
      estimatedTime: "2-3 hours",
      lastUpdated: "2024-01-05",
      version: "1.2",
      isVestiraStandard: false,
      usage: "Custom template",
      compliance: "Internal Use",
      questions: []
    },
  ])
  
  try {
    console.log('Due Diligence Hub: Starting component initialization')
    
    // Get context and router with fallbacks
    const { userRole, currentPersonProfile } = useApp() || { userRole: null, currentPersonProfile: null }
    const router = useRouter()
    
    // Handle useSearchParams with proper error handling
    let searchParams = null
    try {
      searchParams = useSearchParams()
    } catch (error) {
      console.error("Error accessing search params:", error)
    }

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

  // Available strategies
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

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
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

  const handleExportDDQ = (ddq: any) => {
    try {
      // Create DDQ content
      const ddqContent = `Due Diligence Questionnaire Export
Generated: ${new Date().toLocaleDateString()}
Template: ${ddq.templateName}
Manager: ${ddq.managerName}
Contact: ${ddq.contactName}
Status: ${ddq.status}
Strategy: ${ddq.strategy}
Investment Type: ${ddq.investmentType}
Fund Size: ${ddq.fundSize}
Vintage: ${ddq.vintage}
Due Date: ${ddq.dueDate}

SECTIONS AND QUESTIONS:
${ddq.sections?.map((section: any) => `
${section.name.toUpperCase()}:
${section.questions?.map((question: any) => `
Q: ${question.question}
A: ${question.answer || 'Not answered'}
Type: ${question.type}
Answered: ${question.answeredAt ? new Date(question.answeredAt).toLocaleDateString() : 'Not answered'}

`).join('') || 'No questions in this section'}
`).join('') || 'No sections available'}

BRANCHING QUESTIONS:
${ddq.sections?.flatMap((section: any) => 
  section.questions?.flatMap((question: any) => 
    question.branches?.map((branch: any) => `
Branch Question: ${branch.question}
Type: ${branch.type}
Status: ${branch.status}
Created by: ${branch.createdBy}
Created: ${new Date(branch.createdAt).toLocaleDateString()}
Reasoning: ${branch.reasoning}

`).join('') || []
  ) || []
) || 'No branching questions'}

REVIEWERS: ${ddq.reviewers?.join(', ') || 'None assigned'}
Last Activity: ${ddq.lastActivity}
Progress: ${ddq.progress}%
Last Updated: ${new Date(ddq.lastUpdated).toLocaleDateString()}
`

      // Create and download file
      const blob = new Blob([ddqContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `DDQ_${ddq.templateName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showNotification(`DDQ exported successfully: ${ddq.templateName}`)
    } catch (error) {
      console.error('Error exporting DDQ:', error)
      showNotification('Error exporting DDQ. Please try again.')
    }
  }

  // Active DDQs - Allocator sending to managers
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
              answer:
                "Global Infrastructure Partners was founded in 2006 by a team of experienced infrastructure investment professionals. We have been focused exclusively on infrastructure investments for over 18 years.",
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
              answer:
                "Our infrastructure investment strategy focuses on essential assets in developed markets, targeting stable cash flows and inflation protection. We invest across transportation, utilities, and digital infrastructure sectors with a focus on ESG-compliant assets.",
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
              answer:
                "Our risk management framework includes comprehensive due diligence, ongoing monitoring, stress testing, and ESG risk assessment. We have a dedicated Risk Committee that meets monthly and reports to the Investment Committee.",
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
                  question:
                    "Can you provide a breakdown of employees by department (Investment, Operations, Support, etc.)?",
                  type: "long_text",
                  answer:
                    "Investment Team: 65 employees\nOperations: 35 employees\nClient Relations: 25 employees\nCompliance & Legal: 12 employees\nIT & Technology: 8 employees",
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
                  answer:
                    "New York (HQ): 85 employees\nLondon: 35 employees\nSingapore: 15 employees\nSan Francisco: 10 employees",
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
    {
      id: "ddq-6",
      templateName: "Vestira Private Equity Fund DDQ",
      managerId: "mgr-6",
      managerName: "Growth Equity Partners",
      contactName: "Lisa Wang",
      contactTitle: "Managing Partner",
      status: "under_review",
      completionPercentage: 88,
      submittedDate: "2024-01-17",
      dueDate: "2024-02-14",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$2.2B",
      vintage: "2024",
      reviewers: ["David Thompson"],
      lastActivity: "6 hours ago",
      progress: 88,
      lastUpdated: "2024-01-17T15:45:00Z",
      sections: [],
    },
    {
      id: "ddq-7",
      templateName: "Vestira Real Estate Fund DDQ",
      managerId: "mgr-7",
      managerName: "Commercial Property Fund",
      contactName: "Carlos Martinez",
      contactTitle: "Investment Committee Chair",
      status: "under_review",
      completionPercentage: 75,
      submittedDate: "2024-01-23",
      dueDate: "2024-02-11",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$950M",
      vintage: "2024",
      reviewers: ["Jennifer Park"],
      lastActivity: "2 days ago",
      progress: 75,
      lastUpdated: "2024-01-23T10:00:00Z",
      sections: [],
    },
    {
      id: "ddq-8",
      templateName: "Vestira Credit Fund DDQ",
      managerId: "mgr-8",
      managerName: "Distressed Credit Advisors",
      contactName: "Amanda Foster",
      contactTitle: "Senior Investment Analyst",
      status: "requires_clarification",
      completionPercentage: 82,
      submittedDate: "2024-01-16",
      dueDate: "2024-02-07",
      strategy: "Credit",
      investmentType: "sma",
      fundSize: "$1.5B",
      vintage: "2024",
      reviewers: ["Robert Kim"],
      lastActivity: "4 hours ago",
      progress: 82,
      lastUpdated: "2024-01-16T12:30:00Z",
      sections: [],
    },
  ]

  const [filteredDDQs, setFilteredDDQs] = useState(activeDDQs)
  const [showDueSoon, setShowDueSoon] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  // Add completed searches data
  const completedDDQs = [
    {
      id: "completed-1",
      templateName: "Vestira Infrastructure Fund DDQ",
      managerName: "Infrastructure Capital",
      contactName: "Thomas Anderson",
      contactTitle: "Managing Director",
      status: "approved",
      completedDate: "2024-01-15",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.8B",
      vintage: "2023",
    },
    {
      id: "completed-2",
      templateName: "Vestira Private Equity Fund DDQ",
      managerName: "Buyout Partners",
      contactName: "Rachel Green",
      contactTitle: "Portfolio Manager",
      status: "approved",
      completedDate: "2024-01-12",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$1.9B",
      vintage: "2023",
    },
    {
      id: "completed-3",
      templateName: "Vestira Real Estate Fund DDQ",
      managerName: "Property Investments Inc.",
      contactName: "Emily White",
      contactTitle: "Investment Director",
      status: "approved",
      completedDate: "2024-01-10",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.5B",
      vintage: "2023",
    },
    {
      id: "completed-4",
      templateName: "Vestira Credit Fund DDQ",
      managerName: "Debt Strategies Group",
      contactName: "Kevin Lee",
      contactTitle: "Senior Partner",
      status: "approved",
      completedDate: "2024-01-08",
      strategy: "Credit",
      investmentType: "sma",
      fundSize: "$1.2B",
      vintage: "2023",
    },
    {
      id: "completed-5",
      templateName: "Vestira Infrastructure Fund DDQ",
      managerName: "Global Infra Solutions",
      contactName: "Brian Clark",
      contactTitle: "Chief Investment Officer",
      status: "approved",
      completedDate: "2024-01-05",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$3.2B",
      vintage: "2022",
    },
    {
      id: "completed-6",
      templateName: "Vestira Private Equity Fund DDQ",
      managerName: "Venture Capital Corp",
      contactName: "Jessica Hall",
      contactTitle: "Managing Partner",
      status: "approved",
      completedDate: "2024-01-03",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$2.1B",
      vintage: "2022",
    },
    {
      id: "completed-7",
      templateName: "Vestira Real Estate Fund DDQ",
      managerName: "Real Estate Holdings",
      contactName: "Daniel Adams",
      contactTitle: "Investment Committee Chair",
      status: "approved",
      completedDate: "2023-12-30",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.8B",
      vintage: "2022",
    },
    {
      id: "completed-8",
      templateName: "Vestira Credit Fund DDQ",
      managerName: "Credit Opportunities Fund",
      contactName: "Stephanie Baker",
      contactTitle: "Senior Investment Analyst",
      status: "approved",
      completedDate: "2023-12-28",
      strategy: "Credit",
      investmentType: "sma",
      fundSize: "$900M",
      vintage: "2022",
    },
    {
      id: "completed-9",
      templateName: "Vestira Infrastructure Fund DDQ",
      managerName: "Sustainable Infra Partners",
      contactName: "Christopher Hill",
      contactTitle: "Managing Director",
      status: "approved",
      completedDate: "2023-12-25",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.9B",
      vintage: "2021",
    },
    {
      id: "completed-10",
      templateName: "Vestira Private Equity Fund DDQ",
      managerName: "Private Equity Investments",
      contactName: "Michelle Young",
      contactTitle: "Portfolio Manager",
      status: "approved",
      completedDate: "2023-12-22",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$2.4B",
      vintage: "2021",
    },
    {
      id: "completed-11",
      templateName: "Vestira Real Estate Fund DDQ",
      managerName: "Commercial Realty Group",
      contactName: "Jason Wright",
      contactTitle: "Investment Director",
      status: "approved",
      completedDate: "2023-12-20",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.6B",
      vintage: "2021",
    },
    {
      id: "completed-12",
      templateName: "Vestira Credit Fund DDQ",
      managerName: "Alternative Credit Solutions",
      contactName: "Linda Perez",
      contactTitle: "Senior Partner",
      status: "approved",
      completedDate: "2023-12-18",
      strategy: "Credit",
      investmentType: "sma",
      fundSize: "$1.1B",
      vintage: "2021",
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

  // Custom templates
  const [customTemplates, setCustomTemplates] = useState([
    {
      id: "custom-1",
      name: "ESG Assessment Questionnaire",
      description: "Environmental, social, and governance evaluation template",
      category: "ESG",
      questionCount: 65,
      estimatedTime: "2-3 hours",
      lastUpdated: "2024-01-05",
      version: "1.2",
      isVestiraStandard: false,
      usage: "Custom template",
      compliance: "Internal Use",
      questions: []
    },
  ])

  // Enhanced file upload handler for DDQ creation
  const handleDDQFileUpload = (event) => {
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
        if (typeof window !== 'undefined') {
          try {
            const currentQuestions = JSON.parse(localStorage.getItem('current-ddq-questions') || '[]')
            const updatedQuestions = [...currentQuestions, ...mockQuestions]
            localStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
            
            // Also store in sessionStorage for immediate access
            sessionStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
          } catch (error) {
            console.error("Error storing DDQ questions:", error)
          }
        }
        
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
    } else if (template.category === "Private Equity") {
      baseQuestions.push(
        {
          id: `q-${timestamp}-6`,
          section: "Deal Sourcing",
          question: "Describe your deal sourcing strategy and network.",
          type: "long_text",
          required: true,
          template: template.name
        },
        {
          id: `q-${timestamp}-7`,
          section: "Value Creation",
          question: "What is your approach to value creation in portfolio companies?",
          type: "long_text",
          required: true,
          template: template.name
        }
      )
    } else if (template.category === "Real Estate") {
      baseQuestions.push(
        {
          id: `q-${timestamp}-6`,
          section: "Property Types",
          question: "What types of real estate assets do you focus on?",
          type: "long_text",
          required: true,
          template: template.name
        },
        {
          id: `q-${timestamp}-7`,
          section: "Geographic Focus",
          question: "What are your target geographic markets?",
          type: "long_text",
          required: true,
          template: template.name
        }
      )
    }
    
    return baseQuestions
  }

  const handleStartInformalDueDiligence = () => {
    try {
      // Create informal due diligence session
      const informalSession = {
        id: `informal-${Date.now()}`,
        type: "informal",
        createdAt: new Date().toISOString(),
        status: "active",
        questions: [],
        notes: [],
        managers: [],
        allocator: "Current User"
      }
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        try {
          const existingSessions = JSON.parse(localStorage.getItem('informal-dd-sessions') || '[]')
          existingSessions.push(informalSession)
          localStorage.setItem('informal-dd-sessions', JSON.stringify(existingSessions))
          
          // Store current session in sessionStorage
          sessionStorage.setItem('current-informal-session', JSON.stringify(informalSession))
        } catch (error) {
          console.error("Error storing informal DD session:", error)
        }
      }
      
      showNotification("Informal Due Diligence session started")
      
      // Use window.location for more reliable navigation with error handling
      try {
        window.location.href = '/screens/allocator/informal-due-diligence'
      } catch (navigationError) {
        console.error("Navigation error:", navigationError)
        // Fallback: try router.push
        router.push('/screens/allocator/informal-due-diligence')
      }
      
    } catch (error) {
      console.error("Error starting informal due diligence:", error)
      showNotification("Error starting informal due diligence - please try again")
    }
  }

  // Custom template creation functions
  const handleCreateCustomTemplate = () => {
    setShowCreateTemplateModal(true)
  }

  const handleSaveCustomTemplate = () => {
    if (!newTemplate.name.trim() || newTemplate.questions.length === 0) {
      showNotification("Please provide a template name and add at least one question")
      return
    }

    const customTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      questionCount: newTemplate.questions.length,
      estimatedTime: `${Math.ceil(newTemplate.questions.length / 10)}-${Math.ceil(newTemplate.questions.length / 8)} hours`,
      lastUpdated: new Date().toISOString(),
      version: "1.0",
      isVestiraStandard: false,
      usage: "Custom Template",
      compliance: "Custom",
      questions: newTemplate.questions,
      createdBy: "Current User",
      createdAt: new Date().toISOString()
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const existingTemplates = JSON.parse(localStorage.getItem('custom-ddq-templates') || '[]')
        existingTemplates.push(customTemplate)
        localStorage.setItem('custom-ddq-templates', JSON.stringify(existingTemplates))
      } catch (error) {
        console.error("Error saving custom template:", error)
      }
    }

    // Update custom templates state
          setCustomTemplates(prev => [...prev, customTemplate])

    setShowCreateTemplateModal(false)
    setNewTemplate({
      name: "",
      description: "",
      category: "General",
      questions: []
    })
    showNotification("Custom template created successfully")
  }

  const handleAddQuestionToTemplate = (question: any) => {
    setNewTemplate({
      ...newTemplate,
      questions: [...newTemplate.questions, question]
    })
    showNotification("Question added to template")
  }

  const handleRemoveQuestionFromTemplate = (questionId: string) => {
    setNewTemplate({
      ...newTemplate,
      questions: newTemplate.questions.filter(q => q.id !== questionId)
    })
    showNotification("Question removed from template")
  }

  const handleOpenQuestionSelector = () => {
    setIsQuestionSelectorForDDQ(false) // Default for template creation
    setShowQuestionSelector(true)
  }

  const handleOpenQuestionSelectorForDDQ = () => {
    setIsQuestionSelectorForDDQ(true) // For DDQ creation
    setShowQuestionSelector(true)
    // Clear any previous selections when opening for DDQ
    setSelectedQuestionsInSelector([])
  }

  const handleSelectQuestion = (question: any) => {
    // Create a unique ID for the question
    const questionId = `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const questionWithId = {
      ...question,
      id: questionId
    }
    
    // Create a consistent tracking key
    const questionKey = `${question.source}-${question.templateName}-${question.question.substring(0, 50)}`
    
    if (isQuestionSelectorForDDQ) {
      // Add to current DDQ questions
      setCurrentDDQQuestions(prev => {
        const updatedQuestions = [...prev, questionWithId]
        // Store in localStorage and sessionStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
            sessionStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
          } catch (error) {
            console.error("Error storing DDQ questions:", error)
          }
        }
        return updatedQuestions
      })
      showNotification("Question added to DDQ")
    } else {
      // Add to template questions
      handleAddQuestionToTemplate(questionWithId)
    }
    
    // Track selected questions in selector
    setSelectedQuestionsInSelector(prev => [...prev, questionKey])
  }

  // Enhanced question management with filtering and categorization
  const [questionSearchTerm, setQuestionSearchTerm] = useState("")
  const [questionSourceFilter, setQuestionSourceFilter] = useState("all")
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState("all")
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([])
  const [bulkSelectMode, setBulkSelectMode] = useState(false)

  // Get all available questions from both Vestira and custom templates with enhanced filtering
  const getAllAvailableQuestions = () => {
    const vestiraQuestions = vestiraTemplates.flatMap(template => 
      generateTemplateQuestions(template).map(q => ({
        ...q,
        source: 'Vestira Template',
        templateName: template.name,
        category: q.section || 'General'
      }))
    )
    
    const customQuestions = customTemplates.flatMap(template => 
      template.questions.map(q => ({
        ...q,
        source: 'Custom Template',
        templateName: template.name,
        category: q.section || 'General'
      }))
    )

    let allQuestions = [...vestiraQuestions, ...customQuestions]

    // Apply source filter
    if (questionSourceFilter !== "all") {
      allQuestions = allQuestions.filter(q => {
        if (questionSourceFilter === "vestira") return q.source === 'Vestira Template'
        if (questionSourceFilter === "custom") return q.source === 'Custom Template'
        return true
      })
    }

    // Apply category filter
    if (questionCategoryFilter !== "all") {
      allQuestions = allQuestions.filter(q => q.category === questionCategoryFilter)
    }

    // Apply search filter
    if (questionSearchTerm.trim()) {
      const searchLower = questionSearchTerm.toLowerCase()
      allQuestions = allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchLower) ||
        q.templateName.toLowerCase().includes(searchLower) ||
        q.category.toLowerCase().includes(searchLower)
      )
    }

    return allQuestions
  }

  // Get unique categories for filtering
  const getAvailableCategories = () => {
    const allQuestions = vestiraTemplates.flatMap(template => 
      generateTemplateQuestions(template).map(q => ({
        ...q,
        source: 'Vestira Template',
        templateName: template.name,
        category: q.section || 'General'
      }))
    ).concat(customTemplates.flatMap(template => 
      template.questions.map(q => ({
        ...q,
        source: 'Custom Template',
        templateName: template.name,
        category: q.section || 'General'
      }))
    ))

    const categories = [...new Set(allQuestions.map(q => q.category))]
    return categories.sort()
  }

  // Bulk selection functions
  const handleBulkSelectAll = () => {
    const allQuestions = getAllAvailableQuestions()
    const allQuestionKeys = allQuestions.map(q => 
      `${q.source}-${q.templateName}-${q.question.substring(0, 50)}`
    )
    setSelectedQuestionIds(allQuestionKeys)
  }

  const handleBulkDeselectAll = () => {
    setSelectedQuestionIds([])
  }

  const handleBulkAddSelected = () => {
    const allQuestions = getAllAvailableQuestions()
    const selectedQuestions = allQuestions.filter(q => 
      selectedQuestionIds.includes(`${q.source}-${q.templateName}-${q.question.substring(0, 50)}`)
    )

    if (isQuestionSelectorForDDQ) {
      setCurrentDDQQuestions(prev => {
        const updatedQuestions = [...prev, ...selectedQuestions]
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
            sessionStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
          } catch (error) {
            console.error("Error storing DDQ questions:", error)
          }
        }
        return updatedQuestions
      })
      showNotification(`Added ${selectedQuestions.length} questions to DDQ`)
    } else {
      selectedQuestions.forEach(q => handleAddQuestionToTemplate(q))
      showNotification(`Added ${selectedQuestions.length} questions to template`)
    }
    
    setSelectedQuestionIds([])
    setBulkSelectMode(false)
  }

const handleUseTemplate = () => {
    if (!useTemplateForm.ddqName.trim() || useTemplateForm.selectedManagers.length === 0 || !useTemplateForm.dueDate) {
      showNotification("Please fill in all required fields")
      return
    }

    console.log("Creating DDQ:", {
      template: selectedTemplateForUse,
      form: useTemplateForm,
    })

    showNotification(
      `DDQ "${useTemplateForm.ddqName}" created and sent to ${useTemplateForm.selectedManagers.length} manager(s)`,
    )
    setShowUseTemplateModal(false)
    setSelectedTemplateForUse(null)
    setUseTemplateForm({
      ddqName: "",
      selectedManagers: [],
      dueDate: "",
      description: "",
    })
  }

  // Fixed Create DDQ Handler
  const handleCreateDDQClick = () => {
    setShowCreateDDQModal(true)
  }

  const handleCreateDDQSubmit = () => {
    // Validation based on creation method
    if (ddqCreationMethod === "template") {
      if (
        !createDDQForm.ddqName.trim() ||
        !createDDQForm.selectedTemplate ||
        createDDQForm.selectedManagers.length === 0 ||
        !createDDQForm.dueDate
      ) {
        showNotification("Please fill in all required fields")
        return
      }
    } else if (ddqCreationMethod === "upload") {
      if (
        !createDDQForm.ddqName.trim() ||
        !uploadedFile ||
        !parsedDDQData ||
        createDDQForm.selectedManagers.length === 0 ||
        !createDDQForm.dueDate
      ) {
        showNotification("Please fill in all required fields and parse the uploaded file")
        return
      }
    }

    const selectedTemplate = [...vestiraTemplates, ...customTemplates].find(
      (t) => t.id === createDDQForm.selectedTemplate,
    )

    console.log("Creating DDQ:", {
      method: ddqCreationMethod,
      form: createDDQForm,
      template: selectedTemplate,
      uploadedFile: uploadedFile,
      parsedData: parsedDDQData,
    })

    if (ddqCreationMethod === "upload") {
      showNotification(
        `DDQ "${createDDQForm.ddqName}" created from uploaded file with ${parsedDDQData?.estimatedQuestions} questions and sent to ${createDDQForm.selectedManagers.length} manager(s)`,
      )
    } else {
      showNotification(
        `DDQ "${createDDQForm.ddqName}" created and sent to ${createDDQForm.selectedManagers.length} manager(s)`,
      )
    }

    // Reset form and close modal
    setCreateDDQForm({
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
    setDdqCreationMethod("template")
    setUploadedFile(null)
    setParsedDDQData(null)
    setShowParsedPreview(false)
    setIsParsingFile(false)
    setShowCreateDDQModal(false)
  }

  const handleReviewDDQ = (ddqId: string) => {
    const ddq = activeDDQs.find((d) => d.id === ddqId)
    if (ddq) {
      setSelectedDDQForReview(ddq)
      setShowReviewModal(true)
      setViewMode("overview") // Reset to overview when opening
      setCurrentQuestionIndex(0)
      setCurrentSectionIndex(0)
      setActiveSection("firm") // Reset to first section
    } else {
      showNotification(`Opening DDQ review: ${ddq?.contactName} - ${ddq?.templateName}`)
    }
  }

  const handleViewCompletedDDQ = (ddq: any) => {
    setSelectedDDQForReview(ddq)
    setShowReviewModal(true)
    setViewMode("overview") // Reset to overview when opening
    setCurrentQuestionIndex(0)
    setCurrentSectionIndex(0)
    setActiveSection("firm") // Reset to first section
    showNotification(`Opening completed DDQ: ${ddq?.contactName} - ${ddq?.templateName}`)
  }

  const handleUpdateQuestions = (updatedQuestions: any[]) => {
    if (selectedDDQForReview) {
      setSelectedDDQForReview((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }))
      showNotification("Review comments updated successfully")
    }
  }

  const handleMessageManager = (ddq: any) => {
    console.log("Opening message modal for:", ddq.contactName)
    setSelectedDDQ(ddq)
    setShowMessageModal(true)
  }

  const handleScheduleCheckIn = (ddq: any) => {
    console.log("Opening meeting modal for:", ddq.contactName)
    setSelectedDDQ(ddq)
    setShowMeetingModal(true)
  }

  const handleSendMessage = () => {
    if (!messageContent.trim() || !messageTopic.trim() || selectedManagersForMessage.length === 0) {
      showNotification("Please fill in all required fields and select at least one manager")
      return
    }

    const selectedDDQs = activeDDQs.filter(ddq => selectedManagersForMessage.includes(ddq.id))
    const managerNames = selectedDDQs.map(ddq => `${ddq.contactName} at ${ddq.managerName}`).join(", ")

    console.log("Sending message to:", managerNames)
    console.log("Message content:", messageContent)

    showNotification(`Message sent to ${selectedDDQs.length} manager(s): ${managerNames}`)
    setShowMessageModal(false)
    setSelectedDDQ(null)
    setMessageContent("")
    setMessageTopic("")
    setSelectedManagersForMessage([])
  }

  const handleScheduleMeeting = () => {
    if (!meetingDetails.topic.trim() || !meetingDetails.date || !meetingDetails.time || selectedManagersForMeeting.length === 0) {
      showNotification("Please fill in all required fields and select at least one manager")
      return
    }

    const selectedDDQs = activeDDQs.filter(ddq => selectedManagersForMeeting.includes(ddq.id))
    const managerNames = selectedDDQs.map(ddq => `${ddq.contactName} at ${ddq.managerName}`).join(", ")

    showNotification(`Check-in meeting scheduled with ${selectedDDQs.length} manager(s): ${managerNames}`)
    setShowMeetingModal(false)
    setSelectedDDQ(null)
    setMeetingDetails({
      topic: "",
      purpose: "",
      date: "",
      time: "",
      duration: "60",
      type: "video",
    })
    setSelectedManagersForMeeting([])
  }

  const closeMessageModal = () => {
    setShowMessageModal(false)
    setSelectedDDQ(null)
    setMessageContent("")
    setMessageTopic("")
    setSelectedManagersForMessage([])
  }

  const closeMeetingModal = () => {
    setShowMeetingModal(false)
    setSelectedDDQ(null)
    setMeetingDetails({
      topic: "",
      purpose: "",
      date: "",
      time: "",
      duration: "60",
      type: "video",
    })
    setSelectedManagersForMeeting([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "under_review":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Eye className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        )
      case "requires_clarification":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Needs Clarification
          </Badge>
        )
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  // Calculate actual counts
  const dueSoonCount = activeDDQs.filter((ddq) => {
    const dueDate = new Date(ddq.dueDate)
    const today = new Date()
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysDiff <= 7
  }).length

  // Question-by-question navigation functions
  const getAllQuestions = () => {
    if (!selectedDDQForReview?.sections) return []
    return selectedDDQForReview.sections.flatMap((section) => section.questions || [])
  }

  const getCurrentQuestion = () => {
    const allQuestions = getAllQuestions()
    return allQuestions[currentQuestionIndex] || null
  }

  const getTotalQuestions = () => {
    return getAllQuestions().length
  }

  const goToNextQuestion = () => {
    const totalQuestions = getTotalQuestions()
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex)
  }

  // Helper function to get questions for active section
  const getQuestionsForSection = (sectionId: string) => {
    if (!selectedDDQForReview?.sections) return []
    const section = selectedDDQForReview.sections.find((s) => s.id === sectionId)
    return section?.questions || []
  }

  // Helper function to get section question count
  const getSectionQuestionCount = (sectionId: string) => {
    return getQuestionsForSection(sectionId).length
  }

  const handleContinueDDQ = (ddqId: string) => {
    const ddq = activeDDQs.find((d) => d.id === ddqId)
    if (ddq) {
      setSelectedDDQForReview(ddq)
      setShowReviewModal(true)
      setViewMode("overview")
      setCurrentQuestionIndex(0)
      setCurrentSectionIndex(0)
      setActiveSection("firm")
      showNotification(`Continuing DDQ review: ${ddq.templateName}`)
    }
  }

  // DDQ Editing Functions
  const handleEditDDQ = (ddqId: string) => {
    const ddq = activeDDQs.find((d) => d.id === ddqId)
    if (ddq) {
      setEditingDDQ(ddq)
      setEditDDQForm({
        ddqName: ddq.templateName,
        description: ddq.description || "",
        dueDate: ddq.dueDate,
        selectedManagers: [ddq.managerId],
        strategies: [ddq.strategy],
        fundTypes: {
          fund: ddq.investmentType === "fund",
          sma: ddq.investmentType === "sma",
          other: ddq.investmentType === "other",
        },
        fundSize: ddq.fundSize || "",
        visibility: ddq.visibility || "private",
      })
      setShowEditDDQModal(true)
    }
  }

  const handleSaveEditDDQ = () => {
    if (!editDDQForm.ddqName.trim() || editDDQForm.selectedManagers.length === 0 || !editDDQForm.dueDate) {
      showNotification("Please fill in all required fields")
      return
    }

    // Update the DDQ in the activeDDQs array
    const updatedDDQs = activeDDQs.map(ddq => {
      if (ddq.id === editingDDQ.id) {
        return {
          ...ddq,
          templateName: editDDQForm.ddqName,
          description: editDDQForm.description,
          dueDate: editDDQForm.dueDate,
          managerId: editDDQForm.selectedManagers[0],
          managerName: availableManagers.find(m => m.id === editDDQForm.selectedManagers[0])?.name || ddq.managerName,
          strategy: editDDQForm.strategies[0] || ddq.strategy,
          investmentType: editDDQForm.fundTypes.fund ? "fund" : editDDQForm.fundTypes.sma ? "sma" : "other",
          fundSize: editDDQForm.fundSize,
          visibility: editDDQForm.visibility,
          lastUpdated: new Date().toISOString(),
        }
      }
      return ddq
    })

    // Update localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('active-ddqs', JSON.stringify(updatedDDQs))
      } catch (error) {
        console.error("Error updating DDQs in localStorage:", error)
      }
    }
    
    showNotification("DDQ updated successfully")
    setShowEditDDQModal(false)
    setEditingDDQ(null)
    setEditDDQForm({
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
  }

  const handleCancelEditDDQ = () => {
    setShowEditDDQModal(false)
    setEditingDDQ(null)
    setEditDDQForm({
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
  }

  console.log("Allocator Due Diligence Hub rendered with", activeDDQs.length, "DDQs")

  return (
    <Screen>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Enhanced Create DDQ Modal with File Upload Option */}
      {showCreateDDQModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Create New DDQ</h3>
                <p className="text-sm text-gray-600">Set up a new due diligence questionnaire for managers</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDDQModal(false)
                  setCreateDDQForm({
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
                  setDdqCreationMethod("template")
                  setUploadedFile(null)
                  setParsedDDQData(null)
                  setShowParsedPreview(false)
                  setIsParsingFile(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Creation Method Selection */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">How would you like to create your DDQ?</h4>
                  <RadioGroup
                    value={ddqCreationMethod}
                    onValueChange={setDdqCreationMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="template" id="template" />
                      <div className="flex items-center space-x-3">
                        <Template className="h-5 w-5 text-blue-600" />
                        <div>
                          <Label htmlFor="template" className="font-medium cursor-pointer">
                            Use Existing Template
                          </Label>
                          <p className="text-sm text-gray-500">Choose from Vestira standard or custom templates</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="upload" id="upload" />
                      <div className="flex items-center space-x-3">
                        <FileUp className="h-5 w-5 text-green-600" />
                        <div>
                          <Label htmlFor="upload" className="font-medium cursor-pointer">
                            Upload File
                          </Label>
                          <p className="text-sm text-gray-500">Upload a document and let AI create the DDQ</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* File Upload Section (when upload method is selected) */}
              {ddqCreationMethod === "upload" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileUp className="h-5 w-5 text-green-600" />
                      <h4 className="text-lg font-medium text-gray-900">Upload DDQ Document</h4>
                    </div>

                    {!uploadedFile ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h5 className="text-lg font-medium text-gray-900 mb-2">Upload your DDQ document</h5>
                        <p className="text-gray-500 mb-4">
                          Upload a PDF or Word document and our AI will automatically create a DDQ from it
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={handleDDQFileUpload}
                          className="hidden"
                          id="ddq-file-upload"
                        />
                        <Button
                          variant="outline"
                          className="cursor-pointer bg-transparent"
                          onClick={() => {
                            const fileInput = document.getElementById("ddq-file-upload") as HTMLInputElement
                            if (fileInput) {
                              fileInput.click()
                            }
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOCX (Max 10MB)</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                              <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUploadedFile(null)
                              setParsedDDQData(null)
                              setShowParsedPreview(false)
                              setCreateDDQForm({ ...createDDQForm, ddqName: "" })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {!parsedDDQData && !isParsingFile && (
                          <Button onClick={handleParseUploadedFile} className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Parse Document with AI
                          </Button>
                        )}

                        {isParsingFile && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                              <span className="text-sm text-blue-700">
                                Analyzing document and extracting questions...
                              </span>
                            </div>
                          </div>
                        )}

                        {parsedDDQData && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-2">✅ Document Parsed Successfully!</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-green-700">Questions:</span>
                                <span className="ml-1 font-medium">{parsedDDQData.estimatedQuestions}</span>
                              </div>
                              <div>
                                <span className="text-green-700">Sections:</span>
                                <span className="ml-1 font-medium">{parsedDDQData.sections.length}</span>
                              </div>
                              <div>
                                <span className="text-green-700">Strategy:</span>
                                <span className="ml-1 font-medium">{parsedDDQData.detectedStrategy}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Basic Information */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ddqName">DDQ Name *</Label>
                      <Input
                        id="ddqName"
                        placeholder="Enter DDQ name..."
                        value={createDDQForm.ddqName}
                        onChange={(e) => setCreateDDQForm({ ...createDDQForm, ddqName: e.target.value })}
                      />
                    </div>
                    {ddqCreationMethod === "template" && (
                      <div className="space-y-2">
                        <Label htmlFor="template">Template *</Label>
                        <Select
                          value={createDDQForm.selectedTemplate}
                          onValueChange={(value) => setCreateDDQForm({ ...createDDQForm, selectedTemplate: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select template..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Vestira Standard Templates</SelectLabel>
                              {vestiraTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>

                            {customTemplates.length > 0 && (
                              <SelectGroup>
                                <SelectLabel>Custom Templates</SelectLabel>
                                {customTemplates.map((template) => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            )}
                          </SelectContent>
                        </Select>
                        {createDDQForm.selectedTemplate && (
                          <div className="mt-2 space-y-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                if (!createDDQForm.selectedTemplate) {
                                  showNotification('Please select a template first.')
                                  return
                                }
                                
                                const selectedTemplate = [...vestiraTemplates, ...customTemplates].find(t => t.id === createDDQForm.selectedTemplate)
                                
                                if (selectedTemplate) {
                                  // Generate comprehensive questions based on template
                                  const questions = generateTemplateQuestions(selectedTemplate)
                                  
                                  // Update state immediately
                                  setCurrentDDQQuestions(questions)
                                  
                                  // Store in localStorage and sessionStorage
                                  if (typeof window !== 'undefined') {
                                    try {
                                      localStorage.setItem('current-ddq-questions', JSON.stringify(questions))
                                      sessionStorage.setItem('current-ddq-questions', JSON.stringify(questions))
                                    } catch (error) {
                                      console.error("Error storing DDQ questions:", error)
                                    }
                                  }
                                  
                                  // Force a re-render by updating a timestamp
                                  setCreateDDQForm(prev => ({
                                    ...prev,
                                    lastUpdated: Date.now()
                                  }))
                                  
                                  showNotification(`Successfully pulled ${questions.length} questions from ${selectedTemplate.name}`)
                                } else {
                                  showNotification('Template not found. Please select a template first.')
                                }
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Pull Questions from Template
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={handleOpenQuestionSelectorForDDQ}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Pull from Multiple Sources
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Show current DDQ questions if any */}
                  {currentDDQQuestions.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-blue-900">Current DDQ Questions ({currentDDQQuestions.length})</h5>
                        <Badge variant="outline" className="text-blue-700">DDQ in Progress</Badge>
                      </div>
                      <div className="space-y-2">
                        {currentDDQQuestions.slice(0, 3).map((question, index) => (
                          <div key={question.id} className="text-sm text-blue-800">
                            {index + 1}. {question.question.substring(0, 80)}...
                          </div>
                        ))}
                        {currentDDQQuestions.length > 3 && (
                          <div className="text-sm text-blue-600">
                            +{currentDDQQuestions.length - 3} more questions...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter additional instructions or context..."
                      value={createDDQForm.description}
                      onChange={(e) => setCreateDDQForm({ ...createDDQForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Manager Selection */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-medium text-gray-900">Select Managers *</h4>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {availableManagers.map((manager) => (
                      <div key={manager.id} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                        <Checkbox
                          id={manager.id}
                          checked={createDDQForm.selectedManagers.includes(manager.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCreateDDQForm({
                                ...createDDQForm,
                                selectedManagers: [...createDDQForm.selectedManagers, manager.id],
                              })
                            } else {
                              setCreateDDQForm({
                                ...createDDQForm,
                                selectedManagers: createDDQForm.selectedManagers.filter((id) => id !== manager.id),
                              })
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={manager.id} className="text-sm font-medium cursor-pointer">
                            {manager.contact}
                          </Label>
                          <p className="text-xs text-gray-600 font-medium">
                            {manager.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {manager.title} • {manager.location} • {manager.aum} AUM
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {manager.firmType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {createDDQForm.selectedManagers.length} manager(s) selected
                  </p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-medium text-gray-900">Timeline</h4>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={createDDQForm.dueDate}
                      onChange={(e) => setCreateDDQForm({ ...createDDQForm, dueDate: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDDQModal(false)
                  setCreateDDQForm({
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
                  setDdqCreationMethod("template")
                  setUploadedFile(null)
                  setParsedDDQData(null)
                  setShowParsedPreview(false)
                  setIsParsingFile(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateDDQSubmit}>Create DDQ</Button>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {showTemplatePreviewModal && selectedTemplateForPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedTemplateForPreview.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplateForPreview.description}</p>
              </div>
              <Button variant="outline" onClick={() => setShowTemplatePreviewModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedTemplateForPreview.questionCount}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedTemplateForPreview.estimatedTime}</div>
                <div className="text-sm text-gray-600">Est. Time</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{selectedTemplateForPreview.version}</div>
                <div className="text-sm text-gray-600">Version</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{selectedTemplateForPreview.category}</div>
                <div className="text-sm text-gray-600">Category</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Sample Questions</h4>
              <div className="space-y-3">
                {selectedTemplateForPreview.sampleQuestions?.map((question: any, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-900 mb-2">{question.section}</div>
                    <div className="text-sm text-gray-600">{question.question}</div>
                  </div>
                )) || (
                  <>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">Organization & Management</div>
                      <div className="text-sm text-gray-600">
                        Please provide a detailed overview of your organization's structure, key personnel, and governance
                        framework.
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">Investment Strategy</div>
                      <div className="text-sm text-gray-600">
                        Describe your investment strategy, target markets, and approach to portfolio construction.
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">Risk Management</div>
                      <div className="text-sm text-gray-600">
                        Please describe your risk management framework, including identification, assessment, and mitigation
                        processes.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowTemplatePreviewModal(false)}>
                Close
              </Button>
              <Button onClick={() => handleCreateDDQ(selectedTemplateForPreview.id)}>Use This Template</Button>
            </div>
          </div>
        </div>
      )}

      {/* Use Template Modal */}
      {showUseTemplateModal && selectedTemplateForUse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Use Template: {selectedTemplateForUse.name}</h3>
                <p className="text-sm text-gray-600">Configure your DDQ settings</p>
              </div>
              <Button variant="outline" onClick={() => setShowUseTemplateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ddqName">DDQ Name *</Label>
                <Input
                  id="ddqName"
                  placeholder="Enter DDQ name..."
                  value={useTemplateForm.ddqName}
                  onChange={(e) => setUseTemplateForm({ ...useTemplateForm, ddqName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Managers *</Label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {availableManagers.map((manager) => (
                    <div key={manager.id} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                      <Checkbox
                        id={`use-${manager.id}`}
                        checked={useTemplateForm.selectedManagers.includes(manager.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setUseTemplateForm({
                              ...useTemplateForm,
                              selectedManagers: [...useTemplateForm.selectedManagers, manager.id],
                            })
                          } else {
                            setUseTemplateForm({
                              ...useTemplateForm,
                              selectedManagers: useTemplateForm.selectedManagers.filter((id) => id !== manager.id),
                            })
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`use-${manager.id}`} className="text-sm font-medium cursor-pointer">
                          {manager.contact}
                        </Label>
                        <p className="text-xs text-gray-600 font-medium">
                          {manager.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {manager.title} • {manager.location} • {manager.aum} AUM
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {manager.firmType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{useTemplateForm.selectedManagers.length} manager(s) selected</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={useTemplateForm.dueDate}
                  onChange={(e) => setUseTemplateForm({ ...useTemplateForm, dueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Instructions</Label>
                <Textarea
                  id="description"
                  placeholder="Enter any additional instructions or context..."
                  value={useTemplateForm.description}
                  onChange={(e) => setUseTemplateForm({ ...useTemplateForm, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowUseTemplateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUseTemplate}>Create DDQ</Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedDDQForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-7xl mx-4 h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedDDQForReview.templateName}</h3>
                <p className="text-sm text-gray-600">
                  {selectedDDQForReview.contactName} • {selectedDDQForReview.managerName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "overview" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("overview")}
                    className="text-xs"
                  >
                    <Grid className="h-4 w-4 mr-1" />
                    Overview
                  </Button>
                  <Button
                    variant={viewMode === "question-by-question" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("question-by-question")}
                    className="text-xs"
                  >
                    <List className="h-4 w-4 mr-1" />
                    Question by Question
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setShowReviewModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar for Question-by-Question View */}
            {viewMode === "question-by-question" && (
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentQuestionIndex + 1} of {getTotalQuestions()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(((currentQuestionIndex + 1) / getTotalQuestions()) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / getTotalQuestions()) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Modal Content */}
            <div className="flex-1 flex overflow-hidden">
              {viewMode === "overview" ? (
                <>
                  {/* Sidebar for Overview */}
                  <div className="w-80 border-r bg-gray-50 overflow-y-auto">
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-4">Sections</h4>
                      <div className="space-y-2">
                        {ddqSections.map((section) => {
                          const questionCount = getSectionQuestionCount(section.id)
                          return (
                            <button
                              key={section.id}
                              onClick={() => setActiveSection(section.id)}
                              className={`w-full text-left p-3 rounded-lg transition-colors ${
                                activeSection === section.id
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{section.icon}</span>
                                  <span className="font-medium text-sm">{section.name}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {questionCount}
                                </Badge>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Main Content for Overview */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">{ddqSections.find((s) => s.id === activeSection)?.icon}</span>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {ddqSections.find((s) => s.id === activeSection)?.name} Questions
                        </h4>
                        <Badge variant="secondary">
                          {getQuestionsForSection(activeSection).length} questions in this section
                        </Badge>
                      </div>

                      <div className="space-y-6">
                        {getQuestionsForSection(activeSection).map((question, index) => (
                          <Card key={question.id} className="border border-gray-200">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-3 mb-4">
                                <Badge variant="outline" className="text-xs">
                                  Question {index + 1}
                                </Badge>
                                {question.type === "long_text" && (
                                  <Badge variant="secondary" className="text-xs">
                                    long_text
                                  </Badge>
                                )}
                                {question.type === "multiple_choice" && (
                                  <Badge variant="secondary" className="text-xs">
                                    multiple_choice
                                  </Badge>
                                )}
                                {question.type === "yes_no" && (
                                  <Badge variant="secondary" className="text-xs">
                                    yes_no
                                  </Badge>
                                )}
                                {question.type === "short_text" && (
                                  <Badge variant="secondary" className="text-xs">
                                    short_text
                                  </Badge>
                                )}
                                {question.type === "currency" && (
                                  <Badge variant="secondary" className="text-xs">
                                    currency
                                  </Badge>
                                )}
                              </div>

                              <h5 className="font-medium text-gray-900 mb-3">{question.question}</h5>

                              {question.answer && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">
                                      Answer{" "}
                                      {question.answeredAt && `• ${new Date(question.answeredAt).toLocaleDateString()}`}
                                    </span>
                                  </div>
                                  <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-gray-800">{question.answer}</p>
                                  </div>
                                </div>
                              )}

                              {question.answer && (
                                <BranchingQuestionManager
                                  parentQuestion={question}
                                  branches={question.branches || []}
                                  onUpdateBranches={(updatedBranches) => {
                                    // Update the question's branches in the selectedDDQForReview
                                    if (selectedDDQForReview) {
                                      const updatedSections = selectedDDQForReview.sections.map((section) => ({
                                        ...section,
                                        questions: section.questions.map((q) =>
                                          q.id === question.id ? { ...q, branches: updatedBranches } : q,
                                        ),
                                      }))
                                      setSelectedDDQForReview({ ...selectedDDQForReview, sections: updatedSections })
                                    }
                                  }}
                                  userRole="allocator"
                                  currentUser={currentPersonProfile?.name || "Current User"}
                                />
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {getQuestionsForSection(activeSection).length === 0 && (
                          <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h5 className="text-lg font-medium text-gray-900 mb-2">No questions in this section</h5>
                            <p className="text-gray-500">This section doesn't contain any questions yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Question-by-Question View */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Question Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {getCurrentQuestion() ? (
                      <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-6">
                          <Badge variant="outline">Investments</Badge>
                          <Badge variant="secondary">long_text</Badge>
                        </div>

                        <h4 className="text-xl font-semibold text-gray-900 mb-6">{getCurrentQuestion().question}</h4>

                        {getCurrentQuestion().answer && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-700">
                                Answer{" "}
                                {getCurrentQuestion().answeredAt &&
                                  `• ${new Date(getCurrentQuestion().answeredAt).toLocaleDateString()}`}
                              </span>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg">
                              <p className="text-gray-800 leading-relaxed">{getCurrentQuestion().answer}</p>
                            </div>
                          </div>
                        )}

                        {getCurrentQuestion().answer && (
                          <BranchingQuestionManager
                            parentQuestion={getCurrentQuestion()}
                            branches={getCurrentQuestion().branches || []}
                            onUpdateBranches={(updatedBranches) => {
                              // Update the question's branches in the selectedDDQForReview
                              if (selectedDDQForReview) {
                                const updatedSections = selectedDDQForReview.sections.map((section) => ({
                                  ...section,
                                  questions: section.questions.map((q) =>
                                    q.id === getCurrentQuestion().id ? { ...q, branches: updatedBranches } : q,
                                  ),
                                }))
                                setSelectedDDQForReview({ ...selectedDDQForReview, sections: updatedSections })
                              }
                            }}
                            userRole="allocator"
                            currentUser={currentPersonProfile?.name || "Current User"}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h5 className="text-lg font-medium text-gray-900 mb-2">No questions available</h5>
                        <p className="text-gray-500">There are no questions to display.</p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Footer for Question-by-Question */}
                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Question {currentQuestionIndex + 1} of {getTotalQuestions()}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        onClick={goToNextQuestion}
                        disabled={currentQuestionIndex === getTotalQuestions() - 1}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedDDQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Send Message</h3>
                <p className="text-sm text-gray-600">
                  Select managers to send message to
                </p>
              </div>
              <Button variant="outline" onClick={closeMessageModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Manager Selection */}
              <div className="space-y-2">
                <Label>Select Managers *</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-managers-message"
                      checked={selectedManagersForMessage.length === filteredActiveDDQs.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedManagersForMessage(filteredActiveDDQs.map(ddq => ddq.id))
                        } else {
                          setSelectedManagersForMessage([])
                        }
                      }}
                    />
                    <Label htmlFor="select-all-managers-message" className="font-medium">Select All Managers</Label>
                  </div>
                  <div className="border-t pt-2">
                    {filteredActiveDDQs.map((ddq) => (
                      <div key={ddq.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`manager-${ddq.id}-message`}
                          checked={selectedManagersForMessage.includes(ddq.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedManagersForMessage(prev => [...prev, ddq.id])
                            } else {
                              setSelectedManagersForMessage(prev => prev.filter(id => id !== ddq.id))
                            }
                          }}
                        />
                        <Label htmlFor={`manager-${ddq.id}-message`} className="text-sm">
                          {ddq.contactName} at {ddq.managerName} ({ddq.strategy})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageTopic">Subject *</Label>
                <Input
                  id="messageTopic"
                  placeholder="Enter message subject..."
                  value={messageTopic}
                  onChange={(e) => setMessageTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageContent">Message *</Label>
                <Textarea
                  id="messageContent"
                  placeholder="Enter your message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={6}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={closeMessageModal}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={selectedManagersForMessage.length === 0 || !messageTopic.trim() || !messageContent.trim()}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Modal */}
      {showMeetingModal && selectedDDQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Schedule Check-in Meeting</h3>
                <p className="text-sm text-gray-600">
                  Select managers to schedule meeting with
                </p>
              </div>
              <Button variant="outline" onClick={closeMeetingModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Manager Selection */}
              <div className="space-y-2">
                <Label>Select Managers *</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-managers-meeting"
                      checked={selectedManagersForMeeting.length === filteredActiveDDQs.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedManagersForMeeting(filteredActiveDDQs.map(ddq => ddq.id))
                        } else {
                          setSelectedManagersForMeeting([])
                        }
                      }}
                    />
                    <Label htmlFor="select-all-managers-meeting" className="font-medium">Select All Managers</Label>
                  </div>
                  <div className="border-t pt-2">
                    {filteredActiveDDQs.map((ddq) => (
                      <div key={ddq.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`manager-${ddq.id}-meeting`}
                          checked={selectedManagersForMeeting.includes(ddq.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedManagersForMeeting(prev => [...prev, ddq.id])
                            } else {
                              setSelectedManagersForMeeting(prev => prev.filter(id => id !== ddq.id))
                            }
                          }}
                        />
                        <Label htmlFor={`manager-${ddq.id}-meeting`} className="text-sm">
                          {ddq.contactName} at {ddq.managerName} ({ddq.strategy})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingTopic">Meeting Topic *</Label>
                <Input
                  id="meetingTopic"
                  placeholder="Enter meeting topic..."
                  value={meetingDetails.topic}
                  onChange={(e) => setMeetingDetails({ ...meetingDetails, topic: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingPurpose">Purpose</Label>
                <Select
                  value={meetingDetails.purpose}
                  onValueChange={(value) => setMeetingDetails({ ...meetingDetails, purpose: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meeting purpose..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ddq_review">DDQ Review</SelectItem>
                    <SelectItem value="clarification">Clarification</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="general">General Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meetingDate">Date *</Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={meetingDetails.date}
                    onChange={(e) => setMeetingDetails({ ...meetingDetails, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingTime">Time *</Label>
                  <Input
                    id="meetingTime"
                    type="time"
                    value={meetingDetails.time}
                    onChange={(e) => setMeetingDetails({ ...meetingDetails, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meetingDuration">Duration</Label>
                  <Select
                    value={meetingDetails.duration}
                    onValueChange={(value) => setMeetingDetails({ ...meetingDetails, duration: value })}
                  >
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
                <div className="space-y-2">
                  <Label htmlFor="meetingType">Meeting Type</Label>
                  <Select
                    value={meetingDetails.type}
                    onValueChange={(value) => setMeetingDetails({ ...meetingDetails, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in_person">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={closeMeetingModal}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleMeeting}
                disabled={selectedManagersForMeeting.length === 0 || !meetingDetails.topic.trim() || !meetingDetails.date || !meetingDetails.time}
              >
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Due Diligence Hub</h1>
            <p className="text-gray-600">Manage and review due diligence questionnaires</p>
          </div>
          <CustomDropdown
            trigger={
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Launch Due Diligence
              </Button>
            }
            items={[
              {
                label: "Create DDQ",
                onClick: handleCreateDDQClick,
              },
              {
                label: "Start Informal Due Diligence",
                onClick: () => {
                  handleStartInformalDueDiligence()
                },
              },
              {
                label: "Create Custom Template",
                onClick: handleCreateCustomTemplate,
              },
            ]}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active DDQs</TabsTrigger>
            <TabsTrigger value="completed">Completed DDQs</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Active DDQs Tab */}
          <TabsContent value="active" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      placeholder="Search DDQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="requires_clarification">Needs Clarification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Filters */}
            <div className="flex items-center gap-4">
              <Button
                variant={showDueSoon ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDueSoon(!showDueSoon)}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Due Soon ({dueSoonCount})
              </Button>
              <Button
                variant={showCompleted ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                100% Complete
              </Button>
            </div>

            {/* DDQ List */}
            <div className="space-y-4">
              {filteredActiveDDQs.map((ddq) => (
                <Card key={ddq.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                          {getStatusBadge(ddq.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-500">Manager</span>
                            <p className="font-medium text-gray-900">{ddq.managerName}</p>
                            <p className="text-sm text-gray-600">
                              {ddq.contactName} • {ddq.contactTitle}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Strategy</span>
                            <p className="font-medium text-gray-900">{ddq.strategy}</p>
                            <p className="text-sm text-gray-600">
                              {ddq.investmentType} • {ddq.fundSize}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Progress</span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${ddq.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{ddq.progress}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Due Date</span>
                            <p className="font-medium text-gray-900">{new Date(ddq.dueDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">Last activity: {ddq.lastActivity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Reviewers:</span>
                            <div className="flex items-center gap-1">
                              {ddq.reviewers.map((reviewer, index) => (
                                <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                  {reviewer}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleReviewDDQ(ddq.id)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <CustomDropdown
                          trigger={
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          }
                          items={[
                            {
                              label: "Edit DDQ",
                              onClick: () => handleEditDDQ(ddq.id),
                            },
                            {
                              label: "Send Message",
                              onClick: () => handleMessageManager(ddq),
                            },
                            {
                              label: "Schedule Check-in",
                              onClick: () => handleScheduleCheckIn(ddq),
                            },
                            {
                              label: "Export DDQ",
                              onClick: () => handleExportDDQ(ddq),
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed DDQs Tab */}
          <TabsContent value="completed" className="space-y-6">
            <div className="grid gap-4">
              {completedDDQs.map((ddq) => (
                <Card key={ddq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                          {getStatusBadge(ddq.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">Manager:</span>
                            <br />
                            {ddq.managerName}
                          </div>
                          <div>
                            <span className="font-medium">Contact:</span>
                            <br />
                            {ddq.contactName}
                          </div>
                          <div>
                            <span className="font-medium">Strategy:</span>
                            <br />
                            {ddq.strategy}
                          </div>
                          <div>
                            <span className="font-medium">Completed:</span>
                            <br />
                            {new Date(ddq.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{ddq.investmentType.toUpperCase()}</Badge>
                        <Badge variant="outline">{ddq.fundSize}</Badge>
                        <Badge variant="outline">{ddq.vintage}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewCompletedDDQ(ddq)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Vestira Standard Templates */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Vestira Standard Templates</h3>
                <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
              </div>
              <div className="grid gap-4">
                {vestiraTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                            <Badge className="bg-blue-100 text-blue-800">v{template.version}</Badge>
                            <Badge className="bg-green-100 text-green-800">{template.compliance}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{template.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Questions:</span> {template.questionCount}
                            </div>
                            <div>
                              <span className="font-medium">Est. Time:</span> {template.estimatedTime}
                            </div>
                            <div>
                              <span className="font-medium">Category:</span> {template.category}
                            </div>
                            <div>
                              <span className="font-medium">Usage:</span> {template.usage}
                            </div>
                          </div>
                        </div>
                      </div>
                                              <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            Last updated: {new Date(template.lastUpdated).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template.id)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleAddAllQuestions(template.id)}>
                              <FileText className="h-4 w-4 mr-1" />
                              Add to Custom DDQ
                            </Button>
                            <Button size="sm" onClick={() => handleCreateDDQ(template.id)}>
                              Use Template
                            </Button>
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Templates */}
            {customTemplates.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Templates</h3>
                <div className="grid gap-4">
                  {customTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                              <Badge variant="outline">v{template.version}</Badge>
                              <Badge variant="outline">{template.compliance}</Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{template.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Questions:</span> {template.questionCount}
                              </div>
                              <div>
                                <span className="font-medium">Est. Time:</span> {template.estimatedTime}
                              </div>
                              <div>
                                <span className="font-medium">Category:</span> {template.category}
                              </div>
                              <div>
                                <span className="font-medium">Usage:</span> {template.usage}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            Last updated: {new Date(template.lastUpdated).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template.id)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleAddAllQuestions(template.id)}>
                              <FileText className="h-4 w-4 mr-1" />
                              Add to Custom DDQ
                            </Button>
                            <Button size="sm" onClick={() => handleCreateDDQ(template.id)}>
                              Use Template
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Custom Template Creation Modal */}
      {showCreateTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-5xl mx-auto max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Create Custom Template</h3>
                <p className="text-sm text-gray-600 mt-1">Build your own DDQ template for future use</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowCreateTemplateModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-8">
              {/* Template Details */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Template Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="template-name">Template Name *</Label>
                      <Input
                        id="template-name"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        placeholder="Enter template name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="template-category">Category</Label>
                      <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="Private Equity">Private Equity</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Credit">Credit</SelectItem>
                          <SelectItem value="Hedge Fund">Hedge Fund</SelectItem>
                          <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="template-description">Description</Label>
                    <Textarea
                      id="template-description"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                      placeholder="Describe your template"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Questions Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Questions ({newTemplate.questions.length})</h4>
                      <p className="text-sm text-gray-500 mt-1">Add questions from existing templates or create your own</p>
                    </div>
                    <Button onClick={handleOpenQuestionSelector} variant="outline" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Questions
                    </Button>
                  </div>

                  {newTemplate.questions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No questions added yet</p>
                      <p className="text-sm">Click "Add Questions" to get started with your template</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {newTemplate.questions.map((question, index) => (
                        <div key={question.id} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline" className="font-medium">Question {index + 1}</Badge>
                              <Badge variant="secondary">{question.type}</Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-900 leading-relaxed">{question.question}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveQuestionFromTemplate(question.id)}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowCreateTemplateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCustomTemplate} disabled={!newTemplate.name.trim() || newTemplate.questions.length === 0}>
                  Create Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Selector Modal */}
      {showQuestionSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-6xl mx-auto max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isQuestionSelectorForDDQ ? "Select Questions for DDQ" : "Select Questions for Template"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isQuestionSelectorForDDQ 
                    ? "Choose questions from Vestira templates or your custom templates for your DDQ" 
                    : "Choose questions from Vestira templates or your custom templates for your template"
                  }
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuestionSelector(false)
                  setIsQuestionSelectorForDDQ(false)
                  setSelectedQuestionsInSelector([])
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
                {/* Current Questions Summary */}
                {isQuestionSelectorForDDQ && currentDDQQuestions.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Current DDQ Questions ({currentDDQQuestions.length})</h4>
                        <Badge variant="outline">DDQ in Progress</Badge>
                      </div>
                      <div className="space-y-2">
                        {currentDDQQuestions.slice(0, 3).map((question, index) => (
                          <div key={question.id} className="text-sm text-gray-600">
                            {index + 1}. {question.question.substring(0, 80)}...
                          </div>
                        ))}
                        {currentDDQQuestions.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{currentDDQQuestions.length - 3} more questions...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Search and Filters */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Search Bar */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Search questions by text, template, or category..."
                            value={questionSearchTerm}
                            onChange={(e) => setQuestionSearchTerm(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Button
                          variant={bulkSelectMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBulkSelectMode(!bulkSelectMode)}
                        >
                          {bulkSelectMode ? "Exit Bulk Mode" : "Bulk Select"}
                        </Button>
                      </div>

                      {/* Filters Row */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium">Source:</Label>
                          <Select value={questionSourceFilter} onValueChange={setQuestionSourceFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Sources</SelectItem>
                              <SelectItem value="vestira">Vestira Templates</SelectItem>
                              <SelectItem value="custom">Custom Templates</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium">Category:</Label>
                          <Select value={questionCategoryFilter} onValueChange={setQuestionCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {getAvailableCategories().map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-sm text-gray-600">
                            {getAllAvailableQuestions().length} questions found
                          </span>
                        </div>
                      </div>

                      {/* Bulk Selection Controls */}
                      {bulkSelectMode && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={handleBulkSelectAll}>
                              Select All
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleBulkDeselectAll}>
                              Deselect All
                            </Button>
                            <span className="text-sm text-gray-600">
                              {selectedQuestionIds.length} selected
                            </span>
                          </div>
                          <div className="ml-auto">
                            <Button size="sm" onClick={handleBulkAddSelected} disabled={selectedQuestionIds.length === 0}>
                              Add Selected ({selectedQuestionIds.length})
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

              {/* Enhanced Questions List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {getAllAvailableQuestions().map((question, index) => {
                  const questionKey = `${question.source}-${question.templateName}-${question.question.substring(0, 50)}`
                  const isSelected = bulkSelectMode 
                    ? selectedQuestionIds.includes(questionKey)
                    : selectedQuestionsInSelector.includes(questionKey)
                  
                  return (
                    <Card key={`${question.id}-${index}`} className={`hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            id={`question-${index}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (bulkSelectMode) {
                                // Bulk selection mode
                                if (checked) {
                                  setSelectedQuestionIds(prev => [...prev, questionKey])
                                } else {
                                  setSelectedQuestionIds(prev => prev.filter(key => key !== questionKey))
                                }
                              } else {
                                // Individual selection mode
                                if (checked) {
                                  handleSelectQuestion(question)
                                } else {
                                  // Remove question when unchecked
                                  setSelectedQuestionsInSelector(prev => prev.filter(key => key !== questionKey))
                                  
                                  if (isQuestionSelectorForDDQ) {
                                    setCurrentDDQQuestions(prev => {
                                      // Remove by matching the original question text and source
                                      const updatedQuestions = prev.filter(q => 
                                        !(q.question === question.question && 
                                          q.source === question.source && 
                                          q.templateName === question.templateName)
                                      )
                                      if (typeof window !== 'undefined') {
                                        try {
                                          localStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
                                          sessionStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
                                        } catch (error) {
                                          console.error("Error storing DDQ questions:", error)
                                        }
                                      }
                                      return updatedQuestions
                                    })
                                    showNotification("Question removed from DDQ")
                                  } else {
                                    setNewTemplate(prev => ({
                                      ...prev,
                                      questions: prev.questions.filter(q => 
                                        !(q.question === question.question && 
                                          q.source === question.source && 
                                          q.templateName === question.templateName)
                                      )
                                    }))
                                    showNotification("Question removed from template")
                                  }
                                }
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline" className="text-xs">{question.source}</Badge>
                              <Badge variant="secondary" className="text-xs">{question.type}</Badge>
                              <Badge variant="outline" className="text-xs">{question.category}</Badge>
                              <span className="text-xs text-gray-500">from {question.templateName}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 leading-relaxed mb-2">{question.question}</p>
                            
                            {/* Question Preview */}
                            {question.question.length > 150 && (
                              <div className="text-xs text-gray-500">
                                {question.question.substring(0, 150)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                
                {getAllAvailableQuestions().length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">No questions found</p>
                        <p className="text-sm">Try adjusting your search terms or filters</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t">
                <Button variant="outline" onClick={() => {
                  setShowQuestionSelector(false)
                  setIsQuestionSelectorForDDQ(false)
                  setSelectedQuestionsInSelector([])
                  showNotification(isQuestionSelectorForDDQ 
                    ? `Added ${currentDDQQuestions.length} questions to DDQ` 
                    : `Added ${newTemplate.questions.length} questions to template`
                  )
                }}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit DDQ Modal */}
      {showEditDDQModal && editingDDQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit DDQ</h2>
              <Button variant="outline" size="sm" onClick={handleCancelEditDDQ}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* DDQ Name */}
              <div>
                <Label htmlFor="ddqName">DDQ Name</Label>
                <Input
                  id="ddqName"
                  value={editDDQForm.ddqName}
                  onChange={(e) => setEditDDQForm({ ...editDDQForm, ddqName: e.target.value })}
                  placeholder="Enter DDQ name"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editDDQForm.description}
                  onChange={(e) => setEditDDQForm({ ...editDDQForm, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              {/* Due Date */}
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editDDQForm.dueDate}
                  onChange={(e) => setEditDDQForm({ ...editDDQForm, dueDate: e.target.value })}
                />
              </div>

              {/* Manager Selection */}
              <div>
                <Label>Manager</Label>
                <Select
                  value={editDDQForm.selectedManagers[0] || ""}
                  onValueChange={(value) => setEditDDQForm({ ...editDDQForm, selectedManagers: [value] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Strategy */}
              <div>
                <Label>Strategy</Label>
                <Select
                  value={editDDQForm.strategies[0] || ""}
                  onValueChange={(value) => setEditDDQForm({ ...editDDQForm, strategies: [value] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private Equity">Private Equity</SelectItem>
                    <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Hedge Fund">Hedge Fund</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fund Types */}
              <div>
                <Label>Investment Type</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fund"
                      checked={editDDQForm.fundTypes.fund}
                      onCheckedChange={(checked) =>
                        setEditDDQForm({
                          ...editDDQForm,
                          fundTypes: { ...editDDQForm.fundTypes, fund: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="fund">Fund</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sma"
                      checked={editDDQForm.fundTypes.sma}
                      onCheckedChange={(checked) =>
                        setEditDDQForm({
                          ...editDDQForm,
                          fundTypes: { ...editDDQForm.fundTypes, sma: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="sma">SMA</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="other"
                      checked={editDDQForm.fundTypes.other}
                      onCheckedChange={(checked) =>
                        setEditDDQForm({
                          ...editDDQForm,
                          fundTypes: { ...editDDQForm.fundTypes, other: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </div>
              </div>

              {/* Fund Size */}
              <div>
                <Label htmlFor="fundSize">Fund Size</Label>
                <Input
                  id="fundSize"
                  value={editDDQForm.fundSize}
                  onChange={(e) => setEditDDQForm({ ...editDDQForm, fundSize: e.target.value })}
                  placeholder="e.g., $100M - $500M"
                />
              </div>

              {/* Visibility */}
              <div>
                <Label>Visibility</Label>
                <Select
                  value={editDDQForm.visibility}
                  onValueChange={(value) => setEditDDQForm({ ...editDDQForm, visibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleCancelEditDDQ}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditDDQ}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
  } catch (err) {
    console.error('Error in Due Diligence Hub:', err)
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace')
    console.error('Error details:', {
      name: err instanceof Error ? err.name : 'Unknown',
      message: err instanceof Error ? err.message : String(err),
      type: typeof err
    })
    setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    return null
  }
}
