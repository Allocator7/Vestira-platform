"use client"

import { useState, useEffect } from "react"

export interface ResponseBankEntry {
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

export interface ResponseBankFilters {
  tags?: string[]
  section?: string
  questionType?: string
  firmId?: string
  dateRange?: {
    start: string
    end: string
  }
}

export function useResponseBank() {
  const [responseBank, setResponseBank] = useState<ResponseBankEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with some sample data for demo
  useEffect(() => {
    const sampleResponses: ResponseBankEntry[] = [
      {
        id: "resp-1",
        question: "What is your firm's total Assets Under Management (AUM)?",
        answer:
          "$2.5 billion as of December 31, 2023, with steady growth over the past 5 years driven by strong performance and new investor commitments.",
        tags: ["tag-aum", "tag-performance", "tag-growth"],
        questionType: "currency",
        section: "Organization & Management",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        firmId: "firm-1",
        firmName: "Infrastructure Partners LLC",
      },
      {
        id: "resp-2",
        question: "Describe your ESG integration process and measurement frameworks.",
        answer:
          "We have implemented a comprehensive ESG framework that includes pre-investment screening, ongoing monitoring, and impact measurement. Our process involves ESG due diligence scorecards, quarterly ESG reporting, and alignment with UN SDGs.",
        tags: ["tag-esg", "tag-sustainability", "tag-impact"],
        questionType: "long_text",
        section: "ESG & Compliance",
        createdAt: "2024-01-10T14:20:00Z",
        updatedAt: "2024-01-10T14:20:00Z",
        firmId: "firm-1",
        firmName: "Infrastructure Partners LLC",
      },
      {
        id: "resp-3",
        question: "What is your approach to risk management in infrastructure investments?",
        answer:
          "Our risk management approach includes comprehensive due diligence, stress testing, diversification across sectors and geographies, and continuous monitoring of key risk indicators. We maintain a dedicated Risk Committee that meets monthly.",
        tags: ["tag-risk", "tag-infrastructure", "tag-monitoring"],
        questionType: "long_text",
        section: "Risk Management",
        createdAt: "2024-01-08T11:45:00Z",
        updatedAt: "2024-01-08T11:45:00Z",
        firmId: "firm-1",
        firmName: "Infrastructure Partners LLC",
      },
    ]
    setResponseBank(sampleResponses)
  }, [])

  const addResponse = (response: Omit<ResponseBankEntry, "id" | "createdAt" | "updatedAt">) => {
    const newResponse: ResponseBankEntry = {
      ...response,
      id: `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setResponseBank((prev) => [newResponse, ...prev])
    return newResponse
  }

  const updateResponse = (id: string, updates: Partial<ResponseBankEntry>) => {
    setResponseBank((prev) =>
      prev.map((response) =>
        response.id === id ? { ...response, ...updates, updatedAt: new Date().toISOString() } : response,
      ),
    )
  }

  const deleteResponse = (id: string) => {
    setResponseBank((prev) => prev.filter((response) => response.id !== id))
  }

  const searchResponses = (query: string, filters?: ResponseBankFilters): ResponseBankEntry[] => {
    let filtered = responseBank

    // Apply filters
    if (filters?.tags && filters.tags.length > 0) {
      filtered = filtered.filter((response) => filters.tags!.some((tag) => response.tags.includes(tag)))
    }

    if (filters?.section) {
      filtered = filtered.filter((response) => response.section === filters.section)
    }

    if (filters?.questionType) {
      filtered = filtered.filter((response) => response.questionType === filters.questionType)
    }

    if (filters?.firmId) {
      filtered = filtered.filter((response) => response.firmId === filters.firmId)
    }

    if (filters?.dateRange) {
      filtered = filtered.filter((response) => {
        const responseDate = new Date(response.createdAt)
        const startDate = new Date(filters.dateRange!.start)
        const endDate = new Date(filters.dateRange!.end)
        return responseDate >= startDate && responseDate <= endDate
      })
    }

    // Apply text search
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(/\s+/)
      filtered = filtered.filter((response) =>
        searchTerms.every(
          (term) =>
            response.question.toLowerCase().includes(term) ||
            response.answer.toLowerCase().includes(term) ||
            response.section.toLowerCase().includes(term),
        ),
      )
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  const findSimilarResponses = (question: string, threshold = 0.3): ResponseBankEntry[] => {
    const calculateSimilarity = (q1: string, q2: string): number => {
      const words1 = q1.toLowerCase().split(/\s+/)
      const words2 = q2.toLowerCase().split(/\s+/)
      const intersection = words1.filter((word) => words2.includes(word))
      const union = [...new Set([...words1, ...words2])]
      return intersection.length / union.length
    }

    return responseBank
      .map((response) => ({
        ...response,
        similarity: calculateSimilarity(question, response.question),
      }))
      .filter((response) => (response.similarity || 0) > threshold)
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
  }

  const getResponsesByTag = (tagId: string): ResponseBankEntry[] => {
    return responseBank.filter((response) => response.tags.includes(tagId))
  }

  const getResponseStats = () => {
    const totalResponses = responseBank.length
    const tagCounts = responseBank.reduce(
      (acc, response) => {
        response.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const sectionCounts = responseBank.reduce(
      (acc, response) => {
        acc[response.section] = (acc[response.section] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalResponses,
      tagCounts,
      sectionCounts,
      mostUsedTags: Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
      mostActiveSection: Object.entries(sectionCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null,
    }
  }

  return {
    responseBank,
    isLoading,
    addResponse,
    updateResponse,
    deleteResponse,
    searchResponses,
    findSimilarResponses,
    getResponsesByTag,
    getResponseStats,
  }
}
