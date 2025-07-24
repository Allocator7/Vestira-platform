"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Phone, Mail, FileText, Video, Search, ExternalLink, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    priority: "Medium",
    description: "",
  })
  const { toast } = useToast()

  const handleContactSupport = (method: string) => {
    switch (method) {
      case "chat":
        // Open chat widget
        toast({
          title: "Starting Live Chat",
          description: "Connecting you with a support agent...",
        })
        // In real implementation, this would open a chat widget
        window.open("https://help.vestira.com/chat", "_blank")
        break
      case "email":
        window.open("mailto:support@vestira.com?subject=Support Request")
        break
      case "phone":
        window.open("tel:+15551234567")
        break
    }
  }

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Support Ticket Submitted",
      description: "Your ticket has been submitted successfully. We'll get back to you within 4 hours.",
    })

    // Reset form
    setTicketForm({
      subject: "",
      priority: "Medium",
      description: "",
    })
    setIsSubmitting(false)
  }

  const handleResourceClick = (resource: string) => {
    const resourceUrls = {
      "Getting Started Guide": "/docs/getting-started",
      "User Manual": "/docs/user-manual",
      "API Documentation": "/docs/api",
      "Platform Overview": "/tutorials/platform-overview",
      "Document Management": "/tutorials/document-management",
      "Data Room Setup": "/tutorials/data-room-setup",
    }

    const url = resourceUrls[resource as keyof typeof resourceUrls]
    if (url) {
      window.open(url, "_blank")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Searching...",
        description: `Searching for "${searchQuery}"`,
      })
      // In real implementation, this would filter results
      window.open(`/help/search?q=${encodeURIComponent(searchQuery)}`, "_blank")
    }
  }

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking the 'Forgot Password' link on the login page, or by going to Account Settings > Security Settings > Change Password.",
    },
    {
      question: "How do I upload documents to a data room?",
      answer:
        "Navigate to the specific data room, click the 'Upload' button, select your files, and they will be automatically organized based on your folder structure.",
    },
    {
      question: "How do I invite team members?",
      answer:
        "Go to Team Management in your account settings, click 'Invite Member', enter their email address and select their role permissions.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "We support PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, and most common image formats. Files are automatically converted for optimal viewing.",
    },
    {
      question: "How do I set up two-factor authentication?",
      answer:
        "Go to Account Settings > Security Settings and toggle on Two-Factor Authentication. Follow the setup wizard to configure your preferred method.",
    },
  ]

  const supportChannels = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7",
      action: "Start Chat",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 4 hours",
      action: "Send Email",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call Now",
    },
  ]

  return (
    <div className="container max-w-6xl mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-4">Help & Support</h1>
        <p className="text-lg text-baseGray">Get the help you need to make the most of Vestira</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-baseGray" />
              <Input
                placeholder="Search for help articles, guides, or FAQs..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="support" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="support">Get Support</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="text-center">
                  <channel.icon className="h-12 w-12 mx-auto mb-4 text-electric-blue" />
                  <CardTitle>{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="secondary" className="mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    {channel.availability}
                  </Badge>
                  <Button
                    className="w-full bg-electric-blue hover:bg-electric-blue/90"
                    onClick={() => handleContactSupport(channel.title.toLowerCase().replace(" ", ""))}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>Can't find what you're looking for? Submit a detailed support request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Please provide as much detail as possible about your issue..."
                    rows={4}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="bg-electric-blue hover:bg-electric-blue/90" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-baseGray">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation
                </CardTitle>
                <CardDescription>Comprehensive guides and documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => handleResourceClick("Getting Started Guide")}
                >
                  Getting Started Guide
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
                  User Manual
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
                  API Documentation
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
                <CardDescription>Step-by-step video guides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-between">
                  Platform Overview
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
                  Document Management
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
                  Data Room Setup
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Get in touch with our team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-electric-blue" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-baseGray">support@vestira.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-electric-blue" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-baseGray">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-electric-blue" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-baseGray">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system status and uptime</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Platform Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Document Processing</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <Button variant="outline" className="w-full">
                  View Status Page
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
