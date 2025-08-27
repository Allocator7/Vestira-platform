"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Mail,
  Send,
  Users,
  Calendar,
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Download,
  Bell,
  MessageSquare,
  Megaphone,
  Clock,
  CheckCircle,
  Briefcase,
  TrendingUp,
  MoreHorizontal,
  Trash2,
  LayoutTemplateIcon as Template,
} from "lucide-react"

export default function IndustryGroupCommunicationsPage() {
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("campaigns")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showCampaignDetailsModal, setShowCampaignDetailsModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({})
  const [customEmails, setCustomEmails] = useState("")
  const [showCustomListModal, setShowCustomListModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [showTemplateEditorModal, setShowTemplateEditorModal] = useState(false)
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    content: "",
  })
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    type: "",
    subject: "",
    message: "",
    scheduledDate: "",
    scheduledTime: "",
  })

  // Mock communications data
  const campaigns = [
    {
      id: "1",
      title: "Annual Summit Registration Open",
      type: "email",
      status: "sent",
      recipients: 1250,
      opened: 892,
      clicked: 234,
      sentDate: "2025-01-15",
      subject: "Don't Miss the 2025 Insurance Investment Summit",
      template: "event-announcement",
      tags: ["summit", "registration", "2025"],
    },
    {
      id: "2",
      title: "Regulatory Update Newsletter",
      type: "newsletter",
      status: "scheduled",
      recipients: 1450,
      opened: 0,
      clicked: 0,
      sentDate: "2025-01-30",
      subject: "January Regulatory Updates - Key Changes You Need to Know",
      template: "newsletter",
      tags: ["regulatory", "newsletter", "monthly"],
    },
    {
      id: "3",
      title: "Member Survey - Investment Trends",
      type: "survey",
      status: "draft",
      recipients: 0,
      opened: 0,
      clicked: 0,
      sentDate: null,
      subject: "Share Your Investment Outlook for 2025",
      template: "survey",
      tags: ["survey", "trends", "member-feedback"],
    },
    {
      id: "4",
      title: "Webinar Reminder - ESG Investing",
      type: "reminder",
      status: "sent",
      recipients: 456,
      opened: 398,
      clicked: 156,
      sentDate: "2025-01-20",
      subject: "Reminder: ESG Investment Strategies Webinar Tomorrow",
      template: "event-reminder",
      tags: ["webinar", "esg", "reminder"],
    },
  ]

  const templates = [
    {
      id: "1",
      name: "Event Announcement",
      type: "event-announcement",
      description: "Template for announcing new events",
      lastUsed: "2025-01-15",
      usage: 12,
    },
    {
      id: "2",
      name: "Monthly Newsletter",
      type: "newsletter",
      description: "Standard monthly newsletter template",
      lastUsed: "2025-01-01",
      usage: 24,
    },
    {
      id: "3",
      name: "Event Reminder",
      type: "event-reminder",
      description: "Reminder template for upcoming events",
      lastUsed: "2025-01-20",
      usage: 18,
    },
    {
      id: "4",
      name: "Survey Request",
      type: "survey",
      description: "Template for member surveys",
      lastUsed: "2024-12-15",
      usage: 6,
    },
  ]

  const memberGroups = [
    { id: "all", name: "All Members", count: 1450 },
    { id: "premium", name: "Premium Members", count: 320 },
    { id: "corporate", name: "Corporate Members", count: 180 },
    { id: "individual", name: "Individual Members", count: 950 },
    { id: "event-attendees", name: "Recent Event Attendees", count: 245 },
    { id: "newsletter-subscribers", name: "Newsletter Subscribers", count: 1200 },
    { id: "all-managers", name: "All Managers (VeMail)", count: 850 },
    { id: "all-allocators", name: "All Allocators (VeMail)", count: 1200 },
  ]

  // Button handlers
  const handleNewCampaign = () => {
    setShowComposeModal(true)
    toast({ title: "New Campaign", description: "Opening campaign composer" })
  }

  const handleManageTemplates = () => {
    setShowTemplatesModal(true)
    toast({ title: "Templates", description: "Opening template manager" })
  }

  const handleViewCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign) {
      toast({ title: "Error", description: "Campaign not found", variant: "destructive" })
      return
    }
    
    setSelectedCampaign(campaign)
    setShowCampaignDetailsModal(true)
    toast({ title: "Campaign Details", description: `Showing detailed analytics for: ${campaign.title}` })
  }

  const handleEditCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    toast({ title: "Edit Campaign", description: `Opening editor for: ${campaign?.title}` })
  }

  const handleResendCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign) {
      toast({ title: "Error", description: "Campaign not found", variant: "destructive" })
      return
    }
    
    if (confirm(`Are you sure you want to resend "${campaign.title}" to all ${campaign.recipients} recipients?`)) {
      toast({ title: "Resending...", description: `Resending campaign: ${campaign.title}` })
      
      setTimeout(() => {
        toast({ title: "Campaign Resent Successfully", description: `Campaign "${campaign.title}" has been resent to ${campaign.recipients} recipients successfully.` })
      }, 2000)
    }
  }

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (!template) {
      toast({ title: "Error", description: "Template not found", variant: "destructive" })
      return
    }
    
    // Populate the campaign form with template-specific content
    const templateContent = getTemplateContent(template.type)
    setCampaignForm({
      name: `${template.name} Campaign`,
      type: getCampaignTypeFromTemplate(template.type),
      subject: templateContent.subject,
      message: templateContent.message,
      scheduledDate: "",
      scheduledTime: "",
    })
    
    setShowTemplatesModal(false)
    setShowComposeModal(true)
    toast({ title: "Template Applied", description: `Using template: ${template.name}` })
  }

  const getTemplateContent = (templateType: string) => {
    switch (templateType) {
      case "event-announcement":
        return {
          subject: "New Event Announcement - [Event Name]",
          message: `Dear Members,

We're excited to announce our upcoming event: [Event Name]

Event Details:
- Date: [Event Date]
- Time: [Event Time]
- Location: [Event Location]
- Registration: [Registration Link]

This event will feature [brief description of what attendees can expect].

Please save the date and register early to secure your spot.

Best regards,
Industry Group Team`
        }
      case "newsletter":
        return {
          subject: "Monthly Newsletter - [Month Year]",
          message: `Dear Members,

Welcome to our monthly newsletter for [Month Year].

In this issue:
• [Key Update 1]
• [Key Update 2]
• [Key Update 3]
• [Upcoming Events]

We hope you find this information valuable. If you have any questions or suggestions, please don't hesitate to reach out.

Best regards,
Industry Group Team`
        }
      case "event-reminder":
        return {
          subject: "Reminder: [Event Name] - [Event Date]",
          message: `Dear Members,

This is a friendly reminder about our upcoming event: [Event Name]

Event Details:
- Date: [Event Date]
- Time: [Event Time]
- Location: [Event Location]

If you haven't registered yet, please do so at [Registration Link].

We look forward to seeing you there!

Best regards,
Industry Group Team`
        }
      case "survey":
        return {
          subject: "Member Survey: [Survey Topic]",
          message: `Dear Members,

We value your feedback and would appreciate your participation in our survey about [Survey Topic].

Survey Link: [Survey URL]

This survey will help us better understand your needs and improve our services.

The survey will take approximately [X] minutes to complete.

Thank you for your time and participation.

Best regards,
Industry Group Team`
        }
      default:
        return {
          subject: "Campaign Subject",
          message: "Campaign message content..."
        }
    }
  }

  const getCampaignTypeFromTemplate = (templateType: string) => {
    switch (templateType) {
      case "event-announcement":
      case "event-reminder":
        return "announcement"
      case "newsletter":
        return "newsletter"
      case "survey":
        return "survey"
      default:
        return "email"
    }
  }

  const handleEditTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (!template) {
      toast({ title: "Error", description: "Template not found", variant: "destructive" })
      return
    }
    
    setSelectedTemplate(template)
    setShowTemplateEditorModal(true)
    toast({ title: "Edit Template", description: `Opening editor for: ${template.name}` })
  }

  const handleSendNow = () => {
    if (!campaignForm.name || !campaignForm.subject || !campaignForm.message) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    const isVeMailCampaign = selectedRecipients.some((id) => id === "all-managers" || id === "all-allocators")

    toast({
      title: isVeMailCampaign ? "VeMail Campaign Sent" : "Campaign Sent",
      description: isVeMailCampaign
        ? `VeMail campaign "${campaignForm.name}" has been sent to non-connected recipients!`
        : `Campaign "${campaignForm.name}" has been sent successfully!`
    })

    setCampaignForm({
      name: "",
      type: "",
      subject: "",
      message: "",
      scheduledDate: "",
      scheduledTime: "",
    })
    setSelectedRecipients([])
    setShowComposeModal(false)
  }

  const handleSchedule = () => {
    if (!campaignForm.name || !campaignForm.subject || !campaignForm.message) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    if (!campaignForm.scheduledDate || !campaignForm.scheduledTime) {
      toast({ title: "Missing Schedule Information", description: "Please select a date and time for scheduling", variant: "destructive" })
      return
    }

    toast({ title: "Campaign Scheduled", description: `Campaign "${campaignForm.name}" has been scheduled for ${campaignForm.scheduledDate} at ${campaignForm.scheduledTime}!` })
    
    setCampaignForm({
      name: "",
      type: "",
      subject: "",
      message: "",
      scheduledDate: "",
      scheduledTime: "",
    })
    setSelectedRecipients([])
    setShowComposeModal(false)
  }

  const handleSaveDraft = () => {
    toast({ title: "Draft Saved", description: "Campaign has been saved as draft" })
    setShowComposeModal(false)
  }

  const handleCustomListSubmit = () => {
    if (!customEmails.trim()) {
      toast({ title: "Missing Emails", description: "Please enter email addresses", variant: "destructive" })
      return
    }
    
    const emailList = customEmails.split('\n').filter(email => email.trim())
    if (emailList.length === 0) {
      toast({ title: "Invalid Emails", description: "Please enter valid email addresses", variant: "destructive" })
      return
    }
    
    toast({ title: "Custom List Created", description: `Custom list created with ${emailList.length} email addresses` })
    setShowCustomListModal(false)
    setCustomEmails("")
  }

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      campaign.title.toLowerCase().includes(searchLower) ||
      campaign.subject.toLowerCase().includes(searchLower) ||
      campaign.type.toLowerCase().includes(searchLower) ||
      campaign.status.toLowerCase().includes(searchLower) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  })

  const handleTemplateSave = () => {
    if (!templateForm.name.trim() || !templateForm.content.trim()) {
      toast({ title: "Missing Information", description: "Please fill in template name and content", variant: "destructive" })
      return
    }
    
    toast({ title: "Template Saved", description: `Template "${templateForm.name}" saved successfully` })
    setShowTemplateEditorModal(false)
    setTemplateForm({ name: "", description: "", content: "" })
    setSelectedTemplate(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "newsletter":
        return <FileText className="h-4 w-4" />
      case "survey":
        return <MessageSquare className="h-4 w-4" />
      case "reminder":
        return <Bell className="h-4 w-4" />
      case "announcement":
        return <Megaphone className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const campaignStats = {
    total: campaigns.filter((c) => {
      const campaignYear = new Date(c.sentDate).getFullYear()
      return campaignYear === new Date().getFullYear()
    }).length,
    sent: campaigns.filter((c) => {
      const campaignYear = new Date(c.sentDate).getFullYear()
      return c.status === "sent" && campaignYear === new Date().getFullYear()
    }).length,
    scheduled: campaigns.filter((c) => {
      const campaignYear = new Date(c.sentDate).getFullYear()
      return c.status === "scheduled" && campaignYear === new Date().getFullYear()
    }).length,
    draft: campaigns.filter((c) => {
      const campaignYear = new Date(c.sentDate).getFullYear()
      return c.status === "draft" && campaignYear === new Date().getFullYear()
    }).length,
    totalRecipients: campaigns.filter((c) => {
      const campaignYear = new Date(c.sentDate).getFullYear()
      return campaignYear === new Date().getFullYear()
    }).reduce((sum, c) => sum + c.recipients, 0),
    totalOpened: campaigns.filter((c) => {
      const campaignYear = new Date(c.sentDate).getFullYear()
      return campaignYear === new Date().getFullYear()
    }).reduce((sum, c) => sum + c.opened, 0),
  }

  return (
    <div className="p-6 space-y-6 bg-canvas-bg min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-deep-brand">Communications</h1>
          <p className="text-base-gray mt-1">Manage member communications and campaigns</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleManageTemplates} variant="outline" className="gap-2">
            <Template className="h-4 w-4" />
            Templates
          </Button>
          <Button onClick={handleNewCampaign} className="gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-gray">Total Campaigns YTD</p>
                <p className="text-2xl font-bold text-deep-brand">{campaignStats.total}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-gray">Sent YTD</p>
                <p className="text-2xl font-bold text-green-600">{campaignStats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-gray">Scheduled YTD</p>
                <p className="text-2xl font-bold text-blue-600">{campaignStats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-gray">Total Recipients YTD</p>
                <p className="text-2xl font-bold text-deep-brand">{campaignStats.totalRecipients.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-gray h-4 w-4" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Filters */}
          {showFilters && (
            <Card>
              <CardContent className="p-4">
                {/* <ComprehensiveFilters 
                  onFiltersChange={handleFiltersChange} 
                  initialFilters={filters as any} 
                  showSectors={false}
                  showOrganizationTypes={false}
                  showExperience={false}
                  userType="manager"
                /> */}
                <p className="text-sm text-base-gray">Filters will be added here later.</p>
              </CardContent>
            </Card>
          )}

          {/* Campaigns List */}
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-white shadow-vestira hover:shadow-vestira-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(campaign.type)}
                          <h3 className="text-lg font-semibold text-deep-brand">{campaign.title}</h3>
                        </div>
                        <Badge className={`${getStatusColor(campaign.status)} border-0`}>{campaign.status}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {campaign.type}
                        </Badge>
                      </div>

                      <p className="text-base-gray mb-4">{campaign.subject}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-base-gray">
                          <Users className="h-4 w-4" />
                          <span>{campaign.recipients} recipients</span>
                        </div>
                        {campaign.status === "sent" && (
                          <>
                            <div className="flex items-center gap-2 text-green-600">
                              <Eye className="h-4 w-4" />
                              <span>
                                {campaign.opened} opened ({Math.round((campaign.opened / campaign.recipients) * 100)}%)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>
                                {campaign.clicked} clicked ({Math.round((campaign.clicked / campaign.recipients) * 100)}%)
                              </span>
                            </div>
                          </>
                        )}
                        {campaign.sentDate && (
                          <div className="flex items-center gap-2 text-base-gray">
                            <Clock className="h-4 w-4" />
                            <span>{campaign.sentDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => handleViewCampaign(campaign.id)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      {campaign.status === "draft" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => handleEditCampaign(campaign.id)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      )}
                      {campaign.status === "sent" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => handleResendCampaign(campaign.id)}
                        >
                          <Send className="h-4 w-4" />
                          Resend
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-white shadow-vestira hover:shadow-vestira-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-deep-brand">{template.name}</h3>
                      <p className="text-sm text-base-gray">{template.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          toast({ title: "Template Duplicated", description: `Template "${template.name}" duplicated successfully` })
                        }}>
                          <FileText className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          toast({ title: "Template Exported", description: `Template "${template.name}" exported successfully` })
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
                              toast({ title: "Template Deleted", description: `Template "${template.name}" deleted successfully` })
                            }
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between text-sm text-base-gray">
                    <span>Used {template.usage} times</span>
                    <span>Last used: {template.lastUsed}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Templates Modal */}
      <Dialog open={showTemplatesModal} onOpenChange={setShowTemplatesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Templates</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-white shadow-vestira hover:shadow-vestira-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-deep-brand">{template.name}</h3>
                      <p className="text-sm text-base-gray">{template.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          toast({ title: "Template Duplicated", description: `Template "${template.name}" duplicated successfully` })
                        }}>
                          <FileText className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          toast({ title: "Template Exported", description: `Template "${template.name}" exported successfully` })
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
                              toast({ title: "Template Deleted", description: `Template "${template.name}" deleted successfully` })
                            }
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between text-sm text-base-gray">
                    <span>Used {template.usage} times</span>
                    <span>Last used: {template.lastUsed}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Compose Modal */}
      <Dialog open={showComposeModal} onOpenChange={setShowComposeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compose New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name</label>
                <Input
                  placeholder="Enter campaign name"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Type</label>
                <Select
                  value={campaignForm.type}
                  onValueChange={(value) => setCampaignForm({ ...campaignForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Campaign</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Line</label>
              <Input
                placeholder="Enter email subject"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipients</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {memberGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={group.id}
                      checked={selectedRecipients.includes(group.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecipients([...selectedRecipients, group.id])
                        } else {
                          setSelectedRecipients(selectedRecipients.filter((id) => id !== group.id))
                        }
                      }}
                    />
                    <label htmlFor={group.id} className="text-sm">
                      {group.name} ({group.count})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Enter your message content..."
                value={campaignForm.message}
                onChange={(e) => setCampaignForm({ ...campaignForm, message: e.target.value })}
                rows={8}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Date</label>
                <Input
                  type="date"
                  value={campaignForm.scheduledDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, scheduledDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Time</label>
                <Input
                  type="time"
                  value={campaignForm.scheduledTime}
                  onChange={(e) => setCampaignForm({ ...campaignForm, scheduledTime: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button variant="outline" onClick={handleSchedule}>
                Schedule
              </Button>
              <Button onClick={handleSendNow}>
                Send Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign Details Modal */}
      <Dialog open={showCampaignDetailsModal} onOpenChange={setShowCampaignDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedCampaign.title}</h3>
                <p className="text-base-gray">{selectedCampaign.subject}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Status:</span> {selectedCampaign.status}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {selectedCampaign.type}
                </div>
                <div>
                  <span className="font-medium">Recipients:</span> {selectedCampaign.recipients}
                </div>
                <div>
                  <span className="font-medium">Opened:</span> {selectedCampaign.opened}
                </div>
                <div>
                  <span className="font-medium">Clicked:</span> {selectedCampaign.clicked}
                </div>
                <div>
                  <span className="font-medium">Sent Date:</span> {selectedCampaign.sentDate || "Not sent"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom List Modal */}
      <Dialog open={showCustomListModal} onOpenChange={setShowCustomListModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Custom Email List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Addresses</label>
              <Textarea
                placeholder="Enter email addresses (one per line) or paste from Excel..."
                value={customEmails}
                onChange={(e) => setCustomEmails(e.target.value)}
                rows={8}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCustomListModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCustomListSubmit}>
                Add to Recipients
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Editor Modal */}
      <Dialog open={showTemplateEditorModal} onOpenChange={setShowTemplateEditorModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <Input
                placeholder="Enter template name"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter template description"
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Enter template content..."
                value={templateForm.content}
                onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                rows={12}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowTemplateEditorModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleTemplateSave}>
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
