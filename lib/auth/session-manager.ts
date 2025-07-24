/**
 * Enterprise Session Management
 * Handles secure session creation, validation, and lifecycle management
 */

export interface SessionData {
  id: string
  userId: string
  userRole: string
  email: string
  firmId: string
  deviceFingerprint: string
  ipAddress: string
  userAgent: string
  createdAt: Date
  lastActivity: Date
  expiresAt: Date
  mfaVerified: boolean
  trustedDevice: boolean
  permissions: string[]
  metadata: Record<string, any>
}

export interface SessionConfig {
  maxAge: number // milliseconds
  maxInactivity: number // milliseconds
  maxConcurrentSessions: number
  requireMFAForSensitiveActions: boolean
  trustDeviceDuration: number // milliseconds
}

export class SessionManager {
  private static instance: SessionManager
  private sessions: Map<string, SessionData> = new Map()
  private userSessions: Map<string, Set<string>> = new Map()

  private config: SessionConfig = {
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    maxInactivity: 30 * 60 * 1000, // 30 minutes
    maxConcurrentSessions: 3,
    requireMFAForSensitiveActions: true,
    trustDeviceDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  /**
   * Create a new session after successful authentication
   */
  async createSession(
    sessionData: Omit<SessionData, "id" | "createdAt" | "lastActivity" | "expiresAt">,
  ): Promise<string> {
    // Check concurrent session limit
    await this.enforceConcurrentSessionLimit(sessionData.userId)

    const sessionId = this.generateSessionId()
    const now = new Date()

    const session: SessionData = {
      ...sessionData,
      id: sessionId,
      createdAt: now,
      lastActivity: now,
      expiresAt: new Date(now.getTime() + this.config.maxAge),
    }

    // Store session
    this.sessions.set(sessionId, session)

    // Track user sessions
    if (!this.userSessions.has(sessionData.userId)) {
      this.userSessions.set(sessionData.userId, new Set())
    }
    this.userSessions.get(sessionData.userId)!.add(sessionId)

    // In production, store in Redis or database
    await this.persistSession(session)

    return sessionId
  }

  /**
   * Validate and refresh session
   */
  async validateSession(sessionId: string): Promise<SessionData | null> {
    const session = this.sessions.get(sessionId)

    if (!session) {
      return null
    }

    const now = new Date()

    // Check if session expired
    if (session.expiresAt < now) {
      await this.destroySession(sessionId)
      return null
    }

    // Check inactivity timeout
    const inactivityTime = now.getTime() - session.lastActivity.getTime()
    if (inactivityTime > this.config.maxInactivity) {
      await this.destroySession(sessionId)
      return null
    }

    // Update last activity
    session.lastActivity = now
    this.sessions.set(sessionId, session)

    // In production, update in Redis/database
    await this.persistSession(session)

    return session
  }

  /**
   * Destroy a specific session
   */
  async destroySession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)

    if (session) {
      // Remove from user sessions tracking
      const userSessions = this.userSessions.get(session.userId)
      if (userSessions) {
        userSessions.delete(sessionId)
        if (userSessions.size === 0) {
          this.userSessions.delete(session.userId)
        }
      }
    }

    this.sessions.delete(sessionId)

    // In production, remove from Redis/database
    await this.removePersistedSession(sessionId)
  }

  /**
   * Destroy all sessions for a user
   */
  async destroyAllUserSessions(userId: string): Promise<void> {
    const userSessions = this.userSessions.get(userId)

    if (userSessions) {
      for (const sessionId of userSessions) {
        this.sessions.delete(sessionId)
        await this.removePersistedSession(sessionId)
      }
      this.userSessions.delete(userId)
    }
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<SessionData[]> {
    const userSessions = this.userSessions.get(userId)
    const sessions: SessionData[] = []

    if (userSessions) {
      for (const sessionId of userSessions) {
        const session = this.sessions.get(sessionId)
        if (session) {
          sessions.push(session)
        }
      }
    }

    return sessions
  }

  /**
   * Update session MFA status
   */
  async updateMFAStatus(sessionId: string, verified: boolean): Promise<void> {
    const session = this.sessions.get(sessionId)

    if (session) {
      session.mfaVerified = verified
      session.lastActivity = new Date()
      this.sessions.set(sessionId, session)
      await this.persistSession(session)
    }
  }

  /**
   * Check if action requires MFA re-verification
   */
  requiresMFAForAction(session: SessionData, action: string): boolean {
    if (!this.config.requireMFAForSensitiveActions) {
      return false
    }

    const sensitiveActions = [
      "document_download",
      "data_room_access",
      "user_management",
      "security_settings",
      "financial_data_access",
    ]

    return sensitiveActions.includes(action) && !session.mfaVerified
  }

  /**
   * Generate device fingerprint
   */
  generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
    // In production, use more sophisticated fingerprinting
    const data = `${userAgent}|${ipAddress}|${Date.now()}`
    return Buffer.from(data).toString("base64").substring(0, 32)
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date()
    const expiredSessions: string[] = []

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        expiredSessions.push(sessionId)
      }
    }

    for (const sessionId of expiredSessions) {
      await this.destroySession(sessionId)
    }
  }

  // Private helper methods
  private generateSessionId(): string {
    // In production, use crypto.randomBytes
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private async enforceConcurrentSessionLimit(userId: string): Promise<void> {
    const userSessions = this.userSessions.get(userId)

    if (userSessions && userSessions.size >= this.config.maxConcurrentSessions) {
      // Remove oldest session
      const sessions = await this.getUserSessions(userId)
      sessions.sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime())

      if (sessions.length > 0) {
        await this.destroySession(sessions[0].id)
      }
    }
  }

  private async persistSession(session: SessionData): Promise<void> {
    // In production, store in Redis or database
    console.log(`Persisting session ${session.id} for user ${session.userId}`)
  }

  private async removePersistedSession(sessionId: string): Promise<void> {
    // In production, remove from Redis or database
    console.log(`Removing persisted session ${sessionId}`)
  }
}

export const sessionManager = SessionManager.getInstance()

// Start cleanup interval
setInterval(
  () => {
    sessionManager.cleanupExpiredSessions()
  },
  5 * 60 * 1000,
) // Every 5 minutes
