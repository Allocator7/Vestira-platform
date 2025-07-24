"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"

type ResetStep = "email" | "code" | "password" | "success"

interface FormErrors {
  email?: string
  code?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function ForgotPasswordPage() {
  const [resetStep, setResetStep] = useState<ResetStep>("email")
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  })

  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field-specific errors
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const simulateAPICall = async (endpoint: string, data: any): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    if (endpoint === "request-reset" && data.email === "notfound@example.com") {
      throw new Error("No account found with this email address")
    }

    if (endpoint === "verify-code" && data.code !== "123456") {
      throw new Error("Invalid or expired reset code")
    }

    return { success: true }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email) {
      setErrors({ email: "Email is required" })
      return
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address" })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await simulateAPICall("request-reset", { email: formData.email })
      setResetStep("code")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email"
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || formData.code.length !== 6) {
      setErrors({ code: "Please enter a valid 6-digit code" })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await simulateAPICall("verify-code", { code: formData.code })
      setResetStep("password")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Code verification failed"
      setErrors({ code: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: FormErrors = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await simulateAPICall("reset-password", {
        code: formData.code,
        password: formData.password,
      })
      setResetStep("success")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password reset failed"
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      await simulateAPICall("request-reset", { email: formData.email })
    } catch (error) {
      setErrors({ general: "Failed to resend code" })
    } finally {
      setIsLoading(false)
    }
  }

  if (resetStep === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-bg to-white px-4">
        <Card className="w-full max-w-md border-0 shadow-vestira-lg">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-deep-brand mb-2">Password Reset Complete</h2>
            <p className="text-base-gray mb-6">Your password has been successfully updated.</p>
            <Button onClick={() => router.push("/login")} className="w-full bg-electric-blue hover:bg-electric-blue/90">
              Return to Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-bg to-white px-4">
      <div className="w-full max-w-md">
        {/* Vestira Logo */}
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-xl bg-deep-brand flex items-center justify-center text-white font-bold text-xl shadow-vestira group-hover:scale-105 transition-transform duration-300">
              V
            </div>
            <span className="text-3xl font-bold text-deep-brand">Vestira</span>
          </Link>
          <p className="text-base-gray mt-2">Reset Your Password</p>
        </div>

        <Card className="border-0 shadow-vestira-lg">
          {resetStep === "email" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-brand">Forgot Password?</CardTitle>
                <CardDescription>Enter your email address and we'll send you a reset code</CardDescription>
              </CardHeader>

              <form onSubmit={handleEmailSubmit}>
                <CardContent className="space-y-4">
                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{errors.general}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 ${errors.email ? "border-red-300 focus:border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-electric-blue hover:bg-electric-blue/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Code"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="text-center">
                    <Link href="/login" className="text-sm text-electric-blue hover:underline">
                      ← Back to Sign In
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </>
          )}

          {resetStep === "code" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-brand">Enter Reset Code</CardTitle>
                <CardDescription>
                  We've sent a 6-digit code to <strong>{formData.email}</strong>
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleCodeSubmit}>
                <CardContent className="space-y-4">
                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{errors.general}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="code">Reset Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      value={formData.code}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                        handleInputChange("code", value)
                      }}
                      className={`text-center text-2xl tracking-widest ${
                        errors.code ? "border-red-300 focus:border-red-500" : ""
                      }`}
                      maxLength={6}
                    />
                    {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                    <p className="text-xs text-base-gray text-center">Demo: Use "123456" as the reset code</p>
                  </div>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      Didn't receive the code? Resend
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-electric-blue hover:bg-electric-blue/90"
                    disabled={isLoading || formData.code.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setResetStep("email")}
                      className="text-sm text-base-gray hover:text-deep-brand"
                    >
                      ← Back to email
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </>
          )}

          {resetStep === "password" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-brand">Set New Password</CardTitle>
                <CardDescription>Choose a strong password for your account</CardDescription>
              </CardHeader>

              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-4">
                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{errors.general}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                      <Input
                        id="password"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 ${errors.password ? "border-red-300 focus:border-red-500" : ""}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-gray hover:text-deep-brand"
                      >
                        {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                      <Input
                        id="confirmPassword"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-300 focus:border-red-500" : ""}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-gray hover:text-deep-brand"
                      >
                        {isConfirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  <div className="text-xs text-base-gray">
                    Password must contain:
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>At least 8 characters</li>
                      <li>One uppercase letter</li>
                      <li>One lowercase letter</li>
                      <li>One number</li>
                      <li>One special character</li>
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-electric-blue hover:bg-electric-blue/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
