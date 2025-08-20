import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    method: "GET",
    message: "GET method working",
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    method: "POST",
    message: "POST method working",
    timestamp: new Date().toISOString()
  })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ 
    method: "PUT",
    message: "PUT method working",
    timestamp: new Date().toISOString()
  })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ 
    method: "DELETE",
    message: "DELETE method working",
    timestamp: new Date().toISOString()
  })
}