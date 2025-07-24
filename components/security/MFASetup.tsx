"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Smartphone, Mail, Copy, Check, AlertTriangle, Download, Eye, EyeOff } from "lucide-react"
import { useApp } from "@/context/AppContext"

interface MFASetupProps {
  onComplete?: () => void
  onCancel?: () => void
}

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const [activeMethod, setActiveMethod] = useState<"totp" | "sms" | "email">("totp")
  const [step, setStep] = useState<"select" | "setup" | "verify" | "backup" | "complete">("select")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [codesDownloaded, setCodesDownloaded] = useState(false)

  const { currentPersonProfile, addNotification } = useApp()

  const handleMethodSelect = async (method: "totp" | "sms" | "email") => {
    setActiveMethod(method)
    setStep("setup")
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to setup MFA method
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (method === "totp") {
        // Generate QR code and secret
        setQrCode(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        )
        setSecret("JBSWY3DPEHPK3PXP")
      } else if (method === "sms") {
        setPhoneNumber("+1 (555) 123-4567")
      } else if (method === "email") {
        setEmail(currentPersonProfile?.email || "user@example.com")
      }
    } catch (err) {
      setError("Failed to setup MFA method. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (verificationCode === "123456") {
        setStep("backup")
        // Generate backup codes
        const codes = Array.from({ length: 10 }, () => Math.floor(10000000 + Math.random() * 90000000).toString())
        setBackupCodes(codes)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    addNotification({
      title: "MFA Enabled",
      message: `Two-factor authentication has been successfully enabled using ${activeMethod.toUpperCase()}`,
      type: "success",
    })
    setStep("complete")
    setTimeout(() => {
      onComplete?.()
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadBackupCodes = () => {
    const content = `Vestira Backup Codes\nGenerated: ${new Date().toISOString()}\n\n${backupCodes.join("\n")}\n\nKeep these codes safe and secure. Each code can only be used once.`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vestira-backup-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
    setCodesDownloaded(true)
  }

  if (step === "complete") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-deep-brand mb-2">MFA Enabled Successfully</h2>
          <p className="text-base-gray mb-4">Your account is now protected with two-factor authentication</p>
          <div className="w-full bg-canvas-bg rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-electric-blue" />
          Setup Two-Factor Authentication
        </CardTitle>
        <CardDescription>Add an extra layer of security to your Vestira account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {step === "select" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-deep-brand">Choose your preferred method:</h3>

            <div className="grid gap-4">
              <button
                onClick={() => handleMethodSelect("totp")}
                disabled={isLoading}
                className="p-4 border rounded-lg text-left hover:border-electric-blue hover:bg-electric-blue/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-electric-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-deep-brand">Authenticator App</h4>
                    <p className="text-sm text-base-gray">Use Google Authenticator, Authy, or similar apps</p>
                    <Badge variant="secondary" className="mt-2">
                      Recommended
                    </Badge>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect("sms")}
                disabled={isLoading}
                className="p-4 border rounded-lg text-left hover:border-electric-blue hover:bg-electric-blue/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-electric-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-deep-brand">SMS Text Message</h4>
                    <p className="text-sm text-base-gray">Receive codes via text message</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect("email")}
                disabled={isLoading}
                className="p-4 border rounded-lg text-left hover:border-electric-blue hover:bg-electric-blue/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-electric-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-deep-brand">Email</h4>
                    <p className="text-sm text-base-gray">Receive codes via email</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === "setup" && (
          <div className="space-y-4">
            {activeMethod === "totp" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-brand">Setup Authenticator App</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-canvas-bg rounded-lg">
                      <h4 className="font-medium mb-2">Step 1: Scan QR Code</h4>
                      <div className="bg-white p-4 rounded border">
                        <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-full max-w-48 mx-auto" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-canvas-bg rounded-lg">
                      <h4 className="font-medium mb-2">Step 2: Manual Entry</h4>
                      <p className="text-sm text-base-gray mb-2">Can't scan? Enter this code manually:</p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={secret}
                          readOnly
                          type={showSecret ? "text" : "password"}
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={() => setShowSecret(!showSecret)}>
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(secret)}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMethod === "sms" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-brand">Setup SMS Authentication</h3>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-sm text-base-gray">We'll send verification codes to this number</p>
                </div>
              </div>
            )}

            {activeMethod === "email" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-brand">Setup Email Authentication</h3>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <p className="text-sm text-base-gray">We'll send verification codes to this email</p>
                </div>
              </div>
            )}

            <Button onClick={() => setStep("verify")} className="w-full" disabled={isLoading}>
              {isLoading ? "Setting up..." : "Continue to Verification"}
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-deep-brand">Verify Setup</h3>
            <p className="text-base-gray">
              Enter the 6-digit code from your{" "}
              {activeMethod === "totp" ? "authenticator app" : activeMethod === "sms" ? "text message" : "email"}
            </p>

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setVerificationCode(value)
                  setError("")
                }}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-base-gray text-center">Demo: Use "123456" to continue</p>
            </div>

            <Button
              onClick={handleVerification}
              className="w-full"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </div>
        )}

        {step === "backup" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-deep-brand">Save Backup Codes</h3>
            <p className="text-base-gray">
              These backup codes can be used to access your account if you lose your device. Each code can only be used
              once.
            </p>

            <div className="p-4 bg-canvas-bg rounded-lg">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm p-2 bg-white rounded border">
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadBackupCodes} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Codes
                </Button>
                <Button variant="outline" onClick={() => copyToClipboard(backupCodes.join("\n"))}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <p>
                    Store these codes in a safe place. If you lose access to your device and don't have these codes, you
                    may be locked out of your account.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full" disabled={!codesDownloaded}>
              Complete Setup
            </Button>
          </div>
        )}

        <Separator />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {step !== "select" && step !== "complete" && (
            <Button variant="outline" onClick={() => setStep("select")}>
              Back
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
