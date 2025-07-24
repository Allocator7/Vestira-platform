"use server"

import { documentSecurityService } from "@/lib/documents/document-security"
import { documentVersionControl } from "@/lib/documents/version-control"
import { databaseService } from "@/lib/database/database-service"

export async function scanDocument(formData: FormData) {
  try {
    const documentId = formData.get("documentId") as string
    const content = formData.get("content") as string
    const userId = formData.get("userId") as string

    const scanResult = await documentSecurityService.scanDocument(documentId, content)
    await databaseService.saveDLPResult(scanResult)

    // Log the action
    await databaseService.saveAuditLog({
      userId,
      action: "document_scanned",
      details: { documentId, riskLevel: scanResult.riskLevel },
      ipAddress: "127.0.0.1",
    })

    return { success: true, scanResult }
  } catch (error) {
    console.error("Document scan error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Document scan failed",
    }
  }
}

export async function logDocumentAccess(formData: FormData) {
  try {
    const documentId = formData.get("documentId") as string
    const action = formData.get("action") as "view" | "download" | "print" | "share" | "edit"
    const userId = formData.get("userId") as string
    const userEmail = formData.get("userEmail") as string
    const sessionId = formData.get("sessionId") as string

    await documentSecurityService.logDocumentAccess(documentId, action, {
      userId,
      userEmail,
      sessionId,
      ipAddress: "127.0.0.1",
      userAgent: "Demo Browser",
    })

    return { success: true }
  } catch (error) {
    console.error("Document access logging error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Access logging failed",
    }
  }
}

export async function createDocumentVersion(formData: FormData) {
  try {
    const documentId = formData.get("documentId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const contentType = formData.get("contentType") as string
    const createdBy = formData.get("createdBy") as string
    const content = formData.get("content") as string
    const parentVersionId = formData.get("parentVersionId") as string | undefined

    const contentBuffer = Buffer.from(content, "base64")

    const version = await documentVersionControl.createVersion(documentId, contentBuffer, {
      title,
      description,
      contentType,
      createdBy,
      parentVersionId,
    })

    await databaseService.saveDocumentVersion(version)

    // Log the action
    await databaseService.saveAuditLog({
      userId: createdBy,
      action: "document_version_created",
      details: { documentId, versionId: version.id, versionNumber: version.versionNumber },
      ipAddress: "127.0.0.1",
    })

    return { success: true, version }
  } catch (error) {
    console.error("Document version creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Version creation failed",
    }
  }
}

export async function lockDocument(formData: FormData) {
  try {
    const documentId = formData.get("documentId") as string
    const userId = formData.get("userId") as string
    const lockType = formData.get("lockType") as "edit" | "review" | "admin"
    const reason = formData.get("reason") as string | undefined

    const lock = await documentVersionControl.lockDocument(documentId, userId, lockType, 30 * 60 * 1000, reason)
    await databaseService.saveDocumentLock(lock)

    // Log the action
    await databaseService.saveAuditLog({
      userId,
      action: "document_locked",
      details: { documentId, lockType, reason },
      ipAddress: "127.0.0.1",
    })

    return { success: true, lock }
  } catch (error) {
    console.error("Document lock error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Document lock failed",
    }
  }
}

export async function unlockDocument(formData: FormData) {
  try {
    const documentId = formData.get("documentId") as string
    const userId = formData.get("userId") as string

    await documentVersionControl.unlockDocument(documentId, userId)
    await databaseService.deleteDocumentLock(documentId)

    // Log the action
    await databaseService.saveAuditLog({
      userId,
      action: "document_unlocked",
      details: { documentId },
      ipAddress: "127.0.0.1",
    })

    return { success: true }
  } catch (error) {
    console.error("Document unlock error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Document unlock failed",
    }
  }
}

export async function approveDocumentVersion(formData: FormData) {
  try {
    const documentId = formData.get("documentId") as string
    const versionId = formData.get("versionId") as string
    const approvedBy = formData.get("approvedBy") as string
    const comments = formData.get("comments") as string | undefined

    await documentVersionControl.approveVersion(documentId, versionId, approvedBy, comments)

    // Update version in database
    const version = await databaseService.getDocumentVersion(versionId)
    if (version) {
      version.status = "approved"
      await databaseService.saveDocumentVersion(version)
    }

    // Log the action
    await databaseService.saveAuditLog({
      userId: approvedBy,
      action: "document_version_approved",
      details: { documentId, versionId, comments },
      ipAddress: "127.0.0.1",
    })

    return { success: true }
  } catch (error) {
    console.error("Document approval error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Document approval failed",
    }
  }
}

export async function getDocumentSecurityReport(formData: FormData) {
  try {
    const documentId = formData.get("documentId") as string

    const report = await documentSecurityService.generateSecurityReport(documentId)

    return { success: true, report }
  } catch (error) {
    console.error("Security report error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Security report generation failed",
    }
  }
}

export async function updateDocumentSecurity(formData: FormData) {
  try {
    const documentId = formData.get("documentId") as string
    const settings = JSON.parse(formData.get("settings") as string)
    const userId = formData.get("userId") as string

    // In production, update document security settings in database
    console.log("Updating document security settings:", { documentId, settings })

    // Log the action
    await databaseService.saveAuditLog({
      userId,
      action: "document_security_updated",
      details: { documentId, settings },
      ipAddress: "127.0.0.1",
    })

    return { success: true }
  } catch (error) {
    console.error("Document security update error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Security update failed",
    }
  }
}
