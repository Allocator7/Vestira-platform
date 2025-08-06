import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import sgMail from "@sendgrid/mail"

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

    // Hash password
    const hashedPassword = await hash(body.password, 12)

    // Generate verification token
    const verificationToken = sign(
      { email: body.email, type: "email-verification" },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    )

    // Create user data
    const userData = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email.toLowerCase(),
      password: hashedPassword,
      organizationType: body.organizationType,
      organizationName: body.organizationName,
      jobTitle: body.jobTitle,
      department: body.department || "",
      phoneNumber: body.phoneNumber || "",
      aum: body.aum || "",
      organizationSize: body.organizationSize || "",
      hearAboutUs: body.hearAboutUs || "",
      specificNeeds: body.specificNeeds || "",
      emailVerified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store user data (in production, this would be saved to a database)
    // For demo purposes, we'll store in a global variable or use a simple file-based storage
    console.log("User created:", { ...userData, password: "[HIDDEN]" })
    
    // In production, you would save to a database here
    // For now, we'll simulate successful storage

    // Send verification email
    try {
      await sendVerificationEmail(body.email, verificationToken, body.firstName)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      return NextResponse.json(
        { error: "Account created but verification email failed to send. Please contact support." },
        { status: 500 }
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
  // Initialize SendGrid with API key
  const sendGridApiKey = process.env.SENDGRID_API_KEY
  if (!sendGridApiKey) {
    throw new Error("SendGrid API key not configured")
  }
  
  sgMail.setApiKey(sendGridApiKey)
  
  const verificationUrl = `${process.env.NEXTAUTH_URL || "https://vestira.co"}/api/auth/verify?token=${token}`
  
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

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@vestira.co',
    subject: 'Verify Your Vestira Account',
    html: emailContent,
  }

  try {
    await sgMail.send(msg)
    console.log(`Verification email sent successfully to ${email}`)
    return true
  } catch (error) {
    console.error('SendGrid error:', error)
    throw new Error('Failed to send verification email')
  }
}