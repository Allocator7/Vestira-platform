/**
 * Database Service Layer
 * Handles all data persistence for Vestira platform
 */

import type { SessionData } from "@/lib/auth/session-manager"
import type { UserPermissions } from "@/lib/auth/rbac-service"
import type { DocumentVersion, DocumentChange, DocumentLock } from "@/lib/documents/version-control"
import type { DocumentAccess, DLPScanResult } from "@/lib/documents/document-security"

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  ssl: boolean
}

export class DatabaseService {
  private static instance: DatabaseService
  private connected = false

  // In-memory storage for demo (replace with actual database in production)
  private tables = {
    sessions: new Map<string, SessionData>(),
    userPermissions: new Map<string, UserPermissions>(),
    documentVersions: new Map<string, DocumentVersion>(),
    documentChanges: new Map<string, DocumentChange>(),
    documentLocks: new Map<string, DocumentLock>(),
    documentAccess: new Map<string, DocumentAccess>(),
    dlpResults: new Map<string, DLPScanResult>(),
    trustedDevices: new Map<string, any>(),
    mfaSecrets: new Map<string, any>(),
    backupCodes: new Map<string, string[]>(),
    auditLogs: new Map<string, any>(),
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async connect(config?: DatabaseConfig): Promise<void> {
    // In production, establish database connection
    console.log("Connecting to database...")
    await new Promise((resolve) => setTimeout(resolve, 100))
    this.connected = true
    console.log("Database connected successfully")
  }

  async disconnect(): Promise<void> {
    this.connected = false
    console.log("Database disconnected")
  }

  // Session Management
  async saveSession(session: SessionData): Promise<void> {
    this.tables.sessions.set(session.id, session)
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    return this.tables.sessions.get(sessionId) || null
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.tables.sessions.delete(sessionId)
  }

  async getUserSessions(userId: string): Promise<SessionData[]> {
    return Array.from(this.tables.sessions.values()).filter((s) => s.userId === userId)
  }

  // User Permissions
  async saveUserPermissions(permissions: UserPermissions): Promise<void> {
    this.tables.userPermissions.set(permissions.userId, permissions)
  }

  async getUserPermissions(userId: string): Promise<UserPermissions | null> {
    return this.tables.userPermissions.get(userId) || null
  }

  // Document Versions
  async saveDocumentVersion(version: DocumentVersion): Promise<void> {
    this.tables.documentVersions.set(version.id, version)
  }

  async getDocumentVersion(versionId: string): Promise<DocumentVersion | null> {
    return this.tables.documentVersions.get(versionId) || null
  }

  async getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    return Array.from(this.tables.documentVersions.values())
      .filter((v) => v.documentId === documentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Document Changes
  async saveDocumentChange(change: DocumentChange): Promise<void> {
    this.tables.documentChanges.set(change.id, change)
  }

  async getDocumentChanges(documentId: string): Promise<DocumentChange[]> {
    return Array.from(this.tables.documentChanges.values())
      .filter((c) => c.documentId === documentId)
      .sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime())
  }

  // Document Locks
  async saveDocumentLock(lock: DocumentLock): Promise<void> {
    this.tables.documentLocks.set(lock.documentId, lock)
  }

  async getDocumentLock(documentId: string): Promise<DocumentLock | null> {
    return this.tables.documentLocks.get(documentId) || null
  }

  async deleteDocumentLock(documentId: string): Promise<void> {
    this.tables.documentLocks.delete(documentId)
  }

  // Document Access Logs
  async saveDocumentAccess(access: DocumentAccess): Promise<void> {
    this.tables.documentAccess.set(access.id, access)
  }

  async getDocumentAccess(documentId: string): Promise<DocumentAccess[]> {
    return Array.from(this.tables.documentAccess.values())
      .filter((a) => a.documentId === documentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // DLP Results
  async saveDLPResult(result: DLPScanResult): Promise<void> {
    this.tables.dlpResults.set(result.documentId, result)
  }

  async getDLPResult(documentId: string): Promise<DLPScanResult | null> {
    return this.tables.dlpResults.get(documentId) || null
  }

  // MFA Management
  async saveMFASecret(userId: string, secret: any): Promise<void> {
    this.tables.mfaSecrets.set(userId, secret)
  }

  async getMFASecret(userId: string): Promise<any> {
    return this.tables.mfaSecrets.get(userId)
  }

  async saveBackupCodes(userId: string, codes: string[]): Promise<void> {
    this.tables.backupCodes.set(userId, codes)
  }

  async getBackupCodes(userId: string): Promise<string[]> {
    return this.tables.backupCodes.get(userId) || []
  }

  async useBackupCode(userId: string, code: string): Promise<boolean> {
    const codes = this.tables.backupCodes.get(userId) || []
    const index = codes.indexOf(code)
    if (index > -1) {
      codes.splice(index, 1)
      this.tables.backupCodes.set(userId, codes)
      return true
    }
    return false
  }

  // Trusted Devices
  async saveTrustedDevice(userId: string, device: any): Promise<void> {
    const userDevices = this.tables.trustedDevices.get(userId) || []
    userDevices.push(device)
    this.tables.trustedDevices.set(userId, userDevices)
  }

  async getTrustedDevices(userId: string): Promise<any[]> {
    return this.tables.trustedDevices.get(userId) || []
  }

  async deleteTrustedDevice(userId: string, deviceId: string): Promise<void> {
    const userDevices = this.tables.trustedDevices.get(userId) || []
    const filtered = userDevices.filter((d) => d.id !== deviceId)
    this.tables.trustedDevices.set(userId, filtered)
  }

  // Audit Logs
  async saveAuditLog(log: any): Promise<void> {
    const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    this.tables.auditLogs.set(logId, { ...log, id: logId, timestamp: new Date() })
  }

  async getAuditLogs(filters?: any): Promise<any[]> {
    let logs = Array.from(this.tables.auditLogs.values())

    if (filters?.userId) {
      logs = logs.filter((log) => log.userId === filters.userId)
    }

    if (filters?.action) {
      logs = logs.filter((log) => log.action === filters.action)
    }

    if (filters?.startDate) {
      logs = logs.filter((log) => log.timestamp >= filters.startDate)
    }

    if (filters?.endDate) {
      logs = logs.filter((log) => log.timestamp <= filters.endDate)
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; connected: boolean; timestamp: Date }> {
    return {
      status: this.connected ? "healthy" : "disconnected",
      connected: this.connected,
      timestamp: new Date(),
    }
  }

  // Cleanup expired data
  async cleanup(): Promise<void> {
    const now = new Date()

    // Clean expired sessions
    for (const [id, session] of this.tables.sessions.entries()) {
      if (session.expiresAt < now) {
        this.tables.sessions.delete(id)
      }
    }

    // Clean expired locks
    for (const [id, lock] of this.tables.documentLocks.entries()) {
      if (lock.expiresAt < now) {
        this.tables.documentLocks.delete(id)
      }
    }

    console.log("Database cleanup completed")
  }
}

export const databaseService = DatabaseService.getInstance()

// Initialize database connection
databaseService.connect().catch(console.error)

// Start cleanup interval
setInterval(
  () => {
    databaseService.cleanup()
  },
  5 * 60 * 1000,
) // Every 5 minutes
