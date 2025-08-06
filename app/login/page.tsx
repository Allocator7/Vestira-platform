"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useApp } from "../../context/AppContext"
import { useSession } from "../../context/SessionContext"
import {
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Mail,
  Key,
  AlertCircle,
  CheckCircle,
  Building,
  Users,
  Briefcase,
  Globe,
} from "lucide-react"

interface LoginStep {
  step: "credentials" | "mfa" | "device-trust"
  data?: any
}

export default function LoginPage() {
  const router = useRouter()
  const { setUserRole } = useApp()
  const { login: sessionLogin } = useSession()
  const [currentStep, setCurrentStep] = useState<LoginStep>({ step: "credentials" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Check for URL parameters for success messages
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const verified = urlParams.get("verified")
        const signup = urlParams.get("signup")
        
        if (verified === "true") {
          setSuccess("Email verified successfully! You can now log in to your account.")
        } else if (signup === "success") {
          setSuccess("Account created successfully! Please check your email to verify your account.")
        }
      }
    } catch (error) {
      console.error("Error checking URL parameters:", error)
      // Don't set error state to avoid breaking the page
    }
  }, [])

  // Form states
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [mfaData, setMfaData] = useState({
    method: "totp" as "totp" | "sms" | "email" | "backup-codes",
    code: "",
    rememberDevice: false,
  })

  const [userProfile, setUserProfile] = useState<any>(null)

  // Handle demo button clicks with proper role setting
  const handleDemoLogin = async (role: "allocator" | "manager" | "consultant" | "industry-group") => {
    try {
      setIsLoading(true)
      setError("")

      // Set role in contexts
      setUserRole(role)
      sessionLogin(role)

      // Store role in localStorage
      localStorage.setItem("currentUserRole", role)
      localStorage.setItem("userRole", role)
      localStorage.setItem("demoMode", "true")

      // Navigate to the correct dashboard
      router.push(`/screens/${role}/home`)
    } catch (error) {
      console.error("Demo login error:", error)
      setError(`Failed to login as ${role}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate credential validation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (credentials.email === "demo@vestira.com" && credentials.password === "demo123") {
        // Mock user profile
        const profile = {
          id: "user-demo",
          email: credentials.email,
          name: "Demo User",
          role: "allocator",
          firmId: "firm-demo",
          mfaEnabled: true,
          trustedDevice: false,
        }

        setUserProfile(profile)

        if (profile.mfaEnabled) {
          setCurrentStep({ step: "mfa", data: profile })
        } else {
          // Direct login for users without MFA
          await completeLogin(profile)
        }
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate MFA verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (mfaData.code === "123456") {
        await completeLogin(userProfile, true)
      } else {
        setError("Invalid verification code")
      }
    } catch (err) {
      setError("MFA verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const completeLogin = async (profile: any, mfaVerified = false) => {
    try {
      setSuccess("Login successful! Redirecting...")

      // Set user role in contexts
      setUserRole(profile.role)
      sessionLogin(profile.role)

      // Store in localStorage
      localStorage.setItem("userRole", profile.role)
      localStorage.setItem("currentUserRole", profile.role)

      // Navigate directly
      setTimeout(() => {
        router.push(`/screens/${profile.role}/home`)
      }, 800)
    } catch (err) {
      console.error("Login completion error:", err)
      setError("Login completion failed")
    }
  }

  const resendMFACode = async () => {
    setIsLoading(true)
    try {
      // Simulate resending code
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Verification code sent!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to resend code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding and info */}
      <div className="bg-deep-brand md:w-1/2 p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1080')] opacity-10"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-deep-brand/90 to-deep-brand"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <span className="text-deep-brand font-bold text-2xl">V</span>
            </div>
            <span className="text-white text-2xl font-bold">vestira</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Welcome to the future of institutional investment</h1>
          <p className="text-white/80 text-lg mb-8">
            Secure, compliant, and efficient document management for investment professionals.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-electric-blue/20 flex items-center justify-center mt-1">
                <Shield className="h-5 w-5 text-electric-blue" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Enterprise Security</h3>
                <p className="text-white/70">SOC2 compliant platform with advanced encryption</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-electric-blue/20 flex items-center justify-center mt-1">
                <Users className="h-5 w-5 text-electric-blue" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Streamlined Collaboration</h3>
                <p className="text-white/70">Connect with allocators and managers seamlessly</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-electric-blue/20 flex items-center justify-center mt-1">
                <Building className="h-5 w-5 text-electric-blue" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Intelligent Data Rooms</h3>
                <p className="text-white/70">Organize and share documents with granular permissions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">© 2025 Vestira. All rights reserved.</div>
      </div>

      {/* Right side - Login form */}
      <div className="md:w-1/2 p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Credentials Step */}
          {currentStep.step === "credentials" && (
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-deep-brand">Sign In</h2>
                <p className="text-base-gray mt-2">Access your secure Vestira dashboard</p>
              </div>

              {/* Demo Views - Explore Platform Features */}
              <div className="mb-4">
                <p className="text-sm text-base-gray text-center mb-3">
                  Explore platform features with sample data
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Allocator Demo Button */}
                <button
                  onClick={() => handleDemoLogin("allocator")}
                  disabled={isLoading}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Demo</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="font-medium text-deep-brand">Sample Allocator</span>
                  </div>
                </button>

                {/* Manager Demo Button */}
                <button
                  onClick={() => handleDemoLogin("manager")}
                  disabled={isLoading}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:bg-green-50 hover:border-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Demo</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="font-medium text-deep-brand">Sample Manager</span>
                  </div>
                </button>

                {/* Consultant Demo Button */}
                <button
                  onClick={() => handleDemoLogin("consultant")}
                  disabled={isLoading}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  <div className="absolute top-2 right-2">
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">Demo</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="font-medium text-deep-brand">Sample Consultant</span>
                  </div>
                </button>

                {/* NEW: Industry Group Demo Button */}
                <button
                  onClick={() => handleDemoLogin("industry-group")}
                  disabled={isLoading}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  <div className="absolute top-2 right-2">
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">Demo</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-orange-600" />
                    </div>
                    <span className="font-medium text-deep-brand text-sm">Sample Industry Group</span>
                  </div>
                </button>
              </div>

              {isLoading && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-base-gray">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-base-gray">or sign in with email</span>
                </div>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-deep-brand">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-deep-brand">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-sm text-electric-blue hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      required
                      className="h-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={credentials.rememberMe}
                    onCheckedChange={(checked) => setCredentials({ ...credentials, rememberMe: !!checked })}
                  />
                  <Label htmlFor="remember" className="text-sm text-deep-brand">
                    Remember me for 30 days
                  </Label>
                </div>

                <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-base-gray">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-electric-blue font-medium hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* MFA Step */}
          {currentStep.step === "mfa" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-deep-brand">Two-Factor Authentication</h2>
                <p className="text-base-gray mt-2">Enter the verification code to complete your login</p>
              </div>

              <Tabs
                value={mfaData.method}
                onValueChange={(value) => setMfaData({ ...mfaData, method: value as any })}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="totp" className="text-sm">
                    <Smartphone className="h-4 w-4 mr-1" />
                    App
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="text-sm">
                    <Mail className="h-4 w-4 mr-1" />
                    SMS
                  </TabsTrigger>
                  <TabsTrigger value="backup-codes" className="text-sm">
                    <Key className="h-4 w-4 mr-1" />
                    Backup
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleMFASubmit} className="mt-6 space-y-4">
                  <TabsContent value="totp" className="space-y-4">
                    <div>
                      <Label htmlFor="totp-code">Authenticator Code</Label>
                      <Input
                        id="totp-code"
                        placeholder="Enter 6-digit code"
                        value={mfaData.code}
                        onChange={(e) => setMfaData({ ...mfaData, code: e.target.value })}
                        maxLength={6}
                        required
                        className="h-12 text-center text-lg tracking-widest"
                      />
                      <p className="text-sm text-base-gray mt-1">
                        Open your authenticator app and enter the 6-digit code
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="sms" className="space-y-4">
                    <div>
                      <Label htmlFor="sms-code">SMS Code</Label>
                      <Input
                        id="sms-code"
                        placeholder="Enter 6-digit code"
                        value={mfaData.code}
                        onChange={(e) => setMfaData({ ...mfaData, code: e.target.value })}
                        maxLength={6}
                        required
                        className="h-12 text-center text-lg tracking-widest"
                      />
                      <p className="text-sm text-base-gray mt-1">Check your phone for the verification code</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={resendMFACode}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Resend Code
                    </Button>
                  </TabsContent>

                  <TabsContent value="backup-codes" className="space-y-4">
                    <div>
                      <Label htmlFor="backup-code">Backup Code</Label>
                      <Input
                        id="backup-code"
                        placeholder="Enter backup code"
                        value={mfaData.code}
                        onChange={(e) => setMfaData({ ...mfaData, code: e.target.value })}
                        required
                        className="h-12 text-center text-lg tracking-widest"
                      />
                      <p className="text-sm text-base-gray mt-1">Use one of your saved backup codes</p>
                    </div>
                  </TabsContent>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-device"
                      checked={mfaData.rememberDevice}
                      onCheckedChange={(checked) => setMfaData({ ...mfaData, rememberDevice: !!checked })}
                    />
                    <Label htmlFor="remember-device" className="text-sm">
                      Trust this device for 30 days
                    </Label>
                  </div>

                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep({ step: "credentials" })}
                    className="text-base-gray"
                  >
                    ← Back to login
                  </Button>
                </div>

                {/* Demo MFA Code */}
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-green-800">
                    <strong>Demo Code:</strong> <code className="bg-green-100 px-1 py-0.5 rounded">123456</code>
                  </p>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
