"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Screen } from "@/components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building,
  MapPin,
  Globe,
  Briefcase,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  Edit,
  Share2,
  BarChart3,
} from "lucide-react"

import { SendMessageModal } from "@/components/profile-modals/SendMessageModal"
import { ScheduleMeetingModal } from "@/components/profile-modals/ScheduleMeetingModal"
import { ShareProfileModal } from "@/components/profile-modals/ShareProfileModal"
import { EditConnectionModal } from "@/components/profile-modals/EditConnectionModal"

export default function ConsultantProfilePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const consultantId = searchParams.get("id")
  const [activeTab, setActiveTab] = useState("overview")

  const [showSendMessage, setShowSendMessage] = useState(false)
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false)
  const [showShareProfile, setShowShareProfile] = useState(false)
  const [showEditConnection, setShowEditConnection] = useState(false)

  // Sample consultant profiles data
  const consultantProfiles = {
    9: {
      name: "Cambridge Associates",
      type: "Investment Consultant",
      location: "Boston, MA",
      website: "https://cambridgeassociates.com",
      email: "contact@cambridgeassociates.com",
      phone: "+1 (617) 555-0345",
      avatar: "/abstract-profile.png",
      clientCount: "450+",
      yearsInBusiness: 50,
      assetsUnderAdvisory: "$450B+",
      services: ["Manager Selection", "Asset Allocation", "Portfolio Construction", "Risk Management"],
      specializations: ["Endowments", "Foundations", "Pensions", "Family Offices"],
      about:
        "Cambridge Associates is a global investment consulting firm that partners with institutional investors to develop and implement investment strategies. With five decades of experience, we provide independent advice and innovative solutions to help our clients achieve their long-term objectives.",
      keyMetrics: {
        totalClients: "450+",
        assetsUnderAdvisory: "$450B+",
        globalOffices: "12",
        consultants: "200+",
      },
      recentInsights: [
        {
          title: "Alternative Investment Outlook 2024",
          date: "2024-01-15",
          category: "Market Commentary",
        },
        {
          title: "ESG Integration in Institutional Portfolios",
          date: "2024-01-08",
          category: "Research",
        },
        {
          title: "Private Markets Allocation Strategies",
          date: "2024-01-02",
          category: "Strategy",
        },
      ],
    },
    10: {
      name: "Mercer Investments",
      type: "Global Consultant",
      location: "New York, NY",
      website: "https://mercer.com",
      email: "investments@mercer.com",
      phone: "+1 (212) 555-0567",
      avatar: "/abstract-geometric-ts.png",
      clientCount: "1200+",
      yearsInBusiness: 75,
      assetsUnderAdvisory: "$1.2T+",
      services: ["Manager Research", "OCIO Services", "Risk Management", "Investment Technology"],
      specializations: ["Corporate Pensions", "Insurance", "Sovereign Wealth", "Public Funds"],
      about:
        "Mercer is a global leader in investment consulting, serving institutional investors worldwide. We combine deep investment expertise with innovative technology to help clients navigate complex markets and achieve their investment objectives.",
      keyMetrics: {
        totalClients: "1200+",
        assetsUnderAdvisory: "$1.2T+",
        globalOffices: "40+",
        consultants: "800+",
      },
      recentInsights: [
        {
          title: "Global Pension Asset Study 2024",
          date: "2024-01-12",
          category: "Research",
        },
        {
          title: "Climate Risk in Investment Portfolios",
          date: "2024-01-05",
          category: "ESG",
        },
        {
          title: "Technology Trends in Asset Management",
          date: "2023-12-28",
          category: "Innovation",
        },
      ],
    },
    11: {
      name: "Wilshire Advisors",
      type: "Investment Advisory",
      location: "Santa Monica, CA",
      website: "https://wilshire.com",
      email: "contact@wilshire.com",
      phone: "+1 (310) 555-0678",
      avatar: "/abstract-vg.png",
      clientCount: "600+",
      yearsInBusiness: 40,
      assetsUnderAdvisory: "$680B+",
      services: ["Asset Allocation", "Manager Selection", "Investment Technology", "Performance Analytics"],
      specializations: ["Public Funds", "Taft-Hartley Plans", "Healthcare Organizations", "Corporate Plans"],
      about:
        "Wilshire Advisors is a leading independent investment advisory firm serving institutional investors for four decades. We provide comprehensive investment consulting services, combining rigorous research with innovative technology to help clients achieve their investment objectives.",
      keyMetrics: {
        totalClients: "600+",
        assetsUnderAdvisory: "$680B+",
        globalOffices: "8",
        consultants: "150+",
      },
      recentInsights: [
        {
          title: "Public Fund Investment Trends 2024",
          date: "2024-01-18",
          category: "Research",
        },
        {
          title: "Alternative Investment Due Diligence Best Practices",
          date: "2024-01-11",
          category: "Best Practices",
        },
        {
          title: "Technology in Investment Management",
          date: "2024-01-06",
          category: "Innovation",
        },
      ],
    },
    12: {
      name: "Aon Hewitt Investment",
      type: "Global Consultant",
      location: "Chicago, IL",
      website: "https://aon.com",
      email: "investments@aon.com",
      phone: "+1 (312) 555-0789",
      avatar: "/abstract-ba.png",
      clientCount: "800+",
      yearsInBusiness: 45,
      assetsUnderAdvisory: "$950B+",
      services: ["Fiduciary Management", "Manager Research", "Portfolio Implementation", "Risk Analytics"],
      specializations: ["Defined Benefit", "Defined Contribution", "Endowments", "Insurance"],
      about:
        "Aon Hewitt Investment Consulting is a global leader in investment consulting and fiduciary management. We help institutional investors navigate complex markets through comprehensive advisory services, innovative solutions, and deep expertise across all asset classes.",
      keyMetrics: {
        totalClients: "800+",
        assetsUnderAdvisory: "$950B+",
        globalOffices: "35+",
        consultants: "400+",
      },
      recentInsights: [
        {
          title: "Fiduciary Management Trends 2024",
          date: "2024-01-20",
          category: "Fiduciary",
        },
        {
          title: "Defined Contribution Plan Design Evolution",
          date: "2024-01-13",
          category: "DC Plans",
        },
        {
          title: "Insurance Investment Strategy Update",
          date: "2024-01-08",
          category: "Insurance",
        },
      ],
    },
    15: {
      name: "Strategic Advisory Partners",
      type: "Boutique Consultant",
      location: "Chicago, IL",
      website: "https://strategicadvisorypartners.com",
      email: "contact@strategicadvisorypartners.com",
      phone: "+1 (312) 555-0901",
      avatar: "/abstract-profile.png",
      clientCount: "150+",
      yearsInBusiness: 25,
      assetsUnderAdvisory: "$180B+",
      services: ["Due Diligence", "Manager Selection", "Risk Assessment", "Alternative Investments"],
      specializations: ["Alternative Investments", "Private Markets", "ESG", "Emerging Managers"],
      about:
        "Strategic Advisory Partners is a boutique investment consulting firm specializing in alternative investments and emerging manager programs. We provide institutional investors with independent research, due diligence, and strategic advice to navigate complex investment landscapes.",
      keyMetrics: {
        totalClients: "150+",
        assetsUnderAdvisory: "$180B+",
        globalOffices: "3",
        consultants: "45+",
      },
      recentInsights: [
        {
          title: "Emerging Manager Opportunities in Private Markets",
          date: "2024-01-17",
          category: "Emerging Managers",
        },
        {
          title: "ESG Integration in Alternative Investments",
          date: "2024-01-10",
          category: "ESG",
        },
        {
          title: "Private Credit Market Outlook",
          date: "2024-01-05",
          category: "Private Credit",
        },
      ],
    },
  }

  const [consultant, setConsultant] = useState<any>(null)

  useEffect(() => {
    if (consultantId) {
      try {
        const profile = consultantProfiles[Number(consultantId) as keyof typeof consultantProfiles]
        if (profile) {
          setConsultant(profile)
        } else {
          console.error('Profile not found for ID:', consultantId)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
  }, [consultantId])

  if (!consultant) {
    return (
      <Screen>
        <div className="container py-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Consultant Profile Not Found</h1>
            <p className="text-gray-600">The requested consultant profile could not be found.</p>
          </div>
        </div>
      </Screen>
    )
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
                  <AvatarImage src={consultant.avatar || "/placeholder.svg"} alt={consultant.name} />
                  <AvatarFallback className="text-2xl">
                    {consultant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="w-full md:w-auto" onClick={() => setShowEditConnection(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Connection
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-deep-brand mb-2">{consultant.name}</h1>
                    <p className="text-lg text-base-gray mb-1">{consultant.type}</p>
                    <p className="text-base text-base-gray mb-4">{consultant.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-purple-100 text-purple-800">Consultant</Badge>
                    <Badge variant="outline">Connected</Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-base-gray">
                    <MapPin className="h-4 w-4" />
                    <span>{consultant.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Globe className="h-4 w-4" />
                    <a href={consultant.website} className="text-electric-blue hover:underline">
                      {consultant.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Mail className="h-4 w-4" />
                    <span>{consultant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-gray">
                    <Phone className="h-4 w-4" />
                    <span>{consultant.phone}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{consultant.assetsUnderAdvisory}</p>
                    <p className="text-sm text-base-gray">Assets Under Advisory</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{consultant.yearsInBusiness}</p>
                    <p className="text-sm text-base-gray">Years in Business</p>
                  </div>
                  <div className="text-center p-4 bg-canvas-bg rounded-lg">
                    <p className="text-2xl font-bold text-deep-brand">{consultant.clientCount}</p>
                    <p className="text-sm text-base-gray">Total Clients</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                    onClick={() => setShowSendMessage(true)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setShowScheduleMeeting(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" onClick={() => setShowShareProfile(true)}>
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
            <TabsTrigger value="documents">Documents</TabsTrigger>
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
                  <p className="text-base-gray leading-relaxed">{consultant.about}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {consultant.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                        {service}
                      </Badge>
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
                    {consultant.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(consultant.keyMetrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-base-gray capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advisory Services</CardTitle>
                <CardDescription>Comprehensive consulting services offered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-base-gray">Detailed service offerings would be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Insights</CardTitle>
                <CardDescription>Latest research and market commentary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultant.recentInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-2 h-2 bg-electric-blue rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-deep-brand">{insight.title}</p>
                        <div className="flex items-center gap-2 text-sm text-base-gray mt-1">
                          <span>{insight.date}</span>
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shared Documents</CardTitle>
                <CardDescription>Documents shared with this consultant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-base-gray">Shared documents would be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <SendMessageModal
          isOpen={showSendMessage}
          onClose={() => setShowSendMessage(false)}
          recipientName={consultant.name}
          recipientEmail={consultant.email}
        />

        <ScheduleMeetingModal
          isOpen={showScheduleMeeting}
          onClose={() => setShowScheduleMeeting(false)}
          recipientName={consultant.name}
          recipientEmail={consultant.email}
        />

        <ShareProfileModal
          isOpen={showShareProfile}
          onClose={() => setShowShareProfile(false)}
          profileName={consultant.name}
          profileUrl={`${window.location.origin}/screens/general/consultant-profile?id=${consultantId}`}
        />

        <EditConnectionModal
          isOpen={showEditConnection}
          onClose={() => setShowEditConnection(false)}
          connectionName={consultant.name}
          connectionType={consultant.type}
          initialData={{
            relationship: "professional",
            tags: ["Consultant", consultant.type],
            notes: "",
            priority: "high",
          }}
        />
      </div>
    </Screen>
  )
}
