"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building, Users, UserCheck, CheckCircle } from "lucide-react"
import Link from "next/link"

type FirmType = "manager" | "allocator" | "consultant"
type ManagerSubType =
  | "private-equity"
  | "venture-capital"
  | "hedge-fund"
  | "traditional-asset-management"
  | "hybrid-other"
type AllocatorSubType =
  | "insurance"
  | "corporation"
  | "corporate-pension"
  | "public-pension"
  | "family-office-hnw"
  | "other"
type ConsultantSubType = "consultant" | "gatekeeper" | "ocio" | "other"

interface OnboardingData {
  // Firm Information
  firmType: FirmType | null
  firmSubType: ManagerSubType | AllocatorSubType | ConsultantSubType | null
  firmName: string
  aum: string
  location: string
  founded: string
  website: string
  description: string

  // Personal Information
  firstName: string
  lastName: string
  email: string
  title: string

  // Asset Classes and Strategies (Self-Reported Data)
  assetClasses: string[]
  strategies: string[]
  investmentHorizon: string
  typicalInvestmentSize: string
  geographicFocus: string[]
  sectorFocus: string[]
  esgPreferences: string[]
  
  // Professional Network
  networkSize: string
  keyRelationships: string[]
  industryAffiliations: string[]
  
  // Platform Preferences
  communicationPreferences: string[]
  notificationSettings: {
    email: boolean
    push: boolean
    sms: boolean
  }
  
  // Verification
  submitted: boolean
}

const firmTypeLabels = {
  manager: "Asset Manager",
  allocator: "Allocator",
  consultant: "Consultant/Intermediary",
}

const managerSubTypes = {
  "private-equity": "Private Equity",
  "venture-capital": "Venture Capital",
  "hedge-fund": "Hedge Fund",
  "traditional-asset-management": "Traditional Asset Management",
  "hybrid-other": "Hybrid/Other",
}

const allocatorSubTypes = {
  insurance: "Insurance",
  corporation: "Corporation",
  "corporate-pension": "Corporate Pension",
  "public-pension": "Public Pension",
  "family-office-hnw": "Family Office/High Net Worth",
  other: "Other",
}

const consultantSubTypes = {
  consultant: "Consultant",
  gatekeeper: "Gatekeeper",
  ocio: "OCIO",
  other: "Other",
}

// Asset Classes and Strategies Data
const assetClasses = [
  "Private Equity",
  "Venture Capital",
  "Real Estate",
  "Infrastructure",
  "Private Credit",
  "Hedge Funds",
  "Public Equity",
  "Fixed Income",
  "Commodities",
  "Cryptocurrency",
  "Art & Collectibles",
  "Other Alternatives"
]

const strategies = [
  "Buyout",
  "Growth Equity",
  "Venture Capital",
  "Distressed",
  "Mezzanine",
  "Real Estate",
  "Infrastructure",
  "Hedge Fund",
  "Long/Short",
  "Market Neutral",
  "Global Macro",
  "Event Driven",
  "Multi-Strategy",
  "Fund of Funds",
  "Direct Investment",
  "Co-Investment"
]

const investmentHorizons = [
  "Short-term (1-3 years)",
  "Medium-term (3-7 years)",
  "Long-term (7-15 years)",
  "Very long-term (15+ years)"
]

const investmentSizes = [
  "Under $1M",
  "$1M - $10M",
  "$10M - $50M",
  "$50M - $100M",
  "$100M - $500M",
  "$500M - $1B",
  "Over $1B"
]

const geographicRegions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa",
  "Global"
]

const sectors = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer",
  "Industrial",
  "Energy",
  "Real Estate",
  "Infrastructure",
  "Materials",
  "Telecommunications",
  "Utilities",
  "Other"
]

