/**
 * Advanced Document Security Service
 * Handles encryption, watermarking, access tracking, and DLP
 */

export interface DocumentSecurityConfig {
  encryptionEnabled: boolean
  watermarkEnabled: boolean
  dlpEnabled: boolean
  accessTrackingEnabled: boolean
  downloadRestrictions: boolean
  printRestrictions: boolean
  copyRestrictions: boolean
  expirationEnabled: boolean
}

export interface DocumentAccess {
  id: string
  documentId: string
  userId: string
  userEmail: string
  action: "view" | "download" | "print" | "share" | "edit"
  timestamp: Date
  ipAddress: string
  userAgent: string
  sessionId: string
  metadata: Record<string, any>
}

export interface DocumentWatermark {
  text: string
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
  opacity: number
  fontSize: number
  color: string
  rotation: number
}

export interface DLPScanResult {
  documentId: string
  scanDate: Date
  riskLevel: "low" | "medium" | "high" | "critical"
  findings: DLPFinding[]
  approved: boolean
  reviewedBy?: string
  reviewDate?: Date
}

export interface DLPFinding {
  type: "pii" | "financial" | "confidential" | "regulatory"
  description: string
  location: string
  confidence: number
  severity: "low" | "medium" | "high" | "critical"
}

export class DocumentSecurityService {
  private static instance: DocumentSecurityService
  private accessLogs: Map<string, DocumentAccess[]> = new Map()
  private dlpResults: Map<string, DLPScanResult> = new Map()

  public static getInstance(): DocumentSecurityService {
    if (!DocumentSecurityService.instance) {
      DocumentSecurityService.instance = new DocumentSecurityService()
    }
    return DocumentSecurityService.instance
  }

  /**
   * Encrypt document content
   */
  async encryptDocument(documentId: string, content: Buffer): Promise<Buffer> {
    // In production, use proper encryption (AES-256)
    // This is a simplified example
    const encrypted = Buffer.from(content.toString("base64"))

    // Store encryption metadata
    await this.storeEncryptionMetadata(documentId, {
      algorithm: "AES-256-GCM",
      keyId: `key_${documentId}`,
      encryptedAt: new Date(),
    })

    return encrypted
  }

  /**
   * Decrypt document content
   */
  async decryptDocument(documentId: string, encryptedContent: Buffer): Promise<Buffer> {
    // In production, retrieve encryption key and decrypt
    const decrypted = Buffer.from(encryptedContent.toString(), "base64")

    // Log decryption access
    await this.logDocumentAccess(documentId, "view", {
      decrypted: true,
      timestamp: new Date(),
    })

    return decrypted
  }

  /**
   * Apply watermark to document
   */
  async applyWatermark(
    documentId: string,
    content: Buffer,
    watermark: DocumentWatermark,
    userInfo: { name: string; email: string; timestamp: Date },
  ): Promise<Buffer> {
    // In production, use PDF manipulation library or image processing
    const watermarkText = `${watermark.text}\n${userInfo.name}\n${userInfo.email}\n${userInfo.timestamp.toISOString()}`

    // For demo, return original content with metadata
    const watermarkedContent = Buffer.concat([content, Buffer.from(`\n<!-- WATERMARK: ${watermarkText} -->`)])

    // Log watermark application
    await this.logDocumentAccess(documentId, "view", {
      watermarked: true,
      watermarkText,
      userInfo,
    })

    return watermarkedContent
  }

