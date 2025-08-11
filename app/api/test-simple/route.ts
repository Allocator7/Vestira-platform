import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Simple API test working" })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ 
      message: "Simple POST test working",
      receivedData: body 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Simple POST test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}