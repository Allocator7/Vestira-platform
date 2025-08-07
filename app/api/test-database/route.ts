import { NextRequest, NextResponse } from "next/server"
import { getUsers, createUser, findUserByEmail } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("=== DATABASE TEST ===")
    
    // Test 1: Check if database files exist
    const fs = require('fs')
    const path = require('path')
    const DB_PATH = path.join(process.cwd(), 'data', 'users.json')
    const VERIFICATIONS_PATH = path.join(process.cwd(), 'data', 'verifications.json')
    
    console.log("Database paths:")
    console.log("- Users DB:", DB_PATH)
    console.log("- Verifications DB:", VERIFICATIONS_PATH)
    console.log("- Data directory exists:", fs.existsSync(path.dirname(DB_PATH)))
    console.log("- Users file exists:", fs.existsSync(DB_PATH))
    console.log("- Verifications file exists:", fs.existsSync(VERIFICATIONS_PATH))
    
    // Test 2: Try to read users
    const users = getUsers()
    console.log("Current users in database:", users.length)
    console.log("Users:", users.map(u => ({ id: u.id, email: u.email, emailVerified: u.emailVerified })))
    
    // Test 3: Try to create a test user
    try {
      const testUser = await createUser({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        organizationType: "allocator",
        organizationName: "Test Org",
        jobTitle: "Test Job"
      })
      console.log("Test user created:", { ...testUser, password: "[HIDDEN]" })
      
      // Test 4: Try to find the test user
      const foundUser = findUserByEmail("test@example.com")
      console.log("Test user found:", foundUser ? "Yes" : "No")
      
      return NextResponse.json({
        success: true,
        message: "Database test completed",
        details: {
          dataDirExists: fs.existsSync(path.dirname(DB_PATH)),
          usersFileExists: fs.existsSync(DB_PATH),
          verificationsFileExists: fs.existsSync(VERIFICATIONS_PATH),
          currentUsersCount: users.length,
          testUserCreated: !!testUser,
          testUserFound: !!foundUser
        }
      })
      
    } catch (error) {
      console.error("Error creating test user:", error)
      return NextResponse.json({
        error: "Failed to create test user",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json({
      error: "Database test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}