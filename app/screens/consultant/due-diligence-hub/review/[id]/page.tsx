"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, CheckCircle, AlertCircle, MessageSquare, Calendar, Download, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

// Mock DDQ data
const mockDDQData = {
  id: "ddq-001",
  title: "BlackRock Capital Due Diligence Questionnaire",
  allocator: {
    name: "State Pension Fund",
    contact: "Jennifer Walsh",
    email: "j.walsh@statepension.gov",
    avatar: "/abstract-profile.png",
  },
  manager: {
    name: "BlackRock Capital",
    contact: "Michael Chen",
    email: "m.chen@blackrock.com",
    avatar: "/abstract-geometric-br.png",
  },
  status: "In Review",
  progress: 75,
  createdDate: "2024-06-15",
  dueDate: "2024-07-15",
  lastUpdated: "2024-07-08",
  totalQuestions: 45,
  completedQuestions: 34,
  questionsWithComments: 8,
  clarificationsNeeded: 3,
  sections: [
    {
      id: "firm-overview",
      title: "Firm Overview",
      questions: 12,
      completed: 12,
      status: "completed",
    },
    {
      id: "investment-strategy",
      title: "Investment Strategy",
      questions: 15,
      completed: 13,
      status: "in-progress",
    },
    {
      id: "risk-management",
      title: "Risk Management",
      questions: 10,
      completed: 6,
      status: "in-progress",
    },
    {
      id: "operations",
      title: "Operations & Compliance",
      questions: 8,
      completed: 3,
      status: "pending",
    },
  ],
  questions: [
    {
      id: "q1",
      section: "Firm Overview",
      question: "Please provide a detailed overview of your firm's history and organizational structure.",
      answer:
        "BlackRock Capital was founded in 1988 and has grown to become one of the world's largest asset managers. Our organizational structure includes multiple business divisions focusing on different asset classes and client segments...",
      status: "completed",
      required: true,
      answeredBy: "Michael Chen",
      answeredDate: "2024-06-20",
      reviewerComments: [
        {
          id: "c1",
          reviewer: "Jennifer Walsh",
          comment: "Please provide more details about the recent organizational changes mentioned.",
          date: "2024-06-22",
          status: "open",
        },
      ],
    },
    {
      id: "q2",
      section: "Investment Strategy",
      question: "Describe your investment philosophy and approach to portfolio construction.",
      answer:
        "Our investment philosophy is built on fundamental research and long-term value creation. We employ a disciplined approach to portfolio construction that emphasizes diversification, risk management, and alpha generation...",
      status: "under-review",
      required: true,
      answeredBy: "Sarah Johnson",
      answeredDate: "2024-06-25",
      reviewerComments: [
        {
          id: "c2",
          reviewer: "Jennifer Walsh",
          comment: "Can you provide specific examples of how this philosophy has been applied in recent investments?",
          date: "2024-06-26",
          status: "open",
        },
        {
          id: "c3",
          reviewer: "David Kim",
          comment: "The risk management section needs more quantitative details.",
          date: "2024-06-27",
          status: "open",
        },
      ],
    },
    {
      id: "q3",
      section: "Risk Management",
      question: "What risk management systems and processes do you have in place?",
      answer: "",
      status: "pending",
      required: true,
      answeredBy: null,
      answeredDate: null,
      reviewerComments: [],
    },
  ],
}

