"use client"

import type React from "react"
import { useState } from "react"
import { Screen } from "../../../../components/Screen"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent } from "../../../../components/ui/card"

export default function AllocatorDueDiligenceHubPage() {
  const [error, setError] = useState<string | null>(null)
  
  // Simple error boundary
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We encountered an unexpected error. Please try again or contact support if the problem persists.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <Screen>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Due Diligence Hub</h1>
          <p className="text-gray-600 mt-2">Manage and review due diligence questionnaires</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active DDQs</h2>
            <p className="text-gray-600">No active due diligence questionnaires found.</p>
            <Button className="mt-4">Create New DDQ</Button>
          </CardContent>
        </Card>
      </div>
    </Screen>
  )
}
