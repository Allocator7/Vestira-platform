import { create } from "zustand"

export interface Document {
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
  tags?: string[]
  version?: string
  status?: "active" | "archived" | "draft"
}

export interface DocumentFilters {
  classifications: string[]
  types: string[]
  authors: string[]
  dateRange: string
  tags: string[]
}

interface DocumentStore {
  documents: Document[]
  filters: DocumentFilters
  searchTerm: string
  sortBy: string
  selectedDocument: Document | null

  // Actions
  setDocuments: (documents: Document[]) => void
  addDocument: (document: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  setFilters: (filters: Partial<DocumentFilters>) => void
  setSearchTerm: (term: string) => void
  setSortBy: (sortBy: string) => void
  setSelectedDocument: (document: Document | null) => void

  // Computed
  getFilteredDocuments: () => Document[]
  getDocumentsByClassification: (classification: string) => Document[]
  getDocumentStats: () => {
    total: number
    restricted: number
    clientSpecific: number
    internal: number
  }
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  filters: {
    classifications: [],
    types: [],
    authors: [],
    dateRange: "all",
    tags: [],
  },
  searchTerm: "",
  sortBy: "Date",
  selectedDocument: null,

  setDocuments: (documents) => set({ documents }),

  addDocument: (document) =>
    set((state) => ({
      documents: [document, ...state.documents],
    })),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)),
    })),

  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSelectedDocument: (selectedDocument) => set({ selectedDocument }),

  getFilteredDocuments: () => {
    const { documents, filters, searchTerm, sortBy } = get()

    const filtered = documents.filter((doc) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchTerm.toLowerCase())

      // Classification filter
      const matchesClassification =
        filters.classifications.length === 0 || filters.classifications.includes(doc.classification)

      // Type filter
      const matchesType = filters.types.length === 0 || filters.types.includes(doc.type)

      // Author filter
      const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(doc.author)

      // Tags filter
      const matchesTags = filters.tags.length === 0 || (doc.tags && filters.tags.some((tag) => doc.tags!.includes(tag)))

      return matchesSearch && matchesClassification && matchesType && matchesAuthor && matchesTags
    })

    // Sort documents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Title":
          return a.title.localeCompare(b.title)
        case "Author":
          return a.author.localeCompare(b.author)
        case "Date":
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      }
    })

    return filtered
  },

  getDocumentsByClassification: (classification) => {
    const { documents } = get()
    return documents.filter((doc) => doc.classification === classification)
  },

  getDocumentStats: () => {
    const { documents } = get()
    return {
      total: documents.length,
      restricted: documents.filter((d) => d.classification === "Restricted Documents").length,
      clientSpecific: documents.filter((d) => d.classification === "Client-Specific Documents").length,
      internal: documents.filter((d) => d.classification === "Internal Documents").length,
    }
  },
}))
