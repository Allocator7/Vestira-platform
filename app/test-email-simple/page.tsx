"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmail = async () => {
    if (!email) return
    
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to test email", details: error })
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
              Email System Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email">Test Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="mt-2"
              />
            </div>

            <Button 
              onClick={testEmail} 
              disabled={!email || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Email...
                </>
              ) : (
                "Test Email Sending"
              )}
            </Button>

            {result && (
              <div className="mt-6">
                {result.success ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Email sent successfully!</strong><br />
                      Check your inbox for the test email.<br />
                      <code className="text-xs mt-2 block">
                        To: {result.details?.to}<br />
                        From: {result.details?.from}<br />
                        Domain Verified: {result.details?.domainVerified ? 'Yes' : 'No'}
                      </code>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Email test failed:</strong><br />
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
              <h3 className="font-semibold text-blue-900 mb-2">What this tests:</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• SendGrid API key configuration</li>
                <li>• Domain verification status</li>
                <li>• Email delivery capability</li>
                <li>• Professional email templates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}