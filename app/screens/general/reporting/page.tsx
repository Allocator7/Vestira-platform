"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Download,
  Calendar,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Users,
  Shield,
  Eye,
  Edit,
  Copy,
  Plus,
  Search,
  RefreshCw,
  Mail,
  Share,
  Archive,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useApp } from "@/context/AppContext"
import { useToast } from "@/hooks/use-toast"
import { auditLogger } from "@/lib/security/audit-logger"

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  type: "performance" | "compliance" | "due_diligence" | "risk" | "custom"
  format: "pdf" | "excel" | "powerpoint" | "dashboard"
  frequency: "on_demand" | "daily" | "weekly" | "monthly" | "quarterly" | "annually"
  lastGenerated: string
  nextScheduled?: string
  recipients: string[]
  status: "active" | "draft" | "archived"
  createdBy: string
  createdDate: string
  tags: string[]
  isStandard: boolean
  estimatedTime: string
}

interface GeneratedReport {
  id: string
  templateId: string
  templateName: string
  generatedDate: string
  generatedBy: string
  format: string
  size: string
  status: "generating" | "completed" | "failed" | "scheduled"
  downloadCount: number
  sharedWith: string[]
  expiryDate?: string
  isConfidential: boolean
}

export default function ReportingPage() {
  const { userRole, currentPersonProfile } = useApp()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("templates")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)
  const [isScheduleReportOpen, setIsScheduleReportOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)

  // Mock data for report templates
  const [reportTemplates] = useState<ReportTemplate[]>([
    {
      id: "template-1",
      name: "Quarterly Performance Report",
      description: "Comprehensive quarterly performance analysis with benchmarking",
      category: "Performance",
      type: "performance",
      format: "pdf",
      frequency: "quarterly",
      lastGenerated: "2024-01-15",
      nextScheduled: "2024-04-15",
      recipients: ["board@institution.com", "cio@institution.com"],
      status: "active",
      createdBy: "Sarah Johnson",
      createdDate: "2023-10-01",
      tags: ["Performance", "Quarterly", "Board Report"],
      isStandard: true,
      estimatedTime: "15-20 minutes",
    },
    {
      id: "template-2",
      name: "Due Diligence Summary",
      description: "Manager due diligence analysis and recommendation report",
      category: "Due Diligence",
      type: "due_diligence",
      format: "powerpoint",
      frequency: "on_demand",
      lastGenerated: "2024-01-20",
      recipients: ["investment.committee@institution.com"],
      status: "active",
      createdBy: "Michael Chen",
      createdDate: "2023-11-15",
      tags: ["Due Diligence", "Investment Committee", "Manager Selection"],
      isStandard: true,
      estimatedTime: "10-15 minutes",
    },
    {
      id: "template-3",
      name: "Risk Assessment Dashboard",
      description: "Real-time risk metrics and portfolio analysis",
      category: "Risk Management",
      type: "risk",
      format: "dashboard",
      frequency: "daily",
      lastGenerated: "2024-01-25",
      nextScheduled: "2024-01-26",
      recipients: ["risk@institution.com", "portfolio@institution.com"],
      status: "active",
      createdBy: "Emily Rodriguez",
      createdDate: "2023-12-01",
      tags: ["Risk", "Daily", "Portfolio Monitoring"],
      isStandard: false,
      estimatedTime: "5-10 minutes",
    },
    {
      id: "template-4",
      name: "Compliance Monitoring Report",
      description: "Regulatory compliance status and audit trail",
      category: "Compliance",
      type: "compliance",
      format: "excel",
      frequency: "monthly",
      lastGenerated: "2024-01-01",
      nextScheduled: "2024-02-01",
      recipients: ["compliance@institution.com", "audit@institution.com"],
      status: "active",
      createdBy: "David Kim",
      createdDate: "2023-09-15",
      tags: ["Compliance", "Regulatory", "Audit"],
      isStandard: true,
      estimatedTime: "20-25 minutes",
    },
    {
      id: "template-5",
      name: "ESG Impact Assessment",
      description: "Environmental, social, and governance impact analysis",
      category: "ESG",
      type: "custom",
      format: "pdf",
      frequency: "quarterly",
      lastGenerated: "2024-01-10",
      nextScheduled: "2024-04-10",
      recipients: ["esg@institution.com", "sustainability@institution.com"],
      status: "active",
      createdBy: "Jennifer Park",
      createdDate: "2023-11-01",
      tags: ["ESG", "Sustainability", "Impact"],
      isStandard: false,
      estimatedTime: "25-30 minutes",
    },
  ])

  // Mock data for generated reports
  const [generatedReports] = useState<GeneratedReport[]>([
    {
      id: "report-1",
      templateId: "template-1",
      templateName: "Quarterly Performance Report",
      generatedDate: "2024-01-15",
      generatedBy: "Sarah Johnson",
      format: "PDF",
      size: "2.4 MB",
      status: "completed",
      downloadCount: 12,
      sharedWith: ["board@institution.com", "cio@institution.com"],
      expiryDate: "2024-07-15",
      isConfidential: true,
    },
    {
      id: "report-2",
      templateId: "template-2",
      templateName: "Due Diligence Summary",
      generatedDate: "2024-01-20",
      generatedBy: "Michael Chen",
      format: "PowerPoint",
      size: "8.7 MB",
      status: "completed",
      downloadCount: 8,
      sharedWith: ["investment.committee@institution.com"],
      expiryDate: "2024-04-20",
      isConfidential: true,
    },
    {
      id: "report-3",
      templateId: "template-3",
      templateName: "Risk Assessment Dashboard",
      generatedDate: "2024-01-25",
      generatedBy: "System",
      format: "Dashboard",
      size: "Live Data",
      status: "completed",
      downloadCount: 45,
      sharedWith: ["risk@institution.com", "portfolio@institution.com"],
      isConfidential: false,
    },
    {
      id: "report-4",
      templateId: "template-4",
      templateName: "Compliance Monitoring Report",
      generatedDate: "2024-01-01",
      generatedBy: "David Kim",
      format: "Excel",
      size: "1.8 MB",
      status: "completed",
      downloadCount: 6,
      sharedWith: ["compliance@institution.com", "audit@institution.com"],
      expiryDate: "2024-12-31",
      isConfidential: true,
    },
  ])

  // Reporting metrics
  const reportingMetrics = {
    totalTemplates: reportTemplates.length,
    activeTemplates: reportTemplates.filter((t) => t.status === "active").length,
    reportsGenerated: generatedReports.length,
    scheduledReports: reportTemplates.filter((t) => t.frequency !== "on_demand").length,
    totalDownloads: generatedReports.reduce((sum, r) => sum + r.downloadCount, 0),
    avgGenerationTime: "12 minutes",
  }

  // Filter templates
  const filteredTemplates = reportTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === "all" || template.category === filterCategory
    const matchesType = filterType === "all" || template.type === filterType

    return matchesSearch && matchesCategory && matchesType
  })

  // Handle report generation
  const handleGenerateReport = async (templateId: string) => {
    const template = reportTemplates.find((t) => t.id === templateId)
    if (!template) return

    // Log report generation
    await auditLogger.logEvent({
      userId: currentPersonProfile?.id || "current-user",
      userEmail: currentPersonProfile?.email || "user@example.com",
      action: "report_generated",
      resourceType: "report",
      resourceId: templateId,
      ipAddress: "127.0.0.1",
      userAgent: navigator.userAgent,
      sessionId: "demo-session",
      result: "success",
      details: {
        templateName: template.name,
        format: template.format,
        recipients: template.recipients,
      },
      riskLevel: "low",
    })

    toast({
      title: "Report generation started",
      description: `${template.name} is being generated. You'll be notified when it's ready.`,
    })
  }

  const handleScheduleReport = async (templateId: string, schedule: any) => {
    const template = reportTemplates.find((t) => t.id === templateId)
    if (!template) return

    toast({
      title: "Report scheduled",
      description: `${template.name} has been scheduled for automatic generation.`,
    })

    setIsScheduleReportOpen(false)
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />
      case "excel":
        return <BarChart3 className="h-4 w-4 text-green-600" />
      case "powerpoint":
        return <PieChart className="h-4 w-4 text-orange-600" />
      case "dashboard":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getReportStatusBadge = (status: GeneratedReport["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "generating":
        return <Badge className="bg-blue-100 text-blue-800">Generating</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "scheduled":
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const categories = ["all", ...Array.from(new Set(reportTemplates.map((t) => t.category)))]
  const types = ["all", "performance", "compliance", "due_diligence", "risk", "custom"]

  return (
    <Screen>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-deepBrand">Reporting Engine</h1>
              <p className="text-baseGray">
                Generate comprehensive reports for performance analysis, compliance, and stakeholder communication
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
              <Dialog open={isScheduleReportOpen} onOpenChange={setIsScheduleReportOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Calendar className="h-4 w-4" />
                    Schedule Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Automated Report</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Report Template</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTemplates
                            .filter((t) => t.status === "active")
                            .map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select defaultValue="monthly">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Recipients</Label>
                      <Textarea placeholder="Enter email addresses (one per line)" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsScheduleReportOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleScheduleReport("template-1", {})}
                      className="bg-electric-blue hover:bg-electric-blue/90"
                    >
                      Schedule Report
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1 bg-electric-blue hover:bg-electric-blue/90">
                    <Plus className="h-4 w-4" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create Report Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Template Name</Label>
                      <Input placeholder="Enter template name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Brief description of the report purpose and contents" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Performance">Performance</SelectItem>
                            <SelectItem value="Compliance">Compliance</SelectItem>
                            <SelectItem value="Due Diligence">Due Diligence</SelectItem>
                            <SelectItem value="Risk Management">Risk Management</SelectItem>
                            <SelectItem value="ESG">ESG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Format</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                            <SelectItem value="powerpoint">PowerPoint Presentation</SelectItem>
                            <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Default Recipients</Label>
                      <Textarea placeholder="Enter default email addresses (one per line)" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateTemplateOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setIsCreateTemplateOpen(false)}
                      className="bg-electric-blue hover:bg-electric-blue/90"
                    >
                      Create Template
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Reporting Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-baseGray">Total Templates</p>
                    <p className="text-2xl font-bold text-deepBrand">{reportingMetrics.totalTemplates}</p>
                  </div>
                  <FileText className="h-8 w-8 text-electric-blue" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-baseGray">Active Templates</p>
                    <p className="text-2xl font-bold text-deepBrand">{reportingMetrics.activeTemplates}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-baseGray">Reports Generated</p>
                    <p className="text-2xl font-bold text-deepBrand">{reportingMetrics.reportsGenerated}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-baseGray">Scheduled Reports</p>
                    <p className="text-2xl font-bold text-deepBrand">{reportingMetrics.scheduledReports}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-baseGray">Total Downloads</p>
                    <p className="text-2xl font-bold text-deepBrand">{reportingMetrics.totalDownloads}</p>
                  </div>
                  <Download className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-baseGray">Avg Generation</p>
                    <p className="text-2xl font-bold text-deepBrand">{reportingMetrics.avgGenerationTime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="templates">Report Templates</TabsTrigger>
              <TabsTrigger value="generated">Generated Reports</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              {/* Search and Filter Controls */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search templates by name, description, or tags..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Templates Grid */}
              <div className="grid gap-6">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-electric-blue/10 rounded-lg">{getFormatIcon(template.format)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-deepBrand">{template.name}</h3>
                              {template.isStandard && (
                                <Badge className="bg-electric-blue text-white">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Standard
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-baseGray mb-2">{template.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-baseGray">Category:</span>
                                <span className="ml-1 font-medium text-deepBrand">{template.category}</span>
                              </div>
                              <div>
                                <span className="text-baseGray">Format:</span>
                                <span className="ml-1 font-medium text-deepBrand capitalize">{template.format}</span>
                              </div>
                              <div>
                                <span className="text-baseGray">Frequency:</span>
                                <span className="ml-1 font-medium text-deepBrand capitalize">
                                  {template.frequency.replace("_", " ")}
                                </span>
                              </div>
                              <div>
                                <span className="text-baseGray">Est. Time:</span>
                                <span className="ml-1 font-medium text-deepBrand">{template.estimatedTime}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {template.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-baseGray">
                              <span>
                                Created by {template.createdBy} on {template.createdDate}
                              </span>
                              {template.lastGenerated && <span> • Last generated: {template.lastGenerated}</span>}
                              {template.nextScheduled && <span> • Next scheduled: {template.nextScheduled}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">{getStatusBadge(template.status)}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-baseGray">
                          <Users className="h-4 w-4" />
                          <span>{template.recipients.length} recipients</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateReport(template.id)}
                            className="gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Generate
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Copy className="h-4 w-4" />
                            Clone
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="generated" className="space-y-6">
              <div className="space-y-4">
                {generatedReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-electric-blue/10 rounded-lg">
                            {getFormatIcon(report.format.toLowerCase())}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-deepBrand">{report.templateName}</h3>
                              {report.isConfidential && (
                                <Badge className="bg-red-100 text-red-800">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Confidential
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-baseGray">Generated:</span>
                                <span className="ml-1 font-medium text-deepBrand">{report.generatedDate}</span>
                              </div>
                              <div>
                                <span className="text-baseGray">By:</span>
                                <span className="ml-1 font-medium text-deepBrand">{report.generatedBy}</span>
                              </div>
                              <div>
                                <span className="text-baseGray">Size:</span>
                                <span className="ml-1 font-medium text-deepBrand">{report.size}</span>
                              </div>
                              <div>
                                <span className="text-baseGray">Downloads:</span>
                                <span className="ml-1 font-medium text-deepBrand">{report.downloadCount}</span>
                              </div>
                            </div>
                            {report.expiryDate && (
                              <div className="text-sm text-baseGray mb-2">
                                <span>Expires: {report.expiryDate}</span>
                              </div>
                            )}
                            <div className="text-sm text-baseGray">
                              <span>Shared with: {report.sharedWith.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">{getReportStatusBadge(report.status)}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-baseGray">
                          <span>{report.format} Format</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Share className="h-4 w-4" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Mail className="h-4 w-4" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Archive className="h-4 w-4" />
                            Archive
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-deepBrand">Scheduled Reports</CardTitle>
                  <CardDescription>Automated report generation schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportTemplates
                      .filter((t) => t.frequency !== "on_demand" && t.status === "active")
                      .map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-electric-blue/10 rounded-lg">{getFormatIcon(template.format)}</div>
                            <div>
                              <h4 className="font-medium text-deepBrand">{template.name}</h4>
                              <p className="text-sm text-baseGray">
                                {template.frequency.charAt(0).toUpperCase() + template.frequency.slice(1)} •{" "}
                                {template.recipients.length} recipients
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                              <p className="text-deepBrand font-medium">
                                Next: {template.nextScheduled || "Not scheduled"}
                              </p>
                              <p className="text-baseGray">Last: {template.lastGenerated}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand">Report Generation Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">This Month</span>
                        <span className="font-semibold text-deepBrand">24 reports</span>
                      </div>
                      <Progress value={80} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Last Month</span>
                        <span className="font-semibold text-deepBrand">18 reports</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Average per Month</span>
                        <span className="font-semibold text-deepBrand">21 reports</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand">Popular Report Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Performance Reports</span>
                        <span className="font-semibold text-deepBrand">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Compliance Reports</span>
                        <span className="font-semibold text-deepBrand">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Risk Analysis</span>
                        <span className="font-semibold text-deepBrand">20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Due Diligence</span>
                        <span className="font-semibold text-deepBrand">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Screen>
  )
}
