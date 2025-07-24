"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Upload,
  FolderPlus,
  FileText,
  Download,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  Folder,
  Calendar,
  User,
  Lock,
  Unlock,
  Share2,
  Trash2,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataRoomFile {
  id: string
  name: string
  type: "file" | "folder"
  size?: string
  uploadedBy: string
  uploadedAt: string
  permissions: "public" | "private" | "restricted"
  downloadCount?: number
  lastAccessed?: string
}

const initialFiles: DataRoomFile[] = [
  {
    id: "1",
    name: "Financial Statements",
    type: "folder",
    uploadedBy: "John Smith",
    uploadedAt: "2024-01-15",
    permissions: "restricted",
  },
  {
    id: "2",
    name: "Investment Memorandum.pdf",
    type: "file",
    size: "2.4 MB",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2024-01-14",
    permissions: "public",
    downloadCount: 12,
    lastAccessed: "2024-01-20",
  },
  {
    id: "3",
    name: "Due Diligence Checklist.xlsx",
    type: "file",
    size: "156 KB",
    uploadedBy: "Mike Davis",
    uploadedAt: "2024-01-13",
    permissions: "restricted",
    downloadCount: 8,
    lastAccessed: "2024-01-19",
  },
  {
    id: "4",
    name: "Legal Documents",
    type: "folder",
    uploadedBy: "Legal Team",
    uploadedAt: "2024-01-12",
    permissions: "private",
  },
  {
    id: "5",
    name: "Market Analysis Report.pdf",
    type: "file",
    size: "5.2 MB",
    uploadedBy: "Research Team",
    uploadedAt: "2024-01-11",
    permissions: "public",
    downloadCount: 25,
    lastAccessed: "2024-01-21",
  },
]

