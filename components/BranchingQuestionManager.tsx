"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Plus, MessageSquare, CheckCircle, AlertTriangle, Clock, X, Send } from "lucide-react"

interface ResponseBankEntry {
  id: string
  question: string
  answer: string
  tags: string[]
  questionType: string
  section: string
  createdAt: string
  updatedAt: string
  firmId: string
  firmName: string
  similarity?: number
}

// Simple semantic similarity check (in production, use proper NLP)
const calculateSimilarity = (question1: string, question2: string): number => {
  const words1 = question1.toLowerCase().split(/\s+/)
  const words2 = question2.toLowerCase().split(/\s+/)
  const intersection = words1.filter((word) => words2.includes(word))
  const union = [...new Set([...words1, ...words2])]
  return intersection.length / union.length
}

const findSimilarResponses = (question: string, responseBank: ResponseBankEntry[]): ResponseBankEntry[] => {
  return responseBank
    .map((entry) => ({
      ...entry,
      similarity: calculateSimilarity(question, entry.question),
    }))
    .filter((entry) => entry.similarity > 0.3) // 30% similarity threshold
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
    .slice(0, 3) // Top 3 suggestions
}

interface BranchedQuestion {
  id: string
  parentQuestionId: string
  question: string
  type: "short_text" | "long_text" | "multiple_choice" | "yes_no" | "currency"
  options?: string[]
  answer?: string
  status: "pending" | "answered" | "clarification_needed"
  createdBy: string
  createdAt: string
  answeredAt?: string
  reasoning: string
}

interface Question {
  id: string
  section: string
  question: string
  answer?: string
  type: string
  required: boolean
  answeredAt?: string
  branches?: BranchedQuestion[]
}

interface BranchingQuestionManagerProps {
  parentQuestion: any
  branches: BranchedQuestion[]
  onUpdateBranches: (branches: BranchedQuestion[]) => void
  userRole: "allocator" | "manager" | "consultant"
  currentUser: string
}

