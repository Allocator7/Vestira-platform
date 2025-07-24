"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { TagManager } from "@/components/TagManager"
import { useResponseBank, type ResponseBankEntry, type ResponseBankFilters } from "@/hooks/useResponseBank"
import { useDocumentTags } from "@/hooks/useDocumentTags"
import { Search, Filter, Plus, Edit, Trash2, Copy, Tag, FileText, TrendingUp, Database } from "lucide-react"

interface ResponseBankManagerProps {
  onSelectResponse?: (response: ResponseBankEntry) => void
  showActions?: boolean
  compact?: boolean
}

export function ResponseBankManager({
  onSelectResponse,
  showActions = true,
  compact = false,
}: ResponseBankManagerProps) {
  const { responseBank, searchResponses, addResponse, updateResponse, deleteResponse, getResponseStats } =
    useResponseBank()

  const { tags: responseTags, selectedTags, addTag, removeTag, createTag } = useDocumentTags()

  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ResponseBankFilters>({})
  const [editingResponse, setEditingResponse] = useState<ResponseBankEntry | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [newResponse, setNewResponse] = useState({
    question: "",
    answer: "",
    tags: [] as string[],
    questionType: "long_text",
    section: "General",
    firmId: "current-firm",
    firmName: "Current Firm",
  })

  const filteredResponses = searchResponses(searchQuery, filters)
  const stats = getResponseStats()

  const handleAddResponse = () => {
    if (newResponse.question.trim() && newResponse.answer.trim()) {
      addResponse(newResponse)
      setNewResponse({
        question: "",
        answer: "",
        tags: [],
        questionType: "long_text",
        section: "General",
        firmId: "current-firm",
        firmName: "Current Firm",
      })
      setShowAddForm(false)
    }
  }

  const handleUpdateResponse = () => {
    if (editingResponse) {
      updateResponse(editingResponse.id, editingResponse)
      setEditingResponse(null)
    }
  }

  const handleCopyResponse = (response: ResponseBankEntry) => {
    navigator.clipboard.writeText(response.answer)
    // Show toast notification in production
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search response bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <TagManager
                  tags={responseTags}
                  selectedTags={filters.tags || []}
                  onTagSelect={(tagId) =>
                    setFilters((prev) => ({
                      ...prev,
                      tags: [...(prev.tags || []), tagId],
                    }))
                  }
                  onTagRemove={(tagId) =>
                    setFilters((prev) => ({
                      ...prev,
                      tags: (prev.tags || []).filter((id) => id !== tagId),
                    }))
                  }
                  compact={true}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredResponses.map((response) => (
            <Card
              key={response.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectResponse?.(response)}
            >
              <CardContent className="p-3">
                <p className="text-sm font-medium mb-1">{response.question}</p>
                <p className="text-xs text-gray-600 mb-2">{response.answer.substring(0, 100)}...</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {response.tags.slice(0, 2).map((tagId) => {
                      const tag = responseTags.find((t) => t.id === tagId)
                      return tag ? (
                        <Badge
                          key={tagId}
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: tag.color, color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ) : null
                    })}
                    {response.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{response.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(response.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-deepBrand">{stats.totalResponses}</p>
              </div>
              <Database className="h-6 w-6 text-deepBrand" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Used Tag</p>
                <p className="text-lg font-semibold text-deepBrand">
                  {stats.mostUsedTags[0]
                    ? responseTags.find((t) => t.id === stats.mostUsedTags[0][0])?.name || "N/A"
                    : "N/A"}
                </p>
              </div>
              <Tag className="h-6 w-6 text-deepBrand" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Section</p>
                <p className="text-lg font-semibold text-deepBrand">{stats.mostActiveSection || "N/A"}</p>
              </div>
              <FileText className="h-6 w-6 text-deepBrand" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth</p>
                <p className="text-lg font-semibold text-green-600">+12%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions, answers, or sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              {showActions && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Response
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={filters.section || ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, section: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="">All Sections</option>
                    <option value="Organization & Management">Organization & Management</option>
                    <option value="Investment Strategy">Investment Strategy</option>
                    <option value="Risk Management">Risk Management</option>
                    <option value="ESG & Compliance">ESG & Compliance</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                  <select
                    value={filters.questionType || ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, questionType: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="long_text">Long Text</option>
                    <option value="short_text">Short Text</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="yes_no">Yes/No</option>
                    <option value="currency">Currency</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <TagManager
                    tags={responseTags}
                    selectedTags={filters.tags || []}
                    onTagSelect={(tagId) =>
                      setFilters((prev) => ({
                        ...prev,
                        tags: [...(prev.tags || []), tagId],
                      }))
                    }
                    onTagRemove={(tagId) =>
                      setFilters((prev) => ({
                        ...prev,
                        tags: (prev.tags || []).filter((id) => id !== tagId),
                      }))
                    }
                    compact={true}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Response Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <Textarea
                value={newResponse.question}
                onChange={(e) => setNewResponse((prev) => ({ ...prev, question: e.target.value }))}
                placeholder="Enter the question..."
                className="h-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
              <Textarea
                value={newResponse.answer}
                onChange={(e) => setNewResponse((prev) => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter the answer..."
                className="h-32"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  value={newResponse.section}
                  onChange={(e) => setNewResponse((prev) => ({ ...prev, section: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="General">General</option>
                  <option value="Organization & Management">Organization & Management</option>
                  <option value="Investment Strategy">Investment Strategy</option>
                  <option value="Risk Management">Risk Management</option>
                  <option value="ESG & Compliance">ESG & Compliance</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select
                  value={newResponse.questionType}
                  onChange={(e) => setNewResponse((prev) => ({ ...prev, questionType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="long_text">Long Text</option>
                  <option value="short_text">Short Text</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="yes_no">Yes/No</option>
                  <option value="currency">Currency</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <TagManager
                tags={responseTags}
                selectedTags={newResponse.tags}
                onTagSelect={(tagId) =>
                  setNewResponse((prev) => ({
                    ...prev,
                    tags: [...prev.tags, tagId],
                  }))
                }
                onTagRemove={(tagId) =>
                  setNewResponse((prev) => ({
                    ...prev,
                    tags: prev.tags.filter((id) => id !== tagId),
                  }))
                }
                onTagCreate={createTag}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddResponse} disabled={!newResponse.question.trim() || !newResponse.answer.trim()}>
                Add Response
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response List */}
      <div className="space-y-4">
        {filteredResponses.map((response) => (
          <Card key={response.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-deepBrand mb-2">{response.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{response.section}</span>
                      <span>•</span>
                      <span>{response.questionType.replace("_", " ")}</span>
                      <span>•</span>
                      <span>{formatDate(response.createdAt)}</span>
                      <span>•</span>
                      <span>{response.firmName}</span>
                    </div>
                  </div>
                  {showActions && (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleCopyResponse(response)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingResponse(response)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteResponse(response.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{response.answer}</p>
                </div>

                {response.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {response.tags.map((tagId) => {
                      const tag = responseTags.find((t) => t.id === tagId)
                      return tag ? (
                        <Badge key={tagId} variant="outline" style={{ borderColor: tag.color, color: tag.color }}>
                          {tag.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredResponses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No responses found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || Object.keys(filters).length > 0
                  ? "Try adjusting your search or filters"
                  : "Start building your response bank by adding responses"}
              </p>
              {showActions && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Response
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Response Modal */}
      {editingResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <Textarea
                  value={editingResponse.question}
                  onChange={(e) => setEditingResponse((prev) => (prev ? { ...prev, question: e.target.value } : null))}
                  className="h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <Textarea
                  value={editingResponse.answer}
                  onChange={(e) => setEditingResponse((prev) => (prev ? { ...prev, answer: e.target.value } : null))}
                  className="h-32"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <TagManager
                  tags={responseTags}
                  selectedTags={editingResponse.tags}
                  onTagSelect={(tagId) =>
                    setEditingResponse((prev) =>
                      prev
                        ? {
                            ...prev,
                            tags: [...prev.tags, tagId],
                          }
                        : null,
                    )
                  }
                  onTagRemove={(tagId) =>
                    setEditingResponse((prev) =>
                      prev
                        ? {
                            ...prev,
                            tags: prev.tags.filter((id) => id !== tagId),
                          }
                        : null,
                    )
                  }
                  onTagCreate={createTag}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingResponse(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateResponse}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
