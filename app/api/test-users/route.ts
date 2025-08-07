import { NextRequest, NextResponse } from "next/server"
import { getUsers } from "@/lib/database-memory"

export async function GET() {
  try {
    const users = getUsers()
    
    return NextResponse.json({
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        firstName: user.firstName,
        lastName: user.lastName
      }))
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}