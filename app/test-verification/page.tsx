"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestVerificationPage() {
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testVerification = async () => {
    if (!token) return
    
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/auth/verify?token=${token}`)
      
      if (response.redirected) {
        setResult({
          success: true,
          message: "Verification successful! Redirecting to login...",
          redirectUrl: response.url
        })
      } else {
        const data = await response.json()
        setResult(data)
      }
    } catch (error) {
      setResult({ error: "Failed to verify token", details: error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Email Verification Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="token">Verification Token</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your verification token here"
                className="mt-2"
              />
            </div>

            <Button 
              onClick={testVerification} 
              disabled={!token || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Test Verification"
              )}
            </Button>

            {result && (
              <div className="mt-6">
                {result.success ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Verification successful!</strong><br />
                      {result.message}<br />
                      {result.redirectUrl && (
                        <a href={result.redirectUrl} className="text-blue-600 underline">
                          Click here to go to login
                        </a>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Verification failed:</strong><br />
                      {result.error}<br />
                      {result.details && (
                        <code className="text-xs mt-2 block">
                          {result.details}
                        </code>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">How to test:</h3>
              <ol className="text-blue-800 text-sm space-y-1 list-decimal pl-4">
                <li>Create an account at <code>/signup</code></li>
                <li>Copy the verification token from the success message</li>
                <li>Paste it here and click "Test Verification"</li>
                <li>Check if the verification works</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}