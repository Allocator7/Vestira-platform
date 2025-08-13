"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  LayoutTemplateIcon as Template,
} from "lucide-react"

export default function IndustryGroupCommunicationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("campaigns")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
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
    toast({
      title: "New Campaign",
      description: "Opening campaign composer",
    })
  }

  const handleManageTemplates = () => {
    setShowTemplatesModal(true)
    toast({
      title: "Templates",
      description: "Opening template manager",
    })
  }



  const handleViewCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    toast({
      title: "Campaign Details",
      description: `Opening detailed view for: ${campaign?.title}`,
    })
    // Simulate opening campaign details view
    setTimeout(() => {
      toast({
        title: "Campaign Details Loaded",
        description: `Showing analytics and recipient data for: ${campaign?.title}`,
      })
    }, 1000)
  }

  const handleEditCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    toast({
      title: "Edit Campaign",
      description: `Opening editor for: ${campaign?.title}`,
    })
  }

  const handleResendCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    toast({
      title: "Campaign Resent",
      description: `Resending: ${campaign?.title}`,
    })
    // Simulate resend process
    setTimeout(() => {
      toast({
        title: "Campaign Resent Successfully",
        description: `Campaign "${campaign?.title}" has been resent to all recipients.`,
      })
    }, 2000)
  }

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    setShowTemplatesModal(false)
    setShowComposeModal(true)
    toast({
      title: "Template Applied",
      description: `Using template: ${template?.name}`,
    })
  }

  const handleEditTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    toast({
      title: "Edit Template",
      description: `Editing template: ${template?.name}`,
    })
  }

  const handleSendNow = () => {
    if (!campaignForm.name || !campaignForm.subject || !campaignForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const isVeMailCampaign = selectedRecipients.some((id) => id === "all-managers" || id === "all-allocators")

    toast({
      title: isVeMailCampaign ? "VeMail Campaign Sent" : "Campaign Sent",
      description: isVeMailCampaign
        ? `VeMail campaign "${campaignForm.name}" has been sent to non-connected recipients!`
        : `Campaign "${campaignForm.name}" has been sent successfully!`,
    })

    // Reset form and close modal
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
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!campaignForm.scheduledDate || !campaignForm.scheduledTime) {
      toast({
        title: "Missing Schedule Information",
        description: "Please select a date and time for scheduling",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Campaign Scheduled",
      description: `Campaign "${campaignForm.name}" has been scheduled for ${campaignForm.scheduledDate} at ${campaignForm.scheduledTime}!`,
    })
    
    // Reset form and close modal
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
    toast({
      title: "Draft Saved",
      description: "Campaign has been saved as draft",
    })
    setShowComposeModal(false)
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
    total: campaigns.length,
    sent: campaigns.filter((c) => c.status === "sent").length,
    scheduled: campaigns.filter((c) => c.status === "scheduled").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    totalRecipients: campaigns.reduce((sum, c) => sum + c.recipients, 0),
    totalOpened: campaigns.reduce((sum, c) => sum + c.opened, 0),
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

          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleManageTemplates}>
            <Template className="h-4 w-4" />
            Templates
          </Button>
          <Button className="gap-2" onClick={handleNewCampaign}>
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-deep-brand">{campaignStats.total}</div>
            <div className="text-sm text-base-gray">Total Campaigns</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{campaignStats.sent}</div>
            <div className="text-sm text-base-gray">Sent</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{campaignStats.scheduled}</div>
            <div className="text-sm text-base-gray">Scheduled</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-electric-blue">{campaignStats.totalRecipients}</div>
            <div className="text-sm text-base-gray">Total Recipients</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-vestira">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {campaignStats.totalOpened > 0
                ? Math.round((campaignStats.totalOpened / campaignStats.totalRecipients) * 100)
                : 0}
              %
            </div>
            <div className="text-sm text-base-gray">Avg Open Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card className="bg-white shadow-vestira">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2 bg-transparent" onClick={() => {
                  toast({
                    title: "Filters",
                    description: "Advanced filtering options will be available here.",
                  })
                }}>
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
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
                                {campaign.clicked} clicked ({Math.round((campaign.clicked / campaign.recipients) * 100)}
                                %)
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white shadow-vestira">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-gray">Average Open Rate</span>
                    <span className="font-semibold">68.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-gray">Average Click Rate</span>
                    <span className="font-semibold">24.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-gray">Unsubscribe Rate</span>
                    <span className="font-semibold">1.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-gray">Bounce Rate</span>
                    <span className="font-semibold">2.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-vestira">
              <CardHeader>
                <CardTitle>Member Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-gray">Highly Engaged</span>
                    <span className="font-semibold text-green-600">342 members</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-gray">Moderately Engaged</span>
                    <span className="font-semibold text-yellow-600">678 members</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-base-gray">Low Engagement</span>
                    <span className="font-semibold text-red-600">430 members</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Templates Modal */}
      <Dialog open={showTemplatesModal} onOpenChange={setShowTemplatesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Templates</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-white shadow-vestira hover:shadow-vestira-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base-gray mb-4">{template.description}</p>
                  <div className="space-y-2 text-sm text-base-gray">
                    <div>Last used: {template.lastUsed}</div>
                    <div>Used {template.usage} times</div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "Template Options",
                        description: `Additional options for template: ${template.name}`,
                      })
                    }}>
                      <MoreHorizontal className="h-4 w-4" />
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-list"
                    checked={selectedRecipients.includes("custom-list")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRecipients([...selectedRecipients, "custom-list"])
                        toast({
                          title: "Custom List",
                          description: "You can add emails manually or upload an Excel file with email addresses.",
                        })
                      } else {
                        setSelectedRecipients(selectedRecipients.filter((id) => id !== "custom-list"))
                      }
                    }}
                  />
                  <label htmlFor="custom-list" className="text-sm">
                    Custom List
                  </label>
                </div>
              </div>
              {selectedRecipients.includes("custom-list") && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Add custom email addresses:</p>
                  <Textarea
                    placeholder="Enter email addresses (one per line) or paste from Excel"
                    rows={4}
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Excel File
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* VeMail Mass Messaging Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5" />
                VeMail Mass Messaging Options
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setCampaignForm({
                      ...campaignForm,
                      name: "Manager Promotion Campaign",
                      type: "announcement",
                    })
                    setSelectedRecipients(["all-managers"])
                  }}
                >
                  <Briefcase className="h-6 w-6" />
                  <span>Promote to All Managers</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setCampaignForm({
                      ...campaignForm,
                      name: "Allocator Promotion Campaign",
                      type: "announcement",
                    })
                    setSelectedRecipients(["all-allocators"])
                  }}
                >
                  <TrendingUp className="h-6 w-6" />
                  <span>Promote to All Allocators</span>
                </Button>
              </div>

              <Button
                className="w-full h-16 flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  setCampaignForm({
                    ...campaignForm,
                    name: "Universal Promotion Campaign",
                    type: "announcement",
                  })
                  setSelectedRecipients(["all-managers", "all-allocators"])
                }}
              >
                <Megaphone className="h-6 w-6" />
                <span className="text-lg">Promote to All Managers & Allocators</span>
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Enter your message..."
                rows={8}
                value={campaignForm.message}
                onChange={(e) => setCampaignForm({ ...campaignForm, message: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Date</label>
                <Input
                  type="date"
                  value={campaignForm.scheduledDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, scheduledDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
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

            <div className="flex gap-3">
              <Button className="gap-2" onClick={handleSendNow}>
                <Send className="h-4 w-4" />
                Send Now
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={handleSchedule}>
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
