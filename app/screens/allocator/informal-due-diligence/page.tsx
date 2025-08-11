"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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

interface InformalQuestion {
  id: string
  question: string
  answer?: string
  createdAt: string
  status: "pending" | "answered"
}

interface InformalNote {
  id: string
  content: string
  createdAt: string
}

interface InformalManager {
  id: string
  name: string
  firm: string
  title: string
  email: string
  status: "contacted" | "responding" | "completed"
}

export default function InformalDueDiligencePage() {
  const router = useRouter()
  const [notification, setNotification] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [newQuestion, setNewQuestion] = useState("")
  const [newNote, setNewNote] = useState("")
  
  // Simple state management
  const [questions, setQuestions] = useState<InformalQuestion[]>([])
  const [notes, setNotes] = useState<InformalNote[]>([])
  const [managers, setManagers] = useState<InformalManager[]>([])
  const [sessionCreated, setSessionCreated] = useState("")

  // Load session data on mount
  useEffect(() => {
    try {
      // Try to load existing session
      const sessionData = sessionStorage.getItem('current-informal-session')
      if (sessionData) {
        const session = JSON.parse(sessionData)
        setQuestions(session.questions || [])
        setNotes(session.notes || [])
        setManagers(session.managers || [])
        setSessionCreated(session.createdAt || new Date().toISOString())
      } else {
        // Create new session
        const newSession = {
          id: `informal-${Date.now()}`,
          createdAt: new Date().toISOString(),
          questions: [],
          notes: [],
          managers: []
        }
        sessionStorage.setItem('current-informal-session', JSON.stringify(newSession))
        setSessionCreated(newSession.createdAt)
      }
    } catch (error) {
      console.error("Error loading session:", error)
      // Create new session on error
      const newSession = {
        id: `informal-${Date.now()}`,
        createdAt: new Date().toISOString(),
        questions: [],
        notes: [],
        managers: []
      }
      sessionStorage.setItem('current-informal-session', JSON.stringify(newSession))
      setSessionCreated(newSession.createdAt)
    }
  }, [])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const saveSession = () => {
    try {
      const sessionData = {
        id: `informal-${Date.now()}`,
        createdAt: sessionCreated,
        questions,
        notes,
        managers
      }
      sessionStorage.setItem('current-informal-session', JSON.stringify(sessionData))
      showNotification("Session saved successfully")
    } catch (error) {
      console.error("Error saving session:", error)
      showNotification("Error saving session")
    }
  }

  const addQuestion = () => {
    if (!newQuestion.trim()) return

    const question: InformalQuestion = {
      id: `q-${Date.now()}`,
      question: newQuestion,
      createdAt: new Date().toISOString(),
      status: "pending"
    }

    setQuestions(prev => [...prev, question])
    setNewQuestion("")
    showNotification("Question added")
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const note: InformalNote = {
      id: `n-${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString()
    }

    setNotes(prev => [...prev, note])
    setNewNote("")
    showNotification("Note added")
  }

  const answerQuestion = (questionId: string, answer: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, answer, status: "answered" as const }
          : q
      )
    )
  }

  const completeSession = () => {
    showNotification("Session completed")
    // Navigate back to due diligence hub
    router.push('/screens/allocator/due-diligence-hub')
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Due Diligence Hub
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Informal Due Diligence</h1>
              <p className="text-gray-600">
                Session started {sessionCreated ? new Date(sessionCreated).toLocaleDateString() : 'Just now'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={saveSession}>
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
            <Button onClick={completeSession} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{notes.length}</div>
                <div className="text-sm text-gray-600">Notes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{managers.length}</div>
                <div className="text-sm text-gray-600">Managers</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {questions.filter(q => q.status === "answered").length}
                </div>
                <div className="text-sm text-gray-600">Answered</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questions.slice(-3).map((question) => (
                    <div key={question.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={question.status === "answered" ? "default" : "secondary"}>
                        {question.status}
                      </Badge>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No questions added yet</p>
                    </div>
                  )}
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

                  {/* Questions List */}
                  <div className="space-y-3">
                    {questions.map((question) => (
                      <Card key={question.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{question.question}</p>
                              <Badge variant={question.status === "answered" ? "default" : "secondary"}>
                                {question.status}
                              </Badge>
                            </div>
                            {question.answer && (
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-700">{question.answer}</p>
                              </div>
                            )}
                            {!question.answer && (
                              <div className="flex gap-2">
                                <Textarea
                                  placeholder="Add your answer..."
                                  className="flex-1"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault()
                                      const target = e.target as HTMLTextAreaElement
                                      answerQuestion(question.id, target.value)
                                    }
                                  }}
                                />
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement
                                    answerQuestion(question.id, textarea.value)
                                    textarea.value = ""
                                  }}
                                >
                                  Answer
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {questions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No questions added yet</p>
                        <p className="text-sm mt-1">Add your first question above</p>
                      </div>
                    )}
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
                      className="flex-1"
                    />
                    <Button onClick={addNote}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <Card key={note.id}>
                        <CardContent className="p-4">
                          <p className="text-gray-700">{note.content}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                    {notes.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No notes added yet</p>
                        <p className="text-sm mt-1">Add your first note above</p>
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
  )
}