  /**
   * Scan document for sensitive content (DLP)
   */
  async scanDocument(documentId: string, content: string): Promise<DLPScanResult> {
    const findings: DLPFinding[] = []

    // PII Detection
    const piiPatterns = [
      { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, type: "SSN" },
      { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, type: "Credit Card" },
      { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, type: "Email" },
    ]

    piiPatterns.forEach(({ pattern, type }) => {
      const matches = content.match(pattern)
      if (matches) {
        findings.push({
          type: "pii",
          description: `Potential ${type} detected`,
          location: `Found ${matches.length} occurrence(s)`,
          confidence: 0.8,
          severity: "high",
        })
      }
    })

    // Financial Data Detection
    const financialPatterns = [
      { pattern: /\$[\d,]+\.?\d*/g, type: "Currency Amount" },
      { pattern: /\b\d+\.\d+%\b/g, type: "Percentage" },
      { pattern: /\b(AUM|NAV|IRR|EBITDA)\b/gi, type: "Financial Metric" },
    ]

    financialPatterns.forEach(({ pattern, type }) => {
      const matches = content.match(pattern)
      if (matches) {
        findings.push({
          type: "financial",
          description: `${type} detected`,
          location: `Found ${matches.length} occurrence(s)`,
          confidence: 0.9,
          severity: "medium",
        })
      }
    })

    // Confidential Content Detection
    const confidentialKeywords = [
      "confidential",
      "proprietary",
      "internal only",
      "restricted",
      "trade secret",
      "non-disclosure",
      "privileged",
    ]

    confidentialKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      const matches = content.match(regex)
      if (matches) {
        findings.push({
          type: "confidential",
          description: `Confidential keyword "${keyword}" detected`,
          location: `Found ${matches.length} occurrence(s)`,
          confidence: 0.7,
          severity: "medium",
        })
      }
    })

    // Determine overall risk level
    const riskLevel = this.calculateRiskLevel(findings)

    const result: DLPScanResult = {
      documentId,
      scanDate: new Date(),
      riskLevel,
      findings,
      approved: riskLevel === "low",
    }

    this.dlpResults.set(documentId, result)
    return result
  }

  /**
   * Log document access
   */
  async logDocumentAccess(
    documentId: string,
    action: DocumentAccess["action"],
    metadata: Record<string, any> = {},
  ): Promise<void> {
    // In production, get actual user context
    const access: DocumentAccess = {
      id: `access_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      documentId,
      userId: metadata.userId || "demo-user",
      userEmail: metadata.userEmail || "demo@vestira.com",
      action,
      timestamp: new Date(),
      ipAddress: metadata.ipAddress || "127.0.0.1",
      userAgent: metadata.userAgent || "Demo Browser",
      sessionId: metadata.sessionId || "demo-session",
      metadata,
    }

    if (!this.accessLogs.has(documentId)) {
      this.accessLogs.set(documentId, [])
    }

    this.accessLogs.get(documentId)!.push(access)

    // In production, persist to audit database
    await this.persistAccessLog(access)
  }

  /**
   * Get document access history
   */
  async getDocumentAccessHistory(documentId: string): Promise<DocumentAccess[]> {
    return this.accessLogs.get(documentId) || []
  }

  /**
   * Check if user can perform action on document
   */
  async canPerformAction(
    documentId: string,
    userId: string,
    action: DocumentAccess["action"],
    securityConfig: DocumentSecurityConfig,
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Check download restrictions
    if (action === "download" && securityConfig.downloadRestrictions) {
      const recentDownloads = await this.getRecentUserActions(documentId, userId, "download", 24 * 60 * 60 * 1000)
      if (recentDownloads.length >= 3) {
        return { allowed: false, reason: "Download limit exceeded (3 per day)" }
      }
    }

    // Check print restrictions
    if (action === "print" && securityConfig.printRestrictions) {
      return { allowed: false, reason: "Printing is disabled for this document" }
    }

    // Check DLP approval
    if (securityConfig.dlpEnabled) {
      const dlpResult = this.dlpResults.get(documentId)
      if (dlpResult && !dlpResult.approved && dlpResult.riskLevel === "critical") {
        return { allowed: false, reason: "Document requires security review" }
      }
    }

    return { allowed: true }
  }

  /**
   * Get recent user actions on document
   */
  async getRecentUserActions(
    documentId: string,
    userId: string,
    action: DocumentAccess["action"],
    timeWindowMs: number,
  ): Promise<DocumentAccess[]> {
    const accessHistory = this.accessLogs.get(documentId) || []
    const cutoffTime = new Date(Date.now() - timeWindowMs)

    return accessHistory.filter(
      (access) => access.userId === userId && access.action === action && access.timestamp > cutoffTime,
    )
  }

  /**
   * Generate security report for document
   */
  async generateSecurityReport(documentId: string): Promise<{
    accessSummary: {
      totalAccesses: number
      uniqueUsers: number
      recentActivity: DocumentAccess[]
    }
    dlpSummary: DLPScanResult | null
    securityEvents: any[]
  }> {
    const accessHistory = this.accessLogs.get(documentId) || []
    const dlpResult = this.dlpResults.get(documentId) || null

    const uniqueUsers = new Set(accessHistory.map((access) => access.userId)).size
    const recentActivity = accessHistory
      .filter((access) => access.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    return {
      accessSummary: {
        totalAccesses: accessHistory.length,
        uniqueUsers,
        recentActivity,
      },
      dlpSummary: dlpResult,
      securityEvents: [], // In production, fetch from security event log
    }
  }

  // Private helper methods
  private calculateRiskLevel(findings: DLPFinding[]): "low" | "medium" | "high" | "critical" {
    if (findings.length === 0) return "low"

    const criticalFindings = findings.filter((f) => f.severity === "critical").length
    const highFindings = findings.filter((f) => f.severity === "high").length
    const mediumFindings = findings.filter((f) => f.severity === "medium").length

    if (criticalFindings > 0) return "critical"
    if (highFindings > 2) return "high"
    if (highFindings > 0 || mediumFindings > 3) return "medium"
    return "low"
  }

  private async storeEncryptionMetadata(documentId: string, metadata: any): Promise<void> {
    // In production, store in secure key management system
    console.log(`Storing encryption metadata for document ${documentId}:`, metadata)
  }

  private async persistAccessLog(access: DocumentAccess): Promise<void> {
    // In production, persist to audit database
    console.log(`Persisting access log:`, access)
  }
}

export const documentSecurityService = DocumentSecurityService.getInstance()
