"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDemoLogin = async (role: string) => {
    try {
      setIsLoading(true)
      
      // Simple localStorage access
      if (typeof window !== 'undefined') {
        localStorage.setItem("userRole", role)
        localStorage.setItem("currentUserRole", role)
      }

      // Navigate to dashboard
      router.push(`/screens/${role}/home`)
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div className="bg-blue-600 md:w-1/2 p-8 flex flex-col justify-center">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Vestira</h1>
          <p className="text-xl">Investment Management Platform</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600 mt-2">Access your dashboard</p>
          </div>

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleDemoLogin("allocator")}
              disabled={isLoading}
              className="p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">A</span>
                </div>
                <span className="font-medium">Allocator</span>
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin("manager")}
              disabled={isLoading}
              className="p-4 border-2 border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-colors"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">M</span>
                </div>
                <span className="font-medium">Manager</span>
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin("consultant")}
              disabled={isLoading}
              className="p-4 border-2 border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-colors"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">C</span>
                </div>
                <span className="font-medium">Consultant</span>
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin("industry-group")}
              disabled={isLoading}
              className="p-4 border-2 border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-400 transition-colors"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 font-bold">I</span>
                </div>
                <span className="font-medium">Industry Group</span>
              </div>
            </button>
          </div>

          {isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                Loading...
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
