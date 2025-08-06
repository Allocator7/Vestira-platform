import { NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      )
    }

    // Verify the token
    let decoded
    try {
      decoded = verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      )
    }

    // Check if this is an email verification token
    if (decoded.type !== "email-verification") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 400 }
      )
    }

    // Update user's emailVerified status in localStorage (in production, this would be in a database)
    const existingUsers = JSON.parse(localStorage.getItem('vestira-users') || '[]')
    const userIndex = existingUsers.findIndex((user: any) => user.email === decoded.email)
    
    if (userIndex !== -1) {
      existingUsers[userIndex].emailVerified = true
      existingUsers[userIndex].verificationToken = null
      existingUsers[userIndex].updatedAt = new Date().toISOString()
      localStorage.setItem('vestira-users', JSON.stringify(existingUsers))
      console.log("Email verified for:", decoded.email)
    }

    // Redirect to login page with success message
    const loginUrl = `${process.env.NEXTAUTH_URL || "https://vestira.co"}/login?verified=true`
    
    return NextResponse.redirect(loginUrl)

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    )
  }
}