"use client"

import { useState } from "react"
import { Screen } from "../../../../components/Screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import {
  Search,
  CheckCircle,
  Users,
  UserCheck,
  Shield,
  AlertTriangle,
  Activity,
  FileText,
  Settings,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react"

interface SecurityMetrics {
  totalUsers: number
  activeUsers: number
  mfaEnabled: number
  suspiciousActivity: number
  documentsScanned: number
  threatsBlocked: number
  complianceScore: number
  lastAudit: string
}

interface UserAccount {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "allocator" | "consultant"
  firm: string
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  mfaEnabled: boolean
  riskScore: "low" | "medium" | "high"
  permissions: string[]
}

interface SecurityEvent {
  id: string
  type: "login_failure" | "suspicious_access" | "data_breach" | "policy_violation"
  severity: "low" | "medium" | "high" | "critical"
  user: string
  description: string
  timestamp: string
  status: "open" | "investigating" | "resolved"
  ipAddress: string
}

const mockMetrics: SecurityMetrics = {
  totalUsers: 1247,
  activeUsers: 892,
  mfaEnabled: 1156,
  suspiciousActivity: 3,
  documentsScanned: 15420,
  threatsBlocked: 27,
  complianceScore: 98.5,
  lastAudit: "2024-01-15",
}

const mockUsers: UserAccount[] = [
  {
    id: "user-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@meridiancap.com",
    role: "manager",
    firm: "Meridian Capital Partners",
    status: "active",
    lastLogin: "2024-01-20T14:30:00Z",
    mfaEnabled: true,
    riskScore: "low",
    permissions: ["documents:view", "documents:create", "datarooms:manage"],
  },
  {
    id: "user-002",
    name: "Michael Chen",
    email: "m.chen@strs.gov",
    role: "allocator",
    firm: "State Teachers Retirement System",
    status: "active",
    lastLogin: "2024-01-20T09:15:00Z",
    mfaEnabled: true,
    riskScore: "low",
    permissions: ["documents:view", "ddq:create", "analytics:view"],
  },
  {
    id: "user-003",
    name: "David Rodriguez",
    email: "d.rodriguez@iag-consulting.com",
    role: "consultant",
    firm: "Institutional Advisory Group",
    status: "inactive",
    lastLogin: "2024-01-18T16:45:00Z",
    mfaEnabled: false,
    riskScore: "medium",
    permissions: ["documents:view", "analytics:view"],
  },
]

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: "event-001",
    type: "login_failure",
    severity: "medium",
    user: "john.doe@example.com",
    description: "Multiple failed login attempts from unusual location",
    timestamp: "2024-01-20T15:30:00Z",
    status: "investigating",
    ipAddress: "192.168.1.100",
  },
  {
    id: "event-002",
    type: "suspicious_access",
    severity: "high",
    user: "jane.smith@example.com",
    description: "Document access outside normal business hours",
    timestamp: "2024-01-20T02:15:00Z",
    status: "open",
    ipAddress: "10.0.0.50",
  },
  {
    id: "event-003",
    type: "policy_violation",
    severity: "low",
    user: "bob.wilson@example.com",
    description: "Attempted to share document without proper permissions",
    timestamp: "2024-01-19T11:20:00Z",
    status: "resolved",
    ipAddress: "172.16.0.25",
  },
]

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<SecurityMetrics>(mockMetrics)
  const [users, setUsers] = useState<UserAccount[]>(mockUsers)
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "manager" | "allocator" | "consultant">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "suspended">("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firm.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return null
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      default:
        return null
    }
  }

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-100 text-red-800">Open</Badge>
      case "investigating":
        return <Badge className="bg-yellow-100 text-yellow-800">Investigating</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      default:
        return null
    }
  }

  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-deep-brand">Security Dashboard</h1>
            <p className="text-base-gray mt-1">Monitor platform security, users, and compliance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Security Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-deep-brand">{metrics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeUsers} active ({((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MFA Adoption</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-deep-brand">
                {((metrics.mfaEnabled / metrics.totalUsers) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">{metrics.mfaEnabled} users enabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-deep-brand">{metrics.suspiciousActivity}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-deep-brand">{metrics.complianceScore}%</div>
              <p className="text-xs text-muted-foreground">SOC 2 Type II</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6 bg-gray-100">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-deep-brand">User Management</CardTitle>
                    <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                  </div>
                  <Button>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-gray" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as any)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="allocator">Allocator</option>
                    <option value="consultant">Consultant</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-deep-brand">{user.name}</h3>
                          <p className="text-sm text-base-gray">{user.email}</p>
                          <p className="text-sm text-base-gray">{user.firm}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="capitalize">{user.role}</Badge>
                            {getStatusBadge(user.status)}
                          </div>
                          <div className="flex items-center gap-2">
                            {user.mfaEnabled ? (
                              <Badge className="bg-green-100 text-green-800">MFA</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">No MFA</Badge>
                            )}
                            {getRiskBadge(user.riskScore)}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Manage Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Events */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-deep-brand">Security Events</CardTitle>
                <CardDescription>Monitor and respond to security incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-deep-brand">{event.description}</h3>
                          <p className="text-sm text-base-gray">
                            User: {event.user} • IP: {event.ipAddress}
                          </p>
                          <p className="text-sm text-base-gray">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(event.severity)}
                        {getEventStatusBadge(event.status)}
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance */}
          <TabsContent value="compliance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-deep-brand">SOC 2 Compliance Status</CardTitle>
                  <CardDescription>Current compliance posture and requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold text-deep-brand">Access Controls</h3>
                        <p className="text-sm text-base-gray">User authentication and authorization</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold text-deep-brand">Data Encryption</h3>
                        <p className="text-sm text-base-gray">Data at rest and in transit</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold text-deep-brand">Audit Logging</h3>
                        <p className="text-sm text-base-gray">Comprehensive activity tracking</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold text-deep-brand">Incident Response</h3>
                        <p className="text-sm text-base-gray">Security incident procedures</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Log */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="text-deep-brand">Audit Log</CardTitle>
                <CardDescription>Complete activity trail for compliance and security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-deep-brand">User Login</h3>
                        <p className="text-sm text-base-gray">sarah.johnson@meridiancap.com logged in</p>
                        <p className="text-sm text-base-gray">2024-01-20 14:30:00 • IP: 192.168.1.100</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-deep-brand">Document Access</h3>
                        <p className="text-sm text-base-gray">Quarterly Report Q4 2023.pdf accessed</p>
                        <p className="text-sm text-base-gray">2024-01-20 14:25:00 • User: m.chen@strs.gov</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">View</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Shield className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-deep-brand">Permission Change</h3>
                        <p className="text-sm text-base-gray">Role updated from Viewer to Contributor</p>
                        <p className="text-sm text-base-gray">2024-01-20 13:15:00 • Admin: admin@vestira.com</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Modified</Badge>
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
