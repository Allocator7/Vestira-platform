"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Upload,
  Eye,
  Download,
  Calendar,
  User,
  Building,
  Clock,
  FileText,
  Users,
  Lock,
  MoreHorizontal,
  Edit,
  Trash2,
  Printer,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DropdownItem {
  label: string
  icon: React.ReactNode
  onClick: () => void
  className?: string
}

interface CustomDropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownItem[]
}

function CustomDropdownMenu({ trigger, items }: CustomDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleItemClick = (onClick: () => void) => {
    onClick()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
          {items.map((item, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${item.className || ""}`}
              onClick={() => handleItemClick(item.onClick)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface Document {
  id: string
  title: string
  description: string
  author: string
  authorAvatar: string
  organization: string
  uploadDate: string
  lastAccessed: string
  size: string
  classification: "Restricted Documents" | "Client-Specific Documents" | "Internal Documents"
  type: string
  clientAccess: string[]
  teamAccess: string[]
  isInternal?: boolean
  managers?: string[] // Added field for managers
  consultants?: string[] // Added field for consultants
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Board Meeting Minutes - Q4 2024",
    description: "Confidential board meeting minutes and strategic decisions.",
    author: "Amanda Foster",
    authorAvatar: "/placeholder-user.jpg",
    organization: "Investment Firm",
    uploadDate: "1/14/2024",
    lastAccessed: "1/19/2024",
    size: "0.8 MB",
    classification: "Restricted Documents",
    type: "Board Minutes",
    clientAccess: [],
    teamAccess: ["Senior Management"],
    managers: ["Asset Manager", "Portfolio Manager"],
    consultants: [],
  },
  {
    id: "2",
    title: "CalPERS Q4 Performance Report",
    description: "Quarterly performance analysis and market outlook for CalPERS.",
    author: "Michael Chen",
    authorAvatar: "/placeholder-user.jpg",
    organization: "CalPERS",
    uploadDate: "1/12/2024",
    lastAccessed: "1/18/2024",
    size: "2.1 MB",
    classification: "Client-Specific Documents",
    type: "Quarterly Report",
    clientAccess: ["CalPERS"],
    teamAccess: ["Investment Team", "Client Relations"],
    managers: ["Fund Manager"],
    consultants: ["Investment Consultant"],
  },
  {
    id: "3",
    title: "Manager Marketing Presentation",
    description: "Marketing materials for fund presentation to allocators.",
    author: "Sarah Johnson",
    authorAvatar: "/placeholder-user.jpg",
    organization: "Investment Firm",
    uploadDate: "1/10/2024",
    lastAccessed: "1/17/2024",
    size: "1.5 MB",
    classification: "Internal Documents",
    type: "Marketing Materials",
    clientAccess: [],
    teamAccess: ["Marketing Team", "Investment Team"],
    isInternal: true,
    managers: ["Asset Manager", "Fund Manager"],
    consultants: [],
  },
  {
    id: "4",
    title: "Consultant Advisory Brief",
    description: "Advisory brief for consultant recommendations and insights.",
    author: "David Rodriguez",
    authorAvatar: "/placeholder-user.jpg",
    organization: "Investment Firm",
    uploadDate: "1/08/2024",
    lastAccessed: "1/16/2024",
    size: "1.2 MB",
    classification: "Internal Documents",
    type: "Advisory Brief",
    clientAccess: [],
    teamAccess: ["Advisory Team", "Research"],
    managers: [],
    consultants: ["Advisory Consultant", "Risk Consultant"],
  },
  {
    id: "5",
    title: "Industry Group Event Flyer",
    description: "Event promotional materials for industry networking event.",
    author: "Emily Watson",
    authorAvatar: "/placeholder-user.jpg",
    organization: "Investment Firm",
    uploadDate: "1/05/2024",
    lastAccessed: "1/15/2024",
    size: "3.7 MB",
    classification: "Internal Documents",
    type: "Event Materials",
    clientAccess: [],
    teamAccess: ["Events Team", "Marketing"],
    managers: ["Portfolio Manager"],
    consultants: ["Investment Consultant"],
  },
]

export default function DocumentManagementPageClient() {
  const { toast } = useToast()

  // Wrap toast so we never crash if the provider isn't mounted
  const notify = (opts: Parameters<typeof toast>[0]) => {
    return typeof toast === "function" ? toast(opts) : console.log("[toast fallback]", opts)
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("Date")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showAccessDialog, setShowAccessDialog] = useState(false)
  const [showFiltersDialog, setShowFiltersDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [isUploading, setIsUploading] = useState(false)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    classification: "Internal Documents" as "Restricted Documents" | "Client-Specific Documents" | "Internal Documents",
    type: "",
  })

  // Add this useEffect after the state declarations
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menus = document.querySelectorAll("[data-dropdown-menu]")
      menus.forEach((menu) => {
        const menuElement = menu as HTMLElement
        if (!menuElement.contains(event.target as Node)) {
          menuElement.style.display = "none"
        }
      })
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    classification: "Internal Documents" as "Restricted Documents" | "Client-Specific Documents" | "Internal Documents",
    type: "",
    clientAccess: [] as string[],
    teamAccess: [] as string[],
    file: null as File | null,
    managers: [] as string[],
    consultants: [] as string[],
  })

  // Filter state - updated to include managers and consultants separately
  const [filters, setFilters] = useState({
    classifications: [] as string[],
    types: [] as string[],
    authors: [] as string[],
    managers: [] as string[],
    consultants: [] as string[],
    dateRange: "all" as string,
  })

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply additional filters
    const matchesClassification =
      filters.classifications.length === 0 || filters.classifications.includes(doc.classification)
    const matchesType = filters.types.length === 0 || filters.types.includes(doc.type)
    const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(doc.author)

    // Updated filter logic for managers and consultants using the dedicated fields
    const matchesManager =
      filters.managers.length === 0 ||
      (doc.managers && filters.managers.some((manager) => doc.managers!.includes(manager)))

    const matchesConsultant =
      filters.consultants.length === 0 ||
      (doc.consultants && filters.consultants.some((consultant) => doc.consultants!.includes(consultant)))

    return matchesSearch && matchesClassification && matchesType && matchesAuthor && matchesManager && matchesConsultant
  })

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Restricted Documents":
        return "bg-red-100 text-red-800 border-red-200"
      case "Client-Specific Documents":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Internal Documents":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "Restricted Documents":
        return <Lock className="h-3 w-3" />
      case "Client-Specific Documents":
        return <Shield className="h-3 w-3" />
      case "Internal Documents":
        return <Users className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  // Enhanced Download Function
  const handleDownloadDocument = async (document: Document) => {
    console.log("Download function called for:", document.title)
    if (isDownloading) {
      console.log("Download already in progress")
      return
    }

    setIsDownloading(true)

    notify({
      title: "Download Started",
      description: `Preparing ${document.title} for download...`,
    })

    try {
      // Create document content based on classification
      let documentContent = ""
      const timestamp = new Date().toISOString()
      
      switch (document.classification) {
        case "Restricted Documents":
          documentContent = `RESTRICTED DOCUMENT - CONFIDENTIAL
================================================================================

DOCUMENT INFORMATION:
Title: ${document.title}
Author: ${document.author}
Organization: ${document.organization}
Upload Date: ${document.uploadDate}
Last Accessed: ${document.lastAccessed}
Document Size: ${document.size}
Classification: RESTRICTED
Security Level: HIGH

DESCRIPTION:
${document.description}

DOCUMENT CONTENT:
This is a restricted document containing confidential information that requires 
special handling and access controls. This document may contain:

- Proprietary business information
- Financial data and projections
- Strategic planning documents
- Legal and compliance information
- Personnel and HR data

SECURITY REQUIREMENTS:
- Access limited to authorized personnel only
- No sharing outside the organization
- Must be stored securely
- Requires proper disposal procedures

DOCUMENT DETAILS:
- Created: ${document.uploadDate}
- Last Modified: ${document.lastAccessed}
- Access Level: Restricted
- Retention Period: As per company policy

================================================================================
Generated: ${timestamp}
This document was downloaded from the Vestira platform.`
          break
        case "Client-Specific Documents":
          documentContent = `CLIENT-SPECIFIC DOCUMENT
================================================================================

DOCUMENT INFORMATION:
Title: ${document.title}
Author: ${document.author}
Organization: ${document.organization}
Upload Date: ${document.uploadDate}
Last Accessed: ${document.lastAccessed}
Document Size: ${document.size}
Classification: CLIENT-SPECIFIC
Security Level: MEDIUM

DESCRIPTION:
${document.description}

DOCUMENT CONTENT:
This document contains client-specific information and materials that should be 
handled according to client confidentiality requirements. This document may include:

- Client investment strategies
- Portfolio performance data
- Due diligence materials
- Client communications
- Meeting notes and summaries

CLIENT REQUIREMENTS:
- Handle according to client confidentiality agreements
- Share only with authorized client representatives
- Maintain client data security standards
- Follow client-specific retention policies

DOCUMENT DETAILS:
- Created: ${document.uploadDate}
- Last Modified: ${document.lastAccessed}
- Access Level: Client-Specific
- Retention Period: As per client agreement

================================================================================
Generated: ${timestamp}
This document was downloaded from the Vestira platform.`
          break
        case "Internal Documents":
          documentContent = `INTERNAL DOCUMENT
================================================================================

DOCUMENT INFORMATION:
Title: ${document.title}
Author: ${document.author}
Organization: ${document.organization}
Upload Date: ${document.uploadDate}
Last Accessed: ${document.lastAccessed}
Document Size: ${document.size}
Classification: INTERNAL
Security Level: STANDARD

DESCRIPTION:
${document.description}

DOCUMENT CONTENT:
This is an internal document for organizational use only. This document may contain:

- Marketing materials and presentations
- Internal policies and procedures
- Training materials
- Administrative documents
- General business information

INTERNAL USE ONLY:
- For internal organizational use
- May be shared with team members
- Follow standard document handling procedures
- Maintain organizational confidentiality

DOCUMENT DETAILS:
- Created: ${document.uploadDate}
- Last Modified: ${document.lastAccessed}
- Access Level: Internal
- Retention Period: Standard organizational policy

================================================================================
Generated: ${timestamp}
This document was downloaded from the Vestira platform.`
          break
        default:
          documentContent = `DOCUMENT
================================================================================

DOCUMENT INFORMATION:
Title: ${document.title}
Author: ${document.author}
Organization: ${document.organization}
Upload Date: ${document.uploadDate}
Last Accessed: ${document.lastAccessed}
Document Size: ${document.size}
Classification: GENERAL

DESCRIPTION:
${document.description}

DOCUMENT CONTENT:
This is a general document from the Vestira platform.

DOCUMENT DETAILS:
- Created: ${document.uploadDate}
- Last Modified: ${document.lastAccessed}
- Access Level: General

================================================================================
Generated: ${timestamp}
This document was downloaded from the Vestira platform.`
      }

      // Create and download the file
      const blob = new Blob([documentContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setIsDownloading(false)
      notify({
        title: "Download Complete",
        description: `${document.title} has been downloaded successfully.`,
      })
    } catch (error) {
      console.log("Download error caught:", error)
      console.error("Download error:", error)
      setIsDownloading(false)
      notify({
        title: "Download Failed",
        description: "There was an error downloading the document. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Enhanced Print Function
  const handlePrintDocument = async (document: Document) => {
    if (isPrinting) return

    setIsPrinting(true)

    notify({
      title: "Print Started",
      description: `Preparing ${document.title} for printing...`,
    })

    try {
      // Simulate print preparation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print: ${document.title}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 40px; 
                  line-height: 1.6; 
                }
                .header { 
                  border-bottom: 2px solid #333; 
                  padding-bottom: 20px; 
                  margin-bottom: 30px; 
                }
                .title { 
                  font-size: 24px; 
                  font-weight: bold; 
                  margin-bottom: 10px; 
                }
                .meta { 
                  color: #666; 
                  font-size: 14px; 
                  margin-bottom: 5px; 
                }
                .classification { 
                  display: inline-block; 
                  padding: 4px 8px; 
                  border-radius: 4px; 
                  font-size: 12px; 
                  font-weight: bold; 
                  margin-top: 10px;
                  ${
                    document.classification === "Restricted Documents"
                      ? "background-color: #fee2e2; color: #991b1b;"
                      : document.classification === "Client-Specific Documents"
                        ? "background-color: #fed7aa; color: #9a3412;"
                        : "background-color: #dbeafe; color: #1e40af;"
                  }
                }
                .content { 
                  margin-top: 30px; 
                }
                .section { 
                  margin-bottom: 25px; 
                }
                .section-title { 
                  font-size: 18px; 
                  font-weight: bold; 
                  margin-bottom: 10px; 
                  color: #333; 
                }
                @media print {
                  body { margin: 20px; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="title">${document.title}</div>
                <div class="meta">Author: ${document.author}</div>
                <div class="meta">Organization: ${document.organization}</div>
                <div class="meta">Date: ${document.uploadDate}</div>
                <div class="meta">Size: ${document.size}</div>
                <div class="classification">${document.classification}</div>
              </div>
              
              <div class="content">
                <div class="section">
                  <div class="section-title">Description</div>
                  <p>${document.description}</p>
                </div>
                
                <div class="section">
                  <div class="section-title">Document Type</div>
                  <p>${document.type}</p>
                </div>
                
                <div class="section">
                  <div class="section-title">Access Information</div>
                  <p><strong>Team Access:</strong> ${document.teamAccess.join(", ") || "None"}</p>
                  <p><strong>Client Access:</strong> ${document.clientAccess.join(", ") || "None"}</p>
                </div>
                
                <div class="section">
                  <div class="section-title">Security Notice</div>
                  <p>This document is classified as <strong>${document.classification}</strong>. 
                  Unauthorized distribution or disclosure is prohibited. Please ensure compliance 
                  with organizational security policies.</p>
                </div>
              </div>
              
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                };
              </script>
            </body>
          </html>
        `

        printWindow.document.write(printContent)
        printWindow.document.close()
      }

      notify({
        title: "Print Ready",
        description: `${document.title} has been sent to the printer.`,
      })
    } catch (error) {
      console.log("Download error caught:", error)
      notify({
        title: "Print Failed",
        description: "There was an error preparing the document for printing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPrinting(false)
    }
  }

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document)
    setEditForm({
      title: document.title,
      description: document.description,
      classification: document.classification,
      type: document.type,
    })
    setShowEditDialog(true)
    notify({
      title: "Opening Editor",
      description: `Opening ${document.title} for editing...`,
    })
  }

  const handleManageAccess = (document: Document) => {
    setSelectedDocument(document)
    setShowAccessDialog(true)
    notify({
      title: "Opening Access Manager",
      description: `Managing access permissions for ${document.title}...`,
    })
  }

  // Direct button click handler
  const handleUploadButtonClick = () => {
    console.log("Upload button clicked") // Debug log
    setShowUploadDialog(true)
  }

  const handleCloseUploadDialog = () => {
    setShowUploadDialog(false)
    // Reset form when dialog closes
    setUploadForm({
      title: "",
      description: "",
      classification: "Internal Documents",
      type: "",
      clientAccess: [],
      teamAccess: [],
      file: null,
      managers: [],
      consultants: [],
    })
  }

  const handleUpload = async () => {
    console.log("Upload function called") // Debug log

    if (!uploadForm.title.trim()) {
      notify({
        title: "Missing Information",
        description: "Please enter a document title.",
        variant: "destructive",
      })
      return
    }

    if (!uploadForm.file) {
      notify({
        title: "Missing File",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    // Enhanced access validation
    const totalAccessGranted = uploadForm.clientAccess.length + uploadForm.teamAccess.length

    if (totalAccessGranted === 0) {
      notify({
        title: "Access Required",
        description: "Please select at least one person who can access this document.",
        variant: "destructive",
      })
      return
    }

    // Clear client access for non-client-specific documents
    if (uploadForm.classification !== "Client-Specific Documents") {
      setUploadForm((prev) => ({ ...prev, clientAccess: [] }))
    }

    // Validate file size (10MB limit)
    if (uploadForm.file.size > 10 * 1024 * 1024) {
      notify({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Show upload started toast
    notify({
      title: "Upload Started",
      description: `Uploading ${uploadForm.title} with access for ${totalAccessGranted} people...`,
    })

    try {
      // Simulate upload process with progress
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDocument: Document = {
        id: (documents.length + 1).toString(),
        title: uploadForm.title,
        description: uploadForm.description,
        author: "Current User",
        authorAvatar: "/placeholder-user.jpg",
        organization: "Your Organization",
        uploadDate: new Date().toLocaleDateString(),
        lastAccessed: new Date().toLocaleDateString(),
        size: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
        classification: uploadForm.classification,
        type: uploadForm.type || "Document",
        clientAccess: uploadForm.clientAccess,
        teamAccess: uploadForm.teamAccess,
        managers: uploadForm.managers,
        consultants: uploadForm.consultants,
      }

      setDocuments([newDocument, ...documents])

      notify({
        title: "Document Uploaded Successfully",
        description: `${uploadForm.title} has been uploaded and is accessible to ${totalAccessGranted} people.`,
      })

      handleCloseUploadDialog()
    } catch (error) {
      console.log("Download error caught:", error)
      notify({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setShowDocumentViewer(true)
    notify({
      title: "Opening Document Viewer",
      description: `Loading ${document.title} for viewing...`,
    })
  }

  const handleShareDocument = async (document: Document) => {
    try {
      // Create a shareable link
      const shareUrl = `${window.location.origin}/documents/${document.id}`

      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: document.description,
          url: shareUrl,
        })
        notify({
          title: "Document Shared",
          description: `${document.title} has been shared successfully.`,
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl)
        notify({
          title: "Share Link Copied",
          description: `Share link for ${document.title} copied to clipboard.`,
        })
      }
    } catch (error) {
      console.log("Download error caught:", error)
      notify({
        title: "Share Failed",
        description: "Could not share the document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDocument = (document: Document) => {
    // Show confirmation before deleting
    if (window.confirm(`Are you sure you want to delete "${document.title}"? This action cannot be undone.`)) {
      setDocuments(documents.filter((doc) => doc.id !== document.id))
      notify({
        title: "Document Deleted",
        description: `${document.title} has been permanently deleted.`,
        variant: "destructive",
      })
    }
  }

  const handleFiltersButtonClick = () => {
    console.log("Filters button clicked") // Debug log
    setShowFiltersDialog(true)
  }

  const applyFilters = () => {
    setShowFiltersDialog(false)
    notify({
      title: "Filters Applied",
      description: "Document filters have been updated successfully.",
    })
  }

  const clearFilters = () => {
    setFilters({
      classifications: [],
      types: [],
      authors: [],
      managers: [],
      consultants: [],
      dateRange: "all",
    })
    notify({
      title: "Filters Cleared",
      description: "All filters have been reset to default.",
    })
  }

  const handleSaveAccess = () => {
    notify({
      title: "Access Updated",
      description: "Document access permissions have been updated successfully.",
    })
    setShowAccessDialog(false)
  }

  const classificationCounts = {
    restricted: documents.filter((d) => d.classification === "Restricted Documents").length,
    clientSpecific: documents.filter((d) => d.classification === "Client-Specific Documents").length,
    internal: documents.filter((d) => d.classification === "Internal Documents").length,
  }

  // Individual team members and clients
  const clientRepresentatives = [
    { id: "john-calpers", name: "John Smith", organization: "CalPERS", role: "Investment Director" },
    { id: "maria-calpers", name: "Maria Garcia", organization: "CalPERS", role: "Senior Analyst" },
    { id: "thomas-teachers", name: "Thomas Brown", organization: "State Teachers Pension", role: "Portfolio Manager" },
    { id: "jennifer-endowment", name: "Jennifer Davis", organization: "University Endowment", role: "CIO" },
    { id: "william-pension", name: "William Johnson", organization: "Corporate Pension Fund", role: "Director" },
  ]

  const teamMembers = [
    { id: "sarah-investment", name: "Sarah Johnson", team: "Investment Team", role: "Portfolio Manager" },
    { id: "michael-investment", name: "Michael Chen", team: "Investment Team", role: "Senior Analyst" },
    { id: "amanda-relations", name: "Amanda Foster", team: "Client Relations", role: "Relationship Manager" },
    { id: "david-legal", name: "David Rodriguez", team: "Legal Team", role: "Legal Counsel" },
    { id: "emily-research", name: "Emily Watson", team: "Research Team", role: "Research Director" },
    { id: "robert-senior", name: "Robert Kim", team: "Senior Management", role: "Managing Director" },
    { id: "lisa-compliance", name: "Lisa Zhang", team: "Compliance Team", role: "Compliance Officer" },
    { id: "james-operations", name: "James Wilson", team: "Operations", role: "Operations Manager" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-deepBrand">Document Management</h1>
              <p className="text-baseGray mt-1">Organize and manage documents by type</p>
            </div>
            <Button onClick={handleUploadButtonClick} className="bg-electric-blue hover:bg-electric-blue/90 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* Document Type Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-red-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Restricted Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{classificationCounts.restricted}</div>
                <p className="text-xs text-red-600 mt-1">Confidential, not shareable</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Client-Specific Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">{classificationCounts.clientSpecific}</div>
                <p className="text-xs text-orange-600 mt-1">Quarterly reports and client materials</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  <Users className="h-4 w-4 inline mr-2" />
                  Internal Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{classificationCounts.internal}</div>
                <p className="text-xs text-blue-600 mt-1">Marketing materials, advisory docs, flyers</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-baseGray h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Date">Sort by Date</SelectItem>
                    <SelectItem value="Title">Sort by Title</SelectItem>
                    <SelectItem value="Author">Sort by Author</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleFiltersButtonClick}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <FileText className="h-6 w-6 text-baseGray" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-deepBrand truncate">{document.title}</h3>
                          {document.isInternal && (
                            <Badge variant="outline" className="text-xs">
                              Internal
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-baseGray mb-3 line-clamp-2">{document.description}</p>
                        <div className="flex items-center gap-4 text-xs text-baseGray">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{document.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{document.organization}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{document.uploadDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{document.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge className={`${getClassificationColor(document.classification)} flex items-center gap-1`}>
                        {getClassificationIcon(document.classification)}
                        {document.classification}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(document)}
                          className="flex items-center gap-1"
                          disabled={isDownloading}
                        >
                          <Download className="h-3 w-3" />
                          {isDownloading ? "Downloading..." : "Download"}
                        </Button>
                        <CustomDropdownMenu
                          trigger={
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          }
                          items={[
                            {
                              label: "Edit Document",
                              icon: <Edit className="h-4 w-4 mr-2" />,
                              onClick: () => handleEditDocument(document),
                            },
                            {
                              label: "Manage Access",
                              icon: <Users className="h-4 w-4 mr-2" />,
                              onClick: () => handleManageAccess(document),
                            },
                            {
                              label: "Delete Document",
                              icon: <Trash2 className="h-4 w-4 mr-2" />,
                              onClick: () => handleDeleteDocument(document),
                              className: "text-red-600 focus:text-red-600",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs text-baseGray">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>Client Access: {document.clientAccess.join(", ") || "None"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Last accessed: {document.lastAccessed}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upload Dialog */}
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>Upload a new document and set its type and access permissions.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-title">Document Title *</Label>
                  <Input
                    id="upload-title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="Enter document title"
                    disabled={isUploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upload-description">Description</Label>
                  <Textarea
                    id="upload-description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder="Brief description of the document"
                    rows={3}
                    disabled={isUploading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload-classification">Document Type *</Label>
                    <Select
                      value={uploadForm.classification}
                      onValueChange={(
                        value: "Restricted Documents" | "Client-Specific Documents" | "Internal Documents",
                      ) => setUploadForm({ ...uploadForm, classification: value })}
                      disabled={isUploading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Restricted Documents">Restricted Documents</SelectItem>
                        <SelectItem value="Client-Specific Documents">Client-Specific Documents</SelectItem>
                        <SelectItem value="Internal Documents">Internal Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-type">Document Category</Label>
                    <Input
                      id="upload-type"
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                      placeholder="e.g., Quarterly Report"
                      disabled={isUploading}
                    />
                  </div>
                </div>

                {/* Access Control Section */}
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Document Access Control</Label>
                    <p className="text-xs text-baseGray mb-4">
                      Select who can access this document. At least one person must be granted access.
                    </p>
                  </div>

                  {/* Client Access - Only show for Client-Specific Documents */}
                  {uploadForm.classification === "Client-Specific Documents" && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Client Representatives</Label>
                      <div className="max-h-32 overflow-y-auto border rounded-lg p-3 space-y-2">
                        {clientRepresentatives.map((client) => (
                          <div key={client.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={`upload-client-${client.id}`}
                              checked={uploadForm.clientAccess.includes(`${client.name} (${client.organization})`)}
                              onCheckedChange={(checked) => {
                                const clientName = `${client.name} (${client.organization})`
                                if (checked) {
                                  setUploadForm({
                                    ...uploadForm,
                                    clientAccess: [...uploadForm.clientAccess, clientName],
                                  })
                                } else {
                                  setUploadForm({
                                    ...uploadForm,
                                    clientAccess: uploadForm.clientAccess.filter((c) => c !== clientName),
                                  })
                                }
                              }}
                              disabled={isUploading}
                            />
                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={`upload-client-${client.id}`}
                                className="text-sm font-medium cursor-pointer block truncate"
                              >
                                {client.name}
                              </Label>
                              <p className="text-xs text-baseGray truncate">
                                {client.organization} • {client.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {uploadForm.clientAccess.length > 0 && (
                        <div className="text-xs text-green-600">
                          ✓ {uploadForm.clientAccess.length} client representative(s) selected
                        </div>
                      )}
                    </div>
                  )}

                  {/* Team Access - Always available */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Team Members</Label>
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={`upload-team-${member.id}`}
                            checked={uploadForm.teamAccess.includes(`${member.name} (${member.team})`)}
                            onCheckedChange={(checked) => {
                              const memberName = `${member.name} (${member.team})`
                              if (checked) {
                                setUploadForm({
                                  ...uploadForm,
                                  teamAccess: [...uploadForm.teamAccess, memberName],
                                })
                              } else {
                                setUploadForm({
                                  ...uploadForm,
                                  teamAccess: uploadForm.teamAccess.filter((t) => t !== memberName),
                                })
                              }
                            }}
                            disabled={isUploading}
                          />
                          <div className="flex-1 min-w-0">
                            <Label
                              htmlFor={`upload-team-${member.id}`}
                              className="text-sm font-medium cursor-pointer block truncate"
                            >
                              {member.name}
                            </Label>
                            <p className="text-xs text-baseGray truncate">
                              {member.team} • {member.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {uploadForm.teamAccess.length > 0 && (
                      <div className="text-xs text-green-600">
                        ✓ {uploadForm.teamAccess.length} team member(s) selected
                      </div>
                    )}
                  </div>

                  {/* Access Summary */}
                  {(uploadForm.clientAccess.length > 0 || uploadForm.teamAccess.length > 0) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Access Summary</h4>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>
                          Total Access Granted: {uploadForm.clientAccess.length + uploadForm.teamAccess.length} people
                        </div>
                        {uploadForm.classification === "Client-Specific Documents" && (
                          <div>Client Representatives: {uploadForm.clientAccess.length}</div>
                        )}
                        <div>Team Members: {uploadForm.teamAccess.length}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-file">File *</Label>
                  <Input
                    id="upload-file"
                    type="file"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    disabled={isUploading}
                  />
                  <p className="text-sm text-baseGray">Supported formats: PDF, Word, Excel, PowerPoint (Max 10MB)</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseUploadDialog} disabled={isUploading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-electric-blue hover:bg-electric-blue/90"
                >
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Filters Dialog */}
          <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Filter Documents</DialogTitle>
                <DialogDescription>Apply filters to narrow down your document search.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Document Type</Label>
                  <div className="space-y-2 mt-2">
                    {["Restricted Documents", "Client-Specific Documents", "Internal Documents"].map(
                      (classification) => (
                        <div key={classification} className="flex items-center space-x-2">
                          <Checkbox
                            id={classification}
                            checked={filters.classifications.includes(classification)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({
                                  ...filters,
                                  classifications: [...filters.classifications, classification],
                                })
                              } else {
                                setFilters({
                                  ...filters,
                                  classifications: filters.classifications.filter((c) => c !== classification),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={classification} className="text-sm">
                            {classification}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Document Category</Label>
                  <div className="space-y-2 mt-2">
                    {["Quarterly Report", "Marketing Materials", "Advisory Brief", "Event Materials"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={filters.types.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                types: [...filters.types, type],
                              })
                            } else {
                              setFilters({
                                ...filters,
                                types: filters.types.filter((t) => t !== type),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={type} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Manager</Label>
                  <div className="space-y-2 mt-2">
                    {["Asset Manager", "Fund Manager", "Portfolio Manager"].map((manager) => (
                      <div key={manager} className="flex items-center space-x-2">
                        <Checkbox
                          id={manager}
                          checked={filters.managers.includes(manager)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                managers: [...filters.managers, manager],
                              })
                            } else {
                              setFilters({
                                ...filters,
                                managers: filters.managers.filter((m) => m !== manager),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={manager} className="text-sm">
                          {manager}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Consultant</Label>
                  <div className="space-y-2 mt-2">
                    {["Investment Consultant", "Advisory Consultant", "Risk Consultant"].map((consultant) => (
                      <div key={consultant} className="flex items-center space-x-2">
                        <Checkbox
                          id={consultant}
                          checked={filters.consultants.includes(consultant)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                consultants: [...filters.consultants, consultant],
                              })
                            } else {
                              setFilters({
                                ...filters,
                                consultants: filters.consultants.filter((c) => c !== consultant),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={consultant} className="text-sm">
                          {consultant}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button onClick={applyFilters} className="bg-electric-blue hover:bg-electric-blue/90">
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Document Details Modal */}
          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Document Details</DialogTitle>
                <DialogDescription>Detailed information about the selected document</DialogDescription>
              </DialogHeader>
              {selectedDocument && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Title</Label>
                      <p className="text-sm text-baseGray">{selectedDocument.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <Badge className={`${getClassificationColor(selectedDocument.classification)} mt-1`}>
                        {getClassificationIcon(selectedDocument.classification)}
                        {selectedDocument.classification}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-baseGray">{selectedDocument.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Author</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedDocument.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{selectedDocument.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-baseGray">{selectedDocument.author}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Organization</Label>
                      <p className="text-sm text-baseGray">{selectedDocument.organization}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Upload Date</Label>
                      <p className="text-sm text-baseGray">{selectedDocument.uploadDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Accessed</Label>
                      <p className="text-sm text-baseGray">{selectedDocument.lastAccessed}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">File Size</Label>
                      <p className="text-sm text-baseGray">{selectedDocument.size}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
                  className="bg-electric-blue hover:bg-electric-blue/90"
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? "Downloading..." : "Download"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Manage Access Modal - COMPACT VERSION */}
          <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Manage Document Access</DialogTitle>
                <DialogDescription>Control who can access this document</DialogDescription>
              </DialogHeader>

              {selectedDocument && (
                <div className="flex-1 overflow-hidden flex flex-col space-y-4">
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-deepBrand text-sm mb-1">{selectedDocument.title}</h4>
                    <Badge className={`${getClassificationColor(selectedDocument.classification)} text-xs`}>
                      {getClassificationIcon(selectedDocument.classification)}
                      {selectedDocument.classification}
                    </Badge>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4">
                    {/* Client Access */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Client Access</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                        {clientRepresentatives.map((client) => (
                          <div key={client.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`client-${client.id}`}
                              defaultChecked={selectedDocument.clientAccess.some((access) =>
                                access.toLowerCase().includes(client.organization.toLowerCase().split(" ")[0]),
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={`client-${client.id}`}
                                className="text-xs font-medium cursor-pointer block truncate"
                              >
                                {client.name}
                              </Label>
                              <p className="text-xs text-baseGray truncate">
                                {client.organization} • {client.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Access */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Team Access</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`team-${member.id}`}
                              defaultChecked={selectedDocument.teamAccess.some((access) =>
                                access.toLowerCase().includes(member.team.toLowerCase().split(" ")[0]),
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={`team-${member.id}`}
                                className="text-xs font-medium cursor-pointer block truncate"
                              >
                                {member.name}
                              </Label>
                              <p className="text-xs text-baseGray truncate">
                                {member.team} • {member.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex-shrink-0">
                <Button variant="outline" onClick={() => setShowAccessDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Get all checked individuals
                    const clientCheckboxes = document.querySelectorAll('input[id^="client-"]:checked')
                    const teamCheckboxes = document.querySelectorAll('input[id^="team-"]:checked')

                    const selectedClients = Array.from(clientCheckboxes)
                      .map((cb) => {
                        const id = (cb as HTMLInputElement).id.replace("client-", "")
                        const client = clientRepresentatives.find((c) => c.id === id)
                        return client ? `${client.name} (${client.organization})` : ""
                      })
                      .filter(Boolean)

                    const selectedTeamMembers = Array.from(teamCheckboxes)
                      .map((cb) => {
                        const id = (cb as HTMLInputElement).id.replace("team-", "")
                        const member = teamMembers.find((m) => m.id === id)
                        return member ? `${member.name} (${member.team})` : ""
                      })
                      .filter(Boolean)

                    // Update the document with new access permissions
                    if (selectedDocument) {
                      const updatedDocuments = documents.map((doc) =>
                        doc.id === selectedDocument.id
                          ? {
                              ...doc,
                              clientAccess: selectedClients,
                              teamAccess: selectedTeamMembers,
                            }
                          : doc,
                      )
                      setDocuments(updatedDocuments)
                    }

                    notify({
                      title: "Access Updated",
                      description: `Access granted to ${selectedClients.length} clients and ${selectedTeamMembers.length} team members.`,
                    })
                    setShowAccessDialog(false)
                  }}
                  className="bg-electric-blue hover:bg-electric-blue/90"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Document Viewer Modal */}
          <Dialog open={showDocumentViewer} onOpenChange={setShowDocumentViewer}>
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {selectedDocument?.title}
                    </DialogTitle>
                    <DialogDescription>{selectedDocument?.description}</DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={selectedDocument ? getClassificationColor(selectedDocument.classification) : ""}>
                      {selectedDocument && getClassificationIcon(selectedDocument.classification)}
                      {selectedDocument?.classification}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              {selectedDocument && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Document Viewer Content */}
                  <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50">
                    {/* Generic Document Viewer */}
                    <div className="h-full flex flex-col">
                      <div className="bg-deepBrand text-white p-3 flex items-center justify-between text-sm flex-shrink-0">
                        <span>Document Viewer</span>
                      </div>
                      <div className="flex-1 bg-white overflow-auto">
                        <div className="p-6 max-w-4xl mx-auto">
                          <div className="space-y-6">
                            <div className="text-center border-b pb-4">
                              <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedDocument.title}</h1>
                              <p className="text-gray-600 mb-3">{selectedDocument.description}</p>
                              <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
                                <span>Type: {selectedDocument.type}</span>
                                <span>•</span>
                                <span>Size: {selectedDocument.size}</span>
                                <span>•</span>
                                <span>Modified: {selectedDocument.uploadDate}</span>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">Document Overview</h2>
                                <p className="text-gray-700 leading-relaxed">
                                  This document is classified as {selectedDocument.classification.toLowerCase()}. The
                                  content is restricted to authorized personnel as defined in the access control list.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">Content Summary</h2>
                                <p className="text-gray-700 leading-relaxed">
                                  The document provides detailed analysis and recommendations based on current market
                                  conditions and organizational requirements. Key stakeholders should review this
                                  material carefully and provide feedback through appropriate channels.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">Security Notice</h2>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lock className="h-5 w-5 text-red-600" />
                                    <span className="font-medium text-red-800">{selectedDocument.classification}</span>
                                  </div>
                                  <p className="text-red-700 text-sm">
                                    This document contains confidential information. Unauthorized access, distribution,
                                    or disclosure is strictly prohibited. Please ensure compliance with organizational
                                    security policies and procedures.
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h3 className="font-semibold text-gray-800 mb-2">Document Information</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Viewed by:</span>
                                      <span className="text-gray-800">Amanda Foster</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Last accessed:</span>
                                      <span className="text-gray-800">1/19/2024</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800 mb-2">Access Control</h3>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-600">Team Access:</span>
                                      <div className="text-gray-800">
                                        {selectedDocument.teamAccess.join(", ") || "None"}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Client Access:</span>
                                      <div className="text-gray-800">
                                        {selectedDocument.clientAccess.join(", ") || "None"}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Managers:</span>
                                      <div className="text-gray-800">
                                        {selectedDocument.managers?.join(", ") || "None"}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Consultants:</span>
                                      <div className="text-gray-800">
                                        {selectedDocument.consultants?.join(", ") || "None"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Viewer Actions */}
                  <div className="flex-shrink-0 flex items-center justify-between p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span>Viewing: {selectedDocument.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintDocument(selectedDocument)}
                        disabled={isPrinting}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        {isPrinting ? "Printing..." : "Print"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(selectedDocument)}
                        disabled={isDownloading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloading ? "Downloading..." : "Download"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex-shrink-0">
                <Button variant="outline" onClick={() => setShowDocumentViewer(false)}>
                  Close Viewer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Document Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Document</DialogTitle>
                <DialogDescription>Update document information and settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Document Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Enter document title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Brief description of the document"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-classification">Document Type</Label>
                    <Select
                      value={editForm.classification}
                      onValueChange={(
                        value: "Restricted Documents" | "Client-Specific Documents" | "Internal Documents",
                      ) => setEditForm({ ...editForm, classification: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Restricted Documents">Restricted Documents</SelectItem>
                        <SelectItem value="Client-Specific Documents">Client-Specific Documents</SelectItem>
                        <SelectItem value="Internal Documents">Internal Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Document Category</Label>
                    <Input
                      id="edit-type"
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      placeholder="e.g., Quarterly Report"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedDocument) {
                      const updatedDocuments = documents.map((doc) =>
                        doc.id === selectedDocument.id
                          ? {
                              ...doc,
                              title: editForm.title,
                              description: editForm.description,
                              classification: editForm.classification,
                              type: editForm.type,
                            }
                          : doc,
                      )
                      setDocuments(updatedDocuments)
                      notify({
                        title: "Document Updated",
                        description: `${editForm.title} has been updated successfully.`,
                      })
                      setShowEditDialog(false)
                    }
                  }}
                  className="bg-electric-blue hover:bg-electric-blue/90"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
