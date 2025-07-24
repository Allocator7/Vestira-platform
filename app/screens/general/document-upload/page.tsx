"use client"

import { useState } from "react"
import Screen from "@/components/Screen"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  File,
  ImageIcon,
  FileSpreadsheet,
  FileIcon as FilePdf,
  X,
  Check,
  AlertCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DocumentUploadPage() {
  const [files, setFiles] = useState<
    {
      id: number
      name: string
      size: string
      type: string
      progress: number
      status: "uploading" | "complete" | "error"
      icon: JSX.Element
    }[]
  >([
    {
      id: 1,
      name: "Fund Presentation.pdf",
      size: "4.2 MB",
      type: "pdf",
      progress: 100,
      status: "complete",
      icon: <FilePdf className="h-6 w-6 text-red-500" />,
    },
    {
      id: 2,
      name: "Performance History.xlsx",
      size: "3.1 MB",
      type: "spreadsheet",
      progress: 100,
      status: "complete",
      icon: <FileSpreadsheet className="h-6 w-6 text-green-500" />,
    },
    {
      id: 3,
      name: "Team Photo.jpg",
      size: "2.8 MB",
      type: "image",
      progress: 65,
      status: "uploading",
      icon: <ImageIcon className="h-6 w-6 text-blue-500" />,
    },
    {
      id: 4,
      name: "Risk Management Framework.docx",
      size: "1.5 MB",
      type: "document",
      progress: 0,
      status: "error",
      icon: <FileText className="h-6 w-6 text-blue-500" />,
    },
  ])

  const [selectedFolder, setSelectedFolder] = useState("Global Macro Fund")

  const removeFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const retryUpload = (id: number) => {
    setFiles(
      files.map((file) =>
        file.id === id
          ? {
              ...file,
              progress: 0,
              status: "uploading",
            }
          : file,
      ),
    )

    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.id === id) {
            const newProgress = file.progress + 20
            if (newProgress >= 100) {
              clearInterval(interval)
              return {
                ...file,
                progress: 100,
                status: "complete",
              }
            }
            return {
              ...file,
              progress: newProgress,
            }
          }
          return file
        }),
      )
    }, 500)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-6 w-6 text-red-500" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />
      case "image":
        return <ImageIcon className="h-6 w-6 text-blue-500" />
      case "document":
        return <FileText className="h-6 w-6 text-blue-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Document Upload</h1>
              <p className="text-muted-foreground">Upload and manage documents for your data rooms</p>
            </div>
          </div>

          <Tabs defaultValue="upload">
            <TabsList className="mb-6">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="url">Add from URL</TabsTrigger>
              <TabsTrigger value="manage">Manage Files</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Documents</CardTitle>
                      <CardDescription>Drag and drop files or click to browse your computer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Supports PDF, Word, Excel, PowerPoint, and image files up to 50MB
                        </p>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Browse Files
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className={`p-4 border rounded-lg ${
                              file.status === "error" ? "border-red-200 bg-red-50" : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="mr-3">{file.icon}</div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{file.size}</p>
                                  </div>
                                  <div className="flex items-center">
                                    {file.status === "complete" ? (
                                      <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">
                                        <Check className="h-3 w-3 mr-1" />
                                        Complete
                                      </Badge>
                                    ) : file.status === "error" ? (
                                      <Badge className="mr-2 bg-red-100 text-red-800 hover:bg-red-100">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Failed
                                      </Badge>
                                    ) : (
                                      <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                        Uploading
                                      </Badge>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => removeFile(file.id)}
                                    >
                                      <X className="h-4 w-4" />
                                      <span className="sr-only">Remove</span>
                                    </Button>
                                  </div>
                                </div>
                                {file.status === "uploading" && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>{file.progress}%</span>
                                      <span>{file.progress < 100 ? "Uploading..." : "Processing..."}</span>
                                    </div>
                                    <Progress value={file.progress} className="h-2" />
                                  </div>
                                )}
                                {file.status === "error" && (
                                  <div className="mt-2 flex justify-between items-center">
                                    <p className="text-xs text-red-600">
                                      Upload failed. Please check your connection and try again.
                                    </p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7"
                                      onClick={() => retryUpload(file.id)}
                                    >
                                      Retry
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Document Details</CardTitle>
                      <CardDescription>Add information about your documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="folder">Select Destination</Label>
                          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                            <SelectTrigger id="folder">
                              <SelectValue placeholder="Select folder" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Global Macro Fund">Global Macro Fund</SelectItem>
                              <SelectItem value="Emerging Markets Fund">Emerging Markets Fund</SelectItem>
                              <SelectItem value="Technology Fund">Technology Fund</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Document Name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" placeholder="Document Description" />
                        </div>
                        <Button>Save Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Add Document from URL</CardTitle>
                  <CardDescription>Provide a URL to import a document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input id="url" placeholder="https://example.com/document.pdf" type="url" />
                    </div>
                    <Button>Import Document</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Existing Files</CardTitle>
                  <CardDescription>View, edit, and organize your uploaded documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 bg-gray-50"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {files.map((file) => (
                          <tr key={file.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="mr-4">{file.icon}</div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{file.size}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{file.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Screen>
  )
}
