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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { FileText, CheckCircle, AlertTriangle, Eye, Clock, X, MessageSquare, Plus } from "lucide-react"
import { useApp } from "../../../../context/AppContext"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "../../../../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import { Upload, Calendar, Users, FileUp, LayoutTemplateIcon as Template } from "lucide-react"

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

export default function ConsultantDueDiligenceHubPage() {
  const { userRole, currentPersonProfile } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStrategy, setSelectedStrategy] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [notification, setNotification] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  // Enhanced DDQ Creation Modal States
  const [showCreateDDQModal, setShowCreateDDQModal] = useState(false)
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
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [messageContent, setMessageContent] = useState("")
  const [messageTopic, setMessageTopic] = useState("")

  // Check for tab parameter on mount
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "active") {
      setActiveTab("active")
    }
  }, [searchParams])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  // Active DDQs - Consultant managing for clients
  const activeDDQs = [
    {
      id: "active-1",
      templateName: "Vestira Infrastructure Fund DDQ",
      clientId: "client-1",
      clientName: "Metropolitan Pension Fund",
      contactName: "Sarah Johnson",
      contactTitle: "Chief Investment Officer",
      managerName: "Global Infrastructure Partners",
      managerContact: "Michael Chen",
      status: "under_review",
      completionPercentage: 85,
      submittedDate: "2024-01-20",
      dueDate: "2024-02-15",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.5B",
      vintage: "2024",
      lastActivity: "2 hours ago",
      progress: 85,
      lastUpdated: "2024-01-20T14:30:00Z",
      priority: "high",
      role: "advisor", // consultant's role in this DDQ
    },
    {
      id: "active-2",
      templateName: "Vestira Private Equity Fund DDQ",
      clientId: "client-2",
      clientName: "University Endowment Fund",
      contactName: "Jennifer Park",
      contactTitle: "Investment Director",
      managerName: "Apex Capital Management",
      managerContact: "Robert Kim",
      status: "in_progress",
      completionPercentage: 60,
      submittedDate: null,
      dueDate: "2024-02-10",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$1.8B",
      vintage: "2024",
      lastActivity: "1 day ago",
      progress: 60,
      lastUpdated: "2024-01-18T16:45:00Z",
      priority: "medium",
      role: "lead_advisor",
    },
    {
      id: "active-3",
      templateName: "Vestira Real Estate Fund DDQ",
      clientId: "client-3",
      clientName: "Corporate Retirement Plan",
      contactName: "David Thompson",
      contactTitle: "Plan Administrator",
      managerName: "Metropolitan Real Estate",
      managerContact: "Lisa Wang",
      status: "requires_clarification",
      completionPercentage: 75,
      submittedDate: "2024-01-22",
      dueDate: "2024-02-08",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.2B",
      vintage: "2024",
      lastActivity: "3 hours ago",
      progress: 75,
      lastUpdated: "2024-01-22T11:15:00Z",
      priority: "high",
      role: "reviewer",
    },
    {
      id: "active-4",
      templateName: "Vestira Credit Fund DDQ",
      clientId: "client-4",
      clientName: "Family Office Investment Group",
      contactName: "Amanda Foster",
      contactTitle: "Investment Committee Chair",
      managerName: "Structured Credit Partners",
      managerContact: "Carlos Martinez",
      status: "draft",
      completionPercentage: 25,
      submittedDate: null,
      dueDate: "2024-02-12",
      strategy: "Credit",
      investmentType: "sma",
      fundSize: "$800M",
      vintage: "2024",
      lastActivity: "5 hours ago",
      progress: 25,
      lastUpdated: "2024-01-19T13:20:00Z",
      priority: "low",
      role: "advisor",
    },
  ]

  // Completed DDQs
  const completedDDQs = [
    {
      id: "completed-1",
      templateName: "Vestira Infrastructure Fund DDQ",
      clientName: "State Pension Fund",
      contactName: "Thomas Anderson",
      contactTitle: "Senior Investment Officer",
      managerName: "Infrastructure Capital",
      status: "approved",
      completedDate: "2024-01-15",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.8B",
      vintage: "2023",
      role: "lead_advisor",
    },
    {
      id: "completed-2",
      templateName: "Vestira Private Equity Fund DDQ",
      clientName: "Healthcare System Retirement Plan",
      contactName: "Rachel Green",
      contactTitle: "Investment Director",
      managerName: "Buyout Partners",
      status: "approved",
      completedDate: "2024-01-12",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$1.9B",
      vintage: "2023",
      role: "advisor",
    },
    {
      id: "completed-3",
      templateName: "Vestira Real Estate Fund DDQ",
      clientName: "Municipal Employees' Fund",
      contactName: "Emily White",
      contactTitle: "Portfolio Manager",
      managerName: "Property Investments Inc.",
      status: "approved",
      completedDate: "2024-01-10",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.5B",
      vintage: "2023",
      role: "reviewer",
    },
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

  // Vestira Standard Templates
  const vestiraTemplates = [
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
      description: "Standard due diligence questionnaire for private equity investments",
      category: "Private Equity",
      questionCount: 98,
      estimatedTime: "3-5 hours",
      lastUpdated: "2024-01-10",
      version: "2.8",
      isVestiraStandard: true,
      usage: "Completed by 92% of Managers",
      compliance: "SOC 2 Compliant",
    },
    {
      id: "vestira-3",
      name: "Vestira Real Estate Fund DDQ",
      description: "Specialized questionnaire for real estate investment due diligence",
      category: "Real Estate",
      questionCount: 85,
      estimatedTime: "3-4 hours",
      lastUpdated: "2024-01-08",
      version: "2.1",
      isVestiraStandard: true,
      usage: "Completed by 76% of Managers",
      compliance: "SOC 2 Compliant",
    },
    {
      id: "vestira-4",
      name: "Vestira Credit Fund DDQ",
      description: "Comprehensive due diligence for credit and fixed income strategies",
      category: "Credit",
      questionCount: 112,
      estimatedTime: "4-5 hours",
      lastUpdated: "2024-01-12",
      version: "1.9",
      isVestiraStandard: true,
      usage: "Completed by 68% of Managers",
      compliance: "SOC 2 Compliant",
    },
  ]

  // Custom templates (initially empty, will be populated from localStorage)
  const customTemplates: any[] = []

  const handleReviewDDQ = (ddqId: string) => {
    const ddq = activeDDQs.find((d) => d.id === ddqId)
    if (ddq) {
      // Navigate to the DDQ review page
      router.push(`/screens/consultant/due-diligence-hub/review/${ddqId}`)
      showNotification(`Opening DDQ review: ${ddq.templateName} for ${ddq.clientName}`)
    }
  }

  const handleMessageClient = (ddq: any) => {
    console.log("Opening message modal for:", ddq.contactName)
    setSelectedClient(ddq)
    setShowMessageModal(true)
  }

  const handleSendMessage = () => {
    if (!messageContent.trim() || !messageTopic.trim()) {
      showNotification("Please fill in all required fields")
      return
    }

    console.log("Sending message to:", selectedClient?.contactName)
    console.log("Message content:", messageContent)

    showNotification(`Message sent to ${selectedClient?.contactName} at ${selectedClient?.clientName}`)
    setShowMessageModal(false)
    setSelectedClient(null)
    setMessageContent("")
    setMessageTopic("")
  }

  const closeMessageModal = () => {
    setShowMessageModal(false)
    setSelectedClient(null)
    setMessageContent("")
    setMessageTopic("")
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
          <Badge className="bg-[#00B2FF]/10 text-[#00B2FF]">
            <Eye className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "requires_clarification":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Needs Clarification
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        )
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "lead_advisor":
        return <Badge className="bg-purple-100 text-purple-800">Lead Advisor</Badge>
      case "advisor":
        return <Badge className="bg-[#00B2FF]/10 text-[#00B2FF]">Advisor</Badge>
      case "reviewer":
        return <Badge className="bg-green-100 text-green-800">Reviewer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>
      default:
        return null
    }
  }

  // Calculate actual counts
  const dueSoonCount = activeDDQs.filter((ddq) => {
    const dueDate = new Date(ddq.dueDate)
    const today = new Date()
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysDiff <= 7
  }).length

  const clarificationCount = activeDDQs.filter((ddq) => ddq.status === "requires_clarification").length

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

    // Simulate AI parsing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock parsed DDQ data
    const mockParsedData = {
      suggestedName: uploadedFile.name.replace(/\.[^/.]+$/, "") + " DDQ",
      detectedStrategy: "Infrastructure",
      estimatedQuestions: 89,
      sections: [
        {
          id: "organization",
          name: "Organization & Management",
          questions: [
            {
              id: "q1",
              question:
                "Please provide a detailed overview of your organization's structure and key personnel, ownership structure, and governance framework.",
              type: "long_text",
            },
            {
              id: "q2",
              question: "What is your firm's Assets Under Management (AUM)?",
              type: "currency",
            },
          ],
        },
      ],
    }

    setParsedDDQData(mockParsedData)
    setCreateDDQForm({
      ...createDDQForm,
      ddqName: mockParsedData.suggestedName,
    })
    setIsParsingFile(false)
    setShowParsedPreview(true)
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

    if (ddqCreationMethod === "upload") {
      showNotification(
        `DDQ "${createDDQForm.ddqName}" created from uploaded file with ${parsedDDQData?.estimatedQuestions} questions and sent to ${createDDQForm.selectedManagers.length} client(s)`,
      )
    } else {
      showNotification(
        `DDQ "${createDDQForm.ddqName}" created and sent to ${createDDQForm.selectedManagers.length} client(s)`,
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

  const handleContinueDDQ = (ddqId: string) => {
    const ddq = activeDDQs.find((d) => d.id === ddqId)
    if (ddq) {
      // Navigate to the DDQ review page
      router.push(`/screens/consultant/due-diligence-hub/review/${ddqId}`)
      showNotification(`Continuing DDQ review: ${ddq.templateName} for ${ddq.clientName}`)
    }
  }

  // Template functions
  const generateTemplateQuestions = (template: any) => {
    const baseQuestions = [
      {
        id: `q-${Date.now()}-1`,
        section: "Organization & Management",
        question: "Describe your firm's organizational structure and key personnel.",
        type: "long_text",
        required: true,
        template: template.name
      },
      {
        id: `q-${Date.now()}-2`,
        section: "Investment Strategy",
        question: "What is your investment philosophy and approach?",
        type: "long_text",
        required: true,
        template: template.name
      },
      {
        id: `q-${Date.now()}-3`,
        section: "Risk Management",
        question: "How do you identify and manage investment risks?",
        type: "long_text",
        required: true,
        template: template.name
      }
    ]
    
    return baseQuestions
  }

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
    const existingTemplates = JSON.parse(localStorage.getItem('custom-ddq-templates') || '[]')
    existingTemplates.push(customTemplate)
    localStorage.setItem('custom-ddq-templates', JSON.stringify(existingTemplates))

    // Update custom templates state
    customTemplates.push(customTemplate)

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
    setIsQuestionSelectorForDDQ(false) // Ensure it's for template creation, not DDQ
    setShowQuestionSelector(true)
  }

  const handleSelectQuestion = (question: any) => {
    const questionWithId = {
      ...question,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    if (isQuestionSelectorForDDQ) {
      // Add to current DDQ questions
      setCurrentDDQQuestions(prev => {
        const updatedQuestions = [...prev, questionWithId]
        // Store in localStorage and sessionStorage
        localStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
        sessionStorage.setItem('current-ddq-questions', JSON.stringify(updatedQuestions))
        return updatedQuestions
      })
    } else {
      // Add to template questions
      handleAddQuestionToTemplate(questionWithId)
    }
    
    // Track selected questions in selector using a unique identifier
    const questionKey = `${question.source}-${question.templateName}-${question.question.substring(0, 50)}`
    setSelectedQuestionsInSelector(prev => [...prev, questionKey])
  }

  // Get all available questions from both Vestira and custom templates
  const getAllAvailableQuestions = () => {
    const vestiraQuestions = vestiraTemplates.flatMap(template => 
      generateTemplateQuestions(template).map(q => ({
        ...q,
        source: 'Vestira Template',
        templateName: template.name
      }))
    )
    
    const customQuestions = customTemplates.flatMap(template => 
      template.questions.map(q => ({
        ...q,
        source: 'Custom Template',
        templateName: template.name
      }))
    )

    return [...vestiraQuestions, ...customQuestions]
  }

  console.log("Consultant Due Diligence Hub rendered with", activeDDQs.length, "active DDQs")

  return (
    <Screen>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Message</h3>
              <Button variant="outline" onClick={closeMessageModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Send a message to{" "}
                <span className="font-medium">
                  {selectedClient.contactName} • {selectedClient.contactTitle}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageTopic">Topic</Label>
                <Input
                  id="messageTopic"
                  placeholder="Enter message topic..."
                  value={messageTopic}
                  onChange={(e) => setMessageTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageContent">Message</Label>
                <Textarea
                  id="messageContent"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={closeMessageModal}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Create DDQ Modal with File Upload Option */}
      {showCreateDDQModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Create New DDQ</h3>
                <p className="text-sm text-gray-600">Set up a new due diligence questionnaire for your clients</p>
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
                        <Template className="h-5 w-5 text-[#00B2FF]" />
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
                          onClick={() => document.getElementById("ddq-file-upload")?.click()}
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
                            <FileText className="h-8 w-8 text-[#00B2FF]" />
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
                          <Button onClick={handleParseUploadedFile} className="w-full bg-[#00B2FF] hover:bg-[#0099E6]">
                            <FileText className="h-4 w-4 mr-2" />
                            Parse Document with AI
                          </Button>
                        )}

                        {isParsingFile && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00B2FF]"></div>
                              <span className="text-sm text-[#00B2FF]">
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
                            <SelectItem value="infrastructure">Vestira Infrastructure Fund DDQ</SelectItem>
                            <SelectItem value="private-equity">Vestira Private Equity Fund DDQ</SelectItem>
                            <SelectItem value="real-estate">Vestira Real Estate Fund DDQ</SelectItem>
                            <SelectItem value="credit">Vestira Credit Fund DDQ</SelectItem>
                            <SelectItem value="hedge-fund">Vestira Hedge Fund DDQ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
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

              {/* Client Selection */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-[#00B2FF]" />
                    <h4 className="text-lg font-medium text-gray-900">Select Clients *</h4>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {[
                      {
                        id: "client-1",
                        name: "Metropolitan Pension Fund",
                        contact: "Sarah Johnson",
                        title: "Chief Investment Officer",
                      },
                      {
                        id: "client-2",
                        name: "University Endowment Fund",
                        contact: "Jennifer Park",
                        title: "Investment Director",
                      },
                      {
                        id: "client-3",
                        name: "Corporate Retirement Plan",
                        contact: "David Thompson",
                        title: "Plan Administrator",
                      },
                      {
                        id: "client-4",
                        name: "Family Office Investment Group",
                        contact: "Amanda Foster",
                        title: "Investment Committee Chair",
                      },
                      {
                        id: "client-5",
                        name: "State Pension Fund",
                        contact: "Thomas Anderson",
                        title: "Senior Investment Officer",
                      },
                    ].map((client) => (
                      <div key={client.id} className="flex items-center space-x-3 py-2">
                        <Checkbox
                          id={client.id}
                          checked={createDDQForm.selectedManagers.includes(client.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCreateDDQForm({
                                ...createDDQForm,
                                selectedManagers: [...createDDQForm.selectedManagers, client.id],
                              })
                            } else {
                              setCreateDDQForm({
                                ...createDDQForm,
                                selectedManagers: createDDQForm.selectedManagers.filter((id) => id !== client.id),
                              })
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={client.id} className="text-sm font-medium cursor-pointer">
                            {client.name}
                          </Label>
                          <p className="text-xs text-gray-500">
                            {client.contact} • {client.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {createDDQForm.selectedManagers.length} client(s) selected
                  </p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-[#00B2FF]" />
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
              <Button onClick={handleCreateDDQSubmit} className="bg-[#00B2FF] hover:bg-[#0099E6]">
                Create DDQ
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
            <p className="text-gray-600">Manage due diligence processes for your clients</p>
          </div>
          <CustomDropdown
            trigger={
              <Button className="bg-[#00B2FF] hover:bg-[#0099E6]">
                <Plus className="h-4 w-4 mr-2" />
                Launch Due Diligence
              </Button>
            }
            items={[
              {
                label: "Create DDQ",
                onClick: () => setShowCreateDDQModal(true),
              },
              {
                label: "Create Custom Template",
                onClick: handleCreateCustomTemplate,
              },
            ]}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Active DDQs ({activeDDQs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completedDDQs.length})
            </TabsTrigger>
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
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
                variant={activeFilter === "due-soon" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(activeFilter === "due-soon" ? null : "due-soon")}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Due Soon ({dueSoonCount})
              </Button>
              <Button
                variant={activeFilter === "clarification" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(activeFilter === "clarification" ? null : "clarification")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Needs Clarification ({clarificationCount})
              </Button>
            </div>

            {/* DDQ List */}
            <div className="space-y-4">
              {activeDDQs
                .filter((ddq) => {
                  // Apply search filter
                  if (
                    searchQuery &&
                    !ddq.templateName.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !ddq.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !ddq.managerName.toLowerCase().includes(searchQuery.toLowerCase())
                  ) {
                    return false
                  }

                  // Apply strategy filter
                  if (selectedStrategy !== "All" && ddq.strategy !== selectedStrategy) {
                    return false
                  }

                  // Apply status filter
                  if (selectedStatus !== "All" && ddq.status !== selectedStatus) {
                    return false
                  }

                  // Apply quick filters
                  if (activeFilter === "due-soon") {
                    const dueDate = new Date(ddq.dueDate)
                    const today = new Date()
                    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
                    return daysDiff <= 7
                  }

                  if (activeFilter === "clarification") {
                    return ddq.status === "requires_clarification"
                  }

                  return true
                })
                .map((ddq) => (
                  <Card key={ddq.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                            {getStatusBadge(ddq.status)}
                            {getRoleBadge(ddq.role)}
                            {getPriorityBadge(ddq.priority)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-gray-500">Client</span>
                              <p className="font-medium text-gray-900">{ddq.clientName}</p>
                              <p className="text-sm text-gray-600">
                                {ddq.contactName} • {ddq.contactTitle}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Manager</span>
                              <p className="font-medium text-gray-900">{ddq.managerName}</p>
                              <p className="text-sm text-gray-600">
                                {ddq.strategy} • {ddq.fundSize}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Progress</span>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-[#00B2FF] h-2 rounded-full"
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
                                label: "Send Message",
                                onClick: () => handleMessageClient(ddq),
                              },
                              {
                                label: "Export DDQ",
                                onClick: () => {
                                  // Create a mock export functionality
                                  const exportData = {
                                    ddqId: ddq.id,
                                    templateName: ddq.templateName,
                                    clientName: ddq.clientName,
                                    managerName: ddq.managerName,
                                    status: ddq.status,
                                    progress: ddq.progress,
                                    dueDate: ddq.dueDate,
                                    exportDate: new Date().toISOString(),
                                  }

                                  // Create and download a JSON file
                                  const dataStr = JSON.stringify(exportData, null, 2)
                                  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
                                  const exportFileDefaultName = `${ddq.templateName.replace(/\s+/g, "_")}_${ddq.clientName.replace(/\s+/g, "_")}.json`

                                  const linkElement = document.createElement("a")
                                  linkElement.setAttribute("href", dataUri)
                                  linkElement.setAttribute("download", exportFileDefaultName)
                                  linkElement.click()

                                  showNotification(`Exported DDQ: ${ddq.templateName}`)
                                },
                              },
                              {
                                label: "Schedule Meeting",
                                onClick: () => {
                                  showNotification(`Opening calendar to schedule meeting with ${ddq.contactName}`)
                                  // In a real app, this would open a calendar integration
                                },
                              },
                              {
                                label: "View Client Profile",
                                onClick: () => {
                                  router.push(`/screens/general/person-profile?clientId=${ddq.clientId}`)
                                  showNotification(`Opening profile for ${ddq.clientName}`)
                                },
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
            <div className="space-y-4">
              {completedDDQs.map((ddq) => (
                <Card key={ddq.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                          {getStatusBadge(ddq.status)}
                          {getRoleBadge(ddq.role)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Client</span>
                            <p className="font-medium text-gray-900">{ddq.clientName}</p>
                            <p className="text-sm text-gray-600">
                              {ddq.contactName} • {ddq.contactTitle}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Manager</span>
                            <p className="font-medium text-gray-900">{ddq.managerName}</p>
                            <p className="text-sm text-gray-600">
                              {ddq.strategy} • {ddq.fundSize}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Completed</span>
                            <p className="font-medium text-gray-900">
                              {new Date(ddq.completedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Vintage</span>
                            <p className="font-medium text-gray-900">{ddq.vintage}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Export
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
    </Screen>
  )
}
