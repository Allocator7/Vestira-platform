/**
 * Role-Based Access Control (RBAC) Service
 * Enterprise-grade permission management for Vestira platform
 */

export type Permission =
  // Document permissions
  | "documents:view"
  | "documents:create"
  | "documents:edit"
  | "documents:delete"
  | "documents:share"
  // Data room permissions
  | "datarooms:view"
  | "datarooms:create"
  | "datarooms:edit"
  | "datarooms:delete"
  | "datarooms:manage_access"
  // User management permissions
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "users:manage_roles"
  // Due diligence permissions
  | "ddq:view"
  | "ddq:create"
  | "ddq:edit"
  | "ddq:submit"
  | "ddq:review"
  // Analytics permissions
  | "analytics:view"
  | "analytics:export"
  | "analytics:admin"
  // System permissions
  | "system:admin"
  | "system:audit"
  | "system:backup"
  // Communication permissions
  | "messages:view"
  | "messages:send"
  | "messages:moderate"
  // Financial data permissions
  | "financial:view"
  | "financial:edit"
  | "financial:export"

export type Role = "admin" | "manager" | "allocator" | "consultant" | "viewer" | "contributor"

export interface RoleDefinition {
  name: Role
  displayName: string
  description: string
  permissions: Permission[]
  inherits?: Role[]
}

export interface UserPermissions {
  userId: string
  roles: Role[]
  customPermissions: Permission[]
  deniedPermissions: Permission[]
  contextualPermissions: {
    [resourceType: string]: {
      [resourceId: string]: Permission[]
    }
  }
}

export interface PermissionContext {
  resourceType: "document" | "dataroom" | "user" | "ddq" | "system"
  resourceId?: string
  action: Permission
  metadata?: Record<string, any>
}

export class RBACService {
  private static instance: RBACService
  private roleDefinitions: Map<Role, RoleDefinition> = new Map()
  private userPermissions: Map<string, UserPermissions> = new Map()

