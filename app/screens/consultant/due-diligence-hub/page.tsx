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
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  Clock,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Save,
  Send,
  Upload,
  Paperclip,
} from "lucide-react"
import { useApp } from "../../../../context/AppContext"
import { useRouter, useSearchParams } from "next/navigation"
import { BranchingQuestionManager } from "../../../../components/BranchingQuestionManager"

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

  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStrategy, setSelectedStrategy] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [notification, setNotification] = useState("")
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedDDQ, setSelectedDDQ] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedAllocator, setSelectedAllocator] = useState(null)
  const [messageContent, setMessageContent] = useState("")
  const [messageTopic, setMessageTopic] = useState("")

  // New state for comprehensive DDQ response interface
  const [showDDQResponseModal, setShowDDQResponseModal] = useState(false)
  const [selectedDDQForResponse, setSelectedDDQForResponse] = useState(null)
  const [questionAttachments, setQuestionAttachments] = useState<{[key: string]: File[]}>({})
  const [viewMode, setViewMode] = useState<"overview" | "question-by-question">("overview")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [activeSection, setActiveSection] = useState("firm")

  // Filter state for quick filter buttons - only one can be active at a time
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

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
    const tab = searchParams.get("tab")
    if (tab === "pending") {
      setActiveTab("pending")
    }
  }, [searchParams])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  // Helper function to check if DDQ can be edited
  const canEditDDQ = (ddq: any) => {
    // Allow editing as long as the entire DDQ has not been officially submitted in full
    return ddq.status !== "submitted" && ddq.status !== "approved"
  }

  // Pending DDQs - Manager receiving from allocators
  const pendingDDQs = [
    {
      id: "pending-1",
      templateName: "Vestira Infrastructure Fund DDQ",
      allocatorId: "alloc-1",
      allocatorName: "California Public Employees' Retirement System",
      contactName: "Sarah Johnson",
      contactTitle: "Senior Investment Officer",
      status: "in_progress",
      completionPercentage: 65,
      receivedDate: "2024-01-15",
      dueDate: "2024-02-15",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.5B",
      vintage: "2024",
      lastActivity: "2 hours ago",
      progress: 65,
      lastUpdated: "2024-01-20T14:30:00Z",
      totalQuestions: 127,
      answeredQuestions: 83,
      priority: "high",
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
              required: true,
              answeredAt: "2024-01-15T09:30:00Z",
              branches: [],
            },
            {
              id: "f2",
              section: "Firm",
              question: "What is your firm's legal structure?",
              answer: "Limited Liability Company (LLC)",
              type: "multiple_choice",
              required: true,
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
              required: true,
              answeredAt: "2024-01-15T11:15:00Z",
              branches: [
                {
                  id: "branch-4",
                  parentQuestionId: "q1",
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
                  parentQuestionId: "q1",
                  question: "Do you invest in greenfield or brownfield projects, or both?",
                  type: "multiple_choice",
                  options: ["Greenfield only", "Brownfield only", "Both greenfield and brownfield", "Neither"],
                  required: true,
                  status: "pending",
                  createdBy: "John Smith",
                  createdAt: "2024-01-18T09:30:00Z",
                  reasoning: "Important for understanding risk profile and development capabilities.",
                  priority: "high",
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
              required: true,
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
              required: true,
              answeredAt: "2024-01-15T10:30:00Z",
              branches: [
                {
                  id: "branch-1",
                  parentQuestionId: "q1",
                  question:
                    "Can you provide a breakdown of employees by department (Investment, Operations, Support, etc.)?",
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
                  required: true,
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
              section: "Operations",
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
          ],
        },
        {
          id: "technology",
          name: "Technology",
          questions: [
            {
              id: "tech1",
              section: "Technology",
              question: "What technology systems do you use for portfolio management and reporting?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "general",
          name: "Other",
          questions: [
            {
              id: "gen1",
              section: "Other",
              question: "Are there any other material matters we should be aware of?",
              answer: "",
              type: "long_text",
              required: false,
              branches: [],
            },
          ],
        },
      ],
    },
    {
      id: "pending-2",
      templateName: "Vestira Private Equity Fund DDQ",
      allocatorId: "alloc-2",
      allocatorName: "Teachers' Retirement System of Texas",
      contactName: "Michael Chen",
      contactTitle: "Investment Director",
      status: "not_started",
      completionPercentage: 0,
      receivedDate: "2024-01-18",
      dueDate: "2024-02-10",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$1.8B",
      vintage: "2024",
      lastActivity: "3 days ago",
      progress: 0,
      lastUpdated: "2024-01-18T16:45:00Z",
      totalQuestions: 98,
      answeredQuestions: 0,
      priority: "medium",
      sections: [
        {
          id: "firm",
          name: "Firm",
          questions: [
            {
              id: "pe-f1",
              section: "Firm",
              question: "Please describe your firm's private equity investment experience and track record.",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
            {
              id: "pe-f2",
              section: "Firm",
              question: "What is your firm's current Assets Under Management in private equity strategies?",
              answer: "",
              type: "currency",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "investments",
          name: "Investments",
          questions: [
            {
              id: "pe-i1",
              section: "Investments",
              question: "What sectors do you focus on for private equity investments?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
            {
              id: "pe-i2",
              section: "Investments",
              question: "What is your typical investment size range?",
              answer: "",
              type: "short_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "compliance",
          name: "Compliance",
          questions: [
            {
              id: "pe-c1",
              section: "Compliance",
              question: "Do you have experience with regulatory compliance in private equity?",
              answer: "",
              type: "yes_no",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "risk-management",
          name: "Risk Management",
          questions: [
            {
              id: "pe-r1",
              section: "Risk Management",
              question: "How do you assess and manage risks in private equity investments?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "operations",
          name: "Operations",
          questions: [
            {
              id: "pe-o1",
              section: "Operations",
              question: "How many investment professionals are dedicated to private equity?",
              answer: "",
              type: "number",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "technology",
          name: "Technology",
          questions: [
            {
              id: "pe-t1",
              section: "Technology",
              question: "What technology platforms do you use for deal sourcing and analysis?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "general",
          name: "Other",
          questions: [
            {
              id: "pe-g1",
              section: "Other",
              question: "Any additional information relevant to your private equity capabilities?",
              answer: "",
              type: "long_text",
              required: false,
              branches: [],
            },
          ],
        },
      ],
    },
    {
      id: "pending-3",
      templateName: "Vestira Real Estate Fund DDQ",
      allocatorId: "alloc-3",
      allocatorName: "New York State Common Retirement Fund",
      contactName: "Jennifer Park",
      contactTitle: "Portfolio Manager",
      status: "in_progress",
      completionPercentage: 45,
      receivedDate: "2024-01-20",
      dueDate: "2024-02-05",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.2B",
      vintage: "2024",
      lastActivity: "1 day ago",
      progress: 45,
      lastUpdated: "2024-01-22T11:15:00Z",
      totalQuestions: 115,
      answeredQuestions: 52,
      priority: "high",
      sections: [
        {
          id: "firm",
          name: "Firm",
          questions: [
            {
              id: "re-f1",
              section: "Firm",
              question: "Please describe your firm's real estate investment experience.",
              answer:
                "We have over 15 years of experience in real estate investments across commercial, residential, and mixed-use properties.",
              type: "long_text",
              required: true,
              answeredAt: "2024-01-20T10:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "investments",
          name: "Investments",
          questions: [
            {
              id: "re-i1",
              section: "Investments",
              question: "What types of real estate do you invest in?",
              answer: "",
              type: "multiple_choice",
              options: ["Commercial", "Residential", "Industrial", "Mixed-use", "All of the above"],
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "compliance",
          name: "Compliance",
          questions: [
            {
              id: "re-c1",
              section: "Compliance",
              question: "Do you comply with local real estate regulations?",
              answer: "",
              type: "yes_no",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "risk-management",
          name: "Risk Management",
          questions: [
            {
              id: "re-r1",
              section: "Risk Management",
              question: "How do you manage real estate market risks?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "operations",
          name: "Operations",
          questions: [
            {
              id: "re-o1",
              section: "Operations",
              question: "How do you manage property operations and maintenance?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "technology",
          name: "Technology",
          questions: [
            {
              id: "re-t1",
              section: "Technology",
              question: "What property management systems do you use?",
              answer: "",
              type: "short_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "general",
          name: "Other",
          questions: [
            {
              id: "re-g1",
              section: "Other",
              question: "Any other relevant real estate information?",
              answer: "",
              type: "long_text",
              required: false,
              branches: [],
            },
          ],
        },
      ],
    },
    {
      id: "pending-4",
      templateName: "Vestira Credit Fund DDQ",
      allocatorId: "alloc-4",
      allocatorName: "Ontario Teachers' Pension Plan",
      contactName: "Robert Kim",
      contactTitle: "Senior Investment Analyst",
      status: "clarification_requested",
      completionPercentage: 78,
      receivedDate: "2024-01-12",
      dueDate: "2024-02-12",
      strategy: "Credit",
      investmentType: "sma",
      fundSize: "$800M",
      vintage: "2024",
      lastActivity: "5 hours ago",
      progress: 78,
      lastUpdated: "2024-01-19T13:20:00Z",
      totalQuestions: 89,
      answeredQuestions: 69,
      priority: "high",
      sections: [
        {
          id: "firm",
          name: "Firm",
          questions: [
            {
              id: "cr-f1",
              section: "Firm",
              question: "Please describe your firm's credit investment capabilities and experience.",
              answer:
                "We have been active in credit markets for over 12 years, managing both direct lending and distressed credit strategies.",
              type: "long_text",
              required: true,
              answeredAt: "2024-01-12T14:00:00Z",
              branches: [
                {
                  id: "cr-branch-1",
                  parentQuestionId: "cr-f1",
                  question: "Can you provide more details on your distressed credit experience specifically?",
                  type: "long_text",
                  required: true,
                  status: "pending",
                  createdBy: "Robert Kim",
                  createdAt: "2024-01-19T10:00:00Z",
                  reasoning: "Need more specific information about distressed credit capabilities for risk assessment.",
                  priority: "high",
                },
              ],
            },
            {
              id: "cr-f2",
              section: "Firm",
              question: "What is your current credit AUM?",
              answer: "$1.2 billion across all credit strategies",
              type: "currency",
              required: true,
              answeredAt: "2024-01-12T14:15:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "investments",
          name: "Investments",
          questions: [
            {
              id: "cr-i1",
              section: "Investments",
              question: "What types of credit investments do you focus on?",
              answer: "We focus on senior secured loans, mezzanine financing, and distressed debt opportunities.",
              type: "long_text",
              required: true,
              answeredAt: "2024-01-12T15:00:00Z",
              branches: [],
            },
            {
              id: "cr-i2",
              section: "Investments",
              question: "What is your target return for credit investments?",
              answer: "",
              type: "percentage",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "compliance",
          name: "Compliance",
          questions: [
            {
              id: "cr-c1",
              section: "Compliance",
              question: "Do you have experience with credit regulatory requirements?",
              answer: "Yes",
              type: "yes_no",
              required: true,
              answeredAt: "2024-01-13T09:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "risk-management",
          name: "Risk Management",
          questions: [
            {
              id: "cr-r1",
              section: "Risk Management",
              question: "How do you assess credit risk in your investments?",
              answer:
                "We use a comprehensive credit analysis framework including financial modeling, industry analysis, and management assessment.",
              type: "long_text",
              required: true,
              answeredAt: "2024-01-13T11:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "operations",
          name: "Operations",
          questions: [
            {
              id: "cr-o1",
              section: "Operations",
              question: "How many credit analysts do you employ?",
              answer: "We have 8 dedicated credit analysts and 3 senior credit officers.",
              type: "short_text",
              required: true,
              answeredAt: "2024-01-13T13:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "technology",
          name: "Technology",
          questions: [
            {
              id: "cr-t1",
              section: "Technology",
              question: "What credit analysis and monitoring systems do you use?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "general",
          name: "Other",
          questions: [
            {
              id: "cr-g1",
              section: "Other",
              question: "Any additional credit-related information?",
              answer: "",
              type: "long_text",
              required: false,
              branches: [],
            },
          ],
        },
      ],
    },
    {
      id: "pending-5",
      templateName: "Vestira Infrastructure Fund DDQ",
      allocatorId: "alloc-5",
      allocatorName: "Florida State Board of Administration",
      contactName: "David Thompson",
      contactTitle: "Investment Committee Member",
      status: "in_progress",
      completionPercentage: 92,
      receivedDate: "2024-01-10",
      dueDate: "2024-02-09",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$3.1B",
      vintage: "2024",
      lastActivity: "6 hours ago",
      progress: 92,
      lastUpdated: "2024-01-21T09:30:00Z",
      totalQuestions: 127,
      answeredQuestions: 117,
      priority: "medium",
      sections: [
        {
          id: "firm",
          name: "Firm",
          questions: [
            {
              id: "inf2-f1",
              section: "Firm",
              question: "Please provide details about your infrastructure investment team.",
              answer:
                "Our infrastructure team consists of 25 professionals with an average of 12 years of experience in infrastructure investments.",
              type: "long_text",
              required: true,
              answeredAt: "2024-01-10T10:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "investments",
          name: "Investments",
          questions: [
            {
              id: "inf2-i1",
              section: "Investments",
              question: "What infrastructure sectors do you invest in?",
              answer: "We invest in transportation, utilities, telecommunications, and social infrastructure.",
              type: "long_text",
              required: true,
              answeredAt: "2024-01-10T11:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "compliance",
          name: "Compliance",
          questions: [
            {
              id: "inf2-c1",
              section: "Compliance",
              question: "Do you comply with infrastructure regulatory requirements?",
              answer: "Yes",
              type: "yes_no",
              required: true,
              answeredAt: "2024-01-10T12:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "risk-management",
          name: "Risk Management",
          questions: [
            {
              id: "inf2-r1",
              section: "Risk Management",
              question: "How do you manage infrastructure-specific risks?",
              answer:
                "We have specialized risk management processes for regulatory, construction, and operational risks.",
              type: "long_text",
              required: true,
              answeredAt: "2024-01-10T13:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "operations",
          name: "Operations",
          questions: [
            {
              id: "inf2-o1",
              section: "Operations",
              question: "How do you monitor infrastructure asset performance?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "technology",
          name: "Technology",
          questions: [
            {
              id: "inf2-t1",
              section: "Technology",
              question: "What technology do you use for infrastructure asset management?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "general",
          name: "Other",
          questions: [
            {
              id: "inf2-g1",
              section: "Other",
              question: "Any other infrastructure-related information?",
              answer: "",
              type: "long_text",
              required: false,
              branches: [],
            },
          ],
        },
      ],
    },
    {
      id: "pending-6",
      templateName: "Vestira Private Equity Fund DDQ",
      allocatorId: "alloc-6",
      allocatorName: "Washington State Investment Board",
      contactName: "Lisa Wang",
      contactTitle: "Private Markets Director",
      status: "in_progress",
      completionPercentage: 33,
      receivedDate: "2024-01-22",
      dueDate: "2024-02-14",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$2.2B",
      vintage: "2024",
      lastActivity: "2 days ago",
      progress: 33,
      lastUpdated: "2024-01-17T15:45:00Z",
      totalQuestions: 98,
      answeredQuestions: 32,
      priority: "low",
      sections: [
        {
          id: "firm",
          name: "Firm",
          questions: [
            {
              id: "pe2-f1",
              section: "Firm",
              question: "What is your firm's private equity investment philosophy?",
              answer:
                "We focus on partnering with management teams to build sustainable, long-term value in middle-market companies.",
              type: "long_text",
              required: true,
              answeredAt: "2024-01-22T10:00:00Z",
              branches: [],
            },
          ],
        },
        {
          id: "investments",
          name: "Investments",
          questions: [
            {
              id: "pe2-i1",
              section: "Investments",
              question: "What is your typical holding period for private equity investments?",
              answer: "",
              type: "short_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "compliance",
          name: "Compliance",
          questions: [
            {
              id: "pe2-c1",
              section: "Compliance",
              question: "How do you ensure compliance across your portfolio companies?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "risk-management",
          name: "Risk Management",
          questions: [
            {
              id: "pe2-r1",
              section: "Risk Management",
              question: "What is your approach to managing portfolio company risks?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "operations",
          name: "Operations",
          questions: [
            {
              id: "pe2-o1",
              section: "Operations",
              question: "How do you support portfolio company operations?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "technology",
          name: "Technology",
          questions: [
            {
              id: "pe2-t1",
              section: "Technology",
              question: "What technology tools do you use for portfolio monitoring?",
              answer: "",
              type: "long_text",
              required: true,
              branches: [],
            },
          ],
        },
        {
          id: "general",
          name: "Other",
          questions: [
            {
              id: "pe2-g1",
              section: "Other",
              question: "Any additional private equity information?",
              answer: "",
              type: "long_text",
              required: false,
              branches: [],
            },
          ],
        },
      ],
    },
  ]

  // Submitted DDQs - Manager has completed and submitted
  const submittedDDQs = [
    {
      id: "submitted-1",
      templateName: "Vestira Infrastructure Fund DDQ",
      allocatorName: "California State Teachers' Retirement System",
      contactName: "Thomas Anderson",
      contactTitle: "Senior Investment Officer",
      status: "under_review",
      submittedDate: "2024-01-15",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$2.8B",
      vintage: "2023",
      completionPercentage: 100,
      totalQuestions: 127,
      answeredQuestions: 127,
    },
    {
      id: "submitted-2",
      templateName: "Vestira Private Equity Fund DDQ",
      allocatorName: "University of California Retirement System",
      contactName: "Rachel Green",
      contactTitle: "Investment Director",
      status: "approved",
      submittedDate: "2024-01-12",
      strategy: "Private Equity",
      investmentType: "sma",
      fundSize: "$1.9B",
      vintage: "2023",
      completionPercentage: 100,
      totalQuestions: 98,
      answeredQuestions: 98,
    },
    {
      id: "submitted-3",
      templateName: "Vestira Real Estate Fund DDQ",
      allocatorName: "New Jersey Division of Investment",
      contactName: "Emily White",
      contactTitle: "Portfolio Manager",
      status: "approved",
      submittedDate: "2024-01-10",
      strategy: "Real Estate",
      investmentType: "fund",
      fundSize: "$1.5B",
      vintage: "2023",
      completionPercentage: 100,
      totalQuestions: 115,
      answeredQuestions: 115,
    },
    {
      id: "submitted-4",
      templateName: "Vestira Credit Fund DDQ",
      allocatorName: "Oregon Public Employees Retirement Fund",
      contactName: "Kevin Lee",
      contactTitle: "Senior Investment Analyst",
      status: "under_review",
      submittedDate: "2024-01-08",
      strategy: "Credit",
      investmentType: "sma",
      fundSize: "$1.2B",
      vintage: "2023",
      completionPercentage: 100,
      totalQuestions: 89,
      answeredQuestions: 89,
    },
    {
      id: "submitted-5",
      templateName: "Vestira Infrastructure Fund DDQ",
      allocatorName: "Pennsylvania Public School Employees' Retirement System",
      contactName: "Brian Clark",
      contactTitle: "Investment Committee Chair",
      status: "approved",
      submittedDate: "2024-01-05",
      strategy: "Infrastructure",
      investmentType: "fund",
      fundSize: "$3.2B",
      vintage: "2022",
      completionPercentage: 100,
      totalQuestions: 127,
      answeredQuestions: 127,
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

  // Filter functions
  const isDueSoon = (ddq: any) => {
    const dueDate = new Date(ddq.dueDate)
    const today = new Date()
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysDiff <= 7
  }

  const needsClarification = (ddq: any) => {
    return ddq.status === "clarification_requested"
  }

  // Filter DDQs based on all active filters
  const getFilteredDDQs = () => {
    let filtered = [...pendingDDQs]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (ddq) =>
          ddq.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ddq.allocatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ddq.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ddq.strategy.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply strategy filter
    if (selectedStrategy !== "All") {
      filtered = filtered.filter((ddq) => ddq.strategy === selectedStrategy)
    }

    // Apply status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter((ddq) => ddq.status === selectedStatus)
    }

    // Apply quick filters - only one can be active at a time
    if (activeFilter === "due-soon") {
      filtered = filtered.filter(isDueSoon)
    } else if (activeFilter === "needs-clarification") {
      filtered = filtered.filter(needsClarification)
    }

    return filtered
  }

  // Toggle filter function - only one filter can be active at a time
  const toggleFilter = (filterKey: string) => {
    if (activeFilter === filterKey) {
      // If clicking the same filter, deactivate it
      setActiveFilter(null)
    } else {
      // Otherwise, activate the new filter
      setActiveFilter(filterKey)
    }
  }

  // Calculate actual counts
  const dueSoonCount = pendingDDQs.filter(isDueSoon).length
  const clarificationCount = pendingDDQs.filter(needsClarification).length

  const handleStartDDQ = (ddqId: string) => {
    const ddq = pendingDDQs.find((d) => d.id === ddqId)
    if (ddq) {
      setSelectedDDQForResponse(ddq)
      setShowDDQResponseModal(true)
      setViewMode("overview")
      setCurrentQuestionIndex(0)
      setActiveSection("firm")
    }
  }

  const handleContinueDDQ = (ddqId: string) => {
    const ddq = pendingDDQs.find((d) => d.id === ddqId)
    if (ddq) {
      setSelectedDDQForResponse(ddq)
      setShowDDQResponseModal(true)
      setViewMode("overview")
      setCurrentQuestionIndex(0)
      setActiveSection("firm")
      showNotification(`Continuing DDQ response: ${ddq.templateName}`)
    }
  }

  const handleMessageAllocator = (ddq: any) => {
    console.log("Opening message modal for:", ddq.contactName)
    setSelectedAllocator(ddq)
    setShowMessageModal(true)
  }

  const handleSendMessage = () => {
    if (!messageContent.trim() || !messageTopic.trim()) {
      showNotification("Please fill in all required fields")
      return
    }

    console.log("Sending message to:", selectedAllocator?.contactName)
    console.log("Message content:", messageContent)

    showNotification(`Message sent to ${selectedAllocator?.contactName} at ${selectedAllocator?.allocatorName}`)
    setShowMessageModal(false)
    setSelectedAllocator(null)
    setMessageContent("")
    setMessageTopic("")
  }

  const closeMessageModal = () => {
    setShowMessageModal(false)
    setSelectedAllocator(null)
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
          <Badge className="bg-blue-100 text-blue-800">
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
      case "not_started":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <FileText className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        )
      case "clarification_requested":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Clarification Requested
          </Badge>
        )
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
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

  // Question-by-question navigation functions
  const getAllQuestions = () => {
    if (!selectedDDQForResponse?.sections) return []
    return selectedDDQForResponse.sections.flatMap((section) => section.questions || [])
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

  // Helper function to get questions for active section
  const getQuestionsForSection = (sectionId: string) => {
    if (!selectedDDQForResponse?.sections) return []
    const section = selectedDDQForResponse.sections.find((s) => s.id === sectionId)
    return section?.questions || []
  }

  // Helper function to get section question count
  const getSectionQuestionCount = (sectionId: string) => {
    return getQuestionsForSection(sectionId).length
  }

  console.log("Manager Due Diligence Hub rendered with", pendingDDQs.length, "pending DDQs")

  return (
    <Screen>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Comprehensive DDQ Response Modal */}
      {showDDQResponseModal && selectedDDQForResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-7xl mx-4 h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedDDQForResponse.templateName}</h3>
                <p className="text-sm text-gray-600">
                  From: {selectedDDQForResponse.contactName} • {selectedDDQForResponse.allocatorName}
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
                <Button variant="outline" onClick={() => setShowDDQResponseModal(false)}>
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
                                <Badge variant="secondary" className="text-xs">
                                  {question.type}
                                </Badge>
                                {question.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>

                              <h5 className="font-medium text-gray-900 mb-3">{question.question}</h5>

                              {/* Show answer input field if DDQ can be edited */}
                              {canEditDDQ(selectedDDQForResponse) && (
                                <div className="mb-4">
                                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Your Response</Label>
                                  {question.type === "long_text" ? (
                                    <Textarea
                                      placeholder="Enter your response..."
                                      defaultValue={question.answer || ""}
                                      rows={4}
                                      className="w-full"
                                    />
                                  ) : question.type === "yes_no" ? (
                                    <Select defaultValue={question.answer || ""}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an option..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                        <SelectItem value="N/A">N/A</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : question.type === "multiple_choice" && question.options ? (
                                    <Select defaultValue={question.answer || ""}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an option..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {question.options.map((option, idx) => (
                                          <SelectItem key={idx} value={option}>
                                            {option}
                                          </SelectItem>
                                        ))}
                                        <SelectItem value="N/A">N/A</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      placeholder="Enter your response..."
                                      defaultValue={question.answer || ""}
                                      className="w-full"
                                    />
                                  )}

                                  {/* Document Attachment Section */}
                                  <div className="mt-4">
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Attach Documents</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                      <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                                      <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        id={`file-upload-${question.id}`}
                                        onChange={(e) => {
                                          const files = Array.from(e.target.files || [])
                                          setQuestionAttachments(prev => ({
                                            ...prev,
                                            [question.id]: [...(prev[question.id] || []), ...files]
                                          }))
                                        }}
                                      />
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => document.getElementById(`file-upload-${question.id}`)?.click()}
                                      >
                                        Choose Files
                                      </Button>
                                    </div>
                                    
                                    {/* Show attached files */}
                                    {questionAttachments[question.id] && questionAttachments[question.id].length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                                        {questionAttachments[question.id].map((file, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center gap-2">
                                              <Paperclip className="h-4 w-4 text-gray-500" />
                                              <span className="text-sm text-gray-700">{file.name}</span>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                setQuestionAttachments(prev => ({
                                                  ...prev,
                                                  [question.id]: prev[question.id].filter((_, i) => i !== index)
                                                }))
                                              }}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Show existing answer if present and DDQ cannot be edited */}
                              {!canEditDDQ(selectedDDQForResponse) && question.answer && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">
                                      Your Answer{" "}
                                      {question.answeredAt && `• ${new Date(question.answeredAt).toLocaleDateString()}`}
                                    </span>
                                  </div>
                                  <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-gray-800">{question.answer}</p>
                                  </div>
                                </div>
                              )}

                              {/* Show editable answer if DDQ can be edited and has existing answer */}
                              {canEditDDQ(selectedDDQForResponse) && question.answer && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">
                                      Current Answer (Editable){" "}
                                      {question.answeredAt && `• ${new Date(question.answeredAt).toLocaleDateString()}`}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Show not answered if no answer and cannot edit */}
                              {!canEditDDQ(selectedDDQForResponse) && !question.answer && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-700">Not Answered</span>
                                  </div>
                                  <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-orange-800 text-sm">This question was not answered.</p>
                                  </div>
                                </div>
                              )}

                              {/* Follow-up Questions using BranchingQuestionManager */}
                              {question.branches && question.branches.length > 0 && (
                                <BranchingQuestionManager
                                  parentQuestion={question}
                                  branches={question.branches}
                                  onUpdateBranches={(updatedBranches) => {
                                    // Update the question's branches in the selectedDDQForResponse
                                    if (selectedDDQForResponse) {
                                      const updatedSections = selectedDDQForResponse.sections.map((section) => ({
                                        ...section,
                                        questions: section.questions.map((q) =>
                                          q.id === question.id ? { ...q, branches: updatedBranches } : q,
                                        ),
                                      }))
                                      setSelectedDDQForResponse({
                                        ...selectedDDQForResponse,
                                        sections: updatedSections,
                                      })
                                    }
                                  }}
                                  userRole="manager"
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
                          <Badge variant="outline">{getCurrentQuestion().section}</Badge>
                          <Badge variant="secondary">{getCurrentQuestion().type}</Badge>
                          {getCurrentQuestion().required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>

                        <h4 className="text-xl font-semibold text-gray-900 mb-6">{getCurrentQuestion().question}</h4>

                        {/* Show answer input field if DDQ can be edited */}
                        {canEditDDQ(selectedDDQForResponse) && (
                          <div className="mb-6">
                            <Label className="text-sm font-medium text-gray-700 mb-3 block">Your Response</Label>
                            {getCurrentQuestion().type === "long_text" ? (
                              <Textarea
                                placeholder="Enter your response..."
                                defaultValue={getCurrentQuestion().answer || ""}
                                rows={6}
                                className="w-full"
                              />
                            ) : getCurrentQuestion().type === "yes_no" ? (
                              <Select defaultValue={getCurrentQuestion().answer || ""}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                  <SelectItem value="N/A">N/A</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : getCurrentQuestion().type === "multiple_choice" && getCurrentQuestion().options ? (
                              <Select defaultValue={getCurrentQuestion().answer || ""}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {getCurrentQuestion().options.map((option, idx) => (
                                    <SelectItem key={idx} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="N/A">N/A</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                placeholder="Enter your response..."
                                defaultValue={getCurrentQuestion().answer || ""}
                                className="w-full"
                              />
                            )}

                            {/* Document Attachment Section for Question-by-Question View */}
                            <div className="mt-6">
                              <Label className="text-sm font-medium text-gray-700 mb-3 block">Attach Documents</Label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                                <input
                                  type="file"
                                  multiple
                                  className="hidden"
                                  id={`file-upload-question-${getCurrentQuestion().id}`}
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files || [])
                                    setQuestionAttachments(prev => ({
                                      ...prev,
                                      [getCurrentQuestion().id]: [...(prev[getCurrentQuestion().id] || []), ...files]
                                    }))
                                  }}
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => document.getElementById(`file-upload-question-${getCurrentQuestion().id}`)?.click()}
                                >
                                  Choose Files
                                </Button>
                              </div>
                              
                              {/* Show attached files for Question-by-Question View */}
                              {questionAttachments[getCurrentQuestion().id] && questionAttachments[getCurrentQuestion().id].length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                                  {questionAttachments[getCurrentQuestion().id].map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <div className="flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setQuestionAttachments(prev => ({
                                            ...prev,
                                            [getCurrentQuestion().id]: prev[getCurrentQuestion().id].filter((_, i) => i !== index)
                                          }))
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Show existing answer if present and DDQ cannot be edited */}
                        {!canEditDDQ(selectedDDQForResponse) && getCurrentQuestion().answer && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-700">
                                Your Answer{" "}
                                {getCurrentQuestion().answeredAt &&
                                  `• ${new Date(getCurrentQuestion().answeredAt).toLocaleDateString()}`}
                              </span>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg">
                              <p className="text-gray-800 leading-relaxed">{getCurrentQuestion().answer}</p>
                            </div>
                          </div>
                        )}

                        {/* Show editable answer if DDQ can be edited and has existing answer */}
                        {canEditDDQ(selectedDDQForResponse) && getCurrentQuestion().answer && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-700">
                                Current Answer (Editable){" "}
                                {getCurrentQuestion().answeredAt &&
                                  `• ${new Date(getCurrentQuestion().answeredAt).toLocaleDateString()}`}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Show not answered if no answer and cannot edit */}
                        {!canEditDDQ(selectedDDQForResponse) && !getCurrentQuestion().answer && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="h-5 w-5 text-orange-600" />
                              <span className="font-medium text-orange-700">Not Answered</span>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-lg">
                              <p className="text-orange-800">This question was not answered.</p>
                            </div>
                          </div>
                        )}

                        {/* Follow-up Questions for Question-by-Question View */}
                        {getCurrentQuestion().branches && getCurrentQuestion().branches.length > 0 && (
                          <BranchingQuestionManager
                            parentQuestion={getCurrentQuestion()}
                            branches={getCurrentQuestion().branches}
                            onUpdateBranches={(updatedBranches) => {
                              // Update the question's branches in the selectedDDQForResponse
                              if (selectedDDQForResponse) {
                                const updatedSections = selectedDDQForResponse.sections.map((section) => ({
                                  ...section,
                                  questions: section.questions.map((q) =>
                                    q.id === getCurrentQuestion().id ? { ...q, branches: updatedBranches } : q,
                                  ),
                                }))
                                setSelectedDDQForResponse({ ...selectedDDQForResponse, sections: updatedSections })
                              }
                            }}
                            userRole="manager"
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

            {/* Action Footer */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Due: {new Date(selectedDDQForResponse.dueDate).toLocaleDateString()} • Last updated:{" "}
                  {selectedDDQForResponse.lastActivity}
                </div>
                <div className="flex items-center gap-3">
                  {canEditDDQ(selectedDDQForResponse) && (
                    <>
                      <Button variant="outline" onClick={() => showNotification("DDQ saved as draft")}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button
                        onClick={() => showNotification("DDQ submitted successfully")}
                        className="bg-electric-blue hover:bg-electric-blue/90"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Response
                      </Button>
                    </>
                  )}
                  {!canEditDDQ(selectedDDQForResponse) && (
                    <div className="text-sm text-gray-500">This DDQ has been submitted and cannot be edited</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedAllocator && (
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
                  {selectedAllocator.contactName} at {selectedAllocator.allocatorName}
                </span>
              </div>

              <div>
                <Label htmlFor="message-topic">Topic *</Label>
                <Input
                  id="message-topic"
                  value={messageTopic}
                  onChange={(e) => setMessageTopic(e.target.value)}
                  placeholder="Enter message topic"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message-content">Message *</Label>
                <Textarea
                  id="message-content"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Enter your message"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button variant="outline" onClick={closeMessageModal}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage} className="bg-electric-blue hover:bg-electric-blue/90">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Due Diligence Hub</h1>
            <p className="text-gray-600">Manage your due diligence questionnaire responses</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Pending DDQs ({pendingDDQs.length})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Submitted ({submittedDDQs.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending DDQs Tab */}
          <TabsContent value="pending" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search DDQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Strategies" />
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
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="clarification_requested">Needs Clarification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Filter Buttons - Only one can be active at a time */}
            <div className="flex gap-2">
              <Button
                variant={activeFilter === "due-soon" ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter("due-soon")}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Due Soon ({dueSoonCount})
              </Button>
              <Button
                variant={activeFilter === "needs-clarification" ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter("needs-clarification")}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Needs Clarification ({clarificationCount})
              </Button>
            </div>

            {/* DDQ Cards */}
            <div className="space-y-4">
              {getFilteredDDQs().map((ddq) => (
                <Card key={ddq.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                          {getStatusBadge(ddq.status)}
                          {getPriorityBadge(ddq.priority)}
                          {isDueSoon(ddq) && (
                            <Badge className="bg-red-100 text-red-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Due Soon
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Allocator</p>
                            <p className="font-medium text-gray-900">{ddq.allocatorName}</p>
                            <p className="text-sm text-gray-600">
                              {ddq.contactName} • {ddq.contactTitle}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Strategy</p>
                            <p className="font-medium text-gray-900">{ddq.strategy}</p>
                            <p className="text-sm text-gray-600">
                              {ddq.fundSize} • {ddq.vintage}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Progress</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${ddq.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{ddq.progress}%</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {ddq.answeredQuestions} of {ddq.totalQuestions} questions
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Due Date</p>
                            <p className="font-medium text-gray-900">{new Date(ddq.dueDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">Last activity: {ddq.lastActivity}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMessageAllocator(ddq)}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Message
                        </Button>

                        {ddq.status === "not_started" ? (
                          <Button
                            onClick={() => handleStartDDQ(ddq.id)}
                            className="bg-electric-blue hover:bg-electric-blue/90"
                          >
                            Start DDQ
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleContinueDDQ(ddq.id)}
                            className="bg-electric-blue hover:bg-electric-blue/90"
                          >
                            Continue
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {getFilteredDDQs().length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No DDQs found</h3>
                  <p className="text-gray-500">
                    {searchQuery || selectedStrategy !== "All" || selectedStatus !== "All" || activeFilter
                      ? "Try adjusting your search criteria or filters."
                      : "You don't have any pending DDQs at the moment."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Submitted DDQs Tab */}
          <TabsContent value="submitted" className="space-y-6">
            <div className="space-y-4">
              {submittedDDQs.map((ddq) => (
                <Card key={ddq.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ddq.templateName}</h3>
                          {getStatusBadge(ddq.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Allocator</p>
                            <p className="font-medium text-gray-900">{ddq.allocatorName}</p>
                            <p className="text-sm text-gray-600">
                              {ddq.contactName} • {ddq.contactTitle}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Strategy</p>
                            <p className="font-medium text-gray-900">{ddq.strategy}</p>
                            <p className="text-sm text-gray-600">
                              {ddq.fundSize} • {ddq.vintage}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Completion</p>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">100% Complete</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {ddq.answeredQuestions} of {ddq.totalQuestions} questions
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Submitted</p>
                            <p className="font-medium text-gray-900">
                              {new Date(ddq.submittedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {submittedDDQs.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submitted DDQs</h3>
                  <p className="text-gray-500">You haven't submitted any DDQs yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  )
}
