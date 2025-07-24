"use client"

import { useState, useCallback } from "react"
import { useApp } from "@/context/AppContext"

export type PermissionRole = "viewer" | "contributor" | "manager"

export interface User {
  id: string
  name: string
  email: string
  organization: string
  role: PermissionRole
}

export interface ResourcePermissions {
  resourceId: string
  resourceType: "document" | "data-room" | "ddq"
  users: User[]
  ownerId: string
}

export function useDocumentPermissions(initialPermissions?: ResourcePermissions) {
  const { userRole } = useApp()
  const [permissions, setPermissions] = useState<ResourcePermissions | undefined>(initialPermissions)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if current user can manage permissions
  const canManagePermissions = userRole === "manager"

  // Add a user to the resource
  const addUser = useCallback(
    async (email: string, role: PermissionRole) => {
      if (!canManagePermissions || !permissions) return

      setIsLoading(true)
      setError(null)

      try {
        // In a real app, this would be an API call
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: email.split("@")[0],
          email,
          organization: email.split("@")[1].split(".")[0],
          role,
        }

        setPermissions({
          ...permissions,
          users: [...permissions.users, newUser],
        })

        return newUser
      } catch (err) {
        setError("Failed to add user")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [canManagePermissions, permissions],
  )

  // Remove a user from the resource
  const removeUser = useCallback(
    async (userId: string) => {
      if (!canManagePermissions || !permissions) return

      setIsLoading(true)
      setError(null)

      try {
        // In a real app, this would be an API call
        setPermissions({
          ...permissions,
          users: permissions.users.filter((user) => user.id !== userId),
        })
      } catch (err) {
        setError("Failed to remove user")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [canManagePermissions, permissions],
  )

  // Update a user's role
  const updateUserRole = useCallback(
    async (userId: string, role: PermissionRole) => {
      if (!canManagePermissions || !permissions) return

      setIsLoading(true)
      setError(null)

      try {
        // In a real app, this would be an API call
        setPermissions({
          ...permissions,
          users: permissions.users.map((user) => (user.id === userId ? { ...user, role } : user)),
        })
      } catch (err) {
        setError("Failed to update user role")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [canManagePermissions, permissions],
  )

  return {
    permissions,
    isLoading,
    error,
    canManagePermissions,
    addUser,
    removeUser,
    updateUserRole,
  }
}
