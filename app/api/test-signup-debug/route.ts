import { NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import { createUser, saveVerification } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("=== DEBUG SIGNUP API CALLED ===")
    
    const body = await request.json()
    console.log("Request body:", { ...body, password: "[HIDDEN]" })
    
    // Test 1: Check environment variables
    console.log("Environment check:")
    console.log("- NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET)
    console.log("- NEXTAUTH_SECRET length:", process.env.NEXTAUTH_SECRET?.length || 0)
    console.log("- SENDGRID_API_KEY exists:", !!process.env.SENDGRID_API_KEY)
    
    // Test 2: Try to create user
    console.log("Testing user creation...")
    try {
      const userData = {
        firstName: body.firstName || "Test",
        lastName: body.lastName || "User", 
        email: body.email,
        password: body.password,
        organizationType: body.organizationType || "allocator",
        organizationName: body.organizationName || "Test Org",
        jobTitle: body.jobTitle || "Test Job"
      }
      
      const newUser = await createUser(userData)
      console.log("✅ User created successfully:", { ...newUser, password: "[HIDDEN]" })
      
      // Test 3: Try to generate verification token
      console.log("Testing verification token generation...")
      const verificationToken = sign(
        { email: body.email, type: "email-verification" },
        process.env.NEXTAUTH_SECRET || "your-super-secret-nextauth-key-change-this-in-production",
        { expiresIn: "24h" }
      )
      console.log("✅ Verification token generated successfully")
      
      // Test 4: Try to save verification
      console.log("Testing verification save...")
      const verificationData = {
        email: body.email,
        token: verificationToken,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
      saveVerification(verificationData)
      console.log("✅ Verification saved successfully")
      
      return NextResponse.json({
        success: true,
        message: "Debug signup successful - all components working",
        userId: newUser.id,
        verificationToken: verificationToken
      })
      
    } catch (userError) {
      console.error("❌ User creation failed:", userError)
      return NextResponse.json({
        error: "User creation failed",
        details: userError instanceof Error ? userError.message : "Unknown error"
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("❌ Debug signup failed:", error)
    return NextResponse.json({
      error: "Debug signup failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}