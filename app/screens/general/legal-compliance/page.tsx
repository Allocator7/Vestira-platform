"use client"

import { useState } from "react"
import Screen from "@/components/Screen"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, FileText, CheckCircle, AlertTriangle, Info, ExternalLink } from "lucide-react"

export default function LegalCompliancePage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample legal documents
  const legalDocuments = [
    {
      id: 1,
      title: "Terms of Service",
      description: "The terms and conditions for using the Vestira platform",
      lastUpdated: "April 15, 2025",
      category: "legal",
      required: true,
      status: "current",
    },
    {
      id: 2,
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information",
      lastUpdated: "April 15, 2025",
      category: "legal",
      required: true,
      status: "current",
    },
    {
      id: 3,
      title: "Data Processing Agreement",
      description: "Terms governing how we process data on your behalf",
      lastUpdated: "March 10, 2025",
      category: "legal",
      required: true,
      status: "current",
    },
    {
      id: 4,
      title: "Acceptable Use Policy",
      description: "Guidelines for appropriate use of our platform",
      lastUpdated: "February 22, 2025",
      category: "legal",
      required: true,
      status: "current",
    },
    {
      id: 5,
      title: "SEC Form ADV",
      description: "Registration form for investment advisers",
      lastUpdated: "January 15, 2025",
      category: "compliance",
      required: true,
      status: "action-required",
    },
    {
      id: 6,
      title: "Anti-Money Laundering Policy",
      description: "Our policies to prevent money laundering",
      lastUpdated: "December 5, 2024",
      category: "compliance",
      required: true,
      status: "current",
    },
    {
      id: 7,
      title: "GDPR Compliance Statement",
      description: "Our compliance with EU data protection regulations",
      lastUpdated: "November 18, 2024",
      category: "compliance",
      required: false,
      status: "current",
    },
    {
      id: 8,
      title: "Business Continuity Plan",
      description: "Our plan for maintaining operations during disruptions",
      lastUpdated: "October 30, 2024",
      category: "compliance",
      required: false,
      status: "current",
    },
    {
      id: 9,
      title: "Code of Ethics",
      description: "Our ethical standards and practices",
      lastUpdated: "September 12, 2024",
      category: "compliance",
      required: true,
      status: "current",
    },
    {
      id: 10,
      title: "Cybersecurity Policy",
      description: "Our measures to protect data and systems",
      lastUpdated: "August 5, 2024",
      category: "compliance",
      required: true,
      status: "current",
    },
  ]

  // Filter documents based on search query
  const filteredDocuments = legalDocuments.filter((doc) => {
    if (
      searchQuery &&
      !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" /> Current
          </Badge>
        )
      case "action-required":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <AlertTriangle className="h-3 w-3 mr-1" /> Action Required
          </Badge>
        )
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
      default:
        return null
    }
  }

  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Legal & Compliance</h1>
          <p className="text-muted-foreground mb-6">Access and manage legal documents and compliance requirements</p>

          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Your current compliance status and required actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium">Compliant Documents</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">9 of 10 documents are up to date</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                    <h3 className="font-medium">Action Required</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">1 document needs your attention</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-2">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium">Next Review</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Scheduled for June 15, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="relative mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="required">Required</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="bg-white rounded-lg shadow">
                {filteredDocuments.length > 0 ? (
                  <div className="divide-y">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center mb-1">
                              <h3 className="font-medium mr-2">{doc.title}</h3>
                              {getStatusBadge(doc.status)}
                              {doc.required && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                            <p className="text-xs text-muted-foreground">Last updated: {doc.lastUpdated}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No documents found matching your search</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="legal" className="mt-0">
              <div className="bg-white rounded-lg shadow">
                {filteredDocuments.filter((doc) => doc.category === "legal").length > 0 ? (
                  <div className="divide-y">
                    {filteredDocuments
                      .filter((doc) => doc.category === "legal")
                      .map((doc) => (
                        <div key={doc.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-grow">
                              <div className="flex items-center mb-1">
                                <h3 className="font-medium mr-2">{doc.title}</h3>
                                {getStatusBadge(doc.status)}
                                {doc.required && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Required</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                              <p className="text-xs text-muted-foreground">Last updated: {doc.lastUpdated}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No legal documents found matching your search</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-0">
              <div className="bg-white rounded-lg shadow">
                {filteredDocuments.filter((doc) => doc.category === "compliance").length > 0 ? (
                  <div className="divide-y">
                    {filteredDocuments
                      .filter((doc) => doc.category === "compliance")
                      .map((doc) => (
                        <div key={doc.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-grow">
                              <div className="flex items-center mb-1">
                                <h3 className="font-medium mr-2">{doc.title}</h3>
                                {getStatusBadge(doc.status)}
                                {doc.required && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Required</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                              <p className="text-xs text-muted-foreground">Last updated: {doc.lastUpdated}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No compliance documents found matching your search</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="required" className="mt-0">
              <div className="bg-white rounded-lg shadow">
                {filteredDocuments.filter((doc) => doc.required).length > 0 ? (
                  <div className="divide-y">
                    {filteredDocuments
                      .filter((doc) => doc.required)
                      .map((doc) => (
                        <div key={doc.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-grow">
                              <div className="flex items-center mb-1">
                                <h3 className="font-medium mr-2">{doc.title}</h3>
                                {getStatusBadge(doc.status)}
                                <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Required</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                              <p className="text-xs text-muted-foreground">Last updated: {doc.lastUpdated}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No required documents found matching your search</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-4">
                  What compliance documents are required for investment managers?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-muted-foreground">
                    Investment managers typically need to maintain several compliance documents, including Form ADV,
                    Code of Ethics, Anti-Money Laundering Policy, Cybersecurity Policy, and Business Continuity Plan.
                    The specific requirements may vary based on your jurisdiction and regulatory status.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="px-4">How often should I update my compliance documents?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-muted-foreground">
                    Most compliance documents should be reviewed at least annually. However, you should update them
                    whenever there are significant changes to your business, regulatory requirements, or best practices.
                    Vestira will send you reminders when documents are due for review.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="px-4">How does Vestira help with regulatory compliance?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-muted-foreground">
                    Vestira provides tools to help you manage and track your compliance documents, sends reminders for
                    document updates, and offers templates for common compliance requirements. However, Vestira is not a
                    substitute for legal advice, and you should consult with your compliance officer or legal counsel
                    for specific regulatory requirements.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="px-4">Can allocators view my compliance documents?</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-muted-foreground">
                    You can choose which compliance documents to share with allocators through your data rooms. This
                    allows you to maintain confidentiality while providing allocators with the information they need for
                    their due diligence process.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="px-4">
                  What should I do if I receive a regulatory inquiry?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-muted-foreground">
                    If you receive a regulatory inquiry, you should contact your legal counsel immediately. Vestira can
                    help you organize and provide the necessary documents, but regulatory inquiries require professional
                    legal guidance.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Regulatory Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-gray-100 rounded-full">
                    <ExternalLink className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">SEC Investment Adviser Regulation</h3>
                    <p className="text-sm text-muted-foreground">Official SEC resources for investment advisers</p>
                  </div>
                </div>
              </a>
              <a href="#" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-gray-100 rounded-full">
                    <ExternalLink className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">FINRA Compliance Resources</h3>
                    <p className="text-sm text-muted-foreground">Guidance and tools from FINRA</p>
                  </div>
                </div>
              </a>
              <a href="#" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-gray-100 rounded-full">
                    <ExternalLink className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">NFA Compliance Resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Resources for commodity pool operators and trading advisors
                    </p>
                  </div>
                </div>
              </a>
              <a href="#" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-gray-100 rounded-full">
                    <ExternalLink className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">GDPR Compliance Guide</h3>
                    <p className="text-sm text-muted-foreground">Guide to EU data protection regulations</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}
