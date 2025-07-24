"use client"

import type React from "react"
import { useSession } from "@/context/SessionContext"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useSession()

  // For demo purposes, always allow access
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Always render children for demo
  return <>{children}</>
}
