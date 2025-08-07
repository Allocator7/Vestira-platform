import { NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import { compare } from "bcryptjs"
import { findUserByEmail, verifyPassword } from "@/lib/database-memory"

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

    // Find user in database
    let user = findUserByEmail(body.email)
    
    // If user not found, check for demo user
    if (!user) {
      const demoUser = {
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
      
      // Check if it's the demo user
      if (body.email.toLowerCase() === demoUser.email.toLowerCase()) {
        // For demo user, check password directly
        const bcrypt = require('bcryptjs')
        const isPasswordValid = await bcrypt.compare(body.password, demoUser.password)
        if (isPasswordValid) {
          user = demoUser
        } else {
          return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
          )
        }
      } else {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }
    } else {
      // Verify password for real user
      const verifiedUser = await verifyPassword(body.email, body.password)
      if (!verifiedUser) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }
      user = verifiedUser
    }

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