export default function DataRoomFilesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dataRoomName = searchParams.get("name") || "Data Room"
  const dataRoomId = params.id

  const [files, setFiles] = useState<DataRoomFile[]>(initialFiles)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const [newFolder, setNewFolder] = useState({
    name: "",
    description: "",
    permissions: "private" as "public" | "private" | "restricted",
  })

  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<DataRoomFile | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [shareSettings, setShareSettings] = useState({
    email: "",
    permissions: "view" as "view" | "edit" | "download",
    message: "",
  })

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "files" && file.type === "file") ||
      (activeTab === "folders" && file.type === "folder") ||
      (activeTab === "recent" && new Date(file.uploadedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesTab
  })

  const handleCreateFolder = async () => {
    if (!newFolder.name.trim()) {
      alert("Please enter a folder name")
      return
    }

    const folderData: DataRoomFile = {
      id: `folder_${Date.now()}`,
      name: newFolder.name.trim(),
      type: "folder",
      uploadedBy: "Current User",
      uploadedAt: new Date().toISOString().split("T")[0],
      permissions: newFolder.permissions,
    }

    setFiles((prevFiles) => [...prevFiles, folderData])
    setNewFolder({ name: "", description: "", permissions: "private" })
    setShowCreateFolderDialog(false)
    alert(`Folder "${folderData.name}" created successfully!`)
  }

  const handleFileUpload = () => {
    // Simulate file upload
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.multiple = true
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        Array.from(target.files).forEach((file, index) => {
          const fileData: DataRoomFile = {
            id: `file_${Date.now()}_${index}`,
            name: file.name,
            type: "file",
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            uploadedBy: "Current User",
            uploadedAt: new Date().toISOString().split("T")[0],
            permissions: "private",
            downloadCount: 0,
            lastAccessed: "Never",
          }
          setFiles((prevFiles) => [...prevFiles, fileData])
        })
        alert(`${target.files.length} file(s) uploaded successfully!`)
      }
    }
    fileInput.click()
  }

  const handleDeleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file && confirm(`Are you sure you want to delete "${file.name}"?`)) {
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId))
      alert(`"${file.name}" has been deleted`)
    }
  }

  const handleDownloadFile = (file: DataRoomFile) => {
    if (file.type === "file") {
      // Simulate download
      alert(`Downloading "${file.name}"...`)
      // Update download count
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id
            ? { ...f, downloadCount: (f.downloadCount || 0) + 1, lastAccessed: new Date().toISOString().split("T")[0] }
            : f,
        ),
      )
    }
  }

  const handleShareFile = (file: DataRoomFile) => {
    setSelectedFile(file)
    setShareSettings({ email: "", permissions: "view", message: "" })
    setShowShareDialog(true)
  }

  const handleRenameFile = (file: DataRoomFile) => {
    setSelectedFile(file)
    setNewFileName(file.name)
    setShowRenameDialog(true)
  }

  const handleConfirmShare = async () => {
    if (!selectedFile || !shareSettings.email.trim()) {
      alert("Please enter an email address")
      return
    }

    // Simulate sharing
    alert(
      `"${selectedFile.name}" has been shared with ${shareSettings.email} with ${shareSettings.permissions} permissions`,
    )
    setShowShareDialog(false)
    setSelectedFile(null)
  }

  const handleConfirmRename = async () => {
    if (!selectedFile || !newFileName.trim()) {
      alert("Please enter a new name")
      return
    }

    if (newFileName.trim() === selectedFile.name) {
      setShowRenameDialog(false)
      return
    }

    // Update the file name
    setFiles((prevFiles) => prevFiles.map((f) => (f.id === selectedFile.id ? { ...f, name: newFileName.trim() } : f)))

    alert(`File renamed to "${newFileName.trim()}"`)
    setShowRenameDialog(false)
    setSelectedFile(null)
  }

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "public":
        return <Unlock className="h-4 w-4 text-green-600" />
      case "private":
        return <Lock className="h-4 w-4 text-red-600" />
      case "restricted":
        return <Share2 className="h-4 w-4 text-yellow-600" />
      default:
        return <Lock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "public":
        return "bg-green-100 text-green-800"
      case "private":
        return "bg-red-100 text-red-800"
      case "restricted":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Data Rooms
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-deepBrand">File Management</h1>
              <p className="text-deepBrand">
                {dataRoomName} - Data Room ID: {dataRoomId}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => setShowCreateFolderDialog(true)}
            >
              <FolderPlus className="h-4 w-4" />
              Create Folder
            </Button>
            <Button
              className="flex items-center gap-2 bg-deepBrand hover:bg-deepBrand/90 text-white"
              onClick={handleFileUpload}
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Search and Tabs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-gray-100">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  All Items ({files.length})
                </TabsTrigger>
                <TabsTrigger
                  value="files"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Files ({files.filter((f) => f.type === "file").length})
                </TabsTrigger>
                <TabsTrigger
                  value="folders"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Folders ({files.filter((f) => f.type === "folder").length})
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
                >
                  Recent
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="grid gap-4">
                  {filteredFiles.map((file) => (
                    <Card key={file.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                              {file.type === "folder" ? (
                                <Folder className="h-5 w-5 text-blue-600" />
                              ) : (
                                <FileText className="h-5 w-5 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-deepBrand">{file.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-baseGray mt-1">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {file.uploadedBy}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {file.uploadedAt}
                                </div>
                                {file.size && <span>{file.size}</span>}
                                {file.downloadCount !== undefined && <span>{file.downloadCount} downloads</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getPermissionIcon(file.permissions)}
                              <Badge className={getPermissionColor(file.permissions)}>{file.permissions}</Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {file.type === "file" && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                                      <Download className="mr-2 h-4 w-4" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Preview
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleShareFile(file)}>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRenameFile(file)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteFile(file.id)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredFiles.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
                      <p className="text-gray-600">
                        {searchQuery ? "Try adjusting your search terms" : "Upload files to get started"}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folderName">Folder Name *</Label>
              <Input
                id="folderName"
                placeholder="e.g., Financial Statements"
                value={newFolder.name}
                onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="folderDescription">Description</Label>
              <Textarea
                id="folderDescription"
                placeholder="Brief description of folder contents"
                value={newFolder.description}
                onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="folderPermissions">Permissions</Label>
              <Select
                value={newFolder.permissions}
                onValueChange={(value: "public" | "private" | "restricted") =>
                  setNewFolder({ ...newFolder, permissions: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - All data room contacts can access</SelectItem>
                  <SelectItem value="private">Private - Only you can access</SelectItem>
                  <SelectItem value="restricted">Restricted - Selected contacts only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share "{selectedFile?.name}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="shareEmail">Email Address *</Label>
              <Input
                id="shareEmail"
                type="email"
                placeholder="Enter email address"
                value={shareSettings.email}
                onChange={(e) => setShareSettings({ ...shareSettings, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="sharePermissions">Permissions</Label>
              <Select
                value={shareSettings.permissions}
                onValueChange={(value: "view" | "edit" | "download") =>
                  setShareSettings({ ...shareSettings, permissions: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="download">View & Download</SelectItem>
                  <SelectItem value="edit">View, Download & Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="shareMessage">Message (Optional)</Label>
              <Textarea
                id="shareMessage"
                placeholder="Add a message for the recipient"
                value={shareSettings.message}
                onChange={(e) => setShareSettings({ ...shareSettings, message: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmShare}>Share File</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Rename "{selectedFile?.name}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newFileName">New Name *</Label>
              <Input
                id="newFileName"
                placeholder="Enter new name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmRename()
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRename}>Rename</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
