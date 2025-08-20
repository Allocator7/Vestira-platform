# SendGrid Email Setup Guide

## 🚀 Production Email Configuration

This guide will help you set up SendGrid for production email sending on Vestira.

### Step 1: Create SendGrid Account

1. Go to [SendGrid.com](https://sendgrid.com)
2. Click "Start for Free" 
3. Create account with your business email
4. Verify your email address

### Step 2: Get API Key

1. In SendGrid Dashboard, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it: `Vestira Email Verification`
4. Select **"Restricted Access"** → **"Mail Send"**
5. Copy the API key (starts with `SG.`)

### Step 3: Verify Domain (Required for Production)

1. In SendGrid Dashboard, go to **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Enter your domain: `vestira.co`
4. Follow the DNS setup instructions
5. Wait for verification (can take up to 48 hours)

### Step 4: Configure Environment Variables

Add these to your production environment:

```bash
SENDGRID_API_KEY=SG.your-actual-api-key-here
SENDGRID_FROM_EMAIL=noreply@vestira.co
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=https://vestira.co
```

### Step 5: Test Email Sending

The system will now:
- ✅ Send real verification emails
- ✅ Use your branded domain
- ✅ Handle email delivery properly
- ✅ Track email analytics

### Free Tier Limits

SendGrid Free Tier includes:
- 100 emails/day
- Domain authentication
- Email analytics
- Perfect for initial launch

### Production Upgrade

When ready to scale:
- Upgrade to paid plan
- Increase email limits
- Add advanced features

## 🔧 Current Status

The email system is **production-ready** and will work immediately once you:
1. Add your SendGrid API key to environment variables
2. Verify your domain with SendGrid

## 📧 Email Templates

The system includes professional email templates:
- Welcome emails
- Verification emails
- Password reset emails
- All branded with Vestira styling

## 🎯 Next Steps

1. **Get SendGrid API key** (5 minutes)
2. **Add to environment variables** (2 minutes)  
3. **Verify domain** (24-48 hours)
4. **Test email sending** (immediate)

**Your platform will have professional email functionality!** 🚀