"use client"

import { useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-bg to-white px-4">
      <Card className="w-full max-w-md border-0 shadow-vestira-lg text-center">
        <CardHeader>
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-deep-brand">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base-gray">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild className="bg-electric-blue hover:bg-electric-blue/90">
              <a href="/login">
                <Home className="mr-2 h-4 w-4" />
                Back to Login
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
