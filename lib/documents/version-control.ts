/**
 * Document Version Control System
 * Handles document versioning, change tracking, and collaboration
 */

export interface DocumentVersion {
  id: string
  documentId: string
  versionNumber: string
  title: string
  description?: string
  content: Buffer
  contentType: string
  size: number
  checksum: string
  createdBy: string
  createdAt: Date
  tags: string[]
  metadata: Record<string, any>
  parentVersionId?: string
  isLatest: boolean
  status: "draft" | "review" | "approved" | "archived"
}

export interface DocumentChange {
  id: string
  documentId: string
  versionId: string
  changeType: "create" | "update" | "delete" | "restore" | "approve" | "reject"
  description: string
  changedBy: string
  changedAt: Date
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  reviewRequired: boolean
  approvedBy?: string
  approvedAt?: Date
}

export interface DocumentLock {
  documentId: string
  lockedBy: string
  lockedAt: Date
  expiresAt: Date
  lockType: "edit" | "review" | "admin"
  reason?: string
}

export interface MergeConflict {
  id: string
  documentId: string
  baseVersionId: string
  version1Id: string
  version2Id: string
  conflictType: "content" | "metadata" | "permissions"
  description: string
  resolution?: "version1" | "version2" | "manual"
  resolvedBy?: string
  resolvedAt?: Date
}

export class DocumentVersionControl {
  private static instance: DocumentVersionControl
  private versions: Map<string, DocumentVersion[]> = new Map()
  private changes: Map<string, DocumentChange[]> = new Map()
  private locks: Map<string, DocumentLock> = new Map()
  private conflicts: Map<string, MergeConflict[]> = new Map()

  public static getInstance(): DocumentVersionControl {
    if (!DocumentVersionControl.instance) {
      DocumentVersionControl.instance = new DocumentVersionControl()
    }
    return DocumentVersionControl.instance
  }

