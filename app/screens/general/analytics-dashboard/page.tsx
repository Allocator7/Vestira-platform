"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ExportButton } from "@/components/ExportButton"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Target,
  Shield,
  Leaf,
  Globe,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  Building,
  Briefcase,
} from "lucide-react"
import { useApp } from "@/context/AppContext"
import { useToast } from "@/hooks/use-toast"

interface PerformanceMetric {
  name: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  benchmark?: string
  percentile?: number
}

interface PortfolioAllocation {
  assetClass: string
  allocation: number
  target: number
  value: string
  performance: string
  trend: "up" | "down" | "neutral"
}

interface RiskMetric {
  metric: string
  value: string
  level: "low" | "medium" | "high"
  description: string
}

interface ESGScore {
  category: string
  score: number
  benchmark: number
  trend: "improving" | "declining" | "stable"
  description: string
}

interface MarketInsight {
  title: string
  category: string
  impact: "high" | "medium" | "low"
  description: string
  date: string
  source: string
}

export default function AnalyticsDashboardPage() {
  const { userRole } = useApp()
  const { toast } = useToast()

  const [timeRange, setTimeRange] = useState("1Y")
  const [selectedBenchmark, setSelectedBenchmark] = useState("russell2000")
  const [riskTolerance, setRiskTolerance] = useState([65])

  // Mock performance data
  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      name: "Total Return",
      value: "14.2%",
      change: "+2.1%",
      trend: "up",
      benchmark: "12.1%",
      percentile: 75,
    },
    {
      name: "Sharpe Ratio",
      value: "1.34",
      change: "+0.12",
      trend: "up",
      benchmark: "1.22",
      percentile: 68,
    },
    {
      name: "Volatility",
      value: "12.8%",
      change: "-1.2%",
      trend: "down",
      benchmark: "14.0%",
      percentile: 82,
    },
    {
      name: "Max Drawdown",
      value: "-8.4%",
      change: "+1.1%",
      trend: "up",
      benchmark: "-9.5%",
      percentile: 71,
    },
  ])

  const [portfolioAllocations] = useState<PortfolioAllocation[]>([
    {
      assetClass: "Private Equity",
      allocation: 35,
      target: 30,
      value: "$1.05B",
      performance: "+16.8%",
      trend: "up",
    },
    {
      assetClass: "Public Equity",
      allocation: 25,
      target: 30,
      value: "$750M",
      performance: "+12.4%",
      trend: "up",
    },
    {
      assetClass: "Fixed Income",
      allocation: 20,
      target: 20,
      value: "$600M",
      performance: "+4.2%",
      trend: "neutral",
    },
    {
      assetClass: "Real Estate",
      allocation: 15,
      target: 15,
      value: "$450M",
      performance: "+8.9%",
      trend: "up",
    },
    {
      assetClass: "Alternatives",
      allocation: 5,
      target: 5,
      value: "$150M",
      performance: "+11.3%",
      trend: "up",
    },
  ])

  const [riskMetrics] = useState<RiskMetric[]>([
    {
      metric: "Value at Risk (95%)",
      value: "$45.2M",
      level: "medium",
      description: "Maximum expected loss over 1 month at 95% confidence",
    },
    {
      metric: "Beta",
      value: "0.87",
      level: "low",
      description: "Portfolio sensitivity to market movements",
    },
    {
      metric: "Tracking Error",
      value: "3.2%",
      level: "medium",
      description: "Standard deviation of excess returns vs benchmark",
    },
    {
      metric: "Information Ratio",
      value: "0.65",
      level: "medium",
      description: "Risk-adjusted excess return vs benchmark",
    },
  ])

  const [esgScores] = useState<ESGScore[]>([
    {
      category: "Environmental",
      score: 78,
      benchmark: 72,
      trend: "improving",
      description: "Carbon footprint, renewable energy, waste management",
    },
    {
      category: "Social",
      score: 82,
      benchmark: 75,
      trend: "improving",
      description: "Labor practices, community impact, diversity & inclusion",
    },
    {
      category: "Governance",
      score: 85,
      benchmark: 80,
      trend: "stable",
      description: "Board composition, executive compensation, transparency",
    },
    {
      category: "Overall ESG",
      score: 81,
      benchmark: 76,
      trend: "improving",
      description: "Composite ESG score across all categories",
    },
  ])

  const [marketInsights] = useState<MarketInsight[]>([
    {
      title: "Federal Reserve Policy Shift",
      category: "Monetary Policy",
      impact: "high",
      description: "Expected rate cuts may benefit growth equity strategies",
      date: "2024-01-25",
      source: "Federal Reserve",
    },
    {
      title: "Private Credit Market Expansion",
      category: "Alternative Investments",
      impact: "medium",
      description: "Increased demand for private credit amid bank lending constraints",
      date: "2024-01-24",
      source: "Preqin Research",
    },
    {
      title: "ESG Regulation Updates",
      category: "Regulatory",
      impact: "medium",
      description: "New SEC climate disclosure requirements affecting portfolio companies",
      date: "2024-01-23",
      source: "SEC",
    },
    {
      title: "Emerging Markets Recovery",
      category: "Global Markets",
      impact: "low",
      description: "Signs of economic stabilization in key emerging markets",
      date: "2024-01-22",
      source: "IMF",
    },
  ])

  // Helper functions
  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getRiskBadge = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
    }
  }

  const getImpactBadge = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Impact</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Impact</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low Impact</Badge>
    }
  }

  const getESGTrendIcon = (trend: "improving" | "declining" | "stable") => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const handleExportData = () => {
    const exportData = {
      performanceMetrics,
      portfolioAllocations,
      riskMetrics,
      esgScores,
      marketInsights,
      generatedAt: new Date().toISOString(),
      timeRange,
      benchmark: selectedBenchmark,
    }

    toast({
      title: "Analytics exported",
      description: "Your analytics data has been exported successfully.",
    })

    return exportData
  }

  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Analytics data has been updated with the latest market information.",
    })
  }

  return (
    <Screen>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-deepBrand">Analytics Dashboard</h1>
              <p className="text-baseGray">
                Comprehensive performance analytics and market insights for institutional investors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="1M">1 Month</option>
                <option value="3M">3 Months</option>
                <option value="6M">6 Months</option>
                <option value="1Y">1 Year</option>
                <option value="3Y">3 Years</option>
                <option value="5Y">5 Years</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                value={selectedBenchmark}
                onChange={(e) => setSelectedBenchmark(e.target.value)}
              >
                <option value="sp500">S&P 500</option>
                <option value="russell2000">Russell 2000</option>
                <option value="msci_world">MSCI World</option>
                <option value="custom">Custom Benchmark</option>
              </select>
              <Button variant="outline" onClick={handleRefreshData} className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <ExportButton
                data={handleExportData()}
                filename={`vestira-analytics-${new Date().toISOString().split("T")[0]}`}
                label="Export"
                variant="outline"
              />
            </div>
          </div>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="esg">ESG Metrics</TabsTrigger>
              <TabsTrigger value="insights">Market Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {performanceMetrics.map((metric) => (
                  <Card key={metric.name}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-baseGray">{metric.name}</p>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <p className="text-2xl font-bold text-deepBrand">{metric.value}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-baseGray">vs {metric.benchmark}</p>
                        <p
                          className={`text-xs font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                        >
                          {metric.change}
                        </p>
                      </div>
                      {metric.percentile && (
                        <div className="mt-2">
                          <p className="text-xs text-baseGray mb-1">Percentile Rank</p>
                          <Progress value={metric.percentile} className="h-1" />
                          <p className="text-xs text-deepBrand mt-1">{metric.percentile}th percentile</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Performance Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-deepBrand flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Performance vs Benchmark ({timeRange})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Interactive performance chart would be displayed here</p>
                      <p className="text-sm text-gray-400">
                        Showing portfolio performance vs {selectedBenchmark.toUpperCase()} benchmark
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attribution Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand">Return Attribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Asset Allocation</span>
                        <span className="text-sm font-medium text-deepBrand">+2.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Security Selection</span>
                        <span className="text-sm font-medium text-deepBrand">+1.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Currency Impact</span>
                        <span className="text-sm font-medium text-red-600">-0.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Interaction Effect</span>
                        <span className="text-sm font-medium text-deepBrand">+0.2%</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-deepBrand">Total Active Return</span>
                          <span className="text-sm font-bold text-deepBrand">+4.1%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand">Rolling Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">1 Year</span>
                        <span className="text-sm font-medium text-deepBrand">14.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">3 Year (Annualized)</span>
                        <span className="text-sm font-medium text-deepBrand">12.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">5 Year (Annualized)</span>
                        <span className="text-sm font-medium text-deepBrand">11.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Since Inception</span>
                        <span className="text-sm font-medium text-deepBrand">10.9%</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-deepBrand">Best Year</span>
                          <span className="text-sm font-bold text-green-600">+28.4% (2021)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              {/* Portfolio Allocation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Asset Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioAllocations.map((allocation) => (
                        <div key={allocation.assetClass} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-deepBrand">{allocation.assetClass}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-baseGray">{allocation.allocation}%</span>
                              {getTrendIcon(allocation.trend)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={allocation.allocation} className="flex-1 h-2" />
                            <span className="text-xs text-baseGray">Target: {allocation.target}%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-baseGray">{allocation.value}</span>
                            <span
                              className={`font-medium ${allocation.trend === "up" ? "text-green-600" : "text-red-600"}`}
                            >
                              {allocation.performance}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand">Rebalancing Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-deepBrand">Private Equity Overweight</p>
                            <p className="text-xs text-baseGray">
                              Current: 35% | Target: 30% | Recommendation: Reduce by $150M
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-deepBrand">Public Equity Underweight</p>
                            <p className="text-xs text-baseGray">
                              Current: 25% | Target: 30% | Recommendation: Increase by $150M
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-deepBrand">Fixed Income On Target</p>
                            <p className="text-xs text-baseGray">Current allocation aligns with strategic targets</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Geographic & Sector Allocation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Geographic Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { region: "North America", allocation: 65, value: "$1.95B" },
                        { region: "Europe", allocation: 20, value: "$600M" },
                        { region: "Asia Pacific", allocation: 10, value: "$300M" },
                        { region: "Emerging Markets", allocation: 5, value: "$150M" },
                      ].map((region) => (
                        <div key={region.region} className="flex items-center justify-between">
                          <span className="text-sm text-deepBrand">{region.region}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={region.allocation} className="w-20 h-2" />
                            <span className="text-sm text-baseGray w-12">{region.allocation}%</span>
                            <span className="text-sm text-deepBrand w-20 text-right">{region.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Sector Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { sector: "Technology", allocation: 25, value: "$750M" },
                        { sector: "Healthcare", allocation: 18, value: "$540M" },
                        { sector: "Financial Services", allocation: 15, value: "$450M" },
                        { sector: "Consumer", allocation: 12, value: "$360M" },
                        { sector: "Industrial", allocation: 10, value: "$300M" },
                        { sector: "Other", allocation: 20, value: "$600M" },
                      ].map((sector) => (
                        <div key={sector.sector} className="flex items-center justify-between">
                          <span className="text-sm text-deepBrand">{sector.sector}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={sector.allocation} className="w-20 h-2" />
                            <span className="text-sm text-baseGray w-12">{sector.allocation}%</span>
                            <span className="text-sm text-deepBrand w-20 text-right">{sector.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              {/* Risk Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {riskMetrics.map((risk) => (
                  <Card key={risk.metric}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-deepBrand">{risk.metric}</p>
                        {getRiskBadge(risk.level)}
                      </div>
                      <p className="text-2xl font-bold text-deepBrand mb-2">{risk.value}</p>
                      <p className="text-xs text-baseGray">{risk.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Risk Tolerance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-deepBrand flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Risk Tolerance Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-deepBrand">Risk Tolerance Level</label>
                        <span className="text-sm text-baseGray">{riskTolerance[0]}%</span>
                      </div>
                      <Slider
                        value={riskTolerance}
                        onValueChange={setRiskTolerance}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-baseGray mt-1">
                        <span>Conservative</span>
                        <span>Moderate</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-deepBrand">Current VaR</p>
                        <p className="text-lg font-bold text-green-600">$45.2M</p>
                        <p className="text-xs text-baseGray">Within tolerance</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-deepBrand">Stress Test</p>
                        <p className="text-lg font-bold text-yellow-600">-12.8%</p>
                        <p className="text-xs text-baseGray">2008 scenario</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-deepBrand">Correlation</p>
                        <p className="text-lg font-bold text-blue-600">0.73</p>
                        <p className="text-xs text-baseGray">vs benchmark</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenario Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-deepBrand">Scenario Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { scenario: "Base Case", probability: "60%", return: "+12.5%", impact: "neutral" },
                      { scenario: "Bull Market", probability: "20%", return: "+24.8%", impact: "positive" },
                      { scenario: "Bear Market", probability: "15%", return: "-8.2%", impact: "negative" },
                      { scenario: "Black Swan", probability: "5%", return: "-22.1%", impact: "severe" },
                    ].map((scenario) => (
                      <div key={scenario.scenario} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-deepBrand">{scenario.scenario}</p>
                          <p className="text-xs text-baseGray">Probability: {scenario.probability}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${
                              scenario.impact === "positive"
                                ? "text-green-600"
                                : scenario.impact === "negative" || scenario.impact === "severe"
                                  ? "text-red-600"
                                  : "text-deepBrand"
                            }`}
                          >
                            {scenario.return}
                          </p>
                          <p className="text-xs text-baseGray capitalize">{scenario.impact} impact</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="esg" className="space-y-6">
              {/* ESG Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {esgScores.map((esg) => (
                  <Card key={esg.category}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-deepBrand">{esg.category}</p>
                        {getESGTrendIcon(esg.trend)}
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-2xl font-bold text-deepBrand">{esg.score}</p>
                        <p className="text-sm text-baseGray">/ 100</p>
                      </div>
                      <div className="mb-2">
                        <Progress value={esg.score} className="h-2" />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-baseGray">Benchmark: {esg.benchmark}</span>
                        <span className="text-deepBrand capitalize">{esg.trend}</span>
                      </div>
                      <p className="text-xs text-baseGray mt-2">{esg.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* ESG Impact Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Environmental Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Carbon Footprint Reduction</span>
                        <span className="text-sm font-medium text-green-600">-23.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Renewable Energy Usage</span>
                        <span className="text-sm font-medium text-deepBrand">67.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Water Conservation</span>
                        <span className="text-sm font-medium text-blue-600">+15.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Waste Reduction</span>
                        <span className="text-sm font-medium text-green-600">-18.9%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-deepBrand flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Social Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Employee Satisfaction</span>
                        <span className="text-sm font-medium text-deepBrand">8.4/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Gender Diversity</span>
                        <span className="text-sm font-medium text-deepBrand">42.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Community Investment</span>
                        <span className="text-sm font-medium text-blue-600">$12.4M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-baseGray">Training Hours per Employee</span>
                        <span className="text-sm font-medium text-deepBrand">47.2 hrs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ESG Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-deepBrand flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    ESG Integration & Governance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-deepBrand mb-3">Policy Implementation</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-baseGray">ESG Policy Framework</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-baseGray">Climate Risk Assessment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-baseGray">Diversity & Inclusion</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-baseGray">Supply Chain Monitoring</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-deepBrand mb-3">Reporting Standards</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-baseGray">SASB Standards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-baseGray">TCFD Recommendations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-baseGray">GRI Standards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-baseGray">EU Taxonomy Alignment</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-deepBrand mb-3">Third-Party Ratings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-baseGray">MSCI ESG Rating</span>
                          <Badge className="bg-green-100 text-green-800">AA</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-baseGray">Sustainalytics</span>
                          <Badge className="bg-blue-100 text-blue-800">Low Risk</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-baseGray">CDP Climate</span>
                          <Badge className="bg-green-100 text-green-800">A-</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-baseGray">ISS ESG</span>
                          <Badge className="bg-blue-100 text-blue-800">Prime</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              {/* Market Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-baseGray">Market Alerts</p>
                        <p className="text-2xl font-bold text-deepBrand">4</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-baseGray">High Impact Events</p>
                        <p className="text-2xl font-bold text-deepBrand">1</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-baseGray">Research Updates</p>
                        <p className="text-2xl font-bold text-deepBrand">12</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {marketInsights.map((insight) => (
                  <Card key={insight.title} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-deepBrand">{insight.title}</h3>
                            {getImpactBadge(insight.impact)}
                          </div>
                          <p className="text-sm text-baseGray mb-3">{insight.description}</p>
                          <div className="flex items-center gap-4 text-xs text-baseGray">
                            <span>Category: {insight.category}</span>
                            <span>Source: {insight.source}</span>
                            <span>Date: {new Date(insight.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Briefcase className="h-4 w-4" />
                            Add to Portfolio
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Economic Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-deepBrand flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Key Economic Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-baseGray">Fed Funds Rate</p>
                      <p className="text-2xl font-bold text-deepBrand">5.25%</p>
                      <p className="text-xs text-red-600 flex items-center justify-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +0.25%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-baseGray">10Y Treasury</p>
                      <p className="text-2xl font-bold text-deepBrand">4.12%</p>
                      <p className="text-xs text-green-600 flex items-center justify-center">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        -0.08%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-baseGray">VIX</p>
                      <p className="text-2xl font-bold text-deepBrand">18.4</p>
                      <p className="text-xs text-green-600 flex items-center justify-center">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        -2.1
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-baseGray">USD Index</p>
                      <p className="text-2xl font-bold text-deepBrand">103.2</p>
                      <p className="text-xs text-red-600 flex items-center justify-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +0.5
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Screen>
  )
}
