/**
 * Authentication Middleware
 * Handles route protection and session validation
 */

import { type NextRequest, NextResponse } from "next/server"
import { sessionManager } from "./session-manager"
import { rbacService } from "./rbac-service"

export interface AuthConfig {
  publicRoutes: string[]
  protectedRoutes: string[]
  adminRoutes: string[]
  requireMFA: string[]
}

export class AuthMiddleware {
  private config: AuthConfig = {
    publicRoutes: ["/login", "/forgot-password", "/signup", "/"],
    protectedRoutes: ["/screens"],
    adminRoutes: ["/screens/admin"],
    requireMFA: ["/screens/*/data-rooms", "/screens/*/due-diligence-hub", "/screens/*/secure-document-center"],
  }

  async handleRequest(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl

    // Check if route is public
    if (this.isPublicRoute(pathname)) {
      return NextResponse.next()
    }

    // Get session from cookie or header
    const sessionId = this.getSessionId(request)

    if (!sessionId) {
      return this.redirectToLogin(request)
    }

    // Check for demo session first
    const demoSession = this.getDemoSession(request)
    if (demoSession && this.isValidDemoSession(demoSession)) {
      // Allow demo access
      const response = NextResponse.next()
      response.headers.set("x-session-id", demoSession.sessionId)
      response.headers.set("x-user-id", demoSession.userId)
      response.headers.set("x-user-role", demoSession.userRole)
      response.headers.set("x-is-demo", "true")
      return response
    }

    // Validate regular session
    const session = await sessionManager.validateSession(sessionId)

    if (!session) {
      return this.redirectToLogin(request)
    }

    // Check if route requires admin access
    if (this.isAdminRoute(pathname)) {
      const hasAdminAccess = await rbacService.hasPermission(session.userId, {
        resourceType: "system",
        action: "system:admin",
      })

      if (!hasAdminAccess) {
        return NextResponse.redirect(new URL("/screens/general/page", request.url))
      }
    }

    // Check if route requires MFA
    if (this.requiresMFA(pathname) && !session.mfaVerified && !session.trustedDevice) {
      return NextResponse.redirect(new URL("/login?mfa=required", request.url))
    }

    // Add session info to headers for use in components
    const response = NextResponse.next()
    response.headers.set("x-session-id", sessionId)
    response.headers.set("x-user-id", session.userId)
    response.headers.set("x-user-role", session.userRole)

    return response
  }

  private isPublicRoute(pathname: string): boolean {
    return this.config.publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
  }

  private isAdminRoute(pathname: string): boolean {
    return this.config.adminRoutes.some((route) => pathname.startsWith(route))
  }

  private requiresMFA(pathname: string): boolean {
    return this.config.requireMFA.some((pattern) => {
      const regex = new RegExp(pattern.replace("*", "[^/]+"))
      return regex.test(pathname)
    })
  }

  private getSessionId(request: NextRequest): string | null {
    // Try cookie first
    const cookieSession = request.cookies.get("vestira_session")?.value
    if (cookieSession) {
      try {
        const parsed = JSON.parse(cookieSession)
        return parsed.sessionId
      } catch {
        // Invalid cookie format
      }
    }

    // Try Authorization header
    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.substring(7)
    }

    return null
  }

  private getDemoSession(request: NextRequest): any | null {
    const cookieSession = request.cookies.get("vestira_session")?.value
    if (cookieSession) {
      try {
        const parsed = JSON.parse(cookieSession)
        if (parsed.isDemo) {
          return parsed
        }
      } catch {
        // Invalid cookie format
      }
    }
    return null
  }

  private isValidDemoSession(demoSession: any): boolean {
    // Basic validation for demo session
    return (
      demoSession &&
      demoSession.isDemo === true &&
      demoSession.sessionId &&
      demoSession.userId &&
      demoSession.userRole &&
      ["allocator", "manager", "consultant"].includes(demoSession.userRole)
    )
  }

  private redirectToLogin(request: NextRequest): NextResponse {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const authMiddleware = new AuthMiddleware()
