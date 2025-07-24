/**
 * Data Room Security Implementation
 *
 * PRODUCTION SECURITY REQUIREMENT:
 * This module MUST be implemented with enterprise-grade security
 * controls before production deployment. Current MVP implementation
 * is for development purposes only.
 */

import type { AuditLog } from "./soc2-compliance"

export interface SecureDataRoom {
  id: string
  name: string
  ownerId: string
  ownerFirmId: string

  // Security Classifications
  securityLevel: "public" | "internal" | "confidential" | "restricted"
  dataClassification: "public" | "internal" | "confidential" | "highly-confidential"

  // Access Controls
  accessPolicy: DataRoomAccessPolicy
  encryptionStatus: EncryptionStatus

  // Compliance Tracking
  complianceStatus: ComplianceStatus
  auditTrail: AuditLog[]

  // Retention and Lifecycle
  retentionPolicy: RetentionPolicy

  // Geographic and Regulatory
  dataResidency: string[] // ISO country codes
  regulatoryRequirements: string[] // e.g., ['GDPR', 'CCPA', 'SOX']

  createdAt: Date
  updatedAt: Date
  lastAccessedAt: Date
}

export interface DataRoomAccessPolicy {
  // Authentication Requirements
  requireMFA: boolean
  allowedAuthMethods: ("password" | "sso" | "certificate")[]

  // Session Management
  sessionTimeout: number // minutes
  maxConcurrentSessions: number

  // Network Controls
  ipWhitelist: string[]
  geoRestrictions: string[] // ISO country codes

  // Time-based Access
  accessSchedule?: {
    timezone: string
    allowedHours: { start: string; end: string }[]
    allowedDays: number[] // 0-6, Sunday-Saturday
  }

  // Download and Sharing Controls
  allowDownload: boolean
  allowPrint: boolean
  allowCopy: boolean
  allowShare: boolean
  watermarkRequired: boolean

  // Expiration
  accessExpiration?: Date
  maxAccessDuration?: number // days
}

export interface EncryptionStatus {
  encryptionAtRest: {
    enabled: boolean
    algorithm: "AES256" | "AES128"
    keyManagement: "aws-kms" | "customer-managed" | "supabase-managed"
    keyRotationEnabled: boolean
    lastKeyRotation?: Date
  }

  encryptionInTransit: {
    enabled: boolean
    protocol: "TLS1.3" | "TLS1.2"
    certificateType: "wildcard" | "extended-validation" | "domain-validated"
    hstsEnabled: boolean
  }

  documentEncryption: {
    enabled: boolean
    clientSideEncryption: boolean
    encryptionKey: string // Reference to key, not actual key
  }
}

export interface ComplianceStatus {
  soc2Compliant: boolean
  lastSOC2Audit?: Date
  nextSOC2Audit?: Date

  gdprCompliant: boolean
  ccpaCompliant: boolean
  soxCompliant: boolean

  complianceFindings: ComplianceFinding[]
  lastComplianceReview: Date
  nextComplianceReview: Date
}

export interface ComplianceFinding {
  id: string
  type: "security" | "privacy" | "access" | "data-handling"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  remediation: string
  status: "open" | "in-progress" | "resolved" | "accepted-risk"
  dueDate: Date
  assignedTo: string
}

export interface RetentionPolicy {
  retentionPeriod: number // days
  autoDeleteEnabled: boolean
  legalHoldExemption: boolean
  backupRetention: number // days
  archiveAfter: number // days
  secureDisposalRequired: boolean
}

/**
 * Security Event Types for Audit Logging
 *
 * PRODUCTION REQUIREMENT: All events must be logged to AWS CloudTrail
 * with tamper-proof storage and real-time monitoring.
 */
export const SECURITY_EVENTS = {
  // Access Events
  DATA_ROOM_ACCESSED: "data_room_accessed",
  DATA_ROOM_ACCESS_DENIED: "data_room_access_denied",
  DOCUMENT_VIEWED: "document_viewed",
  DOCUMENT_DOWNLOADED: "document_downloaded",
  DOCUMENT_SHARED: "document_shared",

  // Administrative Events
  DATA_ROOM_CREATED: "data_room_created",
  DATA_ROOM_MODIFIED: "data_room_modified",
  DATA_ROOM_DELETED: "data_room_deleted",
  ACCESS_POLICY_CHANGED: "access_policy_changed",
  USER_PERMISSIONS_MODIFIED: "user_permissions_modified",

  // Security Events
  UNAUTHORIZED_ACCESS_ATTEMPT: "unauthorized_access_attempt",
  SUSPICIOUS_ACTIVITY_DETECTED: "suspicious_activity_detected",
  ENCRYPTION_KEY_ROTATED: "encryption_key_rotated",
  SECURITY_POLICY_VIOLATION: "security_policy_violation",

  // Compliance Events
  COMPLIANCE_SCAN_COMPLETED: "compliance_scan_completed",
  AUDIT_LOG_EXPORTED: "audit_log_exported",
  DATA_RETENTION_POLICY_APPLIED: "data_retention_policy_applied",
  SECURE_DISPOSAL_COMPLETED: "secure_disposal_completed",
} as const

/**
 * AWS Migration Requirements for Production
 *
 * CRITICAL: The following AWS services MUST be implemented
 * before production deployment:
 */
export const AWS_PRODUCTION_REQUIREMENTS = {
  // Core Infrastructure
  compute: "AWS ECS/EKS with Fargate for serverless containers",
  database: "AWS RDS PostgreSQL with encryption at rest",
  storage: "AWS S3 with server-side encryption (SSE-KMS)",
  cdn: "AWS CloudFront with WAF integration",

  // Security Services
  keyManagement: "AWS KMS for encryption key management",
  identityAccess: "AWS IAM with fine-grained permissions",
  networkSecurity: "AWS VPC with private subnets and NAT gateways",
  webFirewall: "AWS WAF with custom rules for data room protection",
  ddosProtection: "AWS Shield Advanced",

  // Monitoring and Compliance
  auditLogging: "AWS CloudTrail with S3 and CloudWatch integration",
  monitoring: "AWS CloudWatch with custom metrics and alarms",
  threatDetection: "AWS GuardDuty for anomaly detection",
  configCompliance: "AWS Config for compliance monitoring",
  secretsManagement: "AWS Secrets Manager for API keys and credentials",

  // Backup and Recovery
  backup: "AWS Backup for automated backup management",
  disasterRecovery: "Multi-AZ deployment with cross-region replication",

  // Data Privacy
  dataGovernance: "AWS Macie for sensitive data discovery",
  dataLossPrevention: "Custom DLP solution with AWS Lambda",

  // Compliance Reporting
  complianceReporting: "AWS Artifact for compliance documentation",
  auditReporting: "Custom reporting with AWS QuickSight",
} as const

/**
 * Development vs Production Security Notice
 *
 * ⚠️  IMPORTANT SECURITY NOTICE ⚠️
 *
 * Current State (MVP):
 * - Uses Supabase for rapid development
 * - Basic security controls implemented
 * - Suitable for development and testing only
 *
 * Production Requirements:
 * - Full AWS infrastructure migration required
 * - SOC2 Type II certification mandatory
 * - Enterprise-grade security controls
 * - 24/7 security monitoring
 * - Incident response procedures
 * - Regular penetration testing
 * - Compliance auditing
 *
 * DO NOT deploy current implementation to production
 * without completing AWS migration and security certification.
 */
