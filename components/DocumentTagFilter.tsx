"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Search, TagIcon } from "lucide-react"
import type { TagWithCount } from "@/hooks/useDocumentTags"

interface DocumentTagFilterProps {
  tags: TagWithCount[]
  selectedTags: string[]
  onTagSelect: (tagId: string) => void
  onTagRemove: (tagId: string) => void
  onClearAll: () => void
}

export function DocumentTagFilter({
  tags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onClearAll,
}: DocumentTagFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tags based on search query
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get tag details by ID
  const getTagById = (id: string) => tags.find((tag) => tag.id === id)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={onClearAll}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tags..."
          className="pl-8 h-8 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedTags.map((tagId) => {
            const tag = getTagById(tagId)
            if (!tag) return null

            return (
              <Badge
                key={tag.id}
                variant="outline"
                className="flex items-center gap-1 px-2 py-1 text-xs"
                style={{
                  backgroundColor: `${tag.color}15`, // Very light version of the color
                  borderColor: tag.color,
                  color: tag.color,
                }}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => onTagRemove(tag.id)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag.name} filter</span>
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      {/* Available tags */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onTagSelect(tag.id)}
              disabled={selectedTags.includes(tag.id)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm ${
                selectedTags.includes(tag.id) ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                <span>{tag.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs bg-gray-100">
                {tag.count}
              </Badge>
            </button>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            <TagIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No tags found</p>
          </div>
        )}
      </div>
    </div>
  )
}
