"use client"

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
  Users,
  TagIcon,
  Filter,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
    managerName: "Blackrock Global Equity",
    permissionLevel: "view",
    assetClass: "Equity",
    strategy: "Global Equity",
    documentType: "Standard Report",
    allocator: "State Pension Fund",
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
    managerName: "Vanguard Fixed Income",
    permissionLevel: "view",
    assetClass: "Fixed Income",
    strategy: "Core Fixed Income",
    documentType: "Ad-Hoc",
    allocator: "University Endowment",
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
    managerName: "Wellington Management",
    permissionLevel: "view",
    assetClass: "Multi-Asset",
    strategy: "Risk Parity",
    documentType: "Standard Report",
    allocator: "Family Office Partners",
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
    managerName: "Bridgewater Associates",
    permissionLevel: "view",
    assetClass: "Hedge Fund",
    strategy: "Global Macro",
    documentType: "Standard Report",
    allocator: "Corporate Pension Plan",
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
    managerName: "PIMCO",
    permissionLevel: "view",
    assetClass: "Fixed Income",
    strategy: "Total Return",
    documentType: "Standard Report",
    allocator: "Foundation Trust",
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
    managerName: "Fidelity Investments",
    permissionLevel: "view",
    assetClass: "Equity",
    strategy: "Growth Equity",
    documentType: "Ad-Hoc",
    allocator: "Insurance Company",
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
    managerName: "Blackrock Global Equity",
    permissionLevel: "view",
    assetClass: "Equity",
    strategy: "Global Equity",
    documentType: "Standard Report",
    allocator: "State Pension Fund",
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
    managerName: "Wellington Management",
    permissionLevel: "view",
    assetClass: "Multi-Asset",
    strategy: "Risk Parity",
    documentType: "Ad-Hoc",
    allocator: "Family Office Partners",
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

// Permission level badges
const PermissionBadge = ({ level }) => {
  const config = {
    view: { color: "bg-blue-50 text-blue-700", label: "View Only" },
    edit: { color: "bg-green-50 text-green-700", label: "Can Edit" },
    admin: { color: "bg-purple-50 text-purple-700", label: "Admin" },
  }

  const { color, label } = config[level] || config.view

  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
}

