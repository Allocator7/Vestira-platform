import { NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import sgMail from "@sendgrid/mail"
import { createUser, saveVerification } from "@/lib/database"

interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  organizationType: "allocator" | "manager" | "consultant" | "industry-group"
  organizationName: string
  jobTitle: string
  department?: string
  phoneNumber?: string
  aum?: string
  organizationSize?: string
  hearAboutUs?: string
  specificNeeds?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json()

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.password || !body.organizationType || !body.organizationName || !body.jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Generate verification token
    const verificationToken = sign(
      { email: body.email, type: "email-verification" },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    )

    // Create user in database
    const userData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email.toLowerCase(),
      password: body.password, // Will be hashed in createUser function
      organizationType: body.organizationType,
      organizationName: body.organizationName,
      jobTitle: body.jobTitle,
      department: body.department || "",
      phoneNumber: body.phoneNumber || "",
      aum: body.aum || "",
      organizationSize: body.organizationSize || "",
      hearAboutUs: body.hearAboutUs || "",
      specificNeeds: body.specificNeeds || "",
    }

    // Create user in database
    const newUser = await createUser(userData)
    console.log("User created in database:", { ...newUser, password: "[HIDDEN]" })

    // Save verification token to database
    const verificationData = {
      email: body.email,
      token: verificationToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }
    saveVerification(verificationData)
    
        // Send verification email
    try {
      console.log("Attempting to send verification email to:", body.email)
      console.log("SendGrid API Key configured:", !!process.env.SENDGRID_API_KEY)
      console.log("From email:", process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co')
      
      const emailResult = await sendVerificationEmail(body.email, verificationToken, body.firstName)
      console.log("Email send result:", emailResult)
      
      if (!emailResult) {
        throw new Error("Email sending returned false")
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      console.error("Email error details:", {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : 'No stack trace',
        email: body.email,
        apiKeyExists: !!process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co'
      })

      // Return success but with a warning about email
      return NextResponse.json(
        {
          success: true,
          message: "Account created successfully! Please check your email to verify your account. If you don't receive an email, you can verify your account using the link below.",
          warning: "Email delivery may have failed due to domain verification",
          error: emailError instanceof Error ? emailError.message : "Unknown error",
          verificationUrl: `${process.env.NEXTAUTH_URL || "https://vestira.co"}/api/auth/verify?token=${verificationToken}`,
          manualVerification: true
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Account created successfully. Please check your email to verify your account.",
        userId: userData.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}

async function sendVerificationEmail(email: string, token: string, firstName: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || "https://vestira.co"}/api/auth/verify?token=${token}`
  
  // Check if SendGrid is configured
  const sendGridApiKey = process.env.SENDGRID_API_KEY
  
  console.log("=== SENDGRID DEBUG INFO ===")
  console.log("SendGrid API Key exists:", !!sendGridApiKey)
  console.log("SendGrid API Key length:", sendGridApiKey ? sendGridApiKey.length : 0)
  console.log("SendGrid API Key starts with SG.:", sendGridApiKey ? sendGridApiKey.startsWith('SG.') : false)
  console.log("From email:", process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co')
  console.log("To email:", email)
  console.log("Verification URL:", verificationUrl)
  console.log("==========================")
  
  if (sendGridApiKey) {
    // Production email sending with SendGrid
    try {
      sgMail.setApiKey(sendGridApiKey)
      
      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Vestira Account</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Welcome to Vestira</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Verify your email address</p>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>Thank you for creating your Vestira account! To complete your registration, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #3b82f6;">${verificationUrl}</p>
              
              <p>This verification link will expire in 24 hours for security reasons.</p>
              
              <p>If you didn't create this account, you can safely ignore this email.</p>
              
              <p>Best regards,<br>The Vestira Team</p>
            </div>
            <div class="footer">
              <p>© 2025 Vestira. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `

      // Try to use verified sender email
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co'
      
      const msg = {
        to: email,
        from: fromEmail,
        subject: 'Verify Your Vestira Account',
        html: emailContent,
      }
      
      console.log("Sending email with from address:", fromEmail)

      console.log("Attempting to send email with SendGrid...")
      console.log("Message object:", JSON.stringify(msg, null, 2))
      
      await sgMail.send(msg)
      console.log(`Verification email sent successfully to ${email}`)
      return true
    } catch (error) {
      console.error('SendGrid error details:', error)
      console.error('SendGrid error message:', error instanceof Error ? error.message : 'Unknown error')
      console.error('SendGrid error stack:', error instanceof Error ? error.stack : 'No stack trace')
      throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  } else {
    // SendGrid API key not configured
    console.log(`[ERROR] SendGrid API key not configured`)
    console.log(`[ERROR] Please add SENDGRID_API_KEY to your environment variables`)
    console.log(`[ERROR] Current environment variables:`, {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'EXISTS' : 'MISSING',
      SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
    })
    throw new Error('SendGrid API key not configured')
  }
}