  /**
   * Create new document version
   */
  async createVersion(
    documentId: string,
    content: Buffer,
    metadata: {
      title: string
      description?: string
      contentType: string
      createdBy: string
      tags?: string[]
      parentVersionId?: string
    },
  ): Promise<DocumentVersion> {
    const versions = this.versions.get(documentId) || []
    const versionNumber = this.generateVersionNumber(versions, metadata.parentVersionId)

    // Mark previous version as not latest
    versions.forEach((v) => (v.isLatest = false))

    const version: DocumentVersion = {
      id: `version_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      documentId,
      versionNumber,
      title: metadata.title,
      description: metadata.description,
      content,
      contentType: metadata.contentType,
      size: content.length,
      checksum: this.calculateChecksum(content),
      createdBy: metadata.createdBy,
      createdAt: new Date(),
      tags: metadata.tags || [],
      metadata: {},
      parentVersionId: metadata.parentVersionId,
      isLatest: true,
      status: "draft",
    }

    versions.push(version)
    this.versions.set(documentId, versions)

    // Log the change
    await this.logChange(documentId, version.id, "create", `Created version ${versionNumber}`, metadata.createdBy)

    // In production, persist to database
    await this.persistVersion(version)

    return version
  }

  /**
   * Get document version
   */
  async getVersion(documentId: string, versionId: string): Promise<DocumentVersion | null> {
    const versions = this.versions.get(documentId) || []
    return versions.find((v) => v.id === versionId) || null
  }

  /**
   * Get latest version of document
   */
  async getLatestVersion(documentId: string): Promise<DocumentVersion | null> {
    const versions = this.versions.get(documentId) || []
    return versions.find((v) => v.isLatest) || null
  }

  /**
   * Get all versions of document
   */
  async getVersionHistory(documentId: string): Promise<DocumentVersion[]> {
    const versions = this.versions.get(documentId) || []
    return versions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Compare two versions
   */
  async compareVersions(
    documentId: string,
    version1Id: string,
    version2Id: string,
  ): Promise<{
    differences: {
      field: string
      version1Value: any
      version2Value: any
      changeType: "added" | "removed" | "modified"
    }[]
    contentDiff?: string
  }> {
    const version1 = await this.getVersion(documentId, version1Id)
    const version2 = await this.getVersion(documentId, version2Id)

    if (!version1 || !version2) {
      throw new Error("One or both versions not found")
    }

    const differences = []

    // Compare metadata
    const fields = ["title", "description", "tags", "status"]
    for (const field of fields) {
      const val1 = (version1 as any)[field]
      const val2 = (version2 as any)[field]

      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        differences.push({
          field,
          version1Value: val1,
          version2Value: val2,
          changeType: "modified" as const,
        })
      }
    }

    // In production, implement content diffing algorithm
    const contentDiff = this.generateContentDiff(version1.content, version2.content)

    return { differences, contentDiff }
  }

  /**
   * Lock document for editing
   */
  async lockDocument(
    documentId: string,
    userId: string,
    lockType: DocumentLock["lockType"] = "edit",
    duration: number = 30 * 60 * 1000, // 30 minutes
    reason?: string,
  ): Promise<DocumentLock> {
    const existingLock = this.locks.get(documentId)

    if (existingLock && existingLock.expiresAt > new Date()) {
      if (existingLock.lockedBy !== userId) {
        throw new Error(`Document is locked by ${existingLock.lockedBy} until ${existingLock.expiresAt}`)
      }
    }

    const lock: DocumentLock = {
      documentId,
      lockedBy: userId,
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + duration),
      lockType,
      reason,
    }

    this.locks.set(documentId, lock)

    // In production, persist to database
    await this.persistLock(lock)

    return lock
  }

  /**
   * Unlock document
   */
  async unlockDocument(documentId: string, userId: string): Promise<void> {
    const lock = this.locks.get(documentId)

    if (lock && lock.lockedBy === userId) {
      this.locks.delete(documentId)

      // In production, remove from database
      await this.removeLock(documentId)
    }
  }

  /**
   * Check if document is locked
   */
  async isDocumentLocked(documentId: string): Promise<DocumentLock | null> {
    const lock = this.locks.get(documentId)

    if (lock && lock.expiresAt > new Date()) {
      return lock
    }

    if (lock) {
      // Lock expired, remove it
      this.locks.delete(documentId)
      await this.removeLock(documentId)
    }

    return null
  }

  /**
   * Approve version
   */
  async approveVersion(documentId: string, versionId: string, approvedBy: string, comments?: string): Promise<void> {
    const version = await this.getVersion(documentId, versionId)

    if (!version) {
      throw new Error("Version not found")
    }

    version.status = "approved"

    // Log the change
    await this.logChange(
      documentId,
      versionId,
      "approve",
      `Approved version ${version.versionNumber}${comments ? `: ${comments}` : ""}`,
      approvedBy,
    )

    // In production, persist to database
    await this.persistVersion(version)
  }

  /**
   * Restore previous version
   */
  async restoreVersion(documentId: string, versionId: string, restoredBy: string): Promise<DocumentVersion> {
    const versionToRestore = await this.getVersion(documentId, versionId)

    if (!versionToRestore) {
      throw new Error("Version not found")
    }

    // Create new version based on the restored version
    const restoredVersion = await this.createVersion(documentId, versionToRestore.content, {
      title: versionToRestore.title,
      description: `Restored from version ${versionToRestore.versionNumber}`,
      contentType: versionToRestore.contentType,
      createdBy: restoredBy,
      tags: versionToRestore.tags,
    })

    // Log the change
    await this.logChange(
      documentId,
      restoredVersion.id,
      "restore",
      `Restored from version ${versionToRestore.versionNumber}`,
      restoredBy,
    )

    return restoredVersion
  }

  /**
   * Get change history
   */
  async getChangeHistory(documentId: string): Promise<DocumentChange[]> {
    const changes = this.changes.get(documentId) || []
    return changes.sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime())
  }

  /**
   * Detect and handle merge conflicts
   */
  async detectMergeConflicts(
    documentId: string,
    baseVersionId: string,
    version1Id: string,
    version2Id: string,
  ): Promise<MergeConflict[]> {
    const conflicts: MergeConflict[] = []

    // Compare versions to detect conflicts
    const comparison1 = await this.compareVersions(documentId, baseVersionId, version1Id)
    const comparison2 = await this.compareVersions(documentId, baseVersionId, version2Id)

    // Find overlapping changes
    for (const diff1 of comparison1.differences) {
      const conflictingDiff = comparison2.differences.find((diff2) => diff2.field === diff1.field)

      if (conflictingDiff && diff1.version2Value !== conflictingDiff.version2Value) {
        const conflict: MergeConflict = {
          id: `conflict_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          documentId,
          baseVersionId,
          version1Id,
          version2Id,
          conflictType: "metadata",
          description: `Conflicting changes to ${diff1.field}`,
        }

        conflicts.push(conflict)
      }
    }

    // Store conflicts
    if (conflicts.length > 0) {
      this.conflicts.set(documentId, conflicts)
    }

    return conflicts
  }

  // Private helper methods
  private generateVersionNumber(versions: DocumentVersion[], parentVersionId?: string): string {
    if (versions.length === 0) {
      return "1.0"
    }

    if (parentVersionId) {
      const parentVersion = versions.find((v) => v.id === parentVersionId)
      if (parentVersion) {
        const [major, minor] = parentVersion.versionNumber.split(".").map(Number)
        return `${major}.${minor + 1}`
      }
    }

    // Get latest version and increment
    const latestVersion = versions.find((v) => v.isLatest)
    if (latestVersion) {
      const [major, minor] = latestVersion.versionNumber.split(".").map(Number)
      return `${major + 1}.0`
    }

    return "1.0"
  }

  private calculateChecksum(content: Buffer): string {
    // In production, use proper hashing algorithm (SHA-256)
    return Buffer.from(content.toString()).toString("base64").substring(0, 32)
  }

  private generateContentDiff(content1: Buffer, content2: Buffer): string {
    // In production, implement proper diff algorithm
    const text1 = content1.toString()
    const text2 = content2.toString()

    if (text1 === text2) {
      return "No content changes"
    }

    return `Content changed (${text1.length} -> ${text2.length} characters)`
  }

  private async logChange(
    documentId: string,
    versionId: string,
    changeType: DocumentChange["changeType"],
    description: string,
    changedBy: string,
    changes: DocumentChange["changes"] = [],
  ): Promise<void> {
    const change: DocumentChange = {
      id: `change_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      documentId,
      versionId,
      changeType,
      description,
      changedBy,
      changedAt: new Date(),
      changes,
      reviewRequired: changeType === "update",
    }

    if (!this.changes.has(documentId)) {
      this.changes.set(documentId, [])
    }

    this.changes.get(documentId)!.push(change)

    // In production, persist to database
    await this.persistChange(change)
  }

  private async persistVersion(version: DocumentVersion): Promise<void> {
    // In production, persist to database
    console.log(`Persisting version ${version.id} for document ${version.documentId}`)
  }

  private async persistLock(lock: DocumentLock): Promise<void> {
    // In production, persist to database
    console.log(`Persisting lock for document ${lock.documentId}`)
  }

  private async removeLock(documentId: string): Promise<void> {
    // In production, remove from database
    console.log(`Removing lock for document ${documentId}`)
  }

  private async persistChange(change: DocumentChange): Promise<void> {
    // In production, persist to database
    console.log(`Persisting change ${change.id} for document ${change.documentId}`)
  }
}

export const documentVersionControl = DocumentVersionControl.getInstance()