  public static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService()
      RBACService.instance.initializeDefaultRoles()
    }
    return RBACService.instance
  }

  /**
   * Initialize default role definitions
   */
  private initializeDefaultRoles(): void {
    // Admin role - full system access
    this.roleDefinitions.set("admin", {
      name: "admin",
      displayName: "System Administrator",
      description: "Full system access and user management",
      permissions: [
        "documents:view",
        "documents:create",
        "documents:edit",
        "documents:delete",
        "documents:share",
        "datarooms:view",
        "datarooms:create",
        "datarooms:edit",
        "datarooms:delete",
        "datarooms:manage_access",
        "users:view",
        "users:create",
        "users:edit",
        "users:delete",
        "users:manage_roles",
        "ddq:view",
        "ddq:create",
        "ddq:edit",
        "ddq:submit",
        "ddq:review",
        "analytics:view",
        "analytics:export",
        "analytics:admin",
        "system:admin",
        "system:audit",
        "system:backup",
        "messages:view",
        "messages:send",
        "messages:moderate",
        "financial:view",
        "financial:edit",
        "financial:export",
      ],
    })

    // Manager role - asset manager permissions
    this.roleDefinitions.set("manager", {
      name: "manager",
      displayName: "Asset Manager",
      description: "Asset manager with data room and client management capabilities",
      permissions: [
        "documents:view",
        "documents:create",
        "documents:edit",
        "documents:share",
        "datarooms:view",
        "datarooms:create",
        "datarooms:edit",
        "datarooms:manage_access",
        "ddq:view",
        "ddq:create",
        "ddq:edit",
        "ddq:review",
        "analytics:view",
        "analytics:export",
        "messages:view",
        "messages:send",
        "financial:view",
        "financial:edit",
      ],
    })

    // Allocator role - institutional investor permissions
    this.roleDefinitions.set("allocator", {
      name: "allocator",
      displayName: "Allocator",
      description: "Institutional investor with due diligence and analysis capabilities",
      permissions: [
        "documents:view",
        "documents:create",
        "documents:share",
        "datarooms:view",
        "ddq:view",
        "ddq:create",
        "ddq:submit",
        "analytics:view",
        "analytics:export",
        "messages:view",
        "messages:send",
        "financial:view",
      ],
    })

    // Consultant role - investment consultant permissions
    this.roleDefinitions.set("consultant", {
      name: "consultant",
      displayName: "Investment Consultant",
      description: "Investment consultant with advisory and research capabilities",
      permissions: [
        "documents:view",
        "documents:create",
        "documents:share",
        "datarooms:view",
        "ddq:view",
        "ddq:review",
        "analytics:view",
        "analytics:export",
        "messages:view",
        "messages:send",
        "financial:view",
      ],
    })

    // Contributor role - limited editing permissions
    this.roleDefinitions.set("contributor", {
      name: "contributor",
      displayName: "Contributor",
      description: "Can contribute content but limited administrative access",
      permissions: [
        "documents:view",
        "documents:create",
        "documents:edit",
        "datarooms:view",
        "ddq:view",
        "ddq:create",
        "messages:view",
        "messages:send",
      ],
    })

    // Viewer role - read-only access
    this.roleDefinitions.set("viewer", {
      name: "viewer",
      displayName: "Viewer",
      description: "Read-only access to shared content",
      permissions: ["documents:view", "datarooms:view", "ddq:view", "analytics:view", "messages:view"],
    })
  }

  /**
   * Check if user has permission for a specific action
   */
  async hasPermission(userId: string, context: PermissionContext): Promise<boolean> {
    const userPerms = await this.getUserPermissions(userId)

    if (!userPerms) {
      return false
    }

    // Check if permission is explicitly denied
    if (userPerms.deniedPermissions.includes(context.action)) {
      return false
    }

    // Check custom permissions
    if (userPerms.customPermissions.includes(context.action)) {
      return true
    }

    // Check contextual permissions
    if (context.resourceType && context.resourceId) {
      const contextualPerms = userPerms.contextualPermissions[context.resourceType]?.[context.resourceId]
      if (contextualPerms?.includes(context.action)) {
        return true
      }
    }

    // Check role-based permissions
    for (const role of userPerms.roles) {
      const rolePerms = await this.getRolePermissions(role)
      if (rolePerms.includes(context.action)) {
        return true
      }
    }

    return false
  }

  /**
   * Get all permissions for a role (including inherited)
   */
  async getRolePermissions(role: Role): Promise<Permission[]> {
    const roleDefinition = this.roleDefinitions.get(role)

    if (!roleDefinition) {
      return []
    }

    let permissions = [...roleDefinition.permissions]

    // Add inherited permissions
    if (roleDefinition.inherits) {
      for (const inheritedRole of roleDefinition.inherits) {
        const inheritedPerms = await this.getRolePermissions(inheritedRole)
        permissions = [...permissions, ...inheritedPerms]
      }
    }

    // Remove duplicates
    return [...new Set(permissions)]
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: string, role: Role): Promise<void> {
    let userPerms = this.userPermissions.get(userId)

    if (!userPerms) {
      userPerms = {
        userId,
        roles: [],
        customPermissions: [],
        deniedPermissions: [],
        contextualPermissions: {},
      }
    }

    if (!userPerms.roles.includes(role)) {
      userPerms.roles.push(role)
      this.userPermissions.set(userId, userPerms)

      // In production, persist to database
      await this.persistUserPermissions(userPerms)
    }
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, role: Role): Promise<void> {
    const userPerms = this.userPermissions.get(userId)

    if (userPerms) {
      userPerms.roles = userPerms.roles.filter((r) => r !== role)
      this.userPermissions.set(userId, userPerms)

      // In production, persist to database
      await this.persistUserPermissions(userPerms)
    }
  }

  /**
   * Grant custom permission to user
   */
  async grantPermission(userId: string, permission: Permission): Promise<void> {
    let userPerms = this.userPermissions.get(userId)

    if (!userPerms) {
      userPerms = {
        userId,
        roles: [],
        customPermissions: [],
        deniedPermissions: [],
        contextualPermissions: {},
      }
    }

    if (!userPerms.customPermissions.includes(permission)) {
      userPerms.customPermissions.push(permission)
      this.userPermissions.set(userId, userPerms)

      // In production, persist to database
      await this.persistUserPermissions(userPerms)
    }
  }

  /**
   * Revoke permission from user
   */
  async revokePermission(userId: string, permission: Permission): Promise<void> {
    const userPerms = this.userPermissions.get(userId)

    if (userPerms) {
      userPerms.customPermissions = userPerms.customPermissions.filter((p) => p !== permission)
      this.userPermissions.set(userId, userPerms)

      // In production, persist to database
      await this.persistUserPermissions(userPerms)
    }
  }

  /**
   * Grant contextual permission (resource-specific)
   */
  async grantContextualPermission(
    userId: string,
    resourceType: string,
    resourceId: string,
    permission: Permission,
  ): Promise<void> {
    let userPerms = this.userPermissions.get(userId)

    if (!userPerms) {
      userPerms = {
        userId,
        roles: [],
        customPermissions: [],
        deniedPermissions: [],
        contextualPermissions: {},
      }
    }

    if (!userPerms.contextualPermissions[resourceType]) {
      userPerms.contextualPermissions[resourceType] = {}
    }

    if (!userPerms.contextualPermissions[resourceType][resourceId]) {
      userPerms.contextualPermissions[resourceType][resourceId] = []
    }

    const resourcePerms = userPerms.contextualPermissions[resourceType][resourceId]
    if (!resourcePerms.includes(permission)) {
      resourcePerms.push(permission)
      this.userPermissions.set(userId, userPerms)

      // In production, persist to database
      await this.persistUserPermissions(userPerms)
    }
  }

  /**
   * Get user's complete permission set
   */
  async getUserPermissions(userId: string): Promise<UserPermissions | null> {
    // In production, fetch from database
    return this.userPermissions.get(userId) || null
  }

  /**
   * Get all available roles
   */
  getRoles(): RoleDefinition[] {
    return Array.from(this.roleDefinitions.values())
  }

  /**
   * Get role definition
   */
  getRole(role: Role): RoleDefinition | null {
    return this.roleDefinitions.get(role) || null
  }

  /**
   * Check if user can access resource
   */
  async canAccessResource(
    userId: string,
    resourceType: string,
    resourceId: string,
    action: Permission,
  ): Promise<boolean> {
    return await this.hasPermission(userId, {
      resourceType: resourceType as any,
      resourceId,
      action,
    })
  }

  /**
   * Get user's effective permissions for a resource
   */
  async getResourcePermissions(userId: string, resourceType: string, resourceId: string): Promise<Permission[]> {
    const userPerms = await this.getUserPermissions(userId)

    if (!userPerms) {
      return []
    }

    const permissions: Set<Permission> = new Set()

    // Add role-based permissions
    for (const role of userPerms.roles) {
      const rolePerms = await this.getRolePermissions(role)
      rolePerms.forEach((perm) => permissions.add(perm))
    }

    // Add custom permissions
    userPerms.customPermissions.forEach((perm) => permissions.add(perm))

    // Add contextual permissions
    const contextualPerms = userPerms.contextualPermissions[resourceType]?.[resourceId] || []
    contextualPerms.forEach((perm) => permissions.add(perm))

    // Remove denied permissions
    userPerms.deniedPermissions.forEach((perm) => permissions.delete(perm))

    return Array.from(permissions)
  }

  // Private helper methods
  private async persistUserPermissions(userPerms: UserPermissions): Promise<void> {
    // In production, save to database
    console.log(`Persisting permissions for user ${userPerms.userId}`)
  }
}

export const rbacService = RBACService.getInstance()
