"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function TestSignupDebug() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testSignup = async () => {
    setLoading(true)
    setResult("Testing signup...")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: `test${Date.now()}@example.com`,
          password: "password123",
          organizationType: "allocator",
          organizationName: "Test Org",
          jobTitle: "Test Job",
        }),
      })

      const data = await response.json()
      
      setResult(JSON.stringify({
        status: response.status,
        ok: response.ok,
        data: data
      }, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Signup API Debug Test</h1>
          
          <Button 
            onClick={testSignup} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? "Testing..." : "Test Signup API"}
          </Button>

          {result && (
            <div className="mt-4">
              <Label>Result:</Label>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                {result}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}