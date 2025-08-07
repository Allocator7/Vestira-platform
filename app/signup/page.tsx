"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Building,
  Users,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react"

interface SignupData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string

  // Organization Information
  organizationType: "allocator" | "manager" | "consultant" | "industry-group" | ""
  organizationName: string
  organizationSize: string
  aum: string

  // Contact Information
  phoneNumber: string
  jobTitle: string
  department: string

  // Additional Information
  hearAboutUs: string
  specificNeeds: string

  // Agreements
  termsAccepted: boolean
  privacyAccepted: boolean
  marketingOptIn: boolean
}

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Track signup state for navigation
  const saveSignupState = (step: number, data: SignupData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signup-state', JSON.stringify({
        step,
        data,
        timestamp: Date.now()
      }))
    }
  }

  const loadSignupState = () => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('signup-state')
      if (saved) {
        const state = JSON.parse(saved)
        // Only restore if within last 30 minutes
        if (Date.now() - state.timestamp < 30 * 60 * 1000) {
          setCurrentStep(state.step)
          setFormData(state.data)
          return true
        }
      }
    }
    return false
  }

  const clearSignupState = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('signup-state')
    }
  }

  // Load signup state on component mount
  useEffect(() => {
    loadSignupState()
  }, [])

  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationType: "",
    organizationName: "",
    organizationSize: "",
    aum: "",
    phoneNumber: "",
    jobTitle: "",
    department: "",
    hearAboutUs: "",
    specificNeeds: "",
    termsAccepted: false,
    privacyAccepted: false,
    marketingOptIn: false,
  })

  const [errors, setErrors] = useState<Partial<SignupData>>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<SignupData> = {}

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"

      if (!formData.password) newErrors.password = "Password is required"
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
        newErrors.password = "Password must contain uppercase, lowercase, number, and special character"
      }

      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }

    if (step === 2) {
      if (!formData.organizationType) newErrors.organizationType = "Organization type is required"
      if (!formData.organizationName.trim()) newErrors.organizationName = "Organization name is required"
      if (!formData.organizationSize) newErrors.organizationSize = "Organization size is required"
      if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required"
    }

    if (step === 3) {
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms of service"
      if (!formData.privacyAccepted) newErrors.privacyAccepted = "You must accept the privacy policy"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      saveSignupState(nextStep, formData)
    }
  }

  const handleBack = () => {
    const prevStep = currentStep - 1
    setCurrentStep(prevStep)
    setErrors({})
    saveSignupState(prevStep, formData)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          organizationType: formData.organizationType,
          organizationName: formData.organizationName,
          jobTitle: formData.jobTitle,
          department: formData.department,
          phoneNumber: formData.phoneNumber,
          aum: formData.aum,
          organizationSize: formData.organizationSize,
          hearAboutUs: formData.hearAboutUs,
          specificNeeds: formData.specificNeeds,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to create account")
      }

      if (!data.success) {
        throw new Error(data.error || data.details || "Failed to create account")
      }

      setSuccess(data.message || "Account created successfully! Please check your email to verify your account.")
      clearSignupState() // Clear signup state after successful submission

      // If manual verification is needed, show the verification URL
      if (data.manualVerification && data.verificationUrl) {
        setSuccess(`Account created successfully! Please check your email to verify your account.\n\nIf you don't receive an email, you can verify your account by clicking this link: ${data.verificationUrl}`)
      }

      setTimeout(() => {
        router.push("/login?signup=success")
      }, 5000) // Give more time to read the verification URL
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof SignupData, value: any) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    saveSignupState(currentStep, updatedData)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const getOrganizationTypeIcon = (type: string) => {
    switch (type) {
      case "allocator":
        return <Building className="h-5 w-5 text-blue-600" />
      case "manager":
        return <Users className="h-5 w-5 text-green-600" />
      case "consultant":
        return <Shield className="h-5 w-5 text-purple-600" />
      case "industry-group":
        return <Zap className="h-5 w-5 text-orange-600" />
      default:
        return <Zap className="h-5 w-5 text-gray-400" />
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
            <div className="w-12 h-12 rounded-full bg-deep-brand flex items-center justify-center">
              <span className="text-electric-blue font-bold text-2xl">V</span>
            </div>
            <span className="text-white text-2xl font-bold">vestira</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Join the leading institutional investment platform</h1>
          <p className="text-white/80 text-lg mb-8">
            Create your account to access secure document management and collaboration tools.
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

      {/* Right side - Signup form */}
      <div className="md:w-1/2 p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-deep-brand">Create Account</h2>
              <p className="text-base-gray mt-2">
                Step {currentStep} of 3:
                {currentStep === 1 && " Personal Information"}
                {currentStep === 2 && " Organization Details"}
                {currentStep === 3 && " Review & Confirm"}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        step < currentStep
                          ? "bg-green-100 text-green-600 border-2 border-green-500"
                          : step === currentStep
                            ? "bg-electric-blue text-white shadow-lg shadow-electric-blue/30"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step < currentStep ? <Check className="h-5 w-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-24 h-1 mt-4 ${step < currentStep ? "bg-electric-blue" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

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

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className={`h-12 ${errors.firstName ? "border-red-300" : ""}`}
                      />
                      {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        className={`h-12 ${errors.lastName ? "border-red-300" : ""}`}
                      />
                      {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className={`h-12 ${errors.email ? "border-red-300" : ""}`}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className={`h-12 ${errors.password ? "border-red-300" : ""}`}
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
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    <div className="text-xs text-base-gray space-y-1 mt-1">
                      <p>Password must contain:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li className={formData.password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                        <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : ""}>
                          One uppercase letter
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? "text-green-600" : ""}>
                          One lowercase letter
                        </li>
                        <li className={/\d/.test(formData.password) ? "text-green-600" : ""}>One number</li>
                        <li className={/[@$!%*?&]/.test(formData.password) ? "text-green-600" : ""}>
                          One special character
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        className={`h-12 ${errors.confirmPassword ? "border-red-300" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Organization Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationType">I am a/an *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        type="button"
                        variant={formData.organizationType === "allocator" ? "default" : "outline"}
                        className={`h-auto py-4 flex flex-col items-center justify-center gap-2 ${
                          formData.organizationType === "allocator"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "hover:bg-blue-50 hover:border-blue-300"
                        }`}
                        onClick={() => updateFormData("organizationType", "allocator")}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            formData.organizationType === "allocator" ? "bg-blue-500" : "bg-blue-100"
                          }`}
                        >
                          <Building
                            className={`h-5 w-5 ${
                              formData.organizationType === "allocator" ? "text-white" : "text-blue-600"
                            }`}
                          />
                        </div>
                        <span className={formData.organizationType === "allocator" ? "text-white" : "text-deep-brand"}>
                          Allocator
                        </span>
                      </Button>

                      <Button
                        type="button"
                        variant={formData.organizationType === "manager" ? "default" : "outline"}
                        className={`h-auto py-4 flex flex-col items-center justify-center gap-2 ${
                          formData.organizationType === "manager"
                            ? "bg-green-600 hover:bg-green-700"
                            : "hover:bg-green-50 hover:border-green-300"
                        }`}
                        onClick={() => updateFormData("organizationType", "manager")}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            formData.organizationType === "manager" ? "bg-green-500" : "bg-green-100"
                          }`}
                        >
                          <Users
                            className={`h-5 w-5 ${
                              formData.organizationType === "manager" ? "text-white" : "text-green-600"
                            }`}
                          />
                        </div>
                        <span className={formData.organizationType === "manager" ? "text-white" : "text-deep-brand"}>
                          Manager
                        </span>
                      </Button>

                      <Button
                        type="button"
                        variant={formData.organizationType === "consultant" ? "default" : "outline"}
                        className={`h-auto py-4 flex flex-col items-center justify-center gap-2 ${
                          formData.organizationType === "consultant"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "hover:bg-purple-50 hover:border-purple-300"
                        }`}
                        onClick={() => updateFormData("organizationType", "consultant")}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            formData.organizationType === "consultant" ? "bg-purple-500" : "bg-purple-100"
                          }`}
                        >
                          <Shield
                            className={`h-5 w-5 ${
                              formData.organizationType === "consultant" ? "text-white" : "text-purple-600"
                            }`}
                          />
                        </div>
                        <span className={formData.organizationType === "consultant" ? "text-white" : "text-deep-brand"}>
                          Consultant
                        </span>
                      </Button>

                      <Button
                        type="button"
                        variant={formData.organizationType === "industry-group" ? "default" : "outline"}
                        className={`h-auto py-4 flex flex-col items-center justify-center gap-2 ${
                          formData.organizationType === "industry-group"
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "hover:bg-orange-50 hover:border-orange-300"
                        }`}
                        onClick={() => updateFormData("organizationType", "industry-group")}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            formData.organizationType === "industry-group" ? "bg-orange-500" : "bg-orange-100"
                          }`}
                        >
                          <Zap
                            className={`h-5 w-5 ${
                              formData.organizationType === "industry-group" ? "text-white" : "text-orange-600"
                            }`}
                          />
                        </div>
                        <span className={formData.organizationType === "industry-group" ? "text-white" : "text-deep-brand"}>
                          Industry Group
                        </span>
                      </Button>
                    </div>
                    {errors.organizationType && <p className="text-sm text-red-600">{errors.organizationType}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => updateFormData("organizationName", e.target.value)}
                      className={`h-12 ${errors.organizationName ? "border-red-300" : ""}`}
                    />
                    {errors.organizationName && <p className="text-sm text-red-600">{errors.organizationName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => updateFormData("jobTitle", e.target.value)}
                        className={`h-12 ${errors.jobTitle ? "border-red-300" : ""}`}
                      />
                      {errors.jobTitle && <p className="text-sm text-red-600">{errors.jobTitle}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => updateFormData("department", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationSize">Organization Size *</Label>
                    <Select
                      value={formData.organizationSize}
                      onValueChange={(value) => updateFormData("organizationSize", value)}
                    >
                      <SelectTrigger className={`h-12 ${errors.organizationSize ? "border-red-300" : ""}`}>
                        <SelectValue placeholder="Select organization size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                        <SelectItem value="1000+">1,000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.organizationSize && <p className="text-sm text-red-600">{errors.organizationSize}</p>}
                  </div>

                  {(formData.organizationType === "allocator" || formData.organizationType === "manager") && (
                    <div className="space-y-2">
                      <Label htmlFor="aum">Assets Under Management</Label>
                      <Select value={formData.aum} onValueChange={(value) => updateFormData("aum", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select AUM range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-100m">Under $100M</SelectItem>
                          <SelectItem value="100m-500m">$100M - $500M</SelectItem>
                          <SelectItem value="500m-1b">$500M - $1B</SelectItem>
                          <SelectItem value="1b-5b">$1B - $5B</SelectItem>
                          <SelectItem value="5b-10b">$5B - $10B</SelectItem>
                          <SelectItem value="10b+">$10B+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Terms & Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h3 className="font-semibold text-deep-brand text-lg mb-4">Account Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-base-gray">Name</span>
                        <span className="font-medium text-deep-brand">
                          {formData.firstName} {formData.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-base-gray">Email</span>
                        <span className="font-medium text-deep-brand">{formData.email}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-base-gray">Organization</span>
                        <span className="font-medium text-deep-brand">{formData.organizationName}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-base-gray">Role</span>
                        <div className="flex items-center gap-2">
                          {getOrganizationTypeIcon(formData.organizationType)}
                          <span className="font-medium text-deep-brand capitalize">{formData.organizationType}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-base-gray">Title</span>
                        <span className="font-medium text-deep-brand">{formData.jobTitle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => updateFormData("termsAccepted", !!checked)}
                        className={errors.termsAccepted ? "border-red-300" : ""}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="terms" className="text-sm font-medium">
                          I accept the{" "}
                          <Link href="/terms" className="text-electric-blue hover:underline">
                            Terms of Service
                          </Link>{" "}
                          *
                        </Label>
                        {errors.termsAccepted && <p className="text-sm text-red-600">{errors.termsAccepted}</p>}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacy"
                        checked={formData.privacyAccepted}
                        onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                        className={errors.privacyAccepted ? "border-red-300" : ""}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="privacy" className="text-sm font-medium">
                          I accept the{" "}
                          <Link href="/privacy" className="text-electric-blue hover:underline">
                            Privacy Policy
                          </Link>{" "}
                          *
                        </Label>
                        {errors.privacyAccepted && <p className="text-sm text-red-600">{errors.privacyAccepted}</p>}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="marketing"
                        checked={formData.marketingOptIn}
                        onCheckedChange={(checked) => updateFormData("marketingOptIn", !!checked)}
                      />
                      <Label htmlFor="marketing" className="text-sm">
                        I would like to receive product updates and marketing communications
                      </Label>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs text-blue-700">
                          1
                        </div>
                        <span>You'll receive an email verification link</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs text-blue-700">
                          2
                        </div>
                        <span>Our team will review your application (1-2 business days)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs text-blue-700">
                          3
                        </div>
                        <span>You'll get access to your personalized Vestira dashboard</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs text-blue-700">
                          4
                        </div>
                        <span>Optional onboarding call to optimize your experience</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <div>
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={handleBack} className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                </div>

                <div>
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-electric-blue hover:bg-electric-blue/90 flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-electric-blue hover:bg-electric-blue/90 h-12 px-8"
                    >
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
                          Creating Account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-base-gray">
              Already have an account?{" "}
              <Link href="/login" className="text-electric-blue hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