export default function ConsultantDDQReview() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [ddqData, setDDQData] = useState(mockDDQData)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [messageRecipient, setMessageRecipient] = useState("both")
  const [messageSubject, setMessageSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")

  const handleSendMessage = () => {
    if (!messageSubject || !messageContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Message Sent",
      description: `Message sent to ${messageRecipient === "both" ? "both parties" : messageRecipient}`,
    })

    setMessageModalOpen(false)
    setMessageSubject("")
    setMessageContent("")
  }

  const handleScheduleMeeting = () => {
    if (!meetingTitle || !meetingDate || !meetingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Meeting Scheduled",
      description: `Meeting "${meetingTitle}" scheduled for ${meetingDate} at ${meetingTime}`,
    })

    setMeetingModalOpen(false)
    setMeetingTitle("")
    setMeetingDate("")
    setMeetingTime("")
  }

  const handleExportDDQ = () => {
    toast({
      title: "Export Started",
      description: "DDQ export is being prepared. You'll receive a download link shortly.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
      case "under-review":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
      case "under-review":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Due Diligence Hub
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-[#3B0A45]">{ddqData.title}</h1>
              <p className="text-sm text-gray-600">
                {ddqData.allocator.name} → {ddqData.manager.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setMessageModalOpen(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Parties
            </Button>
            <Button variant="outline" onClick={() => setMeetingModalOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Check-in
            </Button>
            <Button variant="outline" onClick={handleExportDDQ}>
              <Download className="h-4 w-4 mr-2" />
              Export DDQ
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{ddqData.progress}%</span>
                </div>
                <Progress value={ddqData.progress} className="h-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3B0A45]">{ddqData.completedQuestions}</div>
                <div className="text-sm text-gray-600">of {ddqData.totalQuestions} completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{ddqData.questionsWithComments}</div>
                <div className="text-sm text-gray-600">with comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{ddqData.clarificationsNeeded}</div>
                <div className="text-sm text-gray-600">need clarification</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions & Answers</TabsTrigger>
            <TabsTrigger value="comments">Comments & Clarifications</TabsTrigger>
            <TabsTrigger value="summary">Review Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Created</span>
                    <span className="text-sm font-medium">{ddqData.createdDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm font-medium">{ddqData.lastUpdated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Due Date</span>
                    <span className="text-sm font-medium text-red-600">{ddqData.dueDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Parties */}
              <Card>
                <CardHeader>
                  <CardTitle>Parties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <img src={ddqData.allocator.avatar || "/placeholder.svg"} alt={ddqData.allocator.name} />
                    </Avatar>
                    <div>
                      <div className="font-medium">{ddqData.allocator.name}</div>
                      <div className="text-sm text-gray-600">{ddqData.allocator.contact}</div>
                      <Badge variant="outline">Allocator</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <img src={ddqData.manager.avatar || "/placeholder.svg"} alt={ddqData.manager.name} />
                    </Avatar>
                    <div>
                      <div className="font-medium">{ddqData.manager.name}</div>
                      <div className="text-sm text-gray-600">{ddqData.manager.contact}</div>
                      <Badge variant="outline">Manager</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Section Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ddqData.sections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(section.status)}
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-sm text-gray-600">
                            {section.completed} of {section.questions} questions completed
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={(section.completed / section.questions) * 100} className="w-24 h-2" />
                        <Badge className={getStatusColor(section.status)}>{section.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="space-y-6">
              {ddqData.questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{question.section}</Badge>
                          <Badge className={getStatusColor(question.status)}>{question.status}</Badge>
                          {question.required && <Badge variant="destructive">Required</Badge>}
                        </div>
                        <h3 className="text-lg font-medium">{question.question}</h3>
                      </div>
                      {getStatusIcon(question.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {question.answer ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Answer:</span>
                          <div className="text-sm text-gray-600">
                            By {question.answeredBy} on {question.answeredDate}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{question.answer}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">This question has not been answered yet.</p>
                      </div>
                    )}

                    {question.reviewerComments.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Reviewer Comments:</span>
                        {question.reviewerComments.map((comment) => (
                          <div key={comment.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{comment.reviewer}</span>
                              <span className="text-xs text-gray-600">{comment.date}</span>
                            </div>
                            <p className="text-sm">{comment.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Comments & Clarifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ddqData.questions
                    .filter((q) => q.reviewerComments.length > 0)
                    .map((question) =>
                      question.reviewerComments.map((comment) => (
                        <div key={comment.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="space-y-1">
                              <div className="font-medium">{comment.reviewer}</div>
                              <div className="text-sm text-gray-600">Re: {question.question.substring(0, 60)}...</div>
                            </div>
                            <div className="text-xs text-gray-600">{comment.date}</div>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
                          <div className="mt-2">
                            <Badge variant="outline">{question.section}</Badge>
                          </div>
                        </div>
                      )),
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completion Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Completed Questions</span>
                      <span className="font-medium">
                        {ddqData.completedQuestions}/{ddqData.totalQuestions}
                      </span>
                    </div>
                    <Progress value={(ddqData.completedQuestions / ddqData.totalQuestions) * 100} />
                  </div>
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Questions with Comments</span>
                      <span className="font-medium text-yellow-600">{ddqData.questionsWithComments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clarifications Needed</span>
                      <span className="font-medium text-red-600">{ddqData.clarificationsNeeded}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ddqData.clarificationsNeeded > 0 && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Address {ddqData.clarificationsNeeded} clarifications</span>
                      </div>
                    )}
                    {ddqData.completedQuestions < ddqData.totalQuestions && (
                      <div className="flex items-center space-x-2 text-yellow-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          Complete {ddqData.totalQuestions - ddqData.completedQuestions} remaining questions
                        </span>
                      </div>
                    )}
                    {ddqData.questionsWithComments > 0 && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">Review {ddqData.questionsWithComments} comments</span>
                      </div>
                    )}
                    {ddqData.progress === 100 && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">DDQ is complete and ready for final review</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Modal */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Send to</Label>
              <select
                id="recipient"
                value={messageRecipient}
                onChange={(e) => setMessageRecipient(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="both">Both Parties</option>
                <option value="allocator">Allocator Only</option>
                <option value="manager">Manager Only</option>
              </select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Modal */}
      <Dialog open={meetingModalOpen} onOpenChange={setMeetingModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Check-in Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="e.g., DDQ Review Check-in"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="meeting-time">Time</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetingModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
