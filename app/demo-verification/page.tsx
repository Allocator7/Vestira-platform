"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"

export default function DemoVerificationPage() {
  const [verifications, setVerifications] = useState<any[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Load demo verifications from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('demo-verifications')
      if (stored) {
        setVerifications(JSON.parse(stored))
      }
    }
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const verifyEmail = (verification: any) => {
    // Simulate email verification
    window.location.href = verification.verificationUrl
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Email Verification</h1>
          <p className="text-gray-600">
            This page shows verification URLs for testing. In production, users would receive these via email.
          </p>
        </div>

        {verifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Verifications Yet</h3>
              <p className="text-gray-600">
                Create an account to see verification URLs here for testing.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Email Verification</CardTitle>
                    <Badge variant="secondary">Demo</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Email:</p>
                    <p className="text-gray-900">{verification.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Verification URL:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1 overflow-x-auto">
                        {verification.verificationUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(verification.verificationUrl, `url-${index}`)}
                      >
                        {copied === `url-${index}` ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => verifyEmail(verification)}>
                      Verify Email
                    </Button>
                    <Button variant="outline" onClick={() => copyToClipboard(verification.verificationUrl, `url-${index}`)}>
                      Copy URL
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Created: {new Date(verification.createdAt).toLocaleString()}</p>
                    <p>Expires: {new Date(verification.expiresAt).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Production Setup</h3>
          <p className="text-blue-800 text-sm mb-4">
            To enable real email sending:
          </p>
          <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
            <li>Get SendGrid API key from <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" className="underline">sendgrid.com</a></li>
            <li>Add SENDGRID_API_KEY to environment variables</li>
            <li>Verify your domain with SendGrid</li>
            <li>Test email sending</li>
          </ol>
        </div>
      </div>
    </div>
  )
}