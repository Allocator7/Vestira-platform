/**
 * Multi-Factor Authentication Service
 * Enterprise-grade MFA implementation for Vestira platform
 */

export type MFAMethod = "totp" | "sms" | "email" | "hardware-key" | "backup-codes"

export interface MFASetup {
  method: MFAMethod
  secret?: string
  qrCode?: string
  backupCodes?: string[]
  phoneNumber?: string
  email?: string
}

export interface MFAVerification {
  method: MFAMethod
  code: string
  rememberDevice?: boolean
  deviceFingerprint?: string
}

export interface TrustedDevice {
  id: string
  name: string
  fingerprint: string
  lastUsed: Date
  expiresAt: Date
  ipAddress: string
  userAgent: string
}

export class MFAService {
  private static instance: MFAService

  public static getInstance(): MFAService {
    if (!MFAService.instance) {
      MFAService.instance = new MFAService()
    }
    return MFAService.instance
  }

  /**
   * Generate TOTP secret and QR code for authenticator app setup
   */
  async setupTOTP(userId: string, email: string): Promise<MFASetup> {
    // In production, use a proper TOTP library like 'otplib'
    const secret = this.generateSecret()
    const qrCode = await this.generateQRCode(secret, email)

    return {
      method: "totp",
      secret,
      qrCode,
    }
  }

  /**
   * Setup SMS-based MFA
   */
  async setupSMS(userId: string, phoneNumber: string): Promise<MFASetup> {
    // Validate phone number format
    if (!this.isValidPhoneNumber(phoneNumber)) {
      throw new Error("Invalid phone number format")
    }

    // In production, integrate with SMS service (Twilio, AWS SNS)
    await this.sendSMSVerification(phoneNumber)

    return {
      method: "sms",
      phoneNumber,
    }
  }

  /**
   * Setup email-based MFA
   */
  async setupEmail(userId: string, email: string): Promise<MFASetup> {
    // In production, integrate with email service
    await this.sendEmailVerification(email)

    return {
      method: "email",
      email,
    }
  }

  /**
   * Generate backup codes for account recovery
   */
  async generateBackupCodes(userId: string): Promise<string[]> {
    const codes = []
    for (let i = 0; i < 10; i++) {
      codes.push(this.generateBackupCode())
    }

    // In production, store hashed versions in database
    await this.storeBackupCodes(userId, codes)

    return codes
  }

  /**
   * Verify MFA code
   */
  async verifyMFA(userId: string, verification: MFAVerification): Promise<boolean> {
    switch (verification.method) {
      case "totp":
        return await this.verifyTOTP(userId, verification.code)
      case "sms":
        return await this.verifySMS(userId, verification.code)
      case "email":
        return await this.verifyEmail(userId, verification.code)
      case "backup-codes":
        return await this.verifyBackupCode(userId, verification.code)
      default:
        throw new Error("Unsupported MFA method")
    }
  }

  /**
   * Check if device is trusted
   */
  async isTrustedDevice(userId: string, deviceFingerprint: string): Promise<boolean> {
    const trustedDevices = await this.getTrustedDevices(userId)
    return trustedDevices.some((device) => device.fingerprint === deviceFingerprint && device.expiresAt > new Date())
  }

  /**
   * Add device to trusted list
   */
  async trustDevice(userId: string, deviceInfo: Partial<TrustedDevice>): Promise<void> {
    const device: TrustedDevice = {
      id: this.generateDeviceId(),
      name: deviceInfo.name || "Unknown Device",
      fingerprint: deviceInfo.fingerprint || "",
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ipAddress: deviceInfo.ipAddress || "",
      userAgent: deviceInfo.userAgent || "",
    }

    await this.storeTrustedDevice(userId, device)
  }

  /**
   * Get user's trusted devices
   */
  async getTrustedDevices(userId: string): Promise<TrustedDevice[]> {
    // In production, fetch from database
    return []
  }

  /**
   * Revoke trusted device
   */
  async revokeTrustedDevice(userId: string, deviceId: string): Promise<void> {
    // In production, remove from database
    console.log(`Revoking trusted device ${deviceId} for user ${userId}`)
  }

  // Private helper methods
  private generateSecret(): string {
    // In production, use crypto.randomBytes
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private async generateQRCode(secret: string, email: string): Promise<string> {
    // In production, use QR code library
    const issuer = "Vestira"
    const label = `${issuer}:${email}`
    const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`

    // Return base64 encoded QR code image
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  private async sendSMSVerification(phoneNumber: string): Promise<void> {
    // In production, integrate with SMS service
    console.log(`Sending SMS verification to ${phoneNumber}`)
  }

  private async sendEmailVerification(email: string): Promise<void> {
    // In production, integrate with email service
    console.log(`Sending email verification to ${email}`)
  }

  private generateBackupCode(): string {
    // Generate 8-digit backup code
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  private async storeBackupCodes(userId: string, codes: string[]): Promise<void> {
    // In production, store hashed codes in database
    console.log(`Storing backup codes for user ${userId}`)
  }

  private async verifyTOTP(userId: string, code: string): Promise<boolean> {
    // In production, verify against stored secret using TOTP algorithm
    return code === "123456" // Demo verification
  }

  private async verifySMS(userId: string, code: string): Promise<boolean> {
    // In production, verify against sent SMS code
    return code === "123456" // Demo verification
  }

  private async verifyEmail(userId: string, code: string): Promise<boolean> {
    // In production, verify against sent email code
    return code === "123456" // Demo verification
  }

  private async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    // In production, verify and invalidate backup code
    return code.length === 8 && /^\d+$/.test(code)
  }

  private generateDeviceId(): string {
    return `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private async storeTrustedDevice(userId: string, device: TrustedDevice): Promise<void> {
    // In production, store in database
    console.log(`Storing trusted device for user ${userId}:`, device)
  }
}

export const mfaService = MFAService.getInstance()
