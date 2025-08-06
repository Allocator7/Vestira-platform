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

    // In production, you would update the user's emailVerified status in the database
    // For now, we'll simulate the verification
    console.log("Email verified for:", decoded.email)

    // Redirect to login page with success message
    const loginUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?verified=true`
    
    return NextResponse.redirect(loginUrl)

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    )
  }
}