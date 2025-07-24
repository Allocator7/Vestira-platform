"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, Plus, X, TagIcon } from "lucide-react"
import type { Tag } from "@/hooks/useDocumentTags"

interface TagManagerProps {
  tags: Tag[]
  selectedTags: string[]
  onTagSelect: (tagId: string) => void
  onTagRemove: (tagId: string) => void
  onTagCreate?: (name: string, color: string) => void
  onTagEdit?: (id: string, name: string, color: string) => void
  onTagDelete?: (id: string) => void
  readOnly?: boolean
  compact?: boolean
}

export function TagManager({
  tags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onTagCreate,
  onTagEdit,
  onTagDelete,
  readOnly = false,
  compact = false,
}: TagManagerProps) {
  const [open, setOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6") // Default blue color
  const [isCreatingTag, setIsCreatingTag] = useState(false)

  // Get tag details by ID
  const getTagById = (id: string) => tags.find((tag) => tag.id === id)

  // Handle tag creation
  const handleCreateTag = () => {
    if (!newTagName.trim() || !onTagCreate) return

    onTagCreate(newTagName.trim(), newTagColor)
    setNewTagName("")
    setIsCreatingTag(false)
  }

  // Available colors for tag creation
  const colorOptions = [
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#ef4444", label: "Red" },
    { value: "#f59e0b", label: "Orange" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ec4899", label: "Pink" },
    { value: "#6b7280", label: "Gray" },
  ]

  return (
    <div className="flex flex-wrap gap-1.5">
      {/* Display selected tags */}
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
            {!readOnly && (
              <button
                type="button"
                onClick={() => onTagRemove(tag.id)}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag.name} tag</span>
              </button>
            )}
          </Badge>
        )
      })}

      {/* Add tag button and dropdown */}
      {!readOnly && !compact && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs border-dashed">
              <TagIcon className="h-3 w-3" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0" align="start">
            {isCreatingTag ? (
              <div className="p-3 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Tag Name</label>
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                    className="h-8 text-sm"
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Tag Color</label>
                  <div className="flex flex-wrap gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewTagColor(color.value)}
                        className={`w-6 h-6 rounded-full ${newTagColor === color.value ? "ring-2 ring-offset-2" : ""}`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      >
                        <span className="sr-only">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setIsCreatingTag(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreateTag} disabled={!newTagName.trim()}>
                    Create
                  </Button>
                </div>
              </div>
            ) : (
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>
                    <div className="py-2 px-2 text-sm text-center">
                      <p className="text-gray-500">No tags found.</p>
                      {onTagCreate && (
                        <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setIsCreatingTag(true)}>
                          Create a new tag
                        </Button>
                      )}
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {tags
                      .filter((tag) => !selectedTags.includes(tag.id))
                      .map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => {
                            onTagSelect(tag.id)
                            setOpen(false)
                          }}
                        >
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                          {tag.name}
                          <Check
                            className={`ml-auto h-4 w-4 ${selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"}`}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
                {onTagCreate && (
                  <div className="p-1 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setIsCreatingTag(true)}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Create new tag
                    </Button>
                  </div>
                )}
              </Command>
            )}
          </PopoverContent>
        </Popover>
      )}

      {/* Compact add button for small spaces */}
      {!readOnly && compact && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full p-0 border-dashed">
              <Plus className="h-3 w-3" />
              <span className="sr-only">Add tag</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {tags
                    .filter((tag) => !selectedTags.includes(tag.id))
                    .map((tag) => (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => {
                          onTagSelect(tag.id)
                        }}
                      >
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
