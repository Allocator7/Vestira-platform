"use client"

import type React from "react"
import { useState } from "react"
import { Screen } from "../../../../components/Screen"
import { Button } from "../../../../components/ui/button"
import { useApp } from "../../../../context/AppContext"

export default function AllocatorDueDiligenceHubPage() {
  const { userRole, currentPersonProfile } = useApp()
  
  return (
    <Screen className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Allocator Due Diligence Hub
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the Due Diligence Hub. This page is working correctly.
          </p>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <p className="text-gray-700 mb-2">
              <strong>Role:</strong> {userRole || 'Not set'}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Profile:</strong> {currentPersonProfile ? `${currentPersonProfile.firstName} ${currentPersonProfile.lastName}` : 'Not loaded'}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Test Button
            </Button>
          </div>
        </div>
      </div>
    </Screen>
  )
}
