"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Shield, X } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "viewer" | "contributor" | "manager"
}

interface DocumentPermissionsProps {
  documentId: string
  documentName: string
}

export function DocumentPermissions({ documentId, documentName }: DocumentPermissionsProps) {
  const [open, setOpen] = useState(false)

  // Sample users with access
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Sarah Johnson", email: "sjohnson@acmecapital.com", role: "viewer" },
    { id: "2", name: "Michael Chen", email: "mchen@acmecapital.com", role: "contributor" },
    { id: "3", name: "David Wilson", email: "dwilson@globalinv.com", role: "manager" },
  ])

  const handleRoleChange = (userId: string, role: "viewer" | "contributor" | "manager") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role } : user)))
  }

  const removeUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Users className="h-4 w-4" />
          <span>Manage Access</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Document Access</DialogTitle>
          <DialogDescription>Control who can access "{documentName}" and what permissions they have.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>People with access</Label>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue={user.role} onValueChange={(value) => handleRoleChange(user.id, value as any)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5" />
                            <span>Viewer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="contributor">
                          <div className="flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5" />
                            <span>Contributor</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="manager">
                          <div className="flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5" />
                            <span>Manager</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeUser(user.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
