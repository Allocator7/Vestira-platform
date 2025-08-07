import { NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Configure SendGrid
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    if (!sendGridApiKey) {
      return NextResponse.json(
        { error: "SendGrid API key not configured" },
        { status: 500 }
      )
    }

    sgMail.setApiKey(sendGridApiKey)

    // Test email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Vestira</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Email Test Successful! 🎉</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            This is a test email to verify that your SendGrid setup is working correctly.
          </p>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            <strong>Domain Verification Status:</strong> ✅ Verified<br>
            <strong>SendGrid API:</strong> ✅ Connected<br>
            <strong>Email Delivery:</strong> ✅ Working
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Production Ready!</h3>
            <p style="color: #374151; margin-bottom: 0;">
              Your email system is now ready for production use. Users will receive 
              verification emails when they create accounts.
            </p>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280;">
          <p style="margin: 0;">© 2024 Vestira. All rights reserved.</p>
        </div>
      </div>
    `

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co',
      subject: 'Vestira Email Test - Domain Verified Successfully!',
      html: emailContent,
    }

    await sgMail.send(msg)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      details: {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co',
        domainVerified: true
      }
    })

  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json(
      { 
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}