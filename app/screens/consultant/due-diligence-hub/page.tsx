"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Eye, MessageSquare, Calendar, Upload, Paperclip } from "lucide-react"

export default function ConsultantDueDiligenceHubPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [showAttachmentModal, setShowAttachmentModal] = useState(false)
  const [selectedDDQ, setSelectedDDQ] = useState<any>(null)

  // Mock data for DDQs
  const activeDDQs = [
    {
      id: "1",
      name: "BlackRock Infrastructure Fund IV DDQ",
      manager: "BlackRock",
      status: "Active",
      dueDate: "2024-12-15",
      progress: 75,
      questions: 45,
      responses: 34,
    },
    {
      id: "2", 
      name: "Vanguard Real Estate Partners DDQ",
      manager: "Vanguard",
      status: "Pending",
      dueDate: "2024-12-20",
      progress: 30,
      questions: 38,
      responses: 12,
    },
  ]

  const completedDDQs = [
    {
      id: "3",
      name: "Wellington Growth Equity Fund DDQ",
      manager: "Wellington Management",
      status: "Completed",
      dueDate: "2024-11-30",
      progress: 100,
      questions: 42,
      responses: 42,
    },
  ]


  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-deepBrand">Due Diligence Hub</h1>
            <p className="text-baseGray mt-1">Manage and track due diligence questionnaires</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create DDQ
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active ({activeDDQs.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending (0)</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedDDQs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeDDQs.map((ddq) => (
                <Card key={ddq.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{ddq.name}</CardTitle>
                        <p className="text-sm text-baseGray">{ddq.manager}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{ddq.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{ddq.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-electric-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${ddq.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-baseGray">
                        <span>{ddq.responses} of {ddq.questions} questions answered</span>
                        <span>Due: {ddq.dueDate}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedDDQ(ddq)
                            setShowAttachmentModal(true)
                          }}
                        >
                          <Paperclip className="h-4 w-4 mr-1" />
                          Attach Docs
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-baseGray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-deepBrand mb-2">No pending DDQs</h3>
                <p className="text-baseGray">All due diligence questionnaires are up to date.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedDDQs.map((ddq) => (
                <Card key={ddq.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{ddq.name}</CardTitle>
                        <p className="text-sm text-baseGray">{ddq.manager}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">{ddq.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{ddq.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${ddq.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-baseGray">
                        <span>{ddq.responses} of {ddq.questions} questions answered</span>
                        <span>Completed: {ddq.dueDate}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Document Attachment Modal */}
        {showAttachmentModal && selectedDDQ && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Attach Documents to {selectedDDQ.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAttachmentModal(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Attached Documents</h4>
                  <div className="text-sm text-gray-500 italic">No documents attached yet</div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAttachmentModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                  Save Attachments
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Screen>
  )
}
