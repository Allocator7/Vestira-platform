import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== SIMPLE SIGNUP API CALLED ===")
    
    const body = await request.json()
    console.log("Request body:", { ...body, password: "[HIDDEN]" })
    
    // Basic validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }
    
    // Simulate success
    console.log("Simple signup successful")
    
    return NextResponse.json({
      success: true,
      message: "Account created successfully (simple test)",
      userId: "test-user-id"
    })
    
  } catch (error) {
    console.error("Simple signup error:", error)
    return NextResponse.json(
      { 
        error: "Simple signup failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}