"use client"

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { Screen } from "@/components/Screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  GitBranch,
  MessageSquare,
  Save,
  Send,
  User,
  Database,
} from "lucide-react"
import { BranchingQuestionManager } from "@/components/BranchingQuestionManager"
import { useRouter } from "next/navigation"
import { ResponseBankManager } from "@/components/ResponseBankManager"

export default function DDQResponsePage() {
  const router = useRouter()
  const [notification, setNotification] = useState("")
  const [showResponseBank, setShowResponseBank] = useState(false)

  // Mock DDQ data from manager's perspective
  // Load draft on component mount
  useEffect(() => {
    const loadDraft = () => {
      try {
        // Try to load from sessionStorage first (most recent)
        const sessionDraft = sessionStorage.getItem(`ddq-session-${ddqData.id}`)
        if (sessionDraft) {
          const parsed = JSON.parse(sessionDraft)
          setDdqData(parsed)
          showNotification("Draft loaded from session")
          return
        }
        
        // Fall back to localStorage
        const localDraft = localStorage.getItem(`ddq-draft-${ddqData.id}`)
        if (localDraft) {
          const parsed = JSON.parse(localDraft)
          setDdqData(parsed.data)
          showNotification("Draft loaded from storage")
        }
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
    
    loadDraft()
  }, [])

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      try {
        sessionStorage.setItem(`ddq-session-${ddqData.id}`, JSON.stringify(ddqData))
      } catch (error) {
        console.error("Auto-save error:", error)
      }
    }
    
    const timeoutId = setTimeout(autoSave, 30000) // Auto-save every 30 seconds
    return () => clearTimeout(timeoutId)
  }, [ddqData])

  const [ddqData, setDdqData] = useState({
    id: "ddq-1",
    templateName: "Vestira Infrastructure Fund DDQ",
    allocatorName: "CalPERS",
    allocatorFirm: "California Public Employees' Retirement System",
    status: "in_progress",
    receivedDate: "2024-01-15",
    dueDate: "2024-02-15",
    strategy: "Infrastructure",
    fundSize: "$2.5B",
    vintage: "2024",
    progress: 85,
    lastUpdated: "2024-01-20T14:30:00Z",
    questions: [
      {
        id: "q1",
        section: "Organization & Management",
        question: "How many employees does your firm currently have?",
        answer: "We currently have 145 full-time employees across our global offices.",
        type: "short_text",
        required: true,
        answeredAt: "2024-01-15T10:30:00Z",
        branches: [
          {
            id: "branch-1",
            parentQuestionId: "q1",
            question: "Can you provide a breakdown of employees by department (Investment, Operations, Support, etc.)?",
            type: "long_text",
            required: true,
            answer:
              "Investment Team: 65 employees\nOperations: 35 employees\nClient Relations: 25 employees\nCompliance & Legal: 12 employees\nIT & Technology: 8 employees",
            status: "answered",
            createdBy: "John Smith",
            createdAt: "2024-01-16T09:00:00Z",
            answeredAt: "2024-01-17T14:30:00Z",
            reasoning: "Need to understand team structure for operational due diligence assessment.",
            priority: "high",
          },
          {
            id: "branch-2",
            parentQuestionId: "q1",
            question: "What is the geographic distribution of your employees?",
            type: "long_text",
            required: false,
            answer:
              "New York (HQ): 85 employees\nLondon: 35 employees\nSingapore: 15 employees\nSan Francisco: 10 employees",
            status: "answered",
            createdBy: "Maria Garcia",
            createdAt: "2024-01-16T11:15:00Z",
            answeredAt: "2024-01-17T16:45:00Z",
            reasoning: "Important for understanding global operational capabilities.",
            priority: "medium",
          },
        ],
      },
      {
        id: "q2",
        section: "Organization & Management",
        question: "What is your firm's total Assets Under Management (AUM)?",
        answer: "$2.5 billion as of December 31, 2023",
        type: "currency",
        required: true,
        answeredAt: "2024-01-15T10:32:00Z",
        branches: [
          {
            id: "branch-3",
            parentQuestionId: "q2",
            question: "How has your AUM grown over the past 5 years? Please provide annual figures.",
            type: "long_text",
            required: true,
            status: "pending",
            createdBy: "John Smith",
            createdAt: "2024-01-18T10:00:00Z",
            reasoning: "Need to assess growth trajectory and fundraising capabilities.",
            priority: "high",
          },
        ],
      },
      {
        id: "q3",
        section: "Investment Strategy",
        question: "Describe your investment strategy and approach for infrastructure investments.",
        answer:
          "Our infrastructure investment strategy focuses on essential assets in developed markets, targeting stable cash flows and inflation protection. We invest across transportation, utilities, and digital infrastructure sectors with a focus on ESG-compliant assets.",
        type: "long_text",
        required: true,
        answeredAt: "2024-01-15T11:15:00Z",
        branches: [
          {
            id: "branch-4",
            parentQuestionId: "q3",
            question: "What percentage of your portfolio is allocated to each infrastructure sector?",
            type: "long_text",
            required: true,
            status: "pending",
            createdBy: "Maria Garcia",
            createdAt: "2024-01-17T14:20:00Z",
            reasoning: "Need sector allocation details for portfolio construction analysis.",
            priority: "medium",
          },
          {
            id: "branch-5",
            parentQuestionId: "q3",
            question: "Do you invest in greenfield or brownfield projects, or both?",
            type: "multiple_choice",
            required: true,
            options: ["Greenfield only", "Brownfield only", "Both greenfield and brownfield", "Neither"],
            status: "pending",
            createdBy: "John Smith",
            createdAt: "2024-01-18T09:30:00Z",
            reasoning: "Important for understanding risk profile and development capabilities.",
            priority: "high",
          },
        ],
      },
      {
        id: "q4",
        section: "Risk Management",
        question: "Please describe your risk management framework and processes.",
        answer:
          "Our risk management framework includes comprehensive due diligence, ongoing monitoring, stress testing, and ESG risk assessment. We have a dedicated Risk Committee that meets monthly and reports to the Investment Committee.",
        type: "long_text",
        required: true,
        answeredAt: "2024-01-15T14:45:00Z",
        branches: [],
      },
      {
        id: "q5",
        section: "ESG & Compliance",
        question: "Do you have formal ESG policies in place?",
        answer: "Yes",
        type: "yes_no",
        required: true,
        answeredAt: "2024-01-16T10:00:00Z",
        branches: [
          {
            id: "branch-6",
            parentQuestionId: "q5",
            question: "Can you provide details on your ESG integration process and measurement frameworks?",
            type: "long_text",
            required: true,
            status: "clarification_needed",
            createdBy: "Maria Garcia",
            createdAt: "2024-01-17T11:30:00Z",
            reasoning: "Need detailed understanding of ESG implementation for compliance assessment.",
            priority: "high",
          },
        ],
      },
    ],
  })

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleUpdateQuestions = (updatedQuestions: any[]) => {
    setDdqData((prev) => ({
      ...prev,
      questions: updatedQuestions,
      lastUpdated: new Date().toISOString(),
    }))
    showNotification("Response updated successfully")
  }

  const handleSave = () => {
    try {
      // Save to localStorage with timestamp
      const draftData = {
        ddqId: ddqData.id,
        data: ddqData,
        savedAt: new Date().toISOString(),
        version: "1.0"
      }
      localStorage.setItem(`ddq-draft-${ddqData.id}`, JSON.stringify(draftData))
      
      // Also save to sessionStorage for immediate recovery
      sessionStorage.setItem(`ddq-session-${ddqData.id}`, JSON.stringify(ddqData))
      
      showNotification("DDQ responses saved as draft")
    } catch (error) {
      console.error("Error saving draft:", error)
      showNotification("Error saving draft - please try again")
    }
  }

  const handleSubmit = () => {
    setDdqData((prev) => ({ ...prev, status: "submitted" }))
    showNotification("DDQ submitted successfully")
  }

  const handleSendMessage = () => {
    showNotification(`Message sent to ${ddqData.allocatorName}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
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

  // Calculate branch statistics
  const totalBranches = ddqData.questions.reduce((acc, q) => acc + (q.branches?.length || 0), 0)
  const answeredBranches = ddqData.questions.reduce(
    (acc, q) => acc + (q.branches?.filter((b) => b.status === "answered").length || 0),
    0,
  )
  const pendingBranches = ddqData.questions.reduce(
    (acc, q) => acc + (q.branches?.filter((b) => b.status === "pending").length || 0),
    0,
  )
  const clarificationBranches = ddqData.questions.reduce(
    (acc, q) => acc + (q.branches?.filter((b) => b.status === "clarification_needed").length || 0),
    0,
  )

  const branchCompletionRate = totalBranches > 0 ? (answeredBranches / totalBranches) * 100 : 100

  return (
    <Screen>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to DDQ Hub
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-deepBrand">DDQ Response</h1>
                <p className="text-baseGray">{ddqData.templateName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleSendMessage}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Allocator
              </Button>
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSubmit} className="bg-electric-blue hover:bg-electric-blue/90">
                <Send className="h-4 w-4 mr-2" />
                Submit Response
              </Button>
            </div>
          </div>

          {/* DDQ Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-deepBrand" />
                    <span className="font-medium text-deepBrand">From</span>
                  </div>
                  <p className="text-lg font-semibold">{ddqData.allocatorName}</p>
                  <p className="text-sm text-baseGray">{ddqData.allocatorFirm}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-deepBrand" />
                    <span className="font-medium text-deepBrand">Strategy</span>
                  </div>
                  <p className="text-lg font-semibold">{ddqData.strategy}</p>
                  <p className="text-sm text-baseGray">
                    {ddqData.fundSize} • {ddqData.vintage}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-deepBrand" />
                    <span className="font-medium text-deepBrand">Status</span>
                  </div>
                  {getStatusBadge(ddqData.status)}
                  <p className="text-sm text-baseGray mt-1">Due: {ddqData.dueDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="h-5 w-5 text-deepBrand" />
                    <span className="font-medium text-deepBrand">Follow-ups</span>
                  </div>
                  <p className="text-lg font-semibold">{totalBranches} Total</p>
                  <p className="text-sm text-baseGray">
                    {answeredBranches} Answered • {pendingBranches} Pending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Main Questions Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>
                      {ddqData.questions.length}/{ddqData.questions.length} (100%)
                    </span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {totalBranches > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Follow-up Questions Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>
                        {answeredBranches}/{totalBranches} ({Math.round(branchCompletionRate)}%)
                      </span>
                    </div>
                    <Progress value={branchCompletionRate} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Branch Statistics */}
          {totalBranches > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-baseGray">Total Follow-ups</p>
                      <p className="text-2xl font-bold text-deepBrand">{totalBranches}</p>
                    </div>
                    <GitBranch className="h-6 w-6 text-deepBrand" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-baseGray">Answered</p>
                      <p className="text-2xl font-bold text-green-600">{answeredBranches}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-baseGray">Pending</p>
                      <p className="text-2xl font-bold text-orange-600">{pendingBranches}</p>
                    </div>
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-baseGray">Need Clarification</p>
                      <p className="text-2xl font-bold text-yellow-600">{clarificationBranches}</p>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Response Bank Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Response Bank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-baseGray mb-4">
                Access your saved responses and get suggestions for similar questions.
              </p>
              <Button variant="outline" onClick={() => setShowResponseBank(!showResponseBank)}>
                {showResponseBank ? "Hide" : "Show"} Response Bank
              </Button>
            </CardContent>
          </Card>

          {showResponseBank && (
            <ResponseBankManager
              compact={true}
              onSelectResponse={(response) => {
                showNotification(`Response copied: ${response.question.substring(0, 50)}...`)
              }}
            />
          )}

          {/* Questions and Branching Interface */}
          <BranchingQuestionManager
            questions={ddqData.questions}
            onUpdateQuestions={handleUpdateQuestions}
            currentUser="Sarah Chen"
            userRole="manager"
            readOnly={false}
          />
        </div>
      </div>
    </Screen>
  )
}
