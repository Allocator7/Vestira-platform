import { NextRequest, NextResponse } from "next/server"
import { hash, compare } from "bcryptjs"

export async function GET() {
  try {
    const password = "password123"
    const hashedPassword = await hash(password, 12)
    
    const isMatch = await compare(password, hashedPassword)
    const isMatchOld = await compare(password, "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i6e")
    
    return NextResponse.json({
      password,
      hashedPassword,
      isMatch,
      isMatchOld,
      oldHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i6e"
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}