const esgPreferences = [
  "ESG Integration",
  "Impact Investing",
  "Sustainability Focus",
  "Climate Action",
  "Social Responsibility",
  "Governance Focus",
  "Traditional Approach",
  "Not Applicable"
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    firmType: null,
    firmSubType: null,
    firmName: "",
    aum: "",
    location: "",
    founded: "",
    website: "",
    description: "",
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    assetClasses: [],
    strategies: [],
    investmentHorizon: "",
    typicalInvestmentSize: "",
    geographicFocus: [],
    sectorFocus: [],
    esgPreferences: [],
    networkSize: "",
    keyRelationships: [],
    industryAffiliations: [],
    communicationPreferences: [],
    notificationSettings: {
      email: true,
      push: false,
      sms: false,
    },
    submitted: false,
  })

  const handleFirmTypeSelect = (type: FirmType) => {
    setData((prev) => ({ ...prev, firmType: type, firmSubType: null }))
    setStep(2)
  }

  const handleSubTypeSelect = (subType: ManagerSubType | AllocatorSubType | ConsultantSubType) => {
    setData((prev) => ({ ...prev, firmSubType: subType }))
    setStep(3)
  }

  const handleFirmInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(4)
  }

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(5)
  }

  const handleFinalSubmit = () => {
    setData((prev) => ({ ...prev, submitted: true }))
    setStep(6)
  }

  const getSubTypeOptions = () => {
    if (data.firmType === "manager") return managerSubTypes
    if (data.firmType === "allocator") return allocatorSubTypes
    if (data.firmType === "consultant") return consultantSubTypes
    return {}
  }

  const getSubTypeLabel = (subType: string) => {
    const options = getSubTypeOptions()
    return options[subType as keyof typeof options] || subType
  }

  // Helper functions for enhanced onboarding
  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    } else {
      return [...array, item]
    }
  }

  const handleAssetClassToggle = (assetClass: string) => {
    setData(prev => ({
      ...prev,
      assetClasses: toggleArrayItem(prev.assetClasses, assetClass)
    }))
  }

  const handleStrategyToggle = (strategy: string) => {
    setData(prev => ({
      ...prev,
      strategies: toggleArrayItem(prev.strategies, strategy)
    }))
  }

  const handleGeographicFocusToggle = (region: string) => {
    setData(prev => ({
      ...prev,
      geographicFocus: toggleArrayItem(prev.geographicFocus, region)
    }))
  }

  const handleSectorFocusToggle = (sector: string) => {
    setData(prev => ({
      ...prev,
      sectorFocus: toggleArrayItem(prev.sectorFocus, sector)
    }))
  }

  const handleEsgPreferenceToggle = (preference: string) => {
    setData(prev => ({
      ...prev,
      esgPreferences: toggleArrayItem(prev.esgPreferences, preference)
    }))
  }

  if (step === 6) {
    return (
      <Screen>
        <div className="min-h-screen flex items-center justify-center bg-canvas-neutral px-4">
          <Card className="w-full max-w-2xl border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-electric-blue" />
              </div>
              <CardTitle className="text-2xl font-bold text-deep-brand">Application Submitted!</CardTitle>
              <CardDescription className="text-base-gray">
                Thank you for your interest in joining Vestira
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="bg-canvas-neutral/50 rounded-lg p-6">
                <h3 className="font-semibold text-deep-brand mb-2">What happens next?</h3>
                <div className="space-y-3 text-sm text-base-gray">
                  <p>1. Our team will verify your firm affiliation and credentials</p>
                  <p>2. You'll receive an email confirmation once approved (typically within 1-2 business days)</p>
                  <p>3. Upon approval, you can access your personalized Vestira dashboard</p>
                </div>
              </div>

              <div className="bg-electric-blue/5 border border-electric-blue/20 rounded-lg p-4">
                <p className="text-sm text-deep-brand">
                  <strong>Application ID:</strong> VES-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </p>
                <p className="text-xs text-base-gray mt-1">Please save this ID for your records</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/screens")}
                  className="border-base-gray text-base-gray hover:bg-canvas-neutral"
                >
                  Return to Home
                </Button>
                <Button
                  onClick={() => (window.location.href = "mailto:support@vestira.com")}
                  className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="min-h-screen bg-canvas-neutral px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/screens" className="flex items-center text-sm text-base-gray hover:text-electric-blue">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5, 6].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNum <= step
                        ? "bg-electric-blue text-white"
                        : "bg-white border-2 border-gray-200 text-base-gray"
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 6 && (
                    <div className={`w-16 h-0.5 mx-2 ${stepNum < step ? "bg-electric-blue" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-base-gray text-center">
              Step {step} of 6:{" "}
              {step === 1
                ? "Select Firm Type"
                : step === 2
                  ? "Choose Specialization"
                  : step === 3
                    ? "Firm Information"
                    : step === 4
                      ? "Personal Information"
                      : step === 5
                        ? "Investment Profile"
                        : "Review & Submit"}
            </div>
          </div>

          {/* Step 1: Firm Type Selection */}
          {step === 1 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-brand">Welcome to Vestira</CardTitle>
                <CardDescription className="text-base-gray">
                  Let's start by identifying your organization type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <button
                    onClick={() => handleFirmTypeSelect("manager")}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-electric-blue hover:bg-electric-blue/5 transition-all duration-200 text-left group"
                  >
                    <Building className="h-8 w-8 text-electric-blue mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-deep-brand mb-2">Asset Manager</h3>
                    <p className="text-sm text-base-gray">
                      Private equity, venture capital, hedge funds, and traditional asset management firms
                    </p>
                  </button>

                  <button
                    onClick={() => handleFirmTypeSelect("allocator")}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-electric-blue hover:bg-electric-blue/5 transition-all duration-200 text-left group"
                  >
                    <Users className="h-8 w-8 text-electric-blue mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-deep-brand mb-2">Allocator</h3>
                    <p className="text-sm text-base-gray">
                      Insurance companies, pensions, corporations, family offices, and institutional investors
                    </p>
                  </button>

                  <button
                    onClick={() => handleFirmTypeSelect("consultant")}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-electric-blue hover:bg-electric-blue/5 transition-all duration-200 text-left group"
                  >
                    <UserCheck className="h-8 w-8 text-electric-blue mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-deep-brand mb-2">Consultant/Intermediary</h3>
                    <p className="text-sm text-base-gray">
                      Investment consultants, gatekeepers, OCIOs, and other intermediaries
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Sub-type Selection */}
          {step === 2 && data.firmType && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <Badge className="mb-4 bg-electric-blue/10 text-electric-blue">{firmTypeLabels[data.firmType]}</Badge>
                <CardTitle className="text-2xl font-bold text-deep-brand">Choose Your Specialization</CardTitle>
                <CardDescription className="text-base-gray">
                  Select the category that best describes your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {Object.entries(getSubTypeOptions()).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleSubTypeSelect(key as any)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-electric-blue hover:bg-electric-blue/5 transition-all duration-200 text-left"
                    >
                      <h3 className="font-medium text-deep-brand">{label}</h3>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-base-gray text-base-gray hover:bg-canvas-neutral"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Firm Information */}
          {step === 3 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <Badge className="mb-4 bg-electric-blue/10 text-electric-blue">
                  {data.firmSubType ? getSubTypeLabel(data.firmSubType) : ""}
                </Badge>
                <CardTitle className="text-2xl font-bold text-deep-brand">Firm Information</CardTitle>
                <CardDescription className="text-base-gray">Tell us about your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFirmInfoSubmit} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firmName">Firm Name *</Label>
                      <Input
                        id="firmName"
                        value={data.firmName}
                        onChange={(e) => setData((prev) => ({ ...prev, firmName: e.target.value }))}
                        placeholder="Your firm name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aum">Assets Under Management</Label>
                      <Input
                        id="aum"
                        value={data.aum}
                        onChange={(e) => setData((prev) => ({ ...prev, aum: e.target.value }))}
                        placeholder="e.g., $500M, $2.5B"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={data.location}
                        onChange={(e) => setData((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="City, State/Country"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded">Year Founded</Label>
                      <Input
                        id="founded"
                        value={data.founded}
                        onChange={(e) => setData((prev) => ({ ...prev, founded: e.target.value }))}
                        placeholder="e.g., 2005"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={data.website}
                      onChange={(e) => setData((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourfirm.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Firm Description</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your firm's focus and expertise"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="border-base-gray text-base-gray hover:bg-canvas-neutral"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                      disabled={!data.firmName || !data.location}
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Personal Information */}
          {step === 4 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-brand">Personal Information</CardTitle>
                <CardDescription className="text-base-gray">Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={data.firstName}
                        onChange={(e) => setData((prev) => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={data.lastName}
                        onChange={(e) => setData((prev) => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="john.smith@yourfirm.com"
                      required
                    />
                    <p className="text-xs text-base-gray">Must be a business email address associated with your firm</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Investment Director, Portfolio Manager"
                      required
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(3)}
                      className="border-base-gray text-base-gray hover:bg-canvas-neutral"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                      disabled={!data.firstName || !data.lastName || !data.email || !data.title}
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Investment Profile */}
          {step === 5 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-brand">Investment Profile</CardTitle>
                <CardDescription className="text-base-gray">
                  Help us understand your investment focus and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Asset Classes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-deep-brand">Asset Classes</h3>
                    <p className="text-sm text-base-gray">Select all asset classes you invest in or are interested in</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {assetClasses.map((assetClass) => (
                        <button
                          key={assetClass}
                          type="button"
                          onClick={() => handleAssetClassToggle(assetClass)}
                          className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                            data.assetClasses.includes(assetClass)
                              ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                              : "border-gray-200 hover:border-electric-blue/50"
                          }`}
                        >
                          {assetClass}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strategies */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-deep-brand">Investment Strategies</h3>
                    <p className="text-sm text-base-gray">Select strategies that align with your investment approach</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {strategies.map((strategy) => (
                        <button
                          key={strategy}
                          type="button"
                          onClick={() => handleStrategyToggle(strategy)}
                          className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                            data.strategies.includes(strategy)
                              ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                              : "border-gray-200 hover:border-electric-blue/50"
                          }`}
                        >
                          {strategy}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Investment Horizon and Size */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="investmentHorizon">Typical Investment Horizon</Label>
                      <Select value={data.investmentHorizon} onValueChange={(value) => setData(prev => ({ ...prev, investmentHorizon: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select investment horizon" />
                        </SelectTrigger>
                        <SelectContent>
                          {investmentHorizons.map((horizon) => (
                            <SelectItem key={horizon} value={horizon}>{horizon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="investmentSize">Typical Investment Size</Label>
                      <Select value={data.typicalInvestmentSize} onValueChange={(value) => setData(prev => ({ ...prev, typicalInvestmentSize: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select investment size" />
                        </SelectTrigger>
                        <SelectContent>
                          {investmentSizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Geographic Focus */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-deep-brand">Geographic Focus</h3>
                    <p className="text-sm text-base-gray">Select regions where you invest or are interested in investing</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {geographicRegions.map((region) => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => handleGeographicFocusToggle(region)}
                          className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                            data.geographicFocus.includes(region)
                              ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                              : "border-gray-200 hover:border-electric-blue/50"
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sector Focus */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-deep-brand">Sector Focus</h3>
                    <p className="text-sm text-base-gray">Select sectors you invest in or are interested in</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {sectors.map((sector) => (
                        <button
                          key={sector}
                          type="button"
                          onClick={() => handleSectorFocusToggle(sector)}
                          className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                            data.sectorFocus.includes(sector)
                              ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                              : "border-gray-200 hover:border-electric-blue/50"
                          }`}
                        >
                          {sector}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ESG Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-deep-brand">ESG & Sustainability Preferences</h3>
                    <p className="text-sm text-base-gray">Select your approach to ESG and sustainability</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {esgPreferences.map((preference) => (
                        <button
                          key={preference}
                          type="button"
                          onClick={() => handleEsgPreferenceToggle(preference)}
                          className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                            data.esgPreferences.includes(preference)
                              ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                              : "border-gray-200 hover:border-electric-blue/50"
                          }`}
                        >
                          {preference}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(4)}
                      className="border-base-gray text-base-gray hover:bg-canvas-neutral"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(6)}
                      className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                      disabled={data.assetClasses.length === 0 && data.strategies.length === 0}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Review & Submit */}
          {step === 6 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-deep-brand">Review Your Application</CardTitle>
                <CardDescription className="text-base-gray">
                  Please review your information before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Firm Information */}
                  <div className="bg-canvas-neutral/50 rounded-lg p-6">
                    <h3 className="font-semibold text-deep-brand mb-4">Firm Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-base-gray">Type:</span>
                        <p className="font-medium text-deep-brand">
                          {data.firmType && firmTypeLabels[data.firmType]} -{" "}
                          {data.firmSubType ? getSubTypeLabel(data.firmSubType) : ""}
                        </p>
                      </div>
                      <div>
                        <span className="text-base-gray">Name:</span>
                        <p className="font-medium text-deep-brand">{data.firmName}</p>
                      </div>
                      <div>
                        <span className="text-base-gray">AUM:</span>
                        <p className="font-medium text-deep-brand">{data.aum || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-base-gray">Location:</span>
                        <p className="font-medium text-deep-brand">{data.location}</p>
                      </div>
                      <div>
                        <span className="text-base-gray">Founded:</span>
                        <p className="font-medium text-deep-brand">{data.founded || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-base-gray">Website:</span>
                        <p className="font-medium text-deep-brand">{data.website || "Not specified"}</p>
                      </div>
                    </div>
                    {data.description && (
                      <div className="mt-4">
                        <span className="text-base-gray">Description:</span>
                        <p className="font-medium text-deep-brand mt-1">{data.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="bg-canvas-neutral/50 rounded-lg p-6">
                    <h3 className="font-semibold text-deep-brand mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-base-gray">Name:</span>
                        <p className="font-medium text-deep-brand">
                          {data.firstName} {data.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-base-gray">Email:</span>
                        <p className="font-medium text-deep-brand">{data.email}</p>
                      </div>
                      <div>
                        <span className="text-base-gray">Title:</span>
                        <p className="font-medium text-deep-brand">{data.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Investment Profile */}
                  <div className="bg-canvas-neutral/50 rounded-lg p-6">
                    <h3 className="font-semibold text-deep-brand mb-4">Investment Profile</h3>
                    <div className="space-y-4 text-sm">
                      {data.assetClasses.length > 0 && (
                        <div>
                          <span className="text-base-gray">Asset Classes:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {data.assetClasses.map((assetClass) => (
                              <Badge key={assetClass} variant="secondary" className="text-xs">
                                {assetClass}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {data.strategies.length > 0 && (
                        <div>
                          <span className="text-base-gray">Strategies:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {data.strategies.map((strategy) => (
                              <Badge key={strategy} variant="secondary" className="text-xs">
                                {strategy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {data.investmentHorizon && (
                        <div>
                          <span className="text-base-gray">Investment Horizon:</span>
                          <p className="font-medium text-deep-brand">{data.investmentHorizon}</p>
                        </div>
                      )}
                      
                      {data.typicalInvestmentSize && (
                        <div>
                          <span className="text-base-gray">Typical Investment Size:</span>
                          <p className="font-medium text-deep-brand">{data.typicalInvestmentSize}</p>
                        </div>
                      )}
                      
                      {data.geographicFocus.length > 0 && (
                        <div>
                          <span className="text-base-gray">Geographic Focus:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {data.geographicFocus.map((region) => (
                              <Badge key={region} variant="outline" className="text-xs">
                                {region}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {data.sectorFocus.length > 0 && (
                        <div>
                          <span className="text-base-gray">Sector Focus:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {data.sectorFocus.map((sector) => (
                              <Badge key={sector} variant="outline" className="text-xs">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {data.esgPreferences.length > 0 && (
                        <div>
                          <span className="text-base-gray">ESG Preferences:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {data.esgPreferences.map((preference) => (
                              <Badge key={preference} variant="outline" className="text-xs">
                                {preference}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-electric-blue/5 border border-electric-blue/20 rounded-lg p-4">
                    <p className="text-sm text-deep-brand">
                      <strong>Next Steps:</strong> After submission, our team will verify your firm affiliation and
                      credentials. You'll receive email confirmation once approved, typically within 1-2 business days.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setStep(5)}
                      className="border-base-gray text-base-gray hover:bg-canvas-neutral"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleFinalSubmit}
                      className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                    >
                      Submit Application
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Screen>
  )
}
