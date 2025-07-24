"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FolderPlus, Shield } from "lucide-react"
import { useDocumentStore, type Folder } from "@/lib/store/document-store"
import { useApp } from "@/context/AppContext"

interface FolderCreationDialogProps {
  isOpen: boolean
  onClose: () => void
  parentFolderId?: string | null
}

export function FolderCreationDialog({ isOpen, onClose, parentFolderId = null }: FolderCreationDialogProps) {
  const { addFolder } = useDocumentStore()
  const { currentPersonProfile } = useApp()
  const [folderData, setFolderData] = useState({
    name: "",
    description: "",
    permissions: "private" as "public" | "private" | "restricted",
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!folderData.name.trim()) return

    setIsCreating(true)

    try {
      const newFolder: Omit<Folder, "id"> = {
        name: folderData.name.trim(),
        parentId: parentFolderId || undefined,
        createdBy: currentPersonProfile?.firstName + " " + currentPersonProfile?.lastName || "Current User",
        createdDate: new Date().toISOString().split("T")[0],
        documentCount: 0,
        subfolders: [],
        permissions: [
          {
            userId: currentPersonProfile?.id || "current-user",
            role: "admin",
          },
        ],
      }

      const folderId = addFolder(newFolder)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("Folder created successfully:", folderId)

      // Reset form
      setFolderData({
        name: "",
        description: "",
        permissions: "private",
      })

      onClose()
    } catch (error) {
      console.error("Failed to create folder:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setFolderData({
        name: "",
        description: "",
        permissions: "private",
      })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-deepBrand" />
            Create New Folder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name *</Label>
            <Input
              id="folder-name"
              placeholder="e.g., Q4 2024 Reports"
              value={folderData.name}
              onChange={(e) => setFolderData((prev) => ({ ...prev, name: e.target.value }))}
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-description">Description (Optional)</Label>
            <Textarea
              id="folder-description"
              placeholder="Brief description of what this folder contains..."
              value={folderData.description}
              onChange={(e) => setFolderData((prev) => ({ ...prev, description: e.target.value }))}
              disabled={isCreating}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-permissions">Default Permissions</Label>
            <select
              id="folder-permissions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={folderData.permissions}
              onChange={(e) => setFolderData((prev) => ({ ...prev, permissions: e.target.value as any }))}
              disabled={isCreating}
            >
              <option value="private">Private - Only you can access</option>
              <option value="public">Public - Anyone in organization can view</option>
              <option value="restricted">Restricted - Specific users only</option>
            </select>
          </div>

          {parentFolderId && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
              <div className="flex items-center gap-2 text-blue-800">
                <FolderPlus className="h-4 w-4" />
                <span className="text-sm font-medium">Creating subfolder</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                This folder will be created inside the selected parent folder.
              </p>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-gray-600 mt-0.5" />
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Security & Compliance</p>
                <ul className="space-y-1">
                  <li>• All folder activities are logged for audit purposes</li>
                  <li>• Documents inherit folder security settings by default</li>
                  <li>• Permissions can be modified after creation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!folderData.name.trim() || isCreating}
            className="bg-deepBrand hover:bg-deepBrand/90"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Folder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
