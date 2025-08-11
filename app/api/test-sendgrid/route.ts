import { NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"

export async function GET(request: NextRequest) {
  try {
    console.log("=== SENDGRID TEST ===")
    console.log("Environment variables:")
    console.log("- SENDGRID_API_KEY exists:", !!process.env.SENDGRID_API_KEY)
    console.log("- SENDGRID_API_KEY length:", process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0)
    console.log("- SENDGRID_API_KEY starts with SG.:", process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.startsWith('SG.') : false)
    console.log("- SENDGRID_FROM_EMAIL:", process.env.SENDGRID_FROM_EMAIL)
    console.log("=====================")

    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json({
        error: "SendGrid API key not found",
        details: "SENDGRID_API_KEY environment variable is not set"
      }, { status: 500 })
    }

    // Test the API key by trying to set it
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      console.log("✅ SendGrid API key set successfully")
    } catch (error) {
      console.error("❌ Failed to set SendGrid API key:", error)
      return NextResponse.json({
        error: "Invalid SendGrid API key",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 })
    }

    // Test a simple email send (to a test address)
    try {
      const msg = {
        to: 'test@example.com',
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co',
        subject: 'SendGrid Test',
        text: 'This is a test email to verify SendGrid configuration.',
        html: '<p>This is a test email to verify SendGrid configuration.</p>',
      }

      console.log("Attempting to send test email...")
      await sgMail.send(msg)
      console.log("✅ SendGrid test email sent successfully")
      
      return NextResponse.json({
        success: true,
        message: "SendGrid is configured correctly",
        details: {
          apiKeyConfigured: true,
          apiKeyLength: process.env.SENDGRID_API_KEY.length,
          fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co'
        }
      })

    } catch (error) {
      console.error("❌ SendGrid test email failed:", error)
      return NextResponse.json({
        error: "SendGrid test email failed",
        details: error instanceof Error ? error.message : "Unknown error",
        apiKeyConfigured: true,
        apiKeyLength: process.env.SENDGRID_API_KEY.length
      }, { status: 500 })
    }

  } catch (error) {
    console.error("❌ SendGrid test failed:", error)
    return NextResponse.json({
      error: "SendGrid test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}