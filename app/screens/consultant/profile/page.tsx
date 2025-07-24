"use client"

import { useState } from "react"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Building,
  MapPin,
  Globe,
  Users,
  Award,
  Briefcase,
  BookOpen,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Edit,
  Share2,
  ExternalLink,
  BarChart3,
} from "lucide-react"

export default function ConsultantProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample consultant profile data
  const consultantProfile = {
    name: "Alex Consultant",
    firm: "Vestira Investment Consulting",
    title: "Senior Investment Consultant",
    location: "New York, NY",
    website: "https://vestiraconsulting.com",
    email: "alex.consultant@vestira.com",
    phone: "+1 (212) 555-7890",
    avatar: "/placeholder.svg?height=120&width=120",

    // Key consultant metrics
    assetsUnderAdvisory: "$5.2B",
    consultantType: "Investment Consultant",
    yearsInBusiness: 15,
    // Remove clientCount entirely

    // Services offered (no pricing displayed)
    services: ["Investment Consulting", "OCIO (Outsourced Chief Investment Officer)"],

    specializations: ["Alternative Investments", "Pension Fund Advisory", "Endowment Management", "ESG Integration"],

    clientTypes: ["Public Pension Funds", "Corporate Pension Plans", "Endowments & Foundations", "Insurance Companies"],

    regions: ["North America", "Europe"],

    // Recent insights published
    recentInsights: [
      {
        id: 1,
        title: "Alternative Investment Trends 2024",
        date: "2024-01-15",
        category: "Market Commentary",
        views: 1247,
        likes: 89,
      },
      {
        id: 2,
        title: "Due Diligence Best Practices for Institutional Investors",
        date: "2024-01-08",
        category: "Thought Leadership",
        views: 892,
        likes: 67,
      },
      {
        id: 3,
        title: "Portfolio Diversification in Uncertain Markets",
        date: "2024-01-02",
        category: "Strategy Insight",
        views: 634,
        likes: 45,
      },
    ],

    credentials: ["CFA Charter", "CAIA Designation", "MBA Finance", "Series 65 License"],

    about:
      "With over 15 years of experience in alternative investments, Alex provides independent advisory services to institutional investors seeking to optimize their investment portfolios. Specializing in manager selection, asset allocation, and risk management, Alex has helped clients navigate complex investment decisions and achieve their long-term objectives.",
  }

  return (
    <Screen>
      <div className="container py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={consultantProfile.avatar || "/placeholder.svg"} alt={consultantProfile.name} />
                  <AvatarFallback className="text-2xl">
                    {consultantProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="w-full md:w-auto">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-deep-brand mb-2">{consultantProfile.name}</h1>
                    <p className="text-lg text-base-gray mb-1">{consultantProfile.title}</p>
                    <p className="text-base text-base-gray mb-4">{consultantProfile.firm}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-purple-100 text-purple-800">Consultant</Badge>
                    <Badge variant="outline">{consultantProfile.consultantType}</Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-base-gray">
                    <MapPin className="h-4 w-4" />
                    <span>{consultantProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Globe className="h-4 w-4" />
                    <a href={consultantProfile.website} className="text-electric-blue hover:underline">
                      {consultantProfile.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Mail className="h-4 w-4" />
                    <span>{consultantProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Phone className="h-4 w-4" />
                    <span>{consultantProfile.phone}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{consultantProfile.assetsUnderAdvisory}</p>
                    <p className="text-sm text-base-gray">Assets Under Advisory</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{consultantProfile.yearsInBusiness}</p>
                    <p className="text-sm text-base-gray">Years Experience</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{consultantProfile.recentInsights.length}</p>
                    <p className="text-sm text-base-gray">Published Insights</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base-gray leading-relaxed">{consultantProfile.about}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Client Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {consultantProfile.clientTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                        <span className="text-base-gray">{type}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Specializations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {consultantProfile.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Geographic Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {consultantProfile.regions.map((region, index) => (
                      <Badge key={index} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Advisory Services
                </CardTitle>
                <CardDescription>Comprehensive investment advisory services for institutional clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {consultantProfile.services.map((service, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-canvas-bg rounded-lg">
                      <div className="w-2 h-2 bg-electric-blue rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-deep-brand">{service}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-deep-brand mb-2">Independent Advisory</h4>
                    <p className="text-base-gray">
                      Providing objective, fee-only investment advice with no conflicts of interest. Our recommendations
                      are based solely on what's best for our clients.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-deep-brand mb-2">Institutional Focus</h4>
                    <p className="text-base-gray">
                      Specialized expertise in working with pension funds, endowments, foundations, and other
                      institutional investors with complex investment needs.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-deep-brand mb-2">Long-term Partnership</h4>
                    <p className="text-base-gray">
                      Building lasting relationships through ongoing support, regular portfolio reviews, and continuous
                      monitoring of investment performance and risk.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Published Insights
                </CardTitle>
                <CardDescription>Recent market commentary and thought leadership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultantProfile.recentInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-canvas-bg transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-deep-brand mb-1">{insight.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-base-gray">
                          <span>{insight.date}</span>
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-3 w-3" />
                            <span>{insight.views} views</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3" />
                            <span>{insight.likes} likes</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-deep-brand">12</p>
                    <p className="text-sm text-base-gray">Total Insights</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-deep-brand">2.8K</p>
                    <p className="text-sm text-base-gray">Total Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-deep-brand">201</p>
                    <p className="text-sm text-base-gray">Total Engagement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Professional Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {consultantProfile.credentials.map((credential, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-canvas-bg rounded-lg">
                      <div className="w-10 h-10 bg-electric-blue/10 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-electric-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-deep-brand">{credential}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-deep-brand">Senior Investment Consultant</h4>
                    <p className="text-base-gray">Vestira Investment Consulting • 2018 - Present</p>
                    <p className="text-sm text-base-gray mt-2">
                      Lead consultant providing investment advisory services to institutional clients with combined
                      assets under advisory of $5.2B.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-deep-brand">Investment Consultant</h4>
                    <p className="text-base-gray">Global Advisory Partners • 2015 - 2018</p>
                    <p className="text-sm text-base-gray mt-2">
                      Provided manager selection and asset allocation advice to pension funds and endowments across
                      North America.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-deep-brand">Investment Analyst</h4>
                    <p className="text-base-gray">Institutional Investment Research • 2012 - 2015</p>
                    <p className="text-sm text-base-gray mt-2">
                      Conducted due diligence and performance analysis on alternative investment managers across
                      multiple asset classes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  )
}
