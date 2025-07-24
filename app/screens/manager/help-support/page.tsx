"use client"

import type React from "react"

import { useState } from "react"
import Screen from "@/components/Screen"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Phone, Mail, MessageSquare, PlayCircle, HelpCircle, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ManagerHelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false)

  const handleScheduleSession = () => {
    setIsSchedulingModalOpen(true)
  }

  const handleReadArticle = (articleTitle: string) => {
    const articleUrls = {
      "Getting Started with Vestira for Managers": "/docs/manager-getting-started",
      "Best Practices for Responding to Due Diligence": "/docs/ddq-response-best-practices",
      "Creating Effective Data Rooms": "/docs/data-room-creation",
      "Showcasing Your Performance Data": "/docs/performance-presentation",
      "Building Allocator Relationships Through Vestira": "/docs/allocator-engagement",
    }

    const url =
      articleUrls[articleTitle as keyof typeof articleUrls] ||
      `/docs/${articleTitle.toLowerCase().replace(/\s+/g, "-")}`
    window.open(url, "_blank")

    toast({
      title: "Opening Article",
      description: `Opening "${articleTitle}"`,
    })
  }

  const handleWatchVideo = (videoTitle: string) => {
    const videoUrls = {
      "Platform Overview for Managers": "/videos/manager-platform-overview",
      "Setting Up Your Firm Profile": "/videos/firm-profile-setup",
      "Managing Due Diligence Efficiently": "/videos/ddq-management",
      "Data Room Best Practices": "/videos/data-room-best-practices",
    }

    const url =
      videoUrls[videoTitle as keyof typeof videoUrls] || `/videos/${videoTitle.toLowerCase().replace(/\s+/g, "-")}`
    window.open(url, "_blank")

    toast({
      title: "Opening Video",
      description: `Opening "${videoTitle}" tutorial`,
    })
  }

  const handleContactSupport = (method: string) => {
    switch (method) {
      case "phone":
        window.open("tel:+18885550123")
        break
      case "email":
        window.open("mailto:support@vestira.com?subject=Support Request from Manager")
        break
      case "chat":
        toast({
          title: "Starting Live Chat",
          description: "Connecting you with a support agent...",
        })
        break
    }
  }

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Support Ticket Submitted",
      description: "Your support ticket has been submitted successfully. We'll get back to you within 24 hours.",
    })

    setIsSubmitting(false)
    const form = e.target as HTMLFormElement
    form.reset()
  }

  const faqCategories = [
    {
      id: "account",
      title: "Account & Settings",
      faqs: [
        {
          question: "How do I update my firm's profile information?",
          answer:
            "You can update your firm's profile by navigating to Account Settings. Click on your profile icon in the top right corner, select 'Account Settings', and then navigate to the 'Firm Profile' tab. Here you can update your firm's name, logo, address, and other details.",
        },
        {
          question: "How do I change my password?",
          answer:
            "To change your password, go to Account Settings by clicking on your profile icon in the top right corner. Select the 'Security' tab and click on 'Change Password'. You'll need to enter your current password and then your new password twice to confirm.",
        },
        {
          question: "Can I add team members to my firm's account?",
          answer:
            "Yes, you can add team members to your firm's account. Go to Account Settings > Team Members and click on 'Invite Team Member'. Enter their email address and select their role and permissions. They will receive an email invitation to join your firm's account.",
        },
        {
          question: "How do I set up two-factor authentication?",
          answer:
            "To set up two-factor authentication, go to Account Settings > Security and click on 'Enable Two-Factor Authentication'. Follow the on-screen instructions to set up using either an authenticator app or SMS verification.",
        },
      ],
    },
    {
      id: "allocators",
      title: "Allocator Engagement & Outreach",
      faqs: [
        {
          question: "How do I search for allocators?",
          answer:
            "You can search for allocators by using the Allocator Search feature. Navigate to the 'Allocator Search' section from the main menu. Here you can use various filters such as allocator type, AUM, geographic location, and investment focus to find allocators that match your target profile.",
        },
        {
          question: "How do I respond to a due diligence questionnaire?",
          answer:
            "When an allocator sends you a due diligence questionnaire, you'll receive a notification. Navigate to the Due Diligence Hub to view all pending questionnaires. Click on the questionnaire to open it, fill in your responses, attach any requested documents, and click 'Submit' when complete.",
        },
        {
          question: "Can I save responses to common due diligence questions?",
          answer:
            "Yes, you can save responses to common due diligence questions in your Response Library. Go to Due Diligence Hub > Response Library and click 'Add Response'. You can categorize responses and easily insert them when answering questionnaires, saving time and ensuring consistency.",
        },
        {
          question: "How do I track my engagement with allocators?",
          answer:
            "You can track all allocator engagement in the Clients section. This provides a comprehensive view of your interactions with each allocator, including meetings, document requests, due diligence status, and communication history.",
        },
      ],
    },
    {
      id: "data",
      title: "Data Rooms & Document Management",
      faqs: [
        {
          question: "How do I create a data room for an allocator?",
          answer:
            "To create a data room, go to the Data Rooms section and click 'Create New Data Room'. Name your data room, select the allocators who should have access, and set permissions. You can then upload documents and organize them into folders.",
        },
        {
          question: "How do I control who can access specific documents?",
          answer:
            "When uploading documents to a data room, you can set access permissions for each document or folder. Options include allowing access to all invited allocators or restricting access to specific allocators. You can also set time-limited access and disable download capabilities if needed.",
        },
        {
          question: "Can I see when allocators view my documents?",
          answer:
            "Yes, you can track document activity. Each data room includes an Activity Log that shows when documents were viewed, downloaded, or shared. You can also generate reports on document engagement to understand which materials are receiving the most attention.",
        },
        {
          question: "How do I update documents while maintaining version history?",
          answer:
            "When you need to update a document, use the 'Upload New Version' option rather than deleting and uploading a new file. This maintains the document's access settings and creates a version history that both you and allocators can reference.",
        },
      ],
    },
    {
      id: "insights",
      title: "Analytics & Reporting",
      faqs: [
        {
          question: "How do I upload my performance data?",
          answer:
            "To upload performance data, go to the Insights section and select 'Performance Data'. Click 'Upload Data' and either use our template or map your existing data format. You can upload historical data and set up regular updates manually or through our API integration.",
        },
        {
          question: "Can I control which allocators see my performance data?",
          answer:
            "Yes, you have full control over who sees your performance data. In the Insights section, go to 'Data Permissions' to set visibility settings for each allocator relationship. You can share different levels of detail with different allocators based on your relationship stage.",
        },
        {
          question: "How do I create custom presentations for allocators?",
          answer:
            "To create a custom presentation, go to Insights > Presentations and click 'Create New'. Select the data, charts, and information you want to include, customize the layout and branding, and generate a professional presentation that can be shared directly through Vestira or exported as a PDF.",
        },
        {
          question: "What analytics are available about allocator engagement?",
          answer:
            "The Allocator Insights dashboard provides comprehensive analytics on how allocators are engaging with your firm. This includes document views, time spent reviewing materials, frequently accessed information, and comparison to anonymized peer engagement metrics.",
        },
      ],
    },
  ]

  const popularArticles = [
    {
      title: "Getting Started with Vestira for Managers",
      description: "A comprehensive guide to setting up your account and showcasing your firm",
      category: "Getting Started",
      readTime: "5 min read",
    },
    {
      title: "Best Practices for Responding to Due Diligence",
      description: "Learn how to efficiently respond to allocator due diligence requests",
      category: "Due Diligence",
      readTime: "7 min read",
    },
    {
      title: "Creating Effective Data Rooms",
      description: "How to organize and secure your documents for allocator review",
      category: "Data Rooms",
      readTime: "6 min read",
    },
    {
      title: "Showcasing Your Performance Data",
      description: "Tips for presenting performance metrics that resonate with allocators",
      category: "Analytics",
      readTime: "4 min read",
    },
    {
      title: "Building Allocator Relationships Through Vestira",
      description: "Strategies for effective digital engagement with allocators",
      category: "Engagement",
      readTime: "5 min read",
    },
  ]

  const videoTutorials = [
    {
      title: "Platform Overview for Managers",
      description: "A quick tour of the Vestira platform for investment managers",
      duration: "4:45",
    },
    {
      title: "Setting Up Your Firm Profile",
      description: "How to create an impressive digital presence for allocators",
      duration: "5:20",
    },
    {
      title: "Managing Due Diligence Efficiently",
      description: "Streamline your DDQ response process with Vestira's tools",
      duration: "7:15",
    },
    {
      title: "Data Room Best Practices",
      description: "Organize and secure your documents for maximum impact",
      duration: "6:30",
    },
  ]

  const filteredFAQs = faqCategories
    .map((category) => {
      const filteredQuestions = category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      return {
        ...category,
        faqs: filteredQuestions,
      }
    })
    .filter((category) => category.faqs.length > 0)

  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-deepBrand mb-2">Help & Support</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions, browse our knowledge base, or contact our support team for assistance.
            </p>
          </div>

          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help topics..."
                className="pl-10 border-2 focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:border-electric-blue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100">
              <TabsTrigger
                value="faq"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
              >
                FAQs
              </TabsTrigger>
              <TabsTrigger
                value="articles"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
              >
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
              >
                Video Tutorials
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
              >
                Contact Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-0">
              {searchQuery && filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No FAQs found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search terms or browse all categories below.</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <>
                  {filteredFAQs.map((category) => (
                    <div key={category.id} className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
                      <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm">
                        {category.faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`${category.id}-${index}`}>
                            <AccordionTrigger className="px-4 hover:no-underline">
                              <span className="text-left">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <p className="text-gray-700">{faq.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>

            <TabsContent value="articles" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {popularArticles.map((article, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {article.category}
                        </Badge>
                      </div>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 p-0"
                        onClick={() => handleReadArticle(article.title)}
                      >
                        Read article <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline">View All Articles</Button>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {videoTutorials.map((video, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-blue-600 opacity-80" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>{video.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 p-0"
                        onClick={() => handleWatchVideo(video.title)}
                      >
                        Watch video <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline">View All Videos</Button>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="mr-4 bg-blue-50 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle>Phone Support</CardTitle>
                    </div>
                    <CardDescription>Speak directly with our support team during business hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-lg">+1 (888) 555-0123</p>
                    <p className="text-sm text-gray-500">Monday - Friday, 9am - 5pm ET</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-electric-blue hover:bg-electric-blue/90"
                      onClick={() => handleContactSupport("phone")}
                    >
                      Call Support
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="mr-4 bg-blue-50 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle>Email Support</CardTitle>
                    </div>
                    <CardDescription>Send us an email and we'll respond within 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-lg">support@vestira.com</p>
                    <p className="text-sm text-gray-500">24/7 email support</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-electric-blue hover:bg-electric-blue/90"
                      onClick={() => handleContactSupport("email")}
                    >
                      Email Support
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="mr-4 bg-blue-50 p-3 rounded-full">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle>Live Chat</CardTitle>
                    </div>
                    <CardDescription>Begin a chat with our support team in real-time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-lg">Available Now</p>
                    <p className="text-sm text-gray-500">Typical response time: 2 minutes</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-electric-blue hover:bg-electric-blue/90"
                      onClick={() => handleContactSupport("chat")}
                    >
                      Start Chat
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                  <CardDescription>
                    Fill out the form below to submit a support ticket and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmitTicket}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input id="email" name="email" type="email" placeholder="Your email" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input id="subject" name="subject" placeholder="Brief description of your issue" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="account">Account & Settings</option>
                        <option value="allocators">Allocator Engagement & Outreach</option>
                        <option value="data">Data Rooms & Document Management</option>
                        <option value="insights">Analytics & Reporting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Please describe your issue in detail"
                        required
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="attachments" className="text-sm font-medium">
                        Attachments (optional)
                      </label>
                      <Input id="attachments" name="attachments" type="file" multiple />
                      <p className="text-xs text-gray-500">
                        You can attach screenshots or documents to help us understand your issue better.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-electric-blue hover:bg-electric-blue/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-start">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src="/support-agent.png" alt="Support Agent" />
                <AvatarFallback>VS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium mb-1">Need personalized help?</h3>
                <p className="text-gray-600 mb-4">
                  Our dedicated client success team is available to provide personalized guidance on optimizing your
                  presence on Vestira. Schedule a one-on-one session with your account manager.
                </p>
                <Button variant="outline" onClick={handleScheduleSession}>
                  Schedule a Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Scheduling Modal */}
      {isSchedulingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Schedule a Session</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                toast({
                  title: "Session Scheduled",
                  description: "Your one-on-one session has been scheduled. You'll receive a calendar invite shortly.",
                })
                setIsSchedulingModalOpen(false)
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <Input type="date" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2" required>
                    <option value="">Select a time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Session Type</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2" required>
                    <option value="">Select session type</option>
                    <option value="platform-optimization">Platform Optimization</option>
                    <option value="allocator-engagement">Allocator Engagement Strategies</option>
                    <option value="data-room-setup">Data Room Setup & Best Practices</option>
                    <option value="performance-presentation">Performance Presentation Training</option>
                    <option value="general-consultation">General Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Additional Notes (Optional)</label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    rows={3}
                    placeholder="Any specific topics you'd like to discuss..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSchedulingModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-electric-blue hover:bg-electric-blue/90">
                  Schedule Session
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Screen>
  )
}
