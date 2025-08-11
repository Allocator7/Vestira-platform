"use client"

import { useState, useEffect } from "react"
import { Screen } from "@/components/Screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  MessageSquare, 
  Calendar, 
  User, 
  Save,
  Send,
  Clock,
  CheckCircle,
  Search,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"

interface InformalSession {
  id: string
  type: "informal"
  createdAt: string
  status: "active" | "completed" | "archived"
  questions: InformalQuestion[]
  notes: InformalNote[]
  managers: InformalManager[]
  allocator: string
  title?: string
  description?: string
}

interface InformalQuestion {
  id: string
  question: string
  answer?: string
  category: string
  createdAt: string
  status: "pending" | "answered" | "follow_up"
  type: "text" | "multiple_choice" | "yes_no"
  options?: string[] // For multiple choice questions
}

interface InformalNote {
  id: string
  content: string
  managerId?: string
  createdAt: string
  type: "general" | "question" | "observation"
}

interface InformalManager {
  id: string
  name: string
  firm: string
  title: string
  email: string
  status: "contacted" | "responding" | "completed"
  lastContact?: string
}

export default function InformalDueDiligencePage() {
  const router = useRouter()
  const [notification, setNotification] = useState("")
  const [currentSession, setCurrentSession] = useState<InformalSession | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [newQuestion, setNewQuestion] = useState("")
  const [newQuestionType, setNewQuestionType] = useState<"text" | "multiple_choice" | "yes_no">("text")
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(["", ""])
  const [newNote, setNewNote] = useState("")
  const [selectedManager, setSelectedManager] = useState<string>("")
  const [showManagerModal, setShowManagerModal] = useState(false)
  const [managerSearchQuery, setManagerSearchQuery] = useState("")

  // Real manager data from the system
  const availableManagers = [
    {
      id: "1",
      name: "Growth Capital Partners",
      contactPerson: "David Rodriguez",
      contactTitle: "Managing Partner",
      firm: "Growth Capital Partners",
      firmType: "Private Equity",
      location: "San Francisco, CA",
      aum: "$2.5B",
      experience: "18 years",
      email: "david.rodriguez@growthcapital.com",
      avatar: "/managers/david-rodriguez.jpg"
    },
    {
      id: "2", 
      name: "Sustainable Equity Fund",
      contactPerson: "Sarah Chen",
      contactTitle: "Portfolio Manager",
      firm: "Sustainable Equity Fund",
      firmType: "Hedge Fund",
      location: "New York, NY",
      aum: "$1.2B",
      experience: "12 years",
      email: "sarah.chen@sustainableequity.com",
      avatar: "/managers/sarah-chen.jpg"
    },
    {
      id: "3",
      name: "Infrastructure Capital",
      contactPerson: "Michael Thompson",
      contactTitle: "Senior Managing Director",
      firm: "Infrastructure Capital",
      firmType: "Infrastructure",
      location: "London, UK",
      aum: "$3.8B",
      experience: "22 years",
      email: "michael.thompson@infrastructurecapital.com",
      avatar: "/managers/michael-thompson.jpg"
    },
    {
      id: "4",
      name: "Venture Dynamics",
      contactPerson: "Jennifer Park",
      contactTitle: "Founding Partner",
      firm: "Venture Dynamics",
      firmType: "Venture Capital",
      location: "Palo Alto, CA",
      aum: "$800M",
      experience: "15 years",
      email: "jennifer.park@venturedynamics.com",
      avatar: "/managers/jennifer-park.jpg"
    },
    {
      id: "5",
      name: "Fixed Income Strategies",
      contactPerson: "Robert Wilson",
      contactTitle: "Chief Investment Officer",
      firm: "Fixed Income Strategies",
      firmType: "Credit",
      location: "Chicago, IL",
      aum: "$4.2B",
      experience: "20 years",
      email: "robert.wilson@fixedincome.com",
      avatar: "/managers/robert-wilson.jpg"
    }
  ]

  // Load current session on mount
  useEffect(() => {
    const loadCurrentSession = () => {
      try {
        const sessionData = sessionStorage.getItem('current-informal-session')
        if (sessionData) {
          const session = JSON.parse(sessionData)
          setCurrentSession(session)
        } else {
          // Create new session if none exists
          createNewSession()
        }
      } catch (error) {
        console.error("Error loading session:", error)
        createNewSession()
      }
    }

    loadCurrentSession()
  }, [])

  const createNewSession = () => {
    const newSession: InformalSession = {
      id: `informal-${Date.now()}`,
      type: "informal",
      createdAt: new Date().toISOString(),
      status: "active",
      questions: [],
      notes: [],
      managers: [],
      allocator: "Current User",
      title: "New Informal Due Diligence",
      description: "Informal due diligence session"
    }
    
    setCurrentSession(newSession)
    sessionStorage.setItem('current-informal-session', JSON.stringify(newSession))
    
    // Save to localStorage
    const existingSessions = JSON.parse(localStorage.getItem('informal-dd-sessions') || '[]')
    existingSessions.push(newSession)
    localStorage.setItem('informal-dd-sessions', JSON.stringify(existingSessions))
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const saveSession = () => {
    if (currentSession) {
      try {
        // Update sessionStorage
        sessionStorage.setItem('current-informal-session', JSON.stringify(currentSession))
        
        // Update localStorage
        const existingSessions = JSON.parse(localStorage.getItem('informal-dd-sessions') || '[]')
        const updatedSessions = existingSessions.map((session: InformalSession) => 
          session.id === currentSession.id ? currentSession : session
        )
        localStorage.setItem('informal-dd-sessions', JSON.stringify(updatedSessions))
        
        showNotification("Session saved successfully")
      } catch (error) {
        console.error("Error saving session:", error)
        showNotification("Error saving session")
      }
    }
  }

  const addQuestion = () => {
    if (!newQuestion.trim() || !currentSession) return

    const question: InformalQuestion = {
      id: `q-${Date.now()}`,
      question: newQuestion,
      category: "General",
      createdAt: new Date().toISOString(),
      status: "pending",
      type: newQuestionType,
      options: newQuestionType === "multiple_choice" ? newQuestionOptions.filter(opt => opt.trim()) : undefined
    }

    const updatedSession = {
      ...currentSession,
      questions: [...currentSession.questions, question]
    }

    setCurrentSession(updatedSession)
    setNewQuestion("")
    setNewQuestionType("text")
    setNewQuestionOptions(["", ""])
    saveSession()
    showNotification("Question added")
  }

  const addNote = () => {
    if (!newNote.trim() || !currentSession) return

    const note: InformalNote = {
      id: `n-${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString(),
      type: "general"
    }

    const updatedSession = {
      ...currentSession,
      notes: [...currentSession.notes, note]
    }

    setCurrentSession(updatedSession)
    setNewNote("")
    saveSession()
    showNotification("Note added")
  }

  const answerQuestion = (questionId: string, answer: string) => {
    if (!currentSession) return

    const updatedQuestions = currentSession.questions.map(q =>
      q.id === questionId ? { ...q, answer, status: "answered" as const } : q
    )

    const updatedSession = {
      ...currentSession,
      questions: updatedQuestions
    }

    setCurrentSession(updatedSession)
    saveSession()
  }

  const addManager = () => {
    setShowManagerModal(true)
  }

  const selectManager = (manager: any) => {
    if (!currentSession) return

    // Check if manager is already added
    const isAlreadyAdded = currentSession.managers.some(m => m.id === manager.id)
    if (isAlreadyAdded) {
      showNotification("Manager already added to session")
      return
    }

    const informalManager: InformalManager = {
      id: manager.id,
      name: manager.contactPerson,
      firm: manager.firm,
      title: manager.contactTitle,
      email: manager.email,
      status: "contacted"
    }

    const updatedSession = {
      ...currentSession,
      managers: [...currentSession.managers, informalManager]
    }

    setCurrentSession(updatedSession)
    saveSession()
    setShowManagerModal(false)
    setManagerSearchQuery("")
    showNotification(`${manager.contactPerson} from ${manager.firm} added to session`)
  }

  const removeManager = (managerId: string) => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      managers: currentSession.managers.filter(m => m.id !== managerId)
    }

    setCurrentSession(updatedSession)
    saveSession()
    showNotification("Manager removed from session")
  }

  const updateManagerStatus = (managerId: string, status: InformalManager['status']) => {
    if (!currentSession) return

    const updatedManagers = currentSession.managers.map(m =>
      m.id === managerId ? { ...m, status, lastContact: new Date().toISOString() } : m
    )

    const updatedSession = {
      ...currentSession,
      managers: updatedManagers
    }

    setCurrentSession(updatedSession)
    saveSession()
  }

  const completeSession = () => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      status: "completed" as const
    }

    setCurrentSession(updatedSession)
    saveSession()
    showNotification("Session completed")
  }

  if (!currentSession) {
    return (
      <Screen>
        <div className="container mx-auto py-6 px-4">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-electric-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading session...</p>
          </div>
        </div>
      </Screen>
    )
  }

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
                Back to Due Diligence Hub
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-deepBrand">Informal Due Diligence</h1>
                <p className="text-baseGray">Session started {new Date(currentSession.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={saveSession}>
                <Save className="h-4 w-4 mr-2" />
                Save Session
              </Button>
              <Button onClick={completeSession} className="bg-electric-blue hover:bg-electric-blue/90">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Session
              </Button>
            </div>
          </div>

          {/* Session Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Session Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{currentSession.questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{currentSession.notes.length}</div>
                  <div className="text-sm text-gray-600">Notes</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{currentSession.managers.length}</div>
                  <div className="text-sm text-gray-600">Managers</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentSession.questions.filter(q => q.status === "answered").length}
                  </div>
                  <div className="text-sm text-gray-600">Answered</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="managers">Managers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentSession.questions.slice(-3).map((question) => (
                      <div key={question.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium">{question.question}</p>
                          <p className="text-sm text-gray-500">{question.category}</p>
                        </div>
                        <Badge className={question.status === "answered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {question.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add Question */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a new question..."
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                        />
                        <Button onClick={addQuestion}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      
                      {/* Question Type Selector */}
                      <div className="flex items-center gap-4">
                        <Label className="text-sm font-medium">Question Type:</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={newQuestionType === "text" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewQuestionType("text")}
                          >
                            Text
                          </Button>
                          <Button
                            variant={newQuestionType === "multiple_choice" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewQuestionType("multiple_choice")}
                          >
                            Multiple Choice
                          </Button>
                          <Button
                            variant={newQuestionType === "yes_no" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewQuestionType("yes_no")}
                          >
                            Yes/No
                          </Button>
                        </div>
                      </div>

                      {/* Multiple Choice Options */}
                      {newQuestionType === "multiple_choice" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Options:</Label>
                          {newQuestionOptions.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...newQuestionOptions]
                                  newOptions[index] = e.target.value
                                  setNewQuestionOptions(newOptions)
                                }}
                              />
                              {newQuestionOptions.length > 2 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setNewQuestionOptions(newQuestionOptions.filter((_, i) => i !== index))
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewQuestionOptions([...newQuestionOptions, ""])}
                          >
                            Add Option
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Questions List */}
                    <div className="space-y-3">
                      {currentSession.questions.map((question) => (
                        <Card key={question.id}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{question.question}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {question.type === "text" ? "Text" : question.type === "multiple_choice" ? "Multiple Choice" : "Yes/No"}
                                    </Badge>
                                    {question.options && question.options.length > 0 && (
                                      <span className="text-xs text-gray-500">
                                        {question.options.length} options
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Badge className={question.status === "answered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                  {question.status}
                                </Badge>
                              </div>
                              {question.answer && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-700">{question.answer}</p>
                                </div>
                              )}
                              {question.status === "pending" && (
                                <div className="space-y-2">
                                  {question.type === "text" && (
                                    <div className="flex gap-2">
                                      <Textarea
                                        placeholder="Add your answer..."
                                        rows={2}
                                        onChange={(e) => answerQuestion(question.id, e.target.value)}
                                      />
                                      <Button size="sm" onClick={() => answerQuestion(question.id, "Answered")}>
                                        Save
                                      </Button>
                                    </div>
                                  )}
                                  
                                  {question.type === "multiple_choice" && question.options && (
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Select an option:</Label>
                                      <div className="space-y-2">
                                        {question.options.map((option, index) => (
                                          <Button
                                            key={index}
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => answerQuestion(question.id, option)}
                                          >
                                            {option}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {question.type === "yes_no" && (
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => answerQuestion(question.id, "Yes")}
                                      >
                                        Yes
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => answerQuestion(question.id, "No")}
                                      >
                                        No
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add Note */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a new note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={addNote}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3">
                      {currentSession.notes.map((note) => (
                        <Card key={note.id}>
                          <CardContent className="p-4">
                            <p className="text-gray-700">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(note.createdAt).toLocaleString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="managers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Managers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={addManager}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Manager
                    </Button>

                    <div className="space-y-3">
                      {currentSession.managers.map((manager) => (
                        <Card key={manager.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <img src={manager.avatar} alt={manager.name} />
                                  <AvatarFallback>{manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{manager.name}</p>
                                  <p className="text-sm text-gray-600">{manager.firm} • {manager.title}</p>
                                  <p className="text-sm text-gray-500">{manager.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  manager.status === "completed" ? "bg-green-100 text-green-800" :
                                  manager.status === "responding" ? "bg-blue-100 text-blue-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }>
                                  {manager.status}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateManagerStatus(manager.id, "responding")}
                                >
                                  Update Status
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeManager(manager.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {currentSession.managers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No managers added yet</p>
                          <p className="text-xs mt-1">Click "Add Manager" to select managers from your network</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Manager Selection Modal */}
      {showManagerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add Manager to Session</h3>
                <p className="text-sm text-gray-600">Select a manager from your network to add to this informal due diligence session</p>
              </div>
              <Button variant="outline" onClick={() => setShowManagerModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search managers..."
                  value={managerSearchQuery}
                  onChange={(e) => setManagerSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Manager List */}
              <div className="space-y-3">
                {availableManagers
                  .filter(manager => 
                    manager.contactPerson.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
                    manager.firm.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
                    manager.firmType.toLowerCase().includes(managerSearchQuery.toLowerCase())
                  )
                  .map((manager) => {
                    const isAdded = currentSession?.managers.some(m => m.id === manager.id)
                    return (
                      <Card key={manager.id} className={`${isAdded ? 'bg-green-50 border-green-200' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <img src={manager.avatar} alt={manager.contactPerson} />
                                <AvatarFallback>{manager.contactPerson.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-gray-900">{manager.contactPerson}</h4>
                                <p className="text-sm text-gray-600">{manager.contactTitle} • {manager.firm}</p>
                                <p className="text-xs text-gray-500">{manager.location} • {manager.aum} AUM</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{manager.firmType}</Badge>
                              {isAdded ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeManager(manager.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => selectManager(manager)}
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowManagerModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}