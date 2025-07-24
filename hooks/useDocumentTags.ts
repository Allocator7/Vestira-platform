"use client"

import { useState, useEffect } from "react"

export interface Tag {
  id: string
  name: string
  color: string
}

export interface TagWithCount extends Tag {
  count: number
}

const initialTags: Tag[] = [
  { id: "tag-aum", name: "AUM", color: "#3b82f6" },
  { id: "tag-performance", name: "Performance", color: "#10b981" },
  { id: "tag-growth", name: "Growth", color: "#8b5cf6" },
  { id: "tag-esg", name: "ESG", color: "#059669" },
  { id: "tag-sustainability", name: "Sustainability", color: "#16a34a" },
  { id: "tag-impact", name: "Impact", color: "#15803d" },
  { id: "tag-risk", name: "Risk Management", color: "#dc2626" },
  { id: "tag-infrastructure", name: "Infrastructure", color: "#7c3aed" },
  { id: "tag-monitoring", name: "Monitoring", color: "#2563eb" },
  { id: "tag-operations", name: "Operations", color: "#ea580c" },
  { id: "tag-compliance", name: "Compliance", color: "#7c2d12" },
  { id: "tag-strategy", name: "Strategy", color: "#1d4ed8" },
  { id: "tag-team", name: "Team", color: "#be123c" },
  { id: "tag-technology", name: "Technology", color: "#6366f1" },
  { id: "tag-geographic", name: "Geographic", color: "#0891b2" },
  { id: "tag-sector", name: "Sector", color: "#c2410c" },
  { id: "tag-valuation", name: "Valuation", color: "#9333ea" },
  { id: "tag-liquidity", name: "Liquidity", color: "#0d9488" },
  { id: "tag-reporting", name: "Reporting", color: "#7c3aed" },
  { id: "tag-governance", name: "Governance", color: "#be185d" },
]

export function useDocumentTags() {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [documentTags, setDocumentTags] = useState<Record<string, string[]>>({})

  // Load tags and document tags from localStorage on mount
  useEffect(() => {
    const storedTags = localStorage.getItem("vestira-tags")
    const storedDocumentTags = localStorage.getItem("vestira-document-tags")

    if (storedTags) {
      try {
        setTags(JSON.parse(storedTags))
      } catch (error) {
        console.error("Failed to parse stored tags:", error)
      }
    } else {
      // Initialize with default tags if none exist
      setTags(initialTags)
      localStorage.setItem("vestira-tags", JSON.stringify(initialTags))
    }

    if (storedDocumentTags) {
      try {
        setDocumentTags(JSON.parse(storedDocumentTags))
      } catch (error) {
        console.error("Failed to parse stored document tags:", error)
      }
    }
  }, [])

  // Save tags and document tags to localStorage whenever they change
  useEffect(() => {
    if (tags.length > 0) {
      localStorage.setItem("vestira-tags", JSON.stringify(tags))
    }
  }, [tags])

  useEffect(() => {
    if (Object.keys(documentTags).length > 0) {
      localStorage.setItem("vestira-document-tags", JSON.stringify(documentTags))
    }
  }, [documentTags])

  // Create a new tag
  const createTag = (name: string, color: string): Tag => {
    const newTag = {
      id: `tag-${Date.now()}`,
      name,
      color,
    }
    setTags([...tags, newTag])
    return newTag
  }

  // Update an existing tag
  const updateTag = (id: string, name: string, color: string): Tag | null => {
    const tagIndex = tags.findIndex((tag) => tag.id === id)
    if (tagIndex === -1) return null

    const updatedTag = { ...tags[tagIndex], name, color }
    const updatedTags = [...tags]
    updatedTags[tagIndex] = updatedTag
    setTags(updatedTags)
    return updatedTag
  }

  // Delete a tag
  const deleteTag = (id: string): boolean => {
    const tagIndex = tags.findIndex((tag) => tag.id === id)
    if (tagIndex === -1) return false

    // Remove the tag from all documents
    const updatedDocumentTags = { ...documentTags }
    Object.keys(updatedDocumentTags).forEach((docId) => {
      updatedDocumentTags[docId] = updatedDocumentTags[docId].filter((tagId) => tagId !== id)
    })
    setDocumentTags(updatedDocumentTags)

    // Remove the tag itself
    const updatedTags = tags.filter((tag) => tag.id !== id)
    setTags(updatedTags)
    return true
  }

  // Add a tag to a document
  const addTagToDocument = (documentId: string, tagId: string): boolean => {
    // Check if the tag exists
    if (!tags.some((tag) => tag.id === tagId)) return false

    // Add the tag to the document
    const currentTags = documentTags[documentId] || []
    if (currentTags.includes(tagId)) return true // Tag already added

    const updatedDocumentTags = {
      ...documentTags,
      [documentId]: [...currentTags, tagId],
    }
    setDocumentTags(updatedDocumentTags)
    return true
  }

  // Remove a tag from a document
  const removeTagFromDocument = (documentId: string, tagId: string): boolean => {
    const currentTags = documentTags[documentId]
    if (!currentTags || !currentTags.includes(tagId)) return false

    const updatedDocumentTags = {
      ...documentTags,
      [documentId]: currentTags.filter((id) => id !== tagId),
    }
    setDocumentTags(updatedDocumentTags)
    return true
  }

  // Get all tags for a document
  const getDocumentTags = (documentId: string): string[] => {
    return documentTags[documentId] || []
  }

  // Get tag details by ID
  const getTagById = (tagId: string): Tag | undefined => {
    return tags.find((tag) => tag.id === tagId)
  }

  // Get all tags with their usage counts
  const getTagsWithCounts = (): TagWithCount[] => {
    const tagCounts: Record<string, number> = {}

    // Count occurrences of each tag
    Object.values(documentTags).forEach((tagIds) => {
      tagIds.forEach((tagId) => {
        tagCounts[tagId] = (tagCounts[tagId] || 0) + 1
      })
    })

    // Map to TagWithCount objects
    return tags.map((tag) => ({
      ...tag,
      count: tagCounts[tag.id] || 0,
    }))
  }

  return {
    tags,
    documentTags,
    createTag,
    updateTag,
    deleteTag,
    addTagToDocument,
    removeTagFromDocument,
    getDocumentTags,
    getTagById,
    getTagsWithCounts,
  }
}
