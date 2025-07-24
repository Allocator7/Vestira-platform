"use client"

import { useState } from "react"
import Screen from "@/components/Screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  FileText,
  Search,
} from "lucide-react"

export default function DocumentSamplePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(100)
  const totalPages = 24

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 25)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 25)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Screen>
      <div className="container mx-auto py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Global Macro Fund - Investment Strategy Overview</h1>
              <div className="flex items-center text-muted-foreground text-sm">
                <FileText className="h-4 w-4 mr-1" />
                <span className="mr-3">PDF • 2.8 MB</span>
                <Eye className="h-4 w-4 mr-1" />
                <span className="mr-3">42 views</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>Updated April 15, 2025</span>
              </div>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Print</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-lg">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="h-8 w-8"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm mx-2">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="h-8 w-8"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="rounded-t-none">
            <CardContent className="p-0">
              <div className="bg-white border-t border-gray-200" style={{ height: "70vh", overflow: "auto" }}>
                {/* Document content - this would be the actual PDF viewer in a real implementation */}
                <div className="p-8" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}>
                  {/* Sample document content */}
                  <div className="max-w-3xl mx-auto">
                    {currentPage === 1 ? (
                      <>
                        <div className="text-center mb-12">
                          <div className="mb-6">
                            <img src="/stylized-wm.png" alt="Quantum Capital Partners" className="h-16 mx-auto mb-4" />
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confidential</Badge>
                          </div>
                          <h1 className="text-3xl font-bold mb-4">Global Macro Fund</h1>
                          <h2 className="text-xl font-medium mb-2">Investment Strategy Overview</h2>
                          <p className="text-muted-foreground">April 2025</p>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-lg font-bold mb-2">Disclaimer</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            This document is for informational purposes only and does not constitute an offer to sell or
                            a solicitation of an offer to buy any securities. The information contained herein is
                            confidential and may not be reproduced or distributed without the prior written consent of
                            Quantum Capital Partners.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Past performance is not indicative of future results. Investment involves risk, including
                            the possible loss of principal.
                          </p>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-lg font-bold mb-2">Table of Contents</h3>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Executive Summary</li>
                            <li>Investment Philosophy</li>
                            <li>Investment Process</li>
                            <li>Risk Management</li>
                            <li>Portfolio Construction</li>
                            <li>Performance History</li>
                            <li>Team Biographies</li>
                            <li>Fund Terms</li>
                          </ol>
                        </div>
                      </>
                    ) : currentPage === 2 ? (
                      <>
                        <div className="mb-8">
                          <h2 className="text-xl font-bold mb-4">1. Executive Summary</h2>
                          <p className="mb-4">
                            The Quantum Global Macro Fund employs a discretionary global macro strategy focusing on G10
                            and emerging markets. The Fund seeks to generate absolute returns with low correlation to
                            traditional asset classes by identifying and capitalizing on macroeconomic trends and market
                            dislocations across global markets.
                          </p>
                          <p className="mb-4">
                            Our investment approach combines top-down macroeconomic analysis with bottom-up fundamental
                            research to identify compelling investment opportunities across asset classes, including
                            fixed income, currencies, equities, and commodities.
                          </p>
                          <p>
                            The Fund targets annualized returns of 12-15% with volatility of 8-10% and has demonstrated
                            strong performance across various market environments since inception in 2015.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold mb-2">Key Differentiators</h3>
                          <ul className="list-disc list-inside space-y-1">
                            <li>
                              <span className="font-medium">Experienced Team:</span> Our investment team has an average
                              of 15+ years of experience across global markets and economic cycles.
                            </li>
                            <li>
                              <span className="font-medium">Robust Risk Management:</span> Proprietary risk management
                              framework designed to protect capital during market dislocations.
                            </li>
                            <li>
                              <span className="font-medium">Flexible Mandate:</span> Ability to express views across
                              asset classes and geographies, both long and short.
                            </li>
                            <li>
                              <span className="font-medium">Proven Track Record:</span> Consistent performance with
                              positive returns in 9 out of 10 years since inception.
                            </li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">
                          Page {currentPage} content would be displayed here in a real implementation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="annotations">Annotations</TabsTrigger>
                <TabsTrigger value="history">Version History</TabsTrigger>
              </TabsList>
              <TabsContent value="comments" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="font-medium text-blue-700">JD</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">John Doe</p>
                              <p className="text-xs text-muted-foreground">May 12, 2025 at 10:23 AM</p>
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mt-1">
                            Could you provide more details on the risk management framework mentioned on page 4?
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="font-medium text-green-700">SC</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Sarah Chen</p>
                              <p className="text-xs text-muted-foreground">May 12, 2025 at 2:45 PM</p>
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mt-1">
                            I've added a more detailed explanation in the risk management section. Please let me know if
                            you need any additional information.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="flex items-center border rounded-lg p-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-grow border-none focus:outline-none text-sm"
                          />
                          <Button size="sm">Post</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="annotations" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="font-medium text-amber-700">MR</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Michael Rodriguez</p>
                              <p className="text-xs text-muted-foreground">May 10, 2025 at 11:30 AM • Page 5</p>
                            </div>
                          </div>
                          <p className="text-sm mt-1">
                            Highlighted: "The Fund employs a multi-layered risk management approach..."
                          </p>
                          <p className="text-sm mt-1 bg-yellow-50 p-2 border-l-2 border-yellow-400">
                            This is a key differentiator for our strategy. We should emphasize this more in our
                            presentations.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="font-medium text-purple-700">EJ</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Emily Johnson</p>
                              <p className="text-xs text-muted-foreground">May 8, 2025 at 3:15 PM • Page 12</p>
                            </div>
                          </div>
                          <p className="text-sm mt-1">Highlighted: "Performance during the 2020 market downturn..."</p>
                          <p className="text-sm mt-1 bg-yellow-50 p-2 border-l-2 border-yellow-400">
                            This performance data is very compelling. Consider moving this section earlier in the
                            presentation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Version 3.0 (Current)</p>
                              <p className="text-xs text-muted-foreground">
                                Updated by Michael Rodriguez • April 15, 2025
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Updated performance data and added new section on ESG integration.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <FileText className="h-4 w-4 text-gray-700" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Version 2.5</p>
                              <p className="text-xs text-muted-foreground">Updated by Sarah Chen • February 10, 2025</p>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          <p className="text-sm mt-1">Revised risk management section and updated team biographies.</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <FileText className="h-4 w-4 text-gray-700" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Version 2.0</p>
                              <p className="text-xs text-muted-foreground">
                                Updated by James Wilson • November 5, 2024
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Major revision with updated strategy overview and performance data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Screen>
  )
}
