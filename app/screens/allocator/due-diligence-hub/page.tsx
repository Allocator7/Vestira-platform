"use client"

import { Screen } from "../../../../components/Screen"
import { Button } from "../../../../components/ui/button"

export default function AllocatorDueDiligenceHubPage() {
  return (
    <Screen>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Allocator Due Diligence Hub
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the Due Diligence Hub. This page is working correctly.
          </p>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <p className="text-gray-600">Role: allocator</p>
              <p className="text-gray-600">Profile: John Smith</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Test Button
            </Button>
          </div>
        </div>
      </div>
    </Screen>
  )
}