export function BranchingQuestionManager({
  parentQuestion,
  branches,
  onUpdateBranches,
  userRole,
  currentUser,
}: BranchingQuestionManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBranchQuestion, setNewBranchQuestion] = useState({
    question: "",
    type: "long_text" as const,
    reasoning: "",
    options: [""],
  })

  const handleAddBranchQuestion = () => {
    if (!newBranchQuestion.question.trim() || !newBranchQuestion.reasoning.trim()) {
      return
    }

    const newBranch: BranchedQuestion = {
      id: `branch-${Date.now()}`,
      parentQuestionId: parentQuestion.id,
      question: newBranchQuestion.question,
      type: newBranchQuestion.type,
      options:
        newBranchQuestion.type === "multiple_choice"
          ? newBranchQuestion.options.filter((opt) => opt.trim())
          : undefined,
      status: "pending",
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
      reasoning: newBranchQuestion.reasoning,
    }

    onUpdateBranches([...branches, newBranch])
    setNewBranchQuestion({
      question: "",
      type: "long_text",
      reasoning: "",
      options: [""],
    })
    setShowAddForm(false)
  }

  const handleAnswerBranch = (branchId: string, answer: string) => {
    const updatedBranches = branches.map((branch) =>
      branch.id === branchId
        ? {
            ...branch,
            answer,
            status: "answered" as const,
            answeredAt: new Date().toISOString(),
          }
        : branch,
    )
    onUpdateBranches(updatedBranches)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "answered":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Answered
          </Badge>
        )
      case "clarification_needed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Clarification Needed
          </Badge>
        )
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const canAddQuestions = userRole === "allocator" || userRole === "consultant"
  const canAnswerQuestions = userRole === "manager"

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h6 className="text-base font-medium text-gray-900">Follow-up Questions</h6>
          {branches.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {branches.length}
            </Badge>
          )}
        </div>
        {canAddQuestions && (
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)} className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Question
          </Button>
        )}
      </div>

      {/* Add New Branch Question Form */}
      {showAddForm && canAddQuestions && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="branch-question" className="text-sm font-medium text-gray-700">
                  Follow-up Question *
                </Label>
                <Textarea
                  id="branch-question"
                  placeholder="Enter your follow-up question..."
                  value={newBranchQuestion.question}
                  onChange={(e) => setNewBranchQuestion({ ...newBranchQuestion, question: e.target.value })}
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="branch-reasoning" className="text-sm font-medium text-gray-700">
                  Reasoning *
                </Label>
                <Textarea
                  id="branch-reasoning"
                  placeholder="Explain why this follow-up question is needed..."
                  value={newBranchQuestion.reasoning}
                  onChange={(e) => setNewBranchQuestion({ ...newBranchQuestion, reasoning: e.target.value })}
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="branch-type" className="text-sm font-medium text-gray-700">
                  Response Type
                </Label>
                <Select
                  value={newBranchQuestion.type}
                  onValueChange={(value: any) => setNewBranchQuestion({ ...newBranchQuestion, type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short_text">Short Text</SelectItem>
                    <SelectItem value="long_text">Long Text</SelectItem>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="yes_no">Yes/No</SelectItem>
                    <SelectItem value="currency">Currency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newBranchQuestion.type === "multiple_choice" && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Options</Label>
                  <div className="space-y-2 mt-1">
                    {newBranchQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newBranchQuestion.options]
                            newOptions[index] = e.target.value
                            setNewBranchQuestion({ ...newBranchQuestion, options: newOptions })
                          }}
                        />
                        {index > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = newBranchQuestion.options.filter((_, i) => i !== index)
                              setNewBranchQuestion({ ...newBranchQuestion, options: newOptions })
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNewBranchQuestion({
                          ...newBranchQuestion,
                          options: [...newBranchQuestion.options, ""],
                        })
                      }
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewBranchQuestion({
                      question: "",
                      type: "long_text",
                      reasoning: "",
                      options: [""],
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddBranchQuestion}>
                  <Send className="h-3 w-3 mr-1" />
                  Add Question
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Branch Questions */}
      <div className="space-y-4">
        {branches.map((branch) => (
          <Card key={branch.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(branch.status)}
                    <span className="text-xs text-gray-500">
                      by {branch.createdBy} • {new Date(branch.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2">{branch.question}</p>
                  <p className="text-xs text-gray-600 mb-3">
                    <strong>Reasoning:</strong> {branch.reasoning}
                  </p>
                </div>
              </div>

              {/* Answer Section */}
              {canAnswerQuestions && branch.status === "pending" && (
                <div className="border-t pt-3">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Your Response *</Label>
                  {branch.type === "long_text" ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Enter your response or 'N/A' if not applicable..."
                        rows={3}
                        onChange={(e) => {
                          // Store the value temporarily - you might want to implement a debounced save
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const textarea = document.querySelector(`textarea`) as HTMLTextAreaElement
                          if (textarea?.value.trim()) {
                            handleAnswerBranch(branch.id, textarea.value)
                          }
                        }}
                      >
                        Submit Answer
                      </Button>
                    </div>
                  ) : branch.type === "yes_no" ? (
                    <RadioGroup onValueChange={(value) => handleAnswerBranch(branch.id, value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id={`${branch.id}-yes`} />
                        <Label htmlFor={`${branch.id}-yes`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id={`${branch.id}-no`} />
                        <Label htmlFor={`${branch.id}-no`}>No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="N/A" id={`${branch.id}-na`} />
                        <Label htmlFor={`${branch.id}-na`}>N/A</Label>
                      </div>
                    </RadioGroup>
                  ) : branch.type === "multiple_choice" && branch.options ? (
                    <Select onValueChange={(value) => handleAnswerBranch(branch.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option or N/A..." />
                      </SelectTrigger>
                      <SelectContent>
                        {branch.options.map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter your response or 'N/A' if not applicable..."
                        onChange={(e) => {
                          // Store the value temporarily
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector(`input`) as HTMLInputElement
                          if (input?.value.trim()) {
                            handleAnswerBranch(branch.id, input.value)
                          }
                        }}
                      >
                        Submit Answer
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Display Answer if Answered */}
              {branch.status === "answered" && branch.answer && (
                <div className="border-t pt-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-green-800">Manager Response</span>
                      {branch.answeredAt && (
                        <span className="text-xs text-green-600">
                          {new Date(branch.answeredAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-green-900">{branch.answer}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {branches.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No follow-up questions yet</p>
            {canAddQuestions && <p className="text-xs mt-1">Click "Add Question" to ask for clarification</p>}
          </div>
        )}
      </div>
    </div>
  )
}