export default function SharedDocumentPortal() {
  const { userRole } = useApp()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [starredFiles, setStarredFiles] = useState<string[]>(
    files.filter((file) => file.starred).map((file) => file.id),
  )
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [isTagManagementOpen, setIsTagManagementOpen] = useState(false)

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false)

  // New filters
  const [selectedManager, setSelectedManager] = useState("All")
  const [selectedAssetClass, setSelectedAssetClass] = useState("All")
  const [selectedStrategy, setSelectedStrategy] = useState("All")
  const [selectedDocumentType, setSelectedDocumentType] = useState("All")
  const [selectedAllocator, setSelectedAllocator] = useState("All")

  // Tag filtering
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

  // Get unique values for filters
  const managers = ["All", ...Array.from(new Set(files.map((file) => file.managerName)))].sort()
  const assetClasses = ["All", ...Array.from(new Set(files.map((file) => file.assetClass)))].sort()
  const strategies = ["All", ...Array.from(new Set(files.map((file) => file.strategy)))].sort()
  const documentTypes = ["All", ...Array.from(new Set(files.map((file) => file.documentType)))].sort()
  const allocators = ["All", ...Array.from(new Set(files.map((file) => file.allocator)))].sort()

  // Filter files based on search query, selected filters, and tags
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || file.category === selectedCategory
    const matchesManager = selectedManager === "All" || file.managerName === selectedManager
    const matchesAssetClass = selectedAssetClass === "All" || file.assetClass === selectedAssetClass
    const matchesStrategy = selectedStrategy === "All" || file.strategy === selectedStrategy
    const matchesDocumentType = selectedDocumentType === "All" || file.documentType === selectedDocumentType
    const matchesAllocator = selectedAllocator === "All" || file.allocator === selectedAllocator

    // Check if file has all selected tags
    const fileTags = getDocumentTags(file.id)
    const matchesTags = selectedTagFilters.length === 0 || selectedTagFilters.every((tagId) => fileTags.includes(tagId))

    return (
      matchesSearch &&
      matchesCategory &&
      matchesManager &&
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
    setSelectedManager("All")
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

  const handleBulkDownload = async () => {
    if (selectedDocuments.length === 0) return

    setIsBulkActionLoading(true)

    // Simulate bulk download
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if ((window as any).addNotification) {
      ;(window as any).addNotification({
        title: "Bulk Download Started",
        message: `Preparing ${selectedDocuments.length} documents for download.`,
        type: "success",
      })
    }

    setSelectedDocuments([])
    setIsBulkActionLoading(false)
  }

  const handleBulkStar = async () => {
    if (selectedDocuments.length === 0) return

    setIsBulkActionLoading(true)

    // Simulate bulk starring
    await new Promise((resolve) => setTimeout(resolve, 1000))

    selectedDocuments.forEach((docId) => {
      if (!starredFiles.includes(docId)) {
        setStarredFiles((prev) => [...prev, docId])
      }
    })

    if ((window as any).addNotification) {
      ;(window as any).addNotification({
        title: "Documents Starred",
        message: `${selectedDocuments.length} documents have been added to starred.`,
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
                <RoleIndicator role="allocator" />
              </div>
              <p className="text-baseGray">Access and manage shared files from your managers</p>
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
                    <DialogDescription>Upload files to share with your managers</DialogDescription>
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
                          {[
                            "Reports",
                            "Presentations",
                            "Analysis",
                            "Due Diligence",
                            "Portfolio",
                            "Compliance",
                            "Strategy",
                          ].map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                          Tags (comma separated)
                        </label>
                        <Input id="tags" placeholder="Performance, Report, etc." />
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
                  <label className="text-sm font-medium">Manager</label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                  >
                    {managers.map((manager) => (
                      <option key={manager} value={manager}>
                        {manager === "All" ? "All Managers" : manager}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Allocator</label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={selectedAllocator}
                    onChange={(e) => setSelectedAllocator(e.target.value)}
                  >
                    {allocators.map((allocator) => (
                      <option key={allocator} value={allocator}>
                        {allocator === "All" ? "All Allocators" : allocator}
                      </option>
                    ))}
                  </select>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center justify-between">
                        <span>{selectedCategory}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                      {[
                        "All",
                        "Reports",
                        "Presentations",
                        "Analysis",
                        "Due Diligence",
                        "Portfolio",
                        "Compliance",
                        "Strategy",
                      ].map((category) => (
                        <DropdownMenuItem
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={selectedCategory === category ? "bg-gray-100 font-medium" : ""}
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                        onClick={handleBulkDownload}
                        disabled={isBulkActionLoading}
                        className="gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download All
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkStar}
                        disabled={isBulkActionLoading}
                        className="gap-1"
                      >
                        <Star className="h-4 w-4" />
                        Star All
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

              {/* Tabs for different file views */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Files</TabsTrigger>
                  <TabsTrigger value="starred">Starred</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
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
                                    <DropdownMenuItem className="flex items-center">
                                      <Share2 className="mr-2 h-4 w-4" />
                                      Share
                                    </DropdownMenuItem>
                                    {userRole === "manager" && (
                                      <DropdownMenuItem
                                        className="flex items-center"
                                        onClick={() => setSelectedFileId(file.id)}
                                      >
                                        <Users className="mr-2 h-4 w-4" />
                                        Manage Access
                                      </DropdownMenuItem>
                                    )}
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
                            <div className="mt-1 mb-2">
                              <span className="text-xs text-gray-500">From: </span>
                              <span className="text-xs font-medium text-deepBrand">{file.managerName}</span>
                            </div>
                            <div className="mb-2">
                              <PermissionBadge level={file.permissionLevel} />
                            </div>

                            {/* Document tags */}
                            <div className="mb-2">
                              <TagManager
                                tags={tags}
                                selectedTags={getDocumentTags(file.id)}
                                onTagSelect={(tagId) => handleAddTagToDocument(file.id, tagId)}
                                onTagRemove={(tagId) => handleRemoveTagFromDocument(file.id, tagId)}
                                readOnly={userRole !== "manager"}
                              />
                            </div>

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
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Manager
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Tags
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Size
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Uploaded
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Access
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                    <div className="text-sm text-gray-500">{file.type.toUpperCase()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-deepBrand">{file.managerName}</div>
                              </td>
                              <td className="px-6 py-4">
                                <TagManager
                                  tags={tags}
                                  selectedTags={getDocumentTags(file.id)}
                                  onTagSelect={(tagId) => handleAddTagToDocument(file.id, tagId)}
                                  onTagRemove={(tagId) => handleRemoveTagFromDocument(file.id, tagId)}
                                  readOnly={userRole !== "manager"}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{file.category}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.size}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(file.uploadDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <PermissionBadge level={file.permissionLevel} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex space-x-2">
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
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Download className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Share2 className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  {userRole === "manager" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => setSelectedFileId(file.id)}
                                    >
                                      <Users className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="starred">
                  {/* Starred files content - similar to "all" but filtered for starred files */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredFiles
                      .filter((file) => starredFiles.includes(file.id))
                      .map((file) => (
                        <div
                          key={file.id}
                          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {/* File card content - same as in the "all" tab */}
                          <div className="p-4 flex flex-col h-full">
                            {/* Same content as in the "all" tab */}
                            <div className="flex items-start justify-between mb-3">
                              {getFileIcon(file.type)}
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => toggleStar(file.id)}
                                >
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                </Button>
                                {/* More actions */}
                              </div>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1 truncate">{file.name}</h3>
                            {/* Other file details */}
                            <TagManager
                              tags={tags}
                              selectedTags={getDocumentTags(file.id)}
                              onTagSelect={(tagId) => handleAddTagToDocument(file.id, tagId)}
                              onTagRemove={(tagId) => handleRemoveTagFromDocument(file.id, tagId)}
                              readOnly={userRole !== "manager"}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="recent">
                  {/* Recent files content - similar to "all" but sorted by date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredFiles
                      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                      .slice(0, 6)
                      .map((file) => (
                        <div
                          key={file.id}
                          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {/* File card content - same as in the "all" tab */}
                          <div className="p-4 flex flex-col h-full">
                            {/* Same content as in the "all" tab */}
                            <div className="flex items-start justify-between mb-3">
                              {getFileIcon(file.type)}
                              <div className="flex space-x-1">
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
                                {/* More actions */}
                              </div>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1 truncate">{file.name}</h3>
                            {/* Other file details */}
                            <TagManager
                              tags={tags}
                              selectedTags={getDocumentTags(file.id)}
                              onTagSelect={(tagId) => handleAddTagToDocument(file.id, tagId)}
                              onTagRemove={(tagId) => handleRemoveTagFromDocument(file.id, tagId)}
                              readOnly={userRole !== "manager"}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Access Control Manager for the selected file */}
        {selectedFileId && (
          <AccessControlManager
            resourceId={selectedFileId.toString()}
            resourceName={files.find((f) => f.id === selectedFileId)?.name || "Document"}
            resourceType="document"
            onSaveAccess={(users, groups) => {
              console.log("Access updated for users:", users, "and groups:", groups)
              setSelectedFileId(null)
            }}
          />
        )}
      </div>
    </Screen>
  )
}
