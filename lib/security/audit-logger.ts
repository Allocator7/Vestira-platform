/**
 * Audit Logging System for SOC2 Compliance
 *
 * PRODUCTION REQUIREMENT: Must integrate with AWS CloudTrail
 * for tamper-proof audit logging in production environment.
 */

import type { AuditLog } from "./soc2-compliance"

export class AuditLogger {
  private static instance: AuditLogger
  private logs: AuditLog[] = []

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  /**
   * Log security events for compliance tracking
   *
   * PRODUCTION NOTE: In production, this must integrate with:
   * - AWS CloudTrail for immutable audit logs
   * - AWS CloudWatch for real-time monitoring
   * - AWS S3 for long-term log retention
   * - AWS Macie for sensitive data detection in logs
   */
  public async logEvent(event: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
    const auditLog: AuditLog = {
      id: this.generateLogId(),
      timestamp: new Date(),
      ...event,
    }

    // MVP Implementation: Store in memory
    // PRODUCTION: Send to AWS CloudTrail
    this.logs.push(auditLog)

    // Real-time alerting for critical events
    if (auditLog.riskLevel === "critical" || auditLog.riskLevel === "high") {
      await this.sendSecurityAlert(auditLog)
    }

    console.log("🔒 Security Event Logged:", {
      action: auditLog.action,
      user: auditLog.userEmail,
      resource: `${auditLog.resourceType}:${auditLog.resourceId}`,
      result: auditLog.result,
      riskLevel: auditLog.riskLevel,
    })
  }

  /**
   * Generate compliance reports for SOC2 audits
   */
  public generateComplianceReport(
    startDate: Date,
    endDate: Date,
    reportType: "access" | "security" | "data" | "system",
  ): AuditLog[] {
    return this.logs.filter(
      (log) => log.timestamp >= startDate && log.timestamp <= endDate && this.matchesReportType(log, reportType),
    )
  }

  private generateLogId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private async sendSecurityAlert(log: AuditLog): Promise<void> {
    // MVP: Console logging
    // PRODUCTION: AWS SNS for real-time alerts
    console.warn("🚨 SECURITY ALERT:", {
      severity: log.riskLevel,
      action: log.action,
      user: log.userEmail,
      details: log.details,
    })
  }

  private matchesReportType(log: AuditLog, reportType: string): boolean {
    const accessEvents = ["data_room_accessed", "document_viewed", "document_downloaded"]
    const securityEvents = ["unauthorized_access_attempt", "suspicious_activity_detected"]
    const dataEvents = ["document_shared", "data_retention_policy_applied"]
    const systemEvents = ["data_room_created", "access_policy_changed"]

    switch (reportType) {
      case "access":
        return accessEvents.includes(log.action)
      case "security":
        return securityEvents.includes(log.action)
      case "data":
        return dataEvents.includes(log.action)
      case "system":
        return systemEvents.includes(log.action)
      default:
        return true
    }
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance()

/**
 * Convenience functions for common audit events
 */
export const logDataRoomAccess = async (
  userId: string,
  userEmail: string,
  dataRoomId: string,
  ipAddress: string,
  userAgent: string,
  sessionId: string,
  success: boolean,
) => {
  await auditLogger.logEvent({
    userId,
    userEmail,
    action: success ? "data_room_accessed" : "data_room_access_denied",
    resourceType: "dataRoom",
    resourceId: dataRoomId,
    ipAddress,
    userAgent,
    sessionId,
    result: success ? "success" : "unauthorized",
    details: { accessAttempt: true },
    riskLevel: success ? "low" : "medium",
  })
}

export const logDocumentDownload = async (
  userId: string,
  userEmail: string,
  documentId: string,
  dataRoomId: string,
  ipAddress: string,
  userAgent: string,
  sessionId: string,
) => {
  await auditLogger.logEvent({
    userId,
    userEmail,
    action: "document_downloaded",
    resourceType: "document",
    resourceId: documentId,
    ipAddress,
    userAgent,
    sessionId,
    result: "success",
    details: { dataRoomId, downloadTime: new Date().toISOString() },
    riskLevel: "medium",
  })
}

export const logSuspiciousActivity = async (
  userId: string,
  userEmail: string,
  activityType: string,
  details: Record<string, any>,
  ipAddress: string,
  userAgent: string,
  sessionId: string,
) => {
  await auditLogger.logEvent({
    userId,
    userEmail,
    action: "suspicious_activity_detected",
    resourceType: "system",
    resourceId: "security_monitor",
    ipAddress,
    userAgent,
    sessionId,
    result: "failure",
    details: { activityType, ...details },
    riskLevel: "high",
  })
}
