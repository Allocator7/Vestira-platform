"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Shield, Eye, Download, Share, Lock, Check, X, FileText, Scan } from "lucide-react"
import { DocumentPermissions } from "@/components/DocumentPermissions"

interface DocumentSecurityControlsProps {
  documentId: string
  documentName: string
  onSecurityChange?: (settings: any) => void
}

interface SecurityScan {
  id: string
  documentId: string
  scanDate: Date
  riskLevel: "low" | "medium" | "high" | "critical"
  findings: {
    type: "pii" | "financial" | "confidential"
    description: string
    severity: "low" | "medium" | "high" | "critical"
  }[]
  approved: boolean
}

interface AccessLog {
  id: string
  userId: string
  userName: string
  action: "view" | "download" | "share" | "edit"
  timestamp: Date
  ipAddress: string
  success: boolean
}

export function DocumentSecurityControls({
  documentId,
  documentName,
  onSecurityChange,
}: DocumentSecurityControlsProps) {
  const [securitySettings, setSecuritySettings] = useState({
    encryptionEnabled: true,
    watermarkEnabled: true,
    dlpEnabled: true,
    accessTrackingEnabled: true,
    downloadRestrictions: false,
    printRestrictions: false,
    copyRestrictions: false,
    expirationEnabled: false,
    expirationDate: null as Date | null,
  })

  const [securityScan, setSecurityScan] = useState<SecurityScan | null>(null)
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    loadSecurityData()
  }, [documentId])

  const loadSecurityData = async () => {
    // Simulate loading security data
    setSecurityScan({
      id: "scan1",
      documentId,
      scanDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      riskLevel: "medium",
      findings: [
        {
          type: "financial",
          description: "Financial metrics detected (AUM, IRR)",
          severity: "medium",
        },
        {
          type: "confidential",
          description: "Confidential keyword found",
          severity: "low",
        },
      ],
      approved: true,
    })

    setAccessLogs([
      {
        id: "access1",
        userId: "user1",
        userName: "John Smith",
        action: "view",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        ipAddress: "192.168.1.100",
        success: true,
      },
      {
        id: "access2",
        userId: "user2",
        userName: "Sarah Johnson",
        action: "download",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        ipAddress: "192.168.1.101",
        success: true,
      },
    ])
  }

  const handleSecuritySettingChange = (setting: string, value: any) => {
    const newSettings = { ...securitySettings, [setting]: value }
    setSecuritySettings(newSettings)
    onSecurityChange?.(newSettings)
  }

  const runSecurityScan = async () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          // Update scan results
          setSecurityScan({
            id: `scan_${Date.now()}`,
            documentId,
            scanDate: new Date(),
            riskLevel: "low",
            findings: [],
            approved: true,
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-orange-600 bg-orange-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "view":
        return <Eye className="h-4 w-4" />
      case "download":
        return <Download className="h-4 w-4" />
      case "share":
        return <Share className="h-4 w-4" />
      case "edit":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-electric-blue" />
          Document Security
        </CardTitle>
        <CardDescription>Security settings and monitoring for "{documentName}"</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="scan">Security Scan</TabsTrigger>
            <TabsTrigger value="access">Access Logs</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4">
              {/* Encryption */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-electric-blue" />
                  <div>
                    <Label>Document Encryption</Label>
                    <p className="text-sm text-base-gray">Encrypt document content at rest</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.encryptionEnabled}
                  onCheckedChange={(checked) => handleSecuritySettingChange("encryptionEnabled", checked)}
                />
              </div>

              {/* Watermarking */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-electric-blue" />
                  <div>
                    <Label>Dynamic Watermarking</Label>
                    <p className="text-sm text-base-gray">Add user-specific watermarks</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.watermarkEnabled}
                  onCheckedChange={(checked) => handleSecuritySettingChange("watermarkEnabled", checked)}
                />
              </div>

              {/* DLP */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Scan className="h-5 w-5 text-electric-blue" />
                  <div>
                    <Label>Data Loss Prevention</Label>
                    <p className="text-sm text-base-gray">Scan for sensitive content</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.dlpEnabled}
                  onCheckedChange={(checked) => handleSecuritySettingChange("dlpEnabled", checked)}
                />
              </div>

              {/* Access Tracking */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-electric-blue" />
                  <div>
                    <Label>Access Tracking</Label>
                    <p className="text-sm text-base-gray">Log all document access</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.accessTrackingEnabled}
                  onCheckedChange={(checked) => handleSecuritySettingChange("accessTrackingEnabled", checked)}
                />
              </div>

              {/* Download Restrictions */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-electric-blue" />
                  <div>
                    <Label>Download Restrictions</Label>
                    <p className="text-sm text-base-gray">Limit downloads per user</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.downloadRestrictions}
                  onCheckedChange={(checked) => handleSecuritySettingChange("downloadRestrictions", checked)}
                />
              </div>

              {/* Print Restrictions */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-electric-blue" />
                  <div>
                    <Label>Print Restrictions</Label>
                    <p className="text-sm text-base-gray">Disable printing capability</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.printRestrictions}
                  onCheckedChange={(checked) => handleSecuritySettingChange("printRestrictions", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Security Scan</h3>
                <p className="text-sm text-base-gray">Scan document for sensitive content and security risks</p>
              </div>
              <Button onClick={runSecurityScan} disabled={isScanning} variant="outline">
                <Scan className="h-4 w-4 mr-2" />
                {isScanning ? "Scanning..." : "Run Scan"}
              </Button>
            </div>

            {isScanning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Scanning document...</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            )}

            {securityScan && !isScanning && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Last Scan:</span>
                      <Badge className={getRiskLevelColor(securityScan.riskLevel)}>
                        {securityScan.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <p className="text-sm text-base-gray">{securityScan.scanDate.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {securityScan.approved ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <X className="h-3 w-3 mr-1" />
                        Needs Review
                      </Badge>
                    )}
                  </div>
                </div>

                {securityScan.findings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Findings:</h4>
                    {securityScan.findings.map((finding, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{finding.type}</span>
                          <Badge className={getRiskLevelColor(finding.severity)}>{finding.severity}</Badge>
                        </div>
                        <p className="text-sm text-base-gray mt-1">{finding.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="access" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Access History</h3>
                <p className="text-sm text-base-gray">Recent document access activity</p>
              </div>
              <Badge variant="secondary">{accessLogs.length} total accesses</Badge>
            </div>

            <div className="space-y-2">
              {accessLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActionIcon(log.action)}
                    <div>
                      <p className="font-medium">{log.userName}</p>
                      <div className="flex items-center gap-2 text-sm text-base-gray">
                        <span className="capitalize">{log.action}</span>
                        <span>•</span>
                        <span>{log.timestamp.toLocaleString()}</span>
                        <span>•</span>
                        <span>{log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={log.success ? "secondary" : "destructive"}>
                    {log.success ? "Success" : "Failed"}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <DocumentPermissions documentId={documentId} documentName={documentName} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
