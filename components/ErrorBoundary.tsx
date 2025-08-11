"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Don't catch Next.js redirects or navigation errors
    if (error.message?.includes("NEXT_REDIRECT") || error.message?.includes("Redirect")) {
      throw error // Re-throw redirect errors
    }
    
    // Don't catch localStorage errors as they're not critical
    if (error.message?.includes("localStorage") || error.message?.includes("localStorage")) {
      console.warn("localStorage error caught:", error)
      return { hasError: false } // Don't show error for localStorage issues
    }
    
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Don't log Next.js redirects as errors
    if (error.message?.includes("NEXT_REDIRECT") || error.message?.includes("Redirect")) {
      throw error // Re-throw redirect errors
    }
    
    // Don't log localStorage errors as they're not critical
    if (error.message?.includes("localStorage") || error.message?.includes("localStorage")) {
      console.warn("localStorage error caught:", error)
      return // Don't log localStorage errors
    }
    
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button variant="outline" onClick={() => this.setState({ hasError: false })} className="w-full">
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{this.state.error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
