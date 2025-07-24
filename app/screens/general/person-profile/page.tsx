"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Share2,
  Calendar,
  Edit,
  Send,
  Copy,
  CheckCircle2,
  Download,
  ExternalLink,
} from "lucide-react"

export default function PersonalProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profileId = searchParams.get("id") || "current-user"
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Modal states
  const [showSendMessage, setShowSendMessage] = useState(false)
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false)
  const [showShareProfile, setShowShareProfile] = useState(false)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)

  // Form states
  const [messageSubject, setMessageSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messagePriority, setMessagePriority] = useState("normal")
  const [isMessageLoading, setIsMessageLoading] = useState(false)

  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [meetingDuration, setMeetingDuration] = useState("60")
  const [meetingType, setMeetingType] = useState("video")
  const [meetingAgenda, setMeetingAgenda] = useState("")
  const [isMeetingLoading, setIsMeetingLoading] = useState(false)

  const [shareEmail, setShareEmail] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  const [isShareLoading, setIsShareLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Mock profile data - in a real app, this would come from an API
  const profile = {
    id: profileId,
    name: "Sarah Johnson",
    title: "Investment Director",
    organization: "State Teachers Pension",
    location: "Boston, MA",
    email: "sarah.j@stpension.gov",
    phone: "+1 (617) 555-0123",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    yearsExperience: 15,
    aum: "$45B",
    bio: "Sarah Johnson is an Investment Director at State Teachers Pension with over 15 years of experience in institutional investment management. She specializes in alternative investments with a focus on private equity and real assets.",
    expertise: ["Private Equity", "Real Assets", "ESG Integration", "Manager Selection", "Portfolio Construction"],
    education: [
      {
        degree: "MBA, Finance",
        institution: "Harvard Business School",
        year: "2008",
      },
      {
        degree: "BS, Economics",
        institution: "University of Pennsylvania",
        year: "2003",
      },
    ],
    experience: [
      {
        role: "Investment Director",
        company: "State Teachers Pension",
        period: "2015 - Present",
        description: "Lead alternative investments team managing $12B in private markets allocations.",
      },
      {
        role: "Senior Investment Manager",
        company: "Global Investments Ltd",
        period: "2010 - 2015",
        description:
          "Managed private equity portfolio with $3B in commitments across buyout, growth, and venture strategies.",
      },
      {
        role: "Investment Analyst",
        company: "Capital Partners",
        period: "2003 - 2010",
        description: "Conducted due diligence on investment managers across multiple asset classes.",
      },
    ],
    recentActivity: [
      {
        type: "document",
        title: "Q2 2025 Investment Committee Presentation",
        date: "June 15, 2025",
        actionable: true,
      },
      {
        type: "meeting",
        title: "Annual Portfolio Review with Wellington Management",
        date: "May 28, 2025",
        actionable: false,
      },
      {
        type: "dataroom",
        title: "Accessed Blackstone Infrastructure Partners III Data Room",
        date: "May 12, 2025",
        actionable: true,
      },
    ],
    sharedDocuments: [
      {
        id: "doc1",
        title: "Investment Policy Statement",
        type: "PDF",
        size: "1.2 MB",
        date: "April 10, 2025",
        description: "Comprehensive investment policy outlining strategic asset allocation and risk parameters.",
      },
      {
        id: "doc2",
        title: "ESG Integration Framework",
        type: "PPTX",
        size: "3.5 MB",
        date: "March 22, 2025",
        description:
          "Framework for integrating environmental, social, and governance factors into investment decisions.",
      },
      {
        id: "doc3",
        title: "Manager Selection Criteria",
        type: "DOCX",
        size: "845 KB",
        date: "February 15, 2025",
        description: "Detailed criteria and process for selecting investment managers across asset classes.",
      },
    ],
  }

  // Add this after the profileId declaration
  const isOwnProfile = profileId === "current-user" // In a real app, this would compare with actual user ID

  // Initialize share message
  useState(() => {
    setShareMessage(`I wanted to share ${profile.name}'s profile with you.`)
  })

  const handleEditProfile = () => {
    router.push("/screens/general/edit-profile")
  }

  const handleSendMessage = async () => {
    if (!messageSubject.trim() || !messageContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      })
      return
    }

    setIsMessageLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${profile.name}.`,
    })

    setIsMessageLoading(false)
    setMessageSubject("")
    setMessageContent("")
    setMessagePriority("normal")
    setShowSendMessage(false)
  }

  const handleScheduleMeeting = async () => {
    if (!meetingTitle.trim() || !meetingDate || !meetingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, date, and time fields.",
        variant: "destructive",
      })
      return
    }

    setIsMeetingLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Meeting Scheduled",
      description: `Meeting with ${profile.name} has been scheduled for ${meetingDate} at ${meetingTime}.`,
    })

    setIsMeetingLoading(false)
    setMeetingTitle("")
    setMeetingDate("")
    setMeetingTime("")
    setMeetingDuration("60")
    setMeetingType("video")
    setMeetingAgenda("")
    setShowScheduleMeeting(false)
  }

  const handleCopyLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/screens/general/person-profile?id=${profileId}`
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast({
        title: "Link Copied",
        description: "Profile link has been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = async () => {
    if (!shareEmail.trim()) {
      toast({
        title: "Missing Email",
        description: "Please enter an email address.",
        variant: "destructive",
      })
      return
    }

    setIsShareLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Profile Shared",
      description: `${profile.name}'s profile has been shared with ${shareEmail}.`,
    })

    setIsShareLoading(false)
    setShareEmail("")
    setShareMessage(`I wanted to share ${profile.name}'s profile with you.`)
    setShowShareProfile(false)
  }

  const handleViewLinkedIn = () => {
    window.open(profile.linkedin, "_blank")
  }

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document)
    setShowDocumentViewer(true)
  }

  const handleDownloadDocument = async (document: any) => {
    try {
      // Simulate file content based on document type
      let content = ""
      let mimeType = "text/plain"
      let extension = ".txt"

      switch (document.type.toLowerCase()) {
        case "pdf":
          content = `${document.title}\n\n${document.description}\n\nThis is a sample PDF document from ${profile.name}.\n\nDocument Details:\n- Type: ${document.type}\n- Size: ${document.size}\n- Date: ${document.date}\n\nContent would normally contain the full document data.`
          mimeType = "application/pdf"
          extension = ".pdf"
          break
        case "pptx":
          content = `PRESENTATION\n\n${document.title}\n\n${document.description}\n\nPresentation created by: ${profile.name}\nDate: ${document.date}\nSize: ${document.size}\n\nThis presentation contains detailed information about ${document.title.toLowerCase()}.\n\nSlides would include:\n1. Overview\n2. Key Points\n3. Implementation\n4. Conclusion`
          mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          extension = ".pptx"
          break
        case "docx":
          content = `DOCUMENT\n\n${document.title}\n\n${document.description}\n\nAuthor: ${profile.name}\nDate: ${document.date}\nSize: ${document.size}\n\nThis document provides comprehensive information about ${document.title.toLowerCase()}.\n\nSections include:\n- Introduction\n- Methodology\n- Analysis\n- Recommendations\n- Appendices`
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          extension = ".docx"
          break
        default:
          content = `${document.title}\n\n${document.description}\n\nDocument Type: ${document.type}\nSize: ${document.size}\nDate: ${document.date}\n\nThis document contains important information shared by ${profile.name}.`
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${document.title.replace(/[^a-z0-9]/gi, "_")}${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download Started",
        description: `Downloading ${document.title}...`,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: `Failed to download ${document.title}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleActivityAction = (activity: any) => {
    if (activity.actionable) {
      if (activity.type === "document") {
        toast({
          title: "Opening Document",
          description: `Opening ${activity.title}...`,
        })
      } else if (activity.type === "dataroom") {
        toast({
          title: "Accessing Data Room",
          description: `Redirecting to ${activity.title}...`,
        })
      }
    }
  }

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/screens/general/person-profile?id=${profileId}`

  return (
    <div className="min-h-screen bg-canvas-bg">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-full bg-deep-brand flex items-center justify-center text-white text-2xl font-semibold">
                      {profile.name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-deep-brand mb-1">{profile.name}</h1>
                    <p className="text-lg text-base-gray mb-1">{profile.title}</p>
                    <p className="text-lg text-base-gray mb-4">{profile.organization}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-base-gray">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center text-base-gray">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center text-base-gray">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{profile.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    {isOwnProfile && (
                      <Button onClick={handleEditProfile} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setShowShareProfile(true)}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowScheduleMeeting(true)}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-base-gray mb-1">Years Experience</p>
                  <p className="text-2xl font-bold text-deep-brand">{profile.yearsExperience}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-base-gray mb-1">AUM</p>
                  <p className="text-2xl font-bold text-deep-brand">{profile.aum}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-base-gray mb-1">Current Organization</p>
                  <p className="text-lg font-medium text-deep-brand">{profile.organization}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Content */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b px-6 pt-6">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                      <TabsTrigger value="documents">Shared Documents</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    <TabsContent value="overview" className="mt-0">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold mb-3 text-deep-brand">About</h2>
                          <p className="text-base-gray leading-relaxed">{profile.bio}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-deep-brand">Areas of Expertise</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.expertise.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-deep-brand">Education</h3>
                          <div className="space-y-3">
                            {profile.education.map((edu, index) => (
                              <div key={index} className="border-l-2 border-electric-blue pl-4">
                                <p className="font-medium text-deep-brand">{edu.degree}</p>
                                <p className="text-base-gray">
                                  {edu.institution}, {edu.year}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="experience" className="mt-0">
                      <div>
                        <h2 className="text-xl font-semibold mb-6 text-deep-brand">Professional Experience</h2>
                        <div className="space-y-6">
                          {profile.experience.map((exp, index) => (
                            <div key={index} className="border-l-2 border-electric-blue pl-6 relative">
                              <div className="absolute w-3 h-3 bg-electric-blue rounded-full -left-[7px] top-1"></div>
                              <h3 className="text-lg font-medium text-deep-brand">{exp.role}</h3>
                              <p className="text-base-gray font-medium">{exp.company}</p>
                              <p className="text-base-gray text-sm mb-2">{exp.period}</p>
                              <p className="text-base-gray leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-0">
                      <div>
                        <h2 className="text-xl font-semibold mb-6 text-deep-brand">Recent Activity</h2>
                        <div className="space-y-3">
                          {profile.recentActivity.map((activity, index) => (
                            <div
                              key={index}
                              className="flex items-start justify-between p-4 hover:bg-canvas-bg rounded-lg border border-gray-100"
                            >
                              <div className="flex items-start">
                                <div className="h-10 w-10 rounded-full bg-electric-blue/10 flex items-center justify-center mr-4 flex-shrink-0">
                                  {activity.type === "document" && <Mail className="h-5 w-5 text-electric-blue" />}
                                  {activity.type === "meeting" && <Calendar className="h-5 w-5 text-electric-blue" />}
                                  {activity.type === "dataroom" && <Share2 className="h-5 w-5 text-electric-blue" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-deep-brand">{activity.title}</p>
                                  <p className="text-sm text-base-gray">{activity.date}</p>
                                </div>
                              </div>
                              {activity.actionable && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleActivityAction(activity)}
                                  className="ml-4 flex-shrink-0"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="mt-0">
                      <div>
                        <h2 className="text-xl font-semibold mb-6 text-deep-brand">Shared Documents</h2>
                        <div className="space-y-3">
                          {profile.sharedDocuments.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 hover:bg-canvas-bg rounded-lg border border-gray-100"
                            >
                              <div className="flex items-center min-w-0 flex-1">
                                <div className="h-10 w-10 rounded bg-electric-blue/10 flex items-center justify-center mr-4 flex-shrink-0">
                                  <span className="text-xs font-medium text-electric-blue">{doc.type}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-deep-brand truncate">{doc.title}</p>
                                  <p className="text-sm text-base-gray">
                                    {doc.size} • {doc.date}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4 flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                  View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-deep-brand">
                  {isOwnProfile ? "Profile Actions" : `Connect with ${profile.name.split(" ")[0]}`}
                </h2>
                <div className="space-y-3">
                  {isOwnProfile ? (
                    <>
                      <Button className="w-full" onClick={handleEditProfile}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setShowShareProfile(true)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share My Profile
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full" onClick={() => setShowSendMessage(true)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" onClick={handleViewLinkedIn}>
                        <Linkedin className="h-4 w-4" />
                        View LinkedIn
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-deep-brand">Focus Areas</h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-deep-brand mb-2">Asset Classes</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">Private Equity</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">Real Assets</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">Infrastructure</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-deep-brand mb-2">Investment Strategies</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">ESG Integration</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">Impact Investing</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-deep-brand mb-2">Sectors</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">Technology</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">Healthcare</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">Renewable Energy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Send Message Modal */}
      <Dialog open={showSendMessage} onOpenChange={setShowSendMessage}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Message
            </DialogTitle>
            <DialogDescription>
              Send a message to {profile.name} ({profile.email})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" value={`${profile.name} <${profile.email}>`} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={messagePriority} onValueChange={setMessagePriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter message subject..."
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendMessage(false)} disabled={isMessageLoading}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={isMessageLoading}>
              {isMessageLoading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog open={showScheduleMeeting} onOpenChange={setShowScheduleMeeting}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Meeting
            </DialogTitle>
            <DialogDescription>Schedule a meeting with {profile.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                placeholder="e.g., Investment Discussion"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Select value={meetingDuration} onValueChange={setMeetingDuration}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select value={meetingType} onValueChange={setMeetingType}>
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

            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda (Optional)</Label>
              <Textarea
                id="agenda"
                placeholder="Meeting agenda or topics to discuss..."
                value={meetingAgenda}
                onChange={(e) => setMeetingAgenda(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleMeeting(false)} disabled={isMeetingLoading}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting} disabled={isMeetingLoading}>
              {isMeetingLoading ? (
                "Scheduling..."
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Profile Modal */}
      <Dialog open={showShareProfile} onOpenChange={setShowShareProfile}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Profile
            </DialogTitle>
            <DialogDescription>Share {profile.name}'s profile with others</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Copy Link Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Profile Link</Label>
              <div className="flex gap-2">
                <Input value={profileUrl} readOnly className="flex-1" />
                <Button variant="outline" onClick={handleCopyLink} className="shrink-0 bg-transparent">
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Email Share Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Share via Email</Label>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address..."
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shareMessage">Message (Optional)</Label>
                  <Textarea
                    id="shareMessage"
                    placeholder="Add a personal message..."
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareProfile(false)} disabled={isShareLoading}>
              Cancel
            </Button>
            <Button onClick={handleEmailShare} disabled={isShareLoading}>
              {isShareLoading ? (
                "Sharing..."
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={showDocumentViewer} onOpenChange={setShowDocumentViewer}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {selectedDocument?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedDocument?.type} • {selectedDocument?.size} • {selectedDocument?.date}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Document Description</h3>
              <p className="text-sm text-gray-600">{selectedDocument?.description}</p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="font-medium mb-2">Document Preview</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>This is a preview of the document content.</p>
                <p>In a real application, this would show the actual document content or a PDF viewer.</p>
                <p>Document Type: {selectedDocument?.type}</p>
                <p>File Size: {selectedDocument?.size}</p>
                <p>Last Modified: {selectedDocument?.date}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentViewer(false)}>
              Close
            </Button>
            <Button onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
