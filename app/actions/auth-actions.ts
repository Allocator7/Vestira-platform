"use server"
import { mfaService } from "@/lib/auth/mfa-service"
import { sessionManager } from "@/lib/auth/session-manager"
import { rbacService } from "@/lib/auth/rbac-service"
import { databaseService } from "@/lib/database/database-service"

export async function setupMFA(formData: FormData) {
  try {
    const method = formData.get("method") as "totp" | "sms" | "email"
    const userId = formData.get("userId") as string
    const email = formData.get("email") as string
    const phoneNumber = formData.get("phoneNumber") as string

    let setup
    switch (method) {
      case "totp":
        setup = await mfaService.setupTOTP(userId, email)
        break
      case "sms":
        setup = await mfaService.setupSMS(userId, phoneNumber)
        break
      case "email":
        setup = await mfaService.setupEmail(userId, email)
        break
      default:
        throw new Error("Invalid MFA method")
    }

    // Store MFA setup in database
    await databaseService.saveMFASecret(userId, setup)

    return { success: true, setup }
  } catch (error) {
    console.error("MFA setup error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "MFA setup failed",
    }
  }
}

export async function verifyMFA(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const method = formData.get("method") as "totp" | "sms" | "email" | "backup-codes"
    const code = formData.get("code") as string
    const rememberDevice = formData.get("rememberDevice") === "true"
    const deviceFingerprint = formData.get("deviceFingerprint") as string

    const verification = {
      method,
      code,
      rememberDevice,
      deviceFingerprint,
    }

    const isValid = await mfaService.verifyMFA(userId, verification)

    if (!isValid) {
      return { success: false, error: "Invalid verification code" }
    }

    // If remember device is enabled, add to trusted devices
    if (rememberDevice && deviceFingerprint) {
      await mfaService.trustDevice(userId, {
        fingerprint: deviceFingerprint,
        name: "Browser Device",
        ipAddress: "127.0.0.1", // In production, get real IP
        userAgent: "Demo Browser",
      })
    }

    return { success: true }
  } catch (error) {
    console.error("MFA verification error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "MFA verification failed",
    }
  }
}

export async function createSession(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const userRole = formData.get("userRole") as string
    const email = formData.get("email") as string
    const firmId = formData.get("firmId") as string
    const deviceFingerprint = formData.get("deviceFingerprint") as string
    const mfaVerified = formData.get("mfaVerified") === "true"

    // Check if device is trusted
    const trustedDevice = await mfaService.isTrustedDevice(userId, deviceFingerprint)

    const sessionData = {
      userId,
      userRole,
      email,
      firmId,
      deviceFingerprint,
      ipAddress: "127.0.0.1", // In production, get real IP
      userAgent: "Demo Browser",
      mfaVerified,
      trustedDevice,
      permissions: [],
    }

    const sessionId = await sessionManager.createSession(sessionData)

    // Store session in database
    const session = await sessionManager.validateSession(sessionId)
    if (session) {
      await databaseService.saveSession(session)
    }

    return { success: true, sessionId }
  } catch (error) {
    console.error("Session creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Session creation failed",
    }
  }
}

export async function validateSession(sessionId: string) {
  try {
    const session = await sessionManager.validateSession(sessionId)

    if (!session) {
      return { success: false, error: "Invalid session" }
    }

    // Update session in database
    await databaseService.saveSession(session)

    return { success: true, session }
  } catch (error) {
    console.error("Session validation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Session validation failed",
    }
  }
}

export async function destroySession(sessionId: string) {
  try {
    await sessionManager.destroySession(sessionId)
    await databaseService.deleteSession(sessionId)

    return { success: true }
  } catch (error) {
    console.error("Session destruction error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Session destruction failed",
    }
  }
}

export async function assignUserRole(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const role = formData.get("role") as any
    const assignedBy = formData.get("assignedBy") as string

    await rbacService.assignRole(userId, role)

    // Log the action
    await databaseService.saveAuditLog({
      userId: assignedBy,
      action: "role_assigned",
      details: { targetUserId: userId, role },
      ipAddress: "127.0.0.1",
    })

    return { success: true }
  } catch (error) {
    console.error("Role assignment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Role assignment failed",
    }
  }
}

export async function checkPermission(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const resourceType = formData.get("resourceType") as string
    const resourceId = formData.get("resourceId") as string
    const action = formData.get("action") as any

    const hasPermission = await rbacService.hasPermission(userId, {
      resourceType: resourceType as any,
      resourceId,
      action,
    })

    return { success: true, hasPermission }
  } catch (error) {
    console.error("Permission check error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Permission check failed",
    }
  }
}

export async function generateBackupCodes(formData: FormData) {
  try {
    const userId = formData.get("userId") as string

    const codes = await mfaService.generateBackupCodes(userId)
    await databaseService.saveBackupCodes(userId, codes)

    // Log the action
    await databaseService.saveAuditLog({
      userId,
      action: "backup_codes_generated",
      details: { codeCount: codes.length },
      ipAddress: "127.0.0.1",
    })

    return { success: true, codes }
  } catch (error) {
    console.error("Backup codes generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Backup codes generation failed",
    }
  }
}

export async function revokeTrustedDevice(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const deviceId = formData.get("deviceId") as string

    await mfaService.revokeTrustedDevice(userId, deviceId)
    await databaseService.deleteTrustedDevice(userId, deviceId)

    // Log the action
    await databaseService.saveAuditLog({
      userId,
      action: "trusted_device_revoked",
      details: { deviceId },
      ipAddress: "127.0.0.1",
    })

    return { success: true }
  } catch (error) {
    console.error("Device revocation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Device revocation failed",
    }
  }
}
