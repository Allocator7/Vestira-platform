"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Upload,
  Grid,
  List,
  Download,
  Share2,
  Star,
  Trash2,
  FileText,
  FileImage,
  FileArchive,
  File,
  FolderOpen,
  ChevronDown,
  Lock,
  Eye,
  TagIcon,
  Filter,
  Archive,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RoleIndicator } from "@/components/RoleIndicator"
import { useApp } from "@/context/AppContext"
import { AccessControlManager } from "@/components/AccessControlManager"
import { TagManager } from "@/components/TagManager"
import { DocumentTagFilter } from "@/components/DocumentTagFilter"
import { TagStatistics } from "@/components/TagStatistics"
import { useDocumentTags } from "@/hooks/useDocumentTags"
import { toast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"

// Mock data for files
const files = [
  {
    id: "doc1",
    name: "Q2 2023 Performance Report.pdf",
    type: "pdf",
    size: "3.2 MB",
    category: "Reports",
    tags: ["Performance", "Quarterly"],
    uploadedBy: "John Smith",
    uploadDate: "2023-07-15",
    starred: true,
    sharedWith: ["State Pension Fund", "University Endowment"],
    permissionLevel: "admin",
    viewCount: 12,
    downloadCount: 5,
    assetClass: "Equity",
    strategy: "Global Equity",
    documentType: "Standard Report",
  },
  {
    id: "doc2",
    name: "Investment Strategy Presentation.pptx",
    type: "pptx",
    size: "8.7 MB",
    category: "Presentations",
    tags: ["Strategy", "Investment"],
    uploadedBy: "Sarah Johnson",
    uploadDate: "2023-06-28",
    starred: false,
    sharedWith: ["State Pension Fund"],
    permissionLevel: "admin",
    viewCount: 8,
    downloadCount: 3,
    assetClass: "Fixed Income",
    strategy: "Core Fixed Income",
    documentType: "Ad-Hoc",
  },
  {
    id: "doc3",
    name: "Risk Assessment Framework.xlsx",
    type: "xlsx",
    size: "1.5 MB",
    category: "Analysis",
    tags: ["Risk", "Framework"],
    uploadedBy: "Michael Chen",
    uploadDate: "2023-07-02",
    starred: true,
    sharedWith: ["University Endowment", "Family Office Partners"],
    permissionLevel: "admin",
    viewCount: 15,
    downloadCount: 7,
    assetClass: "Multi-Asset",
    strategy: "Risk Parity",
    documentType: "Standard Report",
  },
  {
    id: "doc4",
    name: "Due Diligence Questionnaire.docx",
    type: "docx",
    size: "950 KB",
    category: "Due Diligence",
    tags: ["Questionnaire", "Compliance"],
    uploadedBy: "Emily Rodriguez",
    uploadDate: "2023-07-10",
    starred: false,
    sharedWith: ["Corporate Pension Plan"],
    permissionLevel: "admin",
    viewCount: 6,
    downloadCount: 2,
    assetClass: "Hedge Fund",
    strategy: "Global Macro",
    documentType: "Standard Report",
  },
  {
    id: "doc5",
    name: "Market Analysis Report.pdf",
    type: "pdf",
    size: "4.1 MB",
    category: "Reports",
    tags: ["Market", "Analysis"],
    uploadedBy: "David Kim",
    uploadDate: "2023-07-05",
    starred: false,
    sharedWith: ["Foundation Trust", "Insurance Company"],
    permissionLevel: "admin",
    viewCount: 20,
    downloadCount: 9,
    assetClass: "Fixed Income",
    strategy: "Total Return",
    documentType: "Standard Report",
  },
  {
    id: "doc6",
    name: "Portfolio Holdings.xlsx",
    type: "xlsx",
    size: "2.3 MB",
    category: "Portfolio",
    tags: ["Holdings", "Assets"],
    uploadedBy: "Jennifer Lee",
    uploadDate: "2023-07-12",
    starred: true,
    sharedWith: ["State Pension Fund", "University Endowment", "Corporate Pension Plan"],
    permissionLevel: "admin",
    viewCount: 25,
    downloadCount: 12,
    assetClass: "Equity",
    strategy: "Growth Equity",
    documentType: "Ad-Hoc",
  },
  {
    id: "doc7",
    name: "Compliance Documentation.zip",
    type: "zip",
    size: "15.8 MB",
    category: "Compliance",
    tags: ["Documentation", "Legal"],
    uploadedBy: "Robert Wilson",
    uploadDate: "2023-06-20",
    starred: false,
    sharedWith: [],
    permissionLevel: "admin",
    viewCount: 0,
    downloadCount: 0,
    assetClass: "Equity",
    strategy: "Global Equity",
    documentType: "Standard Report",
  },
  {
    id: "doc8",
    name: "Investment Thesis.pdf",
    type: "pdf",
    size: "2.7 MB",
    category: "Strategy",
    tags: ["Thesis", "Investment"],
    uploadedBy: "Amanda Taylor",
    uploadDate: "2023-07-08",
    starred: true,
    sharedWith: ["Family Office Partners"],
    permissionLevel: "admin",
    viewCount: 10,
    downloadCount: 4,
    assetClass: "Multi-Asset",
    strategy: "Risk Parity",
    documentType: "Ad-Hoc",
  },
]

// File type icons mapping
const fileIcons = {
  pdf: <FileText className="h-8 w-8 text-red-500" />,
  docx: <FileText className="h-8 w-8 text-blue-500" />,
  xlsx: <FileText className="h-8 w-8 text-green-500" />,
  pptx: <FileText className="h-8 w-8 text-orange-500" />,
  jpg: <FileImage className="h-8 w-8 text-purple-500" />,
  png: <FileImage className="h-8 w-8 text-purple-500" />,
  zip: <FileArchive className="h-8 w-8 text-yellow-500" />,
  default: <File className="h-8 w-8 text-gray-500" />,
}

// Categories for filtering
const categories = [
  "All",
  "Reports",
  "Presentations",
  "Analysis",
  "Due Diligence",
  "Portfolio",
  "Compliance",
  "Strategy",
]

const documentTypes = ["All", "Standard Report", "Ad-Hoc"]

const assetClasses = ["All", "Equity", "Fixed Income", "Multi-Asset", "Hedge Fund"]

const strategies = [
  "All",
  "Global Equity",
  "Core Fixed Income",
  "Risk Parity",
  "Global Macro",
  "Total Return",
  "Growth Equity",
]

const allocators = [
  "All",
  "State Pension Fund",
  "University Endowment",
  "Family Office Partners",
  "Corporate Pension Plan",
  "Foundation Trust",
  "Insurance Company",
]

export default function ManagerSharedDocumentPortal() {
  const { userRole } = useApp()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [starredFiles, setStarredFiles] = useState<string[]>(
    files.filter((file) => file.starred).map((file) => file.id),
  )
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [isTagManagementOpen, setIsTagManagementOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  // New filters
  const [selectedAssetClass, setSelectedAssetClass] = useState("All")
  const [selectedStrategy, setSelectedStrategy] = useState("All")
  const [selectedDocumentType, setSelectedDocumentType] = useState("All")
  const [selectedAllocator, setSelectedAllocator] = useState("All")

  // Add bulk actions functionality to the manager shared library page

  // Add these state variables after the existing useState declarations:
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false)

  // Tag management
  const {
    tags,
    documentTags,
    createTag,
    updateTag,
    deleteTag,
    addTagToDocument,
    removeTagFromDocument,
    getDocumentTags,
    getTagsWithCounts,
  } = useDocumentTags()

  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([])

  // Filter files based on search query, selected category, and tags
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || file.category === selectedCategory
    const matchesAssetClass = selectedAssetClass === "All" || file.assetClass === selectedAssetClass
    const matchesStrategy = selectedStrategy === "All" || file.strategy === selectedStrategy
    const matchesDocumentType = selectedDocumentType === "All" || file.documentType === selectedDocumentType
    const matchesAllocator =
      selectedAllocator === "All" || (file.sharedWith && file.sharedWith.includes(selectedAllocator))

    // Check if file has all selected tags
    const fileTags = getDocumentTags(file.id)
    const matchesTags = selectedTagFilters.length === 0 || selectedTagFilters.every((tagId) => fileTags.includes(tagId))

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAssetClass &&
      matchesStrategy &&
      matchesDocumentType &&
      matchesAllocator &&
      matchesTags
    )
  })

  // Toggle star status for a file
  const toggleStar = (fileId: string) => {
    if (starredFiles.includes(fileId)) {
      setStarredFiles(starredFiles.filter((id) => id !== fileId))
    } else {
      setStarredFiles([...starredFiles, fileId])
    }
  }

  // Get icon for file type
  const getFileIcon = (fileType: string) => {
    return fileIcons[fileType as keyof typeof fileIcons] || fileIcons.default
  }

  const [isShareLoading, setIsShareLoading] = useState(false)

  const openShareDialog = async (file) => {
    setIsShareLoading(true)
    setSelectedFile(file)

    try {
      // Simulate loading permissions data
      await new Promise((resolve) => setTimeout(resolve, 800))

      setSelectedFileId(file.id)
      setIsShareDialogOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sharing options. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsShareLoading(false)
    }
  }

  // Check if user can view engagement metrics
  const canViewEngagementMetrics = userRole === "manager"

  // Handle tag selection for filtering
  const handleTagFilterSelect = (tagId: string) => {
    setSelectedTagFilters((prev) => [...prev, tagId])
  }

  // Handle tag removal from filters
  const handleTagFilterRemove = (tagId: string) => {
    setSelectedTagFilters((prev) => prev.filter((id) => id !== tagId))
  }

  // Clear all tag filters
  const clearAllTagFilters = () => {
    setSelectedTagFilters([])
  }

  // Handle adding a tag to a document
  const handleAddTagToDocument = async (documentId: string, tagId: string) => {
    await addTagToDocument(documentId, tagId)
  }

  // Handle removing a tag from a document
  const handleRemoveTagFromDocument = async (documentId: string, tagId: string) => {
    await removeTagFromDocument(documentId, tagId)
  }

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedAssetClass("All")
    setSelectedStrategy("All")
    setSelectedDocumentType("All")
    setSelectedAllocator("All")
    setSelectedTagFilters([])
  }

  // Bulk action handlers
  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredFiles.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredFiles.map((file) => file.id))
    }
  }

  const handleBulkShare = async () => {
    if (selectedDocuments.length === 0) return

    setIsBulkActionLoading(true)

    // Simulate bulk sharing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if ((window as any).addNotification) {
      ;(window as any).addNotification({
        title: "Bulk Share Completed",
        message: `${selectedDocuments.length} documents have been shared with selected allocators.`,
        type: "success",
      })
    }

    setSelectedDocuments([])
    setIsBulkActionLoading(false)
  }

  const handleBulkArchive = async () => {
    if (selectedDocuments.length === 0) return

    setIsBulkActionLoading(true)

    // Simulate bulk archiving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if ((window as any).addNotification) {
      ;(window as any).addNotification({
        title: "Documents Archived",
        message: `${selectedDocuments.length} documents have been archived.`,
        type: "success",
      })
    }

    setSelectedDocuments([])
    setIsBulkActionLoading(false)
  }

  return (
    <Screen>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-deepBrand">Shared Document Portal</h1>
                <RoleIndicator role="manager" />
              </div>
              <p className="text-baseGray">Manage and share files with your allocators</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isTagManagementOpen} onOpenChange={setIsTagManagementOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <TagIcon className="h-4 w-4" />
                    Manage Tags
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Tag Management</DialogTitle>
                    <DialogDescription>Create, edit, and delete tags to organize your documents.</DialogDescription>
                  </DialogHeader>

                  <div className="py-4">
                    <TagStatistics tags={getTagsWithCounts()} />

                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-3">Create New Tag</h3>
                      <TagManager
                        tags={tags}
                        selectedTags={[]}
                        onTagSelect={() => {}}
                        onTagRemove={() => {}}
                        onTagCreate={createTag}
                        onTagEdit={updateTag}
                        onTagDelete={deleteTag}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button onClick={() => setIsTagManagementOpen(false)}>Done</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>Upload files to share with your allocators</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-1">Drag and drop files here or click to browse</p>
                        <p className="text-gray-400 text-sm">Supports PDF, DOCX, XLSX, PPTX, JPG, PNG (max 50MB)</p>
                      </div>
                      <Input type="file" className="hidden" id="file-upload" multiple />
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          document.getElementById("file-upload")?.click()
                        }}
                      >
                        Select Files
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select id="category" className="w-full rounded-md border border-gray-300 p-2 text-sm">
                          {categories.slice(1).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="documentType" className="text-sm font-medium text-gray-700">
                          Document Type
                        </label>
                        <select id="documentType" className="w-full rounded-md border border-gray-300 p-2 text-sm">
                          {documentTypes.slice(1).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="assetClass" className="text-sm font-medium text-gray-700">
                          Asset Class
                        </label>
                        <select id="assetClass" className="w-full rounded-md border border-gray-300 p-2 text-sm">
                          {assetClasses.slice(1).map((assetClass) => (
                            <option key={assetClass} value={assetClass}>
                              {assetClass}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="strategy" className="text-sm font-medium text-gray-700">
                          Strategy
                        </label>
                        <select id="strategy" className="w-full rounded-md border border-gray-300 p-2 text-sm">
                          {strategies.slice(1).map((strategy) => (
                            <option key={strategy} value={strategy}>
                              {strategy}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <div className="mt-1">
                        <TagManager tags={tags} selectedTags={[]} onTagSelect={() => {}} onTagRemove={() => {}} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsUploadDialogOpen(false)}>Upload</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Main content layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with filters */}
            <div className="md:col-span-1 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Tag filtering */}
              <DocumentTagFilter
                tags={getTagsWithCounts()}
                selectedTags={selectedTagFilters}
                onTagSelect={handleTagFilterSelect}
                onTagRemove={handleTagFilterRemove}
                onClearAll={clearAllTagFilters}
              />

              {/* Other filters */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allocator / Client Name</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center justify-between">
                        <span>{selectedAllocator}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                      {allocators.map((allocator) => (
                        <DropdownMenuItem
                          key={allocator}
                          onClick={() => setSelectedAllocator(allocator)}
                          className={selectedAllocator === allocator ? "bg-gray-100 font-medium" : ""}
                        >
                          {allocator === "All" ? "All Allocators" : allocator}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset Class</label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={selectedAssetClass}
                    onChange={(e) => setSelectedAssetClass(e.target.value)}
                  >
                    {assetClasses.map((assetClass) => (
                      <option key={assetClass} value={assetClass}>
                        {assetClass === "All" ? "All Asset Classes" : assetClass}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Strategy</label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                  >
                    {strategies.map((strategy) => (
                      <option key={strategy} value={strategy}>
                        {strategy === "All" ? "All Strategies" : strategy}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Type</label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                  >
                    {documentTypes.map((docType) => (
                      <option key={docType} value={docType}>
                        {docType === "All" ? "All Document Types" : docType}
                      </option>
                    ))}
                  </select>
                </div>

                <Button variant="outline" className="w-full" onClick={resetAllFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Reset All Filters
                </Button>
              </div>

              {/* Tag statistics */}
              <TagStatistics tags={getTagsWithCounts()} />
            </div>

            {/* Main content area */}
            <div className="md:col-span-3">
              {/* Bulk Actions */}
              {selectedDocuments.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-deepBrand">
                      {selectedDocuments.length} document(s) selected
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkShare}
                        disabled={isBulkActionLoading}
                        className="gap-1"
                      >
                        <Share2 className="h-4 w-4" />
                        Share All
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkArchive}
                        disabled={isBulkActionLoading}
                        className="gap-1"
                      >
                        <Archive className="h-4 w-4" />
                        Archive All
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedDocuments([])}
                      disabled={isBulkActionLoading}
                    >
                      Clear Selection
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleSelectAll} disabled={isBulkActionLoading}>
                      {selectedDocuments.length === filteredFiles.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                </div>
              )}

              {/* View controls */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500">
                  {filteredFiles.length} {filteredFiles.length === 1 ? "document" : "documents"} found
                </div>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none ${viewMode === "list" ? "bg-gray-100" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tabs for different file views */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Files</TabsTrigger>
                  <TabsTrigger value="starred">Starred</TabsTrigger>
                  <TabsTrigger value="shared">Shared</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {filteredFiles.length === 0 ? (
                    <div className="text-center py-12">
                      <FolderOpen className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No files found</h3>
                      <p className="mt-1 text-gray-500">
                        Try adjusting your search or filter to find what you're looking for
                      </p>
                    </div>
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredFiles.map((file) => (
                        <div
                          key={file.id}
                          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-4 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-3">
                              {getFileIcon(file.type)}
                              <div className="flex space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => toggleStar(file.id)}
                                      >
                                        <Star
                                          className={`h-4 w-4 ${
                                            starredFiles.includes(file.id)
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-400"
                                          }`}
                                        />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {starredFiles.includes(file.id) ? "Remove from starred" : "Add to starred"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-400"
                                      >
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="19" cy="12" r="1" />
                                        <circle cx="5" cy="12" r="1" />
                                      </svg>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="flex items-center">
                                      <Download className="mr-2 h-4 w-4" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center"
                                      onClick={() => openShareDialog(file)}
                                      disabled={isShareLoading}
                                    >
                                      {isShareLoading ? (
                                        <>
                                          <Spinner size="sm" className="mr-2" />
                                          Loading...
                                        </>
                                      ) : (
                                        <>
                                          <Share2 className="mr-2 h-4 w-4" />
                                          Share
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1 truncate">{file.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <span>{file.size}</span>
                              <span className="mx-1">•</span>
                              <span>{file.type.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              {file.sharedWith.length > 0 ? (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Share2 className="h-3 w-3 mr-1 text-primary" />
                                  <span>
                                    Shared with {file.sharedWith.length}{" "}
                                    {file.sharedWith.length === 1 ? "allocator" : "allocators"}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Lock className="h-3 w-3 mr-1 text-gray-400" />
                                  <span>Private</span>
                                </div>
                              )}
                            </div>

                            {/* Document tags */}
                            <div className="mb-2">
                              <TagManager
                                tags={tags}
                                selectedTags={getDocumentTags(file.id)}
                                onTagSelect={(tagId) => handleAddTagToDocument(file.id, tagId)}
                                onTagRemove={(tagId) => handleRemoveTagFromDocument(file.id, tagId)}
                              />
                            </div>

                            {/* Engagement metrics - only visible to managers */}
                            {canViewEngagementMetrics && file.sharedWith.length > 0 && (
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{file.viewCount} views</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  <span>{file.downloadCount} downloads</span>
                                </div>
                              </div>
                            )}

                            <div className="mt-auto">
                              <Badge variant="outline" className="mr-1">
                                {file.category}
                              </Badge>
                              <Badge variant="outline" className="mr-1">
                                {file.documentType}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Uploaded on {new Date(file.uploadDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredFiles.map((file) => (
                        <div key={file.id} className="grid grid-cols-12 gap-4 py-4">
                          <div className="col-span-1 flex items-center">{getFileIcon(file.type)}</div>
                          <div className="col-span-5 md:col-span-6">
                            <h3 className="font-medium text-gray-900">{file.name}</h3>
                            <div className="text-sm text-gray-500">
                              {file.size} • {file.type.toUpperCase()}
                            </div>
                            <div className="mt-2">
                              <TagManager
                                tags={tags}
                                selectedTags={getDocumentTags(file.id)}
                                onTagSelect={(tagId) => handleAddTagToDocument(file.id, tagId)}
                                onTagRemove={(tagId) => handleRemoveTagFromDocument(file.id, tagId)}
                              />
                            </div>
                          </div>
                          <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                            {file.sharedWith.length > 0 ? (
                              <div className="flex items-center text-xs text-gray-500">
                                <Share2 className="h-3 w-3 mr-1 text-primary" />
                                <span>
                                  Shared with {file.sharedWith.length}{" "}
                                  {file.sharedWith.length === 1 ? "allocator" : "allocators"}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center text-xs text-gray-500">
                                <Lock className="h-3 w-3 mr-1 text-gray-400" />
                                <span>Private</span>
                              </div>
                            )}
                          </div>
                          <div className="col-span-3 flex items-center justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => toggleStar(file.id)}
                                  >
                                    <Star
                                      className={`h-4 w-4 ${
                                        starredFiles.includes(file.id)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-400"
                                      }`}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {starredFiles.includes(file.id) ? "Remove from starred" : "Add to starred"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center" onClick={() => openShareDialog(file)}>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Share Dialog */}
        <Dialog open={isShareDialogOpen} onOpenChange={() => setIsShareDialogOpen(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Share File</DialogTitle>
              <DialogDescription>Manage who can access this file.</DialogDescription>
            </DialogHeader>
            <AccessControlManager
              resourceId={selectedFileId}
              resourceName={files.find((f) => f.id === selectedFileId)?.name || "Document"}
              resourceType="document"
            />
            <DialogFooter>
              <Button onClick={() => setIsShareDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Screen>
  )
}
