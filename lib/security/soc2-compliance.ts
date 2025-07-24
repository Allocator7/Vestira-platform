/**
 * SOC2 Compliance Framework for Vestira Data Rooms
 *
 * This module defines the security controls and compliance requirements
 * for SOC2 Type II certification in production environments.
 *
 * PRODUCTION REQUIREMENT: Must be implemented with AWS-level security
 * before production deployment.
 */

export interface SOC2SecurityControls {
  // Security Principle: Logical and Physical Access Controls
  accessControl: {
    multiFactorAuthentication: boolean
    roleBasedAccess: boolean
    principleOfLeastPrivilege: boolean
    accessReviewCycles: number // days
    sessionTimeout: number // minutes
    ipWhitelisting: boolean
    geographicRestrictions: boolean
  }

  // Security Principle: System Operations
  systemOperations: {
    changeManagement: boolean
    backupProcedures: boolean
    systemMonitoring: boolean
    incidentResponse: boolean
    vulnerabilityManagement: boolean
    patchManagement: boolean
  }

  // Security Principle: Network Security
  networkSecurity: {
    encryptionInTransit: "TLS1.3" | "TLS1.2"
    encryptionAtRest: "AES256" | "AES128"
    networkSegmentation: boolean
    firewallProtection: boolean
    intrusionDetection: boolean
    ddosProtection: boolean
  }

  // Security Principle: Data Protection
  dataProtection: {
    dataClassification: boolean
    dataRetentionPolicies: boolean
    secureDataDisposal: boolean
    dataLossPreventionDLP: boolean
    dataBackupEncryption: boolean
    crossBorderDataTransfer: boolean
  }

  // Security Principle: System Availability
  systemAvailability: {
    uptimeRequirement: number // percentage
    disasterRecovery: boolean
    businessContinuity: boolean
    redundancy: boolean
    loadBalancing: boolean
    capacityPlanning: boolean
  }
}

export const PRODUCTION_SOC2_REQUIREMENTS: SOC2SecurityControls = {
  accessControl: {
    multiFactorAuthentication: true,
    roleBasedAccess: true,
    principleOfLeastPrivilege: true,
    accessReviewCycles: 90,
    sessionTimeout: 30,
    ipWhitelisting: true,
    geographicRestrictions: true,
  },
  systemOperations: {
    changeManagement: true,
    backupProcedures: true,
    systemMonitoring: true,
    incidentResponse: true,
    vulnerabilityManagement: true,
    patchManagement: true,
  },
  networkSecurity: {
    encryptionInTransit: "TLS1.3",
    encryptionAtRest: "AES256",
    networkSegmentation: true,
    firewallProtection: true,
    intrusionDetection: true,
    ddosProtection: true,
  },
  dataProtection: {
    dataClassification: true,
    dataRetentionPolicies: true,
    secureDataDisposal: true,
    dataLossPreventionDLP: true,
    dataBackupEncryption: true,
    crossBorderDataTransfer: true,
  },
  systemAvailability: {
    uptimeRequirement: 99.9,
    disasterRecovery: true,
    businessContinuity: true,
    redundancy: true,
    loadBalancing: true,
    capacityPlanning: true,
  },
}

export interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userEmail: string
  action: string
  resourceType: "dataRoom" | "document" | "user" | "system"
  resourceId: string
  ipAddress: string
  userAgent: string
  sessionId: string
  result: "success" | "failure" | "unauthorized"
  details: Record<string, any>
  riskLevel: "low" | "medium" | "high" | "critical"
}

export interface ComplianceReport {
  id: string
  generatedAt: Date
  reportType: "access" | "security" | "data" | "system"
  period: {
    startDate: Date
    endDate: Date
  }
  findings: ComplianceFinding[]
  overallStatus: "compliant" | "non-compliant" | "needs-review"
  nextReviewDate: Date
}

export interface ComplianceFinding {
  id: string
  controlId: string
  severity: "low" | "medium" | "high" | "critical"
  status: "pass" | "fail" | "not-applicable"
  description: string
  evidence: string[]
  remediation?: string
  dueDate?: Date
}

/**
 * WARNING: MVP Implementation Notice
 *
 * Current implementation uses Supabase for rapid development.
 * MUST be migrated to AWS infrastructure before production:
 *
 * Required AWS Services:
 * - AWS KMS for encryption key management
 * - AWS CloudTrail for audit logging
 * - AWS GuardDuty for threat detection
 * - AWS Config for compliance monitoring
 * - AWS WAF for web application firewall
 * - AWS Shield for DDoS protection
 * - AWS VPC for network isolation
 * - AWS IAM for identity and access management
 * - AWS S3 with server-side encryption for document storage
 * - AWS RDS with encryption at rest for database
 * - AWS CloudWatch for monitoring and alerting
 * - AWS Lambda for serverless compliance functions
 */
