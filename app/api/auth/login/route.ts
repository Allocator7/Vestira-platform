import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Get users from global storage (created during signup)
    const users = global.demoUsers || []
    
    // Also include the demo user for testing
    const mockUsers = [
      {
        id: "user_1",
        email: "demo@vestira.co",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i6e", // "password123"
        firstName: "Demo",
        lastName: "User",
        organizationType: "allocator",
        organizationName: "Demo Organization",
        jobTitle: "Investment Manager",
        emailVerified: true
      }
    ]
    
    // Combine actual users with demo user
    const allUsers = [...users, ...mockUsers]
    
    const user = allUsers.find((u: any) => u.email.toLowerCase() === body.email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email address before logging in. Check your inbox for a verification link." },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await compare(body.password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = sign(
      { 
        userId: user.id, 
        email: user.email,
        organizationType: user.organizationType,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    // Return user data and token
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationType: user.organizationType,
        organizationName: user.organizationName,
        jobTitle: user.jobTitle,
        emailVerified: user.emailVerified
      },
      token
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Failed to login. Please try again." },
      { status: 500 }
    )
  }
}