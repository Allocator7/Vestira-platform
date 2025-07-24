"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Server,
  Eye,
  AlertCircle,
} from "lucide-react"

interface SecurityComplianceIndicatorProps {
  dataRoomId: string
  securityLevel: "public" | "internal" | "confidential" | "restricted"
  complianceStatus: {
    soc2Compliant: boolean
    gdprCompliant: boolean
    ccpaCompliant: boolean
    lastAudit?: string
    nextAudit?: string
  }
  encryptionStatus: {
    atRest: boolean
    inTransit: boolean
    clientSide: boolean
  }
  isProduction?: boolean
}

export function SecurityComplianceIndicator({
  dataRoomId,
  securityLevel,
  complianceStatus,
  encryptionStatus,
  isProduction = false,
}: SecurityComplianceIndicatorProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "public":
        return "bg-green-100 text-green-800"
      case "internal":
        return "bg-electric-blue/10 text-electric-800"
      case "confidential":
        return "bg-amber-100 text-amber-800"
      case "restricted":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplianceIcon = (compliant: boolean) => {
    return compliant ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />
  }

  return (
    <Card className="border-l-4 border-l-[#3B0A45]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[#3B0A45] flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security & Compliance
          </CardTitle>
          <Badge className={getSecurityLevelColor(securityLevel)}>{securityLevel.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Production Warning */}
        {!isProduction && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Development Environment:</strong> This data room uses MVP security controls. Production deployment
              requires AWS-level security compliance.
            </AlertDescription>
          </Alert>
        )}

        {/* Encryption Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#3B0A45] flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Encryption Status
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              {getComplianceIcon(encryptionStatus.atRest)}
              <span>At Rest</span>
            </div>
            <div className="flex items-center gap-1">
              {getComplianceIcon(encryptionStatus.inTransit)}
              <span>In Transit</span>
            </div>
            <div className="flex items-center gap-1">
              {getComplianceIcon(encryptionStatus.clientSide)}
              <span>Client-Side</span>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#3B0A45] flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Compliance Status
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span>SOC2 Type II</span>
              {isProduction ? (
                getComplianceIcon(complianceStatus.soc2Compliant)
              ) : (
                <Badge variant="outline" className="text-xs">
                  Pending
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>GDPR</span>
              {getComplianceIcon(complianceStatus.gdprCompliant)}
            </div>
            <div className="flex items-center justify-between">
              <span>CCPA</span>
              {getComplianceIcon(complianceStatus.ccpaCompliant)}
            </div>
          </div>
        </div>

        {/* Audit Information */}
        {complianceStatus.lastAudit && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#3B0A45] flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Audit Schedule
            </h4>
            <div className="text-xs space-y-1">
              <div>Last Audit: {complianceStatus.lastAudit}</div>
              {complianceStatus.nextAudit && <div>Next Audit: {complianceStatus.nextAudit}</div>}
            </div>
          </div>
        )}

        {/* Production Requirements Notice */}
        {!isProduction && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs">
              <strong>Production Deployment Blocked:</strong> AWS migration and SOC2 certification required.
            </AlertDescription>
          </Alert>
        )}

        {/* Detailed Security Information */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View Security Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#3B0A45]">Security & Compliance Details</DialogTitle>
              <DialogDescription>Comprehensive security status for Data Room {dataRoomId}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Current Implementation */}
              <div>
                <h3 className="font-medium text-[#3B0A45] mb-3 flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Current Implementation (MVP)
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                  <div className="text-sm">
                    <strong>Database:</strong> Supabase PostgreSQL with row-level security
                  </div>
                  <div className="text-sm">
                    <strong>Storage:</strong> Supabase Storage with basic encryption
                  </div>
                  <div className="text-sm">
                    <strong>Authentication:</strong> Supabase Auth with JWT tokens
                  </div>
                  <div className="text-sm">
                    <strong>Monitoring:</strong> Basic application logging
                  </div>
                </div>
              </div>

              {/* Production Requirements */}
              <div>
                <h3 className="font-medium text-[#3B0A45] mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Production Requirements
                </h3>
                <div className="bg-electric-blue/10 border border-electric-blue/20 rounded-lg p-4 space-y-2">
                  <div className="text-sm">
                    <strong>Infrastructure:</strong> AWS ECS/EKS with VPC isolation
                  </div>
                  <div className="text-sm">
                    <strong>Database:</strong> AWS RDS with encryption at rest (KMS)
                  </div>
                  <div className="text-sm">
                    <strong>Storage:</strong> AWS S3 with server-side encryption
                  </div>
                  <div className="text-sm">
                    <strong>Security:</strong> AWS WAF, GuardDuty, CloudTrail
                  </div>
                  <div className="text-sm">
                    <strong>Compliance:</strong> SOC2 Type II certification
                  </div>
                  <div className="text-sm">
                    <strong>Monitoring:</strong> 24/7 security operations center
                  </div>
                </div>
              </div>

              {/* Security Controls */}
              <div>
                <h3 className="font-medium text-[#3B0A45] mb-3">Required Security Controls</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Multi-factor Authentication</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Role-based Access Control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Encryption in Transit (TLS 1.3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Session Management</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Encryption at Rest (KMS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Network Segmentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Intrusion Detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Audit Log Immutability</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Migration Timeline */}
              <div>
                <h3 className="font-medium text-[#3B0A45] mb-3">AWS Migration Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>
                      <strong>Phase 1:</strong> Infrastructure setup (AWS VPC, ECS, RDS)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>
                      <strong>Phase 2:</strong> Security services (KMS, WAF, GuardDuty)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>
                      <strong>Phase 3:</strong> Compliance implementation (SOC2 controls)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>
                      <strong>Phase 4:</strong> Security audit and certification
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
